
'use strict';

var api = require('../../../lib/util/api');

/**
 * Search for an International city based on a substring query. Autocomplete hits this.
 * @param {Object} req
 * @param {Object} req.params
 * @param {String} req.params.q {string} search query
 * @param {Object} res
 */
function searchInternationalCities (req, res) {

  var statement       = [],
      cacheKey        = '',
      queryDecorators = {},
      query = 'SELECT DISTINCT geodata.FULL_NAME_ND AS city, '      +
                              'geodata.LAT AS latitude, '           +
                              'geodata.LONG AS longitude, '         +
                              'geo_regions.ADM1_NAME_ND AS region ' +
              'FROM geodata, geo_regions '                          +
              'WHERE geodata.ADM1 = geo_regions.ADM1_CODE '         +
              'AND geodata.CC1 = geo_regions.FIPS_COUNTRY_CODE '    +
              'AND geodata.CC1 LIKE ? ' +
              'AND geodata.LAT != "" '  +
              'AND geodata.LONG != "" ';


  function getDecorator (req) {
    return req.params.region !== '*' ? 'regional' : 'nationwide';
  }

  req.params.state  = req.params.state  || '*';
  req.params.region = req.params.region || '*';
  req.params.q      = req.params.q      || '*';

  /**
   * Regional city search
   * @example http://www.club540.com/api/geo/regional/cities/EI/SomeRegion
   * @param {Object} req
   */
  queryDecorators.regional = function (req) {

    var region  = req.params.region,
        country = req.params.country;

    query    += 'AND geo_regions.ADM1_NAME_ND LIKE ? ';
    statement = [country, region.replace(/\*/g, '%')];
    cacheKey  = 'api.geo.regionalCities:' + country + ':' + region;
  };

  /**
   * Nation-wide city search
   * @example http://www.club540.com/api/geo/search/cities/EI/Dublin
   * @param {Object} req
   */
  queryDecorators.nationwide = function (req) {

    var country = req.params.country,
        q       = req.params.q;

    query    += 'AND geodata.FULL_NAME_ND LIKE ? ';
    statement = [country, q.replace(/\*/g, '%')];
    cacheKey  = 'api.geo.searchCities:' + country + ':' + q;
  };

  queryDecorators[getDecorator(req)](req);

  query += 'ORDER BY geodata_us.feature_name ASC ' +
           'LIMIT 250';

  req.cacheKey    = cacheKey;
  req.cacheExpire = 1000 * 60 * 60 * 24 * 365; // 1 year
  req.query       = [query, statement];

  api.queryCacheAndRespond(req, res);

}

module.exports = searchInternationalCities;
