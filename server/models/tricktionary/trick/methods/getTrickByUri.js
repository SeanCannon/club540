'use strict';

var mysql     = require('mysql'),
    config    = require('config'),
    dbPool    = mysql.createPool(config.mysql),
    DB        = require('alien-node-mysql-utils')(dbPool),
    R         = require('ramda'),
    prr       = require('prettycats'),
    Validator = require('o-validator');

var validateTrickData     = require('../helpers/validateTrickData').validateForGetByUri,
    createAndExecuteQuery = require('./_lookupTrick')('t_uri');

/**
 * Lookup a trick by uri
 * @param {Number} uri
 * @returns {Promise}
 */
function getTrickByUri(uri) {
  validateTrickData({uri : uri});
  return createAndExecuteQuery(uri);
}

module.exports = getTrickByUri;
