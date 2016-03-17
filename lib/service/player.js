'use strict';

const _ = require('lodash');

let playerCache = require('datastore/cache/player');

var playerService = exports;

playerService.get = (query, cb) => {
  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);

  cb(null, result[0]);
};

playerService.update = (query, cb) => {
  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);

  if (query.newPlayerHp)
    result[0].playerHp = query.newPlayerHp;
  if (query.newPlayerMp)
    result[0].playerMp = query.newPlayerMp;
  if (query.newPlayerExp)
    result[0].playerExp = query.newPlayerExp;
  if (query.newPlayerAtk)
    result[0].playerAtk = query.newPlayerAtk;
  if (query.newPlayerDef)
    result[0].playerDef = query.newPlayerDef;
  if (query.newPlayerInt)
    result[0].playerInt = query.newPlayerInt;
  if (query.newPlayerAgi)
    result[0].playerAgi = query.newPlayerAgi;
  if (query.newPlayerItems)
      // TODO
    result[0].playerItems = query.newPlayerItems;
  if (query.newPlayerMap)
    result[0].playerMap = query.newPlayerMap;

  cb(null, result[0]);
};

const filterHandlers = {
  targetPlayerId: (list, id) => {
    return list.filter((doc) => {
      return !!~doc.playerId.indexOf(id);
    });
  },
};
