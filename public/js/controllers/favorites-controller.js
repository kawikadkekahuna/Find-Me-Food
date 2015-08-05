'use strict';

angular.module('App')
	.controller('FavoritesController', ['$scope','MapService','$http',function($scope,MapService,$http){
        $scope.addFavorite = function(){
        $http.get('/api/users/verify').then(function(res){
            if(!res.data.authenticated){
                console.log('denied');
                return;
            }
            var favorites = {
                id: sessionStorage.getItem('user_id'),
                googleLocation: MapService.getGoogleLocation()
            }

            $http.post('/api/users/add-favorite',{
                favorites: favorites
            }).then(function(res){
                console.log('res',res);
            });
        });
        }


	}]);