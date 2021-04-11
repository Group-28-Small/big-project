import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import AppStyles from '../styles';
export default function LoadingScreen() {
    return (
        <View style={AppStyles.centered}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
}