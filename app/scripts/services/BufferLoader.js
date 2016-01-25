/**
 * Created by marina on 25/01/16.
 */
'use strict';

/**
 * @ngdoc function
 * @name multitrackClientApp.service:BufferLoader
 * @description
 * # BufferLoader
 * Service of the multitrackClientApp
 */
angular.module('multitrackClientApp')
  .factory('BufferLoader', function () {

    var BufferLoader = function(context, urlList, callback) {
      angular.extend(this, {
        context : context,
        urlList : urlList,
        onload : callback,
        bufferList : new Array(),
        loadCount : 0,

        loadBuffer : function(url, index) {
        // Load buffer asynchronously
        console.log('file : ' + url + "loading and decoding");

        var request = new XMLHttpRequest();
        request.open("GET", url, true);

        request.responseType = "arraybuffer";

        var loader = this;

        request.onload = function() {

          // Asynchronously decode the audio file data in request.response
          loader.context.decodeAudioData(
            request.response,
            function(buffer) {
              if (!buffer) {
                alert('error decoding file data: ' + url);
                return;
              }
              loader.bufferList[index] = buffer;
              console.log("In bufferLoader.onload bufferList size is " + loader.bufferList.length + " index =" + index);
              if (++loader.loadCount == loader.urlList.length)
                loader.onload(loader.bufferList);
            },
            function(error) {
              console.error('decodeAudioData error', error);
            }
          );
        }

        request.onprogress = function(e) {
          //console.log("loaded : " + e.loaded + " total : " + e.total);

        }
        request.onerror = function() {
          alert('BufferLoader: XHR error');
        }

        request.send();
      },

      load : function() {
        // M.BUFFA added these two lines.
        this.bufferList = new Array();
        this.loadCount = 0;
        console.log("BufferLoader.prototype.load urlList size = " + this.urlList.length);
        for (var i = 0; i < this.urlList.length; ++i)
          this.loadBuffer(this.urlList[i], i);
      }}, context, urlList, callback);

    };
    return BufferLoader;
  });
