import { set } from "react-native-reanimated";

function setAuthHandler(firebase, setSignedIn, setEmailVerified, emailVerifyTimer, setTimer) {
    firebase.auth().onIdTokenChanged((user) => {
        // console.log("id token changed");
        // console.log(user);
        if (user && user.emailVerified) {
            setEmailVerified(user.emailVerified);
            clearInterval(emailVerifyTimer);
        } else {
            setEmailVerified(false);
        }
    })
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // console.log("we have a user");
            setSignedIn(true);
            setEmailVerified(user.emailVerified);
            if (!user.emailVerified && emailVerifyTimer == null) {
                var timer = setInterval(() => reloadUser(firebase), 3000);
                setTimer(timer);
            } else if (user.emailVerified && emailVerifyTimer != null) {
                clearInterval(emailVerifyTimer);
            }
        } else {
            setSignedIn(false);
            console.log("no account")
            if (emailVerifyTimer != null) {
                clearInterval(emailVerifyTimer);

            }
        }
    });

}
const reloadUser = (firebase) => {
    console.log("reloading user");
    firebase.auth().currentUser.reload().then(() => {
        firebase.auth().currentUser.getIdToken(true);
    });
}
export { setAuthHandler };