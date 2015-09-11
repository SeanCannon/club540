'use strict';

/**
 * @ngdoc function
 * @author seancannon
 * @name club540.directive.tricktionaryVideo
 * @description
 * # tricktionaryVideo
 * A video tag with a watcher
 */
angular.module('club540').directive('tricktionaryVideo', ['$sce', 'TricktionarySvc',
  function($sce, TricktionarySvc) {
    return {
      restrict : 'A',
      scope : {
        trickUri : '@tricktionaryVideo'
      },
      link : function(scope, element, attrs) {

        scope.tricktionarySvc = TricktionarySvc;

        element.bind('error', function() {
          scope.tricktionarySvc.loadingVideo    = false;
          scope.tricktionarySvc.videoIsEmbedded = false;
          scope.$apply();
        });

        element.bind('canplaythrough', function() {
          scope.tricktionarySvc.loadingVideo = false;
          scope.$apply();
          element[0].play();
        });

        scope.$watch('trickUri', function(oldVal, newVal) {
          element[0].src = $sce.trustAsResourceUrl('/assets/video/tricktionary/' + newVal + '.mp4');
          element[0].load();
        });
      }
    }
  }]);
