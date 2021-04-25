import React, { useState } from 'react';
import { Button, View } from 'react-native';
import AppStyles from '../styles';
import { AppTheme } from 'big-project-common'
import { FAB } from 'react-native-paper';

export default function NavButton(props) {
    // const buttonText = props.isTracking ? "Stop Tracking" : "Start Tracking";
    const [state, setState] = React.useState({ open: false });

    const onStateChange = ({ open }) => setState({ open });

    const { open } = state;

    return (
        // <View style={AppStyles.bottom}>
        //     <Button title={buttonText} color={AppTheme.secondaryDarkColor} disabled={!props.task} onPress={props.onPress} />
        //     <Button title={"Session History"} color={AppTheme.secondaryDarkColor} disabled = {props.sessions} onPress={() => props.navigation.navigate("Session History")} />
        //     <Button title={"Completed Tasks"}  color={AppTheme.secondaryDarkColor} disabled={props.completedTasks} onPress={() => props.navigation.navigate("Completed Tasks")} />
        // </View>
        <FAB.Group
            open={open}
            icon='account-clock-outline'
            color={AppTheme.secondaryColor}
            fabStyle={{backgroundColor:AppTheme.primaryColor, small: false}}
            actions={[
                { 
                    icon: 'plus',
                    onPress: () => props.navigation.navigate('New Task') },
                {
                    icon: 'progress-check',
                    label: 'Done',
                    visible: props.completedTasks,
                    onPress: () => props.navigation.navigate('Completed Tasks'),
                },
                {
                    icon: 'history',
                    label: 'History',
                    visible: props.sessions,
                    onPress: () => props.navigation.navigate('Session History'),
                },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
                if (open) {
                // do something if the speed dial is open
                }
            }}
            />
    );
}