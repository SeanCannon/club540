'use strict';

var commonMocks = require('./commonMocks');

var PARTIAL_ERROR_MESSAGE_ILLEGAL_PARAM     = 'Illegal value for parameter: ',
    PARTIAL_ERROR_MESSAGE_MISSING_PARAM     = 'Missing required parameter: ',
    PARTIAL_ERROR_MESSAGE_UNSUPPORTED_PARAM = 'Unsupported parameter: ';

describe('getRandomLetter', function() {
  it('should return a random letter', function() {
    expect(commonMocks.getRandomLetter()).toMatch(/[a-z]/);
  });
});

describe('err', function() {
  it('should return an error', function() {
    expect(commonMocks.err('foo')).toEqual(new Error('foo'))
  });
});

describe('illegalParamError', function() {
  it('should return an illegal parameter validation error', function() {
    expect(commonMocks.illegalParamErr('foo')).toEqual(new Error(PARTIAL_ERROR_MESSAGE_ILLEGAL_PARAM + 'foo'))
  });
});

describe('missingParamError', function() {
  it('should return an missing parameter validation error', function() {
    expect(commonMocks.missingParamErr('foo')).toEqual(new Error(PARTIAL_ERROR_MESSAGE_MISSING_PARAM + 'foo'))
  });
});

describe('unsupportedParamError', function() {
  it('should return an unsupported parameter validation error', function() {
    expect(commonMocks.unsupportedParamErr('foo')).toEqual(new Error(PARTIAL_ERROR_MESSAGE_UNSUPPORTED_PARAM + 'foo'))
  });
});

describe('override', function() {
  it('should override an object', function() {
    expect(commonMocks.override({foo : 'bar', baz : 'bat'}, 'foo', 'buz'))
      .toEqual({foo : 'buz', baz : 'bat'})
  });
});
