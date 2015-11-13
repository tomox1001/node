// Itemのキャッシュ

var cacheUtil = require('./util');


var map = {};

exports.map = map;

exports.set = function(doc) {
  delete doc._id;

  var key = doc.itemId;

  // パース
  doc.itemNo = Number(doc.itemNo);
  doc.itemSoldQuantity = Number(doc.itemSoldQuantity);
  doc.itemSalePrice = Number(doc.itemSalePrice);
  doc.itemTags = cacheUtil.convertToArray(doc.itemTags);

  map[key] = doc;
};

exports.get = function(key) {
  return map[key];
};

// itemNoでソート済みのリストを作る
exports.createList = function() {
  exports.list = Object.keys(map).map(function(key) {
    return map[key];
  }).sort(function(a, b) {
    return a.itemNo - b.itemNo;
  });
};
