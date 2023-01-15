function conjurePhrase(num) {
  switch (num) {
      case 0:
          return "Jogging";
      case 1:
          return "Biking";
      case 2:
        return "Driving";
      case 3:
        return "Bussing";
      case 4:
        return "Taking the train";
      case 5:
        return "Flying";
      case 6:
        return "Cruising";
      case 7:
        return "ICBM";
      case 9:
        return "Catapulting";
      case 10:
        return "Horseback riding";
      case 11:
        return "Pogo-sticking";
      default:
        return "Taking the heli";
  }
}

window.planeRide = true;

// STYLING FUNCTIONS - Purely for CSS support
function setf(i) {
  var x = document.getElementById("sett" + i);
  x.value = x.value.slice(0, 3);
}

sValues = []
for (let i = 0; i < 12; i++) {
  sValues.push(0)
}
temp = []
for (let i = 0; i < 13; i++) {
  temp.push(0)
}


function swapG(b) {
  switch (b) {
      case 0:
          document.getElementById("tmaleG").style.color = "var(--blue)"
          document.getElementById("femaleG").style.color = "ghostwhite"
          window.Gender = true
          break;
      default:
          document.getElementById("femaleG").style.color = "var(--blue)"
          document.getElementById("tmaleG").style.color = "ghostwhite"
          window.Gender = false
  }
}

// Called when ALL the HTML has finished loading
document.addEventListener('DOMContentLoaded', function() {
  window.currentMode = 0; // set current travel Mode to walking by default
  // Call the function to give node0 special color
  chooseMode(0)
  // Set default gender to male
  swapG(0)
});

// API key
var urlkey = "&key=AIzaSyCYfPlorBy4ca8HC42iF6duYZUbfR3ubYM";
markersT = []

// Travel Mode Selection
function chooseMode(nodeNum) {
  switch (nodeNum) {
      case 0:
          convertTravel(nodeNum, "WALKING")
          break;
      case 1:
          convertTravel(nodeNum, "BICYCLING")
          break;
      case 2:
          convertTravel(nodeNum, "DRIVING")
          break;
      case 3:
          convertTravel(nodeNum, "Bus")
          break;
      case 4:
          convertTravel(nodeNum, "Train")
          break;
      case 5:
          convertTravel(nodeNum, "Plane")
          break;
      case 6:
          convertTravel(nodeNum, "Plane")
          break;
      case 7:
          convertTravel(nodeNum, "Plane")
          break;
      case 9:
          convertTravel(nodeNum, "Plane")
          break;
      case 10:
          convertTravel(nodeNum, "BICYCLING")
          break;
      case 11:
          convertTravel(nodeNum, "WALKING")
          break;
      case 12:
          convertTravel(nodeNum, "Plane")
          break;
  }
}

function changeModeColour(nodeNum) {
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
  window.planeLines = []

  // Objects
  window.planeLine = new google.maps.Polyline({
      path: [{
          lat: 0,
          lng: 0
      }, {
          lat: 0,
          lng: 0
      }]
  })
  geocoder = new google.maps.Geocoder()
  window.directionsService = new google.maps.DirectionsService();
  window.directionRenderers = [new google.maps.DirectionsRenderer({
      suppressMarkers: true
  })];

  window.directionRenderers[0].setMap(map);
  window.markers = [new google.maps.Marker({
          position: null
      }),
      new google.maps.Marker({
          position: {
              lat: 0,
              lng: 0
          },
          label: "A"
      })
  ];

  // Listeners
  map.addListener("click", (mapsMouseEvent) => {
      window.clickPos = mapsMouseEvent.latLng;
      markerOverride(0, clickPos);
  });

  // document.getElementById("myBtn").addEventListener("click", buttonToggle("myBtn"));

  // First, ask the user for permission to use location.
  // If geolocation is successful, retrieve user's coordinates.
  nav = navigator.geolocation
  if (nav) {
      nav.getCurrentPosition(function(position) {
              window.pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
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
              window.searchBox = new google.maps.places.SearchBox(input)

              // Listen for the event fired when the user selects a prediction and retrieve
              // more details for that place.
              searchBox.addListener("places_changed", () => {
                  search()
              });

          }),
          // Increases geolocation accuracy
          {
              enableHighAccuracy: true,
              timeout: 5000
          };
  } else {
      // If browser doesn't support Geolocation, inform the user
      window.alert("Please enable geolocation services!");
      handleLocationError(false, infoWindow, map.getCenter());
  }
}

