// Userのキャッシュ

var cacheUtil = require('./util');


var map = {};

exports.map = map;
exports.list = null;

exports.set = function(doc) {
  var key = doc.userId;

  // パース
  doc.userNo = Number(doc.userNo);
  doc.userPublicScore = Number(doc.userPublicScore);
  doc.userFriends = cacheUtil.convertToFlagMap(doc.userFriends);

  map[key] = doc;
};

exports.get = function(key) {
  return map[key];
};

// userNoでソート済みのリストを作る
exports.createList = function() {
  exports.list = Object.keys(map).map(function(key) {
    return map[key];
  }).sort(function(a, b) {
    return a.userNo - b.userNo;
  });
};
