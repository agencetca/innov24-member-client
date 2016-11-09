angular.module('innov24').
controller('panelLeft', ['$scope', '$element', function($scope, $element) {
	
	var scope = this;

	scope.visible;

	scope.open = function() {
		$element[0].children[0].style.marginLeft = '-250px';	
		scope.visible = true;
	}

	scope.close = function() {
		$element[0].children[0].style.marginLeft = '-500px';	
		scope.visible = false;
	}

    scope.close();

	scope.toggle = function() {
		(!!scope.visible) ? scope.close() : scope.open();
	}

	$scope.$on('request-toggle-panel-left', function(events, args){
		scope.toggle();
	});

	scope.tools = [{'name':'publish'}];

}]);
