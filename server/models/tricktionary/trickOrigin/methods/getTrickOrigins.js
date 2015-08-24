'use strict';

var mysql     = require('mysql'),
    config    = require('config'),
    dbPool    = mysql.createPool(config.mysql),
    DB        = require('alien-node-mysql-utils')(dbPool),
    R         = require('ramda'),
    prr       = require('prettycats'),
    Validator = require('o-validator');

/**
 * Get trick origins
 * @returns {Promise}
 */
function getTrickOrigins() {
  var query = 'SELECT to_id   AS id,'           +
                     'to_name AS name '        +
              'FROM trick_origins ORDER BY to_id ASC';

  var queryStatement = [query, []];
  return DB.query(queryStatement);
}

module.exports = getTrickOrigins;
