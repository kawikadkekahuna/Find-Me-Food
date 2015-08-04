var App = angular.module('App', ['ui.router']);

App.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.otherwise('views/404.html');
	$stateProvider
		.state('home', {
			url:'/',
			templateUrl: 'views/landing.html',
			controller:'RegistrationController'
		})
		.state('home.login',{
			views:{
				'login':{
					templateUrl:'views/login.html'
				}
			}
		})
		.state('map',{
			url:'/map',
			templateUrl: 'views/map.html',
			controller: 'MapController'
		});
});

	// .config(['',function($stateProvider, $urlRouterProvider) {
	// 	$urlRouterProvider.otherwise('views/404.html');
	// 	$stateProvider
	// 		.state('/home', {
	// 			url:'/',
	// 			templateUrl: 'views/landing.html',
	// 			controller:'RegistrationController'
	// 		})
	// 		.state('/map',{
	// 			url:'/map',
	// 			templateUrl: 'views/map.html',
	// 			controller: 'MapController'
	// 		});

	// }]);