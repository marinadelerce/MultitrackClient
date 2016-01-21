/**
 * Created by marina on 21/01/16.
 */
'use strict';

/**
 * @ngdoc function
 * @name multitrackClientApp.service:Song
 * @description
 * # Song
 * Service of the multitrackClientApp
 */
angular.module('multitrackClientApp')
  .factory('Song', function (Track) {

    var metadata = null;
    var audioContext = null;

    var url = "";
    var tracks = [];
    var elapsedTimeSinceStart = 0;
    var currentTime = 0;
    var lastTime = 0;
    var delta = 0;

    var played = false;
    var paused = true;

    var bufferLoader = null;
    var masterVolumeNode = null;
    var graphToBuild = true;

    var init = function(metadata, context){
      this.metadata = metadata;
      this.audioContext = context;
    }

    var play = function() {
      played=true;
      paused=false;

      if (graphToBuild) {
        buildGraph();
        graphToBuild = false;
      }
      else {
        buildSourceNodes();
      }
      playFrom(elapsedTimeSinceStart);
    };


    var playFrom = function(startTime) {
      tracks.forEach(function(track) {
        track.sample.start(0, startTime);
      });
      elapsedTimeSinceStart = startTime;
      lastTime = audioContext.currentTime;
    };

    var pause = function() {
      if (played) {
        tracks.forEach(function (track) {
// destroy the nodes
          track.sample.stop(0);
        });

        played = false;
        paused = true;
      }
    };

    var stop = function() {
      if (played) {
        pause();
        elapsedTimeSinceStart=0;
      }
    };

    var loadTracks = function() {
      var urlList = [];
      console.log(tracks.length);
      tracks.forEach(function(track) {
        urlList.push(track.url);
      });

      function finishedLoading(bufferList) {
        for (var i=0; i< bufferList.length; i++) {
          song.tracks[i].buffer = bufferList[i];
        }
      }

      bufferLoader = new BufferLoader(audioContext, urlList, finishedLoading);
      bufferLoader.song = this;
      bufferLoader.load();
    };

    var buildGraph = function() {
      var sources = [];
      // Create a single gain node for master volume
      this.masterVolumeNode = audioContext.createGain();
      for (var i = 0; i<tracks.length; i++) {
// each sound sample is the  source of a graph
        sources[i] = audioContext.createBufferSource();
        sources[i].buffer = tracks[i].buffer;
        // connect each sound sample to a vomume node
        tracks[i].volumeNode = audioContext.createGain();
        // Connect the sound sample to its volume node
        sources[i].connect(tracks[i].volumeNode);
        // Connects all track volume nodes a single master volume node
        tracks[i].volumeNode.connect(masterVolumeNode);
        // On active les boutons start et stop
        tracks[i].sample = sources[i];
      }
      // Connect the master volume to the speakers
      masterVolumeNode.connect(audioContext.destination);
    };

    var buildSourceNodes = function() {
      var sources = [];

      for (var i=0; i < tracks.length; i++) {
        sources[i] = audioContext.createBufferSource();
        sources[i].buffer = tracks[i].buffer;
        sources[i].connect(tracks[i].volumeNode);
        tracks[i].sample = sources[i];
      }
    }

    var setMasterVolume = function(value) {
      if( masterVolumeNode != undefined)
        masterVolumeNode.gain.value = value;
    };

    var setTrackVolume = function(trackNumber, value) {
      if (tracks[trackNumber] != undefined) {
        tracks[trackNumber].setVolume(value);
      }
    };

    var muteUnmuteTrack = function(trackNumber) {
      if (tracks[trackNumber] != undefined) {
        tracks[trackNumber].muteUnmute();
      }
    };

    var getDuration = function() {
      return (tracks.length ? tracks[0].buffer.duration : 0);
    };

    var updateTime = function() {
      currentTime = audioContext.currentTime;
      delta = currentTime - lastTime;
      elapsedTimeSinceStart += delta;
      lastTime = currentTime;
    };

    var addTrack = function(name, url, trackNumber) {
      tracks[trackNumber] = new Track(name, url);
    };
  });
