'use strict';

var api = require('alien-node-api-utils');

/**
 * Search for a trick in the Tricktionary matching substring query.
 * @param {Object} req
 * @param {Object} req.params
 * @param {String} req.params.q The search query
 * @param {Object} res
 */
function searchTricksByName (req, res) {

  var q     = '%' + req.params.q + '%',
      query = 'SELECT * '            +
              'FROM tricks '         +
              'WHERE t_name LIKE ? ' +
              'ORDER BY t_name ASC LIMIT 20';

  req.cacheKey    = 'api.users.searchTricksByName:' + q;
  req.cacheExpire = 1000 * 60 * 60 * 24 * 7; // 1 week
  req.query       = [query, [q]];

  api.queryCacheAndRespond(req, res);
}

module.exports = searchTricksByName;
