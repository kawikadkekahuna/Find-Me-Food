'use strict';

angular.module('App')
	.controller('MapController', ['$scope','MapService',function($scope, MapService){
		MapService.init(angular.element('#map-canvas').get(0), angular.element('#directionsPanel').get(0));


	}]);