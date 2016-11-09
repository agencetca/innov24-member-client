angular.module('innov24').
component('navi', {
    transclude : true,
    templateUrl : 'app/views/navi.html',
    controller : 'navi',
    bindings: {
    	menu: '='
    },
});
