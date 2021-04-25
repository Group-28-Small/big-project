
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppStyles from '../styles';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import { ScrollView } from 'react-native-gesture-handler';
import LoadingScreen from './loadingscreen';
import * as Haptics from 'expo-haptics';

export const CompletedTasksPage = props => {
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
        var query = db.collection("tasks").where("user", "==", userDetailsRef);
        const { data: tasks } = useFirestoreCollectionData(query, {
            idField: 'id'
        });
    const unFinishedTask = item => {
        Haptics.selectionAsync();
        console.log('Complete!')
        db.collection('tasks').doc(item.id).set({
            'done': false,
            'duration': item.estimated_time //not sure how to revert this 
        }, { merge: true })
    }
    var taskDict = {}
    if (tasks) {
        tasks.forEach((t) => {
            taskDict['tasks/' + t.id] = t
        });
    }
    if (!tasks) {
        return (
            <LoadingScreen />
        )
    }
    const done_tasks = []
    if (tasks) {
        tasks.forEach((task) => {
            if (task?.done) {
                done_tasks.push(task)
            }
        });
    }
    return (
        <View style={AppStyles.container}>
            <ScrollView style={{width: '100%'}}>
                {done_tasks ? done_tasks.map((item) => {
                    var taskClasses = [styles.tasks]
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
                            notDone={() => unFinishedTask(item)}
                            containerStyle={taskClasses}
                            active={item.id === userDetailsRef.active_task?.id}
                            note={item.note}
                            isDone={item.done}
                            style={taskClasses} />
                    );
                }) : <Text>You haven't tracked any tasks!</Text>}
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    tasks: {
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'black',
        color: 'black',
        fontSize: 15,
        textAlign: 'center',
        margin: 4,
    },
});

