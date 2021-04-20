import React from 'react';
import { StyleSheet, SafeAreaView, Button, Platform, ToastAndroid, View, Text } from 'react-native';
import { Snackbar, Button as PaperButton } from 'react-native-paper';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth, useFirebaseApp } from 'reactfire';
import AppStyles from '../styles';

export const LoginPage = props => {
    const [visible, setVisible] = React.useState(false);
    const [resetVisible, setResetVisible] = React.useState(false);
    const [isGoodEmail, setIsGoodEmail] = React.useState(true);
    const onToggleSnackBar = () => setVisible(true);
    const onDismissSnackBar = () => setVisible(false);
    const onToggleResetSnackBar = () => setResetVisible(true);
    const onDismissResetSnackBar = () => setResetVisible(false);
    const [email, onChangeEmail] = React.useState("");
    const [password, onChangePassword] = React.useState("");
    const auth = useAuth();
    const login = () => auth.signInWithEmailAndPassword(email, password).then(result => {
        console.log(result);
    }).catch(() => {
        console.log("false");
        if (Platform.OS === 'android') {
            ToastAndroid.show("Incorrect details", ToastAndroid.SHORT);
        } else if (Platform.OS === 'ios') {
            onDismissResetSnackBar()
            onToggleSnackBar()
        }
    });
    const dismissSnackbar = () => {
        onDismissResetSnackBar()
        setIsGoodEmail(false)
    }
    const goToRegister = () => {
        props.navigation.navigate('Register');
    }
    const resetPassword = () => {
        auth.sendPasswordResetEmail(email).then(() => {
            // do nothing bc why now
            setIsGoodEmail(true)
            console.log("it worked?");
        }, error => {
            setIsGoodEmail(false)
            console.log("error");
            console.log(error.message);
        }).then(() => {
        if(Platform.OS === 'ios'){
            onDismissSnackBar()
            onToggleResetSnackBar()
        } else if(Platform.OS === 'android'){
            if(isGoodEmail){
                ToastAndroid.show("We have sent you an email with instructions on how to reset your password.", ToastAndroid.SHORT);
            } else{
                ToastAndroid.show("Please input a properly formatted email.", ToastAndroid.SHORT);
            }
        }
    });
    }
    if (auth.currentUser != null) {
        console.log("wait a minute...");
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
                <View style={styles.submitButton}>
                    <Button title="Login" onPress={() => login()} color={"#4caf50"} />
                </View>
            </SafeAreaView >
            <View style={styles.registerButton}>
                <Button title="Register" onPress={() => goToRegister()} />
            </View>
            <View style={styles.registerButton}>
                <PaperButton onPress={() => resetPassword()} mode="outlined" >Forgot Password</PaperButton>
            </View>
            <View style={styles.container}>
                <Snackbar style={styles.iosSnackbar}
                    visible={visible}
                    onDismiss={onDismissSnackBar}
                    duration={Snackbar.DURATION_SHORT}
                    theme={{ colors: { surface: 'black' }}}
                    >
                    Incorrect Details
                </Snackbar>
                <Snackbar style={styles.iosResetSnackbar}
                    visible={resetVisible}
                    onDismiss={dismissSnackbar}
                    duration={Snackbar.DURATION_SHORT}
                    theme={{ colors: { surface: 'black' }}}
                    >
                    {isGoodEmail ? "We have sent you an email with instructions on how to reset your password." : "Please input a properly formatted email."}
                </Snackbar>
            </View>
        </View >
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
        marginHorizontal: 10,
        marginVertical: 5,
    },
    registerButton: {
        marginHorizontal: 10,
        marginVertical: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
      },
    iosSnackbar: {
        backgroundColor: 'white',
        width: 140,
        marginHorizontal: 120,
        marginVertical: 250,
    },
    iosResetSnackbar: {
        backgroundColor: 'white',
        width: 330,
        marginHorizontal: 120,
        marginVertical: 250,
        alignSelf: 'center'
    }
});