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
        if (volumeNode != undefined)
          volumeNode.gain.value = value;
        },
        muteUnmute : function () {
          if (volumeNode != undefined) {
            this.muted = !muted;
            volumeNode.gain.value = (muted ? 0 : 1);
          }
        },
      }, name, url);

    };
    return Track;
  });
