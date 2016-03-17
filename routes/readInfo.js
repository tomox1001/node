'use strict';

var express = require('express');
var router = express.Router();

var logger = require('logger');
var userService = require('service/user');

router.get('/', (req, res) => {
  const result = {
    result: true,
    data:[
      {
        information: '本日のお知らせ'
      }
    ]
  };
  res.json(result);
});

module.exports = router;
