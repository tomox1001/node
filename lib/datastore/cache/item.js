// Itemのキャッシュ

var cacheUtil = require('./util');


var map = {};

exports.map = map;

exports.set = function(doc) {
  var key = doc.itemId;

  // パース
  doc.itemNo = Number(doc.itemNo);
  doc.itemSoldQuantity = Number(doc.itemSoldQuantity);
  doc.itemSalePrice = Number(doc.itemSalePrice);
  doc.itemTags = cacheUtil.convertToFlagMap(doc.itemTags);

  map[key] = doc;
};

exports.get = function(key) {
  return map[key];
};
