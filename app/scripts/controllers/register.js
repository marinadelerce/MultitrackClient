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
  .controller('RegisterCtrl', function ($rootScope, $scope, $http, Constants, $location, $cookies) {
    $scope.createUser = function(){
      console.log($scope.pseudo);
      console.log($scope.pwd);
      console.log($scope.right);
      $http.post(Constants.backendUrl + 'user', {"name":$scope.pseudo,"pwd":$scope.pwd, "right":$scope.right })
        .then(function(res){
          //stocker token
          $cookies.remove('token');
          $cookies.remove('userName');
          $http.post(Constants.backendUrl + Constants.userPath + '/' +  Constants.connexionPath, {'name' : $scope.pseudo,"pwd":$scope.pwd})
            .then(function(res) {
              console.log(res.data);
              $rootScope.user ={};
              $rootScope.user.name = $scope.pseudo;
              $rootScope.user.right = $scope.right;

              console.log($rootScope.user);

              console.log($cookies);
              $cookies.put('token', res.data);
              $cookies.put('userName', $scope.pseudo);
              var name = $cookies.get('userName');
              console.log(name);
              var token = $cookies.get('token');
              console.log(token);

              $location.path('/mix');
            },function(error) {
              //TODO: Manage error during post => display error message
              console.log("fail login during POST");
              alert("Login ou mot de passe incorrect !");
              console.log(error);
            });
        }, function(error){
          console.log(error);
          alert("impossible de créer l'utilisateur");
        });
    };
  });
