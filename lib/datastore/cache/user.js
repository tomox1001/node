// Userのキャッシュ

var cacheUtil = require('./util');


var map = {};

exports.map = map;

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
