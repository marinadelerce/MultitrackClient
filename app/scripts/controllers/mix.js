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
    $scope.loadOK = false;
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
        var audioContext = $window.AudioContext || $window.mozAudioContext || $window.webkitAudioContext;
        var ctx = new audioContext();
        var metadata = $scope.selectedMix.name;
        Song.init(metadata,ctx);
        $scope.selectedMix.track.forEach(function(element){
          Song.addTrack(new Track(element.name, element.path));
        });
        Song.loadTracks();

      }
      else if (typeof($scope.selectedMusic) != "undefined" && typeof($scope.selectedMix) == "undefined"){
        var audioContext = $window.AudioContext || $window.webkitAudioContext;
        var ctx = new audioContext();
        console.log($scope.selectedMusic);
        var metadata = $scope.selectedMusic.song;
        Song.init(metadata,ctx);
        $scope.selectedMusic.track.forEach(function(element, index){
          $scope.selectedMusic.track[index].num = index;
          console.log($scope.selectedMusic.track[index].num);
          Song.addTrack(element.name, Constants.backendUrl+element.path, index);
        });
        Song.loadTracks();

      }
      $scope.loadOK=true;
    };

    $scope.playSong = function(){
      Song.play();
    };

    $scope.pauseSong = function () {
      Song.pause();
    };

    $scope.stopSong = function(){
      Song.stop();
    };

    $scope.volumeChanged = function () {
      Song.setMasterVolume($scope.volume);
    };

    /*Erreur volumeNode des tracks*/
    $scope.volumeTrackChanged = function (track) {
      Song.setTrackVolume(track.num,$scope.volume);
    };

    $scope.muteTrack = function(track) {
      Song.muteUnmuteTrack(track.num);
    }
  });
