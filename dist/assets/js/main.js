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

(function (angular, R) {
  'use strict';

  var ensureCsvTricks = function(list) {
    if (R.is(Array, list)) {
      return list.join(',');
    } else {
      return list + '';
    }
  };

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
        tricktionary : $resource('/api/tricktionary/', null, {
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
              svc.cache.data.put('tricktionary', data);
              return data;
            }
          }

        }), // End tricktionary


        /**
         * Grab the linear tricktionary from the server.
         */
        trickById : function(id) {

          return $resource('/api/trick/id/' + id, null, {
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
                svc.cache.data.put('trick-' + R.prop('id', data), data);
                return data;
              }
            }

          });

        }, // End trickById


        /**
         * Grab the linear tricktionary from the server.
         */
        tricksByIds : function(trickIdsArray) {
          var commaSeparatedTrickIds = ensureCsvTricks(trickIdsArray);

          return $resource('/api/tricks/ids/' + commaSeparatedTrickIds, null, {
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
                svc.cache.data.put('tricks-' + commaSeparatedTrickIds.replace(',', '-'), data);
                return data;
              }
            }

          });
        }, // End trickById

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

      svc.featuredTrick         = undefined;
      svc.loadingVideo          = true;
      svc.tricksByClassOnScreen = {};
      svc.tricktionary          = {};

      return svc;
    }]);
}(angular, R));

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
    return R.propEq('classId', R.prop('id', trickClass));
  };

  /**
   * @ngdoc function
   * @name club540.controller:TricktionaryCtrl
   * @description
   * # TricktionaryCtrl
   * Tricktionary controller
   */
  angular.module('club540').controller('TricktionaryCtrl', ['$sce', '$timeout', '$routeParams', 'TricktionarySvc', 'LocationSvc', 'R',
  function($sce, $timeout, $routeParams, TricktionarySvc, LocationSvc, R) {
    var tricktionaryCtrl       = this,
        _tricksByClassOnScreen = {},
        _tricktionary          = R.clone(TricktionarySvc.tricktionary);

    R.forEach(function(trickClass) {
      _tricksByClassOnScreen[R.prop('id', trickClass)] = [];
    }, R.prop('classes', _tricktionary));

    R.forEach(function(trick) {
      _tricksByClassOnScreen[R.prop('classId', trick)].push(trick);
    }, R.prop('tricks', _tricktionary));

    tricktionaryCtrl.tricktionarySvc                       = TricktionarySvc;
    tricktionaryCtrl.tricktionarySvc.tricksByClassOnScreen = _tricksByClassOnScreen;
    tricktionaryCtrl.tricktionary                          = _tricktionary;

    tricktionaryCtrl.showTrick = function(trick) {
      if (R.prop('id', trick) !== R.path(['tricktionarySvc', 'visibleTrick', 'id'], tricktionaryCtrl)) {
        tricktionaryCtrl.tricktionarySvc.loadingVideo = true;
        tricktionaryCtrl.tricktionarySvc.visibleTrick = trick;

        LocationSvc.skipReload().path('/tricktionary/' + trick.uri);
      }
    };

    tricktionaryCtrl.trustHtml = function(html) {
      return $sce.trustAsHtml(html);
    };

    tricktionaryCtrl.filterByClass = function(trickClass) {
      var filtered = R.sort(sortByTrickNameAsc,
        R.filter(classIdMatches(trickClass), R.path(['tricktionary', 'tricks'], tricktionaryCtrl))
      );
      tricktionaryCtrl.tricktionarySvc.tricksByClassOnScreen[R.prop('id', trickClass)] = filtered;
      return filtered;
    };

    tricktionaryCtrl.close = function() {
      tricktionaryCtrl.tricktionarySvc.visibleTrick = undefined;
      LocationSvc.skipReload().path('/tricktionary');
    };

    (function preloadTrick() {
      var uri = $routeParams.trick,
          trick;
      if (uri) {
        trick = R.find(R.propEq('uri', uri), R.path(['tricktionary', 'tricks'], tricktionaryCtrl));
        if (trick) {
          tricktionaryCtrl.showTrick(trick)
        }
      }
    }());

  }]);

}(angular));

'use strict';

/**
 * @ngdoc function
 * @author seancannon
 * @name club540.filter.filterTricksByName
 * @description
 * # filterTricksByName
 * Filter the tricktionary by matching the trick name
 */
angular.module('club540').filter('filterTricksByName', ['R', 'TricktionarySvc',
  function(R, TricktionarySvc) {
    return function (tricktionary, text, classId) {

      var matchesQuery = R.curry(function(q, trick) {
        if (q) {
          q = R.compose(R.toLower, R.defaultTo(''))(q);
          return R.compose(R.test(new RegExp(q)), R.toLower, R.prop('name'))(trick);
        } else {
          return true;
        }
      });

      var filtered = R.filter(matchesQuery(text), tricktionary);

      TricktionarySvc.tricksByClassOnScreen[classId] = filtered;

      return filtered;
    };
  }]);

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

      var fetchPrerequisites = function(scope, list) {
          scope.tricktionarySvc.resources.tricksByIds(list).get(function(response) {
            scope.prerequisites = response.data;
          });
      };

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

          scope.prerequisites = [];

          if (R.length(R.path(['trick', 'prerequisites'], scope))) {
            fetchPrerequisites(scope, R.path(['trick', 'prerequisites'], scope));
          }

          scope.replaceTrickWith = function(trick) {
            if (R.prop('id', trick) !== R.path(['tricktionarySvc', 'visibleTrick', 'id'], scope)) {
              scope.tricktionarySvc.loadingVideo = true;
              scope.tricktionarySvc.visibleTrick = trick;
              scope.prerequisites                = [];
            }
          };

          scope.$watch('prerequisites', function(newVal, oldVal) {
            console.log('prereqs = ', newVal);
          });

          scope.$watch('trick', function(newVal, oldVal) {
            if (!oldVal || (R.prop('id', oldVal) !== R.prop('id', newVal))) {
              scope.tricktionarySvc.videoIsEmbedded = false;

              console.log('newVal = ', newVal);
              if (R.length(R.prop('prerequisites', newVal))) {
                fetchPrerequisites(scope, R.prop('prerequisites', newVal));
              }


              // Wait one digest cycle.
              $timeout(function() {
                scope.tricktionarySvc.videoIsEmbedded = true;
              });
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
