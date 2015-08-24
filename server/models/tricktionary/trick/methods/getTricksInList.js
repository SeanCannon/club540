'use strict';

var mysql     = require('mysql'),
    config    = require('config'),
    dbPool    = mysql.createPool(config.mysql),
    DB        = require('alien-node-mysql-utils')(dbPool),
    R         = require('ramda'),
    prr       = require('prettycats'),
    Validator = require('o-validator');

var ALL_ALIASED_TRICK_FIELDS = require('../helpers/constants').ALL_ALIASED_TRICK_FIELDS,
    ALLOWED_FIELDS           = ['t_id', 't_uri'];

var validateField = Validator.validateOrThrow({
  field                : Validator.required(prr.stringIsOneOf(ALLOWED_FIELDS)),
  commaSeparatedValues : Validator.required(prr.isString)
});

var createAndExecuteQuery = R.curry(function(field, commaSeparatedValues) {
  var query          = 'SELECT ' + ALL_ALIASED_TRICK_FIELDS + ' ' +
                       'FROM tricks WHERE ' + field + ' IN (' + commaSeparatedValues + ') ' +
                       'ORDER BY t_name ASC';
  var queryStatement = [query, [commaSeparatedValues]];
  return DB.query(queryStatement);
});

var getTricksInList = function(field, commaSeparatedValues) {
  validateField({
    field                : field,
    commaSeparatedValues : commaSeparatedValues
  });
  return createAndExecuteQuery(field, commaSeparatedValues);
};

module.exports = getTricksInList;
