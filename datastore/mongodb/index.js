'use strict';

var MongoClient = require('mongodb').MongoClient;
var mongoConf = require('../../config').datastore.mongodb;

var _db;
var url = 'mongodb://' + mongoConf.hosts + ':' + mongoConf.port + '/' + mongoConf.name;

exports.getClient = function() {
  if (!_db) {
    console.error('Not connected to mongo server');
    return;
  }

  return _db;
};

/**
 * connect to the Server
 */
exports.connect = function() {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      process.exit(1);
    }

    console.log('Connected correctly to server');
    _db = db;
    init();
  });
};

/**
 * disconnect to the Server
 */
exports.disconnect = function() {
  _db.close();
  console.log('Disconnected correctly to server');
};

/**
 * init
 */
function init() {
  console.log('mongo init start');

  // TODO create cache
}
