'use strict';

// newreric setup
require('newrelic');

var express = require('express');
var path = require('path');
var logger = require('logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// config setup
var config = require('config');
config.setup(app.get('env'));

// view engine setup
var ect = require('ect');
app.engine('ect', ect({ watch: true, root: __dirname + '/views', ext: '.ect' }).render);
app.set('view engine', 'ect');

app.use(logger.express);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// static setup
if (isDev(app)) {
  app.use(express.static(path.join(__dirname, 'public')));
}

// API setup
var routesPath = path.join(__dirname, 'routes');
require('fs').readdirSync(routesPath).forEach(function(file) {
  var fileName = file.replace(path.extname(file), '');
  var rootPath = fileName;
  if (fileName === 'index') {
    rootPath = '';
  }

  app.use('/' + rootPath, require('./routes/' + fileName));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development
if (isDev(app)) {
  // error handlers
  // will print stacktrace
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
// production
} else {
  // error handlers
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

// datastore setup
//var mongodb = require('./datastore/mongodb');
//mongodb.connect();

var redis = require('datastore/redis');
redis.connect();

require('datastore/momongoz');

// uncaughtException
process.on('uncaughtException', function(err) {
  logger.app.error(err);
  mongodb.disconnect();
});

function isDev(app) {
  return app.get('env') === 'development';
}

function isPrd(app) {
  return app.get('env') === 'product';
}

module.exports = app;

// オンメモリにのせる
require('cacheupdater').load(function(err) {
  err && logger.app.error(err);
});

