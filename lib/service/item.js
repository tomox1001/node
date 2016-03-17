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
