'use strict';

var _ = require('lodash');

var userCache = require('datastore/cache/user');
var postCache = require('datastore/cache/post');
var itemCache = require('datastore/cache/item');


var itemService = exports;


var handlers = {
  // シナリオ3

  // itemId
  itemId: function(list, itemId) {
    return list.filter(function(doc) {
      return !!~doc.itemId.indexOf(itemId);
    });
  },
  // findByItemSupplier
  findByItemSupplier: function(list, supplier) {
    return list.filter(function(doc) {
      return !!~doc.itemSupplier.indexOf(supplier);
    });
  },
  // 売れた 以上
  findByItemSoldQuantityGTE: function(list, quantity) {
    return list.filter(function(doc) {
      return doc.itemSoldQuantity >= quantity;
    });
  },
  // 売れた 以下
  findByItemSoldQuantityLTE: function(list, quantity) {
    return list.filter(function(doc) {
      return doc.itemSoldQuantity <= quantity;
    });
  },
  // 売値 以上
  findByItemSalePriceGTE: function(list, price) {
    return list.filter(function(doc) {
      return doc.itemSalePrice >= price;
    });
  },
  // 売上 以下
  findByItemSalePriceLTE: function(list, price) {
    return list.filter(function(doc) {
      return doc.itemSalePrice <= price;
    });
  },
  // タグの一致
  findByItemTagsIncludeAll: function(list, tags) {
    return list.filter(function(doc) {
      return tags.every(function(tag) {
        return !!~doc.itemTags.indexOf(tag);
      });
    });
  },
  // タグが1つでも含まれる
  findByItemTagsIncludeAny: function(list, tags) {
    return list.filter(function(doc) {
      return tags.some(function(tag) {
        return !!~doc.itemTags.indexOf(tag);
      });
    });
  },

  // シナリオ4

  // PostID
  findByPostId: function(list, postId) {
    var itemIds = postCache.list.filter(function(post) {
      return !!~post.postId.indexOf(postId);
    }).map(function(post) {
      return post.postItemId;
    });

    return list.filter(function(item) {
      return !!~itemIds.indexOf(item.itemId);
    });
  },
  // 投稿 移行
  findByPostDateTimeGTE: function(list, time) {
    var itemIds = postCache.list.filter(function(post) {
      return post.postDateTime >= time;
    }).map(function(post) {
      return post.postItemId;
    });

    return list.filter(function(item) {
      return !!~itemIds.indexOf(item.itemId);
    });
  },
  // 投稿 以前
  findByPostDateTimeLTE: function(list, time) {
    var itemIds = postCache.list.filter(function(post) {
      return post.postDateTime <= time;
    }).map(function(post) {
      return post.postItemId;
    });

    return list.filter(function(item) {
      return !!~itemIds.indexOf(item.itemId);
    });
  },
  // 投稿者の一致
  findByPostUserId: function(list, userId) {
    var itemIds = postCache.list.filter(function(post) {
      return !!~post.postUserId.indexOf(userId);
    }).map(function(post) {
      return post.postItemId;
    });

    return list.filter(function(item) {
      return !!~itemIds.indexOf(item.itemId);
    });
  },
  // スコア 最大値
  findByMaxPostItemScoreGTE: function(list, score) {
    var itemIds = postCache.list.filter(function(post) {
      return post.postItemScore >= score;
    }).map(function(post) {
      return post.postItemId;
    });

    return list.filter(function(item) {
      return !!~itemIds.indexOf(item.itemId);
    });
  },
  // スコア 最小値
  findByMinPostItemScoreLTE: function(list, score) {
    var itemIds = postCache.list.filter(function(post) {
      return post.postItemScore <= score;
    }).map(function(post) {
      return post.postItemId;
    });

    return list.filter(function(item) {
      return !!~itemIds.indexOf(item.itemId);
    });
  },
  // ステータスの一致
  findByPostItemState: function(list, state) {
    var itemIds = postCache.list.filter(function(post) {
      return post.postItemState === state;
    }).map(function(post) {
      return post.postItemId;
    });

    return list.filter(function(item) {
      return !!~itemIds.indexOf(item.itemId);
    });
  },
  // ステータスの不一致
  findByPostItemStateNotEQ: function(list, state) {
    var itemIds = postCache.list.filter(function(post) {
      return post.postItemState !== state;
    }).map(function(post) {
      return post.postItemId;
    });

    return list.filter(function(item) {
      return !!~itemIds.indexOf(item.itemId);
    });
  },
  // ライク 一致
  findByPostLikeUsersIncludeUserIds: function(list, ids) {
    var itemIds = postCache.list.filter(function(post) {
      return ids.every(function(id) {
        return !!~post.postLikeUsers.indexOf(id);
      });
    }).map(function(post) {
      return post.postItemId;
    });

    return list.filter(function(item) {
      return !!~itemIds.indexOf(item.itemId);
    });
  },
  // ライク 不一致
  findByPostLikeUsersNotIncludeUserIds: function(list, ids) {
    var itemIds = postCache.list.filter(function(post) {
      return ids.every(function(id) {
        return !~post.postLikeUsers.indexOf(id);
      });
    }).map(function(post) {
      return post.postItemId;
    });

    return list.filter(function(item) {
      return !!~itemIds.indexOf(item.itemId);
    });
  },
};


