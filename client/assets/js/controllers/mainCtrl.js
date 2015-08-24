(function (angular) {
  'use strict';

  /**
   * @ngdoc function
   * @author seancannon
   * @name club540.controller.MainCtrl
   * @description
   * # MainCtrl
   * Main controller for the home page
   */
  angular.module('club540').controller('MainCtrl', ['TricktionarySvc',
    function (TricktionarySvc) {

      this.tricktionarySvc = TricktionarySvc;

    }]);

}(angular));
