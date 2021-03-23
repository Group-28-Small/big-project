import { AppBar, Button, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { firebaseConfig, setAuthHandler } from 'big-project-common';
import { useEffect, useState } from 'react';
import { FirebaseAppProvider, useAuth, useFirebaseApp } from 'reactfire';
import 'firebase/auth';
import './App.css';
import Header from './components/Header';
import { Route, Router, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './components/Login';

export default function RouteController() {
  const classes = useStyles();
  const firebase = useFirebaseApp();
  const auth = useAuth();

  var [isSignedIn, setSignedIn] = useState(undefined);
  var [isEmailVerified, setEmailVerified] = useState(false);
  var [emailVerifyTimer, setTimer] = useState(null);


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
  return (
    <>
      <BrowserRouter>
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
      </BrowserRouter>
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


