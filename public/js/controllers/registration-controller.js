angular.module('App')
	.controller('RegistrationController', ['$scope','$http', function($scope,$http){
		$scope.registration = {
			username: 'username',
			password: 'password',
			email: 'john_doe@email.com'
		}

		$scope.registerUser = function(username,email,password){

			console.log('email',email);
			$http.post('/register',{
				username:username,
				email:email,
				password:password
			}).then(function(req){
				console.log('req',req);
			})
		}

	}]);