/**
 * @fileOverview アサーション処理の内容を決定する
 * @author Tomonori Kawano <kawano_tomonori@cyberagent.co.jp>
 */

/**
 * @param config
 * @constructor
 */
function BaseAssert(config) {
    var assert;
    if (config && config.assert) {
        assert = require('./assert');
    } else {
        assert = require('./nop');
    }

    // アサート関数登録
    for (var key in assert) {
        if (typeof assert[key] === 'function'){
            this[key] = assert[key];
        }
    }
}

module.exports = BaseAssert;
