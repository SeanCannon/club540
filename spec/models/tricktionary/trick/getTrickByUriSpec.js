'use strict';

var R = require('ramda');

var getTrickByUri = require('../../../../server/models/tricktionary/trick/methods/getTrickByUri'),
    commonMocks   = require('../../../helpers/commonMocks');

var SEEDED_TRICK_URI  = 'swing-through',
    SEEDED_TRICK_NAME = 'Swing-Through',
    SEEDED_TRICK_ID   = 5;

describe('getTrickByUri', function() {
  it('should get a trick when given a uri of type String', function(done) {
    getTrickByUri(SEEDED_TRICK_URI).then(function(data) {
      expect(R.is(Object, data)).toBe(true);
      expect(R.prop('id', data)).toBe(SEEDED_TRICK_ID);
      expect(R.prop('name', data)).toBe(SEEDED_TRICK_NAME);
      done();
    });
  });

  it('should throw an error when given a uri of type Number', function() {
    expect(function() {
      getTrickByUri(1);
    }).toThrow(commonMocks.illegalParamErr('uri'));
  });

  it('should throw an error when given no params', function() {
    expect(function() {
      getTrickByUri();
    }).toThrow(commonMocks.missingParamErr('uri'));
  });

  it('should throw an error when given a null uri', function() {
    expect(function() {
      getTrickByUri(null);
    }).toThrow(commonMocks.illegalParamErr('uri'));
  });
});
