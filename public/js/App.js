angular.module('App', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		
		$routeProvider
			.when('/', {
				templateUrl: 'views/landing.html',
				controller:'RegistrationController'
			})
			.when('/map',{
				templateUrl: 'views/map.html',
				controller: 'MapController'
			})
			.otherwise({
				templateUrl: 'views/404.html'
			});

	}]);