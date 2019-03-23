



//Comments for the code below are in progress, lol


let updateBtn = document.querySelector("#refreshBtn");
let updateText = document.querySelector("#refreshStatus");
let myMap = L.map('mainMap').setView([38.897446, -77.037506], 12);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiamNhbXAxIiwiYSI6ImNqZnU2NWtoZDQxbmQzOG52eXE0bHc4OGMifQ.UP-MWplkm4IzxoH3TJmqoQ'
}).addTo(myMap);

let busMarkers = {
    radius: 5,
    fillColor: "#f20a0a",
    color: "#000",
    weight: 1.2,
    opacity: 0.8,
    fillOpacity: 0.8
};

function updateBusData(){
    let myHeaders = new Headers({'api_key': 'e13626d03d8e4c03ac07f95541b3091b'});

    let myInit = {
        method: 'GET',
        headers: myHeaders
    };

    let myRequest = new Request('https://api.wmata.com/Bus.svc/json/jBusPositions?', myInit);

    fetch(myRequest)
        .then(function(response){
        return response.json();
    })
        .then(function(data){
        busData = data;
    })
        .then(function(){
        let jsonFeatures = [];
        busData.BusPositions.forEach(function(point){
            let lat = point.Lat;
            let lon = point.Lon;
            let feature = {
                type: 'Feature',
                properties: point,
                geometry: {
                    type: 'Point',
                    coordinates: [lon,lat]
                }
            };

            jsonFeatures.push(feature);
        });

        let geoJson = {}
        geoJson = { type: 'FeatureCollection', features: jsonFeatures };
        
        busDataLayer = L.geoJSON(geoJson, {
            pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, busMarkers);
            }}).addTo(myMap);
    });
};

function lastUpdate(){
    function seconds(){
        if(curTime.getSeconds().toString().length <= 1){
            return "0"+curTime.getSeconds();
        }else{
            return curTime.getSeconds();
        }
    }
    function minutes(){
        if(curTime.getMinutes().toString().length <= 1){
            return "0"+curTime.getMinutes();
        }else{
            return curTime.getMinutes();
        }
    }
    function hours(){
        if(hour.length <= 1){
            return "0"+hour;
        }else{
            return hour;
        }
    }
let curTime = new Date()
let suffix = curTime.getHours() >= 12 ? "PM":"AM";
let hour = ((curTime.getHours() + 11) % 12 + 1);
let time = hours() +":"+minutes()+":"+seconds()+" "+suffix;
return "Last update was at "+time;
};

updateBtn.addEventListener('click',function(){
    
    busDataLayer.removeFrom(myMap)
    updateBusData()
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

updateBusData()
updateText.innerHTML = lastUpdate()