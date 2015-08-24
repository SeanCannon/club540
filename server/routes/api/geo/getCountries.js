'use strict';

var api = require('../../../lib/util/api');

/**
 * Get all the countries from MySQL
 * @param {Object} req
 * @param {Object} res
 */
function getCountries (req, res) {

  req.cacheKey    = 'api.geo.getCountries';
  req.cacheExpire = 1000 * 60 * 60 * 24 * 30; // 30 days
  req.query       = ['SELECT country_name AS name, country_code AS abbv FROM countries ORDER BY country_name ASC', []];

  api.queryCacheAndRespond(req, res);
}

module.exports = getCountries;
