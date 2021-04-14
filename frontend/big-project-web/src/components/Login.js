import { Box, Button, Container, makeStyles, TextField, Avatar, CssBaseline, FormControlLabel, Checkbox, Link, Grid, Typography} from '@material-ui/core';
import { React, useState } from 'react';
import { useAuth, useUser } from 'reactfire';
import 'firebase/auth';
import { useHistory } from 'react-router';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';


export default function LoginPage(props) {
    const styles = useStyles();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
    // return (
    //     <Container maxWidth="md">
    //         <form>
    //             <Box display='flex' justifyContent='center' alignContent='center' alignItems='center' flexDirection='column'>
    //                 <TextField className={styles.field} required id='emailField' label='Email Address' type='email' variant='outlined' onChange={(event) => setEmail(event.target.value)} autoFocus={true}></TextField>
    //                 <TextField className={styles.field} required id='emailField' type='password' label='Password' variant='outlined' onChange={(event) => setPassword(event.target.value)}></TextField>
    //                 <Button variant='contained' color='primary' onClick={() => logInUser()}>Login</Button>
    //             </Box>
    //         </form>
    //     </Container>
    // )

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
            <form className={styles.form} noValidate>
              <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus onChange={(event) => setEmail(event.target.value)} autoFocus={true}/>
              <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" onChange={(event) => setPassword(event.target.value)}/>
              <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me"/>
              <Button type="submit" fullWidth variant="contained" color="primary" className={styles.submit} onClick={() => logInUser()}> Sign In </Button>
              
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