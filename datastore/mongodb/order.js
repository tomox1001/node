'use strict';

var mongo = require('./');

exports.find = function(id, callback) {
  var collection = getCollection();
  collection.find({ _id:id }).toArray(function(err, docs) {
    if (err) {
      return callback(err);
    }

    console.log("Found the following records");
    console.dir(docs);

    callback(null, docs);
  });
};

function getCollection() {
  var db = mongo.getClient();
  return db.collection('order');
}
