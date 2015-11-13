
var logger = require('logger');
var db = require('datastore/momongoz');

// キャッシュ達
var userCache = require('datastore/cache/user');
var itemCache = require('datastore/cache/item');
var postCache = require('datastore/cache/post');

var async = require('neo-async');

exports.load = function(callback) {
  async.series([
    function(next) {
      // Userコレクション
      db.User.admin.find({}, function(err, list) {
        list.forEach(function(doc) {
          userCache.set(doc);
        });

        userCache.createList();

        next();
      });
    },
    function(next) {
      // Itemコレクション
      db.Item.admin.find({}, function(err, list) {
        list.forEach(function(doc) {
          itemCache.set(doc);
        });

        itemCache.createList();

        next();
      });
    },
    function(next) {
      // Postコレクション
      // FIXME: 本番までlimitつける
//      db.Post.admin.find({}, {limit: 1000}, function(err, list) {
      db.Post.admin.find({}, function(err, list) {

        list.forEach(function(doc) {
          postCache.set(doc);
        });

        postCache.createList();

        next();
      });
    },
  ], function(err) {
    if (err) {
      callback(err);
      return;
    }

    console.log(process.memoryUsage());

    callback();
  });
};
