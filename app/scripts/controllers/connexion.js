'use strict';

/**
 * @ngdoc function
 * @name multitrackClientApp.controller:ConnexionCtrl
 * @description
 * # ConnexionCtrl
 * Controller of the multitrackClientApp
 */
angular.module('multitrackClientApp')
  .controller('ConnexionCtrl', function ($rootScope,$scope, $http, Constants, $location, $cookies) {
    $scope.login = function(user) {
      $cookies.remove('token');
      $cookies.remove('userName');
      $http.post(Constants.backendUrl + Constants.userPath + '/' +  Constants.connexionPath, {'name' : $scope.pseudo,"pwd":$scope.pwd})
        .then(function(res) {
          console.log(res.data);
          $http.get(Constants.backendUrl+ Constants.userPath + '/'+res.data)
            .then(function(res){
              console.log(res);
              $rootScope.user ={};
              $rootScope.user.name = res.data.name;
              $rootScope.user.right = res.data.right;
              $rootScope.user.id = res.data._id;

              console.log($cookies);
              $cookies.put('token', res.data.connection);
              $cookies.put('userName', res.data.name);
              var name = $cookies.get('userName');
              console.log(name);

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
    };
  });
