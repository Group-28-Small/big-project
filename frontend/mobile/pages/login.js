import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Button, Platform, ToastAndroid, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import '../styles';
import AppStyles from '../styles';
import { useAuth, useUser } from 'reactfire';

export const LoginPage = props => {
    const [email, onChangeEmail] = React.useState("");
    const [password, onChangePassword] = React.useState("");
    const auth = useAuth();
    const login = () => auth.signInWithEmailAndPassword(email, password).then(result => {
        console.log(result);
    }).catch(() => {
        if (Platform.OS === 'android') {
            ToastAndroid.show("Incorrect details", ToastAndroid.SHORT);
        } else if (Platform.OS === 'ios') {
            // TODO: iOS
            // Alert("Incorrect details");
        }

    });
    var user = useUser();
    if (user !== undefined) {
        console.log("wait a minute...");
    }
    return (
        < SafeAreaView >
            <TextInput
                style={styles.input}
                onChangeText={onChangeEmail}
                value={email}
                placeholder="Email Address"
                autoCompleteType="email"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangePassword}
                value={password}
                placeholder="Password"
                secureTextEntry={true}
                autoCompleteType="password"
            />
            <Button title="Login" style={styles.submitButton} onPress={() => login()} />

        </SafeAreaView >
  );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10
    },
    submitButton: {
        width: 10,
    }
});