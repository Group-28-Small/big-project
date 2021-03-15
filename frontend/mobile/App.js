import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import 'firebase/auth';
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from 'react-native';
// import { StyleSheet, Text, View, Link, AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import { FirebaseAppProvider, useAuth, useFirebaseApp, useUser } from 'reactfire';
import { IndexPage } from './pages/index';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
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

export default function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={false}>
      <AppNav />
    </FirebaseAppProvider>
  );
}

function AppNav() {
  const Stack = createStackNavigator();

  var [isSignedIn, setSignedIn] = useState(false);
  var [isEmailVerified, setEmailVerified] = useState(false);
  var [emailVerifyTimer, setTimer] = useState(null);


  const auth = useAuth();
  const firebase = useFirebaseApp();
  const reloadUser = () => {
    console.log("reloading user");
    firebase.auth().currentUser.reload().then(() => {
      firebase.auth().currentUser.getIdToken(true);
    });
  }
  useEffect(() => {
    return () => {
      // componentwillunmount in functional component.
      // Anything in here is fired on component unmount.
      if (emailVerifyTimer != null) {
        clearInterval(emailVerifyTimer);
      }
    }
  }, [])
  firebase.auth().onIdTokenChanged((user) => {
    // console.log("id token changed");
    // console.log(user);
    if (user && user.emailVerified) {
      setEmailVerified(user.emailVerified);
      clearInterval(emailVerifyTimer);
    } else {
      setEmailVerified(false);
    }
  })
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // console.log("we have a user");
      setSignedIn(true);
      setEmailVerified(user.emailVerified);
      if (!user.emailVerified && emailVerifyTimer == null) {
        var timer = setInterval(reloadUser, 3000);
        setTimer(timer);
      } else if (user.emailVerified && emailVerifyTimer != null) {
        clearInterval(emailVerifyTimer);
      }
    } else {
      setSignedIn(false);
      console.log("no account")
      if (emailVerifyTimer != null) {
        clearInterval(emailVerifyTimer);

      }
    }
  });
  const signOutUser = () => {
    auth.signOut().then(() => {
      console.log("Signed out");
    }).catch(() => {
      console.log("error");
    });
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
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
            )
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
}
