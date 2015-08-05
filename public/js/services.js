'use strict';
(function() {
  var rendererOptions = {
    draggable : true
  };
  var mapOptions = {
    zoom: 17
  };

  var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
  var directionsService = new google.maps.DirectionsService();

  //class to interact with google maps
  function GoogleMaps(map) {
    this.chosen = false;
    this.map = map; //instance of google maps container
    this.pos = null; //users current position
    this.dest = null; //randomly selected destination restaurant
  }

  GoogleMaps.prototype.calcRoute = function() {
    console.log('this.dest',this.dest);
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

  //creates a marker at result place
  function nearbySearchCompleted(results, status) {
    var i = Math.floor(Math.random() * results.length + 0);

    if (status == google.maps.places.PlacesServiceStatus.OK && !this.chosen) {
      this.dest = results[i];
      this.chosen = true;
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


  function MapService() {
    var service;
    var googleMaps = null; //instance of GoogleMaps(map)


    this.init = function(mapCanvasContainer, directionsPanelContainer) {

      var map = new google.maps.Map(mapCanvasContainer, mapOptions);
      googleMaps = new GoogleMaps(map);

      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(directionsPanelContainer);

      // Try HTML5 geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        googleMaps.pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var request = {
          location : googleMaps.pos,
          radius : '1000',
          keyword : 'restaurant'
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, nearbySearchCompleted.bind(googleMaps));
        map.setCenter(googleMaps.pos);
        }, function() {
          handleNoGeolocation(true);
        });
      } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
      }
    }
  }
  //.service calls new on class passed in.
  angular.module('App')
    .service('MapService', MapService);
})();