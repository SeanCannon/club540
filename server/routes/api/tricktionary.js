'use strict';

var express     = require('express'),
    router      = express.Router();

var getTricks          = require('./tricktionary/getTricks'),
    getTrickByUri      = require('./tricktionary/getTrickByUri'),
    getTrickById       = require('./tricktionary/getTrickById'),
    getTricksByIds     = require('./tricktionary/getTricksByIds'),
    searchTricksByName = require('./tricktionary/searchTricksByName');

// http://www.club540.com/api/tricktionary
router.get('/', getTricks);

// http://www.club540.com/api/tricktionary/search/name/snapu
router.get('/search/name/:q', searchTricksByName);

// http://www.club540.com/api/tricktionary/trick/id/46
router.get('/id/:id', getTrickById);

// http://www.club540.com/api/tricktionary/tricks/ids/46,47
router.get('/ids/:ids', getTricksByIds);

// http://www.club540.com/api/tricktionary/trick/snapuswipe
router.get('/:uri', getTrickByUri);

module.exports = router;
