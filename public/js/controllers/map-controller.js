'use strict';

angular.module('App')
  .controller('MapController', ['$scope', 'MapService','$http', function($scope, MapService,$http) {
    MapService.init(angular.element('#map-canvas').get(0), angular.element('#directionsPanel').get(0));
    MapService.loaded(function() {
      $scope.$apply(function() {
        $scope.restaurantName = 'How about ' + MapService.getLocationName() + '?';
      });
    });

    $scope.nextRestaurant = function() {
      MapService.getNextRestaurant();
      $scope.restaurantName = 'How about ' + MapService.getLocationName() + '?';

    };

    $scope.updateName = function(name) {
      $scope.restaurantName = name;
    }
    $scope.addFavorite = function() {
      $http.get('/api/users/verify').then(function(res) {
        if (!res.data.authenticated) {
          return;
        }
        var googleLocation = MapService.getGoogleLocation();
        console.log('googleLocation', googleLocation);
        var favorites = {
          id: sessionStorage.getItem('user_id'),
          googleLocation: MapService.getGoogleLocation()
        }
        console.log('favorites', favorites);

        $http.post('/api/users/add-favorite', {
          favorites: favorites
        }).then(function(res) {
          console.log('res', res);
        });
      });
    }

    $scope.randomizeFavorite = function() {


      $http.post('/api/users/randomize-favorites', {
        id: sessionStorage.getItem('user_id')
      }).then(function(favoriteLocations) {
        console.log('favoriteLocations.data', favoriteLocations.data);
        MapService.randomizeFavoriteRestuarant(favoriteLocations.data);

      }).then(function() {
        $scope.restaurantName = 'How about ' + MapService.getLocationName() + '?';
      })

    }



  }]);