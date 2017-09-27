'use strict';

(function() {

  /**
   * @ngdoc function
   * @name webApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the webApp
   */
  angular.module('webApp')
    .controller('MainCtrl', [
      '$scope',
      '$q',
      '$mdPanel',
      '$mdMedia',
      'LinksService',
      'PollingService',
      'httpFilter',
      MainCtrl])
    .controller('AddLinkDialogCtrl', [
      '$scope',
      'mdPanelRef',
      'LinksService',
      'PollingService',
      AddLinkDialogCtrl]);

  function MainCtrl($scope, $q, $mdPanel, $mdMedia, LinksService, PollingService, httpFilter) {
    $scope._mdPanel = $mdPanel;
      
    PollingService.setPromise(LinksService.refreshFromAPI)
    PollingService.getData();

    $scope.links;
    $scope.search = LinksService.getSearchFilter();

    $scope.getMinRes = function(){ 
      return $mdMedia('gt-xs');
    };

    $scope.updateLinksToShow = function(){
      var filter = $scope.search;

      if(filter === "*"){
        $scope.links = LinksService.getLinks();
        return;
      }

      $scope.links = [];
      _.each(LinksService.getLinks(), function(item) {
        for (var i = 0; i < item.tags.length; i++) {
          var tag = item.tags[i];
          if (tag.toLowerCase().indexOf(filter) !== -1) {
            $scope.links.push(item);
            break;
          }
        }
      });
    };

    $scope.getPanelConfig = function() {
      var position = $scope._mdPanel.newPanelPosition()
        .absolute()
        .center();
      var config = {
        attachTo: angular.element(document.body),
        controller: AddLinkDialogCtrl,
        controllerAs: 'ctrl',
        disableParentScroll: true,
        templateUrl: 'views/panel.tmpl.html',
        hasBackdrop: true,
        panelClass: 'demo-dialog-example',
        position: position,
        trapFocus: true,
        zIndex: 150,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: true,
        locals: {
          'type': 'new',
          'id': 0,
          'title':'',
          'url': '',
          'tags': ''
        }
      };
      return config;
    };

    $scope.newLink = function() {
      PollingService.cancelNextLoad();
      var config = $scope.getPanelConfig();
      $scope._mdPanel.open(config);
    };

    $scope.editLink = function(id) {
      PollingService.cancelNextLoad();
      var edit = LinksService.getLinkById(id);
      var config = $scope.getPanelConfig();
      config["locals"] = {
        'type': 'edit',
        'id': id,  
        'title': edit.title,
        'url': httpFilter(edit.url),
        'tags': edit.tags
      }
      $scope._mdPanel.open(config);
    };

    $scope.getAllLinksCount = function(){
      return LinksService.getLinks().length;
    };

    $scope.$watch(function() { return LinksService.getSearchFilter(); },
      function(value) {
        $scope.search = value;
        $scope.updateLinksToShow();
      }
    );

    $scope.$watch(function() { return LinksService.getLinks(); },
      function(value) {
        $scope.updateLinksToShow();
      },
      true
    );

    $scope.$on('$destroy', function() {
      PollingService.cancelNextLoad();
    });
  }

  function AddLinkDialogCtrl($scope, mdPanelRef, LinksService, PollingService) {
    this._mdPanelRef = mdPanelRef;
    this.LinksService = LinksService;
    this.PollingService = PollingService;
  }

  AddLinkDialogCtrl.prototype.addLink = function() {
    this.LinksService.addLink(this.title, this.url, this.tags);
    this.closeDialog();
  };

  AddLinkDialogCtrl.prototype.editLink = function() {
    this.LinksService.editLink(this.id, this.title, this.url, this.tags);
    this.closeDialog();
  };

  AddLinkDialogCtrl.prototype.deleteLink = function() {
    this.LinksService.deleteLink(this.id, this.title, this.url, this.tags);
    this.closeDialog();
  };

  AddLinkDialogCtrl.prototype.closeDialog = function() {
    this.PollingService.getData();
    this._mdPanelRef && this._mdPanelRef.close().then(function() {
      angular.element(document.querySelector('.demo-dialog-open-button')).focus();
    });
  };

})();
