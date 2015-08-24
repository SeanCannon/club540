'use strict';

var express = require('express'),
    router  = express.Router();

var getCountries = require('./geo/getCountries'),
    searchCities = require('./geo/searchCities');

// http://www.club540.com/api/geo/countries
router.get('/countries', getCountries);

// http://www.club540.com/api/geo/search/cities/EI/Dublin
router.get('/search/cities/:country/:q', searchCities);

// http://www.club540.com/api/geo/search/cities/US/MN/Osseo
router.get('/search/cities/:country/:state/:q', searchCities);

// http://www.club540.com/api/geo/regional/cities/US/MN/Hennepin
router.get('/regional/cities/:country/:state/:region', searchCities);

module.exports = router;
