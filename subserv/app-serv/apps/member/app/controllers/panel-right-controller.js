angular.module('innov24').
controller('panelRightController', ['$scope','$rootScope', function($scope, $rootScope) {
	
	var scope = this;

	$scope.action = function() {
alert();
		$rootScope.$broadcast('request-open-panel-right');
	}


}]);
