'use strict';

// simple stub that could use a lot of work...
myApp.factory('RESTService',
    function ($http) {
        return {
            get:function (url, callback) {
                return $http({method:'GET', url:url}).
                    success(function (data, status, headers, config) {
                        if(callback) callback(data);
                        //console.log(data.json);
                    }).
                    error(function (data, status, headers, config) {
                        alert("failed to retrieve data");
                    });
            },

            post:function (url, jsonObject, callback) {

		var POSTdata = '';
		
		for (var k in jsonObject) {
			POSTdata += k+'='+jsonObject[k]+'&'	
		}

            return $http({
			method:'POST', 
			url:url,
			data: POSTdata.slice(0,-1),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		    }).
                    then(function (data, status, headers, config) {
                        if(callback) callback(data);
                    }, function (data, status, headers, config) {
                        alert("failed to retrieve data");
                    });
            }

        };
    }
);


// simple auth service that can use a lot of work... 
myApp.factory('AuthService',
    ['RESTService', function (RESTService) {
        var currentUser = null;
        var authorized = true;

        // initMaybe it wasn't meant to work for mpm?ial state says we haven't logged in or out yet...
        // this tells us we are in public browsing
        var initialState = false;

        return {
            initialState:function () {
                return initialState;
            },
            login:function (name, password) {

		RESTService.post('/login', {
			username : name,
			password : password
		});

                currentUser = name;
                initialState = false;
                authorized = true;
            },
            profile:function (callback) {

		RESTService.get('/user', callback);
            },
            logout:function () {

		RESTService.get('/logout');

                currentUser = null;
                authorized = false;
            },
            isLoggedIn:function () {
                return authorized;
            },
            currentUser:function () {
                return currentUser;
            },
            authorized:function () {
                return authorized;
            }
        };
    }]
);
