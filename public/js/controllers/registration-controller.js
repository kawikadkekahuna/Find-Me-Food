angular.module('App')
	.controller('RegistrationController', ['$scope','$http', function($scope,$http){
		$scope.registration = {
			username: 'username',
			password: 'password',
			email: 'john_doe@email.com'
		}

		$scope.userCreated;
		$scope.registerUser = function(username,email,password){

			console.log('email',email);
			$http.post('/register',{
				username:username,
				email:email,
				password:password
			}).then(function(created){
				// $scope.userCreated = created.data;
				console.log('created.data',created.data);
				if(created.data){
					$scope.createdUser = 'Successfully created user';
				}else{
					$scope.createdUser = 'Username taken!  Please enter another username';
				}
			});
		}

	}]);