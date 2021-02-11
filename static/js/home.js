function init(country) {
    dropdown();
    global_chart();
    country_chart(country);
    make_map(country);
  }
var country = 'Afghanistan';
function dropdown(){
    d3.csv("../../data/cleaned/avg_temp_per_country.csv").then((data, error) => {
    if (error) throw error;
    var countries = data.map(d=>d.Country);
    var uniqueCountries = [...new Set(countries)];
    for(i=0;i<uniqueCountries.length;i++){
        d3.select("#countries").append('option').attr('id',`${uniqueCountries[i]}`).text(uniqueCountries[i]);
        }
    });
}
function global_chart(){
    // Load in the data
//   d3.json("/financials/hero/data").then((data, error) => {
    d3.csv("../../data/cleaned/global_anomalies.csv").then((data, error) => {
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
            title: "Global anomalies",
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
    
        },100);
      
  });
};
function country_chart(country){
    // Load in the data
//   d3.json("/financials/hero/data").then((data, error) => {
    d3.csv("../../data/cleaned/avg_temp_per_country.csv").then((data, error) => {
        if (error) throw error;
        data = data.filter((d)=>d.Country == country)
        years2 = data.map(d=>d.Year)
        temps = data.map(d=>d.AverageTemperature)
        var year2 = years2[0]
        var temp = temps[0]
        var variance = temps[temps.length-1]-temps[0]
        d3.select('#variance').style('color','white').text("+"+ Number.parseFloat(variance).toFixed(2)+"°");
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
            title: "avg temperatures",
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
        },100);
    });
};
function make_map(country){

}
var country_selected = d3.select("#countries");
country_selected.on("change", updateData);

function updateData() {
  d3.select("#country_temp_chart").remove();
  var value = d3.select("#countries").node().value;
  country = value;
  d3.select("#avg_temp_country").append("div").attr("id", "country_temp_chart");
  country_chart(country);
  make_map(country)
}
init(country)