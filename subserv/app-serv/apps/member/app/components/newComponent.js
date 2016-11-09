angular.module('innov24')
.component('myComponent', {
	transclude: true,
	templateUrl: 'app/views/file.html',
	controller: 'myComponent',
	bindings: {
		//string: '@',
		//array: '='
	}
});
