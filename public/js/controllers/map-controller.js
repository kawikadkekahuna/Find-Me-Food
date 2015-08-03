'use strict';

angular.module('App')
<<<<<<< HEAD
	.controller('MapController', ['$scope','MapService',function($scope, MapService){
		MapService.init(angular.element('#map-canvas').get(0), angular.element('#directionsPanel').get(0));

=======
	.controller('MapController', ['$scope','MapService',function($scope,MapService){
		$scope.load = MapService.init();
		
>>>>>>> passport_config
	}]);