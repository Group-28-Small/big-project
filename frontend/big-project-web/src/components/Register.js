import { Box, Button, Container, makeStyles, TextField } from '@material-ui/core';
import { React, useState } from 'react';
import { useAuth, useFirestore } from 'reactfire';
import 'firebase/auth';
import 'firebase/firestore';
import { getOrCreateUserDocument } from 'big-project-common';

export default function RegisterPage(props) {
    const styles = useStyles();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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

    return (
//     <Container component="main" maxWidth="xs">
//         <CssBaseline />
//         <div className={classes.paper}>
//         <Avatar className={classes.avatar}>
//             <LockOutlinedIcon />
//         </Avatar>
//         <Typography component="h1" variant="h5">
//             Sign in
//         </Typography>
//         <form className={classes.form} noValidate>
//             <TextField
//             variant="outlined"
//             margin="normal"
//             required
//             fullWidth
//             id="email"
//             label="Email Address"
//             name="email"
//             autoComplete="email"
//             autoFocus
//             />
//             <TextField
//             variant="outlined"
//             margin="normal"
//             required
//             fullWidth
//             name="password"
//             label="Password"
//             type="password"
//             id="password"
//             autoComplete="current-password"
//             />
//             <FormControlLabel
//             control={<Checkbox value="remember" color="primary" />}
//             label="Remember me"
//             />
//             <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             color="primary"
//             className={classes.submit}
//             >
//             Sign In
//             </Button>
//             <Grid container>
//             <Grid item xs>
//                 <Link href="#" variant="body2">
//                 Forgot password?
//                 </Link>
//             </Grid>
//             <Grid item>
//                 <Link href="#" variant="body2">
//                 {"Don't have an account? Sign Up"}
//                 </Link>
//             </Grid>
//             </Grid>
//         </form>
//         </div>
//         <Box mt={8}>
//         <Copyright />
//         </Box>
//     </Container>
//   );
        <Container maxWidth="md">
            <form>
                <Box display='flex' justifyContent='center' alignContent='center' alignItems='center' flexDirection='column'>
                    <TextField className={styles.field} required id='emailField' label='Email Address' type='email' variant='outlined' onChange={(event) => setEmail(event.target.value)} autoFocus={true}></TextField>
                    <TextField className={styles.field} required id='emailField' type='password' label='Password' variant='outlined' onChange={(event) => setPassword(event.target.value)}></TextField>
                    <Button variant='contained' color='primary' onClick={() => register()}>Register</Button>
                </Box>
            </form>
        </Container>
    )
}

const useStyles = makeStyles((theme) => ({
    field: {
        margin: 8,
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));