'use strict';

var _ = require('lodash');
var logger = require('../logger');
var express = require('express');
var router = express.Router();
var orderDb = require('../datastore/mongodb/order');
// var redis = require('../datastore/redis');

router.get('/:orderId?', function(req, res) {
  var orderId = req.params.orderId;

  //var redisCli = redis.getClient();
  //redisCli.set('foo', 'bar');
  //redisCli.get('foo', function (err, result) {
  //  console.log(result);
  //});

  orderDb.find(orderId, function(err, orders) {
    if (err) {
      logger.app.err('Not found order : ', orderId);
      res.json({ result: false });
      return;
    }

    if (_.isEmpty(orders)) {
      logger.app.debug('Not found order : ', orderId);
      res.json({ result: false });
      return;
    }

    var order = orders[0];

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
