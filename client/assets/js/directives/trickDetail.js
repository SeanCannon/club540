(function(angular) {
  'use strict';

  /**
   * @ngdoc function
   * @author seancannon
   * @name club540.directive.trickDetail
   * @description
   * # trickDetail
   * Display trick details in a collapsible container
   */
  angular.module('club540').directive('trickDetail', ['$sce', '$timeout', 'TricktionarySvc', 'R',
    function($sce, $timeout, TricktionarySvc, R) {
      return {
        scope       : {
          trick : '=',
          close : '='
        },
        restrict    : 'E',
        templateUrl : '/partials/trick-detail',
        link        : function(scope, element, attrs) {

          scope.tricktionarySvc = TricktionarySvc;

          scope.trustHtml = function(html) {
            return $sce.trustAsHtml(html);
          };

          scope.tricktionarySvc.videoIsEmbedded = true;

          scope.$watch('trick', function(oldVal, newVal) {
            if (R.prop('id', oldVal) !== R.prop('id', newVal)) {
              console.log('falsifying videoIsEmbedded');
              scope.tricktionarySvc.videoIsEmbedded = false;
              $timeout(function() {
                console.log('truthifying videoIsEmbedded');
                scope.tricktionarySvc.videoIsEmbedded = true;
              }, 100);
            }
          });
        }
      }
    }]);
}(angular));
