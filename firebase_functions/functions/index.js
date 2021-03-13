const functions = require('firebase-functions');
const fetch = require('node-fetch');
const admin = require('firebase-admin');
admin.initializeApp({ 'serviceAccountId': 'cloud-functions@cop4331-group21-bigproject.iam.gserviceaccount.com' });

const apikey = "AIzaSyCYvKayqGp4GXJhtOjATxZoZLG5Y0XEntI";
const exchangeCustomTokenEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apikey}`;
const sendEmailVerificationEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apikey}`;

exports.verify_email = functions.auth.user().onCreate(async (user) => {
  if (!user.emailVerified) {
    try {
      const customToken = await admin.auth().createCustomToken(user.uid);

      const { idToken } = await fetch(exchangeCustomTokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: customToken,
          returnSecureToken: true,
        }),
      }).then((res) => res.json());

      const response = await fetch(sendEmailVerificationEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'VERIFY_EMAIL',
          idToken: idToken,
        }),
      }).then((res) => res.json());

      // eslint-disable-next-line no-console
      console.log(`Sent email verification to ${response.email}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
});