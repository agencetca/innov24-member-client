angular.module('innov24')
.component('wallItem', {
	transclude: true,
	templateUrl: 'app/views/wall-item.html',
	controller: 'wallItem',
	bindings: {
		title: '@',
		desc: '@',
		content: '@',
		pubdate: '@',
		//array: '='
	}
});
