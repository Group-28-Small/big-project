
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { backend_address } from 'big-project-common';
import AppStyles from '../styles';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import FloatingActionButton from '../components/FloatingActionButton';
export const IndexPage = props => {
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = db.collection('users')
        .doc(user.uid);
    const { data: tasks } = useFirestoreCollectionData(db.collection("tasks").where("user", "==", userDetailsRef), {
        idField: 'id'
    });
    const addTask = () => {
        db.collection("tasks").doc().set({ 'name': 'hfeuwiq', 'user': userDetailsRef })
    }

    return (
        <View style={AppStyles.container}>
            <Text>Open up App.js to start working on your app!</Text>
            <Text>{backend_address("")}</Text>
            {tasks ? tasks.map((item) => {
                return (
                    <Text key={item.id}>{item.name}</Text>
                );
            }) : <Text>No data</Text>}
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
    }
});