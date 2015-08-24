'use strict';

var R = require('ramda');

var getTrickById = require('../../../../server/models/tricktionary/trick/methods/getTrickById'),
    commonMocks  = require('../../../helpers/commonMocks');

var FAKE_TRICK_ID = 1;

describe('getTrickById', function() {
  it('should get a trick when given an id of type Number', function(done) {
    getTrickById(FAKE_TRICK_ID).then(function(data) {
      expect(R.is(Object, data)).toBe(true);
      expect(R.prop('id', data)).toBe(1);
      expect(R.prop('name', data)).toBe('Switch');
      done();
    });
  });

  it('should throw an error when given an id of type String', function() {
    expect(function() {
      getTrickById('1');
    }).toThrow(commonMocks.illegalParamErr('id'));
  });

  it('should throw an error when given no params', function() {
    expect(function() {
      getTrickById();
    }).toThrow(commonMocks.missingParamErr('id'));
  });

  it('should throw an error when given negative id', function() {
    expect(function() {
      getTrickById(-22);
    }).toThrow(commonMocks.illegalParamErr('id'));
  });

  it('should throw an error when given a non-numeric string', function() {
    expect(function() {
      getTrickById('foo');
    }).toThrow(commonMocks.illegalParamErr('id'));
  });

  it('should throw an error when given a null id', function() {
    expect(function() {
      getTrickById(null);
    }).toThrow(commonMocks.illegalParamErr('id'));
  });
});
