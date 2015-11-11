/**
 * @fileOverview
 * @author Tomonori Kawano <kawano_tomonori@cyberagent.co.jp>
 */

var BaseApi = require('./');
var util = require('util');

/**
 * @param name
 * @param config
 * @constructor
 */
function NormalApi(name, config) {
    this.type = 'normal';
    BaseApi.call(this, name, config);
}

util.inherits(NormalApi, BaseApi);

module.exports = NormalApi;

/**
 * IDに紐づくデータを一件取得する
 * @param id
 * @param callback
 */
NormalApi.prototype.findOne = function(id, callback) {
    var self = this;

    self.assert.isString(id, 'argument id');

    if (!self.isOpen) {
        self.openQueue.queue.push(self.findOne.bind(self, id, callback));
        return;
    }

    self.collection.findOne({_id:id}, function(err, result) {
        if (err) {
            self.errorHandler(err, 'findOne', id, null, callback);
            return;
        }
        callback(null, result);
    });
};

/**
 * 指定のIDリストに紐づくデータを全件取得する。
 * @param {Array} idList IDの配列
 * @param {function} callback
 */
NormalApi.prototype.find = function(idList, callback) {

    var self = this;

    self.assert.isPlainObjectOrArray(idList, 'argument id list');

    if (!self.isOpen) {
        self.openQueue.queue.push(self.find.bind(self, idList, callback));
        return;
    }

    self.collection.find({_id: { $in: idList }}).toArray(function(err, result) {
        if (err) {
            self.errorHandler(err, 'find', idList, null, callback);
            return;
        }
        callback(null, result);
    });
};

/**
 * IDに紐づくデータを更新する
 * @param id
 * @param update
 * @param [options={upsert:false,new:false,remove:false}]
 * @param callback
 */
NormalApi.prototype.findAndModify = function(id, update, options, callback) {
    var self = this;

    // Allow options object to be optional
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    self.assert.isString(id, 'argument id');
    self.assert.isPlainObject(update, 'argument update');
    self.assert.isPlainObject(options, 'argument options');

    if (!self.isOpen) {
        self.openQueue.queue.push(self.findAndModify.bind(self, id, update, options, callback));
        return;
    }

    self.collection.findAndModify({_id:id}, null, update, options, function(err, result) {
        if (err) {
            self.errorHandler(err, 'findAndModify', id, update, callback);
            return;
        }
        callback(null, result);
    });
};

/**
 * IDに紐づくデータを更新する
 * @param id
 * @param update
 * @param [options={safe:true,upsert:true}]
 * @param callback
 */
NormalApi.prototype.update = function(id, update, options, callback) {
    var self = this;

    // Allow options object to be optional
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    self.assert.isPlainObject(options, 'argument options');
    self.assert.isString(id, 'argument id');
    self.assert.isPlainObject(update, 'argument update');

    options.safe = options.safe !== undefined ? !!options.safe : true;
    options.upsert = options.upsert || false;

    if (!self.isOpen) {
        self.openQueue.queue.push(self.update.bind(self, id, update, options, callback));
        return;
    }

    self.collection.update({_id:id}, update, options, function(err, result) {
        if (err) {
            self.errorHandler(err, 'update', id, update, callback);
            return;
        }
        callback(null, result);
    });
};

/**
 * IDに紐づくデータを更新する
 * @param id
 * @param update
 * @param [options={safe:true,upsert:true}]
 * @param callback
 */
NormalApi.prototype.upsert = function(id, update, options, callback) {
    var self = this;

    // Allow options object to be optional
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    self.assert.isPlainObject(options, 'argument options');
    self.assert.isString(id, 'argument id');
    self.assert.isPlainObject(update, 'argument update');

    options.safe = options.safe !== undefined ? !!options.safe : true;
    options.upsert = options.upsert !== undefined ? !!options.upsert : true;

    if (!self.isOpen) {
        self.openQueue.queue.push(self.upsert.bind(self, id, update, options, callback));
        return;
    }

    self.collection.update({_id:id}, update, options, function(err, result) {
        if (err) {
            self.errorHandler(err, 'upsert', id, update, callback);
            return;
        }
        callback(null, result);
    });
};

/**
 * IDに紐づくデータを削除する
 * @param id
 * @param [options={safe:true}]
 * @param callback
 */
NormalApi.prototype.remove = function(id, options, callback) {
    var self = this;

    // Allow options object to be optional
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    self.assert.isPlainObject(options, 'argument options');
    self.assert.isString(id, 'argument id');

    options.safe = options.safe !== undefined ? !!options.safe : true;

    if (!self.isOpen) {
        self.openQueue.queue.push(self.remove.bind(self, id, options, callback));
        return;
    }

    self.collection.remove({_id: id}, options, function(err, result) {
        if (err) {
            self.errorHandler(err, 'remove', id, null, callback);
            return;
        }
        callback(null, result);
    });
};

