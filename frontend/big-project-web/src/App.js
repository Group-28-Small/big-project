import { AppBar, Button, IconButton, makeStyles, Toolbar, Typography, createMuiTheme, ThemeProvider } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { firebaseConfig, setAuthHandler, AppTheme } from 'big-project-common'
import { useEffect, useState } from 'react';
import { FirebaseAppProvider, useAuth, useFirebaseApp } from 'reactfire';
import RouteController from './RouteController';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import moment from 'moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import ErrorBoundary from './components/ErrorBoundary'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: AppTheme.primaryColor,
      light: AppTheme.primaryLightColor,
      dark: AppTheme.primaryDarkColor
    },
    secondary: {
      main: AppTheme.secondaryColor,
      light: AppTheme.secondaryLightColor,
      dark: AppTheme.secondaryDarkColor
    }
  }
  // to change default text theming do  
  // typography: {...}
  // refer to material-ui default-theme
});

function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={false}>
      <BrowserRouter>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <ThemeProvider theme={theme}>
            <ErrorBoundary>
              <RouteController />
            </ErrorBoundary>
            </ThemeProvider>
        </MuiPickersUtilsProvider>
      </BrowserRouter>
    </FirebaseAppProvider>
  );
}


export default App;
