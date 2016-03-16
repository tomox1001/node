'use strict';

const mysql      = require('mysql');
const config = require('config').get().datastore.mysql;
const fs = require('fs');
const path = require('path');

const connection = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.password,
  database : config.database
});


exports.init = () => {
  connection.connect();

  fs.readdirSync(__dirname).forEach((filename) => {
    let basename = path.basename(filename, '.js');
    if (basename === 'index' || (path.extname(filename) !== '.js' && !fs.statSync(path.join(__dirname, filename)).isDirectory())) {
      return;
    }

    require(`./${filename}`).init(connection);
  });
};

exports.disconnect = () => {
  connection.end();
};

module.exports = this;
