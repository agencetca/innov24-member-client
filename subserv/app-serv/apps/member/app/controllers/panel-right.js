angular.module('innov24').
controller('panelRight', ['$scope', '$element', function($scope, $element) {
	
	var scope = this;

	scope.open = function() {
		$element[0].children[0].style.marginRight = 0;	
	}

	scope.close = function() {
		$element[0].children[0].style.marginRight = '-250px';	
	}

	$scope.$on('request-open-panel-right', function(events, args){
		scope.open();
	});


}]);
