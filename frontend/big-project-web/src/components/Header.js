import { AppBar, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { appName } from 'big-project-common';
import 'firebase/auth';
import React from 'react';
import LogInOutButton from './LogInOutButton';

export default function Header(props) {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          {appName}
        </Typography>
        <LogInOutButton isSignedIn={props.isSignedIn} />
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


