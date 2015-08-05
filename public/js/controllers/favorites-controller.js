'use strict';

angular.module('App')
	.controller('FavoritesController', ['$scope','MapService','$http',function($scope,MapService,$http){
    $scope.addFavorite = function(){
    	$http.post('/api/users/add-favorite',{
    		location : MapService.getGoogleLocation()
    	}).then(function(res){
    		console.log('res',res);
    	})
    }



	}]);