'use strict';

const _ = require('lodash');
require('date-utils');

var cacheUtil = require('datastore/cache/util');
let playerCache = require('datastore/cache/player');

var playerService = exports;
var mapService = require('service/map');
var itemService = require('service/item');

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

playerService.updatePlayerMp = (query, cb) => {
  playerService.updateActivity(query.targetPlayerId, 'updatePlayerMp', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));

  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);
  var player = result[0];

  player.playerMp += Number(query.calcValue);

  if (player.playerMp < 0)
    player.playerMp = 0;
  if (player.playerMp >= 255)
    player.playerMp = 255;

  cb(null, player);
};

playerService.updatePlayerExp = (query, cb) => {
  playerService.updateActivity(query.targetPlayerId, 'updatePlayerExp', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));

  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);
  var player = result[0];

  player.playerExp += Number(query.calcValue);

  if (player.playerExp < 0)
    player.playerExp = 0;
  if (player.playerExp >= 65535)
    player.playerExp = 65535;

  cb(null, player);
};

playerService.updatePlayerAtk = (query, cb) => {
  playerService.updateActivity(query.targetPlayerId, 'updatePlayerAtk', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));

  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);
  var player = result[0];

  player.playerAtk += Number(query.calcValue);

  if (player.playerAtk < 0)
    player.playerAtk = 0;
  if (player.playerAtk >= 255)
    player.playerAtk = 255;

  cb(null, player);
};

playerService.updatePlayerDef = (query, cb) => {
  playerService.updateActivity(query.targetPlayerId, 'updatePlayerDef', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));

  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);
  var player = result[0];

  player.playerDef += Number(query.calcValue);

  if (player.playerDef < 0)
    player.playerDef = 0;
  if (player.playerDef >= 255)
    player.playerDef = 255;

  cb(null, player);
};

playerService.updatePlayerInt = (query, cb) => {
  playerService.updateActivity(query.targetPlayerId, 'updatePlayerInt', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));

  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);
  var player = result[0];

  player.playerInt += Number(query.calcValue);

  if (player.playerInt < 0)
    player.playerInt = 0;
  if (player.playerInt >= 255)
    player.playerInt = 255;

  cb(null, player);
};

playerService.updatePlayerAgi = (query, cb) => {
  playerService.updateActivity(query.targetPlayerId, 'updatePlayerAgi', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));

  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);
  var player = result[0];

  player.playerAgi += Number(query.calcValue);

  if (player.playerAgi < 0)
    player.playerAgi = 0;
  if (player.playerAgi >= 255)
    player.playerAgi = 255;

  cb(null, player);
};

playerService.move = (query, cb) => {
  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);

  mapService.get({targetMapId: result[0].playerMap}, (err, map) => {
    if (!map || result[0].playerMap !== query.newPlayerMap || !~_.indexOf(map.mapNext, query.newPlayerMap))
      return cb('error');

    result[0].playerMap = query.newPlayerMap;
    playerService.updateActivity(query.targetPlayerId, 'movePlayer', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));

    cb(null, result[0]);
  });
};

playerService.exploreMap = (query, cb) => {
  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);
  var player = result[0];

  mapService.get({targetMapId: player.playerMap}, (err, map) => {
    if (!map || _.isEmpty(map.mapItems))
      return cb('error');

    var itemId = map.mapItems[0];
    itemService.get({targetItemId: itemId}, (err, item) => {
      player.playerItems.push(itemId);

      item.itemValue -= 10;
      if (item.itemValue < 0)
        item.itemValue = 0;

      map.mapItems.shift();

      playerService.updateActivity(query.targetPlayerId, 'exploreMap', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));
      itemService.updateActivity(itemId, 'exploreMap', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));

      cb(null, player);
    });
  });
};

playerService.hideItem = (query, cb) => {
  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);
  var player = result[0];

  if (!player || _.isEmpty(player.playerItems))
    return cb('error');

  var itemId = player.playerItems[0];

  mapService.get({targetMapId: result[0].playerMap}, (err, map) => {
    itemService.get({targetItemId: itemId}, (err, item) => {
      map.mapItems.push(itemId);

      item.itemValue += 10;
      if (item.itemValue >= 65535)
        item.itemValue = 65535;

      player.playerItems.shift();

      playerService.updateActivity(query.targetPlayerId, 'hideItem', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));
      itemService.updateActivity(itemId, 'hideItem', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));

      cb(null, result[0]);
    });
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
