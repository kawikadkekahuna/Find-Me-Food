'use strict';

angular.module('App')
	.controller('MapController', ['$scope','MapService',function($scope, MapService){
		MapService.init(angular.element('#map-canvas').get(0), angular.element('#directionsPanel').get(0));
    MapService.loaded(function(){
      $scope.$apply(function() {
        $scope.restaurantName = "How about " + MapService.getLocationName() + "?";
      });
    });
    $scope.nextRestaurant = function(){
      MapService.getNextRestaurant(angular.element('#map-canvas').get(0), angular.element('#directionsPanel').get(0));
    }
	}]);