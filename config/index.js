'use strict';

var _config;

exports.get = function() {
  if (!_config) {
    logger.app.err('No config!!');
    return;
  }

  return _config;
};


/**
 * connect to the Server
 */
exports.setup = function(env) {
  _config = require('./' + env);
};
