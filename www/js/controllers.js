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
    if(true||$stateParams.link != '') {
      $scope.CurrentRecipe = $stateParams.link;

      $("#ingredient_tab").click(function (e) {
        $("#ingredient_tab").addClass('button-clicked');
        $("#prep_tab").removeClass('button-clicked');
        //e.preventDefault();
        var content = $('#ingredient').html();
        $('#pane').empty().append(content);
      });
      $("#prep_tab").click(function (e) {
        $("#prep_tab").addClass('button-clicked');
        $("#ingredient_tab").removeClass('button-clicked');
        //e.preventDefault();
        var content = $('#prep').html();
        $('#pane').empty().append(content);
      });
      console.log("entered recipe...");
      var fullLink = "http://forkthecookbook.com/recipes/" + $stateParams.link;


      console.log($scope.CurrentRecipe);
      var arr = [];
      var headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Origin': 'http://localhost:8101',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        'Content-Type': 'application/json',
        'Accept': 'text/html'
      };
      arr.push(
        $http({
          method: "GET",
          params: {},
          headers: headers,
          url: fullLink
        })
      );
      $q.all(arr).then(function (result) {

          console.log("Auth.signin.success!");

          //var html = $($.parseHTML( result[0].data )).find( "#recipeContainer" )[0];

          var jqueryHTML = $($.parseHTML(result[0].data));
          var instructionsChunks = jqueryHTML.find('.recipe-instructions');
          var preparationsDiv = $($('#prep').find('.cont_text_det_preparation')[0]);
          var instructions = [];
          for (var i = 0; i < instructionsChunks.length; i++) {
            var lines = $(instructionsChunks[i]).find('li');
            for (var line = 0; line < lines.length; line++) {
              console.log("line = " + line);
              var step = $($(lines[line])[0]).text();


              var newStep = '<div class="cont_title_preparation">' +
                ' <p>STEP ' + (line + 1) + '</p>' +
                '</div>' +
                '<div class="cont_info_preparation">' +
                '<p>' + step + '</p>' +
                '</div>';
              preparationsDiv.append(newStep);
              instructions.push(step);
            }
            console.log();
          }

          console.log(instructions);
          $("#prep_tab").addClass('button-clicked');
          $("#ingredient_tab").removeClass('button-clicked');
          //e.preventDefault();
          var content = $('#prep').html();
          $('#pane').empty().append(content);
          var table = jqueryHTML.find('.table')[2];
          $(table).remove('.recipe-instructions');
          //$(table).find('thead th').children().slice($(table).find('thead th').length -1).detach();;
          var index = $(table).find('thead th').length - 1;
          //$(table).remove($(instructionsHeader));
          //console.log(instructionsHeader);
          $("#ingredient").append("<link rel='stylesheet' href='http://static.forkthecookbook.com/css/forkthecookbook.min.css'>");
          $("#ingredient").append($(table).prop('outerHTML'));
          $("#ingredient .table thead th:eq(" + index + ")").remove();
          $("#ingredient .table .recipe-instructions").remove();
          //console.log( $(table).prop('outerHTML'));
          for (var i = 0; i < 3; i++) {
            try {
              var value = $(jqueryHTML.find('.span4 .table td')[i]).text();
              console.log(value);
              switch (i) {
                case 0:
                  //serves
                  $('#serves').empty().append(value);
                  break;
                case 1:
                  //time
                  $('#time').empty().append(value);
                  break;
                case 2:
                  //diff
                  $('#diff').empty().append(value);
                  break;
                default:
                  break;
              }
            } catch (err) {
            }
          }
          var text = "";
        }
        // recipe-instructions
      );
    }
  })
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
        params: {"q" : query},
        headers: headers,
        url: $scope.CookBookURL
      })
      );
      $q.all(arr).then(function (result) {
        // ret[0] contains the response of the first call
        // ret[1] contains the second response
        // etc.
        console.log("Auth.signin.success!");
        //console.log(result[0].data);
        var html = $($.parseHTML( result[0].data )).find( "#recipeContainer" )[0];
        //console.log(html);
        var text = "";
        var allHtml = $(html).find('a');
        var recipeCardInfo = {
          link: [],
          title: [],
          img: [],
          length: 0
        };
        for(var i =0;i<allHtml.length;i++)
        {

          try {
            var link = 'http://forkthecookbook.com' + $(allHtml[i]).attr('href');
            text += 'url = '+ link;
            text += $(allHtml[i]).html();
            var divRecipeBox = $(allHtml[i]).find('.recipe-box')[0];
            console.log(divRecipeBox);
            var title = $(divRecipeBox).find(".recipe-title").text();
            var bg = $(divRecipeBox).css('background-image');
            bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
            console.log("title: "+title);
            console.log("background-image: "+bg)
            console.log('link: '+link);
            recipeCardInfo.link.push(link);
            recipeCardInfo.title.push(title);
            recipeCardInfo.img.push(bg);
            recipeCardInfo.length++;


          }catch (err){}
        }
        console.log(recipeCardInfo);
        var results = "</br><h4>Results: </h4>";

        for(var i = 0; i < recipeCardInfo.length; i++)
        {
          var titleX = recipeCardInfo.title[i];
          var imgX = recipeCardInfo.img[i];
          if(imgX === '')
          {
            imgX = '../img/cooker.png';
          }
          var linkX = recipeCardInfo.link[i];
          $scope.CurrentRecipe = linkX.substring(linkX.lastIndexOf("/")+1);
          results += "<a href='#/app/recipe/"+linkX.substring(linkX.lastIndexOf("/")+1)+"'><div class='w3-card-4' style='display: inline-block;margin-top: 20px;margin-bottom: 20px;margin-right: 30px; margin-left: 16px;width:20%'>"+
           " <img src='"+imgX+"' alt='Norway' style='width:100%'>"+
         "<div class='w3-container w3-center'>"+
          "<p>"+titleX+"</p>"+
        "</div>"+
        "</div></a>";
        }

        //console.log(text);
        $('#recipes').empty().append(results);

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
  })
  .controller('RandomCtrl', function($scope, $stateParams, $http, $q) {
    var random_endpoint = "http://forkthecookbook.com/recipes/random";

    $scope.randoSearch = function () {
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
          params: {},
          headers: headers,
          url: random_endpoint
        })
      );
      $q.all(arr).then(function (result) {
        // ret[0] contains the response of the first call
        // ret[1] contains the second response
        // etc.
        console.log("Auth.signin.success!");
        //console.log(result[0].data);
        var html = $($.parseHTML( result[0].data )).find( "#recipeContainer" )[0];
        //console.log(html);
        var text = "";
        var allHtml = $(html).find('a');
        var recipeCardInfo = {
          link: [],
          title: [],
          img: [],
          length: 0
        };
        for(var i =0;i<allHtml.length;i++)
        {

          try {
            var link = 'http://forkthecookbook.com' + $(allHtml[i]).attr('href');
            text += 'url = '+ link;
            text += $(allHtml[i]).html();
            var divRecipeBox = $(allHtml[i]).find('.recipe-box')[0];
            console.log(divRecipeBox);
            var title = $(divRecipeBox).find(".recipe-title").text();
            var bg = $(divRecipeBox).css('background-image');
            bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
            console.log("title: "+title);
            console.log("background-image: "+bg)
            console.log('link: '+link);
            recipeCardInfo.link.push(link);
            recipeCardInfo.title.push(title);
            recipeCardInfo.img.push(bg);
            recipeCardInfo.length++;


          }catch (err){}
        }
        console.log(recipeCardInfo);
        var results = "";//"<h2>Photo Card</h2></br>";

        for(var i = 0; i < recipeCardInfo.length; i++)
        {
          var titleX = recipeCardInfo.title[i];
          var imgX = recipeCardInfo.img[i];
          if(imgX === '')
          {
            imgX = '../img/cooker.png';
          }
          var linkX = recipeCardInfo.link[i];
          $scope.CurrentRecipe = linkX.substring(linkX.lastIndexOf("/")+1);
          results += "<a href='#/app/recipe/"+linkX.substring(linkX.lastIndexOf("/")+1)+"'><div class='w3-card-4' style='display: inline-block;margin-top: 20px;margin-bottom: 20px;margin-right: 30px; margin-left: 16px;width:20%'>"+
            " <img src='"+imgX+"' alt='Norway' style='width:100%'>"+
            "<div class='w3-container w3-center'>"+
            "<p>"+titleX+"</p>"+
            "</div>"+
            "</div></a>";
        }

        //console.log(text);
        $('#recipesRand').empty().append(results);

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
    $scope.randoSearch();
  });
