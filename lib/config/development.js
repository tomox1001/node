'use strict';

const _config = {
  datastore: {
    mysql: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'test',
    },
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
