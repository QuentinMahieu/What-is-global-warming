function makeresponsive(){
  d3.select('div> #country_map').remove();

  var height = window.innerHeight;
  var width = window.innerWidth;

  function init(country) {
    dropdown()
    global_chart();
    country_chart(country);
    make_map();
  }

function global_chart(){
    // Load in the data
    d3.json("/glob_anomalies/data").then((data, error) => {
    // d3.csv("../../data/cleaned/global_anomalies.csv").then((data, error) => {
        if (error) throw error;

        years =data.map(d=> d.Year)
        glob_anom = data.map(d=>d['global_anom'])
        var year = years[0]
        var globa = glob_anom[0]
        // Build line chart
        var trace = {
            x: [year],
            y: [globa],
            mode: "scatter",
            line: { shape: "spline" ,color: 'rgb(244, 166, 98)'},
            fill: "none"
        };
        var data = [trace];
        var layout = {
        margin:{'t': 20},
        autosize:true,
        xaxis: {
            tickfont: {
            family: "Helvetica Neue",
            size: 14,
            color: "white"
            },
        },
        yaxis: {
            title: "Temperature anomalies Global",
            titlefont: {
            family: "Helvetica Neue",
            size: 20,
            color: "white",
            automargin:true
            },
            tickfont: {
            family: "Helvetica Neue",
            size: 14,
            color: "white"
            },
        },
        shapes:[{
            type: 'line',
            x0: year,
            y0: 0,
            x1: years[years.length - 1],
            y1: 0,
            line: {
              color: 'red',
              width: 4,
            }
          }],
          annotations: [
            {
              xref: 'paper',
              x: 1,
              y: glob_anom[glob_anom.length -1],
              xanchor: 'right',
              yanchor: 'bottom',
              text: "+"+ glob_anom[glob_anom.length -1].toFixed(2) +' °C',
              font:{
                family: 'Arial',
                size: 16,
                color: 'sandybrown',
              },
              bgcolor:"rgba(255,255,255,0.8)",
              showarrow: false
            },
            {
                xref: 'paper',
                x: 1,
                y: 0,
                xanchor: 'right',
                yanchor: 'bottom',
                text: '13.8°C',
                font:{
                family: 'Arial',
                size: 16,
                color: 'red',
                },
                bgcolor:"rgba(255,255,255,0.8)",
                showarrow: false
          }],

        plot_bgcolor: "transparent",
        paper_bgcolor: "transparent"
        };
        Plotly.newPlot("global_temp_chart", data, layout);
    
        var cnt = 1;
        
        var interval = setInterval(function () {
        
        year = years[cnt]
        globa = glob_anom[cnt]
        
        var update = {
            x: [[year]],
            y: [[globa]]
        };
        Plotly.extendTraces("global_temp_chart", update, [0])
        cnt = cnt+1;
        if (cnt === 140) clearInterval(interval);
    
        },50);
      
  });
};

var country = 'Australia';
function dropdown(){
    d3.json("/avg_country/data").then((data, error) => {
        // d3.csv("../../data/cleaned/avg_temp_per_country.csv").then((data, error) => {
            if (error) throw error;
            //upload the dropdown
            var countries = data.map(d=>d.Country);
            var uniqueCountries = [...new Set(countries)];
            for(i=0;i<uniqueCountries.length;i++){
                d3.select("#countries").append('option').attr('id',`${uniqueCountries[i]}`).text(uniqueCountries[i]);
            }
        });
    }
function country_chart(country){
    // Load in the data
    d3.json("/avg_country/data").then((data, error) => {
    // d3.csv("../../data/cleaned/avg_temp_per_country.csv").then((data, error) => {
        if (error) throw error;
        //upload the dropdown
      

        data = data.filter((d)=>d.Country == country)
        // calculation of baseline per country
        function average(nums) {
            return nums.reduce((a, b) => (a + b)) / nums.length;
        }
        var baseline_data = data.filter((d)=>(d.Year >=1880) & (d.Year <=1900))
        var baseline_map = baseline_data.map(d=>d.AverageTemperature)
        var baseline = average(baseline_map)
        
        years2 = data.map(d=>d.Year)
        temps = data.map(d=>d.AverageTemperature)
        
        var year2 = years2[0]
        var temp = temps[0]
        var variance = temps[temps.length-1]-baseline
        d3.select('#variance').style('color','white').text("+"+ Number.parseFloat(variance).toFixed(2)+"°C");
        // Build line chart
        var trace = {
            x: [year2],
            y: [temp],
            mode: "scatter",
            line: { shape: "spline",color: 'rgb(244, 166, 98)' },
            fill: "none"
        };
        var data = [trace];
        var layout = {
        margin:{'t': 20},
        autosize:true,
        xaxis: {
            tickfont: {
            family: "Helvetica Neue",
            size: 14,
            color: "white"
            },
        },
        yaxis: {
            title: `Temperature anomalies ${country}`,
            titlefont: {
            family: "Helvetica Neue",
            size: 20,
            color: "white",
            automargin:true
            },
            tickfont: {
            family: "Helvetica Neue",
            size: 14,
            color: "white"
            },
        },
        
        plot_bgcolor: "transparent",
        paper_bgcolor: "transparent"
        };
        Plotly.newPlot("country_temp_chart", data, layout);
    
        var cnt = 1;
        
        var interval = setInterval(function () {
        
        year2 = years2[cnt]
        temp = temps[cnt]
        
        var update = {
            x: [[year2]],
            y: [[temp]]
        };
        Plotly.extendTraces("country_temp_chart", update, [0])
        cnt = cnt+1;
        if (cnt === 162) clearInterval(interval);
        },50);
    });
};
function make_map(){

    d3.select('#map_holder')
      .append('div')
      .attr('id','country_map')
      .style('height',`${height/1.5}px`)
      .style('width',`${width*0.93}px`)

    
    var myMap = L.map("country_map", {
        center: [54.5260, 15.2551],
        minZoom: 2,
        zoom: 2
    });
    
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 7,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: "pk.eyJ1IjoicXVlbnRpbm1haGlldSIsImEiOiJja2lpajhqb3owM2ZqMnJtZ2wzMG44OGE3In0.7ne6ZvxuI1Z57ryK2tY7uQ",
        }).addTo(myMap);
      
      var geojson;
    
    d3.json("https://raw.githubusercontent.com/QuentinMahieu/What-is-global-warming/master/data/cleaned/geojson_countries_final.geojson").then((data, error) => {
        if (error) throw error;
    // Create a new choropleth layer
    
    geojson = L.choropleth(data, {
    
    // Define what  property in the features to use
    valueProperty: "temperature_increase",
    
    // Set color scale
    scale: ["ffba08","faa307","f48c06","e85d04","d00000","9d0208","6a040f","370617"],
    
    // Number of breaks in step range
    steps: 8,
    
    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },
    
    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<strong style='font-size:18px;'>" + feature.properties.ADMIN + "</strong>" +
      "<br>Temperature 2013: " + feature.properties.temperature + "°C" +
      "<br>Baseline 1880-1900: " + feature.properties.baseline + "°C" +
      "<br>Temperature Increase: " + feature.properties.temperature_increase + "°C");
    }
    }).addTo(myMap);
    
    // Set up the legend
    var legend = L.control({ position: "topright" });
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];
    
    // Add min & max
    var legendInfo = "<h1>Temperature increase</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "°C"+"</div>" +
        "<div class=\"max\">" + limits[limits.length - 1]+ "°C" + "</div>" +
      "</div>";
    
    div.innerHTML = legendInfo;
    
    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });
    
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
    };
    
    // Adding legend to the map
    legend.addTo(myMap);
    
    });
 };

var country_selected = d3.select("#countries");
country_selected.on("change", updateData);

function updateData() {
  d3.event.preventDefault();
  d3.select("#country_temp_chart").remove();
  var value = d3.select("#countries").node().value;
  country = value;
  d3.select("#avg_temp_country").append("div").attr("id", "country_temp_chart");
  country_chart(country);
}
init(country)
}
makeresponsive();

d3.select(window).on("resize", makeresponsive);