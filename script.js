// API key
var urlkey = "&key=AIzaSyCYfPlorBy4ca8HC42iF6duYZUbfR3ubYM";

// Function myMap
// Ran on init
// Connects to google api and establishes map
function myMap() {
  // Defaults
  // General map
  map = new google.maps.Map(document.getElementById("googleMap"));
  infoWindow = new google.maps.InfoWindow();

  // Variables
  window.travelMode = 'DRIVING';
  window.buttonDefaults = {};

  // Objects
  window.directionsService = new google.maps.DirectionsService();
  window.directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers : true
  });
  window.directionsRenderer.setMap(map);
  window.markers = [new google.maps.Marker({position : {lat : 0, lng : 0}}), 
                    new google.maps.Marker({position : {lat : 0, lng : 0}, label : "A"})];

  // Listeners
  map.addListener("click", (mapsMouseEvent) => {
    window.clickPos = mapsMouseEvent.latLng;
    markerOverride(0, clickPos);
  });

  // document.getElementById("myBtn").addEventListener("click", buttonToggle("myBtn"));

  // First, ask the user for permission to use location.
  // If geolocation is successful, retrieve user's coordinates.
  nav = navigator.geolocation
  if(nav) {
    nav.getCurrentPosition(function(position) {
      window.pos = {
        lat : position.coords.latitude,
        lng : position.coords.longitude
      };
      // Now, edit the map properties to match retrived location and zoom in.
      map.setZoom(13);
      map.setCenter(window.pos);

      // First position default
      markerOverride(1, window.pos);

      // temp
      markerAdd({lat : 43.260217, lng : -79.911344})

    }),
      // Increases geolocation accuracy
      {
        enableHighAccuracy : true,
        timeout: 5000
      };
  } else {
    // If browser doesn't support Geolocation, inform the user
    window.alert("Please enable geolocation services!");
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

//Error screen for geolocation failure
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

// Replaces marker with new position
function markerOverride (marker, pos) {
  window.markers[marker].position = pos
  window.markers[marker].setMap(null);
  window.markers[marker].setMap(map);
}

// Adds a new marker
function markerAdd (pos) {
  l = window.markers.length;
  conv = b26(l);
  ch = charFromInt(l);
  name = ch.join('');

  window.markers.push(new google.maps.Marker({position : pos, label : name}));
  window.markers[l].setMap(map);
}

// converts a number into an array in base 26
function b26 (n) {
  l = []
  while (true) {
    if (n == 0) {
      break;
    }
    l.push(n % 26)
    n = Math.floor(n / 26)
  }
  l.reverse();
  return l
}

// converts a list of numbers into a list of characters
function charFromInt (l) {
  li = []
  for (n in l) {
    li.push(String.fromCharCode(n+64))
  }
  return li
}

// Determines fastest and alternate routes from two saved positions
function findRoute() {
  var request = {
    origin : window.markers[1].position,
    destination : window.markers[2].position,
    travelMode : window.travelMode,
    provideRouteAlternatives : true
  }

  window.directionsService.route(request, function(result, status) {
    if (status == "OK") {
      window.directionsRenderer.setDirections(result);
    };
  });
}

// Button toggle
function buttonToggle(buttonName) {
  if (window.buttonDefaults.buttonName) {
    window.buttonDefaults.buttonName = false;
  } else {
    window.buttonDefaults.buttonName = true;
  };
}

// ------------------------------------------------------------ e ------------------------------------------------------------
// Discovered bug. Impelemented searchnew variable to fix.
// Tells my directions that a new search has been made, preventing directions toggle from dispalying leftover directions.
var searchnew = 0;

// As you can see, I use an unhealthy amount of universal variables. Forgive me.
window.distancetoggle = 1;
function distance() {
  if (window.distancetoggle == 0) {
    document.getElementById("tb1").style.backgroundColor = "indianred";
    window.distancetoggle = 1;
  } else {
    document.getElementById("tb1").style.backgroundColor = "seagreen";
    window.distancetoggle = 0;
    document.getElementById("tb2").style.backgroundColor = "indianred";
    window.ratingtoggle = 1;
  }
}

// These toggles are for the three big buttons you see. They code for the on/off switch effect.
window.ratingtoggle = 1;
function rating() {
  if (window.ratingtoggle == 0) {
    document.getElementById("tb2").style.backgroundColor = "indianred";
    window.ratingtoggle = 1;
  } else {
    document.getElementById("tb2").style.backgroundColor = "seagreen";
    window.ratingtoggle = 0;
    document.getElementById("tb1").style.backgroundColor = "indianred";
    window.distancetoggle = 1;
  }
}

// transportoggle will be used later in making directions
window.transporttoggle = 1;
function transport() {
  if (window.transporttoggle == 0) {
    document.getElementById("tb3").style.backgroundColor = "indianred";
    window.transporttoggle = 1;
  } else {
    document.getElementById("tb3").style.backgroundColor = "seagreen";
    window.transporttoggle = 0;
  }
  // Very important, since it allows directions to update each time user changes toggle.
  createDirections();
}

// ------------------------------------------------------------ e ------------------------------------------------------------


// This array will count how many restaurant markers I've got on the map
var markersArray = [];

// Search function is activated by user after inputing (or not inputing) keywords
function search() {
  searchnew = 0;
  // These don't code for directions, they clear previous directions by shifting the center back to user's current location.
  // Unorthodox, but it works.
  var request = {
    origin: window.pos,
    destination: window.pos,
    travelMode: "DRIVING"
  };
  window.directionsService.route(request, function(result, status) {
    if (status == "OK") {
      window.directionsRenderer.setDirections(result);
    }
  });

  // Clears all markers. I put the markers into an array.
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;

  // Do you like making brothy soup? You throw a bunch of edibles into the pot and hope it works.
  // That is exactly what I am doing here with this fetch URL. First, I gather bits of information.
  var urlhead =
    "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";

  // Add user's current location to pot
  var urllocation = JSON.stringify(window.pos)
    .replace('{"lat":', "")
    .replace("}", "")
    .replace('"lng":', "")
    .trim();
  console.log("Current location is: " + urllocation);

  // Add any searchbar input to pot
  let input = document
    .getElementById("searchbar")
    .value.toLowerCase()
    .trim()
    .split(" ")
    .join("%20");

  // Add user distance toggle to pot
  if (window.distancetoggle == 0) {
    var urltail = "&type=restaurant&rankby=distance&keyword=";
  } else {
    var urltail = "&radius=3000&type=restaurant&keyword=";
  }


  // Stir it all together into urlmain. This is the final product URL.
  var urlmain = urlhead + urllocation + urltail + input + urlkey;
  console.log("JSON sample: " + urlmain);

  // This fetch is formatted for search bar and its requests
  fetch(urlmain) // Call the fetch function passing the url of the API as a parameter
    .then(resp => {
      return resp.json();
    }) // Transform the data into json
    .then(function(data) {
      // A jumble of if statements to check if distance or rating has been selected.
      if (window.distancetoggle == 0) {
        // if distance is toggled, only 3 results are shown
        window.length = 3;
      } else if (window.ratingtoggle == 0) {
        // if rating is toggled, only 3 results are shown
        window.length = 3;
        // sort them by rating
        data.results = data.results.sort(function(a, b) {
          return b.rating - a.rating;
        });
      } else {
        // If nothing is toggled, just show all 20 places
        window.length = data.results.length;
      }
      // Create markers based on previous toggles.
      for (var i = 0; i < window.length; i++) {
        createMarker([i]);
      }
      function createMarker([i]) {
        var markerpos = data.results[i].geometry.location;
        var marker = new google.maps.Marker({
          position: markerpos
        });
        marker.setMap(map);
        marker.setAnimation(google.maps.Animation.DROP);
        marker.setIcon(
          "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
        );
        // push the markers into an array to erase when a new search begins
        markersArray.push(marker);
        // when marker is clicked, open an info window for 3 secs and call the function
        //cretaeDirections to make direction graphics for it
        marker.addListener("click", function() {
          searchnew = 1;
          const infowindow = new google.maps.InfoWindow({
            content: JSON.stringify(data.results[i].name).substring(
              1,
              JSON.stringify(data.results[i].name).length - 1
            )
          });
          window.currentmarker = markerpos;
          infowindow.open(map, marker);
          createDirections();
          setTimeout(close, 3000);
          function close() {
            infowindow.close(map, marker);
          }
        });

        // Sets coordinates for direction buttons 1-3 and calls function createDirections.
        // There probably exists a much more elegant way of doing this, but I am dumb.
        document.getElementById("b1").addEventListener("click", function() {
          searchnew = 1;
          window.currentmarker = data.results[0].geometry.location;
          createDirections();
        });
        document.getElementById("b2").addEventListener("click", function() {
          searchnew = 1;
          window.currentmarker = data.results[1].geometry.location;
          createDirections();
        });
        document.getElementById("b3").addEventListener("click", function() {
          searchnew = 1;
          window.currentmarker = data.results[2].geometry.location;
          createDirections();
        });
      }
    })
    .catch(function(error) {
      console.log(error);
    });
  // Clear the searchbar after the search
  document.getElementById("searchbar").value = "";
}

// All directions are created here.
function createDirections() {
  // If user toggles normal mode, display normal driving route
  if (window.transporttoggle == 1) {
    var request = {
      origin: window.pos,
      destination: window.currentmarker,
      travelMode: "DRIVING"
    };
  } else {
    // If user goes bus, give the user bus route
    var request = {
      origin: window.pos,
      destination: window.currentmarker,
      travelMode: "TRANSIT",
      transitOptions: {
        modes: ["BUS"],
        routingPreference: "FEWER_TRANSFERS"
      }
    };
  }
  if (searchnew == 1) {
    // when route has been decided, display on map.
    window.directionsService.route(request, function(result, status) {
      if (status == "OK") {
        window.directionsRenderer.setDirections(result);
      }
    });
  }
}
