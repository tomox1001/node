'use strict';

const _ = require('lodash');
require('date-utils');

var cacheUtil = require('datastore/cache/util');
let playerCache = require('datastore/cache/player');

var playerService = exports;

playerService.updateActivity = (playerId, apiPath, apiParam, logDateTime) => {
  if (!playerCache.activity[playerId])
    playerCache.activity[playerId] = [];

  // TODO sort
  playerCache.activity[playerId].push({
    playerId,
    apiPath,
    apiParam,
    logDateTime
  });
};

playerService.getActivity = (playerId) => {
  if (!playerCache.activity[playerId])
    return [];

  return playerCache.activity[playerId];
};

playerService.get = (query, cb) => {
  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);

  cb(null, result[0]);
};

playerService.update = (query, cb) => {
  playerService.updateActivity(query.targetPlayerId, 'updatePlayer', query, new Date().toFormat('YYYYMMDDhhmmss'));

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

playerService.findItemOwner = (query, cb) => {
  var list = playerCache.list;
  var result = filterHandlers.itemOwner(list, query.targetItemId);

  cb(null, result[0]);
};

playerService.switchItemOwner = (query, cb) => {
  playerService.updateActivity(query.newItemOwner, 'switchItemOwner', query, new Date().toFormat('YYYYMMDDhhmmss'));

  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.newItemOwner);
  if (!result)
    cb(null, 'none');

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
