'use strict';

var _config = {
  datastore: {
    mongodb: {
      host: 'localhost',
      port: 27017,
      database: 'mt',
      assert:true,
      collections: require('./collections'),
    },
    redis: {
      hosts: 'localhost',
      port: 6379,
    }
  },
  logger: {
    appenders: [
        {
          type: 'console'
        }
    ]
  }
};

module.exports = _config;
