'use strict';

/**
 * カンマ区切りを参照しやすいマップに
 * @param str
 */
exports.convertToFlagMap = (str) => {
  let array = str.split(',');
  let result = {};

  array.forEach((elem) => {
    result[elem] = true;
  });

  return result;
};


exports.convertToArray = (str) => {
  return str.split(',');
};
