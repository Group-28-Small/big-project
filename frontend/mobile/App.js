import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'firebase/auth';
import React from 'react';
import { Button } from 'react-native';
// import { StyleSheet, Text, View, Link, AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import { FirebaseAppProvider, useAuth, useUser } from 'reactfire';
import { IndexPage } from './pages/index';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
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
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <AppNav />
    </FirebaseAppProvider>
  );
}

function AppNav() {
  const Stack = createStackNavigator();
  var isSignedIn = false;
  const auth = useAuth();
  const { data: user } = useUser();
  if (user != null) {
    isSignedIn = true;
    console.log(user);
  }
  console.log("issignedin " + isSignedIn);
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
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Register" component={RegisterPage} />
          </>
        )}
    </Stack.Navigator>
    </NavigationContainer>
  );
}
