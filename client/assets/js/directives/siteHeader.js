(function(angular) {
  'use strict';

  /**
   * @ngdoc function
   * @author seancannon
   * @name club540.directive.siteHeader
   * @description
   * # siteHeader
   * Header with logo and nav
   */
  angular.module('club540').directive('siteHeader', ['R',
    function(R) {
      return {
        restrict    : 'E',
        scope       : {},
        templateUrl : '/partials/site-header',
        link        : function(scope, element, attrs) {

        }
      };
    }]);
}(angular));
