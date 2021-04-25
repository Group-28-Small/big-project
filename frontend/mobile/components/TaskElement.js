import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native'
import { Card, Text, ProgressBar, Colors, Button } from 'react-native-paper';
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
                    props.has_estimated_time && 
                    <Text style={{alignContent: 'center'}}>{Math.floor(props.duration / props.estimated_time * 100) + '%'}</Text>
                }
                {
                    isCollapsed &&
                    <View style={{flexDirection:"row", justifyContent: 'space-arou'}, styles.boundary}>
                        {
                            props.has_estimated_time &&
                            <View style={styles.boundary}>
                                <Text style={{justifyContent: 'flex-start'}}>{timeDisplay(props.duration)} / {timeDisplay(props.estimated_time)}</Text>
                            </View>
                        }
                        {
                            props.has_due_date &&
                            <View style={styles.boundary}>
                                <Text style={{flex: 1, justifyContent: 'flex-end'}}>Due date: <Moment element={Text} date={props.due_date} fromNow /></Text>
                            </View>
                        }
                        {
                            props.note != '' &&
                            <View style={styles.boundary}>
                                <Text style={{flex: 1, justifyContent: 'flex-start'}}>{props.note}</Text>
                            </View>
                        }
                                                
                    </View>  
                }
            </Card.Content>
            {
                isCollapsed &&
                <Card.Actions>
                    {props.isDone ?? <Button onPress={props.edit} style={styles.button}>Edit</Button>}

                    {props.isDone ? <Button onPress={props.notDone} style={styles.button}>Mark as incomplete</Button> : <Button onPress={props.done} style={styles.button}>Mark as done</Button>}
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
        flex: 1
    },
    button: {
        backgroundColor: Colors.green100,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: Colors.pink900,
        marginRight: 5,
    }
})