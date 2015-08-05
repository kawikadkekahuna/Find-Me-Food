'use strict';
(function() {
  var rendererOptions = {
    draggable : true
  };
  var mapOptions = {
    zoom: 17,
    disableDefaultUI : true
  };

  var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
  var directionsService = new google.maps.DirectionsService();

  //class to interact with google maps
  function GoogleMaps(map) {
    this.map = map; //instance of google maps container
    this.pos = null; //users current position
    this.allResults = [];
    this.dest = null; //randomly selected destination restaurant
  }

  GoogleMaps.prototype.calcRoute = function() {
    var request = {
      origin : this.pos,
      destination: this.dest.geometry.location,
      travelMode : google.maps.DirectionsTravelMode.WALKING
    };
    directionsService.route(request, function(response, status) {
      if(status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
  }

  function nearbySearchCompleted(results, status) {
    var i = Math.floor(Math.random() * results.length);

    if (status == google.maps.places.PlacesServiceStatus.OK) {
      this.allResults = results;
      this.dest = results[i];
      this.calcRoute();
    }
  }

  GoogleMaps.prototype.handleNoGeolocation = function(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
      map: this.map,
      position: new google.maps.LatLng(60, 105),
      content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
  }

  GoogleMaps.prototype.handleNoRestaurants = function() {
    var content = 'Sorry that is all the restaurants in your location';
    var options = {
      map : this.map,
      position : this.pos,
      content : content
    }

    var infowindow = new google.maps.InfoWindow(options);
    this.map.setCenter(options.position);
  }


  function MapService() {
    var service;
    var googleMaps = null; //instance of GoogleMaps(map)
    this.loadComplete = null;
    var self = this;

    this.init = function(mapCanvasContainer, directionsPanelContainer) {
      var map = new google.maps.Map(mapCanvasContainer, mapOptions);
      googleMaps = new GoogleMaps(map);
      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(directionsPanelContainer);
      service = new google.maps.places.PlacesService(map);


      var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      var searchBox = new google.maps.places.SearchBox(input);
      searchBox.bindTo('bounds', map);

      // Listen for the event fired when the user selects an item from the
      // pick list. Retrieve the matching places for that item.
      google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }
        // Try HTML5 geolocation
        if (navigator.geolocation) {

          googleMaps.pos = new google.maps.LatLng(places[0].geometry.location.G, places[0].geometry.location.K);
          var request = {
            location : googleMaps.pos,
            radius : '1000',
            keyword : 'restaurant'
          };
          service.nearbySearch(request, function(results, status) {

            nearbySearchCompleted.call(googleMaps, results, status);

            self.dest = googleMaps.dest;
            if (self.loadComplete !== null) {
              self.loadComplete();

            }
          });
          map.setCenter(googleMaps.pos);

        } else {
          // Browser doesn't support Geolocation
          handleNoGeolocation(false);
        }
        return;
      });

      // Try HTML5 geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          googleMaps.pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          var request = {
            location : googleMaps.pos,
            radius : '1000',
            keyword : 'restaurant'
          };

          service.nearbySearch(request, function(results, status) {
            nearbySearchCompleted.call(googleMaps, results, status);

            if (self.loadComplete !== null) {
              self.loadComplete();

            }
          });
          map.setCenter(googleMaps.pos);
        }, function() {
          handleNoGeolocation(true);
        });
      } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
      }
    }



    this.getLocationName = function() {
      return googleMaps.dest.name;
    }

    this.loaded = function(cb) {
      this.loadComplete = cb;
    }
    
    this.getGoogleLocation = function() {
      return googleMaps.dest;
    }

    this.getNextRestaurant = function() {
      var restaurantArray = googleMaps.allResults;
      var i = Math.floor(Math.random() * restaurantArray.length);

      if (restaurantArray.length > 0) {
        googleMaps.dest = restaurantArray.splice(i, 1)[0];
        googleMaps.calcRoute();
        googleMaps.map.setCenter(googleMaps.pos);

      } else {
        googleMaps.handleNoRestaurants();
      }
    }
  }
  //.service calls new on class passed in.
  angular.module('App')
    .service('MapService', MapService);
})();
