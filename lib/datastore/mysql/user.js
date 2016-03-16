'use strict';

let connection;
const tableName = 'USER';

exports.init = (_connection) => {
  connection = _connection;
};

exports.selectAll = (cb) => {
  connection.query('SELECT * FROM `'+ tableName+ '` LIMIT 100', (err, results) => {
    if (err)
      cb(err);

    cb(null, results);
  });
};
