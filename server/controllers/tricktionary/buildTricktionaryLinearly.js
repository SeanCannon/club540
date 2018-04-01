'use strict';

var R = require('ramda'),
    Q = require('q');

var Trick       = require('../../models/tricktionary/trick/Trick'),
    TrickOrigin = require('../../models/tricktionary/trickOrigin/TrickOrigin'),
    TrickClass  = require('../../models/tricktionary/trickClass/TrickClass');

var appendTricktionaryComponent = R.curry(function(tricktionary, key, val) {
  return R.merge(tricktionary, R.objOf(key, val));
});

var getTrickClassesAndAddKey = function(tricktionary) {
  return TrickClass.getTrickClasses()
    .then(appendTricktionaryComponent(tricktionary, 'classes'));
};

var getTrickOriginsAndAddKey = function(tricktionary) {
  return TrickOrigin.getTrickOrigins()
    .then(appendTricktionaryComponent(tricktionary, 'origins'));
};

var getTricksAndAddKey = function(tricktionary) {
  return Trick.getTricks()
    .then(R.map(parseCsvFields))
    .then(appendTricktionaryComponent(tricktionary, 'tricks'))
};

var toArr = function(strArr) {
  return strArr && R.map(parseInt, R.split(',', strArr)) || [];
};

var parseCsvFields = function(trick) {
  var _trick = R.clone(trick);

  _trick.prerequisites = toArr(_trick.prerequisites);
  _trick.exInArray     = toArr(_trick.exInArray);
  _trick.exOutArray    = toArr(_trick.exOutArray);
  _trick.origins       = toArr(_trick.origins);
  _trick.types         = toArr(_trick.types);

  return _trick;
};

function buildTricktionaryLinearly() {
  var tricktionary = {};

  return getTrickClassesAndAddKey(tricktionary)
    .then(getTrickOriginsAndAddKey)
    .then(getTricksAndAddKey);
}

module.exports = buildTricktionaryLinearly;
