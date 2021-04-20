import React from 'react';
import { Text, View } from 'react-native';
import AppStyles from '../styles';
export const VerifyPage = props => {
    console.log("heeeeerres verify!");
    return (
        <View style={AppStyles.container}>
            <Text>Check your email for a verification email!</Text>
            <Text>Feel free to stay on this page. Once you verify your email, you will automatically be redirected to the home page.</Text>
        </View>
    );
}