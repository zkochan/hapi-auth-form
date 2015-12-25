'use strict';

var Boom = require('boom');

module.exports = function(server, opts) {
  opts = opts || {};

  if (!opts.validateFunc) throw new Error('validateFunc is required');

  let validateFunc = opts.validateFunc;

  let usernameField = opts.usernameField || 'username';
  let passwordField = opts.passwordField || 'secret';

  if (typeof opts.appendNext === 'boolean') {
    opts.appendNext = (opts.appendNext ? 'next' : '');
  }

  var scheme = {};

  scheme.authenticate = function(req, reply) {
    let username = req.payload[opts.usernameField];
    let password = req.payload[opts.passwordField];

    validateFunc.call(request, username, password, function(err, isValid, credentials) {
      if (err) {
        return reply(err, {
          credentials: credentials,
          log: {
            tags: ['auth', 'form'],
            data: err
          }
        });
      }

      if (!isValid) {
        return reply(
          Boom.unauthorized('Bad form credentials'),
          { credentials: credentials }
        );
      }

      if (!credentials || typeof credentials !== 'object') {
        return reply(
          Boom.badImplementation('Bad form parameters received for Form auth validation'), { log: { tags: 'form' } }
        );
      }

      return reply.continue({ credentials: credentials });
    });
  };

  return scheme;
};
