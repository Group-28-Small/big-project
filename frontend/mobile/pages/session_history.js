
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppStyles from '../styles';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData, useUser } from 'reactfire';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Moment from 'react-moment';
import LoadingScreen from './loadingscreen';
import moment from 'moment';
import { AppTheme } from 'big-project-common';
import { Card } from 'react-native-paper';
import { Colors } from 'react-native/Libraries/NewAppScreen';

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
                    var taskContainer = [styles.container,]
                    var task = taskDict[item.task]
                    if (task === undefined) {
                        return null;
                    }
                    var duration = moment.duration((item.end - item.start) * 1000).humanize();
                    return (
                        <Card key={item.id} style={taskContainer}>
                            <Card.Content>
                                <Text style={taskClasses}>{task.name}</Text>
                                <Text style={taskClasses}>{'at: '}<Moment unix element={Text} date={item.start} format="MMMM DD" />{" for: " + duration}</Text>
                            </Card.Content>
                        </Card>
                    );
                }) : <Caption style={{textAlign: 'center'}}>You haven't tracked any tasks!</Caption>}
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    sessions: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
    },
    container: {
        marginVertical: 5,
        elevation: 2,
    },
});

