/**
 * @fileOverview
 * @name
 * @author Tomonori Kawano <kawano_tomonori@cyberagent.co.jp>
 */

var fs = require('fs');

module.exports = function(grunt) {
    grunt.initConfig({
        shell: {
            hoi: getHoiTask(),
            mocha: getMochaTask()
        },
        jshint: getJshintTask()
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', [
        'shell:hoi',
        'shell:mocha',
        'jshint'
    ]);
};

function getJshintTask() {
    var jshint = {
        files: [
            '*.js',
            'lib/**/*.js',
            'Gruntfile.js',
            'package.json',
            '.jshintrc'
        ],
        options: {
            jshintrc: '.jshintrc'
        }
    };

    return jshint;
}

function getHoiTask() {
    var hoi = {
        command: [
            'pigghoi *.js',
            'pigghoi ./lib',
            'pigghoi ./test'
        ].join('&&'),
        options: {
            stdout: true,
            stderr: true
        }
    };

   return hoi;
}

function getMochaTask() {
    var database = 'momongoz_test';

    var mochaCommand = [];
    mochaCommand.push("echo 'db.dropDatabase()' | mongo " + database);

    var files = fs.readdirSync('./test/data');
    for (var key in files) {
        var file = files[key];
        var fileName = file.split(".")[0];
        var filePath = './test/data/' + file;
        mochaCommand.push("mongoimport -d " + database + " -c " + fileName + " " + filePath);
    }

    mochaCommand.push("mocha --recursive test");

    var mocha = {
        command: mochaCommand.join('&&'),
        options: {
            stdout: true,
            stderr: true
        }
    };

    return mocha;
}
