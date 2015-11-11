'use strict';

var express = require('express');
var path = require('path');
var logger = require('./logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// config setup
var config = require('./config');
config.setup(app.get('env'));

// view engine setup
var ect = require('ect');
app.engine('ect', ect({ watch: true, root: __dirname + '/views', ext: '.ect' }).render);
app.set('view engine', 'ect');

app.use(logger.express);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API setup
app.use('/', require('./routes/index'));
app.use('/getOrder', require('./routes/getOrder'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

if (app.get('env') === 'development') {
// development error handler
// will print stacktrace
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
// production error handler
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

var redis = require('./datastore/redis');
redis.connect();

require('./datastore/momongoz');

// uncaughtException
process.on('uncaughtException', function(err) {
  logger.app.error(err);
  mongodb.disconnect();
});

module.exports = app;
