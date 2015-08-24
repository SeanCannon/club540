(function (angular) {
  'use strict';

  /**
   * @ngdoc function
   * @author seancannon
   * @name club540.service.FlashSvc
   * @description
   * # FlashSvc
   * Service for flash messages
   */
  angular.module('club540').service('FlashSvc', ['$rootScope', '$timeout',
    function ($rootScope, $timeout) {
      var svc = this;

      /**
       * Fetch any flash messages on the root scope.
       * @param key
       * @returns {*}
       */
      svc.getFlash = function (key) {
        var flash = $rootScope.flash;
        return (key) ? flash[key] : flash;
      };

      /**
       * Set the flash with new messages.
       * @param flash
       */
      svc.setFlash = function (flash) {
        var key;

        for (key in flash) {
          if (flash.hasOwnProperty(key) && Array.isArray(flash[key])) {
            $rootScope.flash[key] = flash[key].concat();
          }
        }

        // This lets us spam the flash message and have it toast every time.
        $timeout(svc.clearFlash);
      };

      /**
       * Resets the flash message object.
       * @returns {club540.service.FlashSvc}
       */
      svc.clearFlash = function () {
        $rootScope.flash = {
          notice : [],
          error  : []
        };
        return svc;
      };

      return svc;
    }]).service('FlashSvcInterceptor', ['FlashSvc', function (FlashSvc) {
    return {
      'response' : function (res) {
        FlashSvc.setFlash(res.data.flash);
        return res;
      }
    };


  }]);
}(angular));
