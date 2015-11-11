'use strict';

var _config = {
  datastore: {
    mongodb: {
      hosts: 'localhost',
      port: 27017,
      name: 'mt',
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
