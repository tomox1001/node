# momongoz
node-mongodb-native用のwrapper module。  
mongoシェルライクにクエリを利用できる。

## Install
```
npm install git+http://ghe.amb.ca.local/pigg-game/momongoz.git
```

## How to use
### config
```javascript
var config = {
    host:'localhost',
    port:27017,
    database:'hoge_db',
    assert:true, // true or false
    collections: {
        "User" : {},
        "Hoge" : {}
    }
};

or

var config = [
    {
        host:'localhost',
        port:27017,
        database:'hoge_db1',
        assert:true, // true or false
        collections: {
            "User1" : {},
            "Hoge1" : {}
        }
    },
    {
        host:'localhost',
        port:27017,
        database:'hoge_db2',
        assert:true, // true or false
        collections: {
            "User2" : {},
            "Hoge2" : {}
        }
    }
];

```


### db/index.js
```javascript
var Momongoz = require('momongoz');

function DB() {
    var momongoz = new Momongoz(config);
    // var momongoz = new Momongoz(config, logging); // logging指定も可能

    momongoz.init(this, __dirname, function(err){
        if (err) {
           // エラーハンドリング
           process.exit(1);
        }
    });
}

module.exports = new DB();
```

### db/user.js (Extended API)
```javascript
/**
 * amebaIdをキーとして検索する
 * @param amebaId
 * @param callback
 */
exports.findByAmebaId = function(amebaId, callback) {
    this.admin.find({amebaId:amebaId}, function(err, result){
        if (err) {
            callback(err);
            return;
        }

        callback(null, result);
    });
};
```

### service.js
```javascript
// Normal API
db.User.findOne('bbe9b6900d7726eb', function(err, result){
    if (err) {
      // エラーハンドリング
    }
});

db.User.find(['bbe9b6900d7726eb', 'bbfbf227b1619984', 'cbdd4c27cedc3c61'], function(err, result){
    if (err) {
    }
    // result is an Array
});

db.User.findAndModify('bbe9b6900d7726eb', {$set:{amebaId:'s-s-s'}}, {new:true}, function(err, result){
    if (err) {
    }
});

db.User.update('bbe9b6900d7726eb', {$set:{amebaId:'s-s-s'}}, function(err, result){
    if (err) {
    }
});

db.User.upsert('bbe9b6900d7726eb', {$set:{amebaId:'s-s-s'}}, function(err, result){
    if (err) {
    }
});

db.UserFarm.findOne('bbe9b6900d7726eb', function(err, result){
    if (err) {
    }
});

// Admin API
db.User.admin.find({_id:'bbe9b6900d7726eb'}, function(err, result){
    if (err) {
    }
});

db.User.admin.update({_id:'bbe9b6900d7726eb'}, {$set:{amebaId:'s-s-s'}}, function(err, result){
    if (err) {
    }
});

db.User.admin.upsert({_id:'bbe9b6900d7726eb'}, {$set:{amebaId:'s-s-s'}}, function(err, result){
    if (err) {
    }
});

db.User.admin.findAndModify({_id:'bbe9b6900d7726eb'}, {$set:{amebaId:'s-s-s'}}, function(err, result){
    if (err) {
    }
});

db.User.admin.insert({amebaId:'hoge'}, function(err, result){
    if (err) {
    }
});

// Extended API
db.User.findByAmebaId('kariblo-00001', function(err, result){
    if (err) {
    }
});

// option指定
db.User.admin.find({_id:'bbe9b6900d7726eb'}, {sort:{_id: 1}, limit: 10}, function(err, result) {
    if (err) {
    }
});

db.User.admin.find({_id:'bbe9b6900d7726eb'}, {sort:{_id: -1}, skip: 4, limit: 20}, function(err, result) {
    if (err) {
    }
});

db.User.upsert('bbe9b6900d7726eb', {$set:{amebaId:'s-s-s'}}, {safe:false}, function(err, result) {
    if (err) {
    }
});
```
