'use strict';

var api = require('../../../lib/util/api');

/**
 * Lookup a user based on a provided email or nickname. Autocomplete hits this.
 * @param {Object} req
 * @param {Object} req.params
 * @param {String} req.params.field The column suffix of the field against which we are to query
 * @param {String} req.params.q     The search query
 * @param {Object} res
 */
function checkUserAvailability (req, res) {

  var query,
      columnSuffix = req.params.field;

  function isNotValidColumnSuffix (str) {
    return str !== 'nickname' && str !== 'email';
  }

  if (isNotValidColumnSuffix(columnSuffix)) {
    columnSuffix = 'nickname';
  }

  query = 'SELECT IF(COUNT(user_id) > 0, FALSE, TRUE) AS available FROM users WHERE user_' + columnSuffix + ' = ?';

  req.cacheKey    = 'api.users.checkUserAvailability:' + columnSuffix + ':' + req.params.q;
  req.cacheExpire = 1000 * 60 * 60; // 1 hour
  req.query       = [query, [req.params.q]];

  api.queryCacheAndRespond(req, res);
}

module.exports = checkUserAvailability;
