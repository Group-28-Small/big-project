import { AppBar, Button, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { firebaseConfig, setAuthHandler } from 'big-project-common';
import { useEffect, useState } from 'react';
import { FirebaseAppProvider, useAuth, useFirebaseApp } from 'reactfire';
import 'firebase/auth';
import './App.css';
import Header from './components/Header';
import { Route, Router, Switch, useHistory } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './components/Login';

export default function RouteController() {
  const classes = useStyles();
  const firebase = useFirebaseApp();
  const auth = useAuth();

  var [isSignedIn, setStateSignedIn] = useState(undefined);
  var [isEmailVerified, setEmailVerified] = useState(false);
  var [emailVerifyTimer, setTimer] = useState(null);

  const history = useHistory();


  useEffect(() => {
    return () => {
      // componentwillunmount in functional component.
      // Anything in here is fired on component unmount.
      if (emailVerifyTimer != null) {
        clearInterval(emailVerifyTimer);
      }
    }
  }, [])
  // override setSignedIn so we can set the necessary routing on sign-out
  const setSignedIn = (signedIn) => {
    if (signedIn && !isSignedIn) {
      // transitioned from logged out to logged in
      history.push('/');
    }
    if (!signedIn && isSignedIn) {
      // logged in to logged out
      history.push('/login');
    }
    setStateSignedIn(signedIn);

  }
  setAuthHandler(firebase, setSignedIn, setEmailVerified, emailVerifyTimer, setTimer);
  return (
    <>
        <Header isSignedIn={isSignedIn} />
         <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
      </Switch>
    </>
  );
}
function Home() {
  return <h2>Home</h2>;
}


function Users() {
  return <h2>Users</h2>;
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


