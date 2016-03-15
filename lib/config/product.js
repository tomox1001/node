'use strict';

const _config = {
  datastore: {
    mongodb: {
      host: 'localhost',
      port: 27017,
      database: 'mt',
      assert:false,
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
      access: 'info',
      app: 'info',
    }
  }
};

module.exports = _config;
