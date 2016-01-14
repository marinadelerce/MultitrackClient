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
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
