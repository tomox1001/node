'use strict';

const playerTable = require('datastore/mysql/player');
const playerCache = require('datastore/cache/player');
const mapTable = require('datastore/mysql/map');
const mapCache = require('datastore/cache/map');
const itemTable = require('datastore/mysql/item');
const itemCache = require('datastore/cache/item');

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
    (next) => {
      mapTable.selectAll((err, list) => {
        list.forEach((doc) => {
          mapCache.set(doc);
        });

        mapCache.createList();

        next();
      });
    },
    (next) => {
      itemTable.selectAll((err, list) => {
        list.forEach((doc) => {
          itemCache.set(doc);
        });

        itemCache.createList();

        next();
      });
    },
  ], (err) => {
    if (err)
      return callback(err);

    console.log(playerCache);
    console.log(mapCache);
    console.log(itemCache);
    console.log(process.memoryUsage());

    callback();
  });
};
