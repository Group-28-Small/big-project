
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppStyles from '../styles';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData, useUser } from 'reactfire';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Moment from 'react-moment';
import LoadingScreen from './loadingscreen';
import moment from 'moment';

export const SessionHistoryPage = props => {
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const { data: sessions } = useFirestoreCollectionData(db.collection("sessions").where("user", "==", userDetailsRef).orderBy("start", "desc").orderBy("end", "desc")
    , {
        idField: 'id'
    });
    const { data: tasks } = useFirestoreCollectionData(db.collection("tasks").where("user", "==", userDetailsRef), {
        idField: 'id'
    });
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
    return (
        <View style={AppStyles.container}>
            <ScrollView>
                {sessions ? sessions.map((item) => {
                    var taskClasses = [styles.sessions,]
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
                }) : <Text>You haven't tracked any tasks!</Text>}
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

