
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Initialize map
initMap();

function initMap(){
    
    d3.json(url, function(data){
        var earthData = data;
        mapPoints(earthData);
    });
}

function mapPoints(earthData, layer){
    
    var markers = L.geoJSON(earthData, {
        pointToLayer: onEachFeatureMarker,
        onEachFeature: PopUp
    })    
    
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 20,
        id: "light-v10",
        accessToken: "pk.eyJ1IjoibGF1cmFtaDAxOCIsImEiOiJja2JpbGVzanQwZ2cxMnFwN3ZncG05dTd2In0.vuiz60prndaio5dJFKaBtw.eyJ1Ijoic2FsdmFkb3JwYXoiLCJhIjoiY2tiaWowNnhsMGZybTJxcDcxM2w5NXoycCJ9.L9HJzMrf_wk-xIOeS__zDQ"
    });

    
    var baseMaps = {
        "Light Map": lightmap
    };

    
    var overlayMaps = {
        "Earthquakes": L.layerGroup(markers)
    };

    //Create map
    var map = L.map("map", {
        center: [39.8283, -98.5785],
        zoom: 3,
        layers: [lightmap, markers]
    });
    
  
    L.control.layers(null, overlayMaps, {
        collapsed: false
    }).addTo(map);

    
    // Add Legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
      var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5];
        div.innerHTML += "<h4>Legend</h4>";
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += `<i style="background-color:${setColor(i+1)}; color:${setColor(i+1)}">--</i> ${grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')}`;
      }

      return div;
    };
    legend.addTo(map);
    
}

function onEachFeatureMarker(feature, layer){
    console.log(feature.properties.alert)

    var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        fillOpacity: 0.5,
        color: "white",
        fillColor: setColor(feature.properties.mag),
        radius:  feature.properties.mag * 4
      });
    return marker;
}

// Popup
function PopUp(feature, layer){
    layer.bindPopup(`<div style='text-align:center'><h3>${feature.properties.place}</h3><h3>Magnitude:${feature.properties.mag}</h3><p>${new Date(feature.properties.time)}</p></div>`);
}

// Color according to the magnitude
function setColor(mag){
    if(mag < 2 )
        color = "blue";
    else if(mag >= 2 & mag < 3 )
        color = "pink";
    else if(mag >= 3 & mag < 4 )
        color = "green";
    else if(mag >= 4 & mag < 5 )
        color = "yellow";
    else if(mag >= 5 & mag < 6 )
        color = "purple";
    else if(mag >= 6)
        color = "red";
    return color
};