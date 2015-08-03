angular.module('App')
	.controller('RegistrationController', ['$scope', function($scope){
		$scope.registration = {
			username: 'username',
			password: 's',
			email: 'john_doe@email.com'
		}
	}]);