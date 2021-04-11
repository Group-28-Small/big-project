import React from 'react';
import { Redirect } from 'react-router';
import { useAuth, useUser } from 'reactfire';
import 'firebase/auth';

export default function MustBeSignedIn(props) {
    console.log("signin guard")
    console.log(props.isSignedIn)
    console.log(props.isEmailVerified)
    if (props.isSignedIn) {
        if (!props.isEmailVerified && props.mustBeVerified) {
            return (<Redirect to={'/verifyemail'} />)
        }
        return null;
    } else {
        return (<Redirect to={'/login'} />)
    }
}
