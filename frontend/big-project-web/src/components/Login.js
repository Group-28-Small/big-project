import { Box, Button, Container, makeStyles, TextField } from '@material-ui/core';
import { React, useState } from 'react';
import { useAuth } from 'reactfire';
import 'firebase/auth';
export default function LoginPage(props) {
    const styles = useStyles();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const auth = useAuth();
    const logInUser = () => {
        console.log(email);
        auth.signInWithEmailAndPassword(email, password).then(result => {
            console.log(result);
        });
    }
    return (
        <Container maxWidth="ms">
            <form>
                <Box display='flex' justifyContent='center' alignContent='center' alignItems='center' flexDirection='column'>
                    <TextField className={styles.field} required id='emailField' label='Email Address' type='email' variant='outlined' onChange={(event) => setEmail(event.target.value)} autoFocus={true}></TextField>
                    <TextField className={styles.field} required id='emailField' type='password' label='Password' variant='outlined' onChange={(event) => setPassword(event.target.value)}></TextField>
                    <Button variant='contained' color='primary' onClick={() => logInUser()}>Login</Button>
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