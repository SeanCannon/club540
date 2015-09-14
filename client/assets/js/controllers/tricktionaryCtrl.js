(function(angular) {
  'use strict';

  var sortByTrickNameAsc = R.comparator(function(a, b) {
    return a.name < b.name
  });

  var classIdMatches = function(trickClass) {
    return R.propEq('classId', R.prop('id', trickClass));
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
    var tricktionaryCtrl       = this,
        _tricksByClassOnScreen = {},
        _tricktionary          = R.clone(TricktionarySvc.tricktionary);

    R.forEach(function(trickClass) {
      _tricksByClassOnScreen[R.prop('id', trickClass)] = [];
    }, R.prop('classes', _tricktionary));

    R.forEach(function(trick) {
      _tricksByClassOnScreen[R.prop('classId', trick)].push(trick);
    }, R.prop('tricks', _tricktionary));

    tricktionaryCtrl.tricktionarySvc                       = TricktionarySvc;
    tricktionaryCtrl.tricktionarySvc.tricksByClassOnScreen = _tricksByClassOnScreen;
    tricktionaryCtrl.tricktionary                          = _tricktionary;

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

    (function preloadTrick() {
      var uri = $routeParams.trick,
          trick;
      if (uri) {
        trick = R.find(R.propEq('uri', uri), R.path(['tricktionary', 'tricks'], tricktionaryCtrl));
        if (trick) {
          tricktionaryCtrl.showTrick(trick)
        }
      }
    }());

  }]);

}(angular));
