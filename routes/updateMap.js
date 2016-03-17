'use strict';

var express = require('express');
var router = express.Router();

var logger = require('logger');
var mapService = require('service/map');

router.get('/', (req, res) => {
  mapService.update(req.query, (err, map) => {
    if (err) {
      logger.app.error(err);
      res.json({ result: false });
      return;
    }
    const result = {
      result: true,
      data:[
        map
      ]
    };

    res.json(result);
  });
});

module.exports = router;
