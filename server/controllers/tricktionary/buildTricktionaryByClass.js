'use strict';

// TODO Add in trick origins nesting too.

var R            = require('ramda'),
    Q            = require('q'),
    promiseUtils = require('alien-node-q-utils');

var Trick      = require('../../models/tricktionary/trick/Trick'),
    TrickClass = require('../../models/tricktionary/trickClass/TrickClass');

var getTricksByClassId = function(trickClass) {
  var _trickClass = R.clone(trickClass);
  return Trick.getTricksByClass(R.prop('id', _trickClass))
    .then(R.compose(R.merge(_trickClass), R.objOf('tricks')));
};

function buildTricktionaryByClass() {
  return TrickClass.getTrickClasses()
    .then(promiseUtils.mapP(getTricksByClassId));
}

module.exports = buildTricktionaryByClass;
