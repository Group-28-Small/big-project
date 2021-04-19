import MomentUtils from '@date-io/moment';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { AppTheme, firebaseConfig } from 'big-project-common';
import { BrowserRouter } from 'react-router-dom';
import { FirebaseAppProvider } from 'reactfire';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import RouteController from './RouteController';

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
