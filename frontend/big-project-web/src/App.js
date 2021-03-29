import { AppBar, Button, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { firebaseConfig, setAuthHandler } from 'big-project-common'
import { useEffect, useState } from 'react';
import { FirebaseAppProvider, useAuth, useFirebaseApp } from 'reactfire';
import RouteController from './RouteController';
import './App.css';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={false}>
      <BrowserRouter>
        <RouteController />
      </BrowserRouter>
    </FirebaseAppProvider>
  );
}


export default App;
