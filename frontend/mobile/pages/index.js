
import React from 'react';
import { StyleSheet, Text, View, Image, AppState } from 'react-native';
import { backend_address } from 'big-project-common';
import { useUser } from 'reactfire';
import '../styles';
import AppStyles from '../styles';
export const IndexPage = props => {
    console.log("heeeeerres index!");
    const { user } = useUser();
    if (user === undefined) {
        props.navigation.navigate("Login");
    }
    return (
        <View style={AppStyles.container}>
            <Text>Open up App.js to start working on your app!</Text>
            <Text>{backend_address("")}</Text>
        </View>
    );
}