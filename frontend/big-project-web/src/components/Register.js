import { Avatar, Button, Container, CssBaseline, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { getOrCreateUserDocument } from 'big-project-common';
import 'firebase/auth';
import 'firebase/firestore';
import { React, useState } from 'react';
import { useAuth, useFirestore } from 'reactfire';

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
        <Paper className={styles.login} elevation ={3}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={styles.paper}>
                    <Avatar className={styles.avatar}>
                        <VpnKeyIcon />
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
        </Paper>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: theme.spacing(4),
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
    login: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: theme.spacing(50),
    }
}));
