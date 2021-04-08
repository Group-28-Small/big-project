import { useAuth } from "reactfire"
import React from 'react';
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
        return (
            <div>
                < Button component={Link} to={'/login'} color="inherit">Login</Button>
                < Button component={Link} to={'/register'} color="inherit">Register</Button>
            </div>
        );
    }

}