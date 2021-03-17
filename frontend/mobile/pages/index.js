
import React from 'react';
import { LogBox, Text, View } from 'react-native';
import { backend_address, createUserDocument, getOrCreateUserDocument } from 'big-project-common';
import AppStyles from '../styles';
import { useFirebaseApp, useFirestore, useFirestoreCollection, useFirestoreCollectionData, useUser } from 'reactfire';
export const IndexPage = props => {
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = db.collection('users')
        .doc(user.uid);
    const { data: tasks } = useFirestoreCollectionData(db.collection("tasks").where("user", "==", userDetailsRef), {
        idField: 'id'
    });


    return (
        <View style={AppStyles.container}>
            <Text>Open up App.js to start working on your app!</Text>
            <Text>{backend_address("")}</Text>
            {tasks ? tasks.map((item) => {
                return (
                    <Text key={item.id}>{item.name}</Text>
                );
            }) : <Text>No data</Text>}
        </View>
    );
}