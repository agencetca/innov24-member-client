angular.module('innov24')
.component('wipItem', {
	transclude: true,
	templateUrl: 'app/views/wip-item.html',
	controller: 'wip',
	bindings: {
		//string: '@',
		//array: '='
	}
});
