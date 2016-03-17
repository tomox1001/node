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
    result[0].playerHp = number(query.newPlayerHp);
  if (query.newPlayerMp)
    result[0].playerMp = number(query.newPlayerMp);
  if (query.newPlayerExp)
    result[0].playerExp = number(query.newPlayerExp);
  if (query.newPlayerAtk)
    result[0].playerAtk = number(query.newPlayerAtk);
  if (query.newPlayerDef)
    result[0].playerDef = number(query.newPlayerDef);
  if (query.newPlayerInt)
    result[0].playerInt = number(query.newPlayerInt);
  if (query.newPlayerAgi)
    result[0].playerAgi = number(query.newPlayerAgi);
  if (query.newPlayerItems)
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
