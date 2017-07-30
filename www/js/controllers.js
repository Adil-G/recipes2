angular.module('starter.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin2 = function() {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller('PlaylistsCtrl', function($scope) {
    $scope.playlists = [
      { title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }
    ];
  })

  .controller('PlaylistCtrl', function($scope, $stateParams) {

  })
  .controller('RecipeCtrl', function($scope, $stateParams, $http, $q) {

  }
  .controller('SearchCtrl', function($scope, $stateParams, $http, $q) {
    $scope.CookBookURL =
      "http://forkthecookbook.com/search-recipes";
    $scope.httpRequest = function (address, reqType, asyncProc) {
      var r = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

      if (asyncProc)
        r.onreadystatechange = function () {
          if (this.readyState == 4) asyncProc(this);

        };
      else{}
       // r.timeout = 4000;  // Reduce default 2mn-like timeout to 4 s if synchronous
      r.open(reqType, address, !(!asyncProc));
      r.setRequestHeader('Access-Control-Allow-Origin', '*');
      r.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:8101');
      r.setRequestHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, HEAD');
      r.setRequestHeader('Content-Type', 'application/json');
      r.setRequestHeader('Accept', 'text/html');
      r.send();
      return r;
    };
    $scope.Search = function (query) {
      var arr = [];

      /*for (var a = 0; a < subs.length; ++a) {
        arr.push($http.get(url));
      }*/
      var headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Origin' : 'http://localhost:8101',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
        'Content-Type': 'application/json',
        'Accept': 'text/html'
      };
      /*
       $http({
       method: "GET",
       headers: headers,
       url: $scope.CookBookURL
       }).success(function(result) {
       console.log("Auth.signin.success!")
       console.log(result);
       var html = $($.parseHTML( result )).find( "#recipeContainer" )[0];
       console.log(html);// $('body').append(html);
       }).error(function(data, status, headers, config) {
       console.log("Auth.signin.error!")
       console.log(data);
       console.log(status);
       console.log(headers);
       console.log(config);
       })
       *///http://www.recipepuppy.com/api/?i=onions,garlic&q=omelet&p=3
      arr.push(
      $http({
        method: "GET",
        params: {"q" : "chicken"},
        headers: headers,
        url: $scope.CookBookURL
      })
      );
      $q.all(arr).then(function (result) {
        // ret[0] contains the response of the first call
        // ret[1] contains the second response
        // etc.
        console.log("Auth.signin.success!")
        console.log(result[0].data);
        var html = $($.parseHTML( result[0].data )).find( "#recipeContainer" )[0];
        console.log(html);
        var text = "";
        var allHtml = $(html).find('a');
        for(var i =0;i<allHtml.length;i++)
        {
          text += 'url = http://forkthecookbook.com' + $(allHtml[i]).attr('href');
          text += $(allHtml[i]).html();
        }
       // $scope.recipesX = text;
        console.log(text);
        $('#recipes').append(text);
        /*var iElement = angular.element( document.querySelector( 'body' ) );
        var svgTag = angular.element(text);
        angular.element(svgTag).appendTo(iElement[0]);*/
      });
      /*var req = $scope.httpRequest("http://forkthecookbook.com/search-recipes?q=butter+chicken", "HEAD");  // In this example you don't want to GET the full page contents
      alert(req.status == 200 ? "found!" : "failed");  // We didn't provided an async proc so this will be executed after request completion only
      console.log(req);*/
      /*
       $http.get($scope.CookBookURL, {params: {"q": "butter+chicken"}, headers: headers})
       .success(function (data) {
       console.log(data);
       return data;

       })
       .error(function (data) {
       console.log(data);
       return data;
       });*/
    };
  });
