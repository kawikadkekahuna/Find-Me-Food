'use strict';

angular.module('App')
	.controller('FavoritesController', ['$scope','MapService','$http',function($scope,MapService,$http){
    $scope.addFavorite = function(){

        $http.get('/api/users/verify').then(function(res){
            console.log('res.authenticated',res);
            if(!res.data.authenticated){
                console.log('denied');
                return;
            }
            console.log(sessionStorage.getItem('user_id'));

        })
    }



	}]);