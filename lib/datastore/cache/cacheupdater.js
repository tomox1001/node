'use strict';

const userTable = require('datastore/mysql/user');
const userCache = require('datastore/cache/user');

const async = require('neo-async');


exports.load = (callback) => {
  async.series([
    (next) => {
      userTable.selectAll((err, list) => {
        list.forEach((doc) => {
          userCache.set(doc);
        });

        userCache.createList();

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
