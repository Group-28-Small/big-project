var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");

/* some GET call */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

});

router.post('/register', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var username = req.body.username;
  // https://firebase.google.com/docs/auth/admin/manage-users#create_a_user
  admin.auth().createUser({
    email: email,
    emailVerified: false,
    password: password,
    displayName: username
  })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully created new user:', userRecord.uid);
      console.log(userRecord);
      // res.json(userRecord);
      admin.auth()
        .createCustomToken(userRecord.uid)
        .then((customToken) => {
          // Send token back to client
          res.json({ "token": customToken, "user_props": userRecord });

        })
        .catch ((error) => {
    console.log('Error creating custom token:', error);
    res.json({ "error": "some error" })
  });

    })
    .catch ((error) => {
  console.log('Error creating new user:', error);
  res.json({ "error": "some error" })
});
});

// router.get('/database_test', function (req, res, next) {
//   admin
//   .auth()
//   .createUser({
//     email: 'user@example.com',
//     emailVerified: false,
//     phoneNumber: '+11234567890',
//     password: 'secretPassword',
//     displayName: 'John Doe',
//     photoURL: 'http://www.example.com/12345678/photo.png',
//     disabled: false,
//   })
//   .then((userRecord) => {
//     // See the UserRecord reference doc for the contents of userRecord.
//     console.log('Successfully created new user:', userRecord.uid);
//   })
//   .catch((error) => {
//     console.log('Error creating new user:', error);
//   });

//   res.send(admin.app().name);
// });

module.exports = router;
