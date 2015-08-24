(function (angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name club540.controller:RootCtrl
   * @description
   * # RootCtrl
   * Root controller to handle app level failures and promise rejections
   */
  angular.module('club540').controller('RootCtrl', ['$rootScope', '$location', '$window', 'FlashSvc',
    function ($rootScope, $location, $window, FlashSvc) {

      $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
        // @todo Graceful failover before launch.
        $window.alert(rejection);
      });

      FlashSvc.clearFlash();

      this.$location = $location;

    }]);

}(angular));
