var config = require('../common/configConstants');
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

var db = mongojs(config.DB_CONNECTION, ['drivers']);

//Get Single Driver
router.get('/driver/:id', function(req, res, next) {
  db.drivers.findOne({_id: mongojs.ObjectId(req.params.id)}, function(
    err,
    driver,
  ) {
    if (err) {
      res.send(err);
    }
    res.send(driver);
  });
});
router.get('/drivers', function(req, res, next) {
  db.drivers.find(function(err, drivers) {
    if (err) {
      res.send(err);
    }
    res.json(drivers);
  });
});

module.exports = router;
