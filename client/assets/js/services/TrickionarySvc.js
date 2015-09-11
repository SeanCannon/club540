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

      return svc;
    }]);
}(angular, R));
