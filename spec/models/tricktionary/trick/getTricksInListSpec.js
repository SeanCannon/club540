'use strict';

var R = require('ramda');

var getTricksInList = require('../../../../server/models/tricktionary/trick/methods/getTricksInList');

var FAKE_TRICKS_LIST = '1,2,3';

describe('getTricksInList', function() {
  it('should get trick data for all tricks matching IDs in the provided list', function(done) {
    getTricksInList('t_id', FAKE_TRICKS_LIST).then(function(data) {
      expect(R.is(Array, data)).toBe(true);
      expect(R.length(data)).toBe(3);
      expect(R.compose(R.prop('name'), R.head)(data)).toBe('Crouch');
      done();
    });
  });
});
