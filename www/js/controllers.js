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
  .factory ("StorageService", function ($localStorage) {

    $localStorage = $localStorage.$default({
      things: []
    });
    var _getAll = function () {
      return $localStorage.things;
    };
    var _add = function (thing) {
      $localStorage.things.push(thing);
    };
    var _remove = function (thing) {
      $localStorage.things.splice($localStorage.things.indexOf(thing), 1);
    };
    return {
      getAll: _getAll,
      add: _add,
      remove: _remove
    };
  })
  .controller( "MainCtrl", function ($scope, StorageService, $state,$ionicLoading) {
    $scope.Analytics = function(ScreenName)
    {
      if(typeof analytics !== 'undefined') {
        // turn on debug mode
        // https://github.com/danwilson/google-analytics-plugin#javascript-usage
        analytics.debugMode();

        // start tracker
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/

        analytics.startTrackerWithId('UA-000000-01');

        // set user id
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/user-id

        analytics.setUserId($scope.userID);

        // track a view
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/screens
        // Hint: Currently no support for appName, appId, appVersion, appInstallerId
        //       If you need support for it, please create an issue on github:
        //       https://github.com/driftyco/ng-cordova/issues

        analytics.trackView(ScreenName);

        // set custom dimensions
        // https://developers.google.com/analytics/devguides/platform/customdimsmets

        analytics.addCustomDimension('dimension1', 'Level 1');

        // track event
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events

        analytics.trackEvent('Videos', 'Video Load Time', 'Gone With the Wind', 100);

        // add transaction
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addTrans

        analytics.addTransaction('1234', 'Acme Clothing', '11.99', '5', '1.29', 'EUR');

        // add transaction item
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addItem

        analytics.addTransactionItem(
          '1234', 'Fluffy Pink Bunnies', 'DD23444', 'Party Toys', '11.99', '1', 'GBP'
        );

        // allow IDFA collection to enable demographics and interest reports
        // https://developers.google.com/analytics/devguides/collection/ios/v3/optional-features#idfa

        analytics.setAllowIDFACollection(true);

      }else {
        console.log("Google Analytics Unavailable");
      }

    };
    $scope.Analytics("History");
    $scope.history = function() {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      $scope.things = StorageService.getAll();
      $scope.add = function (newThing) {
        StorageService.add(newThing);
      };
      $scope.remove = function (thing) {
        StorageService.remove(thing);
      };
      $scope.printThings = function () {

      }
      var recipeCardInfoList = StorageService.getAll();
      var results = "</br><h4>Results: </h4>";
      var recipeListObject = $('#recipesHistory');
      recipeListObject.empty();
      for (var i = (recipeCardInfoList.length - 1); i >= 0 && ( Math.abs(((recipeCardInfoList.length - 1) - i)) < 500); i--) {
        var recipeCardInfo = recipeCardInfoList[i];
        var titleX = recipeCardInfo.title;
        var imgX = recipeCardInfo.img;
        if (imgX === '') {
          imgX = 'img/cooker.png';
        }
        var linkX = recipeCardInfo.link;
        //$scope.CurrentRecipe = linkX.substring(linkX.lastIndexOf("/")+1);
        var recipeInfo = {
          link: linkX,
          title: titleX,
          img: imgX
        };


        function goToRecipe(singleRecipeJSON) {
          return function () {
            //$scope.CurrentRecipeInfo = singleRecipeJSON;
            StorageService.add(singleRecipeJSON);
            $state.go("app.recipe", {});
          }
        }

        var px = '2%';
        var cardInfo = "<div class='w3-card-4' style='display: inline-block;margin-top: " + px + ";margin-bottom: " + px + ";margin-right: " + px + "; margin-left: " + px + ";width:45%'>" +
          " <img src='" + imgX + "' alt='Norway' style='width:100%'>" +
          "<div class='w3-container w3-center'>" +
          "<p>" + titleX + "</p>" +
          "</div>" +
          "</div>";

        var newRecipeCard = $($.parseHTML(cardInfo));
        newRecipeCard.click(goToRecipe(recipeInfo));
        recipeListObject.append(newRecipeCard);
      }
      $ionicLoading.hide();
    };
    $scope.history();
})

  .controller('StorageService', function($scope, $stateParams, $localStorage) {

  })
  .controller('RecipeCtrl', function($scope, $stateParams, $http, $q, StorageService,$ionicLoading) {
    $scope.Analytics = function(ScreenName)
    {
      if(typeof analytics !== 'undefined') {
        // turn on debug mode
        // https://github.com/danwilson/google-analytics-plugin#javascript-usage
        analytics.debugMode();

        // start tracker
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/

        analytics.startTrackerWithId('UA-000000-01');

        // set user id
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/user-id

        analytics.setUserId($scope.userID);

        // track a view
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/screens
        // Hint: Currently no support for appName, appId, appVersion, appInstallerId
        //       If you need support for it, please create an issue on github:
        //       https://github.com/driftyco/ng-cordova/issues

        analytics.trackView(ScreenName);

        // set custom dimensions
        // https://developers.google.com/analytics/devguides/platform/customdimsmets

        analytics.addCustomDimension('dimension1', 'Level 1');

        // track event
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events

        analytics.trackEvent('Videos', 'Video Load Time', 'Gone With the Wind', 100);

        // add transaction
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addTrans

        analytics.addTransaction('1234', 'Acme Clothing', '11.99', '5', '1.29', 'EUR');

        // add transaction item
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addItem

        analytics.addTransactionItem(
          '1234', 'Fluffy Pink Bunnies', 'DD23444', 'Party Toys', '11.99', '1', 'GBP'
        );

        // allow IDFA collection to enable demographics and interest reports
        // https://developers.google.com/analytics/devguides/collection/ios/v3/optional-features#idfa

        analytics.setAllowIDFACollection(true);

      }else {
        console.log("Google Analytics Unavailable");
      }

    };
    $scope.GetRecipe = function () {
      $scope.Analytics("Recipe Page");
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      $scope.pagetitle = 'Recipe';
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
      var fullLink = "";
      var recipeImageA = "";
      var recipeTitleA = "";
      try {
        var recipeCardInfoList = StorageService.getAll();
        var linkY = recipeCardInfoList[recipeCardInfoList.length - 1]
        fullLink = linkY.link;
        recipeImageA = linkY.img;
        recipeTitleA = linkY.title;
        $scope.pagetitle = recipeTitleA;
      } catch (err) {
      }
      try {
        $(".image").css("background-image", "url('" + recipeImageA + "')");
      } catch (err) {

      }

      if (fullLink.includes("http://opensourcecook.com")) {


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


            //var html = $($.parseHTML( result[0].data )).find( "#recipeContainer" )[0];

            var jqueryHTML = $($.parseHTML(result[0].data));
          var stepCounter = 0;
            try {
              var instructionsChunks = jqueryHTML.find('#content ol');
              if ($(instructionsChunks[0]).find("li").length == 0 || $(instructionsChunks[0]).closest("#comment-area").length) {
                instructionsChunks = jqueryHTML.find("#content p:contains('Directions')")[0];
                var preparationsDiv = $($('#prep').find('.cont_text_det_preparation')[0]);
                preparationsDiv.empty();
                var lines = $(instructionsChunks);

                if (lines.length == 1) {
                  var step = $($(lines[0])[0]).text().match(/[^\.!\?]+[\.!\?]+["']?|$/g);
                  for (var k = 0; k < step.length; k++) {
                    var part = step[k];
                    if (part === '')
                      continue;

                    var newStep = '<div class="cont_title_preparation">' +
                      ' <p>STEP ' + (++stepCounter) + '</p>' +
                      '</div>' +
                      '<div class="cont_info_preparation">' +
                      '<p>' + part + '</p>' +
                      '</div>';
                    preparationsDiv.append(newStep);

                  }
                } else {
                  for (var line = 0; line < lines.length; line++) {
                    var step = $($(lines[line])[0]).text();


                    var newStep = '<div class="cont_title_preparation">' +
                      ' <p>STEP ' + (++stepCounter) + '</p>' +
                      '</div>' +
                      '<div class="cont_info_preparation">' +
                      '<p>' + step + '</p>' +
                      '</div>';
                    preparationsDiv.append(newStep);

                  }
                }
              }
              else {

                var preparationsDiv = $($('#prep').find('.cont_text_det_preparation')[0]);
                preparationsDiv.empty();
                var lines = $(instructionsChunks[0]).find('li');
                for (var line = 0; line < lines.length; line++) {
                  var step = $($(lines[line])[0]).text();


                  var newStep = '<div class="cont_title_preparation">' +
                    ' <p>STEP ' + (++stepCounter) + '</p>' +
                    '</div>' +
                    '<div class="cont_info_preparation">' +
                    '<p>' + step + '</p>' +
                    '</div>';
                  preparationsDiv.append(newStep);

                }
              }
            } catch (err) {

            }

            $("#prep_tab").addClass('button-clicked');
            $("#ingredient_tab").removeClass('button-clicked');
            //e.preventDefault();
            var content = $('#prep').html();
            $('#pane').empty().append(content);


            var table = jqueryHTML.find("#content p:contains('Ingredients')")[jqueryHTML.find("#content p:contains('Ingredients')").length - 1];
            $("#ingredient").empty();
            var sco = "<style scoped>" +
              "@import 'http://static.forkthecookbook.com/css/forkthecookbook.min.css';" +
              "</style>";
            //$("#ingredient").append("<link rel='stylesheet' href='http://static.forkthecookbook.com/css/forkthecookbook.min.css'>");
            //$("#ingredient").append(sco);
            var ingHolder = $('<div/>', {
              class: 'scrollable'
            });
            ingHolder.append($(table).prop('outerHTML'));
            $("#ingredient").append(ingHolder);
            $("#ingredient").find('img').remove();
            /*if(!(imgInIngredientsTab.attr("src") === undefined || imgInIngredientsTab.attr("src") === null) && imgInIngredientsTab.attr("src").includes("/wp-content/uploads/"))
             {
             imgInIngredientsTab.attr("src","http://opensourcecook.com"+imgInIngredientsTab.attr("src"));
             }
             $("#ingredient table").addClass('scrollable');

             var text = "";
             */
            $ionicLoading.hide();
          }
          // recipe-instructions

        );
      }
      else {


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


            //var html = $($.parseHTML( result[0].data )).find( "#recipeContainer" )[0];

            var jqueryHTML = $($.parseHTML(result[0].data));
            var stepCounter = 0;
            var instructionsChunks = jqueryHTML.find('.recipe-instructions');
            var preparationsDiv = $($('#prep').find('.cont_text_det_preparation')[0]);
            preparationsDiv.empty();
            for (var i = 0; i < instructionsChunks.length; i++) {
              var lines = $(instructionsChunks[i]).find('li');
              for (var line = 0; line < lines.length; line++) {
                var step = $($(lines[line])[0]).text();


                var newStep = '<div class="cont_title_preparation">' +
                  ' <p>STEP ' + (++stepCounter) + '</p>' +
                  '</div>' +
                  '<div class="cont_info_preparation">' +
                  '<p>' + step + '</p>' +
                  '</div>';
                preparationsDiv.append(newStep);

              }
            }

            $("#prep_tab").addClass('button-clicked');
            $("#ingredient_tab").removeClass('button-clicked');
            //e.preventDefault();
            var content = $('#prep').html();
            $('#pane').empty().append(content);
            var table = jqueryHTML.find('.table')[2];
            $(table).remove('.recipe-instructions');
            //$(table).find('thead th').children().slice($(table).find('thead th').length -1).detach();;
            var index = $(table).find('thead th').length - 1;
            var sco = "<style scoped>" +
              "@import 'http://static.forkthecookbook.com/css/forkthecookbook.min.css';" +
              "</style>";
            $("#ingredient").empty();
            //$("#ingredient").append("<link rel='stylesheet' href='http://static.forkthecookbook.com/css/forkthecookbook.min.css'>");
            //$("#ingredient").append(sco);
            var ingHolder = $('<div/>', {
              class: 'scrollable'
            });
            ingHolder.append($(table).prop('outerHTML'));
            $("#ingredient").append(ingHolder);
            $("#ingredient .table thead th:eq(" + index + ")").remove();
            $("#ingredient .table .recipe-instructions").remove();

            var text = "";
            $ionicLoading.hide();
          }
          // recipe-instructions
        );
      }
    };
    $scope.GetRecipe();
  })
  .controller('SearchCtrl', function($scope, $stateParams, $http, $q, StorageService, $state, $ionicLoading) {
    $scope.CookBookURL =
      "http://forkthecookbook.com/search-recipes";
    $scope.Analytics = function(ScreenName)
    {
      if(typeof analytics !== 'undefined') {
        // turn on debug mode
        // https://github.com/danwilson/google-analytics-plugin#javascript-usage
        analytics.debugMode();

        // start tracker
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/

        analytics.startTrackerWithId('UA-000000-01');

        // set user id
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/user-id

        analytics.setUserId($scope.userID);

        // track a view
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/screens
        // Hint: Currently no support for appName, appId, appVersion, appInstallerId
        //       If you need support for it, please create an issue on github:
        //       https://github.com/driftyco/ng-cordova/issues

        analytics.trackView(ScreenName);

        // set custom dimensions
        // https://developers.google.com/analytics/devguides/platform/customdimsmets

        analytics.addCustomDimension('dimension1', 'Level 1');

        // track event
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events

        analytics.trackEvent('Videos', 'Video Load Time', 'Gone With the Wind', 100);

        // add transaction
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addTrans

        analytics.addTransaction('1234', 'Acme Clothing', '11.99', '5', '1.29', 'EUR');

        // add transaction item
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addItem

        analytics.addTransactionItem(
          '1234', 'Fluffy Pink Bunnies', 'DD23444', 'Party Toys', '11.99', '1', 'GBP'
        );

        // allow IDFA collection to enable demographics and interest reports
        // https://developers.google.com/analytics/devguides/collection/ios/v3/optional-features#idfa

        analytics.setAllowIDFACollection(true);

      }else {
        console.log("Google Analytics Unavailable");
      }

    };
    $scope.Search = function (query) {
      $scope.Analytics("Search");
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
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
      arr.push(
        $http({
          method: "GET",
          params: {"q" : query},
          headers: headers,
          url: $scope.CookBookURL
        })
      );
      arr.push(
        $http({
          method: "GET",
          params: {"s" : query},
          headers: headers,
          url: "http://opensourcecook.com/"
        })
      );
      var results = "</br><h4>Results: </h4>";
      var recipeListObject = $('#recipes');
      recipeListObject.empty();
      $q.all(arr).then(function (result) {
        // ret[0] contains the response of the first call
        // ret[1] contains the second response
        // etc.
        var html = $($.parseHTML( result[0].data )).find( "#recipeContainer" )[0];
        var htmlOpenSourceCookbook = $($.parseHTML( result[1].data ));
        var postList = htmlOpenSourceCookbook.find( "h1[id*='post']" );
        var listOfImages = [];

        for(var j = 0; j < postList.length;j++)
        {
          var posts = postList[j];
          listOfImages.push(
            $http({
              method: "GET",
              params: {},
              headers: headers,
              url: $($(posts).find("a")[0]).attr("href")
            })
          );
        }

        $q.all(listOfImages).then(function (page) {
          var cardJSON = {
            link: [],
            title: [],
            img: [],
            length: 0
          };
          for(var res = 0; res < page.length; res++)
          {
            var recipeImage = $($($.parseHTML( page[res].data )).find( "#content img" )[0]).attr("src");
            if(recipeImage === "http://opensourcecook.com/wp-content/themes/emerald-stretch/img/calendar.gif"
              || recipeImage === undefined || recipeImage === null
            )
            {
              recipeImage = 'img/cooker.png';
            }
            if(recipeImage.includes("/wp-content/uploads/") && !recipeImage.includes("http://"))
            {
              recipeImage = "http://opensourcecook.com"+recipeImage;
            }
            var recipeTitle = $($($.parseHTML( page[res].data )).find( "#content h1" )[0]).text();
            var recipeLink = page[res].config.url;
            cardJSON.img.push(recipeImage);
            cardJSON.title.push(recipeTitle);
            cardJSON.link.push(recipeLink);

            cardJSON.length++;
          }
          for(var i = 0; i < cardJSON.length; i++)
          {
            var titleX = cardJSON.title[i];
            var imgX = cardJSON.img[i];
            /*if(imgX === '')
             {
             imgX = 'img/cooker.png';
             }
             /*var image = new Image();
             image.src = imgX;
             if (image.width == 0) {
             imgX = 'img/cooker.png';
             }*/

            var linkX = cardJSON.link[i];
            //$scope.CurrentRecipe = linkX.substring(linkX.lastIndexOf("/")+1);
            var recipeInfo = {
              link: linkX,
              title: titleX,
              img: imgX
            };


            function goToRecipe( singleRecipeJSON ){
              return function(){
                //$scope.CurrentRecipeInfo = singleRecipeJSON;
                StorageService.add(singleRecipeJSON);
                $state.go("app.recipe",{});
              }
            }
            var px = '2%';
            var cardInfo = "<div class='w3-card-4' style='display: inline-block;margin-top: "+px+";margin-bottom: "+px+";margin-right: "+px+"; margin-left: "+px+";width:45%'>"+
              " <img src='"+imgX+"' alt='Norway' style='width:100%'>"+
              "<div class='w3-container w3-center'>"+
              "<p>"+titleX+"</p>"+
              "</div>"+
              "</div>";

            var newRecipeCard = $($.parseHTML(cardInfo));
            newRecipeCard.click(goToRecipe(recipeInfo));
            recipeListObject.append(newRecipeCard);
          }
          $ionicLoading.hide();
        });
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
            var title = $(divRecipeBox).find(".recipe-title").text();
            var bg = $(divRecipeBox).css('background-image');
            bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
            recipeCardInfo.link.push(link);
            recipeCardInfo.title.push(title);
            recipeCardInfo.img.push(bg);
            recipeCardInfo.length++;


          }catch (err){}
        }


        for(var i = 0; i < recipeCardInfo.length; i++)
        {
          var titleX = recipeCardInfo.title[i];
          var imgX = recipeCardInfo.img[i];
          if(imgX === '')
          {
            imgX = 'img/cooker.png';
          }
          var linkX = recipeCardInfo.link[i];
          //$scope.CurrentRecipe = linkX.substring(linkX.lastIndexOf("/")+1);
          var recipeInfo = {
            link: linkX,
            title: titleX,
            img: imgX
          };


          function goToRecipe( singleRecipeJSON ){
            return function(){
              //$scope.CurrentRecipeInfo = singleRecipeJSON;
              StorageService.add(singleRecipeJSON);
              $state.go("app.recipe",{});
            }
          }
          var px = '2%';
          var cardInfo = "<div class='w3-card-4' style='display: inline-block;margin-top: "+px+";margin-bottom: "+px+";margin-right: "+px+"; margin-left: "+px+";width:45%'>"+
            " <img src='"+imgX+"' alt='Norway' style='width:100%'>"+
            "<div class='w3-container w3-center'>"+
            "<p>"+titleX+"</p>"+
            "</div>"+
            "</div>";

          var newRecipeCard = $($.parseHTML(cardInfo));
          newRecipeCard.click(goToRecipe(recipeInfo));
          recipeListObject.append(newRecipeCard);
        }

        /*var iElement = angular.element( document.querySelector( 'body' ) );
         var svgTag = angular.element(text);
         angular.element(svgTag).appendTo(iElement[0]);*/
      });

    };
  })
  .controller('CatCtrl2', function($scope, $stateParams, $http, $q,  $state, StorageService, $ionicLoading) {
    $scope.Analytics = function(ScreenName)
    {
      if(typeof analytics !== 'undefined') {
        // turn on debug mode
        // https://github.com/danwilson/google-analytics-plugin#javascript-usage
        analytics.debugMode();

        // start tracker
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/

        analytics.startTrackerWithId('UA-000000-01');

        // set user id
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/user-id

        analytics.setUserId($scope.userID);

        // track a view
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/screens
        // Hint: Currently no support for appName, appId, appVersion, appInstallerId
        //       If you need support for it, please create an issue on github:
        //       https://github.com/driftyco/ng-cordova/issues

        analytics.trackView(ScreenName);

        // set custom dimensions
        // https://developers.google.com/analytics/devguides/platform/customdimsmets

        analytics.addCustomDimension('dimension1', 'Level 1');

        // track event
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events

        analytics.trackEvent('Videos', 'Video Load Time', 'Gone With the Wind', 100);

        // add transaction
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addTrans

        analytics.addTransaction('1234', 'Acme Clothing', '11.99', '5', '1.29', 'EUR');

        // add transaction item
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addItem

        analytics.addTransactionItem(
          '1234', 'Fluffy Pink Bunnies', 'DD23444', 'Party Toys', '11.99', '1', 'GBP'
        );

        // allow IDFA collection to enable demographics and interest reports
        // https://developers.google.com/analytics/devguides/collection/ios/v3/optional-features#idfa

        analytics.setAllowIDFACollection(true);

      }else {
        console.log("Google Analytics Unavailable");
      }

    };
    $scope.Analytics("Categories Second Level");
    var arr = [];
    var titleMap = {
      'appetizer': {
        name: "Appetizer",
        icon: "img/categories/cracker.png"
      },
      'beverages': {
        name: "Beverages",
        icon: "img/categories/milkshake.png"
      },
      'muffins': {
      name: "Muffins",
      icon: "img/categories/cupcake.png"
      },
      'navdessert': {
        name: "Dessert",
        icon: "img/categories/chocolate.png"

      },
      'navmaindishes': {
        name: "Main Dishes",
        icon: "img/categories/dish.png"
      },
      'news': {
      name: "News",
      icon: "img/categories/male-reporter.png"
     },
      'salad': {
        name: "Salad",
        icon: "img/categories/salad.png"},
      'sauce': {
      name: "Sauce",
        icon: "img/categories/ketchup.png"},
      'side-dish': {name: "Side Dish",
      icon: "img/categories/chef-hat-on-a-plate-from-side-view.png"},
      'snacks': {name: "Snacks",
      icon: "img/categories/popcorn.png"},
      'soup': {name: "Soup",
      icon: "img/categories/soup.png"},

      'chicken': {name:"Chicken",
      icon: "img/categories/chicken.png"},
      'meat': {name: "Meat",
      icon: "img/categories/turkey.png"},
      'pasta': {name:"Pasta",
      icon: "img/categories/spaguetti.png"},
      'pork': {name: "Pork",
      icon: "img/categories/salami.png"},
      'seafood': {name:"Seafood",
      icon: "img/categories/shrimp.png"},
      'turkey': {name:"Turkey",
      icon: "img/categories/turkey.png"},
      'wild-game': {name: "Wild Game",
      icon: "img/categories/deer.png"},

      'brownies': {name:"Brownies",
      icon: "img/categories/brownie.png"},
      'cakes-pies': {name: "Cakes & Pies",
      icon: "img/categories/cake.png"},
      'cookies-fudge': {name:"Cookies & Fudge",
      icon: "img/categories/cookie.png"}

    };
    $scope.CurrentCategory = titleMap[$stateParams.cat2.toLowerCase()]['name'];
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
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
    arr.push(
      $http({
        method: "GET",
        params: {},
        headers: headers,
        url: "http://opensourcecook.com/category/"+$stateParams.cat.toLowerCase()+"/"+$stateParams.cat2.toLowerCase()
      })
    );
    var results = "</br><h4>Results: </h4>";
    var recipeListObject = $('#recipeCat');
    recipeListObject.empty();
    $q.all(arr).then(function (result) {
      // ret[0] contains the response of the first call
      // ret[1] contains the second response
      // etc.
      var htmlOpenSourceCookbook = $($.parseHTML(result[0].data));
      var postList = htmlOpenSourceCookbook.find("h1[id*='post']");
      var listOfImages = [];

      for (var j = 0; j < postList.length; j++) {
        var posts = postList[j];
        listOfImages.push(
          $http({
            method: "GET",
            params: {},
            headers: headers,
            url: $($(posts).find("a")[0]).attr("href")
          })
        );
      }

      $q.all(listOfImages).then(function (page) {
        var cardJSON = {
          link: [],
          title: [],
          img: [],
          length: 0
        };
        for (var res = 0; res < page.length; res++) {
          var recipeImage = $($($.parseHTML(page[res].data)).find("#content img")[0]).attr("src");
          if (recipeImage === "http://opensourcecook.com/wp-content/themes/emerald-stretch/img/calendar.gif"
            || recipeImage === undefined || recipeImage === null
          ) {
            recipeImage = 'img/cooker.png';
          }
          if (recipeImage.includes("/wp-content/uploads/") && !recipeImage.includes("http://")) {
            recipeImage = "http://opensourcecook.com" + recipeImage;
          }
          var recipeTitle = $($($.parseHTML(page[res].data)).find("#content h1")[0]).text();
          var recipeLink = page[res].config.url;
          cardJSON.img.push(recipeImage);
          cardJSON.title.push(recipeTitle);
          cardJSON.link.push(recipeLink);

          cardJSON.length++;
        }
        for (var i = 0; i < cardJSON.length; i++) {
          var titleX = cardJSON.title[i];
          var imgX = cardJSON.img[i];
          /*if(imgX === '')
           {
           imgX = 'img/cooker.png';
           }
           /*var image = new Image();
           image.src = imgX;
           if (image.width == 0) {
           imgX = 'img/cooker.png';
           }*/

          var linkX = cardJSON.link[i];
          //$scope.CurrentRecipe = linkX.substring(linkX.lastIndexOf("/")+1);
          var recipeInfo = {
            link: linkX,
            title: titleX,
            img: imgX
          };


          function goToRecipe(singleRecipeJSON) {
            return function () {
              StorageService.add(singleRecipeJSON);
              $state.go("app.recipe", {});
            }
          }

          var px = '2%';
          var cardInfo = "<div class='w3-card-4' style='display: inline-block;margin-top: " + px + ";margin-bottom: " + px + ";margin-right: " + px + "; margin-left: " + px + ";width:45%'>" +
            " <img src='" + imgX + "' alt='Norway' style='width:100%'>" +
            "<div class='w3-container w3-center'>" +
            "<p>" + titleX + "</p>" +
            "</div>" +
            "</div>";

          var newRecipeCard = $($.parseHTML(cardInfo));
          newRecipeCard.click(goToRecipe(recipeInfo));
          recipeListObject.append(newRecipeCard);
        }
        $ionicLoading.hide();
      });

    });
  })
  .controller('NavCtrl', function($scope, $stateParams, $http, $q,  $state, StorageService, $location) {

    $scope.go = function ( path ) {
      $location.path( path );
    };
  })

  .controller('CatCtrl', function($scope, $stateParams, $http, $q,  $state, StorageService,$ionicLoading) {
    $scope.Analytics = function(ScreenName)
    {
      if(typeof analytics !== 'undefined') {
        // turn on debug mode
        // https://github.com/danwilson/google-analytics-plugin#javascript-usage
        analytics.debugMode();

        // start tracker
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/

        analytics.startTrackerWithId('UA-000000-01');

        // set user id
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/user-id

        analytics.setUserId($scope.userID);

        // track a view
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/screens
        // Hint: Currently no support for appName, appId, appVersion, appInstallerId
        //       If you need support for it, please create an issue on github:
        //       https://github.com/driftyco/ng-cordova/issues

        analytics.trackView(ScreenName);

        // set custom dimensions
        // https://developers.google.com/analytics/devguides/platform/customdimsmets

        analytics.addCustomDimension('dimension1', 'Level 1');

        // track event
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events

        analytics.trackEvent('Videos', 'Video Load Time', 'Gone With the Wind', 100);

        // add transaction
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addTrans

        analytics.addTransaction('1234', 'Acme Clothing', '11.99', '5', '1.29', 'EUR');

        // add transaction item
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addItem

        analytics.addTransactionItem(
          '1234', 'Fluffy Pink Bunnies', 'DD23444', 'Party Toys', '11.99', '1', 'GBP'
        );

        // allow IDFA collection to enable demographics and interest reports
        // https://developers.google.com/analytics/devguides/collection/ios/v3/optional-features#idfa

        analytics.setAllowIDFACollection(true);

      }else {
        console.log("Google Analytics Unavailable");
      }

    };
    $scope.Analytics("Categories Top Level");
    var titleMap = {
      'appetizer': {
        name: "Appetizer",
        icon: "img/categories/cracker.png"
      },
      'beverages': {
        name: "Beverages",
        icon: "img/categories/milkshake.png"
      },
      'muffins': {
        name: "Muffins",
        icon: "img/categories/cupcake.png"
      },
      'navdessert': {
        name: "Dessert",
        icon: "img/categories/chocolate.png"

      },
      'navmaindishes': {
        name: "Main Dishes",
        icon: "img/categories/dish.png"
      },
      'news': {
        name: "News",
        icon: "img/categories/male-reporter.png"
      },
      'salad': {
        name: "Salad",
        icon: "img/categories/salad.png"},
      'sauce': {
        name: "Sauce",
        icon: "img/categories/ketchup.png"},
      'side-dish': {name: "Side Dish",
        icon: "img/categories/chef-hat-on-a-plate-from-side-view.png"},
      'snacks': {name: "Snacks",
        icon: "img/categories/popcorn.png"},
      'soup': {name: "Soup",
        icon: "img/categories/soup.png"},

      'chicken': {name:"Chicken",
        icon: "img/categories/chicken.png"},
      'meat': {name: "Meat",
        icon: "img/categories/turkey.png"},
      'pasta': {name:"Pasta",
        icon: "img/categories/spaguetti.png"},
      'pork': {name: "Pork",
        icon: "img/categories/salami.png"},
      'seafood': {name:"Seafood",
        icon: "img/categories/shrimp.png"},
      'turkey': {name:"Turkey",
        icon: "img/categories/turkey.png"},
      'wild-game': {name: "Wild Game",
        icon: "img/categories/deer.png"},

      'brownies': {name:"Brownies",
        icon: "img/categories/brownie.png"},
      'cakes-pies': {name: "Cakes & Pies",
        icon: "img/categories/cake.png"},
      'cookies-fudge': {name:"Cookies & Fudge",
        icon: "img/categories/cookie.png"}

    };
    $scope.CurrentCategory = titleMap[$stateParams.cat.toLowerCase()]['name'];
    var arr = [];
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
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

    arr.push(
      $http({
        method: "GET",
        params: {},
        headers: headers,
        url: "http://opensourcecook.com/category/"+$stateParams.cat.toLowerCase()
      })
    );
    var results = "</br><h4>Results: </h4>";
    var recipeListObject = $('#recipeCat');
    recipeListObject.empty();
    $q.all(arr).then(function (result) {
      // ret[0] contains the response of the first call
      // ret[1] contains the second response
      // etc.

      var htmlOpenSourceCookbook = $($.parseHTML(result[0].data));
      var postList = htmlOpenSourceCookbook.find("h1[id*='post']");
      var listOfImages = [];

      for (var j = 0; j < postList.length; j++) {
        var posts = postList[j];
        listOfImages.push(
          $http({
            method: "GET",
            params: {},
            headers: headers,
            url: $($(posts).find("a")[0]).attr("href")
          })
        );
      }

      $q.all(listOfImages).then(function (page) {
        var cardJSON = {
          link: [],
          title: [],
          img: [],
          length: 0
        };
        for (var res = 0; res < page.length; res++) {
          var recipeImage = $($($.parseHTML(page[res].data)).find("#content img")[0]).attr("src");

          if (recipeImage === "http://opensourcecook.com/wp-content/themes/emerald-stretch/img/calendar.gif"
            || recipeImage === undefined || recipeImage === null
          ) {
            recipeImage = 'img/cooker.png';
          }
          if (recipeImage.includes("/wp-content/uploads/") && !recipeImage.includes("http://")) {
            recipeImage = "http://opensourcecook.com" + recipeImage;
          }
          var recipeTitle = $($($.parseHTML(page[res].data)).find("#content h1")[0]).text();
          var recipeLink = page[res].config.url;

          cardJSON.img.push(recipeImage);
          cardJSON.title.push(recipeTitle);
          cardJSON.link.push(recipeLink);

          cardJSON.length++;
        }
        for (var i = 0; i < cardJSON.length; i++) {
          var titleX = cardJSON.title[i];
          var imgX = cardJSON.img[i];
          /*if(imgX === '')
           {
           imgX = 'img/cooker.png';
           }
           /*var image = new Image();
           image.src = imgX;
           if (image.width == 0) {
           imgX = 'img/cooker.png';
           }*/

          var linkX = cardJSON.link[i];
          //$scope.CurrentRecipe = linkX.substring(linkX.lastIndexOf("/")+1);
          var recipeInfo = {
            link: linkX,
            title: titleX,
            img: imgX
          };


          function goToRecipe(singleRecipeJSON) {
            return function () {
              //$scope.CurrentRecipeInfo = singleRecipeJSON;
              StorageService.add(singleRecipeJSON);
              $state.go("app.recipe", {});
            }
          }

          var px = '2%';
          var cardInfo = "<div class='w3-card-4' style='display: inline-block;margin-top: " + px + ";margin-bottom: " + px + ";margin-right: " + px + "; margin-left: " + px + ";width:45%'>" +
            " <img src='" + imgX + "' alt='Norway' style='width:100%'>" +
            "<div class='w3-container w3-center'>" +
            "<p>" + titleX + "</p>" +
            "</div>" +
            "</div>";

          var newRecipeCard = $($.parseHTML(cardInfo));
          newRecipeCard.click(goToRecipe(recipeInfo));
          recipeListObject.append(newRecipeCard);
        }
        $ionicLoading.hide();
      });
    });
  })
  /*.controller('Ctrl', function($scope, $stateParams, $http, $q,  $state, StorageService, $ionicLoading) {
    $scope.Search();
  })*/
    .controller('RandomCtrl', function($scope, $stateParams, $http, $q,  $state, StorageService, $ionicLoading) {
    $scope.userID = '_' + Math.random().toString(36).substr(2, 9);

      $scope.Analytics = function(ScreenName)
    {
      if(typeof analytics !== 'undefined') {
        // turn on debug mode
        // https://github.com/danwilson/google-analytics-plugin#javascript-usage
        analytics.debugMode();

        // start tracker
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/

        analytics.startTrackerWithId('UA-000000-01');

        // set user id
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/user-id

        analytics.setUserId($scope.userID);

        // track a view
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/screens
        // Hint: Currently no support for appName, appId, appVersion, appInstallerId
        //       If you need support for it, please create an issue on github:
        //       https://github.com/driftyco/ng-cordova/issues

        analytics.trackView(ScreenName);

        // set custom dimensions
        // https://developers.google.com/analytics/devguides/platform/customdimsmets

        analytics.addCustomDimension('dimension1', 'Level 1');

        // track event
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events

        analytics.trackEvent('Videos', 'Video Load Time', 'Gone With the Wind', 100);

        // add transaction
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addTrans

        analytics.addTransaction('1234', 'Acme Clothing', '11.99', '5', '1.29', 'EUR');

        // add transaction item
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addItem

        analytics.addTransactionItem(
          '1234', 'Fluffy Pink Bunnies', 'DD23444', 'Party Toys', '11.99', '1', 'GBP'
        );

        // allow IDFA collection to enable demographics and interest reports
        // https://developers.google.com/analytics/devguides/collection/ios/v3/optional-features#idfa

        analytics.setAllowIDFACollection(true);

      }else {
        console.log("Google Analytics Unavailable");
      }

    };
      $scope.CookBookURL =
      "http://forkthecookbook.com/search-recipes";
    $scope.Search = function (query) {
      $scope.Analytics("Search");
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
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
      arr.push(
        $http({
          method: "GET",
          params: {"q" : query},
          headers: headers,
          url: $scope.CookBookURL
        })
      );
      arr.push(
        $http({
          method: "GET",
          params: {"s" : query},
          headers: headers,
          url: "http://opensourcecook.com/"
        })
      );
      var results = "</br><h4>Results: </h4>";
      var recipeListObject = $('#recipes');
      recipeListObject.empty();
      $q.all(arr).then(function (result) {
        // ret[0] contains the response of the first call
        // ret[1] contains the second response
        // etc.
        var html = $($.parseHTML( result[0].data )).find( "#recipeContainer" )[0];
        var htmlOpenSourceCookbook = $($.parseHTML( result[1].data ));
        var postList = htmlOpenSourceCookbook.find( "h1[id*='post']" );
        var listOfImages = [];

        for(var j = 0; j < postList.length;j++)
        {
          var posts = postList[j];
          listOfImages.push(
            $http({
              method: "GET",
              params: {},
              headers: headers,
              url: $($(posts).find("a")[0]).attr("href")
            })
          );
        }

        $q.all(listOfImages).then(function (page) {
          var cardJSON = {
            link: [],
            title: [],
            img: [],
            length: 0
          };
          for(var res = 0; res < page.length; res++)
          {
            var recipeImage = $($($.parseHTML( page[res].data )).find( "#content img" )[0]).attr("src");
            if(recipeImage === "http://opensourcecook.com/wp-content/themes/emerald-stretch/img/calendar.gif"
              || recipeImage === undefined || recipeImage === null
            )
            {
              recipeImage = 'img/cooker.png';
            }
            if(recipeImage.includes("/wp-content/uploads/") && !recipeImage.includes("http://"))
            {
              recipeImage = "http://opensourcecook.com"+recipeImage;
            }
            var recipeTitle = $($($.parseHTML( page[res].data )).find( "#content h1" )[0]).text();
            var recipeLink = page[res].config.url;
            cardJSON.img.push(recipeImage);
            cardJSON.title.push(recipeTitle);
            cardJSON.link.push(recipeLink);

            cardJSON.length++;
          }
          for(var i = 0; i < cardJSON.length; i++)
          {
            var titleX = cardJSON.title[i];
            var imgX = cardJSON.img[i];
            /*if(imgX === '')
             {
             imgX = 'img/cooker.png';
             }
             /*var image = new Image();
             image.src = imgX;
             if (image.width == 0) {
             imgX = 'img/cooker.png';
             }*/

            var linkX = cardJSON.link[i];
            //$scope.CurrentRecipe = linkX.substring(linkX.lastIndexOf("/")+1);
            var recipeInfo = {
              link: linkX,
              title: titleX,
              img: imgX
            };


            function goToRecipe( singleRecipeJSON ){
              return function(){
                //$scope.CurrentRecipeInfo = singleRecipeJSON;
                StorageService.add(singleRecipeJSON);
                $state.go("app.recipe",{});
              }
            }
            var px = '2%';
            var cardInfo = "<div class='w3-card-4' style='display: inline-block;margin-top: "+px+";margin-bottom: "+px+";margin-right: "+px+"; margin-left: "+px+";width:45%'>"+
              " <img src='"+imgX+"' alt='Norway' style='width:100%'>"+
              "<div class='w3-container w3-center'>"+
              "<p>"+titleX+"</p>"+
              "</div>"+
              "</div>";

            var newRecipeCard = $($.parseHTML(cardInfo));
            newRecipeCard.click(goToRecipe(recipeInfo));
            recipeListObject.append(newRecipeCard);
          }
          $ionicLoading.hide();
        });
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
            var title = $(divRecipeBox).find(".recipe-title").text();
            var bg = $(divRecipeBox).css('background-image');
            bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
            recipeCardInfo.link.push(link);
            recipeCardInfo.title.push(title);
            recipeCardInfo.img.push(bg);
            recipeCardInfo.length++;


          }catch (err){}
        }


        for(var i = 0; i < recipeCardInfo.length; i++)
        {
          var titleX = recipeCardInfo.title[i];
          var imgX = recipeCardInfo.img[i];
          if(imgX === '')
          {
            imgX = 'img/cooker.png';
          }
          var linkX = recipeCardInfo.link[i];
          //$scope.CurrentRecipe = linkX.substring(linkX.lastIndexOf("/")+1);
          var recipeInfo = {
            link: linkX,
            title: titleX,
            img: imgX
          };


          function goToRecipe( singleRecipeJSON ){
            return function(){
              //$scope.CurrentRecipeInfo = singleRecipeJSON;
              StorageService.add(singleRecipeJSON);
              $state.go("app.recipe",{});
            }
          }
          var px = '2%';
          var cardInfo = "<div class='w3-card-4' style='display: inline-block;margin-top: "+px+";margin-bottom: "+px+";margin-right: "+px+"; margin-left: "+px+";width:45%'>"+
            " <img src='"+imgX+"' alt='Norway' style='width:100%'>"+
            "<div class='w3-container w3-center'>"+
            "<p>"+titleX+"</p>"+
            "</div>"+
            "</div>";

          var newRecipeCard = $($.parseHTML(cardInfo));
          newRecipeCard.click(goToRecipe(recipeInfo));
          recipeListObject.append(newRecipeCard);
        }

        /*var iElement = angular.element( document.querySelector( 'body' ) );
         var svgTag = angular.element(text);
         angular.element(svgTag).appendTo(iElement[0]);*/
      });

    };
    var random_endpoint = "http://forkthecookbook.com/recipes/random";
    $scope.goto = function(pageId)
    {
      $state.go(pageId,{});
    };
      $scope.Analytics = function(ScreenName)
      {
        if(typeof analytics !== 'undefined') {
          // turn on debug mode
          // https://github.com/danwilson/google-analytics-plugin#javascript-usage
          analytics.debugMode();

          // start tracker
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/

          analytics.startTrackerWithId('UA-000000-01');

          // set user id
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/user-id

          analytics.setUserId($scope.userID);

          // track a view
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/screens
          // Hint: Currently no support for appName, appId, appVersion, appInstallerId
          //       If you need support for it, please create an issue on github:
          //       https://github.com/driftyco/ng-cordova/issues

          analytics.trackView(ScreenName);

          // set custom dimensions
          // https://developers.google.com/analytics/devguides/platform/customdimsmets

          analytics.addCustomDimension('dimension1', 'Level 1');

          // track event
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/events

          analytics.trackEvent('Videos', 'Video Load Time', 'Gone With the Wind', 100);

          // add transaction
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addTrans

          analytics.addTransaction('1234', 'Acme Clothing', '11.99', '5', '1.29', 'EUR');

          // add transaction item
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addItem

          analytics.addTransactionItem(
            '1234', 'Fluffy Pink Bunnies', 'DD23444', 'Party Toys', '11.99', '1', 'GBP'
          );

          // allow IDFA collection to enable demographics and interest reports
          // https://developers.google.com/analytics/devguides/collection/ios/v3/optional-features#idfa

          analytics.setAllowIDFACollection(true);

        }else {
          console.log("Google Analytics Unavailable");
        }

      };
    $scope.randoSearch = function () {

      $scope.Analytics("Random");
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
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
        var html = $($.parseHTML( result[0].data )).find( "#recipeContainer" )[0];
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
            var title = $(divRecipeBox).find(".recipe-title").text();
            var bg = $(divRecipeBox).css('background-image');
            bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
            recipeCardInfo.link.push(link);
            recipeCardInfo.title.push(title);
            recipeCardInfo.img.push(bg);
            recipeCardInfo.length++;


          }catch (err){}
        }
        var results = "";//"<h2>Photo Card</h2></br>";
        var recipeListObject = $('#recipesRand');
        recipeListObject.empty();
        for(var i = 0; i < recipeCardInfo.length; i++)
        {
          var titleX = recipeCardInfo.title[i];
          var imgX = recipeCardInfo.img[i];
          if(imgX === '')
          {
            imgX = 'img/cooker.png';
          }
          var linkX = recipeCardInfo.link[i];
          //$scope.CurrentRecipe = linkX.substring(linkX.lastIndexOf("/")+1);
          var recipeInfo = {
              link: linkX,
              title: titleX,
              img: imgX
          };


          function goToRecipe( singleRecipeJSON ){
            return function(){
              //$scope.CurrentRecipeInfo = singleRecipeJSON;
              StorageService.add(singleRecipeJSON);
              $state.go("app.recipe",{});
            }
          }var px = '2%';
          var cardInfo = "<div class='w3-card-4' style='display: inline-block;margin-top: "+px+";margin-bottom: "+px+";margin-right: "+px+"; margin-left: "+px+";width:45%'>"+
            " <img src='"+imgX+"' alt='Norway' style='width:100%'>"+
            "<div class='w3-container w3-center'>"+
            "<p>"+titleX+"</p>"+
            "</div>"+
            "</div>";

          var newRecipeCard = $($.parseHTML(cardInfo));
          newRecipeCard.click(goToRecipe(recipeInfo));
          recipeListObject.append(newRecipeCard);
        }

        $ionicLoading.hide();
      });

    };
    $scope.randoSearch();
  });
