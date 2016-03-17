'use strict';

const _config = {
  datastore: {
    mysql: {
      host: 'localhost',
      user: 'tqdbuser',
      password: 'hoge',
      database: 'tquest',
    },
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
