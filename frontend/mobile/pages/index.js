
import React from 'react';
import { LogBox, Text, View } from 'react-native';
import { backend_address, createUserDocument, getOrCreateUserDocument } from 'big-project-common';
import AppStyles from '../styles';
import { useFirebaseApp, useFirestore, useUser } from 'reactfire';
export const IndexPage = props => {
    const [userTasks, setUserTasks] = React.useState(Array());

    console.log("heeeeerres index!");
    const firebase = useFirebaseApp();
    const db = useFirestore();
    const user = firebase.auth().currentUser;
    getOrCreateUserDocument(user.uid, db).then((userDoc) => {
        // console.log(userDoc);
        return db.collection('tasks').where('user', '==', userDoc.ref).get();
    }).then((result) => {
        console.log("got tasks");
        var data = Array();
        result.forEach(doc => {
            data.push(doc.data());
        });
        setUserTasks(data);
    })
    return (
        <View style={AppStyles.container}>
            <Text>Open up App.js to start working on your app!</Text>
            <Text>{backend_address("")}</Text>
            {userTasks.map((item) => {
                console.log(item.name);
                return (
                    <Text>{item.name}</Text>
                );
            })}
        </View>
    );
}