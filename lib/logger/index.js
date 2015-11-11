var log4js = require('log4js');
var config = require('config');

log4js.configure(config.logger);

module.exports = {
  access: log4js.getLogger('access'),
  app: log4js.getLogger('app'),
  express: log4js.connectLogger(log4js.getLogger('access'), { level: log4js.levels.INFO })
};
