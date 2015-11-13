'use strict';

var express = require('express');
var router = express.Router();

var logger = require('logger');

var itemService = require('service/item');


function res_(res, data) {
  res.json({
    result: true,
    data: data,
  });
}


router.get('/', function(req, res) {
  var query = req.query;
  itemService.search(query, function(err, result) {
    if (err) {
      logger.app.error(err);
      res.json({ result: false });
      return;
    }

    res_(res, result);
  });
});

module.exports = router;
