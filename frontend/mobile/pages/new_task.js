import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, Platform } from 'react-native';
import { SliderPicker } from 'react-native-slider-picker';
import DatePicker from 'react-native-datepicker';
import { useFirestore, useUser } from 'reactfire';
import DateTimePicker from '@react-native-community/datetimepicker';


export const NewTaskPage = props => {
    const db = useFirestore();
    const { data: user } = useUser();
    const userDetailsRef = db.collection('users')
        .doc(user.uid);
    const setPct = percentage =>  onChangePct(percentage);
    const [name, onChangeName] = React.useState("");
    const [time, onChangeTime] = React.useState("");
    const [pct, onChangePct] = React.useState("0");
    const [date, onChangeDate] = React.useState(new Date());
    const createTask = () => {
        console.log('Creating');
        db.collection("tasks").doc().set({ 'name': name, 'user': userDetailsRef, 'time' : time, 'percentage' : pct, 'date' : date.toLocaleString()});
         props.navigation.navigate('Home');
    }
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        // setShow(Platform.OS === 'ios');
        onChangeDate(currentDate);
      };

    return(
        <View>
            < SafeAreaView  >
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeName}
                    value={name}
                    placeholder="Task Name"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeTime}
                    value={time}
                    placeholder="Expected Time (in Hours)"
                    keyboardType='numeric'
                />
                <Text style={styles.text}>Or</Text>
                <Text style={styles.text}>Percentage: {pct}%</Text>
                <SliderPicker 
                    maxValue={100}
                    callback={position => {
                        setPct(position)
                    }}
                    labelFontColor={"#6c7682"}
                    labelFontWeight={0}
                    showFill={true}
                    fillColor={'blue'}
                    showNumberScale={true}
                    showSeparatorScale={true}
                    buttonBackgroundColor={'#fff'}
                    buttonBorderColor={"#6c7682"}
                    buttonBorderWidth={1}
                    scaleNumberFontWeight={"normal"}
                    buttonDimensionsPercentage={4}
                    heightPercentage={1}
                    widthPercentage={80}
                    scaleNumberFontSize={15}
                    buttonStylesOverride
                />
                <Text style={styles.text}>Due Date:</Text>
                {/* <DatePicker
                    style={styles.datePicker}
                    selected={date}
                    date={date}
                    mode="datetime"
                    placeholder="select date"
                    format="YYYY-MM-DD HH:MM"
                    is24Hour={false}
                    androidMode='default'
                    minDate= {new Date()}
                    maxDate="2099-12-31"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    useNativeDriver={true}
                    customStyles={{
                    dateIcon: {
                        position: 'absolute',
                        left: 100,
                        top: 4,
                        marginLeft: 0
                    },
                    dateInput: {
                        marginLeft: 36,
                        left: 100,
                    },
                    datePicker: {
                        left: 75
                    }
                    }}
                    onDateChange={(newDate) => pickDate(newDate)}
                /> */}
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={"date"}
                    // is24Hour={true}
                    display="calendar"
                    onChange={onChange}
                    />
                <View style={styles.submitButton}>
                    <Button title="Create" onPress={() => createTask()} color={"#4caf50"} />
                </View>
            </SafeAreaView >
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});