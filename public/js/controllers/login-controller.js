angular.module('App')
	.controller('LoginController', ['$scope','$http', function($scope,$http){

		$scope.loginUser = function(username,password){
			$http.post('/login',{
				username:username,
				password:password
			}).then(function(created){
				console.log('created',created);
			});

		}
	}]);
