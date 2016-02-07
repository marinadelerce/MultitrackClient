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
  .controller('MixCtrl', function ($rootScope, $scope, $http, $location, $window, Constants, Song, $cookies, $timeout) {
      $window.requestAnimFrame = (function(){
        return  $window.requestAnimationFrame       ||
            $window.webkitRequestAnimationFrame ||
            $window.mozRequestAnimationFrame    ||
            $window.oRequestAnimationFrame      ||
            $window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element){
              $timeout(callback, 1000 / 60);
            };
      })();

    $scope.musics = [];
    $scope.loadOK = false;
    $scope.volumeTrack = [];
    $scope.titleMix="Untitled";
    $scope.nameIndex = [];
    $scope.selectedMusic = null;
    $scope.selectedMix = null;
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

      $scope.drawSpectre = function() {
        //$scope.spectreCanvas;
        //$scope.spectreCanvasContext;

        $scope.spectreCanvasContext.save();
        $scope.spectreCanvasContext.fillStyle = "rgba(0, 0, 0, 0.05)";
        $scope.spectreCanvasContext.fillRect (0, 0, $scope.spectreCanvas.width(), $scope.spectreCanvas.height());

        var freqByteData = new Uint8Array($scope.song.songAnalyser.frequencyBinCount);
        $scope.song.songAnalyser.getByteFrequencyData(freqByteData);
        var nbFreq = freqByteData.length;

        var SPACER_WIDTH = 5;
        var BAR_WIDTH = 2;
        var OFFSET = 100;
        var CUTOFF = 23;
        var HALF_HEIGHT = $scope.spectreCanvas.height()/2;
        var numBars = 1.7*Math.round($scope.spectreCanvas.width() / SPACER_WIDTH);

        $scope.spectreCanvasContext.lineCap = 'round';

        for (var i = 0; i < numBars; ++i) {
          var magnitude = 0.3*freqByteData[Math.round((i * nbFreq) / numBars)];

          $scope.spectreCanvasContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
          $scope.spectreCanvasContext.fillRect(i * SPACER_WIDTH, HALF_HEIGHT, BAR_WIDTH, -magnitude);
          $scope.spectreCanvasContext.fillRect(i * SPACER_WIDTH, HALF_HEIGHT, BAR_WIDTH, magnitude);

        }

        // Draw animated white lines top
        $scope.spectreCanvasContext.strokeStyle = "white";
        $scope.spectreCanvasContext.beginPath();

        for (var i = 0; i < numBars; ++i) {
          var magnitude = 0.3*freqByteData[Math.round((i * nbFreq) / numBars)];
          if(i > 0) {
            $scope.spectreCanvasContext.lineTo(i*SPACER_WIDTH, HALF_HEIGHT-magnitude);
          } else {
            $scope.spectreCanvasContext.moveTo(i*SPACER_WIDTH, HALF_HEIGHT-magnitude);
          }
        }
        for (var i = 0; i < numBars; ++i) {
          var magnitude = 0.3*freqByteData[Math.round((i * nbFreq) / numBars)];
          if(i > 0) {
            $scope.spectreCanvasContext.lineTo(i*SPACER_WIDTH, HALF_HEIGHT+magnitude);
          } else {
            $scope.spectreCanvasContext.moveTo(i*SPACER_WIDTH, HALF_HEIGHT+magnitude);
          }
        }
        $scope.spectreCanvasContext.stroke();

        $scope.spectreCanvasContext.restore();

        $window.requestAnimFrame($scope.drawSpectre);
      };

    $scope.loadMusic =  function(){
      $scope.chargement = true;
      if($scope.selectedMix != null){
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
          sliderVolumeG = new Slider("#sliderVol", {id: "sliderVol", min  : 0, max  : 100, value: $scope.selectedMix.masterVolume*100, step: 1});

          //chargement effets sur les pistes
          $scope.selectedMix.trackEffects.forEach(function(element){
            $scope.song.setTrackByName(element.track, element.volume, element.mute);
          });
          $scope.initValTrackView();
          $scope.loadOK=true;
          $scope.$apply();

          $scope.spectreCanvas = $("#spectre");
          $scope.spectreCanvas.attr("width", $scope.spectreCanvas.width());
          $scope.spectreCanvas.attr("height", $scope.spectreCanvas.height());
          $scope.spectreCanvasContext = $scope.spectreCanvas[0].getContext('2d');

          $window.requestAnimFrame($scope.drawSpectre);
        });
        $scope.titleMix=$scope.selectedMix.name;

        //mock commentaires
        $scope.getComments($scope.selectedMix._id);


      }
      else if ($scope.selectedMusic != null && $scope.selectedMix == null){
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

          $scope.spectreCanvas = $("#spectre");
          $scope.spectreCanvas.attr("width", $scope.spectreCanvas.width());
          $scope.spectreCanvas.attr("height", $scope.spectreCanvas.height());
          $scope.spectreCanvasContext = $scope.spectreCanvas[0].getContext('2d');

          $window.requestAnimFrame($scope.drawSpectre);
        });
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
     mix.owner=$rootScope.user.id;
     mix.song_id = $scope.song.id;
     mix.masterVolume =  $scope.song.getMasterVolume();
     mix.trackEffects=[];

     $scope.song.tracks.forEach(function(element, index){
       mix.trackEffects[index] = {};
       mix.trackEffects[index].track = element.name;
       mix.trackEffects[index].volume = element.getVolume();
       mix.trackEffects[index].mute = element.muted;
     });

     var token = $rootScope.user.token;

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

    $scope.getComments = function(mixId){
      $http.get(Constants.backendUrl + Constants.commentPath + "/" + $scope.selectedMix._id)
        .then(function(res){
          $scope.comments = res.data;
          console.log($scope.comments);
        }, function (error){
          console.log(error);
        });
    };
//router.delete('/comment/:commentId/:connection',function(req,res) {
    $scope.removeComment = function (com){
      var token = $rootScope.user.token;

      if(typeof (token)!=='undefined') {
        $http.delete(Constants.backendUrl + Constants.commentPath + "/" + com.id + "/" + token)
          .then(function (res) {
            console.log(res);
            console.log('deleted comment!!!!');
            $scope.getComments($scope.selectedMix._id);
          }, function (error) {
            if (error.status > 0)
              $scope.errorMsg = error.status + ': ' + error.data;
            console.log(error);
          });
      }
    };
//router.post('/comment/update/:connection',function(req,res) {
    $scope.editCom = function(com){
      var token = $rootScope.user.token;

      if(typeof (token)!=='undefined') {
        $http.post(Constants.backendUrl + Constants.commentPath + "/update/" + token, {
          mixId: $scope.selectedMix._id,
          comment: com.content, rate: com.rate
        })
          .then(function (res) {
            console.log(res);
            console.log('updated comment!!!!');
            $scope.getComments($scope.selectedMix._id);
          }, function (error) {
            if (error.status > 0)
              $scope.errorMsg = error.status + ': ' + error.data;
            console.log(error);
          });
      }
    };
    $scope.comment = "";
    $scope.rate = 0;

    $scope.createComment = function(){
      var token = $rootScope.user.token;

      if(typeof (token)!=='undefined') {
        $http.post(Constants.backendUrl + Constants.commentPath + "/create/" + token,{mixId : $scope.selectedMix._id,
          comment : $scope.comment, rate : $scope.rate})
          .then(function (res) {
            console.log(res);
            $scope.getComments($scope.selectedMix._id);
          }, function (error) {
            console.log(error);
          });
      }
      else {
        $scope.errorMsg = 'Veuillez vous reconnecter.';
      }
    }

  });
