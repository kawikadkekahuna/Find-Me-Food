'use strict';
(function() {

  function MapService() {
  var map;
  var service;
  var infowindow;
  var pos;

    this.init = function() {
      var mapOptions = {
        zoom: 20
      };
      map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

      // Try HTML5 geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          pos = new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude);
          var request = {
            location : pos,
            radius : '500',
            keyword : 'restaurant'
          };

          function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              var i = Math.floor(Math.random() * results.length + 0);
                var place = results[i];
                createMarker(place);
            }
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