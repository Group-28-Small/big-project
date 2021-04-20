
import { getOrCreateUserDocument } from 'big-project-common';
import React from 'react';
import { View, StyleSheet, Button, Text, Platform, ToastAndroid } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFirebaseApp, useFirestore } from 'reactfire';
import 'firebase/firestore';
import AppStyles from '../styles';
import { Snackbar } from 'react-native-paper';

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
                console.log("error " + errorMessage);
                console.log(errorCode)
                // console.log(errorCode === 'auth/invalid-email')
                if(errorCode === 'auth/invalid-email'){
                    setBadEmail(true)
                    if(Platform.OS === 'ios'){
                        onDismissExistsSnackBar()
                        onToggleSnackBar()
                    } else if(Platform.OS === 'android'){
                        ToastAndroid.show("Please enter a valid email adddress...", ToastAndroid.SHORT);
                    }
                } else if(errorCode === 'auth/weak-password'){
                    if(Platform.OS === 'ios'){
                        setBadEmail(false)
                        onDismissExistsSnackBar()
                        onToggleSnackBar()
                    } else if(Platform.OS === 'android'){
                        ToastAndroid.show("Your password must contain at least 6 characters...", ToastAndroid.SHORT);
                    }
                } else{
                    if(Platform.OS === 'ios'){
                        onDismissSnackBar()
                        onToggleExistsSnackBar()
                    } else if(Platform.OS === 'android'){
                        ToastAndroid.show("This email is already associated with an account! Return to the login screen...", ToastAndroid.SHORT);
                    }
                }
                // ..
            });

    }
    const [email, onChangeEmail] = React.useState("");
    const [password, _onChangePassword] = React.useState("");
    const [passwordVerify, _onChangePasswordVerify] = React.useState("");
    const [pwError, setPWError] = React.useState(false);

    const [badEmail, setBadEmail] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const onToggleSnackBar = () => setVisible(true);
    const onDismissSnackBar = () => setVisible(false);

    const [existsVisible, setExistsVisible] = React.useState(false);
    const onToggleExistsSnackBar = () => setExistsVisible(true);
    const onDismissExistsSnackBar = () => setExistsVisible(false);

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
            <Text style = {styles.header}>Passwords must contain at least 6 characters!</Text>
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
                <View style={styles.container}>
                    <Snackbar style={styles.iosSnackbar}
                        visible={visible}
                        onDismiss={onDismissSnackBar}
                        duration={Snackbar.DURATION_SHORT}
                        theme={{ colors: { surface: 'black' }}}
                        >
                        {badEmail ? "Please enter a valid email adddress..." : "Your password must contain at least 6 characters..."}
                    </Snackbar>
                    <Snackbar style={styles.iosExistsSnackbar}
                        visible={existsVisible}
                        onDismiss={onDismissExistsSnackBar}
                        duration={Snackbar.DURATION_SHORT}
                        theme={{ colors: { surface: 'black' }}}
                        >
                        This email is already associated with an account! Return to the login screen...
                    </Snackbar>
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
    }, header: {
        alignSelf: 'center'
    },
    iosSnackbar: {
        backgroundColor: 'white',
        width: 300,
        marginHorizontal: 120,
        marginVertical: 330,
        alignSelf: 'center'
    },
    iosExistsSnackbar: {
        backgroundColor: 'white',
        width: 300,
        marginHorizontal: 120,
        marginVertical: 330,
        alignSelf: 'center'
    },
});