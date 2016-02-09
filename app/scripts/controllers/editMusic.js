/**
 * Created by marina on 14/01/16.
 */
'use strict';

/**
 * @ngdoc function
 * @name multitrackClientApp.controller:EditMusicCtrl
 * @description
 * # EditMusicCtrl
 * Controller of the multitrackClientApp
 */
angular.module('multitrackClientApp')
  .controller('EditMusicCtrl', function ($scope, $http, $window, Constants, $cookies) {

    var myInit = function() {
      $http.get(Constants.backendUrl + Constants.mixPath)
        .then(function(res) {
          $scope.mixes = res.data;
          console.log(res);
        }, function (error){
          if (error.status > 0)
            $scope.errorMsg = error.status + ': ' + error.data;
          console.log(error);
        });
    };

    myInit();

    $scope.removeMix = function (mix){
      var token = $cookies.get('userToken');

      if(typeof (token)!=='undefined'){
        $http.delete(Constants.backendUrl + Constants.mixPath + '/' + mix._id + '/' + token)
          .then(function(res) {
            console.log('deleted mix!!!!');
            $window.location.reload();
          }, function(error){
            if (error.status > 0)
              $scope.errorMsg = error.status + ': ' + error.data;
            console.log(error);
          });
      }
      else {
        $scope.errorMsg = 'Veuillez vous reconnecter.';
      }

    };

  });
