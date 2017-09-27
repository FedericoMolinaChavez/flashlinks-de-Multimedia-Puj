'use strict';

(function() {

  /**
   * @ngdoc function
   * @name webApp.controller:MenuCtrl
   * @description
   * # MenuCtrl
   * Controller of the webApp
   */
  angular.module('webApp')
    .controller('MenuCtrl', [
      '$scope',
      '$q',
      '$mdSidenav',
      '$mdMedia',
      'LinksService',
      MenuCtrl]);

  function MenuCtrl($scope, $q, $mdSidenav, $mdMedia, LinksService) {
    $scope.tags;
    $scope.api_ver = LinksService.getAPIVersion();
    
    $scope.$watch(function() { return LinksService.getTags(); },
      function(value) {
        $scope.tags = value;
      }
    );

    $scope.getMinRes = function(){
      return $mdMedia('gt-xs');
    };

    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();
    };

    $scope.searchByTag = function(tagName){
      LinksService.setSearchFilter(tagName);
      $mdSidenav('left').close();
    };

    $scope.searchByAllTags = function(){
      LinksService.setSearchFilter("*");
      $mdSidenav('left').close();
    };

    $scope.getAllLinksCount = function(){
      return LinksService.getLinks().length;
    };

    $scope.getTagsCount = function(tagName){
      return LinksService.getTagsCount(tagName);
    };

    $scope.$watch(function() { return LinksService.getAPIVersion(); },
      function(value) {
        $scope.api_ver = value;
      }
    );

  }

})();
