'use strict';

var Redis = require('ioredis');
var redisConf = require('../../config').get().datastore.redis;

var _cache;

exports.getClient = function() {
  if (!_cache) {
    console.error('Not connected to redis server');
    return;
  }

  return _cache;
};

/**
 * connect to the Server
 */
exports.connect = function() {
  _cache = new Redis(redisConf.port, redisConf.hosts);
};
