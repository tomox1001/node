'use strict';

var _ = require('lodash');


var userService = exports;





userService.search = function(query, callback) {
  // 件数
  var limit = query.limit || 100;

  // userID
  var userId = query.findByUserId || null;

  // スコア（以上）
  var scoreGte = query.findByUserPublicScoreGTE || 0;

  // スコア（以下）
  var scoreLte = query.findByUserPublicScoreLTE || null;

  // フレンド数（以上）
  var friendGte = query.findByUserFriendsNumberGTE || 0;

  // フレンド数（以下）
  var friendLte = query.findByUserFriendsNumberLTE || null;

  // フレンドの完全一致
  var friendIncludeList = (query.findByUserFriendsIncludeUserIds || '').split(',');

  // フレンドの不一致
  var friendNotIncludeList = (query.findByUserFriendsNotIncludeUserIds || '').split(',');


};



