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
    var i = Math.floor(Math.random() * results.length);

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
    this.loadComplete = null;
    var self = this;

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
        service.nearbySearch(request, function(results, status) {
          nearbySearchCompleted.call(googleMaps, results, status);

          self.dest = googleMaps.dest;
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







      var markers = [];

  // var defaultBounds = new google.maps.LatLngBounds(
  //     new google.maps.LatLng(-33.8902, 151.1759),
  //     new google.maps.LatLng(-33.8474, 151.2631));
  // map.fitBounds(defaultBounds);

  // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });
  // [END region_getplaces]

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
















    }

    this.getLocationName = function() {
      return googleMaps.dest.name;
    }

    this.loaded = function(cb) {
      this.loadComplete = cb;
    }

    this.getNextRestaurant = function(mapCanvasContainer, directionsPanelContainer) {
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
        service.nearbySearch(request, function(results, status) {
          nearbySearchCompleted.call(googleMaps, results, status);

          self.dest = googleMaps.dest;
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

  }
  //.service calls new on class passed in.
  angular.module('App')
    .service('MapService', MapService);
})();