

// Leaflet JS
var mymap = L.map('mainMap').setView([39.632134, -79.95575], 13);


//cutsomized dropdown menu for zooming to preset locs
var locSelector = L.Control.extend({
    
      options: {
        position: 'topright'
      },
    
      onAdd: function (map) {
        var container = L.DomUtil.create('div', 'dropdown');
        container.innerHTML = '<div class="dropdown" id="locs"><button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Locations of Interest<span class="caret"></span></button><ul class="dropdown-menu"><li><a id="fairmont">Fairmont</a></li><li><a id="ohio">Ohio River</a></li><li><a id="clarksburg">Clarksburg</a><a id="randloc">Random Location</a></li></ul></div>'
        container.style.width = '200px';
        container.style.height = '35px';
        return container;
      }
    });
mymap.addControl(new locSelector())

// longitude -165 to + 165
function randLon() {
  var num = (Math.random()*165);
  var signChng = Math.round(Math.random()*1);
  if (signChng == 0) {
      num = num * -1;
  }
  return num;
}
// lattitude -80 to +80
function randLat() {
  var num = (Math.random()*80);
  var signChng = Math.round(Math.random()*1);
  if (signChng == 0) {
      num = num * -1;
  }
  return num;
}

//on click zoom functions
document.getElementById('fairmont').onclick = function(){mymap.setView([39.481785, -80.139942], 14)};
document.getElementById('ohio').onclick = function(){mymap.setView([39.644032, -80.859375], 14)};
document.getElementById('clarksburg').onclick = function(){mymap.setView([39.279507, -80.341043], 14)};
document.getElementById('randloc').onclick = function(){mymap.setView([randLat(),randLon()], 9)};


//basemap selector
var streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamNhbXAxIiwiYSI6ImNqZnU2NWtoZDQxbmQzOG52eXE0bHc4OGMifQ.UP-MWplkm4IzxoH3TJmqoQ', {
    maxZoom: 18,
    id: 'mapbox.streets',});
var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamNhbXAxIiwiYSI6ImNqZnU2NWtoZDQxbmQzOG52eXE0bHc4OGMifQ.UP-MWplkm4IzxoH3TJmqoQ', {
  maxZoom: 18,
  id: 'mapbox.satellite',}).addTo(mymap);

var baseMaps = {
  "Satellite" : satellite,
  "Streets" : streets
};

layerControl = L.control.layers(baseMaps, null, {position : 'topleft'});

layerControl.addTo(mymap);








