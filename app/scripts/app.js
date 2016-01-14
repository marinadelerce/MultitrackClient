'use strict';

/**
 * @ngdoc overview
 * @name multitrackClientApp
 * @description
 * # multitrackClientApp
 *
 * Main module of the application.
 */
angular
  .module('multitrackClientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
  }
  );
