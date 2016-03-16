'use strict';

var cacheUtil = require('./util');

var map = {};

exports.map = map;
exports.list = null;

exports.set = function(doc) {
  let data = {};
  let key = doc.USER_ID;

  data.userId = doc.USER_ID;
  data.userName = doc.USER_NAME;

  map[key] = data;
};

exports.get = function(key) {
  return map[key];
};

exports.createList = () => {
  exports.list = Object.keys(map).map((key) => {
    return map[key];
  }).sort((a, b) => {
    return a.userId - b.userId;
  });
};
