/**
 * @fileOverview キュー管理クラス
 * @author Tomonori Kawano <kawano_tomonori@cyberagent.co.jp>
 */

var async = require('async');

/**
 * @constructor
 */
function Queue() {
    this.queue = [];
    this.execute = function execute(){
        var self = this;
        if (self.queue.length > 0) {
            var callback = self.queue.shift();
            if (typeof callback === 'function'){
                callback();
            }

            async.setImmediate(function() {
                self.execute();
            });
        }
    };
}

module.exports = Queue;
