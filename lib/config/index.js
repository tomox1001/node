'use strict';

let _config;
const logger = require('logger');

exports.get = () => {
  if (!_config) {
    logger.app.error('No config!!');
    return;
  }

  return _config;
};


/**
 * Config setup
 */
exports.setup = (env) => {
  _config = require('./' + env);
};
