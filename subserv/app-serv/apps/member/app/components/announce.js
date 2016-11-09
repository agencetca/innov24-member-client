angular.module('innov24')
.component('announce', {
	transclude: true,
	templateUrl: 'app/views/announce.html',
	controller: 'announce',
	bindings: {
		//string: '@',
		//array: '='
	}
});
