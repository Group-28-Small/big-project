
import React from 'react';
import { StyleSheet, Text, Vibration, View, ToastAndroid, Button } from 'react-native';
import { backend_address, setUserActiveTask, userStopTask, userStartTask, MIN_TASK_TIME } from 'big-project-common';
import AppStyles from '../styles';
import { Searchbar, Snackbar } from 'react-native-paper';
import { AuthCheck, useFirestore, useFirestoreCollectionData, useFirestoreDocData, useUser, useAuth, useFirebaseApp } from 'reactfire';
import FloatingActionButton from '../components/FloatingActionButton';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import Moment from 'react-moment';
import { TrackTaskButton } from '../components/TrackTaskButton'
import LoadingScreen from './loadingscreen';
import { back } from 'react-native/Libraries/Animated/src/Easing';


export const IndexPage = (props) => {
    return (
        <AuthCheck fallback={<LoadingScreen />}>
            <MainTaskList {...props} />
        </AuthCheck>
    )
}
const MainTaskList = props => {
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
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            const url = backend_address(idToken + "/" + text)
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
        if (searchText !== '') {
            setSearchText(searchText)
        }
    }
    var tasks = [];
    var no_tasks_msg = "You don't have any tasks!"
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
            <ScrollView>
                {tasks != undefined && tasks.length != 0 ?
                    <>
                        {
                            tasks.map((item) => {
                                var taskClasses = [styles.tasks,]
                                if (item.id === active_task?.id) {
                                    taskClasses.push(styles.activeTask)
                                }
                                return (
                                    <TouchableOpacity key={item.id} onLongPress={() => editTask(item)} onPress={() => setActiveTask(item.id)}>
                                        <Text style={taskClasses} >{item.name}{' \t'}{item.duration + '/' + item.estimated_time}{' hrs \t'}{item.percentage}{'% \n'}{<Moment format="DD MMMM YYYY" date={item.due_date} element={Text} unix />}</Text>
                                    </TouchableOpacity>
                                );
                            })
                        }
                    </> : <Text>{no_tasks_msg}</Text>}
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
        borderColor: '#05FF1E',
        borderWidth: 4,
        margin: 2,
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

