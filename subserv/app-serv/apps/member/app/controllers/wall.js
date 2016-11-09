angular.module('innov24').
controller('wall', ['$scope', function($scope) {
	
	//var published = localStorage.getItem('published');
	//try {
		//published = JSON.parse(published);
		//$scope.items = published;
	//} catch(e) {
	//	$scope.items = [];
	//}
    //
    //

    var jqxhr = $.get( "http://localhost:9090/", function(data) {
        $scope.items = data.reverse();
    })
    .done(function() {
        //alert( "second success" );
    })
    .fail(function() {
        //alert( "error" );
    })
    .always(function() {
        //alert( "finished" );
    });
// Perform other work here ...
  
  // Set another completion function for the request above

}]);
