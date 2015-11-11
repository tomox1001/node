/**
 * @fileOverview
 * @author Tomonori Kawano <kawano_tomonori@cyberagent.co.jp>
 */

var log4js = require('log4js');

function Logging() {
    this.logging = null;
    log4js.configure({
        appenders: [
            {
                "category": "momongoz",
                "type": "console"
            }
        ]
    });
}

/**
 * ロガー取得
 * @param category
 * @returns {Logger}
 */
Logging.prototype.setLogging = function(logging) {
    this.logging = logging;
};

/**
 * ロガー取得
 * @param category
 * @returns {Logger}
 */
Logging.prototype.getLogger= function(category) {
    var logger;
    if (this.logging) {
        logger = this.logging.getLogger(category);
    }  else {
        logger = log4js.getLogger(category);
    }
    return logger;
};

module.exports = new Logging();
