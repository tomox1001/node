'use strict';

let connection;
const tableName = 'player';

exports.init = (_connection) => {
  connection = _connection;
};

exports.selectAll = (cb) => {
  connection.query('SELECT * FROM `'+ tableName+ '`', (err, results) => {
    if (err)
      cb(err);

    cb(null, results);
  });
};
