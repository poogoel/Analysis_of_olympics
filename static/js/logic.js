

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/games").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      console.log("init"+firstSample);
      getData(firstSample);
      
     
    });
  }

var LeafIcon = L.Icon.extend({
  options: {
      shadowUrl: 'https://github.com/poogoel/Analysis_of_olympics/blob/master/static/js/leaf-shadow.png?raw=true',
      iconSize:     [38, 95],
      shadowSize:   [50, 64],
      iconAnchor:   [22, 94],
      shadowAnchor: [4, 62],
      popupAnchor:  [-3, -76]
  }
});

var goldMedalIcon = new LeafIcon({iconUrl: 'https://github.com/poogoel/Analysis_of_olympics/blob/master/static/js/Gold.png?raw=true'}),
    silverMedalIcon = new LeafIcon({iconUrl: 'https://github.com/poogoel/Analysis_of_olympics/blob/master/static/js/Silver.png?raw=true'}),
    BronzeMedalIcon = new LeafIcon({iconUrl: 'https://github.com/poogoel/Analysis_of_olympics/blob/master/static/js/Bronze.png?raw=true'});

async function getData(sample){
//Clear Current map HTML to reset:
;

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  const data= await d3.json('/medals/'+sample).then(data=>buildMap(data))
}

function buildMap(countries){
    console.log(countries)
    // Create a map object
var myMap = L.map("map", {
        center: [0, 0],
        zoom: 3
    });

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
}).addTo(myMap);


// Loop through the cities array and create one marker for each city object
countries.forEach(country => {
    var location=[country.lat, country.long];
        if(country.long == null || country.lat == null){
            location=[25,-50]
        }
    // Conditionals for countries points
    let color = "";
    if (country.gold > country.silver &&country.gold > country.bronze) {
        color = "gold";
        L.marker(location, {
            icon: goldMedalIcon
            
           }).bindPopup("<h1>" + country.Name + "</h1> <hr> <br>Total events competed: "+country.count+"<h3>Medals:  <br>Gold: "+country.gold+"<br>Silver: "+country.silver+"<br>Bronze: "+country.bronze+"</h3>").addTo(myMap);
    }
    else if (country.silver > country.bronze) {
        color = "silver";
        L.marker(location, {
            icon: silverMedalIcon
            
           }).bindPopup("<h1>" + country.Name + "</h1> <hr> <br>Total events competed: "+country.count+"<h3>Medals:  <br>Gold: "+country.gold+"<br>Silver: "+country.silver+"<br>Bronze: "+country.bronze+"</h3>").addTo(myMap);
    }
    else if (country.bronze > 0) {
        color = "bronze";
        L.marker(location, {
            icon:  BronzeMedalIcon
            
           }).bindPopup("<h1>" + country.Name + "</h1> <hr> <br>Total events competed: "+country.count+"<h3>Medals:  <br>Gold: "+country.gold+"<br>Silver: "+country.silver+"<br>Bronze: "+country.bronze+"</h3>").addTo(myMap);
    }
    else {
        color = "black";
        L.circle(location, {
            fillOpacity: 0.75,
            color: "white",
            fillColor: color,
            // Adjust radius
            radius: country.count * 1500
            
           }).bindPopup("<h1>" + country.Name + "</h1> <hr> <br>Total events competed: "+country.count+"<h3>Medals:  <br>Gold: "+country.gold+"<br>Silver: "+country.silver+"<br>Bronze: "+country.bronze+"</h3>").addTo(myMap);
    }

})
}
function optionChanged(newSample) {
    const mapSelector = d3.select("#map");
    mapSelector.html("")
    // Fetch new data each time a new sample is selected
    getData(newSample);
      }
      
init();
// needs added to HTML : this is where the list of the
// different olymics will append to and will call the new map when new value is selected.
//Must not be nested in map html or it will be wiped.

//<select id="selDataset" onchange="optionChanged(this.value)"></select>