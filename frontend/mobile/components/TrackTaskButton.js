import React from 'react';
import { Button, View } from 'react-native';
import AppStyles from '../styles';
export function TrackTaskButton(props) {
    const buttonText = props.isTracking ? "Stop Tracking" : "Start Tracking";
    return (
        <View style={AppStyles.bottom}>
            <Button title={buttonText} disabled={!props.task} onPress={props.onPress} />
            <Button title={"History"} onPress={() => props.navigation.navigate("Session History")} />
        </View>
    );
}