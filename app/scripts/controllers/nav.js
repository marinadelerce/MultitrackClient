/**
 * Created by marina on 14/01/16.
 */
'use strict';

/**
 * @ngdoc function
 * @name multitrackClientApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the multitrackClientApp
 */
angular.module('multitrackClientApp')
  .controller('NavCtrl', ['$scope','$location', function ($scope, $location) {
    $scope.isActive = function(destination){
      return destination === $location.path();
    };
  }]);
