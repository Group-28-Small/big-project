
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { backend_address } from 'big-project-common';
import AppStyles from '../styles';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import FloatingActionButton from '../components/FloatingActionButton';
import { ScrollView } from 'react-native-gesture-handler';
export const IndexPage = props => {
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = db.collection('users')
        .doc(user.uid);
    const { data: tasks } = useFirestoreCollectionData(db.collection("tasks").where("user", "==", userDetailsRef), {
        idField: 'id'
    });
    const addTask = () => {
        // db.collection("tasks").doc().set({ 'name': 'hfeuwiq', 'user': userDetailsRef })
        props.navigation.navigate('New Task');
    }
    // const editTask = propsition => {
    //     props.navigation.navigate('Edit Task');
    // }

    // receive id from map for pulling relevant data (i.e. subtasks)? 
    // or should the data be loaded already but change display from hidden to whatever
    const handlerLongClick = () => {
        alert("Long pressed :D");
    }

    const handlerClick = () => {
        alert("Pressed :)");
    }

    return (
        <View style={AppStyles.container}>
            <ScrollView>
            <Text>{backend_address("")}</Text>
            {tasks ? tasks.map((item) => {
                return (
                    // trying out long press to edit
                    <TouchableOpacity style={AppStyles.tasks}
                        onPress={handlerClick}
                        onLongPress={handlerLongClick}
                        key={item.id}>
                        <Text style={styles.tasks}>{item.name}{' \t'}{item.estimated_time}{' hrs\t'}{item.percentage}{'%\t'}{item.date}</Text>
                    </TouchableOpacity>                    
                );
            }) : <Text>No data</Text>}
            </ScrollView>
            <FloatingActionButton style={styles.floatinBtn} onPress={() => addTask()} />
        </View>
    );
}
const styles = StyleSheet.create({
    floatinBtn: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        elevation: 5
    },
    tasks:{
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'black',
        color: 'black',
        fontSize: 15,
        textAlign: 'center',
        margin: 2,
        paddingTop: 5,
        paddingBottom: 5
    }

});