// converts to other travel modes
function convertTravel(nodeNum, mode) {

  if (mode != "Plane") {
      planeLine.setMap(null)
      planeLine = new google.maps.Polyline({
          path: [{
              lat: 0,
              lng: 0
          }, {
              lat: 0,
              lng: 0
          }]
      })
      planeLine.setMap(map)
  }
  if (mode == "Plane") {
      changeModeColour(nodeNum)
      window.travelMode = "Plane"
      window.currentMode = nodeNum;

      if (markers[0] == null) return
      window.directionRenderers[0].setMap(null)
      window.directionRenderers[0] = new google.maps.DirectionsRenderer({
          suppressMarkers: true
      })
      window.directionRenderers[0].setMap(map)

      window.planeLine.setMap(null)
      window.planeLine = new google.maps.Polyline({
          path: [window.markers[window.markers.length - 1].position, window.markers[0].position]
      })
      planeLine.setMap(map)
  } else if (mode == "Bus" || mode == "Train") {
      var mL = markers.length
      if (markers[0].position == null || mL < 2) {
          changeModeColour(nodeNum)
          window.travelMode = "TRANSIT"
          window.currentMode = nodeNum; // this variable stores the current mode of travel
          return
      }
      var request = {
          origin: window.markers[mL - 1].position,
          destination: window.markers[0].position,
          travelMode: "TRANSIT"
      }
      if (mode == "Bus") {
          request.transitOptions = {
              modes: ['BUS']
          }
      } else {
          request.transitOptions = {
              modes: ["RAIL", "SUBWAY", "TRAIN", "TRAM"]
          }
      }
      window.directionsService.route(request, function(result, status) {
          if (status == "OK") {
              changeModeColour(nodeNum)
              window.travelMode = "TRANSIT"
              window.currentMode = nodeNum; // this variable stores the current mode of travel
              var stuff = parseDirectionData(result);
              setTravelDetails(stuff)
              window.directionRenderers[0].setDirections(result);
          } else {
              window.alert("Invalid route"); // ALERT
          }
      });
  } else {
      var mL = window.markers.length
      if (markers[0].position == null || mL < 2) {
          changeModeColour(nodeNum)
          window.travelMode = mode
          window.currentMode = nodeNum; // this variable stores the current mode of travel
          return
      }
      var request = {
          origin: window.markers[mL - 1].position,
          destination: window.markers[0].position,
          travelMode: mode
      }
      if (mode == "Bus") {
          request.transitOptions = {
              modes: ['BUS']
          }
      } else {
          request.transitOptions = {
              modes: ["RAIL", "SUBWAY", "TRAIN", "TRAM"]
          }
      }
      window.directionsService.route(request, function(result, status) {
          if (status == "OK") {
              changeModeColour(nodeNum)
              window.travelMode = mode
              window.currentMode = nodeNum; // this variable stores the current mode of travel
              var stuff = parseDirectionData(result);
              setTravelDetails(stuff)
              window.directionRenderers[0].setDirections(result);
          } else {
              window.alert("Invalid route"); // DASON ALERT
          }
      });

  }
}

var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};

