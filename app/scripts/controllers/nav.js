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
  .controller('NavCtrl', ['$rootScope','$scope','$location', '$cookies', function ($rootScope,$scope, $location, $cookies) {
    $scope.isActive = function(destination){
      return destination === $location.path();
    };

    $scope.logout = function() {
      $cookies.remove('userToken');
      $cookies.remove('userName');
      $cookies.remove('userRight');
      $cookies.remove('userId');
      $rootScope.user = null;
      $location.path('/');
    };
  }]);
