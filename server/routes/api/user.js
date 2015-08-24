'use strict';

var express = require('express'),
    router  = express.Router();

var getNewestUsers        = require('./user/getNewestUsers'),
    getRandomUsers        = require('./user/getRandomUsers'),
    getUserById           = require('./user/getUserById'),
    checkUserAvailability = require('./user/checkUserAvailability'),
    searchUsersByName     = require('./user/searchUsersByName'),
    createUser            = require('./user/createUser'),
    updateUser            = require('./user/updateUser'),
    deleteUser            = require('./user/deleteUser');

// http://www.club540.com/api/users
router.get('/', getNewestUsers);

// http://www.club540.com/api/users/newest/15
router.get('/newest/:limit', getNewestUsers);

// http://www.club540.com/api/users/random/15
router.get('/random/:limit', getRandomUsers);

// http://www.club540.com/api/user/144
router.get('/:id', getUserById);

// http://www.club540.com/api/users/availability/nickname/juji
router.get('/availability/:field/:q', checkUserAvailability);

// http://www.club540.com/api/users/search/name/anis
router.get('/search/name/:q', searchUsersByName);

// http://www.club540.com/api/user
router.post('/',   createUser);
router.put('/',    updateUser);
router.delete('/', deleteUser);

module.exports = router;
