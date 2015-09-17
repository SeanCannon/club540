'use strict';

var express     = require('express'),
    router      = express.Router();

var corsAllowed = require('../../middleware/corsAllowed');

var getTricks          = require('./tricktionary/getTricks'),
    getTrickByUri      = require('./tricktionary/getTrickByUri'),
    getTrickById       = require('./tricktionary/getTrickById'),
    getTricksByIds     = require('./tricktionary/getTricksByIds'),
    searchTricksByName = require('./tricktionary/searchTricksByName');

// http://www.club540.com/api/tricktionary
router.get('/', corsAllowed, getTricks);

// http://www.club540.com/api/tricktionary/search/name/snapu
router.get('/search/name/:q', corsAllowed, searchTricksByName);

// http://www.club540.com/api/trick/id/46
router.get('/id/:id', corsAllowed, getTrickById);

// http://www.club540.com/api/tricks/ids/46,47
router.get('/ids/:ids', corsAllowed, getTricksByIds);

// http://www.club540.com/api/trick/snapuswipe
router.get('/:uri', corsAllowed, getTrickByUri);

module.exports = router;
