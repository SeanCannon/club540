'use strict';

var mysql     = require('mysql'),
    config    = require('config'),
    dbPool    = mysql.createPool(config.mysql),
    DB        = require('alien-node-mysql-utils')(dbPool),
    R         = require('ramda'),
    prr       = require('prettycats'),
    Validator = require('o-validator');

var validateTrickData     = require('../helpers/validateTrickData').validateForGetById,
    createAndExecuteQuery = require('./_lookupTrick')('t_id');

/**
 * Lookup a trick by id
 * @param {Number} id
 * @returns {Promise}
 */
function getTrickById(id) {
  validateTrickData({id : id});
  return createAndExecuteQuery(id);
}

module.exports = getTrickById;
