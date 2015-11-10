'use strict';

var _ = require('lodash');
var express = require('express');
var router = express.Router();
var orderDb = require('../datastore/mongodb/order');

router.get('/:orderId?', function(req, res) {
  var orderId = req.params.orderId;

  orderDb.find(orderId, function(err, orders) {
    if (err) {
      console.log(err);
      res.json({ result: false });
      return;
    }

    if (_.isEmpty(orders)) {
      console.log('Not found order : ', orderId);
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
  })
});

module.exports = router;
