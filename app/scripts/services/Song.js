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
  .factory('Song', function () {

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

    var setMetadata = function(metadata){
      this.metadata = metadata;
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
      racks.forEach(function(track) {
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
      if (this.played) {
        this.pause();
        this.elapsedTimeSinceStart=0;
      }
    };

    var loadTracks = function() {
      var urlList = [];
      console.log(tracks.length);
      this.tracks.forEach(function(track) {
        urlList.push(track.url);
      });

      function finishedLoading(bufferList) {
        for (var i=0; i< bufferList.length; i++) {
          this.song.tracks[i].buffer = bufferList[i];
        }
      }

      this.bufferLoader = new BufferLoader(this.audioContext, urlList, finishedLoading);
      this.bufferLoader.song = this;
      this.bufferLoader.load();
    };

    var buildGraph = function() {
      var sources = [];
      // Create a single gain node for master volume
      this.masterVolumeNode = this.audioContext.createGain();
      for (var i = 0; i<this.tracks.length; i++) {
// each sound sample is the  source of a graph
        sources[i] = this.audioContext.createBufferSource();
        sources[i].buffer = this.tracks[i].buffer;
        // connect each sound sample to a vomume node
        this.tracks[i].volumeNode = this.audioContext.createGain();
        // Connect the sound sample to its volume node
        sources[i].connect(this.tracks[i].volumeNode);
        // Connects all track volume nodes a single master volume node
        this.tracks[i].volumeNode.connect(this.masterVolumeNode);
        // On active les boutons start et stop
        this.tracks[i].sample = sources[i];
      }
      // Connect the master volume to the speakers
      this.masterVolumeNode.connect(this.audioContext.destination);
    };

    var buildSourceNodes = function() {
      var sources = [];

      for (var i=0; i < this.tracks.length; i++) {
        sources[i] = this.audioContext.createBufferSource();
        sources[i].buffer = this.tracks[i].buffer;
        sources[i].connect(this.tracks[i].volumeNode);
        this.tracks[i].sample = sources[i];
      }
    }

    var setMasterVolume = function(value) {
      if( this.masterVolumeNode != undefined)
        this.masterVolumeNode.gain.value = value;
    };

    var setTrackVolume = function(trackNumber, value) {
      if (tracks[trackNumber] != undefined) {
        this.tracks[trackNumber].setVolume(value);
      }
    };

    var muteUnmuteTrack = function(trackNumber) {
      if (tracks[trackNumber] != undefined) {
        this.tracks[trackNumber].muteUnmute();
      }
    };

    var getDuration = function() {
      return (this.tracks.length ? this.tracks[0].buffer.duration : 0);
    };

    var updateTime = function() {
      this.currentTime = this.audioContext.currentTime;
      this.delta = this.currentTime - this.lastTime;
      this.elapsedTimeSinceStart += this.delta;
      this.lastTime = this.currentTime;
    };

    var addTrack = function(name, url, trackNumber) {
      this.tracks[trackNumber] = new Track(name, url);
    };
  });
