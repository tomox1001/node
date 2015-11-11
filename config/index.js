'use strict';

var _config = {
  datastore: {
    mongodb: {
      hosts: '52.192.138.45',
      port: 27017,
      name: 'mt',
    },
    redis: {
      hosts: '52.192.138.45',
      port: 6379,
    }
  },
  logger: {
    appenders: [
    {
      category: 'access',
      type: 'dateFile',
      filename: '/tmp/access.log',
      pattern: '-yyyy-MM-dd',
      backups: 3
    },
    {
      category: 'app',
      type: 'dateFile',
      filename: '/tmp/app.log',
      pattern: '-yyyy-MM-dd',
      backups: 3
    },
    {
      type: 'console'
    }
    ],
    levels: {
      access: 'ALL',
      system: 'ALL',
      error: 'ALL',
    }
  }
};

module.exports = _config;
