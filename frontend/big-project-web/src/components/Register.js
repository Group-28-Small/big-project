import { Box, Button, Container, makeStyles, TextField, Avatar, CssBaseline, FormControlLabel, Checkbox, Link, Grid, Typography } from '@material-ui/core';
import { React, useState } from 'react';
import { useAuth, useFirestore } from 'reactfire';
import 'firebase/auth';
import 'firebase/firestore';
import { getOrCreateUserDocument } from 'big-project-common';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

export default function RegisterPage(props) {
    const styles = useStyles();

    const [email, setEmail] = useState("");
    const [password, _onChangePassword] = useState("");
    const [passwordVerify, _onChangePasswordVerify] = useState("");
    const [pwError, setPWError] = useState(true);

    const auth = useAuth();
    const db = useFirestore();
    const register = () => {
        console.log("registering");
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                console.log(user);
                getOrCreateUserDocument(user.uid, db);
                console.log("sending email");
                return user.sendEmailVerification();
                // ...
            }).
            then(function () {
                // Email sent.
                console.log("email sent");
            }).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("error" + errorMessage);
                // ..
            });
        console.log("async register sent");

    }

    const onChangePassword = (pw) => {
        _onChangePassword(pw);
        if (pw !== passwordVerify) {
            setPWError(true)
        } else {
            setPWError(false);
        }
    }
    const onChangePasswordVerify = (pw) => {
        _onChangePasswordVerify(pw);
        if (pw !== password) {
            setPWError(true)
        } else {
            setPWError(false);
        }
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={styles.paper}>
                <Avatar className={styles.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
            </Typography>
                <form className={styles.form} noValidate>
                    <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus onChange={(event) => setEmail(event.target.value)} autoFocus={true} />
                    <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" onChange={(event) => onChangePassword(event.target.value)} />
                    <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password Verify" type="password" id="password" autoComplete="current-password" onChange={(event) => onChangePasswordVerify(event.target.value)} error={pwError} />
                    <Button fullWidth variant="contained" color="primary" className={styles.submit} onClick={() => register()} disabled={pwError}> Register </Button>
                </form>
            </div>
        </Container>
    );
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
