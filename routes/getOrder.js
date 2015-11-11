'use strict';

var _ = require('lodash');
var logger = require('../logger');
var express = require('express');
var router = express.Router();

var db = require('../datastore/momongoz');
// var redis = require('../datastore/redis');

router.get('/:orderId?', function(req, res) {
  var orderId = req.params.orderId;

  //var redisCli = redis.getClient();
  //redisCli.set('foo', 'bar');
  //redisCli.get('foo', function (err, result) {
  //  console.log(result);
  //});

  db.Order.findOne(orderId, function(err, order) {
    if (err) {
      logger.app.error(err);
      res.json({ result: false });
      return;
    }

    if (_.isEmpty(order)) {
      logger.app.error('Not found order : ', orderId);
      res.json({ result: false });
      return;
    }

    var result = {
      result: true,
      data: {
        orderId: orderId,
        orderDateTime: order.orderDateTime,
        orderUserId: order.orderUserId,
        orderItemId: order.orderItemId,
        orderQuantity: order.orderQuantity,
        orderState: order.orderState,
        tags: order.tags
      }
    };

    res.json(result);
  });
});

module.exports = router;
