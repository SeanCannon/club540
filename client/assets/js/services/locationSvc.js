(function(angular) {
  'use strict';

  /**
   * @ngdoc function
   * @author seancannon
   * @name club540.factory.locationSvc
   * @description
   * # locationSvc
   * Original: https://github.com/angular/angular.js/issues/1699#issuecomment-22511464
   *
   * Usage:
   *
   * (interception is needed for Back/Forward buttons to work)
   *
   * location.intercept($scope._url_pattern, function(matched) {
   *   * can return false to abort interception
   *   var type = matched[1]
   *   if (!type) {
   *     return;
   *   }
   *   $scope.safeApply(function() {
   *     $scope.data_type = type;
   *     $scope.params.page = 1;
   *     $scope.get_data();
   *   });
   * });
   *
   * anywhere in your controller:
   * location.skipReload().path(url);
   *
   * to replace in history stack:
   * location.skipReload().path(url).replace();
   */
  angular.module('club540').factory('LocationSvc', [
    '$location',
    '$route',
    '$rootScope',
    function($location, $route, $rootScope) {
      var pageRoute = $route.current;

      $location.skipReload = function() {
        var unbind = $rootScope.$on('$locationChangeSuccess', function() {
          $route.current = pageRoute;
          unbind();
        });
        return $location;
      };

      if ($location.intercept) {
        throw '$location.intercept is already defined';
      }

      $location.intercept = function(urlPattern, loadUrl) {

        var parsePath = function() {
          var match = $location.path().match(urlPattern);
          if (match) {
            match.shift();
            return match;
          }
        };

        var unbind = $rootScope.$on("$locationChangeSuccess", function() {
          var matched = parsePath();
          if (!matched || loadUrl(matched) === false) {
            return unbind();
          }
          $route.current = pageRoute;
        });
      };

      return $location;
    }
  ]);
}(angular));
