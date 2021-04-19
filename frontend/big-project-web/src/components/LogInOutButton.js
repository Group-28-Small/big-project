import { useAuth, useFirebaseApp, useFirestore } from "reactfire"
import React from 'react';
import { Button } from "@material-ui/core";
import { Link } from 'react-router-dom';


export default function LogInOutButton(props) {
    const auth = useAuth();
    const db = useFirestore();
    const logout = (event) => {
        console.log("logging out");
        auth.signOut();
        db.terminate();
    }

    // const login = (
    //     < Button component={Link} to={'/login'} color="inherit">Login</Button>
    // )

    // const register = (
    //     < Button component={Link} to={'/register'} color="inherit">Register</Button>
    // )

    if (props.isSignedIn) {
        return (
            <Button color='inherit' onClick={logout}>Logout</Button>
        )
    } else {
        return (
            <div>
                < Button component={Link} to={'/login'} color="inherit" >Login</Button>
                < Button component={Link} to={'/register'} color="inherit" >Register</Button>
            </div>
        );
    }

}