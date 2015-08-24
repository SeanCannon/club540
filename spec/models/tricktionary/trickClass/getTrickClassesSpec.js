'use strict';

var R = require('ramda');

var getTrickClasses = require('../../../../server/models/tricktionary/trickClass/methods/getTrickClasses');

describe('getTrickClasses', function() {
  it('should fetch the trick classes', function(done) {
    getTrickClasses().then(function(data) {
      expect(R.is(Array, data)).toBe(true);
      expect(R.length(data)).not.toBe(0);
      done();
    })
  });
});
