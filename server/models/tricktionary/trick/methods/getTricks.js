'use strict';

var mysql     = require('mysql'),
    config    = require('config'),
    dbPool    = mysql.createPool(config.mysql),
    DB        = require('alien-node-mysql-utils')(dbPool),
    R         = require('ramda'),
    prr       = require('prettycats'),
    Validator = require('o-validator');

var ALL_ALIASED_TRICK_FIELDS = require('../helpers/constants').ALL_ALIASED_TRICK_FIELDS;

var createAndExecuteQuery = function() {
  var query          = 'SELECT ' + ALL_ALIASED_TRICK_FIELDS + ' FROM tricks ORDER BY t_tc_id ASC',
      queryStatement = [query, []];
  return DB.query(queryStatement);
};

/**
 * Fetch all tricks.
 * @returns {Promise}
 */
function getTricks(id) {
  return createAndExecuteQuery(id);
}

module.exports = getTricks;
