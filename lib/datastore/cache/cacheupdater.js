'use strict';

const playerTable = require('datastore/mysql/player');
const playerCache = require('datastore/cache/player');

const async = require('neo-async');


exports.load = (callback) => {
  async.series([
    (next) => {
      playerTable.selectAll((err, list) => {
        list.forEach((doc) => {
          playerCache.set(doc);
        });

        playerCache.createList();

        next();
      });
    },
  ], (err) => {
    if (err)
      return callback(err);

    console.log(process.memoryUsage());

    callback();
  });
};
