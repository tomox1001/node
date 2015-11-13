'use strict';

var _ = require('lodash');

var userCache = require('datastore/cache/user');
var postCache = require('datastore/cache/post');
var itemCache = require('datastore/cache/item');


var itemService = exports;


var handlers = {
  // itemId
  itemId: function(list, itemId) {
    return list.filter(function(doc) {
      return !!~doc.itemId.indexOf(itemId);
    });
  },
  // findByItemSupplier
  findByItemSupplier: function(list, supplier) {
    return list.filter(function(doc) {
      return !!~doc.itemSupplier.indexOf(supplier);
    });
  },
  // 売れた 以上
  findByItemSoldQuantityGTE: function(list, quantity) {
    return list.filter(function(doc) {
      return doc.itemSoldQuantity >= quantity;
    });
  },
  // 売れた 以下
  findByItemSoldQuantityLTE: function(list, quantity) {
    return list.filter(function(doc) {
      return doc.itemSoldQuantity <= quantity;
    });
  },
  // 売値 以上
  findByItemSalePriceGTE: function(list, price) {
    return list.filter(function(doc) {
      return doc.itemSalePrice >= price;
    });
  },
  // 売上 以下
  findByItemSalePriceLTE: function(list, price) {
    return list.filter(function(doc) {
      return doc.itemSalePrice <= price;
    });
  },
  // タグの一致
  findByItemTagsIncludeAll: function(list, tags) {
    return list.filter(function(doc) {
      return tags.every(function(tag) {
        return !!~doc.itemTags.indexOf(tag);
      });
    });
  },
  // タグが1つでも含まれる
  findByItemTagsIncludeAny: function(list, tags) {
    return list.filter(function(doc) {
      return tags.some(function(tag) {
        return !!~doc.itemTags.indexOf(tag);
      });
    });
  },
};


itemService.search = function(query, callback) {
  var list = itemCache.list;

  // シナリオ3

  // 件数
  var limit = query.limit || 100;

  // itemId
  var itemId = query.findByItemId || null;

  if (itemId) {
    list = handlers.itemId(list, itemId);
  }

  // findByItemSupplier
  var itemSupplier = query.findByItemSupplier || null;

  if (itemSupplier) {
    list = handlers.findByItemSupplier(list, itemSupplier);
  }

  // 売れた 以上
  var findByItemSoldQuantityGTE = query.findByItemSoldQuantityGTE || null;

  if (findByItemSoldQuantityGTE) {
    list = handlers.findByItemSoldQuantityGTE(list, findByItemSoldQuantityGTE);
  }

  // 売れた 以下
  var findByItemSoldQuantityLTE = query.findByItemSoldQuantityLTE || null;

  if (findByItemSoldQuantityLTE) {
    list = handlers.findByItemSoldQuantityLTE(list, findByItemSoldQuantityLTE);
  }

  // 売値 以上
  var findByItemSalePriceGTE = query.findByItemSalePriceGTE || null;

  if (findByItemSalePriceGTE) {
    list = handlers.findByItemSalePriceGTE(list, findByItemSalePriceGTE);
  }

  // 売値 以下
  var findByItemSalePriceLTE = query.findByItemSalePriceLTE || null;

  if (findByItemSalePriceLTE) {
    list = handlers.findByItemSalePriceLTE(list, findByItemSalePriceLTE);
  }

  // タグの一致
  if (query.findByItemTagsIncludeAll) {
    var findByItemTagsIncludeAll = query.findByItemTagsIncludeAll.split(',');

    if (findByItemTagsIncludeAll) {
      list = handlers.findByItemTagsIncludeAll(list, findByItemTagsIncludeAll);
    }
  }

  // タグが1つでも含まれる
  if (query.findByItemTagsIncludeAny) {
    var findByItemTagsIncludeAny = query.findByItemTagsIncludeAny.split(',');

    if (findByItemTagsIncludeAny) {
      list = handlers.findByItemTagsIncludeAny(list, findByItemTagsIncludeAny);
    }
  }

  callback(null, list.splice(0, limit));
};
