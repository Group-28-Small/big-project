import { AppBar, Button, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { firebaseConfig, setAuthHandler } from 'big-project-common'
import { useEffect, useState } from 'react';
import { FirebaseAppProvider, useAuth, useFirebaseApp } from 'reactfire';
import RouteController from './RouteController';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import moment from 'moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={false}>
      <BrowserRouter>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <RouteController />
        </MuiPickersUtilsProvider>
      </BrowserRouter>
    </FirebaseAppProvider>
  );
}


export default App;
