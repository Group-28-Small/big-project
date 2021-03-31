function setAuthHandler(firebase, setSignedIn, setEmailVerified, emailVerifyTimer, setTimer) {
    const tokenChanged = firebase.auth().onIdTokenChanged((user) => {
        // console.log("id token changed");
        // console.log(user);
        if (user && user.emailVerified) {
            setEmailVerified(user.emailVerified);
            if (!!emailVerifyTimer.current) {
                clearInterval(emailVerifyTimer.current);
                setTimer(null);
            }
        } else {
            setEmailVerified(false);
        }
    })
    const reloadUser = (firebase) => {
        console.log("reloading user");
        firebase.auth().currentUser.reload().then(() => {
            firebase.auth().currentUser.getIdToken(true);
            if (firebase.auth().currentUser.emailVerified) {
                clearInterval(emailVerifyTimer.current);
            }
        });
    }
    const authChanged = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("we have a user");
            setSignedIn(true);
            setEmailVerified(user.emailVerified);
            if (!user.emailVerified && emailVerifyTimer.current == null) {
                console.log("timer set!");
                setTimer(setInterval(() => reloadUser(firebase), 3000));
            } else if (user.emailVerified && !!emailVerifyTimer.current) {
                clearInterval(emailVerifyTimer.current);
                setTimer(null);
            }
        } else {
            setSignedIn(false);
            console.log("no account")
            if (!!emailVerifyTimer.current) {
                clearInterval(emailVerifyTimer.current);
                setTimer(null);
            }
        }
    });
    return [tokenChanged, authChanged]

}
const firebaseConfig = {
    apiKey: "AIzaSyDhZOTZT7X9YC8krs7imlVPvFcFMs8RKhk",
    authDomain: "cop4331-group21-bigproject.firebaseapp.com",
    projectId: "cop4331-group21-bigproject",
    storageBucket: "cop4331-group21-bigproject.appspot.com",
    messagingSenderId: "889125348839",
    appId: "1:889125348839:web:a6944e63b1dbeed4650942",
    measurementId: "G-WWX445V9VE"
};

module.exports = { setAuthHandler, firebaseConfig };