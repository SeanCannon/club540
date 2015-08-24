'use strict';

var api = require('../../../lib/util/api'),
    searchDomesticCities      = require('./searchDomesticCities'),
    searchInternationalCities = require('./searchDomesticCities');

/**
 * Search for a city based on a substring query. Autocomplete hits this.
 * This module proxies to domestic or international city search respectively.
 * @param {Object} req
 * @param {Object} req.params
 * @param {String} req.params.q {string} search query
 * @param {Object} res
 */
function searchCities (req, res) {
  if (req.params.country === 'US') {
    searchDomesticCities(req, res);
  } else {
    searchInternationalCities(req, res);
  }
}


module.exports = searchCities;
