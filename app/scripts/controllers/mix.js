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
  .controller('MixCtrl', function ($rootScope, $scope, $http, $location, $window, Constants, Song, Track) {
    $scope.musics = [];
    $scope.loadOK = false;
    $scope.volumeTrack = [];
    $scope.titleMix="Untitled";
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


    $scope.searchMixes = function(){
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
        var metadata = $scope.selectedMix.song.song;
        var id = $scope.selectedMix.song._id;
        $scope.song = Song;
        $scope.song.init(metadata,ctx,id);
        $scope.selectedMix.song.track.forEach(function(element, index){
          $scope.song.addTrack(element.name, Constants.backendUrl+element.path, index);
        });
        $scope.song.loadTracks();
        //chargement des effets de la chanson
        $scope.volume = $scope.selectedMix.masterVolume;
        $scope.volumeChanged();
        //chargement effets sur les pistes
        $scope.selectedMix.trackEffects.forEach(function(element){
          $scope.song.getTrackByName(element.track).setVolume(element.volume);
          $scope.song.getTrackByName(element.track).muted=element.mute;
        });
      }
      else if (typeof($scope.selectedMusic) != "undefined" && typeof($scope.selectedMix) == "undefined"){
        var audioContext = $window.AudioContext || $window.webkitAudioContext;
        var ctx = new audioContext();
        console.log($scope.selectedMusic);
        var metadata = $scope.selectedMusic.song;
        var id = $scope.selectedMusic._id;
        $scope.song = Song;
        $scope.song.init(metadata,ctx, id);
        console.log($scope.song);
        $scope.selectedMusic.track.forEach(function(element, index){
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
    };

   $scope.enregistrerMix = function(){
     var mix = {};
     mix.name= $scope.titleMix;
     mix.user_id=0;
     mix.song_id = $scope.song.id;
     mix.masterVolume =  $scope.song.getMasterVolume();
     mix.trackEffects=[];

     $scope.song.tracks.forEach(function(element, index){
       mix.trackEffects[index] = {};
       mix.trackEffects[index].track = element.name;
       mix.trackEffects[index].volume = element.getVolume();
       mix.trackEffects[index].mute = element.muted;
     });

      $http.post(Constants.backendUrl+Constants.mixPath, JSON.stringify(mix))
        .then(function(res){
          $location.path('/');
          console.log(res);
        }, function(error){
          console.log(error);
        });
   };
  });
