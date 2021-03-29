import React from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import { useFirestore, useUser } from 'reactfire';
import { Paragraph, TextInput, TouchableRipple } from 'react-native-paper';
import { ScrollView, Switch } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppStyles from '../styles';
import Moment from 'react-moment';

export const NewTaskPage = props => {
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = db.collection('users')
        .doc(user.uid);
    const [timePickerVisible, setTimePickerVisible] = React.useState(false);
    const [timePickerMode, setTimePickerMode] = React.useState(false);
    const [hasDueDate, setHasDueDate] = React.useState(false);
    const [trackProgress, setTrackProgress] = React.useState(false);

    const [taskTime, onChangeName] = React.useState("");
    const [estimatedTime, onChangeTime] = React.useState("");
    const [pct, onChangePct] = React.useState("0");
    const [dueDate, setDueDate] = React.useState(new Date(Date.now() + (1000 * 60 * 60 * 24))); // one day ahead
    const createTask = () => {
        console.log('Creating');
        //TODO: Find way to convert dueDate from Object to String, won't print on homescreen otherwise
        db.collection("tasks").doc().set({ 'name': taskTime, 'user': userDetailsRef, 'estimated_time': estimatedTime, 'percentage': pct, 'due_date': dueDate});
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
                value={taskTime}
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
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={100}
                            // this is only the initial value - setting this to pct will cause flickering
                            value={0}
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
                        <DateTimePicker style={{flex: 1}}
                            testID="dateTimePicker"
                            value={dueDate}
                            mode={timePickerMode}
                            is24Hour={true}
                            display="default"
                            onChange={onDueDateTimeChange}
                        />
                        )}
                    </View>
                    <View style={styles.row}>
                        <Text>Time left: <Moment element={Text} date={dueDate} fromNow /></Text>
                    </View>
                </>
            )
            }

            <View style={styles.submitButton}>
                <Button title="Create" onPress={() => createTask()} color={"#4caf50"} />
            </View>
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
