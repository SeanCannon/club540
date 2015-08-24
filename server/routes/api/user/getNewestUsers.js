'use strict';

var api = require('../../../lib/util/api');

/**
 * Get the newest users from MySQL
 * @param {Object} req
 * @param {Object} req.params
 * @param {String} req.params.limit Number of users to query.
 * @param {Object} res
 */
function getNewestUsers (req, res) {

  var limit = req.params.limit || 10;

  req.cacheKey    = 'api.users.getNewestUsers:' + limit;
  req.cacheExpire = 1000 * 60 * 10; // 10 minutes
  req.query       = ['SELECT * FROM users WHERE user_status = 1 ORDER BY user_id DESC LIMIT ?', [limit * 1]];

  api.queryCacheAndRespond(req, res);
}

module.exports = getNewestUsers;
