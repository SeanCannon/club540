'use strict';

var R         = require('ramda'),
    Validator = require('o-validator'),
    prr       = require('prettycats');

var FORMATTED_DATE_PATTERN = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;

var validateForInsert = Validator.validateOrThrow({
  conversationId       : Validator.required(prr.isPositiveNumber),
  cloudUserIdRecipient : Validator.required(prr.isPositiveNumber),
  cloudUserIdAuthor    : Validator.required(prr.isPositiveNumber),
  subject              : prr.isStringOfLengthAtMost(255),
  body                 : Validator.required(prr.isString),
  createdDate          : prr.isStringMatching(FORMATTED_DATE_PATTERN),
  createdUnixTime      : prr.isPositiveNumber,
  readDate             : prr.isStringMatching(FORMATTED_DATE_PATTERN),
  readUnixTime         : prr.isPositiveNumber,
  state                : prr.isAtLeastZero,
  currentBox           : prr.isStringOfLengthAtMost(20),
  hash                 : prr.isStringOfLengthAtMost(64)
});

var validateForUpdate = Validator.validateOrThrow({
  readDate     : prr.isStringMatching(FORMATTED_DATE_PATTERN),
  readUnixTime : prr.isPositiveNumber,
  state        : prr.isAtLeastZero,
  currentBox   : prr.isStringOfLengthAtMost(20)
});

module.exports = {
  validateForInsert : validateForInsert,
  validateForUpdate : validateForUpdate
};
