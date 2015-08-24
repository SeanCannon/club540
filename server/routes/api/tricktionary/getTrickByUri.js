'use strict';

var api = require('alien-node-api-utils');

/**
 * Get a trick in the Tricktionary that matches a provided uri.
 * @param {Object} req
 * @param {Object} req.params
 * @param {String} req.params.uri
 * @param {Object} res
 */
function getTrickByUri (req, res) {

  var uri = req.params.uri;

  req.cacheKey    = 'api.tricks.getTricksByUri:' + uri;
  req.cacheExpire = 1000 * 60 * 60 * 24 * 7; // 1 week
  req.query       = ['SELECT * FROM tricks ? t_uri = ? LIMIT 1', [uri]];

  api.queryCacheAndRespond(req, res);
}

module.exports = getTrickByUri;
