'use strict';

var express = require('express');
var router = express.Router();

var logger = require('logger');
var playerService = require('service/player');

router.get('/', (req, res) => {
  playerService.listPlayerOnMap(req.query, (err, map) => {
    if (err) {
      logger.app.error(err);
      res.json({ result: false });
      return;
    }
    const result = {
      result: true,
      data: map
    };

    res.json(result);
  });
});

module.exports = router;
