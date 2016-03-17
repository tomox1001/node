'use strict';

var cacheUtil = require('./util');

var map = {};

exports.map = map;
exports.list = null;

exports.set = function(doc) {
  let key = doc.playerId;

  map[key] = doc;
};

exports.get = function(key) {
  return map[key];
};

exports.createList = () => {
  exports.list = Object.keys(map).map((key) => {
    return map[key];
  }).sort((a, b) => {
    return a.playerId - b.playerId;
  });
};