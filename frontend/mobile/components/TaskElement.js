import React from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card, Divider, Text, ProgressBar, Colors } from 'react-native-paper';

export default TaskElement = props => {
    const [isCollapsed, toggleCollapse] = useState(false);

    return (
        <Card onPress={() => toggleCollapse(!isCollapsed)} style={styles.task}>
            <Card.Content>
                <Text>{props.name}</Text>
                <ProgressBar progress={props.duration / props.estimated_time} color={Colors.white} style={{height: 10}}/>
                {
                    isCollapsed &&
                    <View>
                        <Divider />
                        <Text>Duration: {props.duration}</Text>
                        <Text>Estimated Time: {props.estimated_time}</Text>
                    </View> 
                }
            </Card.Content>
        </Card>
    )
}

// Adding borders and stuff for better visualizing
const styles = StyleSheet.create({
    task:{
        backgroundColor: Colors.blue300,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: Colors.blue900,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5,
    }
})