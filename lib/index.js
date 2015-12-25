'use strict';

var scheme = require('./scheme');

module.exports = function(server, options, next) {
  server.auth.scheme('form', scheme);
  next();
};

module.exports.attributes = {
  pkg: require('../package.json')
};
