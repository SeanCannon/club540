(function() {
  'use strict';

  angular.module('ramda', [])
    .service('R', ['$window', function($window) {
      return $window.R;
    }]);

}());

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
    function ($routeProvider, $httpProvider, $locationProvider, $mdThemingProvider) {

      $httpProvider.interceptors.push('FlashSvcInterceptor');

      $routeProvider.
        when('/', {
          templateUrl : '/pages/index',
          controller  : 'MainCtrl as mainCtrl'
        }).
        when('/users', {
          templateUrl : '/pages/users',
          controller  : 'UsersCtrl as usersCtrl'
        }).
        when('/tricktionary', {
          templateUrl : '/pages/tricktionary',
          controller  : 'TricktionaryCtrl as tricktionaryCtrl'
        }).
        when('/chat', {
          templateUrl : '/pages/chat',
          controller  : 'ChatCtrl as chatCtrl'
        }).
        otherwise({
          //redirectTo : '/'
        });

      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('blue-grey');

      $locationProvider.html5Mode(true);

    }]);

}());

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

(function (angular) {
  'use strict';

  /**
   * @ngdoc function
   * @author seancannon
   * @name club540.service.TricktionarySvc
   * @description
   * # TricktionarySvc
   * Service to handle tricktionary API calls and data persistence
   */
  angular.module('club540').service('TricktionarySvc', ['$resource', '$cacheFactory',
    function ($resource, $cacheFactory) {
      var svc = this;

      /**
       * Internal cache to store API responses.
       * @type {{data: *, ttl: number, expires: Date}}
       */
      svc.cache = {
        data    : $cacheFactory('TricktionarySvc'),
        ttl     : 3600,
        expires : new Date() // Expired on init so first resource call will seed cache
      };

      /**
       *
       * @type {{tricks: *, search: Function}}
       */
      svc.resources = {

        /**
         * Grab the linear tricktionary from the server.
         */
        tricks : $resource('/api/tricktionary/', null, {
          'get' : {

            /**
             * Request method.
             * @type {String}
             */
            method : 'GET',

            /**
             * Scrub the data before sending it back to the controller.
             * @param data
             * @returns {*}
             */
            transformResponse : function (data) {
              data = JSON.parse(data);
              svc.cache.data.put('tricks', data);
              return data;
            }
          }

        }), // End tricks

        /**
         * Grab the tricks from the database who match the query.
         * @param {String} q
         * @returns {*}
         */
        search : function (q) {
          return $resource('/api/tricktionary/search/name/' + q, null, {
            'get' : {

              /**
               * Request method.
               * @type {String}
               */
              method : 'GET',

              /**
               * Scrub the data before sending it back to the controller.
               * @param data
               * @returns {*}
               */
              transformResponse : function (data) {
                data = JSON.parse(data);
                svc.cache.data.put('search', data);
                return data;
              }
            }
          });

        } // End search()

      };

      svc.featuredTrick = undefined;
      svc.loadingVideo  = true;

      return svc;
    }]);
}(angular));

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

(function(angular) {
  'use strict';

  var sortByTrickNameAsc = R.comparator(function(a, b) {
    return a.name < b.name
  });

  var classIdMatches = function(trickClass) {
    return R.propEq(R.prop('id', trickClass), 'classId');
  };

  /**
   * @ngdoc function
   * @name club540.controller:TricktionaryCtrl
   * @description
   * # TricktionaryCtrl
   * Tricktionary controller
   */
  angular.module('club540').controller('TricktionaryCtrl', ['$sce', '$timeout', 'TricktionarySvc', 'R',
  function($sce, $timeout, TricktionarySvc, R) {
    var tricktionaryCtrl = this;

    tricktionaryCtrl.tricktionarySvc = TricktionarySvc;

    tricktionaryCtrl.tricktionary = {};

    TricktionarySvc.resources.tricks.get(function(response) {
      tricktionaryCtrl.tricktionary = response.data;
    });

    tricktionaryCtrl.showTrick = function(trick) {
      tricktionaryCtrl.tricktionarySvc.loadingVideo = true;
      tricktionaryCtrl.tricktionarySvc.visibleTrick = trick;
    };

    tricktionaryCtrl.trustHtml = function(html) {
      return $sce.trustAsHtml(html);
    };

    tricktionaryCtrl.filterByClass = function(trickClass) {
      return R.sort(sortByTrickNameAsc,
        R.filter(classIdMatches(trickClass), R.path(['tricktionary', 'tricks'], tricktionaryCtrl))
      );
    };

    tricktionaryCtrl.close = function() {
      tricktionaryCtrl.visibleTrick = undefined;
    }

  }]);

}(angular));

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

          scope.$watch('trick', function(oldVal, newVal) {
            if (R.prop('id', oldVal) !== R.prop('id', newVal)) {
              console.log('falsifying videoIsEmbedded');
              scope.tricktionarySvc.videoIsEmbedded = false;
              $timeout(function() {
                console.log('truthifying videoIsEmbedded');
                scope.tricktionarySvc.videoIsEmbedded = true;
              }, 100);
            }
          });
        }
      }
    }]);
}(angular));

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
