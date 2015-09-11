'use strict';

var R           = require('ramda'),
    redis       = require('redis'),
    redisClient = redis.createClient(),
    cacheUtils  = require('alien-node-redis-utils')(redisClient),
    apiUtils    = require('alien-node-api-utils'),

    // TODO this--
    logUtils    = require('alien-node-winston-utils');

var _getTrickById = require('../../../models/tricktionary/trick/methods/getTrickById');

/**
 * Get a trick by its id from MySQL
 * @param {Object} req
 * @param {Object} res
 */
function getTrickById(req, res) {

  var trickId = R.path(['params', 'id'], req);

  var CACHE_KEY             = 'api.tricks.getTrickById:' + trickId,
      CACHE_EXPIRE_ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

  return cacheUtils.getItem(CACHE_KEY)
    .then(JSON.parse)
    .then(apiUtils.jsonResponseSuccess(req, res))
    .catch(_getTrickById.bind(null, parseInt(trickId)))
    .then(cacheUtils.setItem(CACHE_KEY, CACHE_EXPIRE_ONE_WEEK))
    .then(apiUtils.jsonResponseSuccess(req, res));
}

module.exports = getTrickById;
