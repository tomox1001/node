// Postのキャッシュ

var cacheUtil = require('./util');


var map = {};

exports.map = map;

exports.set = function(doc) {
  var key = doc.postId;

  // パース
  doc.postDateTime = Number(doc.postDateTime);
  doc.postItemScore = Number(doc.postItemScore);
  doc.postLikeUsers = cacheUtil.convertToFlagMap(doc.postLikeUsers);

  map[key] = doc;
};

exports.get = function(key) {
  return map[key];
};
