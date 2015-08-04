angular.module('App')
	.controller('LoginController', ['$scope', function($scope){
		$scope.login = {
			username: 'username',
			password: 'password',
		}

		$scope.loginUser = function(){

			console.log('clicked');

		}
	}]);
