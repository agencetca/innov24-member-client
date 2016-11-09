'use strict';

angular.module('path').directive('pathRegistration', [function() {
  return {
      restrict: 'AE',
      templateUrl: 'views/registration.html',
      controller: 'RegistrationCtl'
  };
}]);
