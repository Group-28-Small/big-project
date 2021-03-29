
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { backend_address } from 'big-project-common';
import AppStyles from '../styles';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import FloatingActionButton from '../components/FloatingActionButton';
import { ScrollView } from 'react-native-gesture-handler';
import LoadingScreen from './loadingscreen';
export const IndexPage = props => {
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
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

    return (
        <View style={AppStyles.container}>
            <ScrollView>
            <Text>{backend_address("")}</Text>
            {tasks ? tasks.map((item) => {
                return (
                    <Text style={styles.tasks} key={item.id}>{item.name}{' \t'}{item.estimated_time}{' hrs\t'}{item.percentage}{'%\t'}{item.date}</Text>
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
        margin: 2
        
    }
});