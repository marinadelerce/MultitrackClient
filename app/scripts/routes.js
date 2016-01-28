/**
 * Created by sonia on 14/01/16.
 */
'use strict';

/**
 * @ngdoc overview
 * @name multitrackClientApp
 * @description
 * # multitrackClientApp routes
 *
 * Routes of the application.
 */
angular
  .module('multitrackClientApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'index.html',
        controller: 'NavCtrl',
        controllerAs: 'nav'
      })
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/connexion', {
        templateUrl: '../views/connexion.html',
        controller: 'ConnexionCtrl',
        controllerAs: 'connexion'
      })
      .when('/register', {
        templateUrl: '../views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/loadMusic', {
        templateUrl: '../views/loadMusic.html',
        controller: 'LoadMusicCtrl',
        controllerAs: 'loadMusic'
      })
      .when('/mix', {
        templateUrl: '../views/mix.html',
        controller: 'MixCtrl',
        controllerAs: 'mix'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
