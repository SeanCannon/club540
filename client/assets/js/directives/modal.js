'use strict';

/**
 * @ngdoc function
 * @author seancannon
 * @name club540.directive.modal
 * @description
 * # modal
 * Reusable modal container
 */
angular.module('club540').directive('modal', ['$window', '$timeout',
  function ($window, $timeout) {

    return {
      restrict    : 'E',
      scope       : {},
      templateUrl : '/partials/modal',
      link        : function (scope, element, attrs) {

        /**
         * Show the modal by setting visibleWrapper and visibleContent to true.
         * The view has ng-if on those properties.
         * @param params
         * @private
         */
        function _showModal (e, params) {

          params = params || {};

          scope.templateUrl = params.templateUrl || '/partials/404';
          scope.visibleWrapper = true;
          $timeout(function () {
            scope.visibleContent = true;
          }, 700);

          if (typeof params.callback === 'function') {
            params.callback();
          }
        }

        /**
         * Show the modal by setting visibleWrapper and visibleContent to false.
         * The view has ng-if on those properties.
         * @param params
         * @private
         */
        function _hideModal (e, params) {
          params = params || {};

          scope.visibleWrapper = false;
          scope.visibleContent = false;

          if (typeof params.callback === 'function') {
            params.callback();
          }
        }

        /**
         * View be used with ng-include in the modal partial
         * @type {String}
         */
        scope.templateUrl = '/partials/404';

        scope.$on('club540.showModal', _showModal);
        scope.$on('club540.hideModal', _hideModal);

        element.bind('click', function (e) {
          if (e.target.className.match('modal-wrapper')) {
            _hideModal();
          }
        });

      } // End link()
    };

  }]);
