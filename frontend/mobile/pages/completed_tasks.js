
import React from 'react';
import { StyleSheet, Text, View, ToastAndroid } from 'react-native';
import AppStyles from '../styles';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import { ScrollView } from 'react-native-gesture-handler';
import LoadingScreen from './loadingscreen';
import * as Haptics from 'expo-haptics';
import { Snackbar } from 'react-native-paper';

export const CompletedTasksPage = props => {
    const [visible, setVisible] = React.useState(false);
    const onDismissSnackBar = () => setVisible(false);
    const onToggleSnackBar = () => setVisible(true);
    const dismissSnackbar = () => {
        onDismissSnackBar()
    }

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
        if (Platform.OS === 'android') {
            ToastAndroid.show("Task has been returned to the home screen", ToastAndroid.SHORT);
        } else if (Platform.OS === 'ios') {
            onToggleSnackBar()
        }
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
                            notDone={() => unFinishedTask(item)}
                            containerStyle={taskClasses}
                            note={item.note}
                            isDone={item.done}
                            style={taskClasses} />
                    );
                }) : <Caption style={{textAlign: 'center'}}>You haven't completed any tasks!</Caption>}
            </ScrollView>
            <Snackbar style={styles.iosSnackbar}
                visible={visible}
                onDismiss={dismissSnackbar}
                duration={Snackbar.DURATION_SHORT}
                theme={{ colors: { surface: 'black' } }}>
                Task has been returned to the home screen
                </Snackbar>
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
    iosSnackbar: {
        backgroundColor: 'white',
        width: 320,
        position: 'absolute',
        bottom: 0,
        elevation: 1,
        alignSelf: 'center',
    }
});

