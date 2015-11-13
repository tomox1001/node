'use strict';

var _ = require('lodash');

var userCache = require('datastore/cache/user');


var userService = exports;



var filterHandlers = {
  // userID
  userId: function(list, userId) {
    return list.filter(function(doc) {
      return !!~doc.userId.indexOf(userId);
    });
  },
  // スコア（以上）
  scoreGte: function(list, score) {
    return list.filter(function(doc) {
      return doc.userPublicScore >= score;
    });
  },
  // スコア（以下）
  scoreLte: function(list, score) {
    return list.filter(function(doc) {
      return doc.userPublicScore <= score;
    });
  },
  // フレンド数（以上）
  friendGte: function(list, count) {
    return list.filter(function(doc) {
      return doc.userFriends.length >= count;
    });
  },
  // フレンド数（以下）
  friendLte: function(list, count) {
    return list.filter(function(doc) {
      return doc.userFriends.length <= count;
    });
  },
  // フレンドの完全一致
  friendInclude: function(list, ids) {
    return list.filter(function(doc) {
      return ids.every(function(id) {
        return !!~doc.userFriends.indexOf(id);
      });
    });
  },
  // フレンドの不一致
  friendNotInclude: function(list, ids) {
    return list.filter(function(doc) {
      return ids.every(function(id) {
        return !~doc.userFriends.indexOf(id);
      });
    });
  },
};


userService.get = function(userId) {
  var list = userCache.list;
  var user = filterHandlers.userId(list, userId);

  return user[0];
};

userService.search = function(query, callback) {
  var list = userCache.list;

  // 件数
  var limit = query.limit || 100;

  // userID
  var userId = query.findByUserId || null;

  if (userId) {
    list = filterHandlers.userId(list, userId);
  }

  // スコア（以上）
  var scoreGte = query.findByUserPublicScoreGTE || 0;

  if (scoreGte) {
    list = filterHandlers.scoreGte(list, scoreGte);
  }

  // スコア（以下）
  var scoreLte = query.findByUserPublicScoreLTE || null;

  if (scoreLte) {
    list = filterHandlers.scoreLte(list, scoreLte);
  }

  // フレンド数（以上）
  var friendGte = query.findByUserFriendsNumberGTE || 0;

  if (friendGte) {
    list = filterHandlers.friendGte(list, friendGte);
  }

  // フレンド数（以下）
  var friendLte = query.findByUserFriendsNumberLTE || null;

  if (friendLte) {
    list = filterHandlers.friendLte(list, friendLte);
  }

  // フレンドの完全一致
  if (query.findByUserFriendsIncludeUserIds) {
    var friendIncludeList = (query.findByUserFriendsIncludeUserIds || '').split(',');

    if (friendIncludeList.length) {
      list = filterHandlers.friendInclude(list, friendIncludeList);
    }
  }

  // フレンドの不一致
  if (query.findByUserFriendsNotIncludeUserIds) {
    var friendNotIncludeList = (query.findByUserFriendsNotIncludeUserIds || '').split(',');

    if (friendNotIncludeList.length) {
      list = filterHandlers.friendNotInclude(list, friendNotIncludeList);
    }
  }

  callback(null, list.splice(0, limit));
};



