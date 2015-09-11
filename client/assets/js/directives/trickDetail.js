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

      var fetchPrerequisites = function(scope, list) {
          scope.tricktionarySvc.resources.tricksByIds(list).get(function(response) {
            scope.prerequisites = response.data;
          });
      };

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

          scope.prerequisites = [];

          if (R.length(R.path(['trick', 'prerequisites'], scope))) {
            fetchPrerequisites(scope, R.path(['trick', 'prerequisites'], scope));
          }

          scope.replaceTrickWith = function(trick) {
            if (R.prop('id', trick) !== R.path(['tricktionarySvc', 'visibleTrick', 'id'], scope)) {
              scope.tricktionarySvc.loadingVideo = true;
              scope.tricktionarySvc.visibleTrick = trick;
              scope.prerequisites                = [];
            }
          };

          scope.$watch('prerequisites', function(newVal, oldVal) {
            console.log('prereqs = ', newVal);
          });

          scope.$watch('trick', function(newVal, oldVal) {
            if (!oldVal || (R.prop('id', oldVal) !== R.prop('id', newVal))) {
              scope.tricktionarySvc.videoIsEmbedded = false;

              console.log('newVal = ', newVal);
              if (R.length(R.prop('prerequisites', newVal))) {
                fetchPrerequisites(scope, R.prop('prerequisites', newVal));
              }


              // Wait one digest cycle.
              $timeout(function() {
                scope.tricktionarySvc.videoIsEmbedded = true;
              });
            }
          });
        }
      }
    }]);
}(angular));
