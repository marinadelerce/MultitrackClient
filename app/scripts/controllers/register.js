/**
 * Created by marina on 28/01/16.
 */
'use strict';

/**
 * @ngdoc function
 * @name multitrackClientApp.controller:MixCtrl
 * @description
 * # MixCtrl
 * Controller of the multitrackClientApp
 */
angular.module('multitrackClientApp')
  .controller('RegisterCtrl', function ($scope, $http, Constants, $location) {
    $scope.createUser = function(){
      console.log($scope.pseudo);
      console.log($scope.pwd);
      console.log($scope.right);
      $http.post(Constants.backendUrl + 'user', {"name":$scope.pseudo,"pwd":$scope.pwd, "right":$scope.right })
        .then(function(res){
          //stocker tokken
        }, function(error){
          console.log(error);
        });
    };
  });
