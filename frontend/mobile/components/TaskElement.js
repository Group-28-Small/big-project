import { setUserActiveTask } from 'big-project-common';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card, Divider, Text, ProgressBar, Colors, Button } from 'react-native-paper';
import Moment from 'react-moment';
import { AppTheme } from 'big-project-common';

export default TaskElement = props => {
    const [isCollapsed, toggleCollapse] = useState(false);

    function timeDisplay(seconds) {
        var hours = Math.floor((seconds / (60*60)) % 24);
        hours = hours < 10 ? '0' + hours.toString() : hours.toString();
        var minutes = Math.floor((seconds / 60) % 60);
        minutes = minutes < 10 ? '0' + minutes.toString() : minutes.toString();

        return hours + ':' + minutes;
    }

    return (
        <Card onPress={() => toggleCollapse(!isCollapsed)} onLongPress={props.setActive} style={props.active ? styles.activeTask : styles.task}>
            <Card.Content>
                <Text>{props.name}</Text>
                {
                    props.has_estimated_time && 
                    <ProgressBar progress={props.duration / props.estimated_time} color={Colors.red300} style={{height: 15, marginTop: 5, marginBottom: 5, width: '100%'}}/>
                }
                {
                    isCollapsed &&
                    <View style={{flexDirection:"row"}}>
                        <View style={{flex: 1}, styles.boundary}>
                            {
                                props.has_estimated_time &&
                                <Text style={{justifyContent: 'flex-start',}, styles.boundary}>{timeDisplay(props.duration)} / {timeDisplay(props.estimated_time)}</Text>
                            }
                        </View>
                        <View>
                            {
                                props.has_due_date && 
                                <Text style={{justifyContent: 'flex-end',}, styles.boundary}>Due date: {<Moment format="DD MMMM YYYY" date={props.due_date} element={Text} unix />}</Text>
                            }
                        </View> 
                        <View>
                            {
                                props.note != '' &&
                                <Text style={{justifyContent: 'flex-start',}, styles.boundary}>{props.note}</Text>
                            }
                        </View>                     
                    </View> 
                }
            </Card.Content>
            {
                isCollapsed &&
                <Card.Actions>
                    <Button onPress={props.edit} style={styles.button}>Edit</Button>
                    <Button onPress={props.done} style={styles.button}>Mark as done</Button>
                </Card.Actions>
            }
        </Card>
    )
}

// Adding borders and stuff for better visualizing
const styles = StyleSheet.create({
    task:{
        elevation: 2,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    activeTask:{
        elevation: 2,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: AppTheme.primaryLightColor
    },
    boundary: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: Colors.blue900,
    },
    button: {
        backgroundColor: Colors.green100,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: Colors.pink900,
    }
})