/**
 * Created by garad on 2017-07-20.
 */
// main.js
(function () {

  var dinnerService = function ($http) {
    console.log('dinnerService');
    return {
      login: function (username, password) {
        var request = {
          method: 'POST',
          url: 'http://www.nerddinner.com/Account/LogOn',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: 'UserName=' + username +
          '&Password=' + password +
          '&RememberMe=false'
        };
        return $http(request);
      },

      getMyDinners: function() {
      }
    }
  };

  var myController = function ($scope, $http, dinnerService) {
    console.log('myController');
    $scope.doLogin = function () {
      var onSuccess = function (response) {
        dinnerService.getMyDinners()
          .then(function(response) {
            $scope.dinners = response;
          });
      };

      dinnerService.login($scope.username, $scope.password)
        .then(onSuccess);
    }
  };

  var myApp = angular.module('starter.main', []);

  myApp.factory('dinnerService', ['$http', dinnerService]);
  myApp.controller('myController', ['$scope', '$http', 'dinnerService', myController]);

})();
