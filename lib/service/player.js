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

playerService.findOne = (playerId) => {
  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, playerId);

  return result[0];
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

playerService.useItem = (query, cb) => {
  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);
  var player = result[0];

  var itemId = player.playerItems[0];

  if (!player || _.isEmpty(player.playerItems))
    return cb('error');

  itemService.get({targetItemId: itemId}, (err, item) => {
    var func;
    if (item.itemEffectTarget === 'Hp')
      func = playerService.updatePlayerHp;
    if (item.itemEffectTarget === 'Mp')
      func = playerService.updatePlayerMp;
    if (item.itemEffectTarget === 'Exp')
      func = playerService.updatePlayerExp;
    if (item.itemEffectTarget === 'Atk')
      func = playerService.updatePlayerAtk;
    if (item.itemEffectTarget === 'Def')
      func = playerService.updatePlayerDef;
    if (item.itemEffectTarget === 'Agi')
      func = playerService.updatePlayerAgi;
    if (item.itemEffectTarget === 'Int')
      func = playerService.updatePlayerInt;
    func({ targetPlayerId: query.targetPlayerId, calcValue: item.itemEffectValue }, () => {
      playerService.hideItem({ targetPlayerId: query.targetPlayerId }, () => {
        cb(null, player);
      });
    });
  });
};

