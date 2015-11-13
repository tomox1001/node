'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('review', {
    postId: 'aaa',

    // ここからセット
    itemId: 'item_1',
    itemImage: 'item_1.png',
    itemSupplier: 'あっぷる',
    itemSoldQuantity: 123,
    itemSalePrice: '23,567円',
    itemTags: '工具,テレビ',

    userImage: 'user_1.png',
    postUserId: 'user_1',
    postDateTime: '2015年7月12日 19:11',
    postItemScore: 80,
    postItemState: '購入済み',

    // いいね
    postLikeUsers: [
      {
        userId: 'user_2',
        userImage: 'user_2.png',
      },
    ],
    postLikeCount: 321,

    // おすすめ
    recommend: {
      userImages: [
        'user_2.png',
        'user_3.png',
      ],
    },

    // 投稿
    post: {
      itemImages: [
        'item_2.png',
        'item_3.png',
      ],
    },
  });
});

module.exports = router;
