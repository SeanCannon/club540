'use strict';

var redis       = require('redis'),
    redisClient = redis.createClient(),
    cacheUtils  = require('alien-node-redis-utils')(redisClient),
    apiUtils    = require('alien-node-api-utils'),

    // TODO this--
    logUtils    = require('alien-node-winston-utils');

var buildTricktionaryLinearly = require('../../../controllers/tricktionary/buildTricktionaryLinearly');

/**
 * Get the complete Tricktionary from MySQL
 * @param {Object} req
 * @param {Object} res
 */
function getTricks(req, res) {

  var CACHE_KEY             = 'api.tricks.getTricks',
      CACHE_EXPIRE_ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

  return cacheUtils.getItem(CACHE_KEY)
    .then(JSON.parse)
    .then(apiUtils.jsonResponseSuccess(req, res))
    .catch(buildTricktionaryLinearly)
    .then(cacheUtils.setItem(CACHE_KEY, CACHE_EXPIRE_ONE_WEEK))
    .catch(console.log.bind(console))
    .then(apiUtils.jsonResponseSuccess(req, res));
}

module.exports = getTricks;
