'use strict';

// Declare app level module which depends on views, and components
angular.module('path', [
  'ngRoute'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.when('/',{templateUrl: '/pages/home.html'});
  $routeProvider.when('/register',{templateUrl: '/pages/register.html'});
  $routeProvider.when('/login',{templateUrl: '/pages/login.html'});
  $routeProvider.when('/awaiting',{templateUrl: '/pages/await.html'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
