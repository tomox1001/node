'use strict';

const _ = require('lodash');

let userCache = require('datastore/cache/user');

var userService = exports;

userService.get = (query, cb) => {
  var list = userCache.list;
  var user = filterHandlers.userId(list, query.userId);

  cb(null, user[0]);
};

userService.search = (query, cb) => {
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

  // シナリオ2
  var postId = query.findByPostId || null;

  // 投稿
  if (postId) {
    list = filterHandlers.postId(list, postId);
  }

  // 投稿 以降
  var postTimeGTE = query.findByPostDateTimeGTE || null;
  if (postTimeGTE) {
    list = filterHandlers.postTimeGTE(list, postTimeGTE);
  }

  // 投稿 以前
  var postTimeLTE = query.findByPostDateTimeLTE || null;
  if (postTimeLTE) {
    list = filterHandlers.postTimeLTE(list, postTimeLTE);
  }

  // アイテム一致
  var postItemId = query.findByPostItemId || null;
  if (postItemId) {
    list = filterHandlers.postItemId(list, postId);
  }

  // スコア最大値
  var postScoreMax = query.findByMaxPostItemScoreGTE || null;
  if (postScoreMax) {
    list = filterHandlers.postScoreMax(list, postScoreMax);
  }

  // スコア最小値
  var postScoreMin = query.findByMaxPostItemScoreLTE || null;
  if (postScoreMin) {
    list = filterHandlers.postScoreMin(list, postScoreMin);
  }

  // アイテムのステータス一致
  var postItemState = query.findByPostItemState || null;
  if (postItemState) {
    list = filterHandlers.postItemState(list, postItemState);
  }

  // アイテムのステータス不一致
  var postItemStateNot = query.findByPostItemStateNotEQ || null;
  if (postItemStateNot) {
    list = filterHandlers.postItemStateNotEQ(list, postItemStateNot);
  }

  // ライク全て含む
  if (query.findByPostLikeUsersIncludeUserIds) {
    var likeInclude = query.findByPostLikeUsersIncludeUserIds.split(',');;

    if (likeInclude) {
      list = filterHandlers.likeInclude(list, likeInclude);
    }
  }

  // ライク全て含まない
  if (query.findByPostLikeUsersNotIncludeUserIds) {
    var likeNotInclude = query.findByPostLikeUsersNotIncludeUserIds.split(',');

    if (likeNotInclude) {
      list = filterHandlers.likeNotInclude(list, likeNotInclude);
    }
  }

  cb(null, list.splice(0, limit));
};

const filterHandlers = {
  // userID
  userId: (list, userId) => {
    return list.filter((doc) => {
      return !!~doc.userId.indexOf(userId);
    });
  },
  // スコア（以上）
  scoreGte: (list, score) => {
    return list.filter((doc) => {
      return doc.userPublicScore >= score;
    });
  },
  // スコア（以下）
  scoreLte: (list, score) => {
    return list.filter((doc) => {
      return doc.userPublicScore <= score;
    });
  },
  // フレンド数（以上）
  friendGte: (list, count) => {
    return list.filter((doc) => {
      return doc.userFriends.length >= count;
    });
  },
  // フレンド数（以下）
  friendLte: (list, count) => {
    return list.filter((doc) => {
      return doc.userFriends.length <= count;
    });
  },
  // フレンドの完全一致
  friendInclude: (list, ids) => {
    return list.filter((doc) => {
      return ids.every((id) => {
        return !!~doc.userFriends.indexOf(id);
      });
    });
  },
  // フレンドの不一致
  friendNotInclude: (list, ids) => {
    return list.filter((doc) => {
      return ids.every((id) => {
        return !~doc.userFriends.indexOf(id);
      });
    });
  },

  // postId
  postId: (list, postId) => {
    var userIds = postCache.list.filter((post) => {
      return !!~post.postId.indexOf(postId);
    }).map((post) => {
      return post.postUserId;
    });

    return list.filter((user) => {
      return !!~userIds.indexOf(user.userId);
    });
  },
  // 投稿 以降
  postTimeGTE: (list, time) => {
    var userIds = postCache.list.filter((post) => {
      return post.postDateTime >= time;
    }).map((post) => {
      return post.postUserId;
    });

    return list.filter((user) => {
      return !!~userIds.indexOf(user.userId);
    });
  },
  // 投稿 以前
  postTimeLTE: (list, time) => {
    var userIds = postCache.list.filter((post) => {
      return post.postDateTime <= time;
    }).map((post) => {
      return post.postUserId;
    });

    return list.filter((user) => {
      return !!~userIds.indexOf(user.userId);
    });
  },
  // アイテムID
  postItemId: (list, itemId) => {
    var userIds = postCache.list.filter((post) => {
      return post.postItemId === itemId;
    }).map((post) => {
      return post.postUserId;
    });

    return list.filter((user) => {
      return !!~userIds.indexOf(user.userId);
    });
  },
  // スコア最大値
  postScoreMax: (list, score) => {
    var userIds = postCache.list.filter((post) => {
      return post.postItemScore >= score;
    }).map((post) => {
      return post.postUserId;
    });

    return list.filter((user) => {
      return !!~userIds.indexOf(user.userId);
    });
  },
  // スコア最小値
  postScoreMin: (list, score) => {
    var userIds = postCache.list.filter((post) => {
      return post.postItemScore <= score;
    }).map((post) => {
      return post.postUserId;
    });

    return list.filter((user) => {
      return !!~userIds.indexOf(user.userId);
    });
  },
  // アイテムのステータス一致
  postItemState: (list, state) => {
    var userIds = postCache.list.filter((post) => {
      return post.postItemState === state;
    }).map((post) => {
      return post.postUserId;
    });

    return list.filter((user) => {
      return !!~userIds.indexOf(user.userId);
    });
  },
  // アイテムのステータス不一致
  postItemStateNotEQ: (list, state) => {
    var userIds = postCache.list.filter((post) => {
      return post.postItemState !== state;
    }).map((post) => {
      return post.postUserId;
    });

    return list.filter((user) => {
      return !!~userIds.indexOf(user.userId);
    });
  },
  // ライク全て含む
  likeInclude: (list, ids) => {
    var userIds = postCache.list.filter((post) => {
      return ids.every((id) => {
        return !!~post.postLikeUsers.indexOf(id);
      });
    }).map((post) => {
      return post.postUserId;
    });

    return list.filter((user) => {
      return !!~userIds.indexOf(user.userId);
    });
  },
  // ライク全て含まない
  likeNotInclude: (list, ids) => {
    var userIds = postCache.list.filter((post) => {
      return ids.every((id) => {
        return !~post.postLikeUsers.indexOf(id);
      });
    }).map((post) => {
      return post.postUserId;
    });

    return list.filter((user) => {
      return !!~userIds.indexOf(user.userId);
    });
  },
};
