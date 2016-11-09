angular.module('innov24').
controller('env', ['$scope', '$location', 'AuthService', 'taOptions', 'RESTService', function($scope, $location, AuthService, taOptions, rest) {
	
	var scope = $scope;

	scope.name = 'Environment test';

	$scope.eventSources = [];

	$scope.alertEventOnClick = function() {
		alert('clicked');
	}

	$scope.alertOnDrop = function() {
		alert('dropped');
	}

	$scope.alertOnResize = function() {
		alert('resized');
	}

	//$scope.user = 'wait...';
	//AuthService.profile(function(r) {
//		$scope.user = r;
	//});

	$scope.tools = [{publish:''}];

  taOptions.toolbar = [
      //['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
      ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
      //['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
      ['html', 'insertImage','insertLink', 'insertVideo', 'wordcount', 'charcount']
  ];

    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };


	$scope.new = {};

	$scope.publish = function(e) {

		e.preventDefault();

        var jqxhr = $.post( "http://localhost:9090", $scope.new, function(data) {
            $location.path('/news');
        })
        .done(function() {
            $scope.$apply();
        })
        .fail(function(e) {
            //alert( "error" + JSON.stringify(e) );
        })
        .always(function() {
            //alert( "finished" );
        });
 
// Perform other work here ...

// Set another completion function for the request above
//jqxhr.always(function() {
//    alert( "second finished" );
//});

        //rest.post('http://localhost:9090', {'toto':'tutu'}, function(data) {
        //    alert('ok');
        //});
        
        //console.log('end');

		//if(!localStorage.getItem('published')) 
	    //localStorage.setItem('published', JSON.stringify([]));

		//var published = JSON.parse(localStorage.getItem('published'));

		//published.push($scope.new);
		//localStorage.setItem('published', JSON.stringify(published));

		//alert('published locally');

	}



}]);
