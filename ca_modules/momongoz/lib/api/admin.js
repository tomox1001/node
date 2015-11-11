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
function AdminApi(name, config) {
    this.type = 'admin';
    BaseApi.call(this, name, config);
}

util.inherits(AdminApi, BaseApi);

module.exports = AdminApi;

/**
 * データを取得する
 * @param selector
 * @param [options={}]
 * @param callback
 */
AdminApi.prototype.find = function(selector, options, callback) {
    var self = this;

    // Allow options object to be optional
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    self.assert.isPlainObject(options, 'argument options');
    self.assert.isPlainObject(selector, 'argument selector');

    if (!self.isOpen) {
        self.openQueue.queue.push(self.find.bind(self, selector, options, callback));
        return;
    }

    self.collection.find(selector, options).toArray(function(err, result) {
        if (err) {
            self.errorHandler(err, 'find', selector, null, callback);
            return;
        }
        callback(null, result);
    });
};


/**
 * データを取得する
 * @param selector
 * @param [fields={}]
 * @param callback
 */
AdminApi.prototype.findOne = function(selector, fields, callback) {
    var self = this;

    // Allow fields object to be optional
    if (typeof fields === 'function') {
        callback = fields;
        fields = {};
    }

    self.assert.isPlainObject(fields, 'argument fields');
    self.assert.isPlainObject(selector, 'argument selector');

    if (!self.isOpen) {
        self.openQueue.queue.push(self.findOne.bind(self, selector, fields, callback));
        return;
    }

    self.collection.findOne(selector, fields, function(err, result) {
        if (err) {
            self.errorHandler(err, 'findOne', selector, null, callback);
            return;
        }
        callback(null, result);
    });
};


/**
 * データを更新する
 * @param selector
 * @param update
 * @param [options={safe:true,upsert:false}]
 * @param callback
 */
AdminApi.prototype.update = function(selector, update, options, callback) {
    var self = this;

    // Allow options object to be optional
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    self.assert.isPlainObject(options, 'argument options');
    self.assert.isPlainObject(selector, 'argument id');
    self.assert.isPlainObject(update, 'argument update');

    options.safe = options.safe !== undefined ? !!options.safe : true ;
    options.upsert = options.upsert || false;

    if (!self.isOpen) {
        self.openQueue.queue.push(self.update.bind(self, selector, update, options, callback));
        return;
    }

    self.collection.update(selector, update, options, function(err, result) {
        if (err) {
            self.errorHandler(err, 'update', selector, update, callback);
            return;
        }
        callback(null, result);
    });
};

/**
 * IDに紐づくデータを更新する
 * @param selector
 * @param update
 * @param [options={safe:true,upsert:true}]
 * @param callback
 */
AdminApi.prototype.upsert = function(selector, update, options, callback) {
    var self = this;

    // Allow options object to be optional
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    self.assert.isPlainObject(options, 'argument options');
    self.assert.isPlainObject(selector, 'argument id');
    self.assert.isPlainObject(update, 'argument update');

    options.safe = options.safe !== undefined ? !!options.safe : true;
    options.upsert = options.upsert || true;

    if (!self.isOpen) {
        self.openQueue.queue.push(self.upsert.bind(self, selector, update, options, callback));
        return;
    }

    self.collection.update(selector, update, options, function(err, result) {
        if (err) {
            self.errorHandler(err, 'upsert', selector, update, callback);
            return;
        }
        callback(null, result);
    });
};

/**
 * IDに紐づくデータを更新する
 * @param selector
 * @param sort
 * @param update
 * @param [options={upsert:false,new:false,remove:false}]
 * @param callback
 */
AdminApi.prototype.findAndModify = function(selector, sort, update, options, callback) {
    var self = this;

    // Allow options object to be optional
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    self.assert.isPlainObject(selector, 'argument selector');
    self.assert.isPlainObject(update, 'argument update');
    self.assert.isPlainObject(options, 'argument options');

    if (!self.isOpen) {
        self.openQueue.queue.push(self.findAndModify.bind(self, selector, update, options, callback));
        return;
    }

    self.collection.findAndModify(selector, sort, update, options, function(err, result) {
        if (err) {
            self.errorHandler(err, 'findAndModify', selector, update, callback);
            return;
        }
        callback(null, result);
    });
};

/**
 * IDに紐づくデータを更新する
 * @param data
 * @param [options={safe:true}]
 * @param callback
 */
AdminApi.prototype.insert = function(data, options, callback) {
    var self = this;

    // Allow options object to be optional
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    self.assert.isPlainObjectOrArray(data, 'argument data');
    self.assert.isPlainObject(options, 'argument options');

    options.safe = options.safe !== undefined ? !!options.safe : true;

    if (!self.isOpen) {
        self.openQueue.queue.push(self.insert.bind(self, data, options, callback));
        return;
    }

    self.collection.insert(data, options, function(err, result) {
        if (err) {
            self.errorHandler(err, 'insert', null, data, callback);
            return;
        }
        callback(null, result);
    });
};

/**
 * selector指定によるデータの削除
 * @param selector
 * @param [options={safe:true}]
 * @param callback
 */
AdminApi.prototype.remove = function(selector, options, callback) {
    var self = this;

    // Allow options object to be optional
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    self.assert.isPlainObject(options, 'argument options');
    self.assert.isPlainObject(selector, 'argument selector');

    options.safe = options.safe !== undefined ? !!options.safe : true;

    if (!self.isOpen) {
        self.openQueue.queue.push(self.remove.bind(self, selector, options, callback));
        return;
    }

    self.collection.remove(selector, options, function(err, result) {
        if (err) {
            self.errorHandler(err, 'remove', selector, null, callback);
            return;
        }
        callback(null, result);
    });
};

/**
 * データの件数を取得する。
 * @param selector
 * @param callback
 */
AdminApi.prototype.count = function(selector, callback) {
    var self = this;

    self.assert.isPlainObject(selector, 'argument selector');

    if (!self.isOpen) {
        self.openQueue.queue.push(self.count.bind(self, selector, callback));
        return;
    }

    self.collection.count(selector, function(err, result) {
        if (err) {
            self.errorHandler(err, 'count', selector, null, callback);
            return;
        }
        callback(null, result);
    });
};
