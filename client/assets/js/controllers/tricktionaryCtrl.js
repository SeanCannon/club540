(function(angular) {
  'use strict';

  var sortByTrickNameAsc = R.comparator(function(a, b) {
    return a.name < b.name
  });

  var classIdMatches = function(trickClass) {
    return R.propEq(R.prop('id', trickClass), 'classId');
  };

  /**
   * @ngdoc function
   * @name club540.controller:TricktionaryCtrl
   * @description
   * # TricktionaryCtrl
   * Tricktionary controller
   */
  angular.module('club540').controller('TricktionaryCtrl', ['$sce', '$timeout', 'TricktionarySvc', 'R',
  function($sce, $timeout, TricktionarySvc, R) {
    var tricktionaryCtrl = this;

    tricktionaryCtrl.tricktionarySvc = TricktionarySvc;

    tricktionaryCtrl.tricktionary = {};

    TricktionarySvc.resources.tricks.get(function(response) {
      tricktionaryCtrl.tricktionary = response.data;
    });

    tricktionaryCtrl.showTrick = function(trick) {
      tricktionaryCtrl.tricktionarySvc.loadingVideo = true;
      tricktionaryCtrl.tricktionarySvc.visibleTrick = trick;
    };

    tricktionaryCtrl.trustHtml = function(html) {
      return $sce.trustAsHtml(html);
    };

    tricktionaryCtrl.filterByClass = function(trickClass) {
      return R.sort(sortByTrickNameAsc,
        R.filter(classIdMatches(trickClass), R.path(['tricktionary', 'tricks'], tricktionaryCtrl))
      );
    };

    tricktionaryCtrl.close = function() {
      tricktionaryCtrl.visibleTrick = undefined;
    }

  }]);

}(angular));
