'use strict';

/**
 * @ngdoc function
 * @name webApp.service:LinksService
 * @description
 * # LinksService
 * Service of the webApp
 */

(function() {
  angular.module('webApp')
    .factory('LinksService', ['$http','$q','httpFilter', 'tagsFilter', '__env',
    function($http, $q, httpFilter, tagsFilter, __env) {
      var api = __env.apiUrl;
      var api_ver = "";
      var links = [];
      var tags = [];
      var search = "*";

      function getAPIVersion(){
        return api_ver;
      };

      function getLinks(){
        return links;
      };

      function getTags(){
        return tags;
      };

      function getSearchFilter(){
        return search;
      };

      function setSearchFilter(value){
        search = value;
      };

      function getLinkById(id){
        return  _.find(links,function(rw){ return rw.id == id });
      };

      function updateTags(){
        tags = [];
        _.each(links, function(link){
          _.each(link.tags, function(tag){
            if(tags.indexOf(tag) == -1) {
              tags.push(tag);
            }
          });
        });
      };

      function getTagsCount(tagName){
        var result = 0;
        _.each(links, function(link){
          if(link.tags.indexOf(tagName) !== -1) {
            result++;
          }
        });
        return result;
      };

      /*
      * API Calls
      */
      function refreshFromAPI(){
        var deferred = $q.defer();
        
        getLinksFromAPI();
        getVersionFromAPI();

        deferred.resolve();
        return deferred.promise;
      }

      function getLinksFromAPI(){
        $http.get(api + '/fl/link')
          .then(function success(response) {
            links = response.data;
            updateTags();
          },function error(response) {
              console.log(response);
        });
      }

      function getVersionFromAPI(){
        $http.get(api + '/fl/version')
          .then(function success(response) {
            api_ver = response.data.version;
          },function error(response) {
              console.log(response);
        });
      }

      function addLink(title, url, _tags){
        var tagsfil = tagsFilter(_tags);
        $http.post(api + '/fl/link/add', 
          {
            title: title,
            url: httpFilter(url),
            tags: tagsfil,
            date: new Date(Date.now())
          }
        ).then(function success(response) {
            console.log(response);
          },function error(response) {
            console.log(response);
        });
      };
      
      function editLink(id, title, url, _tags){
        var tagsfil = tagsFilter(_tags);

        $http.post(api + '/fl/link/edit/' + id, 
          {
            title: title,
            url: httpFilter(url),
            tags: tagsfil,
            date: new Date(Date.now()) 
          }
        ).then(function success(response) {
            console.log(response);
          },function error(response) {
            console.log(response);
        });
      };

      function deleteLink(id){
        $http.post(api + '/fl/link/delete/' + id
        ).then(function success(response) {
            console.log(response);
          },function error(response) {
            console.log(response);
        });
      };

      function getTagsFromAPI(){
        $http.get(api + '/fl/tag')
          .then(function success(response) {
            tags = response.data;
            tags.sort();
          },function error(response) {
              console.log(response);
        });
      }

      return {
        getAPIVersion: getAPIVersion,
        getLinks: getLinks,
        getTags: getTags,
        getSearchFilter: getSearchFilter,
        setSearchFilter: setSearchFilter,
        getLinkById: getLinkById,
        getTagsCount: getTagsCount,
        refreshFromAPI: refreshFromAPI,
        addLink: addLink,
        editLink: editLink,
        deleteLink: deleteLink,
      };
    }]
  );

})();
