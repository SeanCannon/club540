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
  angular.module('club540').controller('TricktionaryCtrl', ['$sce', '$timeout', '$routeParams', 'TricktionarySvc', 'LocationSvc', 'R',
  function($sce, $timeout, $routeParams, TricktionarySvc, LocationSvc, R) {
    var tricktionaryCtrl = this;

    tricktionaryCtrl.tricktionarySvc = TricktionarySvc;
    tricktionaryCtrl.tricktionary    = {};

    TricktionarySvc.resources.tricktionary.get(function(response) {

      R.forEach(function(trickClass) {
        tricktionaryCtrl.tricktionarySvc.tricksByClassOnScreen[R.prop('id', trickClass)] = [];
      }, R.prop('classes', response.data));

      R.forEach(function(trick) {
        tricktionaryCtrl.tricktionarySvc.tricksByClassOnScreen[R.prop('classId', trick)].push(trick);
      }, R.prop('tricks', response.data));

      tricktionaryCtrl.tricktionary = response.data;

      (function preloadTrick() {
        var uri = $routeParams.trick,
            trick;
        if (uri) {
          trick = R.find(R.propEq(uri, 'uri'), R.path(['tricktionary', 'tricks'], tricktionaryCtrl));
          if (trick) {
            tricktionaryCtrl.showTrick(trick)
          }
        }
      }());

    });

    tricktionaryCtrl.showTrick = function(trick) {
      if (R.prop('id', trick) !== R.path(['tricktionarySvc', 'visibleTrick', 'id'], tricktionaryCtrl)) {
        tricktionaryCtrl.tricktionarySvc.loadingVideo = true;
        tricktionaryCtrl.tricktionarySvc.visibleTrick = trick;

        LocationSvc.skipReload().path('/tricktionary/' + trick.uri);
      }
    };

    tricktionaryCtrl.trustHtml = function(html) {
      return $sce.trustAsHtml(html);
    };

    tricktionaryCtrl.filterByClass = function(trickClass) {
      var filtered = R.sort(sortByTrickNameAsc,
        R.filter(classIdMatches(trickClass), R.path(['tricktionary', 'tricks'], tricktionaryCtrl))
      );
      tricktionaryCtrl.tricktionarySvc.tricksByClassOnScreen[R.prop('id', trickClass)] = filtered;
      return filtered;
    };

    tricktionaryCtrl.close = function() {
      tricktionaryCtrl.tricktionarySvc.visibleTrick = undefined;
      LocationSvc.skipReload().path('/tricktionary');
    };

  }]);

}(angular));
