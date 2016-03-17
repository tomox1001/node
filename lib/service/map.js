'use strict';

const _ = require('lodash');

var cacheUtil = require('datastore/cache/util');
let mapCache = require('datastore/cache/map');

var mapService = exports;

mapService.get = (query, cb) => {
  var list = mapCache.list;
  var result = filterHandlers.targetMapId(list, query.targetMapId);

  cb(null, result[0]);
};

mapService.update = (query, cb) => {
  var list = mapCache.list;
  var result = filterHandlers.targetMapId(list, query.targetMapId);

  if (query.newMapItems)
    result[0].mapItems = cacheUtil.convertToArray(query.newMapItems);

  cb(null, result[0]);
};

const filterHandlers = {
  targetMapId: (list, id) => {
    return list.filter((doc) => {
      return !!~doc.mapId.indexOf(id);
    });
  },
};