// Search
function search() {
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
          optimized: false
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
      browserHasGeolocation ?
      "Error: The Geolocation service failed." :
      "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

// Replaces marker with new position
function markerOverride(marker, pos) {
  findRoute(marker, pos)

}

// assists markerOverride
function mOverride(marker, pos) {
  window.markers[marker].position = pos
  window.markers[marker].setMap(null);
  window.markers[marker].setMap(map);
}

// Adds a new marker
function markerAdd(pos) {
  if (pos == null) return
  var l = window.markers.length - 1;
  var ch = charFromInt(l);
  var name = ch;
  window.markers.push(new google.maps.Marker({
      position: pos,
      label: name
  }));
  window.markers[l + 1].setMap(map);
}

// Interfaces between button and markerAdd
function interfaceAdd() {
  if (markers[0].position == null) return
  markerAdd(markers[0].position)
  markers[0].setMap(null)
  markers[0] = new google.maps.Marker({
      position: null
  })
/*
  temptemp = []
  for (let i = 0; i < 12; i++) {
    ind = i
    if (i > 7) {
      ind++
    }
    temptemp[i] = temp[ind]
    console.log("temp" + i + " is " + temp[ind])
    if (temp[ind].slice(0,3) == "n/a") {
      temptemp[i] = ""
    }
  }

  sValues[0] += parseFloat(temptemp[0].slice(0,temptemp[0].length-3))
  sValues[1] += parseFloat(temptemp[1].slice(0,temptemp[0].length-5))
  sValues[2] += parseFloat(temptemp[2].slice(0,temptemp[0].length-2))
  sValues[3] += parseFloat(temptemp[3].slice(0,temptemp[0].length-2))
  sValues[4] += parseFloat(temptemp[4].slice(0,temptemp[0].length-2))
  sValues[5] += parseFloat(temptemp[5].slice(0,temptemp[0].length-2))
  sValues[6] += parseFloat(temptemp[6].slice(1))
  sValues[8] += parseFloat(temptemp[8].slice(temptemp[0]))
  sValues[9] += parseFloat(temptemp[9].slice(temptemp[0]))
  sValues[10] += parseFloat(temptemp[10].slice(temptemp[0]))
  sValues[11] += parseFloat(temptemp[11].slice(0,temptemp[0].length-1))
  console.log("sVALUES ARE")
  console.log(sValues)
  console.log("Travelmode is " + travelMode);*/
  if (travelMode == "Plane") {
      mL = markers.length
      var newelement = document.createElement("li");
      newelement.className = "schedule";
      newelement.innerHTML = conjurePhrase(window.currentMode) + " from " + markers[mL - 2].label + " to " + markers[mL - 1].label;
      document.getElementById("placingTarget").appendChild(newelement);

      var mL = markers.length
      window.planeLines.push(new google.maps.Polyline({
          path: [window.markers[mL - 2].position, window.markers[mL - 1].position]
      }))
      window.planeLines[planeLines.length - 1].setMap(map)
      planeLine.setMap(null)
      return
  }

  var mL = markers.length
  if (mL < 3) return
  // create a render for the previous path to save it
  window.directionRenderers.push(new google.maps.DirectionsRenderer({
      suppressMarkers: true
  }))


  var request = {
      origin: window.markers[mL - 2].position,
      destination: window.markers[mL - 1].position,
      travelMode: window.travelMode
  }
  if (travelMode == "Bus") {
      request.transitOptions = {
          modes: ['BUS']
      }
  } else if (travelMode == "Train") {
      request.transitOptions = {
          modes: ["RAIL", "SUBWAY", "TRAIN", "TRAM"]
      }
  }

  var dRL = window.directionRenderers.length
  window.directionRenderers[dRL - 1].setMap(map)
  window.directionsService.route(request, function(result, status) {
      if (status == "OK") {
          window.directionRenderers[dRL - 1].setDirections(result)
      }
  })

  // create a span element and append it to container
  mL = markers.length
  var newelement = document.createElement("li");
  newelement.className = "schedule";
  newelement.innerHTML = conjurePhrase(window.currentMode) + " from " + markers[mL - 2].label + " to " + markers[mL - 1].label;
  document.getElementById("placingTarget").appendChild(newelement);
}

// Erases all waypoints
function erase() {
  markersT.forEach((marker) => {
      marker.setMap(null)
  })
  markersT = []
  markers.forEach((marker => {
      marker.setMap(null)
  }))

  planeLines.forEach((line) => {
      line.setMap(null)
  })
  planeLines = []
  markers = [new google.maps.Marker({
      position: null
  })]

  var groundZero = document.getElementById("placingTarget")
  while (groundZero.lastElementChild) {
      groundZero.removeChild(groundZero.lastElementChild)
  }

  window.directionRenderers.forEach((directionRender) => {
      directionRender.setMap(null)
  })
  window.directionRenderers = [new google.maps.DirectionsRenderer({
      suppressMarkers: true
  })];
  window.directionRenderers[0].setMap(map);

  planeLine.setMap(null)
}

// converts a list of numbers into a list of characters
function charFromInt(l) {
  return String.fromCharCode(l + 65)
}

// Determines fastest and alternate routes from two saved positions
function findRoute(marker, pos) {
  if (travelMode == "Plane") {
      window.directionRenderers[0].setMap(null)
      window.directionRenderers[0] = new google.maps.DirectionsRenderer({
          suppressMarkers: true
      })
      window.directionRenderers[0].setMap(map)

      if (window.planeLine != null) {
          window.planeLine.setMap(null)
      }

      if (markers.length < 2) return

      window.planeLine = new google.maps.Polyline({
          path: [window.markers[window.markers.length - 1].position, pos]
      })
      planeLine.setMap(map)
      mOverride(marker, pos)

      result = {
          routes: [{
              legs: [{
                  distance: {
                      text: getDistance(window.markers[window.markers.length - 1].position, {
                          lat: pos.lat(),
                          lng: pos.lng()
                      }).toString()
                  },
                  duration: {
                      text: (getDistance(markers[markers.length - 1].position, {
                          lat: pos.lat(),
                          lng: pos.lng()
                      }) * 9 / 2000).toString()
                  }
              }]
          }]
      }
      var stuff = parseDirectionData(result);
      console.log(stuff)
      setTravelDetails(stuff)
      return true
  }

  mL = markers.length
  if (mL < 2) {
      mOverride(marker, pos)
  }
  var request = {
      origin: window.markers[mL - 1].position,
      destination: pos,
      travelMode: window.travelMode
  }
  if (travelMode == "Bus") {
      request.transitOptions = {
          modes: ['BUS']
      }
  } else if (travelMode == "Train") {
      request.transitOptions = {
          modes: ["RAIL", "SUBWAY", "TRAIN", "TRAM"]
      }
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
      document.getElementById(index + "Value").innerHTML = item;
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

  // environmental variables
  var co2;
  var no;
  var meth;
  var co;

  // health variables
  var weight = parseInt(document.getElementById("sett1").value.trim());
  var age = parseInt(document.getElementById("sett2").value.trim());
  var height = parseInt(document.getElementById("sett3").value.trim());

  var fat = "n/a";
  var mort = "?";
  var steps = "n/a";
  var cal = "n/a";
  var BMR = "n/a"

  if (window.currentMode == 0 || window.currentMode == 1 || window.currentMode == 10 || window.currentMode == 11) {
      if (window.Gender == true) {
          // 88.362 + (13.397 x weight in kg) + (4.799 x height in cm) – (5.677 x age in years) 
          BMR = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
          // 447.593 + (9.247 x weight in kg) + (3.098 x height in cm) – (4.330 x age in years)
          BMR = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }

      if (window.Gender == true) {
          //Calories Burned = [(Age * 0.2017) + (Weight * 0.09036) + (Heart Rate * 0.6309) .sd-- 55.0969] * Time / 4.184.
          cal = ((age * 0.2017) + (weight * 0.09036) + ((220 - age) * 0.6309) - 55.0969) * (2.41666666667 * d) / 4.184;
      } else {
          //Calories Burned = [(Age * 0.074) -- (Weight * 0.05741) + (Heart Rate * 0.4472) -- 20.4022] * Time / 4.184.
          cal = ((age * 0.074) - (weight * 0.05741) + ((220 - age) * 0.4472) - 20.4022) * (2.75 * d) / 4.184;
      }

      fat = cal / 7700

      // round eveyrthing nice
      if (isNaN(BMR)) {
          BMR = "n/a";
          cal = "n/a";
          fat = "n/a";
      } else {
          if (window.currentMode == 1) {
              cal *= 240 / 149
              fat *= 240 / 149
          } else if (window.currentMode == 10) {
              cal = 274 / 19.3121 * d
              fat = cal / 7700
          } else if (window.currentMode == 11) {
              cal *= 6 / 5
              fat *= 6 / 5
          }
          BMR = superrounder(BMR)
          cal = superrounder(cal)
          fat = superrounder(fat)

      }
  }

  // begin computation of complex stuffs
  // Javascript swtich statement
  switch (window.currentMode) {
      case 0:
          co2 = superrounder(d * 0.05) + " g"
          no = "n/a"
          meth = "n/a"
          co = "n/a"
          steps = superrounder(1408 * d)
          break;
      case 1:
          co2 = superrounder(d * 21) + " g"
          no = "n/a"
          meth = "n/a"
          co = "n/a"
          mort = "0.00013%"
          break;
      case 2:
          co2 = superrounder(d * 250) + " g"
          no = superrounder(d * 0.012) + " g"
          meth = superrounder(d * 0.063) + " g"
          co = superrounder(d * 1.86) + " g"
          mort = superrounder(d * 2.3496364e-8) + "%"
          break;
      case 3:
          co2 = superrounder(d * 822 / 4) + " g"
          no = superrounder(d * 2 / 4) + " g"
          meth = superrounder(d * 1 / 4) + " g"
          co = superrounder(d * 6.11568 / 4) + " g"
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
          mort = "8.33333333e-8%"
          break;
      case 6:
          co2 = superrounder(d * 960) + " g"
          no = "n/a"
          meth = "n/a"
          co = "n/a"
          break;
      case 7:
          co2 = superrounder(d * 69000) + " g"
          no = superrounder(d * 823) + " g"
          meth = superrounder(d * 5123) + " g"
          co = superrounder(d * 323) + " g"
          mort = "100%"
          break;
      case 9:
          co2 = superrounder(d * 134.71689) + " g"
          no = "n/a"
          meth = superrounder(d * 0.0017962252) + " g"
          co = "n/a"
          mort = "99.92%"
          break;
      case 10:
          co2 = superrounder(d * 141.112586307 * 1.05 / 144) + " g"
          no = "n/a"
          meth = superrounder(d * 0.16) + " g"
          co = "n/a"
          mort = "0.00139%"
          break;
      case 11:
          co2 = superrounder(d * 0.1) + " g"
          no = "n/a"
          meth = "n/a"
          co = "n/a"
          break;
      case 12:
          co2 = superrounder(d * 101) + " g"
          no = superrounder(d * 93) + " g"
          meth = "n/a"
          co = "n/a"
          break;
      default:
          co2 = no = meth = co = 0;
  }
  carbontax = parseFloat(co2.split(" ")[0])
  carbontax /= 100000 * 2 * 2.5
  carbontax = "$" + carbontax
  temp = [dist, time, co2, no, meth, co, carbontax, BMR, cal, fat, steps, mort]
  if (window.travelMode == "Plane" && window.planeRide == true) {
    for (let i = 0; i < temp.length; i++) {
        entry = temp[i]
        if (isNaN(entry)) {
        temp[i] = "n/a"
        }
    }
    window.planeRide = false
  }
  return temp
}

function superrounder(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}