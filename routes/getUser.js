'use strict';

var express = require('express');
var router = express.Router();

var logger = require('logger');
var userService = require('service/user');

router.get('/', (req, res) => {
  userService.get(req.query, (err, result) => {
    if (err) {
      logger.app.error(err);
      res.json({ result: false });
      return;
    }

    res.json(result);
  });
});

module.exports = router;
