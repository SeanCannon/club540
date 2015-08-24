'use strict';

var api = require('../../../lib/util/api');

/**
 * Get random (n) users from MySQL
 * @param {Object} req
 * @param {Object} req.params
 * @param {String} req.params.limit Number of users to query.
 * @param {Object} res
 */
function getRandomUsers (req, res) {

  var limit = req.params.limit || 10,
      query = 'SELECT users.user_id, users.user_nickname, user_profiles.up_headshot ' +
              'FROM users ' +
              'LEFT JOIN user_profiles ON user_profiles.up_user_id = users.user_id ' +
              'WHERE users.user_status = 1 AND user_profiles.up_headshot IS NOT NULL ' +
              'ORDER BY rand() LIMIT ?';

  function hardenLimit (limit) {
    var REALISTIC_RETURN_COUNT = 100;
    if (limit > REALISTIC_RETURN_COUNT) {
      limit = REALISTIC_RETURN_COUNT;
    }
    return limit;
  }

  function getApplicableCacheKey (limit) {
    return limit > 3 ? ('api.users.getRandomUsers:' + limit) : '';
  }

  function getApplicableCacheExpire (limit) {
    return limit > 3 ? (1000 * 60 * 10) : 0; // 10 minutes
  }

  limit = hardenLimit(limit);

  req.cacheKey    = getApplicableCacheKey(limit);
  req.cacheExpire = getApplicableCacheExpire(limit);
  req.query       = [query, [limit * 1]];

  api.queryCacheAndRespond(req, res);

}

module.exports = getRandomUsers;
