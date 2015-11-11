/**
 * @fileOverview
 * @author Tomonori Kawano <kawano_tomonori@cyberagent.co.jp>
 */

var Queue = require('../util/queue');
var Assert = require('../assert');

var logging = require('../util/logging');

/**
 * @param name
 * @param config
 * @constructor
 */
function BaseApi(name, config) {
    // 接続完了後のキュー管理
    this.openQueue = new Queue();
    this.assert = new Assert(config);

    this.db = null;
    this.collection = {};
    this.name = name;
}

module.exports = BaseApi;

/**
 * APIを利用するための準備処理
 * @param db
 * @param collection
 */
BaseApi.prototype.ready = function(db, collection) {
    this.db = db;
    this.collection = collection;

    var logger = logging.getLogger('momongoz');
    logger.info(collection.collectionName + ' is ready in ' + this.type + ' api.');
};

/**
 * エラーハンドリング
 * @param err
 * @param method
 * @param criteria
 * @param data
 * @param callback
 * @returns {Function}
 */
BaseApi.prototype.errorHandler = function(err, method, criteria, data, callback) {
    var logger = logging.getLogger('momongoz');
    logger.error(this.name + '#' + method + ' ' + JSON.stringify(criteria) + ' ' + JSON.stringify(data));

    callback(err);
};

/**
 * データベースの接続状態をチェックする
 */
BaseApi.prototype.__defineGetter__('isOpen', function() {
    return this.db && this.db.state === 'connected';
});
