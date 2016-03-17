'use strict';

var express = require('express');
var router = express.Router();

var logger = require('logger');
var itemService = require('service/item');

router.get('/', (req, res) => {
  itemService.rankItemValue(req.query, (err, item) => {
    if (err) {
      logger.app.error(err);
      res.json({ result: false });
      return;
    }
    const result = {
      result: true,
      data: item
    };

    res.json(result);
  });
});

module.exports = router;
