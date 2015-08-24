'use strict';

var mysql     = require('mysql'),
    config    = require('config'),
    dbPool    = mysql.createPool(config.mysql),
    DB        = require('alien-node-mysql-utils')(dbPool),
    R         = require('ramda'),
    prr       = require('prettycats'),
    Validator = require('o-validator');

var validateTrickData        = require('../helpers/validateTrickData').validateForGetByClass,
    ALL_ALIASED_TRICK_FIELDS = require('../helpers/constants').ALL_ALIASED_TRICK_FIELDS;

var createAndExecuteQuery = function(classId) {
  var query          = 'SELECT ' + ALL_ALIASED_TRICK_FIELDS + ' ' +
                       'FROM tricks WHERE t_tc_id = ?';
  var queryStatement = [query, [classId]];
  return DB.query(queryStatement);
};

/**
 * Get tricks in a provided class
 * @param {Number} classId
 * @returns {Promise}
 */
function getTricksByClass(classId) {
  validateTrickData({classId : classId});
  return createAndExecuteQuery(classId);
}

module.exports = getTricksByClass;
