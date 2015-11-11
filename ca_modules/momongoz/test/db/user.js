/**
 * @fileOverview
 * @author Tomonori Kawano <kawano_tomonori@cyberagent.co.jp>
 */

/**
 * amebaIdをキーとして検索する
 * @param amebaId
 * @param callback
 */
exports.findByAmebaId = function(amebaId, callback) {
    var db = require('./');
    db.User.admin.find({amebaId:amebaId}, function(err, result){
        if (err) {
            callback(err);
            return;
        }

        callback(null, result);
    });
};
