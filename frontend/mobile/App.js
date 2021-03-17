import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Button, View } from 'react-native';
import { FirebaseAppProvider, useAuth, useFirebaseApp } from 'reactfire';
import { IndexPage } from './pages/index';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { VerifyPage } from './pages/verify_email';
import { is_production, setAuthHandler } from 'big-project-common';
import AppStyles from './styles';
import { LogBox } from 'react-native';
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
  var [emailVerifyTimer, setTimer] = useState(null);


  const auth = useAuth();
  const firebase = useFirebaseApp();
  useEffect(() => {
    return () => {
      // componentwillunmount in functional component.
      // Anything in here is fired on component unmount.
      if (emailVerifyTimer != null) {
        clearInterval(emailVerifyTimer);
      }
    }
  }, [])
  setAuthHandler(firebase, setSignedIn, setEmailVerified, emailVerifyTimer, setTimer);
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
    );
  } else {
    console.log("loading...");
    return (
      <View style={AppStyles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}