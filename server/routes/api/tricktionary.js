'use strict';

var express     = require('express'),
    router      = express.Router();

var getTricks          = require('./tricktionary/getTricks'),
    getTrickByUri      = require('./tricktionary/getTrickByUri'),
    searchTricksByName = require('./tricktionary/searchTricksByName');

// http://www.club540.com/api/tricktionary
router.get('/', getTricks);

// http://www.club540.com/api/tricktionary/search/name/snapu
router.get('/search/name/:q', searchTricksByName);

// http://www.club540.com/api/tricktionary/trick/snapuswipe
router.get('/trick/:uri', getTrickByUri);

module.exports = router;
