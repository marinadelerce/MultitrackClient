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

    var Track = function(name, url) {
      angular.extend(this, {
        name : name,
        url : url,
        volumeNode : null,
        buffer : null,
        sample : null,
        muted : false,
        setVolume : function (value) {
        if (this.volumeNode != undefined)
          this.volumeNode.gain.value = value;
        },
        muteUnmute : function () {
          if (this.volumeNode != undefined) {
            this.muted = !this.muted;
            this.volumeNode.gain.value = (this.muted ? 0 : 1);
          }
        },
      }, name, url);

    };
    return Track;
  });