playerService.rankPlayerByItemValue = (query, cb) => {
  var list = playerCache.list;

  var result;
  _.forEach(list, (player) => {
    player.itemValue = 0;
    _.forEach(player.playerItems, (itemId) => {
      var item = itemService.findOne(itemId);
      player.itemValue += item.itemValue;
    });
  });

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

playerService.rankPlayerHp = (query, cb) => {
  var list = playerCache.list;
  var result;

  if (query.isAscend === 'true') {
    result = list.sort((a,b) => {
      if( a.playerHp < b.playerHp ) return -1;
      if( a.playerHp > b.playerHp ) return 1;
      return 0;
    });
  } else {
    result = list.sort((a,b) => {
      if( a.playerHp > b.playerHp ) return -1;
      if( a.playerHp < b.playerHp ) return 1;
      return 0;
    });
  }

  cb(null, _.slice(result, 0, 20));
};

playerService.rankPlayerMp = (query, cb) => {
  var list = playerCache.list;
  var result;

  if (query.isAscend === 'true') {
    result = list.sort((a,b) => {
      if( a.playerMp < b.playerMp ) return -1;
      if( a.playerMp > b.playerMp ) return 1;
      return 0;
    });
  } else {
    result = list.sort((a,b) => {
      if( a.playerMp > b.playerMp ) return -1;
      if( a.playerMp < b.playerMp ) return 1;
      return 0;
    });
  }

  cb(null, _.slice(result, 0, 20));
};

playerService.rankPlayerExp = (query, cb) => {
  var list = playerCache.list;
  var result;

  if (query.isAscend === 'true') {
    result = list.sort((a,b) => {
      if( a.playerExp < b.playerExp ) return -1;
      if( a.playerExp > b.playerExp ) return 1;
      return 0;
    });
  } else {
    result = list.sort((a,b) => {
      if( a.playerExp > b.playerExp ) return -1;
      if( a.playerExp < b.playerExp ) return 1;
      return 0;
    });
  }

  cb(null, _.slice(result, 0, 20));
};

playerService.rankPlayerAtk = (query, cb) => {
  var list = playerCache.list;
  var result;

  if (query.isAscend === 'true') {
    result = list.sort((a,b) => {
      if( a.playerAtk < b.playerAtk ) return -1;
      if( a.playerAtk > b.playerAtk ) return 1;
      return 0;
    });
  } else {
    result = list.sort((a,b) => {
      if( a.playerAtk > b.playerAtk ) return -1;
      if( a.playerAtk < b.playerAtk ) return 1;
      return 0;
    });
  }

  cb(null, _.slice(result, 0, 20));
};

playerService.rankPlayerDef = (query, cb) => {
  var list = playerCache.list;
  var result;

  if (query.isAscend === 'true') {
    result = list.sort((a,b) => {
      if( a.playerDef < b.playerDef ) return -1;
      if( a.playerDef > b.playerDef ) return 1;
      return 0;
    });
  } else {
    result = list.sort((a,b) => {
      if( a.playerDef > b.playerDef ) return -1;
      if( a.playerDef < b.playerDef ) return 1;
      return 0;
    });
  }

  cb(null, _.slice(result, 0, 20));
};

playerService.rankPlayerInt = (query, cb) => {
  var list = playerCache.list;
  var result;

  if (query.isAscend === 'true') {
    result = list.sort((a,b) => {
      if( a.playerInt < b.playerInt ) return -1;
      if( a.playerInt > b.playerInt ) return 1;
      return 0;
    });
  } else {
    result = list.sort((a,b) => {
      if( a.playerInt > b.playerInt ) return -1;
      if( a.playerInt < b.playerInt ) return 1;
      return 0;
    });
  }

  cb(null, _.slice(result, 0, 20));
};

playerService.rankPlayerAgi = (query, cb) => {
  var list = playerCache.list;
  var result;

  if (query.isAscend === 'true') {
    result = list.sort((a,b) => {
      if( a.playerAgi < b.playerAgi ) return -1;
      if( a.playerAgi > b.playerAgi ) return 1;
      return 0;
    });
  } else {
    result = list.sort((a,b) => {
      if( a.playerAgi > b.playerAgi ) return -1;
      if( a.playerAgi < b.playerAgi ) return 1;
      return 0;
    });
  }

  cb(null, _.slice(result, 0, 20));
};

playerService.updatePlayerHp = (query, cb) => {
  playerService.updateActivity(query.targetPlayerId, 'updatePlayerHp', query, new Date().toFormat('YYYY-MM-DD-HH:MI:SS'));

  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);
  var player = result[0];

  player.playerHp += Number(query.calcValue);

  if (player.playerHp < 0)
    player.playerHp = 0;
  if (player.playerHp >= 255)
    player.playerHp = 255;

  cb(null, player);
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

playerService.listPlayerOnMap = (query, cb) => {
  var list = playerCache.list;
  var result = _.filter(list, (player) => {
    return player.playerMap === query.targetMapId;
  });

  cb(null, result);
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

function getStrong(player) {
  return (player.playerHp + player.playerMp) * (player.playerAtk * player.playerHp + player.playerInt * player.playerMp) * player.playerDef * player.playerAgi;
}

playerService.challengeOne = (query, cb) => {
  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);
  var player = result[0];

  var chalengers = getChallenger(player);

  var _result = _.filter(chalengers, (_player) => {
    if (query.rankParam === 'Hp')
      return player.playerHp < _player.playerHp;
    if (query.rankParam === 'Mp')
      return player.playerMp < _player.playerMp;
    if (query.rankParam === 'Exp')
      return player.playerExp < _player.playerExp;
    if (query.rankParam === 'Atk')
      return player.playerAtk < _player.playerAtk;
    if (query.rankParam === 'Def')
      return player.playerDef < _player.playerDef;
    if (query.rankParam === 'Agi')
      return player.playerAgi < _player.playerAgi;
    if (query.rankParam === 'Int')
      return player.playerInt < _player.playerInt;
    if (query.rankParam === 'Strong')
      return getStrong(player) < getStrong(_player);
  });

  cb(null, _result);
};

playerService.challengeTwo = (query, cb) => {
  var list = playerCache.list;
  var result = filterHandlers.targetPlayerId(list, query.targetPlayerId);
  var player = result[0];

  var chalengers = getChallenger(player);

  var _result = _.filter(chalengers, (_player) => {
    if (query.rankParam === 'Hp')
      return player.playerHp > _player.playerHp;
    if (query.rankParam === 'Mp')
      return player.playerMp > _player.playerMp;
    if (query.rankParam === 'Exp')
      return player.playerExp > _player.playerExp;
    if (query.rankParam === 'Atk')
      return player.playerAtk > _player.playerAtk;
    if (query.rankParam === 'Def')
      return player.playerDef > _player.playerDef;
    if (query.rankParam === 'Agi')
      return player.playerAgi > _player.playerAgi;
    if (query.rankParam === 'Int')
      return player.playerInt > _player.playerInt;
    if (query.rankParam === 'Strong')
      return getStrong(player) > getStrong(_player);
  });

  cb(null, _result);
};

function getChallenger(player) {
  var list = playerCache.list;

  // 同じエリアにいるPlayer
  var targetPlayers = _.filter(list, (_player) => {
    return player.playerMap === _player.playerMap && player.playerId !== _player.playerId;
  });

  // 隣接するPlayer
  mapService.get({ targetMapId: player.playerMap }, (err, map) => {
    _.forEach(map.mapNext, (next) => {
      var targetPlayersTmp = _.filter(list, (_player) => {
        return next === _player.playerMap;
      });
      targetPlayers = targetPlayers.concat(targetPlayersTmp);
    });
  });

  return targetPlayers;
}

playerService.challengeThree = (query, cb) => {
  var list = playerCache.list;
  var result;

  if (query.isAscend === 'true') {
    result = list.sort((a,b) => {
      if( getStrong(a) < getStrong(b) ) return -1;
      if( getStrong(a) > getStrong(b) ) return 1;
      return 0;
    });
  } else {
    result = list.sort((a,b) => {
      if( getStrong(a) > getStrong(b) ) return -1;
      if( getStrong(a) < getStrong(b) ) return 1;
      return 0;
    });
  }

  cb(null, _.slice(result, 0, 20));
};

playerService.challengeFour = (query, cb) => {
  var playerIds = query.playerIds.split(',');
  console.log(playerIds);

  var playerOne = playerService.findOne(playerIds[0]);
  var playerTwo = playerService.findOne(playerIds[1]);

  var itemOne;
  _.forEach(playerOne.playerItems, (item) => {
    var itemTmp = itemService.findOne(item);
    if (!itemOne || itemTmp.itemValue > itemOne.itemValue)
      itemOne = itemTmp;
  });

  var itemTwo;
  _.forEach(playerTwo.playerItems, (item) => {
    var itemTmp = itemService.findOne(item);
    if (!itemTwo || itemTmp.itemValue > itemTwo.itemValue)
      itemTwo = itemTmp;
  });

  if (itemOne.itemValue > itemTwo.itemValue) {
    var paidExp = itemOne.itemValue - itemTwo.itemValue;
    playerService.updatePlayerExp({ targetPlayerId: playerOne.playerId, calcValue: paidExp } , () => {
      playerService.updatePlayerExp({ targetPlayerId: playerTwo.playerId, calcValue: -paidExp } , () => {
        playerOne.playerItems.push(itemOne.itemId);
        playerTwo.playerItems.some((v, i) => {
            if (v.itemId === itemOne.itemId) playerTwo.playerItems.splice(i,1);
        });
        cb(null, [playerOne, playerTwo]);
      });
    });
  }
  if (itemTwo.itemValue > itemOne.itemValue) {
    paidExp = itemTwo.itemValue - itemOne.itemValue;
    playerService.updatePlayerExp({ targetPlayerId: playerTwo.playerId, calcValue: paidExp } , () => {
      playerService.updatePlayerExp({ targetPlayerId: playerOne.playerId, calcValue: -paidExp } , () => {
        playerTwo.playerItems.push(itemTwo.itemId);
        playerTwo.playerItems.some((v, i) => {
          if (v.itemId === itemOne.itemId) playerTwo.playerItems.splice(i,1);
        });
        cb(null, [playerOne, playerTwo]);
      });
    });
  }
};
