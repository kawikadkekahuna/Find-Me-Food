var App = angular.module('App', ['ui.router']);

App.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$urlRouterProvider.otherwise('404.html');
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'views/landing.html',
			controller: 'RegistrationController'
		})
		.state('home.login', {
			views: {
				'login': {
					templateUrl: 'views/login.html'
				}
			}
		})
		.state('home.register', {
			views: {
				'register': {
					templateUrl: 'views/register.html'
				}
			}
		})
		.state('register', {
			url: '/register',
			templateUrl: 'views/landing.html'
		})
		.state('favorites', {
			url: '/favorites',
			templateUrl: 'views/favorites.html'
		})
		.state('map', {
			url: '/map',
			templateUrl: 'views/map.html'
		})
		.state('404', {
			url: '/404',
			templateUrl: 'views/404.html',
		});


	$locationProvider.html5Mode(true)
});

App.run(function($rootScope,$location,$http){
	$rootScope.$on('$stateChangeSuccess',function(event,next,current){
		$http.get('/api/users/verify').then(function(res){
			if(res.data.authenticated === true){
				console.log('user_authenticated');
			}else{
				console.log('user not authenticated');
			}
		})
	})
})

