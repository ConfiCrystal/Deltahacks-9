// TEST
function testing() {
  console.log("you are testing.")
}

// Called when ALL the HTML has finished loading
document.addEventListener('DOMContentLoaded', function () {
  window.currentMode = 0; // set current travel Mode to walking by default
  // Call the function to give node0 special color
  chooseMode(0)
});

// API key
var urlkey = "&key=AIzaSyCYfPlorBy4ca8HC42iF6duYZUbfR3ubYM";
markersT = []

// Travel Mode Selection
function chooseMode(nodeNum) {
  if (window.currentMode <= 6) {
    document.getElementById("m" + window.currentMode).style.color = "var(--yellow-green)";
  } else {
    document.getElementById("m" + window.currentMode).src = "/transporticons/" + window.currentMode + ".png";
  }
  if (nodeNum <= 6) {
    document.getElementById("m" + nodeNum).style.color = "var(--blue)";
  } else {
    document.getElementById("m" + nodeNum).src = "/transporticons/" + nodeNum + "b.png";
  }
  window.currentMode = nodeNum; // this variable stores the current mode of travel

  var state = false
  switch (nodeNum) {
    case 0:
      if (convertTravel()) state = true
      break;
    case 1:
      
      break;
    case 2:
      
      break;
    case 3:
      
      break;
    case 4:
      
      break;
    case 5:
      
      break;
    case 6:
       
      break;
    case 7:
      
      break;
    case 8:
      
      break;
    case 9:
      
      break;
    case 10:
      
      break;
    case 11:
      
      break;
  }
  if (state == false) return
}

// converts to other travel modes
function convertTravel (mode) {
  
}

// Function myMap
// Ran on init
// Connects to google api and establishes map
function myMap() {
  // Defaults
  // General map
  map = new google.maps.Map(document.getElementById("googleMap"));
  infoWindow = new google.maps.InfoWindow();

  // Variables
  window.travelMode = 'WALKING';

  // Objects
  geocoder = new google.maps.Geocoder()
  window.directionsService = new google.maps.DirectionsService();
  window.directionRenderers = [new google.maps.DirectionsRenderer({
    suppressMarkers : true
  })];

  window.directionRenderers[0].setMap(map);
  window.markers = [new google.maps.Marker({position : null}), 
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
      window.markers[1].position = window.pos
      window.markers[1].setMap(null);
      window.markers[1].setMap(map);

      // Search box init
      var input = document.getElementById('pac-input')
      var searchBox = new google.maps.places.SearchBox(input)

      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener("places_changed", () => {
        search()
      });

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

// Search
function search () {
  const places = searchBox.getPlaces();

  if (places.length == 0) {
    return;
  }

  // Clear out the old markers.
  markersT.forEach((marker) => {
    marker.setMap(null);
  });
  markersT = [];

  // For each place, get the icon, name and location.
  const bounds = new google.maps.LatLngBounds();

  places.forEach((place) => {
    if (!place.geometry || !place.geometry.location) {
      console.log("Returned place contains no geometry");
      return;
    }

    const icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25),
    };

    // Create a marker for each place.
    var mark = new google.maps.Marker({
      map,
      icon,
      title: place.name,
      position: place.geometry.location,
      optimized : false
    })
    // transfers clicks on these icons to new waypoint locations
    mark.addListener("click", function() {
      
      markerOverride(0, this.position)

      markersT.forEach((marker) => {
        marker.setMap(null);
      });
      markersT = [];
    });

    markersT.push(mark);

    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }


  });
  map.fitBounds(bounds);
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
  findRoute(marker, pos)

}

// assists markerOverride
function mOverride (marker, pos) {
  window.markers[marker].position = pos
  window.markers[marker].setMap(null);
  window.markers[marker].setMap(map);
}

// Adds a new marker
function markerAdd (pos) {
  if (pos == null) return
  var l = window.markers.length-1;
  var ch = charFromInt(l);
  var name = ch;
  window.markers.push(new google.maps.Marker({position : pos, label : name}));
  window.markers[l+1].setMap(map);
}

