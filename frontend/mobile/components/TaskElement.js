import { setUserActiveTask } from 'big-project-common';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card, Divider, Text, ProgressBar, Colors } from 'react-native-paper';
import Moment from 'react-moment';

export default TaskElement = props => {
    const [isCollapsed, toggleCollapse] = useState(false);
    return (
        <Card onPress={() => toggleCollapse(!isCollapsed)} onLongPress={props.setActive} style={styles.task}>
            <Card.Content>
                <Text>{props.name}</Text>
                <ProgressBar progress={props.percentage / 100} color={Colors.red300} style={{height: 15, marginTop: 5, marginBottom: 5, width: '100%'}}/>
                {
                    isCollapsed &&
                    <View>
                        <Divider style={{marginBottom: 15, marginTop: 10}}/>
                        <Text>{props.duration + ' / ' + (props.estimated_time || 'no estimated time')}</Text>
                        {
                            props.has_due_date && 
                            <Text>Due date: {<Moment format="DD MMMM YYYY" date={props.due_date} element={Text} unix />}</Text>
                        }
                    </View> 
                }
            </Card.Content>
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
    }
})