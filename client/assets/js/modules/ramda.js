(function() {
  'use strict';

  angular.module('ramda', [])
    .service('R', ['$window', function($window) {
      return $window.R;
    }]);

}());
