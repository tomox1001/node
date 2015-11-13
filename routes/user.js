'use strict';

var express = require('express');
var router = express.Router();

var userService = require('service/user');

/* GET home page. */
router.get('/:userId', function(req, res, next) {

  var query = {
    userId: req.params.userId,
    limit: 4,
  };

  /*
  userService.search(query, function(err, result) {
    var userData = result[0];

    res.render('user', {
      userId: userData.userId,
      userPublicScore: userData.userPublicScore,
      userImage: userData.userImage,

      // ↑ここまで作った

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
  */


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
