'use strict';

var mysql     = require('mysql'),
    config    = require('config'),
    dbPool    = mysql.createPool(config.mysql),
    DB        = require('alien-node-mysql-utils')(dbPool),
    R         = require('ramda'),
    prr       = require('prettycats'),
    Validator = require('o-validator');

/**
 * Get trick classes
 * @returns {Promise}
 */
function getTrickClasses() {
  var query = 'SELECT tc_id   AS id,'           +
                     'tc_name AS name, '        +
                     'tc_desc AS description, ' +
                     'tc_abbv AS abbreviation ' +
              'FROM trick_classes ORDER BY tc_id ASC';

  var queryStatement = [query, []];
  return DB.query(queryStatement);
}

module.exports = getTrickClasses;
