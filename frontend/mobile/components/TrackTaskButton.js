import React from 'react';
import { Button, View } from 'react-native';
import AppStyles from '../styles';
export function TrackTaskButton(props) {
    const buttonText = props.isTracking ? "Stop Tracking" : "Start Tracking";
    return (
        <View style={AppStyles.bottom}>
            <Button title={buttonText} disabled={!props.task} onPress={props.onPress} />
            <Button title={"Session History"} disabled = {props.sessions} onPress={() => props.navigation.navigate("Session History")} />
            <Button title={"Completed Tasks"}  disabled={props.completedTasks} onPress={() => props.navigation.navigate("Completed Tasks")} />
        </View>
    );
}