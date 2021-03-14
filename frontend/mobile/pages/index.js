
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { backend_address } from 'big-project-common';
export class IndexPage extends React.Component {
    render() {
        console.log("heeeeerres index!");
        return (
            <View style={styles.container}>
                <Text>Open up App.js to start working on your app!</Text>
                <Text>{backend_address("")}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});