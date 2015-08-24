'use strict';

var Validator = require('o-validator'),
    prr       = require('prettycats');

var DB = require('../../../utils/db/DB');

var validateHash = Validator.validateOrThrow({
  hash : Validator.required(prr.isStringOfLengthAtMost(64))
});

var createAndExecuteQuery = function(hash) {
  var query          = 'SELECT * FROM messaging_messages WHERE hash = ?',
      queryStatement = [query, [hash]];

  return DB.lookup(queryStatement);
};

/**
 * Lookup an message by the hash
 * @param {String} hash
 * @returns {Promise}
 */
function getMessageByHash(hash) {
  validateHash({hash : hash});
  return createAndExecuteQuery(hash);
}

module.exports = getMessageByHash;
