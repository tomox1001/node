'use strict';

const _ = require('lodash');

var cacheUtil = require('datastore/cache/util');
let itemCache = require('datastore/cache/item');

var itemService = exports;

itemService.updateActivity = (itemId, apiPath, apiParam, logDateTime) => {
  if (!itemCache.activity[itemId])
    itemCache.activity[itemId] = [];

  itemCache.activity[itemId].unshift({
    itemId,
    apiPath,
    apiParam,
    logDateTime
  });
};

itemService.getActivity = (itemId, cb) => {
  if (!itemCache.activity[itemId])
    cb(null, []);

  cb(null, itemCache.activity[itemId]);
};

itemService.get = (query, cb) => {
  var list = itemCache.list;
  var result = filterHandlers.targetItemId(list, query.targetItemId);

  cb(null, result[0]);
};

itemService.findOne = (itemId) => {
  return itemCache.map[itemId];
};

itemService.rankItemValue = (query, cb) => {
  var list = itemCache.list;
  var result;

  if (query.isAscend === 'true') {
    result = list.sort((a,b) => {
      if( a.itemValue < b.itemValue ) return -1;
      if( a.itemValue > b.itemValue ) return 1;
      return 0;
    });
  } else {
    result = list.sort((a,b) => {
      if( a.itemValue > b.itemValue ) return -1;
      if( a.itemValue < b.itemValue ) return 1;
      return 0;
    });
  }

  cb(null, _.slice(result, 0, 20));
};

itemService.update = (query, cb) => {
  itemService.updateActivity(query.targetItemId, 'updateItem', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));

  var list = itemCache.list;
  var result = filterHandlers.targetItemId(list, query.targetItemId);

  if (query.newItemValue)
    result[0].itemValue = Number(query.newItemValue);

  cb(null, result[0]);
};

const filterHandlers = {
  targetItemId: (list, id) => {
    return list.filter((doc) => {
      return !!~doc.itemId.indexOf(id);
    });
  },
};
