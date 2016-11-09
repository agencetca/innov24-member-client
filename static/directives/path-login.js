'use strict';

angular.module('path').directive('pathLogin', [function() {
  return {
      restrict: 'AE',
      templateUrl: 'views/login.html',
      controller: 'RegistrationCtl'
  };
}]);
