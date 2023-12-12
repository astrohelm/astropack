'use strict';

module.exports = {
  fs: require('./lib/fs'),
  time: require('./lib/time'),
  utils: require('./lib/utils'),
  string: require('./lib/string'),
  structs: require('./lib/structs'),
  object: require('./lib/object'),
  net: require('./lib/net'),
};

module.exports.default = module.exports;
