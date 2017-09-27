'use strict';

(function() {
  angular.module('webApp')
    .filter("tags", function() {
      return function(tags) {
        return _.map(tags, function(e){
          return e['text'];
        });
      }
    });

})();
