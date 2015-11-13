'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user', {
    userId: 'user_1',
    userPublicScore: 52,
    userImage: 'user_1.png',
    userFriends: [
      {
        userId: 'user_2',
        userImage: 'user_2.png',
      },
    ],
    userFriendCount: 40,
    recommend: {  // おすすめ
      itemImages: [
        'item_1.png',
        'item_2.png',
        'item_3.png',
      ],
    },
    post: {  // 最近投稿
      itemImages: [
        'item_4.png',
        'item_5.png',
        'item_6.png',
      ],
    }
  });
});

module.exports = router;
