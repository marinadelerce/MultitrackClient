/**
 * Created by marina on 21/01/16.
 */
'use strict';

/**
 * @ngdoc function
 * @name multitrackClientApp.constant:Constants
 * @description
 * # Constants
 * Constant of the multitrackClientApp
 */
angular.module('multitrackClientApp')
  .constant('Constants', {
    backendUrl : "http://localhost:8081/",
    mixPath : "mix",
    songPath : "songs",
    trackPath : "track"
  });
