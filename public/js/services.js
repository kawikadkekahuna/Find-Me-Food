'use strict';
(function() {

  function MapService() {
  var map;
  var service;
  var infowindow;
  var chosen = false;
  var rendererOptions = {
    draggable : true
  };
  var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
  var directionsService = new google.maps.DirectionsService();

    this.init = function() {
      var mapOptions = {
        zoom: 17,
      };
      map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(document.getElementById('directionsPanel'));

      google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
        computeTotalDistance(directionsDisplay.getDirections());
      });

    function calcRoute(pos, dest) {
      console.log('dest',dest.name);
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



      // Try HTML5 geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
         var pos = new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude);
          var request = {
            location : pos,
            radius : '1000',
            keyword : 'restaurant'
          };


          //creates a marker at result place
          function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK && !chosen) {

              var i = Math.floor(Math.random() * results.length + 0);
               var dest = results[i];
                createMarker(dest);
              chosen = true;
            }
          calcRoute(pos, dest);

          }

          service = new google.maps.places.PlacesService(map);
          service.nearbySearch(request, callback);


          var infowindow = new google.maps.InfoWindow({
            map: map,
            position: pos,
            content: 'You are here'
          });

          map.setCenter(pos);
        }, function() {
          handleNoGeolocation(true);
        });




        function computeTotalDistance(result) {
          var total = 0;
          var myroute = result.routes[0];
          for (var i = 0; i < myroute.legs.length; i++) {
            total += myroute.legs[i].distance.value;
          }
          total = total / 1000.0;
          document.getElementById('total').innerHTML = total + ' km';
        }


        function createMarker(place) {
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