//Grab a reference to the update button and the update text elements
let updateBtn = document.querySelector("#refreshBtn");
let updateText = document.querySelector("#refreshStatus");

//create and initialize the map object
let myMap = L.map('mainMap').setView([38.897446, -77.037506], 12);

//attempt to get the users location
myMap.locate({setView: true, maxZoom: 15})

//if users location is found create a marker to indicate position
function onLocationFound(e) {
    let radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(myMap)
        .bindPopup("You are located here").openPopup();
};

myMap.on('locationfound', onLocationFound);

//initialize the bus marker options
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};
let busMarkers = {
    radius: 5,
    fillColor: "#f20a0a",
    color: "#000",
    weight: 1.2,
    opacity: 0.8,
    fillOpacity: 0.8
};

//create the map objects tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiamNhbXAxIiwiYSI6ImNrenhkbnMyYjAwZ3QydXF2eW4xanNpYjMifQ.uTKFUE_SYaEd-PAPMU4w_w'
}).addTo(myMap);


//this fucntion updates the bus postions when a button on the map is pressed
function updateBusPoints(){

    //create headers and initialize the request object
    let myHeaders = new Headers({'api_key': 'e13626d03d8e4c03ac07f95541b3091b'});
    let myInit = {
        method: 'GET',
        headers: myHeaders
    };
    let myRequest = new Request('https://api.wmata.com/Bus.svc/json/jBusPositions?', myInit);
    let geoJson = {}

    //fetch the bus data from the WMATA api
    fetch(myRequest)
        .then(function(response){
        return response.json();
    })
        .then(function(data){
        busData = data;
        console.log(busData) 
    })
        .then(function(){

        //handle the response and grab the atributes needed for the map
        let jsonFeatures = [];
        busData.BusPositions.forEach(function(point){
            let feature = {
                type: 'Feature',
                properties: point,
                geometry: {
                    type: 'Point',
                    coordinates: [point.Lon,point.Lat]
                }
            };

            jsonFeatures.push(feature);
        });

        //convert the bus data from json to geojson
        geoJson = { type: 'FeatureCollection', features: jsonFeatures };

        uniqueRoutes = [];
        
        //create a geojson layer that leaflet can handle and add it to the map
        busLocationLayer = L.geoJSON(geoJson, {
            pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, busMarkers);
            }, onEachFeature (feature, layer) {
                layer.bindPopup('Route ID: '+ feature.properties.RouteID)
                layer.on('click' , function (e){
                    if (typeof busRouteLayer !== 'undefined'){
                        busRouteLayer.removeFrom(myMap)
                    }
                    updateBusRoutes(feature.properties.RouteID)

                })
            }
        }).addTo(myMap);
        
           

    });
};

function updateBusRoutes(route){

    //create headers and initialize the request object
    let myHeaders = new Headers({'api_key': 'e13626d03d8e4c03ac07f95541b3091b'});
    let myInit = {
        method: 'GET',
        headers: myHeaders
    };
    let myRequest = new Request('https://api.wmata.com/Bus.svc/json/jRouteDetails?RouteID='+route, myInit);
    let geoJson = {}

    //fetch the bus data from the WMATA api
    fetch(myRequest)
        .then(function(response){
        return response.json();
    })
        .then(function(data){
        busData = data;
        console.log(busData)
    })
        .then(function(){

        //handle the response and grab the atributes needed for the map
        let jsonFeatures = [];

        let feature = {
            type: 'Feature',
            properties: busData.Direction0,
            geometry: {
                type: 'LineString',
                coordinates: []
            }
        };

        busData.Direction0.Shape.forEach(function(point){
            feature.geometry.coordinates.push([point.Lat, point.Lon])

        });

        console.log(feature.geometry.coordinates)

        jsonFeatures.push(feature);

        polyLineFeature = feature.geometry.coordinates
        //convert the bus data from json to geojson
        geoJson = { type: 'FeatureCollection', features: jsonFeatures };

        //create a geojson layer that leaflet can handle and add it to the map
        busRouteLayer = L.polyline(polyLineFeature, {
            style: myStyle
        }).addTo(myMap);
    });
};



//get the time of the last bus data update and populate the appropriate elements
function lastUpdate(){
    let curTime = new Date()
    let suffix = curTime.getHours() >= 12 ? "PM":"AM";
    let hour = ((curTime.getHours() + 11) % 12 + 1);
    let time = hours() +":"+minutes()+":"+seconds()+" "+suffix;

    //format seconds into a reasonable string
    function seconds(){
        if(curTime.getSeconds().toString().length <= 1){
            return "0"+curTime.getSeconds();
        }else{
            return curTime.getSeconds();
        }
    }
    //format minutes into a reasonable string
    function minutes(){
        if(curTime.getMinutes().toString().length <= 1){
            return "0"+curTime.getMinutes();
        }else{
            return curTime.getMinutes();
        }
    }
    //format hours into a reasonable string
    function hours(){
        if(hour.length <= 1){
            return "0"+hour;
        }else{
            return hour;
        }
    }

    return "Last update was at "+time;
};

//add the on click funtion for the update button
updateBtn.addEventListener('click',function(){
    
    busLocationLayer.removeFrom(myMap)
    updateBusPoints()
    updateText.innerHTML = lastUpdate()
    updateBtn.disabled = true;

    async function wait() {
        return new Promise(function(resolve) {
            setTimeout(resolve, 1000);
        });
    }

    (async function() {

        let amount = 5
        let amountLeft = amount

        for (i = 0; i < amount; i++) {

            updateBtn.value = "Please wait "+amountLeft+" Seconds";
            await wait();
            amountLeft--
        }

    updateBtn.value = "Update Bus Locations";
    updateBtn.disabled = false;
    })()

});
