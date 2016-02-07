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
  .controller('MixCtrl', function ($rootScope, $scope, $http, $location, $window, Constants, Song, $cookies) {
    $scope.musics = [];
    $scope.loadOK = false;
    $scope.volumeTrack = [];
    $scope.titleMix="Untitled";
    $scope.nameIndex = [];
    var sliderVolumeG;

    var myInit = function() {
      $http.get(Constants.backendUrl + Constants.songPath)
        .then(function(res){
          $scope.musics = res.data;
          console.log(res);
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
      $scope.chargement = true;
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
        $scope.song.loadTracks(function(){
          //chargement des effets de la chanson
          $scope.song.setMasterVolume($scope.selectedMix.masterVolume);
          sliderVolumeG = new Slider("#sliderVol", {id: "sliderVol", min  : 0, max  : 100, value: $scope.selectedMix.masterVolume, step: 1});

          //chargement effets sur les pistes
          $scope.selectedMix.trackEffects.forEach(function(element){
            $scope.song.setTrackByName(element.track, element.volume, element.mute);
          });
          $scope.initValTrackView();
          $scope.loadOK=true;
          $scope.$apply();
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
        $scope.song.loadTracks(function(){
          sliderVolumeG = new Slider("#sliderVol", {id: "sliderVol", min  : 0, max  : 100, value: 100, step: 1});

          $scope.initValTrackView();
          $scope.loadOK=true;
          $scope.$apply();
        });

        //mock commentaires
        $scope.song["comments"] = [];

        var comment1 = {
          "content" : "Hey ! Un super commentaire ! Génial ce mix !",
          "user" : "Marina",
          "createdAt" : "???"
        };

        var comment2 = {
          "content" : "Hey ! Un autre super commentaire ! NUL ce mix !",
          "user" : "Mael",
          "createdAt" : "???"
        };

        $scope.song["comments"].push(comment1);
        $scope.song["comments"].push(comment2);
        console.log($scope.song["comments"]);
        console.log($scope.song.comments);
      }
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

    $scope.volumeTrackChanged = function (index,track) {
      $scope.song.tracks.forEach(function(element){
        if(element.name == track.name)
          element.setVolume($scope.volumeTrack[index]);
      });
    };

    $scope.muteTrack = function(index,track) {
      $scope.song.tracks.forEach(function(element){
        if(element.name == track.name){
          element.muteUnmute();
          //affichage
          var index = $scope.nameIndex[element.name];
          $scope.volumeTrack[index] = element.getVolume();
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
     mix.owner=0;
     mix.song_id = $scope.song.id;
     mix.masterVolume =  $scope.song.getMasterVolume();
     mix.trackEffects=[];

     $scope.song.tracks.forEach(function(element, index){
       mix.trackEffects[index] = {};
       mix.trackEffects[index].track = element.name;
       mix.trackEffects[index].volume = element.getVolume();
       mix.trackEffects[index].mute = element.muted;
     });

     var token = $cookies.get('token');

     if(typeof (token)!=='undefined') {
       $http.post(Constants.backendUrl + Constants.mixPath + '/' + token, JSON.stringify(mix))
         .then(function (res) {
           $scope.song.stop();
           $location.path('/');
           console.log(res);
         }, function (error) {
           console.log(error);
         });
     }
     else {
       $scope.errorMsg = 'Veuillez vous reconnecter.';
     }
   };

    $scope.initValTrackView = function(){

      $scope.song.tracks.forEach(function(element){

        var index = $scope.nameIndex[element.name];
        $scope.volumeTrack[index] = element.getVolume();
        if(element.muted) {
          document.getElementById(index).classList.remove("glyphicon-volume-off");
          document.getElementById(index).classList.add("glyphicon-volume-up");
        }
        else {
          document.getElementById(index).classList.remove("glyphicon-volume-up");
          document.getElementById(index).classList.add("glyphicon-volume-off");
        }

      });

      sliderVolumeG.on("slide", function(slideEvt) {
        $scope.song.setMasterVolume(slideEvt/100);
      });
    };

  });
