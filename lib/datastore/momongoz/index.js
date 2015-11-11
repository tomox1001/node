var Momongoz = require('momongoz');
var config = require('config').get().datastore.mongodb;

function DB() {
  var momongoz = new Momongoz(config);

  momongoz.init(this, __dirname, function(err){
    if (err) {
      // エラーハンドリング
      process.exit(1);
    }
  });
}

module.exports = new DB();
