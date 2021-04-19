import { makeStyles } from '@material-ui/core';
import { setAuthHandler } from 'big-project-common';
import 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { preloadFirestore, useFirebaseApp } from 'reactfire';
import './App.css';
import Header from './components/Header';
import { Home } from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/Register';
import VerifyEmailPage from './components/VerifyEmailPage';

export default function RouteController() {
  const firebase = useFirebaseApp();

  var [isSignedIn, setSignedIn] = useState(undefined);
  var [isEmailVerified, setEmailVerified] = useState(false);
  var [_emailVerifyTimer, _setTimer] = useState(null);
  // state management is hard
  const emailVerifyTimer = useRef(_emailVerifyTimer);
  const setTimer = (value) => {
    if (value !== _emailVerifyTimer) {
      _setTimer(value);
    }
    emailVerifyTimer.current = value;
  }

  // override setSignedIn so we can set the necessary routing on sign-out

  useEffect(
    () => {
      preloadFirestore({
        firebaseApp: firebase,
        setup: firestore => firestore().enablePersistence()
      });
      const [tokenCB, authCB] = setAuthHandler(firebase, setSignedIn, setEmailVerified, emailVerifyTimer, setTimer);

      // this will clear Timeout
      // when component unmount like in willComponentUnmount
      // and show will not change to true
      return () => {
        tokenCB();
        authCB();
      };
    },
    // useEffect will run only one time with empty []
    // if you pass a value to array,
    // like this - [data]
    // than clearTimeout will run every time
    // this value changes (useEffect re-run)
    []
  );

  var isFirebaseLoaded = isSignedIn !== undefined;
  const LoginAndRegister = () => {
    return (
      <>
        <Redirect exact from="/" to="/login" />
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/register">
          <RegisterPage />
        </Route>
      </>
    )
  }
  const SignedInRoutes = () => {
    return (
      <>
        {isEmailVerified ? (
          <>
            <Route path="/">
              <Home />
            </Route>
            <Redirect to='/' />
          </>
        ) : (
          <>
            <Redirect exact from="/" to="/verifyemail" />
              <Route path="/verifyemail">
              <VerifyEmailPage />
            </Route>
          </>
        )}
      </>
    )
  }
  if (isEmailVerified && !!emailVerifyTimer) {
    clearInterval(emailVerifyTimer);
    setTimer(null);
  }
  return (
    <>
      <Header isSignedIn={isSignedIn} />
      <Switch>
        {isFirebaseLoaded ? (
          <>
            {isSignedIn ? (<SignedInRoutes />) : (
              <LoginAndRegister />
            )}
          </>
        ) : (
          <>
            {/* TODO: some kind of loading indicator */}
              <div>Loading Libraries...</div>
          </>
        )
        }
      </Switch >
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


