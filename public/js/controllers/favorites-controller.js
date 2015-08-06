'use strict';

angular.module('App')
    .controller('FavoritesController', ['$scope', 'MapService', '$http', function($scope, MapService, $http) {
        $scope.addFavorite = function() {
            $http.get('/api/users/verify').then(function(res) {
                if (!res.data.authenticated) {
                    return;
                }
                var googleLocation = MapService.getGoogleLocation();
                console.log('googleLocation',googleLocation);
                var favorites = {
                    id: sessionStorage.getItem('user_id'),
                    googleLocation: MapService.getGoogleLocation()
                }

                $http.post('/api/users/add-favorite', {
                    favorites: favorites
                }).then(function(res) {
                    console.log('res', res);
                });
            });
        }

        $scope.randomizeFavorite = function(){
 

            $http.post('/api/users/randomize-favorites',{
                id: sessionStorage.getItem('user_id')
            }).then(function(favoriteLocations){
                console.log('favoriteLocations.data',favoriteLocations.data);
                MapService.randomizeFavoriteRestuarant(favoriteLocations.data)
            })

        }


    }]);