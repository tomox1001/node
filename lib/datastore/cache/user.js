// Userのキャッシュ

var map = {};

exports.map = map;

exports.set = function(doc) {
  var key = doc.userId;
  map[key] = doc;
};

exports.get = function(key) {
  return map[key];
};

