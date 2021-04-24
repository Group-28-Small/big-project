
import React from 'react';
import { StyleSheet, View, ToastAndroid } from 'react-native';
import { backend_address, setUserActiveTask, userStopTask, userStartTask, MIN_TASK_TIME, AppTheme, search_url } from 'big-project-common';
import AppStyles from '../styles';
import { Searchbar, Snackbar, Caption, FAB } from 'react-native-paper';
import { AuthCheck, useFirestore, useFirestoreCollectionData, useFirestoreDocData, useUser, useFirebaseApp } from 'reactfire';
import FloatingActionButton from '../components/FloatingActionButton';
import { ScrollView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { TrackTaskButton } from '../components/TrackTaskButton'
import TaskElement from '../components/TaskElement';
import LoadingScreen from './loadingscreen';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export const IndexPage = (props) => {
    return (
        <AuthCheck fallback={<LoadingScreen />}>
            <MainTaskList {...props} />
        </AuthCheck>
    )
}
const MainTaskList = props => {
    const moment = require("moment")
    const [visible, setVisible] = React.useState(false);
    const onToggleSnackBar = () => setVisible(true);
    const onDismissSnackBar = () => setVisible(false);
    const [searchText, _setSearchText] = React.useState("");
    const [searchedTasks, setSearchedTasks] = React.useState([])
    const firebase = useFirebaseApp()
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const { data: userDetails } = useFirestoreDocData(userDetailsRef ?? db.collection('users').doc());
    var query = db.collection("tasks").where("user", "==", userDetailsRef);
    const { data: firebase_tasks } = useFirestoreCollectionData(query, {
        idField: 'id'
    });
    const { data: sessions } = useFirestoreCollectionData(db.collection("sessions").where("user", "==", userDetailsRef).orderBy("start", "desc").orderBy("end", "desc")
    , {
        idField: 'id'
    });
    const [tasksCache, setTasksCache] = React.useState([])
    const dismissSnackbar = () => {
        onDismissSnackBar()
    }
    const addTask = () => {
        props.navigation.navigate('New Task');
    }
    const editTask = item => {
        Haptics.selectionAsync();
        props.navigation.navigate('Edit Task', { item_id: item.id });
    }
    const finishedTask = item => {
        Haptics.selectionAsync();
        console.log('Complete!')
        db.collection('tasks').doc(item.id).set({
            'done': true,
            'duration': item.estimated_time
        }, { merge: true })
        if (Platform.OS === 'android') {
            ToastAndroid.show("Task has been moved to the 'Completed Tasks' page.", ToastAndroid.SHORT);
        }
        if(userDetails?.active_task !== undefined && item.id === userDetails?.active_task.id){
            const firebase = require('firebase')
            userStopTask(db, userDetails?.active_task, userDetails, userDetailsRef);
            userDetailsRef.set({ 'active_task': firebase.firestore.FieldValue.delete()}, { merge: true })
        }
    }
    const setSearchText = (text) => {
        _setSearchText(text)
        if (text === '') {
            setSearchedTasks(firebase_tasks);
            return
        }
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            const url = backend_address(search_url + "/" + idToken + "/" + text)
            console.log(url);
            fetch(url)
                .then(response => response.json())
                .then(data => setSearchedTasks(data)).catch((error) => {
                    // do nothing
                });
        }).catch((error) => {
            // this should never happen
        })
    }
    if (firebase_tasks !== tasksCache) {
        console.log("update detected")
        setTasksCache(firebase_tasks)
        setSearchText(searchText)
    }
    var tasks = [];
    var no_tasks_msg = "You don't have any active tasks!\nCreate your first one by clicking the + button below!"
    if (searchText === "") {
        tasks = firebase_tasks;
    } else {
        tasks = searchedTasks
    }
    const active_task = userDetails?.active_task;
    const setActiveTask = item_id => {
        setUserActiveTask(userDetails, userDetailsRef, item_id, db, active_task);
        if ((Date.now() / 1000) - userDetails.last_task_set_time < MIN_TASK_TIME && userDetails?.is_tracking_task) {
            if (Platform.OS === 'android') {
                ToastAndroid.show("Tracked task has been switched", ToastAndroid.SHORT);
            } else if (Platform.OS === 'ios') {
                onToggleSnackBar()
            }
        }
    }
    const trackTaskPressed = () => {
        // TODO: handle return values from these
        if (userDetails?.is_tracking_task) {
            userStopTask(db, active_task, userDetails, userDetailsRef);
        } else {
            userStartTask(db, userDetailsRef);
        }
    }

    const done_tasks = []
    const not_done_tasks = []
    if (tasks) {
        tasks.forEach((task) => {
            if (!task?.done) {
                not_done_tasks.push(task)
            } else{
                done_tasks.push(task)
            }
        });
    }

    const [durations,setDurations] = useState({})
    useEffect(() => {
        // firebase tasks changed - fetch done tasks again
        console.log("data changed");
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            tasks.forEach((task) => {
                const url = backend_address(total_url + "/" + idToken + "/" + task.id)
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        // so it turns out that setState callbacks can accept a function that recieves the old state
                        // if we update it from within, it's guaranteed to happen atomically
                        setDurations((oldDurations) => {
                            return { ...oldDurations, [task.id]: data.total_time }
                        })
                    }).catch((error) => {
                        console.log(error);
                    });
            });
        }).catch((error) => {
            // this should never happen
        })
    }, [tasks])

    return (
        <View style={AppStyles.container}>
            <Searchbar placeholder="Search" value={searchText} onChangeText={setSearchText} />
            <ScrollView style={{width: '100%'}}>
            {not_done_tasks != undefined && not_done_tasks.length != 0 ?
                <>
                {
                    not_done_tasks.map((item) => {
                        var taskClasses = [styles.tasks,]
                            if (item.id === active_task?.id) {
                                taskClasses.push(styles.activeTask)
                            }
                    ///I'm sure there's a better way to do this than to repaste the same taskelement 5 times, but oops
                             if(tasks.length === 1){
                                if(item.duration != 0){
                                    return (
                                        <View>
                                        <TaskElement 
                                            key={item.id} 
                                            name={item.name} 
                                            duration={item.duration} 
                                            has_estimated_time={item.has_estimated_time} 
                                            estimated_time={item.estimated_time} 
                                            has_due_date={item.has_due_date} 
                                            due_date={item.due_date} 
                                            setActive={() => { Haptics.selectionAsync(); setActiveTask(item.id) }} 
                                            edit={() => editTask(item)}
                                            done={() => finishedTask(item)}
                                            containerStyle={taskClasses}
                                            active={item.id === active_task?.id}
                                            note={item.note}
                                            style={taskClasses} />
                                            <Caption style={{textAlign: 'center'}}>You can view your task history by {'\n'} clicking on the 'Session History' button.</Caption>
                                            </View>
                                    )
                                } else if(userDetails?.is_tracking_task){
                                    return (
                                        <View>
                                        <TaskElement 
                                            key={item.id} 
                                            name={item.name} 
                                            duration={item.duration} 
                                            has_estimated_time={item.has_estimated_time} 
                                            estimated_time={item.estimated_time} 
                                            has_due_date={item.has_due_date} 
                                            due_date={item.due_date} 
                                            setActive={() => { Haptics.selectionAsync(); setActiveTask(item.id) }} 
                                            edit={() => editTask(item)}
                                            done={() => finishedTask(item)}
                                            containerStyle={taskClasses}
                                            active={item.id === active_task?.id}
                                            note={item.note}
                                            style={taskClasses} />
                                            <Caption style={{textAlign: 'center'}}>Click on the 'Stop Tracking' Button {'\n'} below to finish tracking your task.</Caption>
                                            </View>
                                    )
                                } else if(item.id === active_task?.id){
                                    return (
                                        <View>
                                        <TaskElement 
                                            key={item.id} 
                                            name={item.name} 
                                            duration={item.duration} 
                                            has_estimated_time={item.has_estimated_time} 
                                            estimated_time={item.estimated_time} 
                                            has_due_date={item.has_due_date} 
                                            due_date={item.due_date} 
                                            setActive={() => { Haptics.selectionAsync(); setActiveTask(item.id) }} 
                                            edit={() => editTask(item)}
                                            done={() => finishedTask(item)}
                                            containerStyle={taskClasses}
                                            active={item.id === active_task?.id}
                                            note={item.note}
                                            style={taskClasses} />
                                            <Caption style={{textAlign: 'center'}}>Click on the 'Start Tracking' Button {'\n'} below to begin tracking your task!</Caption>
                                            </View>
                                    )
                                } else{
                                    return (
                                        <View>
                                        <TaskElement 
                                            key={item.id} 
                                            name={item.name} 
                                            duration={item.duration} 
                                            has_estimated_time={item.has_estimated_time} 
                                            estimated_time={item.estimated_time} 
                                            has_due_date={item.has_due_date} 
                                            due_date={item.due_date} 
                                            setActive={() => { Haptics.selectionAsync(); setActiveTask(item.id) }} 
                                            edit={() => editTask(item)}
                                            done={() => finishedTask(item)}
                                            containerStyle={taskClasses}
                                            active={item.id === active_task?.id}
                                            note={item.note}
                                            style={taskClasses} />
                                            <Caption style={{textAlign: 'center'}}>Click on the task to expand it. {'\n'}Hold the task to select it.</Caption>
                                            </View>
                                    )
                                }
                            } else{
                                return(
                                    <TaskElement 
                                        key={item.id} 
                                        name={item.name} 
                                        duration={item.duration} 
                                        has_estimated_time={item.has_estimated_time} 
                                        estimated_time={item.estimated_time} 
                                        has_due_date={item.has_due_date} 
                                        due_date={item.due_date} 
                                        setActive={() => { Haptics.selectionAsync(); setActiveTask(item.id) }} 
                                        edit={() => editTask(item)}
                                        done={() => finishedTask(item)}
                                        containerStyle={taskClasses}
                                        active={item.id === active_task?.id}
                                        note={item.note}
                                        style={taskClasses} />
                                )
                            }
                        }) 
                    }
                </> : <Caption style={{textAlign: 'center'}}>{no_tasks_msg}</Caption>
            }              
            </ScrollView>
                {/* <TrackTaskButton onPress={trackTaskPressed} completedTasks={done_tasks.length === 0} sessions={sessions != undefined && sessions.length === 0} task={active_task} isTracking={!!(userDetails?.is_tracking_task)} navigation={props.navigation} /> */}
            <Snackbar style={styles.iosSnackbar}
                visible={visible}
                onDismiss={dismissSnackbar}
                duration={Snackbar.DURATION_SHORT}
                theme={{ colors: { surface: 'black' } }}>
                Tracked task has been switched
                </Snackbar>
            <FAB style={styles.floatinBtn} onPress={() => addTask()} icon='plus' />
            {
                (userDetails) &&
                <FAB style={styles.track} onPress={trackTaskPressed} icon={userDetails.is_tracking_task ? 'pause' : 'play'} />
            }
        </View>
    );
}
const styles = StyleSheet.create({
    floatinBtn: {
        position: 'absolute',
        bottom: 40,
        right: 16,
        elevation: 5,
        backgroundColor: AppTheme.primaryColor,
    },
    track: {
        position: 'absolute',
        bottom: 40,
        right: 170,
        elevation: 5,
        backgroundColor: AppTheme.primaryColor,
    },
    tasks: {
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'black',
        color: 'black',
        fontSize: 15,
        textAlign: 'center',
        margin: 4,
    },
    activeTask: {
        margin: 2,
        backgroundColor: AppTheme.primaryLightColor,
        borderColor: 'green',
        borderWidth: 20,
    },
    iosSnackbar: {
        backgroundColor: 'white',
        width: 250,
        position: 'absolute',
        bottom: 0,
        elevation: 1,
        alignSelf: 'center'
    }
});

