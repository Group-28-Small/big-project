
import React from 'react';
import { Text, View } from 'react-native';
import { backend_address } from 'big-project-common';
import AppStyles from '../styles';
export const IndexPage = props => {
    console.log("heeeeerres index!");
    return (
        <View style={AppStyles.container}>
            <Text>Open up App.js to start working on your app!</Text>
            <Text>{backend_address("")}</Text>
        </View>
    );
}