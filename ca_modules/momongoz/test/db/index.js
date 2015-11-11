/**
 * @fileOverview
 * @name
 * @author Tomonori Kawano <kawano_tomonori@cyberagent.co.jp>
 */
var Momongoz = require('../../lib');

var config = [
    {
        host: '127.0.0.1',
        port: 27017,
        database: 'momongoz_test',
        assert: true,
        "options": {
            "db": {
                "native_parser": false,
                "strict": false,
                "forceServerObjectId": false
            },
            "server": {
                "auto_reconnect": true,
                "poolSize": 2
            }
        },
        collections: {
            "User" : {},
            "UserFarm" : {}
        }
    }
];

function DB() {
    var momongoz = new Momongoz(config);

    momongoz.init(this, __dirname, function(err){
        if (err) {
            process.exit(1); // 一つ以上DBへのコネクションが正常に取得できない場合は、強制的にプロセスをkill
        }
    });
}

module.exports = new DB();
