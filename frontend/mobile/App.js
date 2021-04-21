import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { is_production, setAuthHandler } from 'big-project-common';
import 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { LogBox, StyleSheet } from 'react-native';
import Dialog from 'react-native-dialog';
import { Button, Menu, Provider, Snackbar } from 'react-native-paper';
import { FirebaseAppProvider, useAuth, useFirebaseApp } from 'reactfire';
import { EditTaskPage, NewTaskPage } from './pages/edit_task';
import { IndexPage } from './pages/index';
import LoadingScreen from './pages/loadingscreen';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { SessionHistoryPage } from './pages/session_history';
import { VerifyPage } from './pages/verify_email';

var firebaseConfig = {
  apiKey: "AIzaSyDhZOTZT7X9YC8krs7imlVPvFcFMs8RKhk",
  authDomain: "cop4331-group21-bigproject.firebaseapp.com",
  projectId: "cop4331-group21-bigproject",
  storageBucket: "cop4331-group21-bigproject.appspot.com",
  messagingSenderId: "889125348839",
  appId: "1:889125348839:web:a6944e63b1dbeed4650942",
  measurementId: "G-WWX445V9VE"
};

if (!is_production()) {
  LogBox.ignoreLogs(['Setting a timer']);
}

export default function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={false}>
      <AppNav />
    </FirebaseAppProvider>
  );
}

function AppNav() {
  const Stack = createStackNavigator();

  var [isSignedIn, setSignedIn] = useState(undefined);
  var [isEmailVerified, setEmailVerified] = useState(false);
  var [_emailVerifyTimer, _setTimer] = useState(null);
  // state management is hard
  const emailVerifyTimer = useRef(_emailVerifyTimer);
  const setTimer = (value) => {
    if (value != _emailVerifyTimer) {
      _setTimer(value);
    }
    emailVerifyTimer.current = value;
  }

  const auth = useAuth();
  const firebase = useFirebaseApp();
  const [menuVisible, setMenuVisible] = useState(false);
  const [pass, changePass] = React.useState("");
  const [isSnackbarVisible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(true);
  const onDismissSnackBar = () => setVisible(false);
  const dismissSnackbar = () => {
    changeBadPass(false)
    onDismissSnackBar()
  }
  useEffect(
    () => {
      const [tokenCB, authCB] = setAuthHandler(firebase, setSignedIn, setEmailVerified, emailVerifyTimer, setTimer);

      // this will clear Timeout
      // when component unmount like in willComponentUnmount
      // and show will not change to true
      return () => {
        tokenCB();
        authCB();
      };
    }, [menuVisible]
  );
  const signOutUser = () => {
    auth.signOut().then(() => {
      console.log("Signed out");
    }).catch(() => {
      console.log("error");
    });
  }
  const SignOutButton = () => (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={<Button onPress={() => setMenuVisible(true)} icon='dots-vertical' />}
      style={{
        paddingTop: 50,
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <Menu.Item onPress={() => signOutUser()} title="Logout" />
      <Menu.Item onPress={() => setDialogOpen(true)} title="Delete Account" />
    </Menu>
  )
  const deleteAccount = () => {
    var credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      pass
    );
    console.log(credential)
    user.reauthenticateWithCredential(credential).then(() => {
      user.delete()
    }).catch(() => {
      console.log('bad')
      changeBadPass(true)
      onToggleSnackBar()
    });
  }
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const AccountDialogTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  const AccountDeletionDialog = () => (
    <Dialog.Container
      visible={isDialogOpen}
      TransitionComponent={AccountDialogTransition}
      keepMounted
      onClose={() => setDialogOpen(false)}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <Dialog.Title id="alert-dialog-slide-title">{"Delete Account?"}</Dialog.Title>
      <Dialog.Description id="alert-dialog-slide-description">
        Are you sure you want to delete your account? If so, enter your password and click Agree. This can't be undone!
                        </Dialog.Description>
      <Dialog.Input placeholder="Password" autoCompleteType="password" onChangeText={changePass} secureTextEntry={true}></Dialog.Input>
      <Dialog.Button onPress={() => setDialogOpen(false)} color="red" label="Disagree">
        Disagree
                        </Dialog.Button>
      <Dialog.Button onPress={deleteAccount} color="green" label="Agree">
        Agree
                        </Dialog.Button>
    </Dialog.Container>
  )
  var isFirebaseLoaded = isSignedIn !== undefined;
  if (isFirebaseLoaded) {
    const verifiedEmailOrHome =
      isEmailVerified ? (
        <>
          <Stack.Screen name="Home" component={IndexPage} options={{
            headerRight: SignOutButton,
          }} />
          <Stack.Screen name="New Task" component={NewTaskPage} options={{
            headerRight: SignOutButton,
            ...TransitionPresets.SlideFromRightIOS
          }} />
          <Stack.Screen name="Previous Entries" component={SessionHistoryPage} options={{
            headerRight: SignOutButton,
            ...TransitionPresets.SlideFromRightIOS
          }} />
          <Stack.Screen name="Edit Task" component={EditTaskPage} options={{
            headerRight: SignOutButton,
            ...TransitionPresets.SlideFromRightIOS
          }} />
        </>) : (
        <>
          <Stack.Screen name="Verify Email" component={VerifyPage} options={{
            headerRight: () => (
              <Button
                onPress={() => signOutUser()}
                //this was probably useful for testing, but at this point looks odd
                // title={isEmailVerified ? "yes" : "no"}
                title="return"
                color="#000"
              />
            ),
          }} />
        </>
      );
    return (
      <Provider>
        <NavigationContainer>
          <Stack.Navigator>
            {isSignedIn ? (
              verifiedEmailOrHome
            ) : (
              <>
                <Stack.Screen name="Login" component={LoginPage} options={{
                  ...TransitionPresets.SlideFromRightIOS
                }}

                />
                <Stack.Screen name="Register" component={RegisterPage} options={{
                  ...TransitionPresets.SlideFromRightIOS
                }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <AccountDeletionDialog />
        <Snackbar
          style={styles.iosSnackbar}
          visible={isSnackbarVisible}
          onDismiss={dismissSnackbar}
          duration={Snackbar.DURATION_SHORT}
          theme={{ colors: { surface: 'black' } }}>
          "Incorrect Password"
                </Snackbar>
      </Provider>
    );
  } else {
    console.log("loading...");
    return (
      <LoadingScreen />
    );
  }
}
const styles = StyleSheet.create({
  iosSnackbar: {
    backgroundColor: 'white',
    width: 165,
    position: 'absolute',
    bottom: 0,
    elevation: 1,
    alignSelf: 'center'
  }
});
