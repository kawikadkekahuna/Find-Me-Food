angular.module('App')
	.controller('LoginController', ['$scope', '$http', function($scope, $http) {

		$scope.loginUser = function(username, password) {
			$http.post('/api/users/login', {
				username: username,
				password: password
			}).then(function(res) {

				if (!res.data) {
					$scope.invalidLogin = 'Credentials not in the system';
				}else{
					sessionStorage.setItem('user_id', res.data.user._id);
				}

			});

		}
	}]);