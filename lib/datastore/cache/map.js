'use strict';

var cacheUtil = require('./util');

var map = {};

exports.map = map;
exports.list = null;

exports.set = function(doc) {
  let key = doc.mapId;

  doc.mapNext = cacheUtil.convertToArray(doc.mapNext);
  console.log(doc.mapItems);
  doc.mapItems = cacheUtil.convertToArray(doc.mapItems);
  map[key] = doc;
};

exports.get = function(key) {
  return map[key];
};

exports.createList = () => {
  exports.list = Object.keys(map).map((key) => {
    return map[key];
  }).sort((a, b) => {
    return a.mapId - b.mapId;
  });
};
