import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Button, Modal, View } from 'react-native';
import { FirebaseAppProvider, useAuth, useFirebaseApp } from 'reactfire';
import { IndexPage } from './pages/index';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { VerifyPage } from './pages/verify_email';
import { EditTaskPage, NewTaskPage } from './pages/edit_task';
import { is_production, setAuthHandler, AppTheme } from 'big-project-common';
import AppStyles from './styles';
import { LogBox } from 'react-native';
import LoadingScreen from './pages/loadingscreen';
import { useRef } from 'react';
import { SessionHistoryPage } from './pages/session_history';

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
  const ModalStack = createStackNavigator();
  return (
    <NavigationContainer>
      <ModalStack.Navigator>
        <ModalStack.Screen name="MainApp" component={MainAppNav} options={{ headerShown: false }} />
        <ModalStack.Screen name="TaskDoneScreen" component={LoadingScreen} />
      </ModalStack.Navigator>
    </NavigationContainer>
  )
}

function MainAppNav() {
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

  // override setSignedIn so we can set the necessary routing on sign-out
  
  const auth = useAuth();
  const firebase = useFirebaseApp();
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
    },
  );
  const signOutUser = () => {
    auth.signOut().then(() => {
      console.log("Signed out");
    }).catch(() => {
      console.log("error");
    });
  }
  var isFirebaseLoaded = isSignedIn !== undefined;
  if (isFirebaseLoaded) {
    const verifiedEmailOrHome =
      isEmailVerified ? (
        <>
          <Stack.Screen name="Home" component={IndexPage} options={{
            headerRight: () => (
              <Button
                onPress={() => signOutUser()}
                title="logout"
                color="#000"
              />
            ),
          }} />
          <Stack.Screen name="New Task" component={NewTaskPage} options={{
            headerRight: () => (
              <Button
                onPress={() => signOutUser()}
                title="logout"
                color="#000"
              />
            ),
            ...TransitionPresets.SlideFromRightIOS
          }} />
          <Stack.Screen name="Previous Entries" component={SessionHistoryPage} options={{
            headerRight: () => (
              <Button
                onPress={() => signOutUser()}
                title="logout"
                color="#000"
              />
            ),
            ...TransitionPresets.SlideFromRightIOS
          }} />
        <Stack.Screen name="Edit Task" component={EditTaskPage} options={{
            headerRight: () => (
              <Button
                onPress={() => signOutUser()}
                title="logout"
                color="#000"
              />
            ),
            ...TransitionPresets.SlideFromRightIOS
          }} />
        </>) : (
        <>
          <Stack.Screen name="VerifyEmail" component={VerifyPage} options={{
            headerRight: () => (
              <Button
                onPress={() => signOutUser()}
                title={isEmailVerified ? "yes" : "no"}
                color="#000"
              />
            ),
          }} />
        </>
      );
    return (
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
    );
  } else {
    console.log("loading...");
    return (
      <LoadingScreen />
    );
  }
}