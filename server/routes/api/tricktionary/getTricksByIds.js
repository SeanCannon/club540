'use strict';

var R           = require('ramda'),
    redis       = require('redis'),
    redisClient = redis.createClient(),
    cacheUtils  = require('alien-node-redis-utils')(redisClient),
    apiUtils    = require('alien-node-api-utils'),

    // TODO this--
    logUtils    = require('alien-node-winston-utils');

var getTricksInList = require('../../../models/tricktionary/trick/methods/getTricksInList');

/**
 * Get tricks which match ids from MySQL
 * @param {Object} req
 * @param {Object} res
 */
function getTricksByIds(req, res) {

  var trickIds = R.path(['params', 'ids'], req);

  var CACHE_KEY             = 'api.tricks.getTricksByIds:' + trickIds,
      CACHE_EXPIRE_ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

  return cacheUtils.getItem(CACHE_KEY)
    .then(JSON.parse)
    .then(apiUtils.jsonResponseSuccess(req, res))
    .catch(getTricksInList.bind(null, 't_id', trickIds))
    .then(cacheUtils.setItem(CACHE_KEY, CACHE_EXPIRE_ONE_WEEK))
    .then(apiUtils.jsonResponseSuccess(req, res));
}

module.exports = getTricksByIds;
