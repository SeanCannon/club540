'use strict';

var api = require('../../../lib/util/api');

/**
 * Search for a user based on a substring query. Autocomplete hits this.
 * @param {Object} req
 * @param {Object} req.params
 * @param {String} req.params.q {string} search query
 * @param {Object} res
 */
function searchUsersByName (req, res) {

  var fuzzyQuery,
      query = 'SELECT users.user_id, users.user_nickname, user_profiles.up_headshot ' +
              'FROM users ' +
              'LEFT JOIN user_profiles ON user_profiles.up_user_id = users.user_id ' +
              'WHERE (users.user_nickname LIKE ? ' +
                  'OR users.user_fname LIKE ? ' +
                  'OR users.user_lname LIKE ? ' +
                  'OR CONCAT(users.user_fname," ",users.user_lname) LIKE ?) ' +
              'AND users.user_status = 1 ' +
              'ORDER BY users.user_nickname ASC ' +
              'LIMIT 20';

  function fuzzify (str) {
    return '%' + str + '%';
  }

  fuzzyQuery = fuzzify(req.params.q);

  req.cacheKey    = 'api.users.searchUsersByName:' + fuzzyQuery;
  req.cacheExpire = 1000 * 60 * 60; // 1 hour
  req.query       = [query, [fuzzyQuery, fuzzyQuery, fuzzyQuery, fuzzyQuery]];

  api.queryCacheAndRespond(req, res);

}


module.exports = searchUsersByName;
