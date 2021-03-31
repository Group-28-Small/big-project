import { AppBar, Button, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { firebaseConfig, setAuthHandler } from 'big-project-common';
import { useEffect, useRef, useState } from 'react';
import { FirebaseAppProvider, useAuth, useFirebaseApp } from 'reactfire';
import 'firebase/auth';
import './App.css';
import Header from './components/Header';
import { Redirect, Route, Router, Switch, useHistory } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './components/Login';
import VerifyEmailPage from './components/VerifyEmailPage';
import RegisterPage from './components/Register';
import MustBeSignedIn from './components/MustBeSignedIn';
import TaskTree from './components/TaskTree';

export default function RouteController() {
  const classes = useStyles();
  const firebase = useFirebaseApp();
  const auth = useAuth();

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
  const history = useHistory();

  // override setSignedIn so we can set the necessary routing on sign-out
  
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
        <Route path="/">
            {/* <MustBeSignedIn isEmailVerified={isEmailVerified} isSignedIn={isSignedIn} /> */}
          <Home />
        </Route>
        ) : (
          <>
            <Redirect exact from="/" to="/verifyemail" />
            <Route path="/verifyemail">
              {/* <MustBeSignedIn isEmailVerified={isEmailVerified} isSignedIn={isSignedIn} mustBeVerified={false} /> */}
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
            <div>loading...</div>
          </>
        )
        }
      </Switch >
    </>
  );
}
function Home() {
  return <TaskTree />;
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


