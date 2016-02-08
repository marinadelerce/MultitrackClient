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
              $http.get(Constants.backendUrl+ Constants.userPath + '/'+res.data)
                .then(function(res){
                  console.log("data received");

                  console.log(res.data);
                  $rootScope.user ={};
                  $rootScope.user.token = res.data.connection;
                  $rootScope.user.name = res.data.name;
                  $rootScope.user.right = res.data.right;
                  $rootScope.user.id = res.data._id;

                  console.log($rootScope.user);
                  console.log($cookies);
                  $cookies.put('userToken', res.data.connection);
                  $cookies.put('userName', res.data.name);
                  $cookies.put('userRight', res.data.right);
                  $cookies.put('userId', res.data._id);

                  $location.path('/mix');

                }, function(errorConnection){
                  console.log(errorConnection);
                });
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
