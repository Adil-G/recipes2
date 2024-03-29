// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngStorage', 'starter.controllers', 'starter.main','ngRoute','ui.router'])

  .run(function($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function() {
      $rootScope.$on('$stateChangeSuccess', function () {
        if(typeof analytics !== 'undefined') {
          analytics.debugMode();
          analytics.startTrackerWithId("UA-xxxxxxxx-x");
          analytics.trackView($state.current.name);
        } else {
          console.log("Google Analytics Unavailable");
        }
      });
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function($routeProvider) {
    $routeProvider.when('/storage', { templateUrl: "templates/storage.html", controller: "MainCtrl" })
  })
  .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
   $httpProvider.defaults.withCredentials = true;
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'SearchCtrl'
          }
        }
      })

      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html'
          }
        }
      })
      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })

      .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',
            controller: 'PlaylistCtrl'
          }
        }
      })
    .state('app.recipe', {
      url: '/recipe/:link',
      views: {
        'menuContent': {
          templateUrl: 'templates/recipe.html',
          controller: 'RecipeCtrl'
        }
      }
    })
      .state('app.random', {
        url: '/random',
        views: {
          'menuContent': {
            templateUrl: 'templates/random.html',
            controller: 'RandomCtrl'
          }
        }
      })
      .state('app.navigation', {
        url: '/navigation',
        views: {
          'menuContent': {
            templateUrl: 'templates/categoryNav.html',
            controller: 'NavCtrl'
          }
        }
      })
      .state('app.navigationD', {
        url: '/navdessert',
        views: {
          'menuContent': {
            templateUrl: 'templates/categoryNavDessert.html',
            controller: 'NavCtrl'
          }
        }
      })
      .state('app.navigationM', {
        url: '/navmaindishes',
        views: {
          'menuContent': {
            templateUrl: 'templates/categoryNavMainDishes.html',
            controller: 'NavCtrl'
          }
        }
      })
      .state('app.category', {
        url: '/category/:cat',
        views: {
          'menuContent': {
            templateUrl: 'templates/category.html',
            controller: 'CatCtrl'
          }
        }
      })
      .state('app.category2', {
        url: '/category/:cat/:cat2',
        views: {
          'menuContent': {
            templateUrl: 'templates/category.html',
            controller: 'CatCtrl2'
          }
        }
      })
      .state('app.storage', {
        url: '/storage',
        views: {
          'menuContent': {
            templateUrl: 'templates/storage.html',
            controller: 'MainCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/random');
  })

