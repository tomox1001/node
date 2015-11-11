var should = require('should');
var db = require('./db');

describe('momongoz', function() {
    before(function(done) {
        done();
    });

    describe('db.User.upsert()', function() {
        it ('should upsert without error.', function(done) {
            db.User.upsert('test', {$set:{amebaId:'s-s-s'}}, function(err, result){
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });
    });

    describe('db.UserFarm.upsert()', function() {
        it('should upsert without error.', function(done) {
            db.UserFarm.upsert('test', {$set: {amebaId: 's-s-s'}}, function(err, result) {
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });
    });

    describe('db.User.findOne()', function() {
        it ('should find without error.', function(done) {
            db.User.findOne('test', function(err, result){
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });
    });

    describe('db.User.find()', function() {
        it ('should find without error.', function(done) {
            db.User.find(['test1', 'no-user-id-1', 'test2', 'no-user-id-2'], function(err, result){
                should.not.exist(err);
                should.exist(result);
                result.should.be.an.Array.and.have.length(2);
                result[0]._id.should.be.equal('test1');
                result[1]._id.should.be.equal('test2');
                done();
            });
        });
    });

    describe('db.User.findAndModify()', function() {
        it ('should find without error.', function(done) {
            db.User.findAndModify('test', {$set:{amebaId:'s-s-s'}}, {new:true}, function(err, result){
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });
    });

    describe('db.User.update()', function() {
        it ('should update without error.', function(done) {
            db.User.update('test', {$set:{amebaId:'s-s-s'}}, function(err, result){
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });
    });

    describe('db.User.remove()', function() {
        it ('should remove without error.', function(done) {
            db.User.remove('test', function(err, result){
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });
    });

    describe('db.UserFarm.findOne()', function() {
        it ('should find without error.', function(done) {
            db.UserFarm.findOne('test', function(err, result){
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });
    });

    describe('db.UserFarm.admin.findOne()', function() {
        it ('should find without error.', function(done) {
            db.UserFarm.admin.findOne({_id: 'test'}, function(err, result){
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });
    });

    describe('db.User.admin.find()', function() {
        it ('should find without error.', function(done) {
            db.User.admin.find({_id:'test'}, function(err, result){
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });
    });

    describe('db.User.admin.update()', function() {
        it ('should update without error.', function(done) {
            db.User.admin.update({_id:'test'}, {$set:{amebaId:'s-s-s'}}, function(err, result){
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });
    });

    describe('db.User.admin.upsert()', function() {
        it ('should upsert without error.', function(done) {
            db.User.admin.upsert({_id:'test'}, {$set:{amebaId:'s-s-s'}}, function(err, result){
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });
    });

    describe('db.User.admin.findAndModify()', function() {
        it ('should findAndModify without error.', function(done) {
            db.User.admin.findAndModify({_id:'test'}, null, {$set:{amebaId:'b-b-b'}}, {new: true}, function(err, result){
                should.not.exist(err);
                should.exist(result);
                result.amebaId.should.equal('b-b-b');

                done();
            });
        });
    });

    describe('db.User.admin.insert()', function() {
        it ('should insert without error.', function(done) {
            db.User.admin.insert({amebaId:'fuga'}, function(err, result){
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });
    });

    describe('db.User.findByAmebaId()', function() {
        it ('should find without error.', function(done) {
            db.User.findByAmebaId('kariblo-00001', function(err, result){
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });
    });

    describe('db.User.admin.remove()', function() {
        it ('should remove without error.', function(done) {
            db.User.admin.remove({amebaId: 'kariblo-00001'}, function(err, result){
                should.not.exist(err);
                should.exist(result);

                done();
            });
        });
    });

    describe('db.User.admin.find() options limit', function() {
        before(function(done) {
            db.User.admin.remove({}, done);
        });
        before(function(done) {
            (function insert(i) {
                db.User.admin.insert({_id: i}, function(err) {
                    if (err) throw err;
                    if (i < 21000) {
                        insert(++i);
                    } else {
                        done();
                    }
                });
            })(1);
        });
        it ('should find 21000 exist.', function(done) {
            db.User.admin.find({}, function(err, result){
                should.not.exist(err);
                should.exist(result);
                result.should.be.an.Array.and.have.length(21000);

                done();
            });
        });
        it ('should find 1000 exist.', function(done) {
            db.User.admin.find({}, {limit: 1000}, function(err, result){
                should.not.exist(err);
                should.exist(result);
                result.should.be.an.Array.and.have.length(1000);

                done();
            });
        });
    });
});
