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
  .controller('MixCtrl', function ($scope, $http, $location, $window, Constants, Song) {
    $scope.musics = [];
    var myInit = function() {
      $http.get(Constants.backendUrl + Constants.songPath)
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
      $http.get(Constants.backendUrl + Constants.mixPath + $scope.selectedMusic._id)
        .then(function(res){
          $scope.mixes = res.data;
          console.log(res);

        }, function (error){
          console.log(error);
        });
    };

    $scope.loadMusic =  function(){
      if(typeof($scope.selectedMix) != null){
        var audioContext = $window.AudioContext || $window.webkitAudioContext;
        var ctx = new audioContext();
        var metadata = $scope.selectedMix.name;
        Song.init(metadata,ctx);
       //TODO Song.addTrack
       // loadtrack
       // play
      }
      else {

      }
      $http.get("")
    };
  });
