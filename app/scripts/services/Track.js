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
    var name = null;
    var url = null;

    var volumeNode = null;
    var buffer = null;
    var sample = null;

    var muted=false;

    var init = function(name, url){
      this.name=name;
      this.url=url;
    };

    var setVolume = function (value) {
      if (volumeNode != undefined)
        volumeNode.gain.value = value;
    };

    var muteUnmute = function () {
      if (volumeNode != undefined) {
        muted = !muted;
        volumeNode.gain.value = (muted ? 0 : 1);
      }
    };
  });
