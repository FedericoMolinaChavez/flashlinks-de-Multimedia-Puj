'use strict';

/**
 * @ngdoc function
 * @name webApp.service:PollingService
 * @description
 * # PollingService
 * Service of the webApp
 */

(function() {
  angular.module('webApp')
    .factory('PollingService', ['$http','$q','$timeout',
    function($http, $q, $timeout) {

      var loadTime = 1000, //Load the data every second
      errorCount = 0,
      promise,
      loadPromise;

      var setPromise = function(_promise){
        promise = _promise;
      }

      var cancelNextLoad = function() {
        $timeout.cancel(loadPromise);
      };

      var nextLoad = function(mill) {
        mill = mill || loadTime;
        
        //Always make sure the last timeout is cleared before starting a new one
        cancelNextLoad();
        loadPromise = $timeout(getData, mill);
      };

      var getData = function() {
        //console.log("getData");
        promise()
        .then(function() {
          errorCount = 0;
          nextLoad();
        })
        .catch(function() {
          nextLoad(++errorCount * 2 * loadTime);
        });
      };

      return {
        setPromise: setPromise,
        getData: getData,
        cancelNextLoad: cancelNextLoad
      }
    }]
  );
})();