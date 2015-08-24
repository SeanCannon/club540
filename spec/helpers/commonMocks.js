'use strict';

var R          = require('ramda'),
    accounting = require('accounting');

var PARTIAL_ERROR_MESSAGE_ILLEGAL_PARAM     = 'Illegal value for parameter: ',
    PARTIAL_ERROR_MESSAGE_MISSING_PARAM     = 'Missing required parameter: ',
    PARTIAL_ERROR_MESSAGE_UNSUPPORTED_PARAM = 'Unsupported parameter: ';

var getRandomLetter = function() {
  var NUM_LETTERS_IN_ALPHABET  = 26,
      CHAR_CODE_LETTER_A_INDEX = 97;

  var randomLetterIndex              = Math.floor(Math.random() * NUM_LETTERS_IN_ALPHABET);
  var randomCharCodeIndexFromLetterA = randomLetterIndex + CHAR_CODE_LETTER_A_INDEX;

  var toCharCode = function(index) {
    return '0' + index;
  };

  return String.fromCharCode(toCharCode(randomCharCodeIndexFromLetterA));
};

var err = function(err) {
  return new Error(err);
};

var validationErr = R.curry(function(partialMsg, param) {
  return new Error(partialMsg + param);
});

var override = R.curry(function(originalObj, overrideKey, overrideVal) {
  var o = {};
  o[overrideKey] = overrideVal;
  return R.merge(originalObj, o);
});

module.exports = {
  getRandomLetter           : getRandomLetter,
  err                       : err,
  illegalParamErr           : validationErr(PARTIAL_ERROR_MESSAGE_ILLEGAL_PARAM),
  missingParamErr           : validationErr(PARTIAL_ERROR_MESSAGE_MISSING_PARAM),
  unsupportedParamErr       : validationErr(PARTIAL_ERROR_MESSAGE_UNSUPPORTED_PARAM),
  override                  : override
};
