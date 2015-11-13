
/**
 * カンマ区切りを参照しやすいマップに
 * @param str
 */
exports.convertToFlagMap = function(str) {
  var array = str.split(',');
  var result = {};

  array.forEach(function(elem) {
    result[elem] = true;
  });

  return result;
};

