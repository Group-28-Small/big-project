import { useAuth } from "reactfire"
import Reach from 'react';
import { Button } from "@material-ui/core";
import { Link } from 'react-router-dom';

export default function LogInOutButton(props) {
    const auth = useAuth();
    const logout = (event) => {
        console.log("logging out");
        auth.signOut();
    }
    if (props.isSignedIn) {
        return (
            <Button color='inherit' onClick={logout}>Logout</Button>
        )
    } else {

        return (< Button component={Link} to={'/login'} color="inherit">Login</Button>);
    }

}