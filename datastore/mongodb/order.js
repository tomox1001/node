'use strict';

var mongo = require('./');
var logger = require('../../logger');

exports.find = function(id, callback) {
  var collection = getCollection();
  collection.find({ _id: id }).toArray(function(err, docs) {
    if (err) {
      return callback(err);
    }

    logger.app.debug('Found the following records', docs);

    callback(null, docs);
  });
};

function getCollection() {
  var db = mongo.getClient();
  return db.collection('order');
}
