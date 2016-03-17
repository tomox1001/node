'use strict';

const _ = require('lodash');

var cacheUtil = require('datastore/cache/util');
let itemCache = require('datastore/cache/item');

var itemService = exports;

itemService.get = (query, cb) => {
  var list = itemCache.list;
  var result = filterHandlers.targetItemId(list, query.targetItemId);

  cb(null, result[0]);
};

itemService.update = (query, cb) => {
  var list = itemCache.list;
  var result = filterHandlers.targetItemId(list, query.targetItemId);

  cb(null, result[0]);
};

const filterHandlers = {
  targetItemId: (list, id) => {
    return list.filter((doc) => {
      return !!~doc.itemId.indexOf(id);
    });
  },
};
