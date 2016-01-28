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
    $scope.volumeTrack = [];
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
        $scope.song = Song;
        $scope.song.init(metadata,ctx);
        console.log($scope.song);
        $scope.selectedMusic.track.forEach(function(element, index){
         // $scope.selectedMusic.track[index].num = index;
          //$scope.song.tracks[index].num = index;
         // console.log($scope.song.tracks[index].num);
          $scope.song.addTrack(element.name, Constants.backendUrl+element.path, index);
        });
        $scope.song.loadTracks();

      }
      $scope.loadOK=true;
    };

    $scope.playSong = function(){
      $scope.song.play();
    };

    $scope.pauseSong = function () {
      $scope.song.pause();
    };

    $scope.stopSong = function(){
      $scope.song.stop();
    };

    $scope.volumeChanged = function () {
      $scope.song.setMasterVolume($scope.volume);
    };

    /*Erreur volumeNode des tracks*/
    $scope.volumeTrackChanged = function (index,track) {
     // console.log("VolumeNode: " +Song.tracks[track.num].volumeNode.gain.value);
      $scope.song.tracks.forEach(function(element){
        if(element.name == track.name)
          element.setVolume($scope.volumeTrack[index]);
      });
    };

    $scope.muteTrack = function(index,track) {
      $scope.song.tracks.forEach(function(element){
        if(element.name == track.name){
          element.muteUnmute();
          if(element.muted) {
            document.getElementById(index).classList.remove("glyphicon-volume-off");
            document.getElementById(index).classList.add("glyphicon-volume-up");
          }
          else {
            document.getElementById(index).classList.remove("glyphicon-volume-up");
            document.getElementById(index).classList.add("glyphicon-volume-off");
          }
        }
      });
    }

   /* $scope.getTracks = function(){
      Son
    }*/
  });
