'use strict';

/**
 * @ngdoc function
 * @name multitrackClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the multitrackClientApp
 */
angular.module('multitrackClientApp')
  .controller('MainCtrl', function ($scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.isActive = function(destination){
      return destination === $scope.path();
    };
  });
