'use strict';

var R = require('ramda');

var getTricksByClass = require('../../../../server/models/tricktionary/trick/methods/getTricksByClass');

var FAKE_CLASS = 1;

describe('getTricksByClass', function() {
  it('should get tricks from provided class', function(done) {
    getTricksByClass(FAKE_CLASS).then(function(data) {
      expect(R.is(Array, data)).toBe(true);
      expect(R.length(data)).not.toBe(0);
      done();
    });
  });
});
