
'use strict';

var api = require('../../../lib/util/api');

/**
 * Search for a USA city based on a substring query. Autocomplete hits this.
 * @param {Object} req
 * @param {Object} req.params
 * @param {String} req.params.q {string} search query
 * @param {Object} res
 */
function searchDomesticCities (req, res) {

  var statement       = [],
      cacheKey        = '',
      queryDecorators = {},
      query = 'SELECT geodata_us.feature_name AS city, '         +
                     'geodata_us.primary_latitude AS latitude, ' +
                     'geodata_us.primary_long AS longitude, '    +
                     'geodata_us.primary_long AS longitude, '    +
                     'geodata_us.county_name AS region, '        +
                     'states.state_abbv AS stateAbbv, '          +
                     'states.state_name AS state, '              +
                     'geodata_us.elevation '                     +
              'FROM geodata_us, states '                         +
              'WHERE geodata_us.state_abbv = states.state_abbv ' +
              'AND geodata_us.primary_long != "" '               +
              'AND geodata_us.primary_latitude != "" ';


  function getDecorator (req) {

    function isRegional (req) {
      return req.params.region !== '*';
    }

    function isStateWide (req) {
      return req.params.state !== '*';
    }

    if (isRegional(req)) {
      return 'regional';
    }

    if (isStateWide(req)) {
      return 'statewide';
    }

    return 'nationwide';
  }

  req.params.state  = req.params.state  || '*';
  req.params.region = req.params.region || '*';
  req.params.q      = req.params.q      || '*';

  /**
   * Regional city search
   * @example http://www.club540.com/api/geo/regional/cities/US/MN/Hennepin
   * @param {Object} req
   */
   queryDecorators.regional = function (req) {

    var state   = req.params.state,
        region  = req.params.region,
        country = req.params.country,
        q       = req.params.q;

    query    += 'AND geodata_us.state_abbv = ? ' +
                'AND geodata_us.county_name LIKE ? ';
    statement = [state, region.replace(/\*/g, '%')];
    cacheKey  = 'api.geo.regionalCities:' + country + ':' + state + ':' + region + ':' + q;
  };

  /**
   * State-wide city search
   * @example http://www.club540.com/api/geo/search/cities/US/MN/Osseo
   * @param {Object} req
   */
  queryDecorators.statewide = function (req) {

    console.warn('statewide...', req.params);
    var state   = req.params.state,
        country = req.params.country,
        q       = req.params.q;

    query    += 'AND geodata_us.state_abbv = ? ' +
                'AND geodata_us.feature_name LIKE ? ';
    statement = [state, q.replace(/\*/g, '%')];
    cacheKey  = 'api.geo.searchCities:' + country + ':' + state + ':' + q;

  };

  /**
   * Nation-wide city search
   * @example http://www.club540.com/api/geo/search/cities/US/Maplewood
   * @param {Object} req
   */
  queryDecorators.nationwide = function (req) {

    var country = req.params.country,
        q       = req.params.q;

    query    += 'AND geodata_us.feature_name LIKE ? ';
    statement = [q.replace(/\*/g, '%')];
    cacheKey  = 'api.geo.searchCities:' + country + ':' + q;
  };

  queryDecorators[getDecorator(req)](req);

  console.warn('decorator = ', getDecorator(req));
  query += 'ORDER BY geodata_us.feature_name ASC ' +
           'LIMIT 250';

  req.cacheKey    = cacheKey;
  req.cacheExpire = 1000 * 60 * 60 * 24 * 365; // 1 year
  req.query       = [query, statement];

  api.queryCacheAndRespond(req, res);

}

module.exports = searchDomesticCities;
