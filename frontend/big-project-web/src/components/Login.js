import { Box, Button, Container, makeStyles, TextField } from '@material-ui/core';
import { React } from 'react';
export default function LoginPage(props) {
    const styles = useStyles();
    const logInUser = () => {

    }
    return (
        <Container maxWidth="ms">
            <form>
                <Box display='flex' justifyContent='center' alignContent='center' alignItems='center' flexDirection='column'>
                    <TextField className={styles.field} required id='emailField' label='Email Address' type='email' variant='outlined' ></TextField>
                    <TextField className={styles.field} required id='emailField' type='password' label='Password' variant='outlined'></TextField>
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