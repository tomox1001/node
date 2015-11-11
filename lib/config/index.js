'use strict';

var _config;

exports.get = function() {
  if (!_config) {
    logger.app.error('No config!!');
    return;
  }

  return _config;
};


/**
 * Config setup
 */
exports.setup = function(env) {
  _config = require('./' + env);
};
