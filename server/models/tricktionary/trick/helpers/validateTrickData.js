'use strict';

var R         = require('ramda'),
    prr       = require('prettycats'),
    Validator = require('o-validator');

var validateForInsert = Validator.validateOrThrow({
  tName          : Validator.required(prr.isStringOfLengthAtMost(40)),
  tTkt           : prr.isStringOfLengthAtMost(40),
  tDesc          : prr.isString,
  tAliases       : prr.isStringOfLengthAtMost(255),
  tTcId          : Validator.required(prr.isPositiveNumber),
  tDifficulty    : prr.isNumber,
  tBasePoints    : prr.isNumber,
  tPointsComment : prr.isStringOfLengthAtMost(255),
  tTypes         : Validator.required(prr.isStringOfLengthAtMost(30)),
  tPrereqs       : prr.isStringOfLengthAtMost(255),
  tCredit        : prr.isStringOfLengthAtMost(255),
  tAbbv          : prr.isStringOfLengthAtMost(12),
  tHistory       : prr.isString,
  tOrigins       : Validator.required(prr.isStringOfLengthAtMost(12)),
  tExInArray     : prr.isString,
  tExOutArray    : prr.isString
});

var validateForUpdate = Validator.validateOrThrow({
  tName          : prr.isStringOfLengthAtMost(40),
  tTkt           : prr.isStringOfLengthAtMost(40),
  tDesc          : prr.isString,
  tAliases       : prr.isStringOfLengthAtMost(255),
  tTcId          : prr.isPositiveNumber,
  tDifficulty    : prr.isNumber,
  tBasePoints    : prr.isNumber,
  tPointsComment : prr.isStringOfLengthAtMost(255),
  tTypes         : prr.isStringOfLengthAtMost(30),
  tPrereqs       : prr.isStringOfLengthAtMost(255),
  tCredit        : prr.isStringOfLengthAtMost(255),
  tAbbv          : prr.isStringOfLengthAtMost(12),
  tHistory       : prr.isString,
  tOrigins       : prr.isStringOfLengthAtMost(12),
  tExInArray     : prr.isString,
  tExOutArray    : prr.isString
});

var validateForGetById = Validator.validateOrThrow({
  id : Validator.required(prr.isPositiveNumber)
});

var validateForGetByUri = Validator.validateOrThrow({
  uri : Validator.required(prr.isStringOfLengthAtMost(50))
});

var validateForGetByClass = Validator.validateOrThrow({
  classId : Validator.required(prr.isPositiveNumber)
});

module.exports = {
  validateForInsert     : validateForInsert,
  validateForUpdate     : validateForUpdate,
  validateForGetById    : validateForGetById,
  validateForGetByUri   : validateForGetByUri,
  validateForGetByClass : validateForGetByClass
};
