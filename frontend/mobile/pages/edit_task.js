import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Platform, ToastAndroid } from 'react-native';
import { useFirestore, useFirestoreDoc, useFirestoreDocData, useUser } from 'reactfire';
import { Paragraph, TextInput, TouchableRipple } from 'react-native-paper';
import { ScrollView, Switch } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppStyles from '../styles';
import Moment from 'react-moment';
import LoadingScreen from './loadingscreen';
import firebase, { firestore } from 'firebase';
import { Snackbar } from 'react-native-paper';
import Dialog from "react-native-dialog";
import { userStopTask, AppTheme } from 'big-project-common';
import InputSpinner from "react-native-input-spinner";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const EditTaskPage = props => {
    const db = useFirestore();
    const item_id = props.route.params.item_id;
    console.log("editing task with id: " + item_id);
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
    const [visible, setVisible] = React.useState(false);
    const onToggleSnackBar = () => setVisible(true);
    const onDismissSnackBar = () => setVisible(false);
    const db = useFirestore();
    const { item, user, item_id, userRef } = props;
    const [timePickerVisible, setTimePickerVisible] = React.useState(false);
    const [timePickerMode, setTimePickerMode] = React.useState("date");
    // const [hasDueDate, setHasDueDate] = React.useState(item.has_due_date ?? false);
    // const [trackProgress, setTrackProgress] = React.useState(item.track_progress ?? false);
    // const [trackTime, setTrackTime] = React.useState(item.has_estimated_time ?? false);

    // //leaving this for now in case we revert
    const [estimatedTime, onChangeTime] = React.useState(item.estimated_time ?? '');

    // const [taskName, onChangeName] = React.useState(item.name ?? '');
    // const [pct, onChangePct] = React.useState(item.percentage ?? 0);
    // const [dueDate, setDueDate] = React.useState(new Date(item.due_date * 1000));
    // const [notes, onChangeNotes] = React.useState(item.note ?? '');

    const [taskName, onChangeName] = React.useState(item.name ?? '');
    const [notes, onChangeNotes] = React.useState(item.note ?? '');
    const [duration, updateDuration] = React.useState(item.duration ?? 0);
    const [hasEstimatedTime, setHasEstimatedTime] = React.useState(item.has_estimated_time ?? false);
    // i don't think we need this one since it's already handled with hour and minute
    // const [estimatedTime, ] = React.useState(item.estimated_time ?? 0);
    const [hasDueDate, setHasDueDate] = React.useState(item.has_due_date ?? false);
    const [dueDate, onChangeDueDate] = React.useState(item.due_date ?? Math.ceil(Date.now() / (1000*60*60*24)) * (1000*60*60*24)); // TODO: round it up to next whole hour
    
    const [isDone, setIsDone] = React.useState(item.is_done ?? false);

    const [selectedHour, setSelectedHour ] = useState(item.estimated_time ? Math.floor((item.estimated_time / (1000*60*60)) % 24) : 0);
    const [selectedMinute, setSelectedMinute ] = useState(item.estimated_time ? Math.floor((item.estimated_time / (1000*60)) % 60) : 0);

    const userDetailsRef = user != null ? db.collection('users')
        .doc(user.uid) : null;
    const { data: userDetails } = useFirestoreDocData(userDetailsRef ?? db.collection('users').doc());


    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const updateTask = () => {
        var estimatedTime = (selectedHour * 60 * 60 * 1000) + (selectedMinute * 60 * 1000);
        console.log("updating task: " + taskName);
        console.log("time was: " + item.estimated_time + "time is: " + estimatedTime);
        if(taskName != ''){
            db.collection("tasks").doc(item_id).set({
                'name': taskName,
                'note': notes,
                'duration': duration,
                'has_estimated_time': hasEstimatedTime,
                'estimated_time': estimatedTime,
                'has_due_date' : hasDueDate,
                'due_date': dueDate,
                'done': isDone,
                'user': userRef
            }, { merge: true });
            props.navigation.navigate('Home');
        } else{
            if (Platform.OS === 'android') {
                ToastAndroid.show("Tasks can't be created without a name", ToastAndroid.SHORT);
            } else if (Platform.OS === 'ios') {
                onToggleSnackBar()
            }
        }
    }
    const deleteTask = () => {
        console.log('deletint task: ' + item_id)
        db.collection("tasks").doc(item_id).delete();
        if(userDetails?.active_task !== undefined && item_id === userDetails?.active_task.id){
            userStopTask(db, userDetails?.active_task, userDetails, userDetailsRef);
            userDetailsRef.set({ 'active_task': firebase.firestore.FieldValue.delete()}, { merge: true })
        }
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
        onChangeDueDate(currentDate);
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
            
            {/* <TextInput leaving this for now in case we revert
                style={styles.input}
                onChangeText={onChangeTime}
                value={estimatedTime}
                label="Expected Time (Optional)"
                placeholder="hours:minutes"
                keyboardType='numeric'
                mode="outlined"
                disabled='true'
            /> */}
            <TextInput
                style={styles.input}
                onChangeText={onChangeNotes}
                value={notes}
                label="Notes..."
                mode="outlined"
                multiline
            />
            <TouchableRipple onPress={() => setHasEstimatedTime(!hasEstimatedTime)}>
            <View style={styles.row}>
                <Paragraph>Estimated Time</Paragraph>
                <View pointerEvents="none">
                    <Switch value={hasEstimatedTime} ios_backgroundColor={AppTheme.secondaryLightColor} />
                </View>
            </View>
            </TouchableRipple>
            {hasEstimatedTime && (
                //can extend this further to days?
                <>
                <View style={styles.spinnerView}>
                    <Text style={{marginRight: 20, marginLeft: 50}}>Hours</Text>
                    <InputSpinner
                        style={{
                            marginRight: 500,
                            minWidth: 150,
                        }}
                            max={99}
                            min={0}
                            step={1}
                            colorMax={"#f04048"}
                            colorMin={"#40c5f4"}
                            value={selectedHour}
                            width={185}
                            onLongPress={setSelectedHour}
                            onChange={setSelectedHour}
                            colorLeft={AppTheme.primaryColor}
                            colorRight={AppTheme.primaryColor}
                            // showBorder={true}
                            skin={'square'}
                        ></InputSpinner>
                    </View>
                    <View style={styles.spinnerView}>
                    <Text style={{marginRight: 20, marginLeft: 38}}>Minutes</Text>
                    <InputSpinner
                        style={{
                            marginRight: 500,
                            minWidth: 150,
                        }}
                            max={59}
                            min={0}
                            step={1}
                            //I'm bad with colors
                            colorMax={"#f04048"}
                            colorMin={"#40c5f4"}
                            colorLeft={AppTheme.primaryColor}
                            colorRight={AppTheme.primaryColor}
                            // background={AppTheme.secondaryLightColor}
                            // textColor={AppTheme.secondaryDarkColor}
                            value={selectedMinute}
                            width={185}
                            onLongPress={setSelectedMinute}
                            onChange={setSelectedMinute}
                            // showBorder={true}
                            skin={'square'}
                        ></InputSpinner>
                    </View>
                </>
            )}
            {/* <TouchableRipple onPress={() => setTrackProgress(!trackProgress)}>
                <View style={styles.row}>
                    <Paragraph>Track Progress</Paragraph>
                    <View pointerEvents="none">
                        <Switch value={trackProgress} ios_backgroundColor={AppTheme.secondaryLightColor}  />
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
                            minimumTrackTintColor={AppTheme.primaryDarkColor}
                            maximumTrackTintColor={AppTheme.primaryColor}
                            thumbTintColor={AppTheme.primaryDarkColor}
                        />
                    </View>
                </>
            )
            } */}
            <TouchableRipple onPress={() => setHasDueDate(!hasDueDate)}>
                <View style={styles.row}>
                    <Paragraph>Has Due Date</Paragraph>
                    <View pointerEvents="none">
                        <Switch value={hasDueDate} ios_backgroundColor={AppTheme.secondaryLightColor} />
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
                                <Moment format="hh:mm" date={dueDate} element={Text} />
                            </Text>
                        </TouchableRipple>
                        {timePickerVisible && (
                            <DateTimePicker style={{ flex: 1 }}
                                testID="dateTimePicker"
                                value={dueDate}
                                mode={timePickerMode}
                                display="default"
                                minimumDate={new Date()}
                                onChange={onDueDateTimeChange}
                            />
                        )}
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>Due: <Moment element={Text} date={dueDate} fromNow /></Text>
                    </View>
                </>
            )
            }
            <View style={styles.submitButton}>
                <Button title={props.isNewTask ? "Add Task" : "Update Task"} onPress={() => updateTask()} color={AppTheme.primaryColor} />
            </View>
            {!props.isNewTask &&
                <View style={styles.submitButton}>
                    <Button title={"Delete Task"} onPress={() => handleClickOpen()} color={AppTheme.secondaryDarkColor} />
                    <Dialog.Container
                        visible={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                        >
                        <Dialog.Title id="alert-dialog-slide-title">{"Delete Task?"}</Dialog.Title>
                        <Dialog.Description id="alert-dialog-slide-description">
                            Are you sure you want to delete this task permenantly? Session history will not be saved.
                        </Dialog.Description>
                        <Dialog.Button onPress={handleClose} color={AppTheme.primaryColor} label="Disagree">
                        Disagree
                        </Dialog.Button>
                        <Dialog.Button onPress={deleteTask} color={AppTheme.primaryColor} label="Agree">
                        Agree
                        </Dialog.Button>
                    </Dialog.Container>
                </View>
            }
            <Snackbar style={styles.iosSnackbar}
                visible={visible}
                onDismiss={onDismissSnackBar}
                duration={Snackbar.DURATION_SHORT}
                theme={{ colors: { surface: 'black' }}}>
                Tasks can't be created without a name
            </Snackbar>
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
        textAlign: 'center',
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
    },
    iosSnackbar: {
        backgroundColor: 'white',
        width: 290,
        marginHorizontal: 120,
        alignSelf: 'center',
        position: 'absolute'
    },
    spinnerView: {
        marginBottom: 20,
		flexDirection: "row",
		alignItems: "center",
		textAlign: "left",
		textAlignVertical: "center"
    }
});
