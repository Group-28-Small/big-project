
import React from 'react';
import { StyleSheet, Text, Vibration, View } from 'react-native';
import { backend_address, setUserActiveTask, userStopTask, userStartTask } from 'big-project-common';
import AppStyles from '../styles';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData, useUser } from 'reactfire';
import FloatingActionButton from '../components/FloatingActionButton';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import Moment from 'react-moment';
import { TrackTaskButton } from '../components/TrackTaskButton'

export const IndexPage = props => {
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const { data: userDetails } = useFirestoreDocData(userDetailsRef);
    const { data: tasks } = useFirestoreCollectionData(db.collection("tasks").where("user", "==", userDetailsRef), {
        idField: 'id'
    });
    const addTask = () => {
        props.navigation.navigate('New Task');
    }
    const editTask = item => {
        Haptics.selectionAsync();
        props.navigation.navigate('Edit Task', { item_id: item.id });
    }
    const active_task = userDetails.active_task;
    const setActiveTask = item_id => {
        setUserActiveTask(userDetailsRef, item_id, db);
    }
    const trackTaskPressed = () => {
        // TODO: handle return values from these
        if (userDetails.is_tracking_task) {
            userStopTask(db, active_task, userDetails, userDetailsRef);
        } else {
            userStartTask(db, userDetailsRef);

        }
    }

    return (
        <View style={AppStyles.container}>
            <ScrollView>
                {tasks ? tasks.map((item) => {
                    var taskClasses = [styles.tasks,]
                    if (item.id === active_task?.id) {
                        taskClasses.push(styles.activeTask)
                    }
                return (
                    <TouchableOpacity key={item.id} onLongPress={() => editTask(item)} onPress={() => setActiveTask(item.id)}>
                        <Text style={taskClasses} >{item.name}{' \t'}{item.estimated_time}{' hrs \t'}{item.percentage}{'% \t'}{<Moment format="DD MMMM YYYY" date={item.due_date} element={Text} unix />}</Text>
                    </TouchableOpacity>
                );
            }) : <Text>No data</Text>}
            </ScrollView>
            <TrackTaskButton onPress={trackTaskPressed} task={active_task} isTracking={!!userDetails.is_tracking_task} />
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
    tasks:{
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
    }

});

