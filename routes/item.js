'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('item', {
    // ここからセット
    itemId: 'item_1',
    itemImage: 'item_1.png',
    itemSupplier: 'あっぷる',
    itemSoldQuantity: 123,
    itemSalePrice: '23,567円',
    itemTags: '工具,テレビ',

    // おすすめ
    recommend: {
      userImages: [
        'user_1.png',
        'user_2.png',
        'user_3.png',
      ],
    },

    // 投稿
    post: {
      itemImages: [
        'item_1.png',
        'item_2.png',
        'item_3.png',
      ],
    },
  });
});

module.exports = router;
