var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
var firestore = admin.firestore()
var common = require('big-project-common')


/* some GET call */
router.get("/" + common.search_url + '/:userToken/:_searchText', function (req, res, next) {
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

router.get("/" + common.total_url + "/:userToken/:taskID", function (req, res, next) {
  const { userToken, taskID } = req.params;
  admin.auth().verifyIdToken(userToken).then((decodedToken) => {
    // const uid = decodedToken.uid;
    // const taskRef = firestore.collection('tasks').doc(taskID);
    let query = firestore.collection('sessions').where("task", "==", "tasks/" + taskID);
    return query.get()

  }).then((result) => {
    console.log(result);
    var total_time = 0
    result.forEach((d) => {
      // clear the user field, since that has keys in it
      const data = d.data()
      data.user = undefined
      // console.log("got data");
      // console.log(data);
      if (!data.end || !data.start) {
        res.sendStatus(500)
      }
      total_time += data.end - data.start
    })
    res.send({ total_time: total_time })
  }).catch((error) => {
    console.log(error);
  })

})

module.exports = router;
