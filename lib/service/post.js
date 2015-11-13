'use strict';

var _ = require('lodash');

var userCache = require('datastore/cache/user');
var itemCache = require('datastore/cache/item');
var postCache = require('datastore/cache/post');


var postService = exports;



var filterHandlers = {

  // シナリオ5

  // ID
  postId: function(list, postId) {
    return list.filter(function(doc) {
      return !!~doc.postId.indexOf(postId);
    });
  },
  // 投稿 以降
  postTimeGTE: function(list, time) {
    return list.filter(function(post) {
      return post.postDateTime >= time;
    });
  },
  // 投稿 以前
  postTimeLTE: function(list, time) {
    return list.filter(function(post) {
      return post.postDateTime <= time;
    });
  },
  // ユーザ一致
  findByPostUserId: function(list, userId) {
    return list.filter(function(post) {
      return !!~post.postUserId.indexOf(userId);
    });
  },
  // アイテム一致
  findByPostItemId: function(list, itemId) {
    return list.filter(function(post) {
      return !!~post.postItemId.indexOf(itemId);
    });
  },
  // スコア 以上
  findByPostItemScoreGTE: function(list, score) {
    return list.filter(function(post) {
      return post.postItemScore >= score;
    });
  },
  // スコア 以下
  findByPostItemScoreLTE: function(list, score) {
    return list.filter(function(post) {
      return post.postItemScore <= score;
    });
  },

  // ステート 一致
  findByPostItemState: function(list, state) {
    return list.filter(function(post) {
      return post.postItemState === state;
    });
  },
  // ステート 不一致
  findByPostItemStateNotEQ: function(list, state) {
    return list.filter(function(post) {
      return post.postItemState !== state;
    });
  },
  // ライク 以上
  findByPostLikeUsersNumberGTE: function(list, count) {
    return list.filter(function(post) {
      return post.postLikeUsers.length >= count;
    });
  },
  // ライク 以下
  findByPostLikeUsersNumberLTE: function(list, count) {
    return list.filter(function(post) {
      return post.postLikeUsers.length <= count;
    });
  },
  // ライク ユーザ一致
  findByPostLikeUsersIncludeUserIds: function(list, userIds) {
    return list.filter(function(post) {
      return userIds.every(function(id) {
        return !!~post.postLikeUsers.indexOf(id);
      });
    });
  },
  // ライク 不一致
  findByPostLikeUsersNotIncludeUserIds: function(list, userIds) {
    return list.filter(function(post) {
      return userIds.every(function(id) {
        return !~post.postLikeUsers.indexOf(id);
      });
    });
  },
  // タグ一致
  findByPostTagsIncludeAll: function(list, tags) {
    return list.filter(function(post) {
      return tags.every(function(tag) {
        return !!~post.postTags.indexOf(tag);
      });
    });
  },
  // タグ一部
  findByPostTagsIncludeAny: function(list, tags) {
    return list.filter(function(post) {
      return tags.some(function(tag) {
        return !!~post.postTags.indexOf(tag);
      });
    });
  },

  // シナリオ6

  // スコア 以上
  findByUserPublicScoreGTE: function(list, score) {
    var userIds = userCache.list.filter(function(user) {
      return user.userPublicScore >= score;
    }).map(function(user) {
      return user.userId;
    });

    return list.filter(function(post) {
      return !!~userIds.indexOf(post.postUserId);
    });
  },
  // スコア 以下
  findByUserPublicScoreLTE: function(list, score) {
    var userIds = userCache.list.filter(function(user) {
      return user.userPublicScore <= score;
    }).map(function(user) {
      return user.userId;
    });

    return list.filter(function(post) {
      return !!~userIds.indexOf(post.postUserId);
    });
  },
  // フレンド数 以上
  findByUserFriendsNumberGTE: function(list, count) {
    var userIds = userCache.list.filter(function(user) {
      return user.userFriends.length >= count;
    }).map(function(user) {
      return user.userId;
    });

    return list.filter(function(post) {
      return !!~userIds.indexOf(post.postUserId);
    });
  },
  // フレンド数 以下
  findByUserFriendsNumberLTE: function(list, count) {
    var userIds = userCache.list.filter(function(user) {
      return user.userFriends.length <= count;
    }).map(function(user) {
      return user.userId;
    });

    return list.filter(function(post) {
      return !!~userIds.indexOf(post.postUserId);
    });
  },
  // フレンド一致
  findByUserFriendsIncludeUserIds: function(list, ids) {
    var userIds = userCache.list.filter(function(user) {
      return ids.every(function(id) {
        return !!~user.userFriends.indexOf(id);
      });
    }).map(function(user) {
      return user.userId;
    });

    return list.filter(function(post) {
      return !!~userIds.indexOf(post.postUserId);
    });
  },
  // フレンド 不一致
  findByUserFriendsNotIncludeUserIds: function(list, ids) {
    var userIds = userCache.list.filter(function(user) {
      return ids.every(function(id) {
        return !~user.userFriends.indexOf(id);
      });
    }).map(function(user) {
      return user.userId;
    });

    return list.filter(function(post) {
      return !!~userIds.indexOf(post.postUserId);
    });
  },

  // 会社一致
  findByItemSupplier: function(list, supplier) {
    var itemIds = itemCache.list.filter(function(item) {
      return item.itemSupplier === supplier;
    }).map(function(item) {
      return item.itemId;
    });

    return list.filter(function(post) {
      return !!~itemIds.indexOf(post.postItemId);
    });
  },
  // 売れた数 以上
  findByItemSoldQuantityGTE: function(list, count) {
    var itemIds = itemCache.list.filter(function(item) {
      return item.itemSoldQuantity >= count;
    }).map(function(item) {
      return item.itemId;
    });

    return list.filter(function(post) {
      return !!~itemIds.indexOf(post.postItemId);
    });
  },
  // 売れた数 以下
  findByItemSoldQuantityLTE: function(list, count) {
    var itemIds = itemCache.list.filter(function(item) {
      return item.itemSoldQuantity <= count;
    }).map(function(item) {
      return item.itemId;
    });

    return list.filter(function(post) {
      return !!~itemIds.indexOf(post.postItemId);
    });
  },
  // 価格 以上
  findByItemSalePriceGTE: function(list, price) {
    var itemIds = itemCache.list.filter(function(item) {
      return item.itemSalePrice >= price;
    }).map(function(item) {
      return item.itemId;
    });

    return list.filter(function(post) {
      return !!~itemIds.indexOf(post.postItemId);
    });
  },
  // 価格 以下
  findByItemSalePriceLTE: function(list, price) {
    var itemIds = itemCache.list.filter(function(item) {
      return item.itemSalePrice <= price;
    }).map(function(item) {
      return item.itemId;
    });

    return list.filter(function(post) {
      return !!~itemIds.indexOf(post.postItemId);
    });
  },
  // アイテムタグ 完全一致
  findByItemTagsIncludeAll: function(list, tags) {
    var itemIds = itemCache.list.filter(function(item) {
      return tags.every(function(tag) {
        return !!~item.itemTags.indexOf(tag);
      });
    }).map(function(item) {
      return item.itemId;
    });

    return list.filter(function(post) {
      return !!~itemIds.indexOf(post.postItemId);
    });
  },
  // アイテムタグ 一部一致
  findByItemTagsIncludeAny: function(list, tags) {
    var itemIds = itemCache.list.filter(function(item) {
      return tags.some(function(tag) {
        return !!~item.itemTags.indexOf(tag);
      });
    }).map(function(item) {
      return item.itemId;
    });

    return list.filter(function(post) {
      return !!~itemIds.indexOf(post.postItemId);
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
  var findByPostUserId = query.findByPostUserId || null;

  if (findByPostUserId) {
    list = filterHandlers.findByPostUserId(list, findByPostUserId);
  }

  // アイテム一致
  var findByPostItemId = query.findByPostItemId || null;

  if (findByPostItemId) {
    list = filterHandlers.findByPostItemId(list, findByPostItemId);
  }

  // スコア 以上
  var findByPostItemScoreGTE = query.findByPostItemScoreGTE || null;

  if (findByPostItemScoreGTE) {
    list = filterHandlers.findByPostItemScoreGTE(list, findByPostItemScoreGTE);
  }

  // スコア 以下
  var findByPostItemScoreLTE = query.findByPostItemScoreLTE || null;

  if (findByPostItemScoreLTE) {
    list = filterHandlers.findByPostItemScoreLTE(list, findByPostItemScoreLTE);
  }


  // ステート一致
  var findByPostItemState = query.findByPostItemState || null;

  if (findByPostItemState) {
    list = filterHandlers.findByPostItemState(list, findByPostItemState);
  }

  // ステート 不一致
  var findByPostItemStateNotEQ = query.findByPostItemStateNotEQ || null;

  if (findByPostItemStateNotEQ) {
    list = filterHandlers.findByPostItemStateNotEQ(list, findByPostItemStateNotEQ);
  }

  // ライク数 以上
  var findByPostLikeUsersNumberGTE = query.findByPostLikeUsersNumberGTE || null;

  if (findByPostLikeUsersNumberGTE) {
    list = filterHandlers.findByPostLikeUsersNumberGTE(list, findByPostLikeUsersNumberGTE);
  }

  // ライク 以下
  var findByPostLikeUsersNumberLTE = query.findByPostLikeUsersNumberLTE || null;

  if (findByPostLikeUsersNumberLTE) {
    list = filterHandlers.findByPostLikeUsersNumberLTE(list, findByPostLikeUsersNumberLTE);
  }

  // ライク ユーザ一致
  if (query.findByPostLikeUsersIncludeUserIds) {
    var findByPostLikeUsersIncludeUserIds = query.findByPostLikeUsersIncludeUserIds.split(',');

    if (findByPostLikeUsersIncludeUserIds) {
      list = filterHandlers.findByPostLikeUsersIncludeUserIds(list, findByPostLikeUsersIncludeUserIds);
    }
  }

  // ライクユーザ 不一致
  if (query.findByPostLikeUsersNotIncludeUserIds) {
    var findByPostLikeUsersNotIncludeUserIds = query.findByPostLikeUsersNotIncludeUserIds.split(',');

    if (findByPostLikeUsersNotIncludeUserIds) {
      list = filterHandlers.findByPostLikeUsersNotIncludeUserIds(list, findByPostLikeUsersNotIncludeUserIds);
    }
  }

  // タグ完全一致
  if (query.findByPostTagsIncludeAll) {
    var findByPostTagsIncludeAll = query.findByPostTagsIncludeAll.split(',');

    if (findByPostTagsIncludeAll) {
      list = filterHandlers.findByPostTagsIncludeAll(list, findByPostTagsIncludeAll);
    }
  }

  // タグ いずれか
  if (query.findByPostTagsIncludeAny) {
    var findByPostTagsIncludeAny = query.findByPostTagsIncludeAny.split(',');

    if (findByPostTagsIncludeAny) {
      list = filterHandlers.findByPostTagsIncludeAny(list, findByPostTagsIncludeAny);
    }
  }


  // シナリオ6

  // スコア 以上
  var findByUserPublicScoreGTE = query.findByUserPublicScoreGTE;

  if (findByUserPublicScoreGTE) {
    list = filterHandlers.findByUserPublicScoreGTE(list, findByUserPublicScoreGTE);
  }

  // スコア 以下
  var findByUserPublicScoreLTE = query.findByUserPublicScoreLTE;

  if (findByUserPublicScoreLTE) {
    list = filterHandlers.findByUserPublicScoreLTE(list, findByUserPublicScoreLTE);
  }

  // フレンド数 以上
  var findByUserFriendsNumberGTE = query.findByUserFriendsNumberGTE || null;

  if (findByUserFriendsNumberGTE) {
    list = filterHandlers.findByUserFriendsNumberGTE(list, findByUserFriendsNumberGTE);
  }

   // フレンド数 以下
  var findByUserFriendsNumberLTE = query.findByUserFriendsNumberLTE || null;

  if (findByUserFriendsNumberLTE) {
    list = filterHandlers.findByUserFriendsNumberLTE(list, findByUserFriendsNumberLTE);
  }

  // フレンド一致
  if (query.findByUserFriendsIncludeUserIds) {
    var findByUserFriendsIncludeUserIds = query.findByUserFriendsIncludeUserIds.split(',');

    if (findByUserFriendsIncludeUserIds) {
      list = filterHandlers.findByUserFriendsIncludeUserIds(list, findByUserFriendsIncludeUserIds);
    }
  }

  // フレンド 不一致
  if (query.findByUserFriendsNotIncludeUserIds) {
    var findByUserFriendsNotIncludeUserIds = query.findByUserFriendsNotIncludeUserIds.split(',');

    if (findByUserFriendsNotIncludeUserIds) {
      list = filterHandlers.findByUserFriendsNotIncludeUserIds(list, findByUserFriendsNotIncludeUserIds);
    }
  }

  // 会社一致
  var findByItemSupplier = query.findByItemSupplier || null;

  if (findByItemSupplier) {
    list = filterHandlers.findByItemSupplier(list, findByItemSupplier);
  }

  // 売れた数 以上
  var findByItemSoldQuantityGTE = query.findByItemSoldQuantityGTE || null;

  if (findByItemSoldQuantityGTE) {
    list = filterHandlers.findByItemSoldQuantityGTE(list, findByItemSoldQuantityGTE);
  }

  // 売れた数 以下
  var findByItemSoldQuantityLTE = query.findByItemSoldQuantityLTE || null;

  if (findByItemSoldQuantityLTE) {
    list = filterHandlers.findByItemSoldQuantityLTE(list, findByItemSoldQuantityLTE);
  }

  // 価格 以上
  var findByItemSalePriceGTE = query.findByItemSalePriceGTE || null;

  if (findByItemSalePriceGTE) {
    list = filterHandlers.findByItemSalePriceGTE(list, findByItemSalePriceGTE);
  }

  // 価格 以下
  var findByItemSalePriceLTE = query.findByItemSalePriceLTE || null;

  if (findByItemSalePriceLTE) {
    list = filterHandlers.findByItemSalePriceLTE(list, findByItemSalePriceLTE);
  }

  // アイテムタグ 完全一致
  if (query.findByItemTagsIncludeAll) {
    var findByItemTagsIncludeAll = query.findByItemTagsIncludeAll.split(',');

    if (findByItemTagsIncludeAll) {
      list = filterHandlers.findByItemTagsIncludeAll(list, findByItemTagsIncludeAll);
    }
  }

  // アイテムタグ 部分一致
  if (query.findByItemTagsIncludeAny) {
    var findByItemTagsIncludeAny = query.findByItemTagsIncludeAny.split(',');

    if (findByItemTagsIncludeAny) {
      list = filterHandlers.findByItemTagsIncludeAny(list, findByItemTagsIncludeAny);
    }
  }

  callback(null, list.splice(0, limit));
};



