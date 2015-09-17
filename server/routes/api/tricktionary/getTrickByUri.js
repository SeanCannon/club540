'use strict';

var R           = require('ramda'),
    redis       = require('redis'),
    redisClient = redis.createClient(),
    cacheUtils  = require('alien-node-redis-utils')(redisClient),
    apiUtils    = require('alien-node-api-utils'),

    // TODO this--
    logUtils    = require('alien-node-winston-utils');

var _getTrickByUri = require('../../../models/tricktionary/trick/methods/getTrickByUri');

/**
 * Get a trick by its uri from MySQL
 * @param {Object} req
 * @param {Object} res
 */
function getTrickByUri(req, res) {

  var trickUri = R.path(['params', 'uri'], req);

  var CACHE_KEY             = 'api.tricks.getTrickByUri:' + trickUri,
      CACHE_EXPIRE_ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

  return cacheUtils.getItem(CACHE_KEY)
    .then(JSON.parse)
    .then(apiUtils.jsonResponseSuccess(req, res))
    .catch(_getTrickByUri.bind(null, trickUri))
    .then(cacheUtils.setItem(CACHE_KEY, CACHE_EXPIRE_ONE_WEEK))
    .then(apiUtils.jsonResponseSuccess(req, res))
    .catch(function(err) {
      return apiUtils.jsonResponseError(req, res, R.merge(err, { statusCode : 404 }))
    });
}

module.exports = getTrickByUri;
