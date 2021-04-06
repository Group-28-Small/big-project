
import React from 'react';
import { StyleSheet, Text, Vibration, View } from 'react-native';
import { backend_address, setUserActiveTask } from 'big-project-common';
import AppStyles from '../styles';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData, useUser } from 'reactfire';
import FloatingActionButton from '../components/FloatingActionButton';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import LoadingScreen from './loadingscreen';
import * as Haptics from 'expo-haptics';
import Moment from 'react-moment';

export const IndexPage = props => {
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const { data: userDetails } = useFirestoreDocData(userDetailsRef);
    const { data: tasks } = useFirestoreCollectionData(db.collection("tasks").where("user", "==", userDetailsRef), {
        idField: 'id'
    });
    const activeTask = user.active_task ?? null;
    const addTask = () => {
        props.navigation.navigate('New Task');
    }
    const editTask = item => {
        // console.log(item);
        Haptics.selectionAsync();
        props.navigation.navigate('Edit Task', { item_id: item.id });
    }

    const setActiveTask = item => {
        console.log("setting active to " + item)
        setUserActiveTask(user, userDetailsRef, item, db);
    }

    return (
        <View style={AppStyles.container}>
            <ScrollView>
                {tasks ? tasks.map((item) => {
                    var taskClasses = [styles.tasks,]
                    if (item.id === userDetails.active_task.id) {
                        taskClasses.push(styles.activeTask)
                    }
                return (
                    <TouchableOpacity key={item.id} onLongPress={() => editTask(item)} onPress={() => setActiveTask(item.id)}>
                        <Text style={taskClasses} >{item.name}{' \t'}{item.estimated_time}{' hrs \t'}{item.percentage}{'% \t'}{<Moment format="DD MMMM YYYY" date={item.due_date} element={Text} unix />}</Text>
                    </TouchableOpacity>
                );
            }) : <Text>No data</Text>}
            </ScrollView>
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