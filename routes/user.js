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

  userService.search(query, function(err, result) {
    var userData = result[0];

    res.render('user', {
      userId: userData.userId,
      userPublicScore: userData.userPublicScore,
      userImage: userData.userImage,

      userFriends: userData.userFriends,
      userFriendCount: userData.userFriends.length,
      recommend: {  // おすすめ
        itemImages: [
          'it0a6a1a65e932857edc55cf3332a2b1fd84ee5da4.png',
          'it0a67fbe33e717d0b73939f0858433551e3a688b5.png',
          'it0a725df24007de0fb8fddf86d02acaffdad853f7.png',
        ],
      },
      post: {  // 最近投稿
        itemImages: [
          'it0a6a1a65e932857edc55cf3332a2b1fd84ee5da4.png',
          'it0a67fbe33e717d0b73939f0858433551e3a688b5.png',
          'it0a725df24007de0fb8fddf86d02acaffdad853f7.png',
        ],
      }
    });
  });
});

module.exports = router;
