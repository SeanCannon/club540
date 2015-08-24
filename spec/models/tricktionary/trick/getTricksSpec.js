'use strict';

var R = require('ramda');

var getTricks   = require('../../../../server/models/tricktionary/trick/methods/getTricks'),
    commonMocks = require('../../../helpers/commonMocks');

describe('getTricks', function() {
  it('should get all tricks', function(done) {
    getTricks().then(function(data) {
      expect(R.is(Array, data)).toBe(true);
      expect(R.length(data)).not.toBe(0);
      done();
    });
  });
});
