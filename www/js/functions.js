/**
 * Created by garad on 2017-07-20.
 */
var dinnerService = function ($http) {

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
      var parseDinners = function (response) {

        var tmp = document.implementation.createHTMLDocument();
        tmp.body.innerHTML = response.data;

        var items = $(tmp.body.children).find('.upcomingdinners li');

        var dinners = [];
        for (var i = 0; i < items.length; i++) {
          var dinner = {
            Name: $(items[i]).children('a')[0].innerText,
            Date: $(items[i]).children('strong')[0].innerText
          };
          dinners.push(dinner);
        }

        return dinners;
      };

      return $http.get('http://www.nerddinner.com/Dinners/My')
        .then(parseDinners);
    }
  }
};

var myController = function ($scope, $http, dinnerService) {

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
