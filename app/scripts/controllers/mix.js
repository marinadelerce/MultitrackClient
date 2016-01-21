/**
 * Created by marina on 14/01/16.
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
  .controller('MixCtrl', function ($scope, $http, $location) {
    $scope.musics = [];
    var myInit = function() {
      $http.get("http://localhost:8081/song")
        .then(function(res){
          $scope.musics = res.data;
          console.log(res);
          console.log($scope.musics[0]);
        }, function (error){
          console.log(error);
        });
    };
    angular.element(document).ready(myInit);


    $scope.searchMixes = function(selectedMusic){
      console.log("badabou");
      $http.get("http://localhost:8081/mix/"+selectedMusic._id)
        .then(function(res){
          $scope.mixes = res.data;
          console.log(res);

        }, function (error){
          console.log(error);
        });
    };

    $scope.loadMusic =  function(selectedMusic, selectedMix){

    };
  });
