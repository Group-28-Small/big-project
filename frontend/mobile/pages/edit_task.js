import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import { useFirestore, useFirestoreDoc, useFirestoreDocData, useUser } from 'reactfire';
import { Paragraph, TextInput, TouchableRipple } from 'react-native-paper';
import { ScrollView, Switch } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppStyles from '../styles';
import Moment from 'react-moment';
import LoadingScreen from './loadingscreen';
import { firestore } from 'firebase';

export const EditTaskPage = props => {
    const db = useFirestore();
    const item_id = props.route.params.item_id;
    console.log(item_id)
    const itemRef = db.collection('tasks').doc(item_id);
    const item = useFirestoreDocData(itemRef, { initialData: null });
    const { data: user } = useUser();
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    if (item.data && user) {
        const data = item.data
        return <TaskEditor item={data} item_id={itemRef.id} user={user} userRef={userDetailsRef}  {...props} />
    } else {
        return <LoadingScreen />
    }

}

export const NewTaskPage = props => {
    const db = useFirestore();
    const [itemRef,] = useState(db.collection('tasks').doc());
    const { data: user } = useUser();
    const item = useFirestoreDocData(itemRef, { initialData: null });
    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const [timeSet, setTimeSet] = useState(false);
    if (item.data && user) {
        const data = item.data
        if (!timeSet) {
            data.due_date = (Date.now() / 1000) + (60 * 60 * 24);
            setTimeSet(true);
        }
        return <TaskEditor item={data} item_id={itemRef.id} user={user} userRef={userDetailsRef} {...props} isNewTask={true} />
    } else {
        return <LoadingScreen />
    }

}
const TaskEditor = props => {
    const db = useFirestore();
    const { item, user, item_id, userRef } = props;
    const [timePickerVisible, setTimePickerVisible] = React.useState(false);
    const [timePickerMode, setTimePickerMode] = React.useState("date");
    const [hasDueDate, setHasDueDate] = React.useState(false);
    const [trackProgress, setTrackProgress] = React.useState(false);

    const [taskName, onChangeName] = React.useState(item.name ?? '');
    const [estimatedTime, onChangeTime] = React.useState(item.estimated_time ?? '');
    const [pct, onChangePct] = React.useState(item.percentage ?? 0);
    const [dueDate, setDueDate] = React.useState(new Date(item.due_date * 1000));
    const [notes, onChangeNotes] = React.useState(item.note ?? '');
    const updateTask = () => {
        db.collection("tasks").doc(item_id).set({ 'name': taskName, 'estimated_time': estimatedTime, 'percentage': pct, 'due_date': dueDate.getTime() / 1000, 'note': notes, 'duration': item.duration ?? 0, 'user': userRef }, { merge: true });
        props.navigation.navigate('Home');
    }
    const deleteTask = () => {
        db.collection("tasks").doc(item_id).delete();
        props.navigation.navigate('Home');
    }
    const showDatePicker = () => {
        setTimePickerMode("date");
        setTimePickerVisible(true);
    }
    const showTimePicker = () => {
        setTimePickerMode("time");
        setTimePickerVisible(true);
    }
    const onDueDateTimeChange = (event, selectedDate) => {
        const currentDate = selectedDate || dueDate;
        setTimePickerVisible(Platform.OS === 'ios');
        console.log('Setting due date');
        setDueDate(currentDate);
    };

    return (
        <ScrollView
            style={styles.container}
            removeClippedSubviews={false}
        >
            <TextInput
                style={styles.input}
                onChangeText={onChangeName}
                value={taskName}
                label="Task Name"
                mode="outlined"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeTime}
                value={estimatedTime}
                label="Expected Time (Optional)"
                placeholder="hours:minutes"
                keyboardType='numeric'
                mode="outlined"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeNotes}
                value={notes}
                label="Notes..."
                mode="outlined"
            />
            <TouchableRipple onPress={() => setTrackProgress(!trackProgress)}>
                <View style={styles.row}>
                    <Paragraph>Track Progress</Paragraph>
                    <View pointerEvents="none">
                        <Switch value={trackProgress} />
                    </View>
                </View>
            </TouchableRipple>
            {trackProgress && (
                <>
                    <View style={[styles.row, AppStyles.centered]}>
                        <Text style={styles.text}>Percentage: {pct}%</Text>
                    </View>
                    <View style={styles.row}>
                        <Slider
                        //TODO: This is bugging out again on slide
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={100}
                            value={pct}
                            step={1}
                            onValueChange={onChangePct}
                            // TODO: IDK colors
                            minimumTrackTintColor="#6c7682"
                            maximumTrackTintColor="#000000"
                        />
                    </View>
                </>
            )
            }
            <TouchableRipple onPress={() => setHasDueDate(!hasDueDate)}>
                <View style={styles.row}>
                    <Paragraph>Has Due Date</Paragraph>
                    <View pointerEvents="none">
                        <Switch value={hasDueDate} />
                    </View>
                </View>
            </TouchableRipple>
            {hasDueDate && (
                <>
                    <View style={styles.row}>
                        <TouchableRipple onPress={showDatePicker}>
                            <Text style={styles.boxed}>
                                <Moment format="dddd DD MMMM YYYY" date={dueDate} element={Text} />
                            </Text>
                        </TouchableRipple>
                        <TouchableRipple onPress={showTimePicker}>
                            <Text style={styles.boxed}>
                                <Moment format="hh:mm:ss" date={dueDate} element={Text} />
                            </Text>
                        </TouchableRipple>
                        {timePickerVisible && (
                            <DateTimePicker style={{ flex: 1 }}
                                testID="dateTimePicker"
                                value={dueDate}
                                mode={timePickerMode}
                                is24Hour={true}
                                display="default"
                                minimumDate={new Date()}
                                onChange={onDueDateTimeChange}
                            />
                        )}
                    </View>
                    <View style={styles.row}>
                        <Text>Due: <Moment element={Text} date={dueDate} fromNow /></Text>
                    </View>
                </>
            )
            }

            <View style={styles.submitButton}>
                <Button title={props.isNewTask ? "Add Task" : "Update"} onPress={() => updateTask()} color={"#4caf50"} />
            </View>
            {!props.isNewTask &&
                <View style={styles.submitButton}>
                    <Button title={"Delete"} onPress={() => deleteTask()} color={"red"} />
                </View>
            }
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    input: {
        margin: 8,
    },
    submitButton: {
        marginHorizontal: 10,
        marginVertical: 5,
    },
    text: {
        textAlign: 'center'
    },
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    boxed: {
        borderWidth: 1,
        padding: 8
    }
});
