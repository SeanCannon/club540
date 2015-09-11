'use strict';

/**
 * @ngdoc function
 * @author seancannon
 * @name club540.filter.filterTricksByName
 * @description
 * # filterTricksByName
 * Filter the tricktionary by matching the trick name
 */
angular.module('club540').filter('filterTricksByName', ['R', 'TricktionarySvc',
  function(R, TricktionarySvc) {
    return function (tricktionary, text, classId) {

      var matchesQuery = R.curry(function(q, trick) {
        if (q) {
          q = R.compose(R.toLower, R.defaultTo(''))(q);
          return R.compose(R.test(new RegExp(q)), R.toLower, R.prop('name'))(trick);
        } else {
          return true;
        }
      });

      var filtered = R.filter(matchesQuery(text), tricktionary);

      TricktionarySvc.tricksByClassOnScreen[classId] = filtered;

      return filtered;
    };
  }]);
