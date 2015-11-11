/**
 * @fileOverview
 * @author Tomonori Kawano <kawano_tomonori@cyberagent.co.jp>
 */

var fs = require("fs");
var path = require('path');

var async = require('async');
var mongodb = require('mongodb');

var NormalApi = require('./api/normal');
var AdminApi = require('./api/admin');
var Queue = require('./util/queue');

var logging = require('./util/logging');
var logger = null;

/**
 * @param config
 * @constructor
 */
function Momongoz(config, loggingEx) {
    // native driverを返却する。
    this._getMongoDriver = function() {
        return mongodb;
    };

    // 接続完了後のキュー管理
    this.openQueue = new Queue();

    this.db = {};
    this.collections = {};

    this.config = config;

    // API登録
    if (Array.isArray(config)) {
        for (var conKey in config) {
            for (var colKey in config[conKey].collections) {
                setCollection.call(this, colKey, config[conKey]);
            }
        }
    } else {
        for (var key in config.collections) {
            setCollection.call(this, key, config);
        }
    }

    // loggingExが存在していたらそちらを優先
    loggingEx && logging.setLogging(loggingEx);
    logger = logging.getLogger('momongoz');
}

/**
 * コレクション情報の設定
 * @param key
 * @param config
 */
function setCollection(key, config) {
    this.collections[key] = new NormalApi(key, config);
    this.collections[key].admin = new AdminApi(key, config);
    this.collections[key].key = config.database + config.port;
    this.collections[key].database = config.database;
    this.collections[key].port = config.port;
}

/**
 * caller側にAPIを設定する。
 * @param caller
 * @param key
 * @param dirname
 */
function addApiToCaller(caller, key, dirname) {
    // 通常API / 管理APIの追加
    caller[key] = this.collections[key];

    // 拡張APIの追加
    if (dirname) {
        addExtendedApi(caller[key], path.resolve(dirname + '/' + key.toLowerCase() + '.js'));
    }
}

/**
 * コレクションの追加。
 * caller側へのセットと初期化までを含める。
 * @param caller
 * @param key
 * @param config
 */
Momongoz.prototype.addCollection = function(caller, key, config) {
    // API登録
    setCollection.call(this, key, config);

    // caller側にセット
    addApiToCaller.call(this, caller, key);

    // 初期化処理
    initApiOne.call(this, this.collections, key);
};

/**
 * 初期処理
 * @param caller
 * @param dirname
 * @param callback
 */
Momongoz.prototype.init = function(caller, dirname, callback) {
    var self = this;

    if (self.isOpen) {
        return;
    }

    // collection情報の設定
    for (var key in this.collections) {
        addApiToCaller.call(this, caller, key, dirname);
    }

    // config情報の設定
    caller.config = self.config;

    if (Array.isArray(self.config)) {
        async.each(self.config, function(config, callback){
            self.connect(config, callback);
        }, function(err){
            if (err) {
                logger.error(err);
                callback && callback(err);
                return;
            }

            afterConnected.call(self, callback);
        });
    } else {
        self.connect(self.config, function(err) {
            if (err) {
                logger.error(err);
                callback && callback(err);
                return;
            }

            afterConnected.call(self, callback);
        });
    }
};

/**
 * 接続後処理
 * @param callback
 */
function afterConnected(callback) {
    // APIの準備とAPIキューの実行
    initApi.call(this, this.collections);

    // DBキューの実行
    this.openQueue.execute();

    callback && callback();
}

/**
 * 拡張APIの追加
 * @param collection
 * @param apiPath
 */
function addExtendedApi(collection, apiPath) {
    if (fs.existsSync(apiPath)) {
        var extendedApi = require(apiPath);
        for (var key in extendedApi) {
            if (typeof extendedApi[key] === 'function'){
                // 拡張APIのfunctionを追加
                collection[key] = extendedApi[key];
            }
        }
    }
}

/**
 * 接続処理
 * @param config
 * @param callback
 */
Momongoz.prototype.connect = function(config, callback) {
    var self = this;

    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://' + config.host + ':' + config.port + '/' + config.database, config.options, function(err, mdb) {
        if (err) {
            logger.error(err);
            callback && callback(err);
            return;
        }

        logger.info('Initialize the momongoz');

        self.db[config.database + config.port] = mdb;

        callback();
    });
};

/**
 * API初期化処理
 * @param collection
 * @param key
 */
function initApiOne(collections, key) {
    var collection = collections[key];

    // NormalAPI
    collection.ready(this.db[collection.key], this.db[collection.key].collection(key));
    collection.openQueue.execute();

    // AdminAPI
    collection.admin.ready(this.db[collection.key], this.db[collection.key].collection(key));
    collection.admin.openQueue.execute();
}

/**
 * API初期化処理(全体)
 * @param collections
 */
function initApi(collections) {
    for (var key in collections) {
        initApiOne.call(this, collections, key);
    }
}

/**
 * クローズ処理
 */
Momongoz.prototype.close = function() {
    if (this.isOpen) {
        for (var key in this.db) {
            this.db[key].close();
        }
    } else {
        // 接続されていない場合は、接続後に閉じる
        this.openQueue.queue.push(this.close.bind(this));
    }
};

/**
 * データベースの接続状態をチェックする
 */
Momongoz.prototype.__defineGetter__('isOpen', function() {
    var isOpen = true;

    // dbが空オブジェクトの場合、クローズとみなす
    if (!Object.keys(this.db).length) {
        isOpen = false;
    }

    // どれか１つでも未接続のdbが存在する場合、クローズとみなす
    for (var key in this.db) {
        if (this.db[key].state !== 'connected'){
            isOpen = false;
            break;
        }
    }

    return isOpen;
});

module.exports = Momongoz;
