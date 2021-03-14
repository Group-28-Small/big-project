import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import { StyleSheet, Text, View, Link, AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import 'firebase/firestore';
import { FirebaseAppProvider, useFirestoreDocData, useFirestore } from 'reactfire';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
  const Stack = createStackNavigator();
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={IndexPage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={RegisterPage} />
      </Stack.Navigator>
      </NavigationContainer>
    </FirebaseAppProvider>
  );
}
