'use strict';

var api = require('../../../lib/util/api');

/**
 * Lookup a user by his/her id
 * @param {Object} req
 * @param {Object} req.params
 * @param {String} req.params.id Searched against user_id
 * @param {Object} res
 */
function getUserById (req, res) {

  var query = 'SELECT users.user_id, users.user_nickname, user_profiles.* ' +
              'FROM users ' +
              'LEFT JOIN user_profiles ON user_profiles.up_user_id = users.user_id ' +
              'WHERE users.user_id = ?';

  req.cacheKey    = 'api.users.getUserById:' + req.params.id;
  req.cacheExpire = 1000 * 60 * 60 * 24; // 1 day
  req.query       = [query, [req.params.id]];

  api.queryCacheAndRespond(req, res);
}

module.exports = getUserById;
