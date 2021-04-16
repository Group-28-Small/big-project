import { Box, Button, Container, makeStyles, TextField, Avatar, CssBaseline, FormControlLabel, Checkbox, Link, Grid, Typography, Snackbar } from '@material-ui/core';
import { React, useState } from 'react';
import { useAuth, useUser } from 'reactfire';
import 'firebase/auth';
import { useHistory } from 'react-router';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';


export default function LoginPage(props) {
    const styles = useStyles();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

    const auth = useAuth();
    const history = useHistory();
    const logInUser = () => {
        console.log(email);
        auth.signInWithEmailAndPassword(email, password).then(result => {
            console.log(result);
            history.push("/");
        });
    }
    const { data: user } = useUser();
    if (user != null) {
        console.log("redirecting to home");
        history.push("/");
    }

  const resetPassword = () => {
    auth.sendPasswordResetEmail(email).then(() => {
      // do nothing bc why now
      // TODO: snacbar or toast?
      console.log("it worked?");
      setSnackbarOpen(true)
    }, error => {
      console.log("error");
      console.log(error.message);
    });
  }
    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={styles.paper}>
            <Avatar className={styles.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={styles.form}>
              <TextField variant="outlined" margin="normal" fullWidth required id='emailField' label='Email Address' type='email' variant='outlined' onChange={(event) => setEmail(event.target.value)} autoFocus={true}></TextField>
              <TextField variant="outlined" margin="normal" required fullWidth id='passField' type='password' label='Password' variant='outlined' onChange={(event) => setPassword(event.target.value)}></TextField>
              <Button fullWidth variant="contained" color="primary" className={styles.submit} onClick={() => logInUser()}> Sign In </Button>
            <Button fullWidth color="primary" className={styles.submit} onClick={() => resetPassword()} disabled={email === ''}> Reset Password </Button>
            </form>
          </div>
        <Snackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} autoHideDuration={6000} message="We've emailed a password-reset link to you" />
      </Container>

    )
}

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));