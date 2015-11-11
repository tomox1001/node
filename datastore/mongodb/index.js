'use strict';

var MongoClient = require('mongodb').MongoClient;
var mongoConf = require('../../config').get().datastore.mongodb;
var logger = require('../../logger');

var _db;
var url = 'mongodb://' + mongoConf.hosts + ':' + mongoConf.port + '/' + mongoConf.name;

exports.getClient = function() {
  if (!_db) {
    logger.app.err('Not connected to mongo server');
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

    logger.app.debug('Connected correctly to server');
    _db = db;
    init();
  });
};

/**
 * disconnect to the Server
 */
exports.disconnect = function() {
  _db.close();
  logger.app.debug('Disconnected correctly to server');
};

/**
 * init
 */
function init() {
  logger.app.debug('mongo init start');

  // TODO create cache
}
