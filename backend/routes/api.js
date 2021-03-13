var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");

/* some GET call */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
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
