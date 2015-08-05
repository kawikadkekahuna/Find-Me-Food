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
  var chosen = false;

  function calcRoute(pos, dest) {
    dest = dest.geometry.location;
    var request = {
      origin : pos,
      destination: dest,
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

    if (status == google.maps.places.PlacesServiceStatus.OK && !chosen) {
      var dest = results[i];
      chosen = true;
      calcRoute(this.pos, dest);
    }
  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
      map: map,
      position: new google.maps.LatLng(60, 105),
      content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
  }


  function MapService() {
    var map;
    var service;
    var infowindow;


    this.init = function(mapCanvasContainer, directionsPanelContainer) {

      map = new google.maps.Map(mapCanvasContainer, mapOptions);
      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(directionsPanelContainer);

      // Try HTML5 geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position, results, status) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var request = {
          location : pos,
          radius : '1000',
          keyword : 'restaurant'
        };
        var mapPosition = { map : map,
                    pos : pos
                  };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, nearbySearchCompleted.bind(mapPosition));
        map.setCenter(pos);
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