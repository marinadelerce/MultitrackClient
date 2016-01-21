/**
 * Created by marina on 21/01/16.
 */

'use strict';

/**
 * @ngdoc function
 * @name multitrackClientApp.service:Track
 * @description
 * # Track
 * Service of the multitrackClientApp
 */
angular.module('multitrackClientApp')
  .factory('Track', function () {
    this.name = name;
    this.url = url;

    this.volumeNode = null;
    this.buffer = null;
    this.sample = null;

    this.muted=false;

    var setVolume = function (value) {
      if (this.volumeNode != undefined)
        this.volumeNode.gain.value = value;
    };

    var muteUnmute = function () {
      if (this.volumeNode != undefined) {
        this.muted = !this.muted;
        this.volumeNode.gain.value = (this.muted ? 0 : 1);
      }
    };
  });
