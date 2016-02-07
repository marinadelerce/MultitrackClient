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
    'ngTouch',
    'xeditable'
  ])
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
  }
  )
    .run(function(editableOptions){
      editableOptions.theme = "bs3";
    })
  .run(function($rootScope, $cookies, $location) {
    if(typeof($rootScope.user) == "undefined"
        && typeof($cookies.get('userToken')) != "undefined"
        && typeof($cookies.get('userName')) != "undefined"
        && typeof($cookies.get('userRight')) != "undefined"
        && typeof($cookies.get('userId')) != "undefined") {
      $rootScope.user ={};
      $rootScope.user.token = $cookies.get('userToken');
      $rootScope.user.name = $cookies.get('userName');
      $rootScope.user.right = $cookies.get('userRight');
      $rootScope.user.id = $cookies.get('userId');
      $location.path('/mix');
    }
      else{
      $location.path('/');
    }

  });
