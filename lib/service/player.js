'use strict';

const _ = require('lodash');
require('date-utils');

var cacheUtil = require('datastore/cache/util');
let playerCache = require('datastore/cache/player');

var playerService = exports;
var mapService = require('service/map');

playerService.updateActivity = (playerId, apiPath, apiParam, logDateTime) => {
  if (!playerCache.activity[playerId])
    playerCache.activity[playerId] = [];

  playerCache.activity[playerId].unshift({
    playerId,
    apiPath,
    apiParam,
    logDateTime
  });
};

playerService.getActivity = (playerId, cb) => {
  if (!playerCache.activity[playerId])
    cb(null, []);

  cb(null, playerCache.activity[playerId]);
};

playerService.get = (query, cb) => {
  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);

  cb(null, result[0]);
};

playerService.update = (query, cb) => {
  playerService.updateActivity(query.targetPlayerId, 'updatePlayer', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));

  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);

  if (query.newPlayerHp)
    result[0].playerHp = Number(query.newPlayerHp);
  if (query.newPlayerMp)
    result[0].playerMp = Number(query.newPlayerMp);
  if (query.newPlayerExp)
    result[0].playerExp = Number(query.newPlayerExp);
  if (query.newPlayerAtk)
    result[0].playerAtk = Number(query.newPlayerAtk);
  if (query.newPlayerDef)
    result[0].playerDef = Number(query.newPlayerDef);
  if (query.newPlayerInt)
    result[0].playerInt = Number(query.newPlayerInt);
  if (query.newPlayerAgi)
    result[0].playerAgi = Number(query.newPlayerAgi);
  if (query.newPlayerItems)
    result[0].playerItems = cacheUtil.convertToArray(query.newPlayerItems);
  if (query.newPlayerMap)
    result[0].playerMap = query.newPlayerMap;

  cb(null, result[0]);
};

playerService.move = (query, cb) => {
  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);

  mapService.get({targetMapId: query.newPlayerMap}, (err, map) => {
    if (result[0].playerMap !== query.newPlayerMap || !~_.indexOf(map.mapNext, query.newPlayerMap))
      return cb('error');

    result[0].playerMap = query.newPlayerMap;
    playerService.updateActivity(query.targetPlayerId, 'movePlayer', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));

    cb(null, result[0]);
  });
};

playerService.findItemOwner = (query, cb) => {
  var list = playerCache.list;
  var result = filterHandlers.itemOwner(list, query.targetItemId);

  cb(null, result[0]);
};

playerService.switchItemOwner = (query, cb) => {
  playerService.updateActivity(query.newItemOwner, 'switchItemOwner', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));

  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.newItemOwner);
  if (!result)
    return cb(null, 'none');

  result[0].playerItems.push(query.targetItemId);

  cb(null, result[0]);
};

const filterHandlers = {
  targetPlayerId: (list, id) => {
    return list.filter((doc) => {
      return !!~doc.playerId.indexOf(id);
    });
  },
  itemOwner: (list, itemId) => {
    return list.filter((doc) => {
      return !!~_.indexOf(doc.playerItems, itemId);
    });
  },
};
