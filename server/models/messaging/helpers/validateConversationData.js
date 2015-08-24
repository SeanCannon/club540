'use strict';

var R         = require('ramda'),
    Validator = require('o-validator'),
    prr       = require('prettycats');

var FORMATTED_DATE_PATTERN = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;

var validateForInsert = Validator.validateOrThrow({
  createdDate     : prr.isStringMatching(FORMATTED_DATE_PATTERN),
  createdUnixTime : prr.isPositiveNumber,
  hash            : prr.isStringOfLengthAtMost(64)
});

module.exports = {
  validateForInsert : validateForInsert
};