// Interfaces between button and markerAdd
function interfaceAdd () {
  if (markers[0].position == null) return
  markerAdd(markers[0].position)
  markers[0].setMap(null)
  markers[0] = new google.maps.Marker({position : null})

  var mL = markers.length
  if (mL < 3) return
  // create a render for the previous path to save it
  window.directionRenderers.push(new google.maps.DirectionsRenderer({
    suppressMarkers : true
  }))

  var request = {
    origin : window.markers[mL - 2].position,
    destination : window.markers[mL - 1].position,
    travelMode : window.travelMode
  }

  var dRL = window.directionRenderers.length
  window.directionRenderers[dRL-1].setMap(map)
  window.directionsService.route(request, function(result, status) {
    if (status == "OK") {
      window.directionRenderers[dRL - 1].setDirections(result)
    }
  })

  // create a span element and append it to container
  mL = markers.length
  var newelement = document.createElement("li");
  newelement.className = "schedule";
  newelement.innerHTML = "5:00 pm " + markers[mL-2].label + " - "+ " 9:00 pm " + markers[mL-1].label;
  document.getElementById("placingTarget").appendChild(newelement);
}

// Erases all waypoints
function erase () {
  markersT.forEach((marker) => {
    marker.setMap(null)
  })
  markersT = []
  markers.forEach((marker => {
    marker.setMap(null)
  }))
  markers = [new google.maps.Marker({position : null})]

  var groundZero = document.getElementById("placingTarget")
  while(groundZero.lastElementChild) {
    groundZero.removeChild(groundZero.lastElementChild)
  }

  window.directionRenderers.forEach((directionRender) => {
    directionRender.setMap(null)
  })
  window.directionRenderers = [new google.maps.DirectionsRenderer({
    suppressMarkers : true
  })];
  window.directionRenderers[0].setMap(map);
}

// converts a list of numbers into a list of characters
function charFromInt (l) {
  return String.fromCharCode(l+65)
}

// Determines fastest and alternate routes from two saved positions
function findRoute(marker, pos) {
  mL = markers.length
  if (mL < 2) {
    mOverride(marker, pos)
  }
  var request = {
    origin : window.markers[mL-1].position,
    destination : pos,
    travelMode : window.travelMode
  }
  window.directionsService.route(request, function(result, status) {
    if (status == "OK") {
      var stuff = parseDirectionData(result);
      console.log(stuff)
      setTravelDetails(stuff)
      mOverride(marker, pos)
      window.directionRenderers[0].setDirections(result);
    } else {
      window.alert("Invalid route"); // DASON ALERT
    }
  });
}

/* Fills in the info table for ya */
function setTravelDetails(stuff) {
  stuff.forEach(myFunction);
  function myFunction(item, index) {
    var b = index;
    if (index > 7) {
      b += 1  
    }
    document.getElementById(b + "Value").innerHTML = item;
  }
}

/* Computes data from Direction Result object */
function parseDirectionData(result) {
  var data = result.routes[0].legs[0];
  console.log(data);
  var dist = data.distance.text;
  d = dist.split(" ")
  d = parseFloat(d[0])
  var time = data.duration.text;

  var co2;
  var no;
  var meth;
  var co;
  
  // begin computation of complex stuffs
  // Javascript swtich statement
  switch(window.currentMode) {
    case 0:
      co2 = superrounder(d * 0.05) + " g"
      no = "n/a"
      meth = "n/a"
      co = "n/a"
      break;
    case 1:
      co2 = superrounder(d * 21) + " g"
      no = "n/a"
      meth = "n/a"
      co = "n/a"
      break;
    case 2:
      co2 = superrounder(d * 250) + " g"
      no = superrounder(d * 0.012) + " g"
      meth = superrounder(d * 0.063) + " g"
      co = superrounder(d * 1.86) + " g"
      break;
    case 3:
      co2 = superrounder(d * 822) + " g"
      no = superrounder(d * 2) + " g"
      meth = superrounder(d * 1) + " g"
      co = superrounder(d * 6.11568) + " g"
      break;
    case 4:
      co2 = superrounder(d * 160) + " g"
      no = superrounder(d * 2) + " g"
      meth = superrounder(d * 1) + " g"
      co = "n/a"
      break;
    case 5:
      co2 = superrounder(d * 115) + " g"
      no = "n/a"
      meth = "n/a"
      co = "n/a"
      break;
    case 6:
      co2 = superrounder(d * 960) + " g"
      no = "n/a"
      meth = "n/a"
      co = "n/a"
      break;
    default:
      co2 = no = meth = co = 0;
  }
  carbontax = parseFloat(co2.split(" ")[0])
  carbontax /= 100000 * 2
  carbontax = "$" + carbontax
  return [dist, time, co2, no, meth, co, carbontax]
}

function superrounder(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}


// ------------------------------------------------------------ e ------------------------------------------------------------
/*
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


// This array will count how many restaurant markers I've got on the map
//var markersArray = [];

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
      console.log("Searching")
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
}*/
