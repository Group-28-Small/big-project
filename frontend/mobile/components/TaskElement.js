import { setUserActiveTask } from 'big-project-common';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card, Divider, Text, ProgressBar, Colors, Button } from 'react-native-paper';
import Moment from 'react-moment';

export default TaskElement = props => {
    const [isCollapsed, toggleCollapse] = useState(false);
    return (
        <Card onPress={() => toggleCollapse(!isCollapsed)} onLongPress={props.setActive} style={styles.task}>
            <Card.Content>
                <Text>{props.name}</Text>
                {
                    props.has_estimated_time && 
                    <ProgressBar progress={props.percentage / 100} color={Colors.red300} style={{height: 15, marginTop: 5, marginBottom: 5, width: '100%'}}/>
                }
                {
                    isCollapsed &&
                    <View style={{flexDirection:"row"}}>
                        <View style={{flex: 1}, styles.boundary}>
                            {
                                <Text style={{justifyContent: 'flex-start',}, styles.boundary}>{props.duration + ' / ' + (props.has_estimated_time ? props.estimated_time : '--:--')}</Text>
                            }
                        </View>
                        <View>
                            {
                                props.has_due_date && 
                                <Text style={{justifyContent: 'flex-end',}, styles.boundary}>Due date: {<Moment format="DD MMMM YYYY" date={props.due_date} element={Text} unix />}</Text>
                            }
                        </View>                        
                    </View> 
                }
            </Card.Content>
            {
                isCollapsed &&
                <Card.Actions>
                    <Button onPress={props.edit} style={styles.button}>Edit</Button>
                    <Button style={styles.button}>Mark as done</Button>
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