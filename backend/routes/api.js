var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
var firestore = admin.firestore()

/* some GET call */
router.get('/:userToken/:_searchText', function (req, res, next) {
  const { userToken, _searchText } = req.params;
  const searchText = _searchText.toLowerCase();
  admin.auth().verifyIdToken(userToken).then((decodedToken) => {
    const uid = decodedToken.uid;
    let query = firestore.collection('tasks').where("user", "==", firestore.collection('users').doc(uid));
    return query.get()
  }).then((result) => {
    const tasks = []
    result.forEach((d) => {
      // clear the user field, since that has keys in it
      const data = d.data()
      data.user = undefined;
      const name = d.data().name
      if (name.toLowerCase().indexOf(searchText) !== -1)
        tasks.push(data)
    })
    res.send(tasks)
  }).catch((error) => {
    console.log(error);
  })

});

module.exports = router;
