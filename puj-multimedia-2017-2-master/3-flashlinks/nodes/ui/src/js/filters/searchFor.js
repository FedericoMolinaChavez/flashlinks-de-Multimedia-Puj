'use strict';

(function() {
  angular.module('webApp')
    .filter("searchFor", function() {
      return function(arr, searchString) {

        if (!searchString) {
          return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();

        _.each(arr, function(item) {
          if (item.title.toLowerCase().indexOf(searchString) !== -1) {
            result.push(item);
          }
        });
        return result;
      };
    });

})();
