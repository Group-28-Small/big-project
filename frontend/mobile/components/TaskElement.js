import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native'
import { Card, Text, ProgressBar, Colors, Button, Divider, IconButton } from 'react-native-paper';
import Moment from 'react-moment';
import { AppTheme } from 'big-project-common';

export default TaskElement = props => {
    const [isCollapsed, toggleCollapse] = useState(false);
    // console.log("the due date is: " + props.due_date);

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
                <Text style={styles.textDisplay}>{props.name}</Text>
                {
                    props.has_estimated_time && 
                    <ProgressBar progress={props.duration / props.estimated_time} color={props.active ? Colors.white : Colors.amber200} style={{height: 15, marginTop: 5, marginBottom: 5, width: '100%'}}/>
                }
                {
                    props.has_estimated_time && 
                    <Text style={styles.textDisplay}>{Math.floor(props.duration / props.estimated_time * 100) + '%'}</Text>
                }
                {
                    isCollapsed &&
                    <View style={{flexDirection:"row"}}>
                        {
                            props.has_estimated_time &&
                            <View>
                                <Text style={styles.textDisplay, {marginRight: '25%'}}>{timeDisplay(props.duration)} / {timeDisplay(props.estimated_time)}</Text>
                            </View>
                        }
                        {
                            props.has_due_date &&
                            <View>
                                {console.log("in <View> due date: " + props.due_date)}
                                <Text style={styles.textDisplay}>Due date: <Moment element={Text} date={props.due_date * 1000} fromNow/></Text>
                            </View>
                        }                   
                    </View>  
                }
                {
                    isCollapsed && props.note != '' &&
                    <View>
                        <Divider/>
                        <Text style={styles.textDisplay}>{props.note}</Text>
                    </View>
                }
            </Card.Content>
            {
                isCollapsed &&
                <Card.Actions>
                    {props.isDone ?? <Button onPress={props.edit} style={styles.button} color={AppTheme.secondaryDarkColor}>Edit</Button>}
                    {props.isDone ? <Button onPress={props.notDone} style={styles.button} color={AppTheme.secondaryDarkColor}>Mark as incomplete</Button> : <Button onPress={props.done} style={styles.button} color={AppTheme.secondaryDarkColor}>Mark as done</Button>}
                    {/*thinking of moving start/stop functionality to each card, similar to web*/}
                    {/* {props.isTracking ? <IconButton color='red' icon="pause" size={20}/> : <IconButton color='green' icon="play" size={20}/>} */}
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
        backgroundColor: Colors.amber200
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
    },
    textDisplay: {
        marginVertical: 5,
    }
})