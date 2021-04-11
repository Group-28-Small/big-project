import React from 'react';
import { Text, View } from 'react-native';
import AppStyles from '../styles';
export const VerifyPage = props => {
    console.log("heeeeerres verify!");
    return (
        <View style={AppStyles.container}>
            <Text>Check your email for a verification email!</Text>
        </View>
    );
}