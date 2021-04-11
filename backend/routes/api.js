var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");

/* some GET call */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