itemService.search = function(query, callback) {
  var list = itemCache.list;

  // シナリオ3

  // 件数
  var limit = query.limit || 100;

  // itemId
  var itemId = query.findByItemId || null;

  if (itemId) {
    list = handlers.itemId(list, itemId);
  }

  // findByItemSupplier
  var itemSupplier = query.findByItemSupplier || null;

  if (itemSupplier) {
    list = handlers.findByItemSupplier(list, itemSupplier);
  }

  // 売れた 以上
  var findByItemSoldQuantityGTE = query.findByItemSoldQuantityGTE || null;

  if (findByItemSoldQuantityGTE) {
    list = handlers.findByItemSoldQuantityGTE(list, findByItemSoldQuantityGTE);
  }

  // 売れた 以下
  var findByItemSoldQuantityLTE = query.findByItemSoldQuantityLTE || null;

  if (findByItemSoldQuantityLTE) {
    list = handlers.findByItemSoldQuantityLTE(list, findByItemSoldQuantityLTE);
  }

  // 売値 以上
  var findByItemSalePriceGTE = query.findByItemSalePriceGTE || null;

  if (findByItemSalePriceGTE) {
    list = handlers.findByItemSalePriceGTE(list, findByItemSalePriceGTE);
  }

  // 売値 以下
  var findByItemSalePriceLTE = query.findByItemSalePriceLTE || null;

  if (findByItemSalePriceLTE) {
    list = handlers.findByItemSalePriceLTE(list, findByItemSalePriceLTE);
  }

  // タグの一致
  if (query.findByItemTagsIncludeAll) {
    var findByItemTagsIncludeAll = query.findByItemTagsIncludeAll.split(',');

    if (findByItemTagsIncludeAll) {
      list = handlers.findByItemTagsIncludeAll(list, findByItemTagsIncludeAll);
    }
  }

  // タグが1つでも含まれる
  if (query.findByItemTagsIncludeAny) {
    var findByItemTagsIncludeAny = query.findByItemTagsIncludeAny.split(',');

    if (findByItemTagsIncludeAny) {
      list = handlers.findByItemTagsIncludeAny(list, findByItemTagsIncludeAny);
    }
  }


  // シナリオ4

  // postID
  var findByPostId = query.findByPostId || null;

  if (findByPostId) {
    list = handlers.findByPostId(list, findByPostId);
  }

  // 投稿 以降
  var findByPostDateTimeGTE = query.findByPostDateTimeGTE || null;

  if (findByPostDateTimeGTE) {
    list = handlers.findByPostDateTimeGTE(list, findByPostDateTimeGTE);
  }

  // 投稿 以前
  var findByPostDateTimeLTE = query.findByPostDateTimeLTE || null;

  if (findByPostDateTimeLTE) {
    list = handlers.findByPostDateTimeLTE(list, findByPostDateTimeLTE);
  }

  // 投稿者
  var findByPostUserId = query.findByPostUserId || null;

  if (findByPostUserId) {
    list = handlers.findByPostUserId(list, findByPostUserId);
  }

  // スコア 最大値
  var findByMaxPostItemScoreGTE = query.findByMaxPostItemScoreGTE || null;

  if (findByMaxPostItemScoreGTE) {
    list = handlers.findByMaxPostItemScoreGTE(list, findByMaxPostItemScoreGTE);
  }

  // スコア 最小値
  var findByMinPostItemScoreLTE = query.findByMinPostItemScoreLTE || null;

  if (findByMinPostItemScoreLTE) {
    list = handlers.findByMinPostItemScoreLTE(list, findByMinPostItemScoreLTE);
  }

  // ステータスの一致
  var findByPostItemState = query.findByPostItemState || null;

  if (findByPostItemState) {
    list = handlers.findByPostItemState(list, findByPostItemState);
  }

  // ステータスの不一致
  var findByPostItemStateNotEQ = query.findByPostItemStateNotEQ || null;

  if (findByPostItemStateNotEQ) {
    list = handlers.findByPostItemStateNotEQ(list, findByPostItemStateNotEQ);
  }

  // ライク 一致
  if (query.findByPostLikeUsersIncludeUserIds) {
    var findByPostLikeUsersIncludeUserIds = query.findByPostLikeUsersIncludeUserIds.split(',');

    if (findByPostLikeUsersIncludeUserIds) {
      list = handlers.findByPostLikeUsersIncludeUserIds(list, findByPostLikeUsersIncludeUserIds);
    }
  }

  // ライク 不一致
  if (query.findByPostLikeUsersNotIncludeUserIds) {
    var findByPostLikeUsersNotIncludeUserIds = query.findByPostLikeUsersNotIncludeUserIds.split(',');

    if (findByPostLikeUsersNotIncludeUserIds) {
      list = handlers.findByPostLikeUsersNotIncludeUserIds(list, findByPostLikeUsersNotIncludeUserIds);
    }
  }

  callback(null, list.splice(0, limit));
};
