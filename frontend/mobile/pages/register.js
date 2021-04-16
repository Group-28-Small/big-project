
import { getOrCreateUserDocument } from 'big-project-common';
import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFirebaseApp, useFirestore } from 'reactfire';
import 'firebase/firestore';
import AppStyles from '../styles';

export function RegisterPage() {
    const firebase = useFirebaseApp();
    const db = useFirestore();
    const register = () => {
        console.log("registering");
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                console.log(user);
                getOrCreateUserDocument(user.uid, db);
                return user.sendEmailVerification();
                // ...
            }).
            then(function () {
                // Email sent.
                console.log("email sent");
            }).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("error" + errorMessage);
                // ..
            });

    }
    const [email, onChangeEmail] = React.useState("");
    const [password, _onChangePassword] = React.useState("");
    const [passwordVerify, _onChangePasswordVerify] = React.useState("");
    const [pwError, setPWError] = React.useState(false);

    const onChangePassword = (pw) => {
        _onChangePassword(pw);
        if (pw !== passwordVerify) {
            setPWError(true)
        } else {
            setPWError(false);
        }
    }
    const onChangePasswordVerify = (pw) => {
        _onChangePasswordVerify(pw);
        if (pw !== password) {
            setPWError(true)
        } else {
            setPWError(false);
        }
    }

    return (
        <View style={AppStyles.centered}>
            < SafeAreaView  >
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
                <TextInput
                    style={[styles.input, pwError ? styles.error : null]}
                    onChangeText={onChangePasswordVerify}
                    value={passwordVerify}
                    placeholder="Enter Password Again"
                    secureTextEntry={true}
                    autoCompleteType="password"
                />
                <View style={styles.submitButton}>
                    <Button title="Register" onPress={() => register()} color={"#4caf50"} disabled={pwError} />
                </View>
            </SafeAreaView >
        </View >
    );
}
const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10
    },
    error: {
        borderColor: 'red'
    },
    submitButton: {
        marginHorizontal: 10,
        marginVertical: 5,
    },
    registerButton: {
        marginHorizontal: 10,
        marginVertical: 10,
    }
});