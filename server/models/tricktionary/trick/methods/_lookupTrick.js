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
  field : Validator.required(prr.stringIsOneOf(ALLOWED_FIELDS))
});

var createAndExecuteQuery = R.curry(function(field, value) {
  var query          = 'SELECT ' + ALL_ALIASED_TRICK_FIELDS + ' ' +
                       'FROM tricks WHERE ' + field + ' = ?';
  var queryStatement = [query, [value]];
  return DB.lookup(queryStatement);
});

var lookupTrick = function(field) {
  validateField({ field : field });
  return createAndExecuteQuery(field);
};

module.exports = lookupTrick;
