// Postのキャッシュ

var cacheUtil = require('./util');


var map = {};

exports.map = map;
exports.list = null;

exports.set = function(doc) {
  delete doc._id;

  var key = doc.postId;

  // パース
  doc.postDateTime = Number(doc.postDateTime);
  doc.postItemScore = Number(doc.postItemScore);
  doc.postLikeUsers = cacheUtil.convertToArray(doc.postLikeUsers);
  doc.postTags = cacheUtil.convertToArray(doc.postTags);

  map[key] = doc;
};

exports.get = function(key) {
  return map[key];
};

// postDateTimeでソート済みのリストを作る
exports.createList = function() {
  exports.list = Object.keys(map).map(function(key) {
    return map[key];
  }).sort(function(a, b) {
    return a.postDateTime - b.postDateTime;
  });
};
