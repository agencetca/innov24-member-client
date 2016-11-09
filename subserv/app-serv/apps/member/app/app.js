'use strict';

// declare top-level module which depends on filters,and services
var myApp = angular.module('innov24',
    [   'myApp.filters',
        'myApp.directives', // custom directives
        'ngGrid', // angular grid
        'ui', // angular ui
        'ngSanitize', // for html-bind in ckeditor
        'ui.ace', // ace code editor
        //'ui.bootstrap', // jquery ui bootstrap
        '$strap.directives', // angular strap
        'ngRoute',
        'ngCookies',
        'textAngular',
        //'videoChat'
    ]);


var filters = angular.module('myApp.filters', []);
var directives = angular.module('myApp.directives', []);

// bootstrap angular
myApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    // TODO use html5 *no hash) where possible
    // $locationProvider.html5Mode(true);

    $routeProvider.when('/', {
        templateUrl:'pages/home.html',
	    controller:'env'
    });

    $routeProvider.when('/post/:tool', {
	    controller:'env'
    });

    $routeProvider.when('/tools/credit', {
        templateUrl: function(params) {
		return 'tools/'+'credit'+'.html';
	},
	controller:'env'
    });

    $routeProvider.when('/tools/chat', {
        templateUrl: function(params) {
		return 'tools/'+'chat/index'+'.html';
	},
	controller:'env'
    });

    $routeProvider.when('/tools/:tool', {
        templateUrl: function(params) {
		return 'tools/'+params.tool+'.html';
	},
	controller:'env'
    });

    $routeProvider.when('/:page', {
        templateUrl:function(params) {
		return 'pages/'+params.page+'.html';
	},
	controller:'env'

    });


    // by default, redirect to site root
    //$routeProvider.otherwise({
    //    redirectTo:'/'
    //});

}]);

// this is run after angular is instantiated and bootstrapped
myApp.run(function ($rootScope, $location, $http, $timeout, AuthService, RESTService) {

    // *****
    // Eager load some data using simple REST client
    // *****

    $rootScope.restService = RESTService;

    // async load constants
    $rootScope.constants = [];
    $rootScope.restService.get('config/main.json', function (data) {
            $rootScope.constants = data;
        }
    );

    // *****
    // Initialize authentication
    // *****
    //$rootScope.authService = AuthService;

    // text input for login/password (only)
    //$rootScope.loginInput;
    //$rootScope.passwordInput;

    //$rootScope.$watch('authService.authorized()', function () {

        // if never logged in, do nothing (otherwise bookmarks fail)
        //if ($rootScope.authService.initialState()) {
            // we are public browsing
            //return;
        //}

        // instantiate and initialize an auth notification manager
        //$rootScope.authNotifier = new NotificationManager($rootScope);

        // when user logs in, redirect to home
        //if ($rootScope.authService.authorized()) {
            //$location.path("/");
            //$rootScope.authNotifier.notify('information', 'Welcome ' + $rootScope.authService.currentUser() + "!");
	    //$timeout(function() {
		//location.reload();
	    //}, 1000);
        //}

        // when user logs out, redirect to home
        //if (!$rootScope.authService.authorized()) {
            //$location.path("/");
            //$rootScope.authNotifier.notify('information', 'Thanks for visiting.  You have been signed out.');
	    //$timeout(function() {
		//location.reload();
	    //}, 1000);
        //}

    //}, true);

    // TODO move this out to a more appropriate place
    $rootScope.faq = [
        {key: "What is Angular-Enterprise-Seed?", value: "A starting point for server-agnostic, REST based or static/mashup UI."},
        {key: "What are the pre-requisites for running the seed?", value: "Just an HTTP server.  Add your own backend."},
        {key: "How do I change styling (css)?", value:  "Change Bootstrap LESS and rebuild with the build.sh script.  This will update the appropriate css/image/font files."}
    ];


});
