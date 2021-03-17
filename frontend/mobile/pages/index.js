
import React from 'react';
import { Text, View } from 'react-native';
import { backend_address, createUserDocument } from 'big-project-common';
import AppStyles from '../styles';
import { useFirebaseApp, useFirestore, useUser } from 'reactfire';
export const IndexPage = props => {
    console.log("heeeeerres index!");
    const firebase = useFirebaseApp();
    const db = useFirestore();
    const user = firebase.auth().currentUser;
    var docRef = db.collection("users").doc(user.uid);
    // console.log(user);
    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            createUserDocument(user.uid, db);

        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    return (
        <View style={AppStyles.container}>
            <Text>Open up App.js to start working on your app!</Text>
            <Text>{backend_address("")}</Text>
        </View>
    );
}