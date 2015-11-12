'use strict';

var express = require('express');
var router = express.Router();

var logger = require('logger');
var orderService = require('service/order');

router.get('/:orderId?', function(req, res) {
  var orderId = req.params.orderId;

  orderService.get(orderId, function(err, result) {
    if (err) {
      logger.app.error(err);
      res.json({ result: false });
      return;
    }

    res.json(result);
  });
});

module.exports = router;
