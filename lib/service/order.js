'use strict';

var _ = require('lodash');

var db = require('datastore/momongoz');
// var redis = require('datastore/redis');

/**
 * @param orderId
 * @param callback
 */
exports.get = function (orderId, callback) {
  //var redisCli = redis.getClient();
  //redisCli.set('foo', 'bar');
  //redisCli.get('foo', function (err, result) {
  //  console.log(result);
  //});

  db.Order.findOne(orderId, function(err, order) {
    if (err) {
      callback(err);
      return;
    }

    if (_.isEmpty(order)) {
      callback('Not found order : ', orderId);
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

    callback(null, result);
  });
};
