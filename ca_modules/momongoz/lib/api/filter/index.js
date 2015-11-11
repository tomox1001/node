/**
 * @fileOverview
 * @author Tomonori Kawano <kawano_tomonori@cyberagent.co.jp>
 */


/**
 * @constructor
 */
function Filter() {
}

var beforeFunctions = [];
var afterFunctions = [];

/**
 * 処理の初めに行う処理の追加
 */
Filter.prototype.addBefore = function(beforeFunction) {
    if (typeof beforeFunction !== 'function'){
        return;
    }

    beforeFunctions.add(beforeFunction);
};

/**
 * 処理の初めに行う処理
 */
Filter.prototype.before = function(context) {
    for (var key in beforeFunctions) {
        var beforeFunction = beforeFunctions[key];
        beforeFunction(context);
    }
};

/**
 * 処理の終わりに行う処理の追加
 */
Filter.prototype.addAfter = function(afterFunction) {
    if (typeof afterFunction !== 'function'){
        return;
    }

    afterFunctions.add(afterFunction);
};

/**
 * 処理の終わりに行う処理
 */
Filter.prototype.after = function(context) {
    for (var key in afterFunctions) {
        var afterFunction = afterFunctions[key];
        afterFunction(context);
    }
};

module.exports = new Filter();
