'use strict';

angular.module('App')
	.controller('MapController', ['$scope','MapService',function($scope,MapService){
		$scope.load = MapService.init();
		
	}])