import React from 'react';
import { StyleSheet, SafeAreaView, Button, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import '../styles';
import { useAuth, useUser } from 'reactfire';
import AppStyles from '../styles';

export const LoginPage = props => {
    const [email, onChangeEmail] = React.useState("");
    const [password, onChangePassword] = React.useState("");
    const auth = useAuth();
    const login = () => auth.signInWithEmailAndPassword(email, password).then((result) => {
        console.log(result);
    }).catch(() => {
        console.log("false");
        Alert.alert("Incorrect details");
    });
    const goToRegister = () => {
        props.navigation.navigate('Register');
    }
    var user = useUser();
    if (user !== undefined) {
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
    }
});