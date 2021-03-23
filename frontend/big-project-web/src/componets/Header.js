import { AppBar, Button, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { firebaseConfig, setAuthHandler } from 'big-project-common';
import { useEffect, useState } from 'react';
import { FirebaseAppProvider, useAuth, useFirebaseApp } from 'reactfire';
import 'firebase/auth';

export default function Header(props) {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          News
        </Typography>
        {props.isSignedIn ? (<Button color='inherit'>Logout</Button>) : (< Button color="inherit">Login</Button>)}
      </Toolbar>
    </AppBar >
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


