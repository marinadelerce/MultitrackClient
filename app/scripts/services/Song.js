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
  .factory('Song', function (Track, BufferLoader) {

    return {
        metadata : null,
        audioContext : null,
        url : "",
        tracks : [],
        elapsedTimeSinceStart : 0,
        currentTime : 0,
        lastTime : 0,
        delta : 0,

        played : false,
        paused : true,

        bufferLoader : null,
        masterVolumeNode : null,
        graphToBuild : true,
      init:function(metadata, context){
        this.metadata = metadata;
        this.audioContext = context;
      },

      play:function() {
        this.played=true;
        this.paused=false;

        if (this.graphToBuild) {
          this.buildGraph();
          this.graphToBuild = false;
        }
        else {
          this.buildSourceNodes();
        }
        this.playFrom(this.elapsedTimeSinceStart);
      },


      playFrom : function(startTime) {
        this.tracks.forEach(function(track) {
          track.sample.start(0, startTime);
        });
        this.elapsedTimeSinceStart = startTime;
        this.lastTime = this.audioContext.currentTime;
      },

      pause : function() {
        this.updateTime();
        console.log(this.elapsedTimeSinceStart);
        if (this.played) {
          this.tracks.forEach(function (track) {
  // destroy the nodes
            track.sample.stop(0);
          });

          this.played = false;
          this.paused = true;
        }
      },

      stop : function() {
        if (this.played) {
          this.pause();
          this.elapsedTimeSinceStart=0;
        }
      },

      loadTracks : function() {
        var urlList = [];
        console.log(this.tracks.length);
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
      },

      buildGraph : function() {
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
      },

      buildSourceNodes : function() {
        var sources = [];

        for (var i=0; i < this.tracks.length; i++) {
          sources[i] = this.audioContext.createBufferSource();
          sources[i].buffer = this.tracks[i].buffer;
          sources[i].connect(this.tracks[i].volumeNode);
          this.tracks[i].sample = sources[i];
        }
      },

      setMasterVolume : function(value) {
        if( this.masterVolumeNode != undefined)
          this.masterVolumeNode.gain.value = value;
      },

      setTrackVolume : function(trackNumber, value) {
        if (this.tracks[trackNumber] != undefined) {
          this.tracks[trackNumber].setVolume(value);
        }
      },

      muteUnmuteTrack : function(trackNumber) {
        if (this.tracks[trackNumber] != undefined) {
          this.tracks[trackNumber].muteUnmute();
        }
      },

      getDuration : function() {
        return (this.tracks.length ? this.tracks[0].buffer.duration : 0);
      },

      updateTime : function() {
        this.currentTime = this.audioContext.currentTime;
        this.delta = this.currentTime - this.lastTime;
        this.elapsedTimeSinceStart += this.delta;
        this.lastTime = this.currentTime;
      },

      addTrack : function(name, url, trackNumber) {
        this.tracks[trackNumber] = new Track(name, url);
      }
  }});
