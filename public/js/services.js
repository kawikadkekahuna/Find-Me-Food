'use strict';
(function() {
  var rendererOptions = {
    draggable : true
  };
  var mapOptions = {
    zoom: 17,
  };
  var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
  var directionsService = new google.maps.DirectionsService();
  var chosen = false;

  function computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value;
    }
    total = total / 1000.0;
    return total + 'km';
  }

  function calcRoute(pos, dest) {
    console.log('dest',dest.name);
    // dest = nextLocation.geometry.location || dest.geomeyr
    var request = {
      origin : pos,
      destination: dest.geometry.location,
      travelMode : google.maps.DirectionsTravelMode.WALKING
    };
    directionsService.route(request, function(response, status) {
      if(status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
  }

  function createMarker(place, map) {
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: {
        // Star
        path: 'M 0,-24 6,-7 24,-7 10,4 15,21 0,11 -15,21 -10,4 -24,-7 -6,-7 z',
        fillColor: '#ffff00',
        fillOpacity: 1,
        scale: 1/4,
        strokeColor: '#bd8d2c',
        strokeWeight: 1
      }
    });
  }

  //creates a marker at result place
  function nearbySearchCompleted(results, status) {
    var i = Math.floor(Math.random() * results.length + 0);

    if (status == google.maps.places.PlacesServiceStatus.OK && !chosen) {
      var dest = results[i];
      createMarker(dest, this.map);
      chosen = true;
      calcRoute(this.pos, dest);
    }
  }


  function MapService() {
    var map;
    var service;
    var infowindow;


    this.init = function(mapCanvasContainer, directionsPanelContainer) {

      map = new google.maps.Map(mapCanvasContainer, mapOptions);
      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(directionsPanelContainer);

      google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {

        var totalDistance = computeTotalDistance(directionsDisplay.getDirections());
        // document.getElementById('total').innerHTML = totalDistance;

      });




      // Try HTML5 geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position, results, status) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var request = {
          location : pos,
          radius : '1000',
          keyword : 'restaurant'
        };




          service = new google.maps.places.PlacesService(map);
          var mapPosition = { map : map,
                        pos : pos
                      };
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
  }
  //.service calls new on class passed in.
  angular.module('App')
    .service('MapService', MapService);
})();