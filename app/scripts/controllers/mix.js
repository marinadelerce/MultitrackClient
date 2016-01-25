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
  .controller('MixCtrl', function ($scope, $http, $location, $window, Constants, Song, Track) {
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
      $http.get(Constants.backendUrl + Constants.mixPath +'/'+ $scope.selectedMusic._id)
        .then(function(res){
          $scope.mixes = res.data;
          console.log(res);

        }, function (error){
          console.log(error);
        });
    };

    $scope.loadMusic =  function(){
      if(typeof($scope.selectedMix) != "undefined"){
        var audioContext = $window.AudioContext || $window.webkitAudioContext;
        var ctx = new audioContext();
        var metadata = $scope.selectedMix.name;
        Song.init(metadata,ctx);
        $scope.selectedMix.track.forEach(function(element){
          Song.addTrack(new Track(element.name, element.path));
        });
        Song.loadTracks();
        Song.play();
      }
      else if (typeof($scope.selectedMusic) != "undefined" && typeof($scope.selectedMix) == "undefined"){
        var audioContext = $window.AudioContext || $window.webkitAudioContext;
        var ctx = new audioContext();
        console.log($scope.selectedMusic);
        var metadata = $scope.selectedMusic.song;
        Song.init(metadata,ctx);
        $scope.selectedMusic.track.forEach(function(element, index){
          console.log(element);
          Song.addTrack(element.name, Constants.backendUrl+element.path, index);
        });
        Song.loadTracks();
        Song.play();
        Song.setMasterVolume(1);
      }
    };
  });
