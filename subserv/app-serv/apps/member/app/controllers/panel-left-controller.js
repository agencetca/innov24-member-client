angular.module('innov24').
controller('panelLeftController', ['$rootScope', function($rootScope) {
	
	var scope = this;

	scope.action = function() {
		$rootScope.$broadcast('request-toggle-panel-left');
	}


}]);
