// Postのキャッシュ

var map = {};

exports.map = map;

exports.set = function(doc) {
  var key = doc.postId;
  map[key] = doc;
};

exports.get = function(key) {
  return map[key];
};

