(function() {
  'use strict';

  angular.module('club540', [

    // Core modules
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'ngMessages',
    'ngResource',
    'ngMaterial',

    // Custom modules (app/modules/*)
    'ramda'
  ]).config(['$routeProvider', '$httpProvider', '$locationProvider', '$mdThemingProvider',
    function($routeProvider, $httpProvider, $locationProvider, $mdThemingProvider) {
      $locationProvider.html5Mode(true);
      $httpProvider.interceptors.push('FlashSvcInterceptor');

      var tricktionaryPromise = ['$q', 'R', 'TricktionarySvc', function($q, R, TricktionarySvc) {

        var deferred = $q.defer();

        TricktionarySvc.resources.tricktionary.get(function(response) {
          TricktionarySvc.tricktionary = R.prop('data', response);
          deferred.resolve();
        });

        return deferred.promise;
      }];

      $routeProvider.
        //when('/', {
        //  templateUrl : '/pages/index',
        //  controller  : 'MainCtrl as mainCtrl'
        //}).
        //when('/users', {
        //  templateUrl : '/pages/users',
        //  controller  : 'UsersCtrl as usersCtrl'
        //}).
        when('/tricktionary', {
          templateUrl    : '/pages/tricktionary',
          controller     : 'TricktionaryCtrl as tricktionaryCtrl',
          resolve        : {
            tricktionary : tricktionaryPromise
          },
          reloadOnSearch : false
        }).
        when('/tricktionary/:trick', {
          templateUrl    : '/pages/tricktionary',
          controller     : 'TricktionaryCtrl as tricktionaryCtrl',
          resolve        : {
            tricktionary : tricktionaryPromise
          },
          reloadOnSearch : false
        }).
        //when('/chat', {
        //  templateUrl : '/pages/chat',
        //  controller  : 'ChatCtrl as chatCtrl'
        //}).
        otherwise({
          redirectTo : '/tricktionary'
        });

      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('blue-grey');

    }]);

}());
