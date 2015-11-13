'use strict';

var _ = require('lodash');

var userCache = require('datastore/cache/user');
var postCache = require('datastore/cache/post');


var postService = exports;



var filterHandlers = {
  postId: function(list, postId) {
    return list.filter(function(doc) {
      return !!~doc.postId.indexOf(postId);
    });
  },
  // 投稿 以降
  postTimeGTE: function(list, time) {
    var postIds = postCache.list.filter(function(post) {
      return post.postDateTime >= time;
    }).map(function(post) {
      return post.postUserId;
    });

    return list.filter(function(post) {
      return !!~postIds.indexOf(post.postId);
    });
  },
  // 投稿 以前
  postTimeLTE: function(list, time) {
    var postIds = postCache.list.filter(function(post) {
      return post.postDateTime <= time;
    }).map(function(post) {
      return post.postUserId;
    });

    return list.filter(function(post) {
      return !!~postIds.indexOf(post.postId);
    });
  },
  // アイテムID
  postUserId: function(list, userId) {
    var postIds = postCache.list.filter(function(post) {
      return post.postUserId === userId;
    }).map(function(post) {
      return post.postUserId;
    });

    return list.filter(function(post) {
      return !!~postIds.indexOf(post.postId);
    });
  },
  // アイテムID
  postItemId: function(list, itemId) {
    var postIds = postCache.list.filter(function(post) {
      return post.postItemId === itemId;
    }).map(function(post) {
      return post.postUserId;
    });

    return list.filter(function(post) {
      return !!~postIds.indexOf(post.postId);
    });
  },
  // スコア最大値
  postScoreMax: function(list, score) {
    var postIds = postCache.list.filter(function(post) {
      return post.postItemScore >= score;
    }).map(function(post) {
      return post.postUserId;
    });

    return list.filter(function(post) {
      return !!~postIds.indexOf(post.postId);
    });
  },
  // スコア最小値
  postScoreMin: function(list, score) {
    var postIds = postCache.list.filter(function(post) {
      return post.postItemScore <= score;
    }).map(function(post) {
      return post.postUserId;
    });

    return list.filter(function(post) {
      return !!~postIds.indexOf(post.postId);
    });
  },
  // アイテムのステータス一致
  postItemState: function(list, state) {
    var postIds = postCache.list.filter(function(post) {
      return post.postItemState === state;
    }).map(function(post) {
      return post.postUserId;
    });

    return list.filter(function(post) {
      return !!~postIds.indexOf(post.postId);
    });
  },
  // アイテムのステータス不一致
  postItemStateNotEQ: function(list, state) {
    var postIds = postCache.list.filter(function(post) {
      return post.postItemState !== state;
    }).map(function(post) {
      return post.postUserId;
    });

    return list.filter(function(post) {
      return !!~postIds.indexOf(post.postId);
    });
  },
  // ライク全て含む
  likeInclude: function(list, ids) {
    var postIds = postCache.list.filter(function(post) {
      return ids.every(function(id) {
        return !!~post.postLikeUsers.indexOf(id);
      });
    }).map(function(post) {
      return post.postUserId;
    });

    return list.filter(function(post) {
      return !!~postIds.indexOf(post.postId);
    });
  },
  // ライク全て含まない
  likeNotInclude: function(list, ids) {
    var postIds = postCache.list.filter(function(post) {
      return ids.every(function(id) {
        return !~post.postLikeUsers.indexOf(id);
      });
    }).map(function(post) {
      return post.postUserId;
    });

    return list.filter(function(post) {
      return !!~postIds.indexOf(post.postId);
    });
  },
};


postService.search = function(query, callback) {
  var list = postCache.list;

  // シナリオ5

  // 件数
  var limit = query.limit || 100;

  // postID
  var postId = query.findByPostId || null;

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

  // ユーザー一致
  var postUserId = query.findByPostUserId || null;

  if (postUserId) {
    list = filterHandlers.postItemId(list, postUserId);
  }

  // アイテム一致
  var postItemId = query.findByPostItemId || null;

  if (postItemId) {
    list = filterHandlers.postItemId(list, postItemId);
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

  callback(null, list.splice(0, limit));
};



