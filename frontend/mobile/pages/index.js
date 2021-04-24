
import React from 'react';
import { StyleSheet, Text, Vibration, View, ToastAndroid, Button } from 'react-native';
import { backend_address, setUserActiveTask, userStopTask, userStartTask, MIN_TASK_TIME, AppTheme, search_url } from 'big-project-common';
import AppStyles from '../styles';
import { Searchbar, Snackbar, Caption } from 'react-native-paper';
import { AuthCheck, useFirestore, useFirestoreCollectionData, useFirestoreDocData, useUser, useAuth, useFirebaseApp } from 'reactfire';
import FloatingActionButton from '../components/FloatingActionButton';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import Moment from 'react-moment';
import { TrackTaskButton } from '../components/TrackTaskButton'
import TaskElement from '../components/TaskElement';
import LoadingScreen from './loadingscreen';
import { back } from 'react-native/Libraries/Animated/src/Easing';
import { TaskEditor } from './edit_task'
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
    var no_tasks_msg = "You don't have any tasks!\nCreate your first one by clicking the + button below!"
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
    return (
        <View style={AppStyles.container}>
            <Searchbar placeholder="Search" value={searchText} onChangeText={setSearchText} />
            <ScrollView style={{width: '100%'}}>
                {tasks != undefined && tasks.length != 0 ?
                <>
                    {
                        tasks.map((item) => {
                            var taskClasses = [styles.tasks,]
                            if (item.id === active_task?.id) {
                                taskClasses.push(styles.activeTask)
                            }
                            
                            return (
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
                                    containerStyle={taskClasses}
                                    active={item.id === active_task?.id}
                                    style={taskClasses} />
                            )
                        })
                    }
                    </> : <Caption>There's nothing here...</Caption>
                }              
                {/* {tasks != undefined && tasks.length != 0 ?
                    <>
                        {
                            tasks.map((item) => {
                                var pct = item.estimated_hour ? (item.percentage + (item.duration / ((item.estimated_hour * 60) + item.estimated_minute))) : (item.percentage + (item.duration / item.estimated_minute))
                                var taskClasses = [styles.tasks,]
                                if (item.id === active_task?.id) {
                                    taskClasses.push(styles.activeTask)
                                }
                                if(tasks.length === 1){
                                    if(item.duration != 0){
                                        return (
                                            <View>
                                                <TouchableOpacity key={item.id} onLongPress={() => editTask(item)} onPress={() => setActiveTask(item.id)}>
                                                    <Text style={taskClasses} >{item.name}{' \t'}{item.duration === 0 ? 'no time logged' : moment.duration(item.duration * 1000).humanize()}{item.has_estimated_time ? '/' + item.estimated_hour + ' hrs ' + item.estimated_minute + ' min\t' : '\t'}{item.track_progress ? (' ' + Math.trunc(pct)  + '% \n') : '\n'}{item.has_due_date ? <Moment format="DD MMMM YYYY" date={item.due_date} element={Text} unix /> : '' }</Text>
                                                </TouchableOpacity>
                                                <Text style={{textAlign: 'center'}}>You can view your task history by {'\n'} clicking on the 'History' button.</Text>
                                            </View>
                                        );
                                    }
                                    else if(userDetails?.is_tracking_task){
                                        return (
                                            <View>
                                                <TouchableOpacity key={item.id} onLongPress={() => editTask(item)} onPress={() => setActiveTask(item.id)}>
                                                    <Text style={taskClasses} >{item.name}{' \t'}{item.duration === 0 ? 'no time logged' : moment.duration(item.duration * 1000).humanize()}{item.has_estimated_time ? '/' + item.estimated_hour + ' hrs ' + item.estimated_minute + ' min\t' : '\t'}{item.track_progress ? (' ' + Math.trunc(pct)  + '% \n') : '\n'}{item.has_due_date ? <Moment format="DD MMMM YYYY" date={item.due_date} element={Text} unix /> : '' }</Text>
                                                </TouchableOpacity>
                                                <Text style={{textAlign: 'center'}}>Click on the 'Stop Tracking' Button {'\n'} below to finish tracking your task.</Text>
                                            </View>
                                        );
                                    }
                                    else if(item.id === active_task?.id){
                                        return (
                                            <View>
                                                <TouchableOpacity key={item.id} onLongPress={() => editTask(item)} onPress={() => setActiveTask(item.id)}>
                                                    <Text style={taskClasses} >{item.name}{' \t'}{item.duration === 0 ? 'no time logged' : moment.duration(item.duration * 1000).humanize()}{item.has_estimated_time ? '/' + item.estimated_hour + ' hrs ' + item.estimated_minute + ' min\t' : '\t'}{item.track_progress ? (' ' + Math.trunc(pct)  + '% \n') : '\n'}{item.has_due_date ? <Moment format="DD MMMM YYYY" date={item.due_date} element={Text} unix /> : '' }</Text>
                                                </TouchableOpacity>
                                                <Text style={{textAlign: 'center'}}>Click on the 'Start Tracking' Button {'\n'} below to begin tracking your task!</Text>
                                            </View>
                                        );
                                    } else{
                                        console.log('else');
                                        return(
                                            <View>
                                                <TouchableOpacity key={item.id} onLongPress={() => editTask(item)} onPress={() => setActiveTask(item.id)}>
                                                    <Text style={taskClasses} >{item.name}{' \t'}{item.duration === 0 ? 'no time logged' : moment.duration(item.duration * 1000).humanize()}{item.has_estimated_time ? '/' + item.estimated_hour + ' hrs ' + item.estimated_minute + ' min\t' : '\t'}{item.track_progress ? (' ' + Math.trunc(pct)  + '% \n') : '\n'}{item.has_due_date ? <Moment format="DD MMMM YYYY" date={item.due_date} element={Text} unix /> : '' }</Text>
                                                </TouchableOpacity>
                                                <Text style={{textAlign: 'center'}}>Click on the task to select it. {'\n'}Hold the task to edit or delete it.</Text>
                                            </View>
                                        )
                                    }
                                }
                                else{
                                    return (
                                        <TouchableOpacity key={item.id} onLongPress={() => editTask(item)} onPress={() => setActiveTask(item.id)}>
                                            <Text style={taskClasses} >{item.name}{' \t'}{item.duration === 0 ? 'no time logged' : moment.duration(item.duration * 1000).humanize()}{item.has_estimated_time ? '/' + item.estimated_hour + ' hrs ' + item.estimated_minute + ' min\t' : '\t'}{item.track_progress ? (' ' + Math.trunc(pct)  + '% \n') : '\n'}{item.has_due_date ? <Moment format="DD MMMM YYYY" date={item.due_date} element={Text} unix /> : '' }</Text>
                                        </TouchableOpacity>
                                    );
                                }
                            })
                        }
                    </> : <Text>{no_tasks_msg}</Text>} */}
            </ScrollView>
            {active_task != undefined && (
                <TrackTaskButton onPress={trackTaskPressed} task={active_task} isTracking={!!(userDetails?.is_tracking_task)} navigation={props.navigation} />
            )}
            <Snackbar style={styles.iosSnackbar}
                visible={visible}
                onDismiss={dismissSnackbar}
                duration={Snackbar.DURATION_SHORT}
                theme={{ colors: { surface: 'black' } }}>
                Tracked task has been switched
                </Snackbar>
            <FloatingActionButton style={styles.floatinBtn} onPress={() => addTask()} />
        </View>
    );
}
const styles = StyleSheet.create({
    floatinBtn: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        elevation: 5
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

