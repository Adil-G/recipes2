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
  .controller( "MainCtrl", function ($scope, StorageService, $state) {
      console.log("in history tab");
      $scope.things = StorageService.getAll();
      $scope.add = function (newThing) {
        StorageService.add(newThing);
      };
      $scope.remove = function (thing) {
        StorageService.remove(thing);
      };
      $scope.printThings = function()
        {

        }
    var recipeCardInfoList = StorageService.getAll();
    console.log(recipeCardInfoList);
    var results = "</br><h4>Results: </h4>";
    var recipeListObject = $('#recipesHistory');
    recipeListObject.empty();
    for(var i = (recipeCardInfoList.length -1); i >=0; i--)
    {
      var recipeCardInfo = recipeCardInfoList[i];
      var titleX = recipeCardInfo.title;
      var imgX = recipeCardInfo.img;
      if(imgX === '')
      {
        imgX = '../img/cooker.png';
      }
      var linkX = recipeCardInfo.link;
      //$scope.CurrentRecipe = linkX.substring(linkX.lastIndexOf("/")+1);
      var recipeInfo = {
        link: linkX,
        title: titleX,
        img: imgX
      };


      function goToRecipe( singleRecipeJSON ){
        return function(){
          console.log('HEYO');
          //$scope.CurrentRecipeInfo = singleRecipeJSON;
          StorageService.add(singleRecipeJSON);
          console.log(JSON.stringify(singleRecipeJSON));
          $state.go("app.recipe",{});
        }
      }
      var cardInfo = "<div class='w3-card-4' style='display: inline-block;margin-top: 20px;margin-bottom: 20px;margin-right: 30px; margin-left: 16px;width:20%'>"+
        " <img src='"+imgX+"' alt='Norway' style='width:100%'>"+
        "<div class='w3-container w3-center'>"+
        "<p>"+titleX+"</p>"+
        "</div>"+
        "</div>";

      var newRecipeCard = $($.parseHTML(cardInfo));
      newRecipeCard.click(goToRecipe(recipeInfo));
      recipeListObject.append(newRecipeCard);
    }


})

  .controller('StorageService', function($scope, $stateParams, $localStorage) {

  })
  .controller('RecipeCtrl', function($scope, $stateParams, $http, $q, StorageService) {
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
    }catch (err){}
    try{
      $(".image").css("background-image", "url('"+recipeImageA+"')");
    }catch (err)
    {

    }

    if(fullLink.includes("http://opensourcecook.com"))
    {
      console.log("entered recipe...");



      //console.log($scope.CurrentRecipe);
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
          //var recipeTitle = $($(jqueryHTML.find('.content-title h1')[0]).remove('small')).text();

          // $scope.add(recipeInfo);
          // var recipeImage = 'http://media.forkthecookbook.com/banana-hemp-granola-a26ef_MAIN.jpg'
          //console.log("recipe image = "+recipeImage);
          try {
            var instructionsChunks = jqueryHTML.find('#content ol');
            var preparationsDiv = $($('#prep').find('.cont_text_det_preparation')[0]);
            preparationsDiv.empty();
            var lines = $(instructionsChunks[0]).find('li');
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

            }
            console.log();
          }catch (err)
          {

          }

          $("#prep_tab").addClass('button-clicked');
          $("#ingredient_tab").removeClass('button-clicked');
          //e.preventDefault();
          var content = $('#prep').html();
          $('#pane').empty().append(content);


          var table = jqueryHTML.find("#content p:contains('Ingredients:')")[0];
          $("#ingredient").empty();
          $("#ingredient").append("<link rel='stylesheet' href='http://static.forkthecookbook.com/css/forkthecookbook.min.css'>");
          $("#ingredient").append($(table).prop('outerHTML'));



          var text = "";
        }
        // recipe-instructions
      );
    }
    else {
      console.log("entered recipe...");



      //console.log($scope.CurrentRecipe);
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
        //var recipeTitle = $($(jqueryHTML.find('.content-title h1')[0]).remove('small')).text();

         // $scope.add(recipeInfo);
         // var recipeImage = 'http://media.forkthecookbook.com/banana-hemp-granola-a26ef_MAIN.jpg'
          //console.log("recipe image = "+recipeImage);

          var instructionsChunks = jqueryHTML.find('.recipe-instructions');
          var preparationsDiv = $($('#prep').find('.cont_text_det_preparation')[0]);

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

            }
            console.log();
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
          //$(table).remove($(instructionsHeader));
          //console.log(instructionsHeader);
          $("#ingredient").append("<link rel='stylesheet' href='http://static.forkthecookbook.com/css/forkthecookbook.min.css'>");
          $("#ingredient").append($(table).prop('outerHTML'));
          $("#ingredient .table thead th:eq(" + index + ")").remove();
          $("#ingredient .table .recipe-instructions").remove();
          //console.log( $(table).prop('outerHTML'));
          /*for (var i = 0; i < 3; i++) {
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
          }*/
          var text = "";
        }
        // recipe-instructions
      );
    }
  })
  .controller('SearchCtrl', function($scope, $stateParams, $http, $q, StorageService, $state) {
    $scope.CookBookURL =
      "http://forkthecookbook.com/search-recipes";

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
        console.log("Auth.signin.success!");
        //console.log(result[0].data);
        var html = $($.parseHTML( result[0].data )).find( "#recipeContainer" )[0];
        var htmlOpenSourceCookbook = $($.parseHTML( result[1].data ));
        var postList = htmlOpenSourceCookbook.find( "h1[id*='post']" );
        var listOfImages = [];

        for(var j = 0; j < postList.length;j++)
        {
          var posts = postList[j];
          console.log("opensourcecookbook: "+posts);
          console.log($(posts).text());
          console.log($($(posts).find("a")[0]).attr("href"));
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
            || recipeImage === undefined || recipeImage === null)
            {
              recipeImage = '../img/cooker.png';
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
            if(imgX === '')
            {
              imgX = '../img/cooker.png';
            }
            var linkX = cardJSON.link[i];
            //$scope.CurrentRecipe = linkX.substring(linkX.lastIndexOf("/")+1);
            var recipeInfo = {
              link: linkX,
              title: titleX,
              img: imgX
            };


            function goToRecipe( singleRecipeJSON ){
              return function(){
                console.log('HEYO');
                //$scope.CurrentRecipeInfo = singleRecipeJSON;
                StorageService.add(singleRecipeJSON);
                console.log(JSON.stringify(singleRecipeJSON));
                $state.go("app.recipe",{});
              }
            }
            var cardInfo = "<div class='w3-card-4' style='display: inline-block;margin-top: 20px;margin-bottom: 20px;margin-right: 30px; margin-left: 16px;width:20%'>"+
              " <img src='"+imgX+"' alt='X' style='width:100%'>"+
              "<div class='w3-container w3-center'>"+
              "<p>"+titleX+"</p>"+
              "</div>"+
              "</div>";

            var newRecipeCard = $($.parseHTML(cardInfo));
            newRecipeCard.click(goToRecipe(recipeInfo));
            recipeListObject.append(newRecipeCard);
          }

        });
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


        for(var i = 0; i < recipeCardInfo.length; i++)
        {
          var titleX = recipeCardInfo.title[i];
          var imgX = recipeCardInfo.img[i];
          if(imgX === '')
          {
            imgX = '../img/cooker.png';
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
              console.log('HEYO');
              //$scope.CurrentRecipeInfo = singleRecipeJSON;
              StorageService.add(singleRecipeJSON);
              console.log(JSON.stringify(singleRecipeJSON));
              $state.go("app.recipe",{});
            }
          }
          var cardInfo = "<div class='w3-card-4' style='display: inline-block;margin-top: 20px;margin-bottom: 20px;margin-right: 30px; margin-left: 16px;width:20%'>"+
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
  .controller('RandomCtrl', function($scope, $stateParams, $http, $q,  $state, StorageService) {
    var random_endpoint = "http://forkthecookbook.com/recipes/random";
    $scope.goto = function(pageId)
    {
      $state.go(pageId,{});
    };
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
        var recipeListObject = $('#recipesRand');
        recipeListObject.empty();
        for(var i = 0; i < recipeCardInfo.length; i++)
        {
          var titleX = recipeCardInfo.title[i];
          var imgX = recipeCardInfo.img[i];
          if(imgX === '')
          {
            imgX = '../img/cooker.png';
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
              console.log('HEYO');
              //$scope.CurrentRecipeInfo = singleRecipeJSON;
              StorageService.add(singleRecipeJSON);
              console.log(JSON.stringify(singleRecipeJSON));
              $state.go("app.recipe",{});
            }
          }
          var cardInfo = "<div class='w3-card-4' style='display: inline-block;margin-top: 20px;margin-bottom: 20px;margin-right: 30px; margin-left: 16px;width:20%'>"+
            " <img src='"+imgX+"' alt='Norway' style='width:100%'>"+
            "<div class='w3-container w3-center'>"+
            "<p>"+titleX+"</p>"+
            "</div>"+
            "</div>";

          var newRecipeCard = $($.parseHTML(cardInfo));
          newRecipeCard.click(goToRecipe(recipeInfo));
          recipeListObject.append(newRecipeCard);
        }

        //console.log(text);
       // $('#recipesRand').empty().append(recipeListObject);

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
