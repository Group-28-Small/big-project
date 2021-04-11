
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
import LoadingScreen from './loadingscreen';
import moment from 'moment';

export const SessionHistoryPage = props => {
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const { data: userDetails } = useFirestoreDocData(userDetailsRef);
    const { data: sessions } = useFirestoreCollectionData(db.collection("sessions").where("user", "==", userDetailsRef), {
        idField: 'id'
    });
    const { data: tasks } = useFirestoreCollectionData(db.collection("tasks").where("user", "==", userDetailsRef), {
        idField: 'id'
    });
    var taskDict = {}
    if (tasks) {
        tasks.forEach((t) => {
            taskDict['tasks/' + t.id] = t
            // console.log('tasks/' + t.id);
        });
    }
    if (!tasks) {
        return (
            <LoadingScreen />
        )
    }
    return (
        <View style={AppStyles.container}>
            <ScrollView>
                {sessions ? sessions.map((item) => {
                    var taskClasses = [styles.sessions,]
                    // console.log(item.task);
                    var task = taskDict[item.task]
                    if (task === undefined) {
                        return null;
                    }
                    var duration = moment.duration((item.end - item.start) * 1000).humanize();
                    return (
                        <TouchableOpacity key={item.id}>
                            <Text style={taskClasses} >{task.name}{' \tAt: '}<Moment unix element={Text} date={item.start} format="MMMM DD" />{" for: " + duration}</Text>
                        </TouchableOpacity>
                    );
                }) : <Text>No data</Text>}
            </ScrollView>
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
    sessions: {
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

