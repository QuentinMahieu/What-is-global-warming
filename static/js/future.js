
function init() {
    global_chart();
  }


function global_chart(){
    // Load in the data
  d3.json("/glob_projection/data").then((data, error) => {
    // d3.csv("../../data/cleaned/global_projection.csv").then((data, error) => {
        if (error) throw error;

        years =data.map(d=> d.Year)
        var year = years[0]

        // Build line chart
        var trace = {
            x: [year],
            y: [0],
            mode: "scatter",
            line: { shape: "spline" ,color: 'red'},
            text: "13.8°C",
            textposition: 'top',
            fill: "none"
        };
        var data = [trace];
        var layout = {
        autosize:true,
        dragmode: 'zoom',
        showlegend: false,
        title:{text:"Baseline average temperature of 13.8°C",
                font:{color:'white',
                size:18},
            },
        margin:{'t': 60,
                'b': 60},
        xaxis: {
            tickfont: {
                family: "Helvetica Neue",
                size: 14,
                color: "white"
            },
            autorange:true,
            range: [1958, 2100],
            rangeslider: {range: [1958, 2100]},
        },
        yaxis: {
            tickfont: {
                family: "Helvetica Neue",
                size: 14,
                color: "white"
            },
        },

        plot_bgcolor: "transparent",
        paper_bgcolor: "transparent"
        };
        var config = {responsive: true}

        Plotly.newPlot("linechart", data, layout,config);
    
        var cnt = 1;
    
        var interval = setInterval(function () {
        
        year = years[cnt]
        
        var update = {
            x: [[year]],
            y:[[0]],
        };
        Plotly.extendTraces("linechart", update, [0])
        cnt = cnt+1;
        if (cnt === years.length) clearInterval(interval);
        },50);
      
  });
};

function plotline(value) {
   
    // Load in the data
  d3.json("/glob_projection/data").then((data, error) => {
    // d3.csv("../../data/cleaned/global_projection.csv").then((data, error) => {
    if (error) throw error;
    
    d3.select('#logos').selectAll('li').remove();
    try{
        Plotly.deleteTraces("linechart", 1);
    }catch(error){
        console.log(error)
    }   

    if (value === 'CO2(ppm)'){
        var title = 'Greenhouse Gas Projections (2100)';
        var yaxis = 'CO2 (ppm)';
        var t = 'ppm';
        var ul = d3.select('#logos').select('ul')
        ul.append('li').style('margin-top','50%').html('<img id="im" src="https://upload.wikimedia.org/wikipedia/en/thumb/4/44/MIT_Seal.svg/1200px-MIT_Seal.svg.png" title= "MIT" style="height: 50px;width: auto;float:left;"/>665 ppm')
        ul.append('li').style('margin-top','50%').html('<img id="im" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/NOAA_logo.svg/1024px-NOAA_logo.svg.png" title= "NOAA" style="height: 50px;width: auto;float:left;"/>800 ppm')
    }else if((value === 'global_anom')){
        var title = 'Global Warming Projections (2100)';
        var yaxis = 'Average Temperature increase (°C)';
        var t = '°C';
        var ul = d3.select('#logos').select('ul')
        ul.append('li').style('margin-top','50%').html('<img id="im" src="https://upload.wikimedia.org/wikipedia/en/thumb/4/44/MIT_Seal.svg/1200px-MIT_Seal.svg.png" title= "MIT" style="height: 50px;width: auto;float:left;"/>3.3°C')
        ul.append('li').style('margin-top','50%').html('<img id="im" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/NOAA_logo.svg/1024px-NOAA_logo.svg.png" title= "NOAA" style="height: 50px;width: auto;float:left;"/>3.1°C')
    }else{
        var title = 'Sea Level Projections (2100)';
        var yaxis = 'Sea Level increase (mm)';
        var t = 'mm';
        var ul = d3.select('#logos').select('ul')
        ul.append('li').style('margin-top','50%').html('<img id="im" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png" title= "NASA" style="height: 50px;width: auto;float:left;"/>400 mm')
        ul.append('li').style('margin-top','50%').html('<img id="im" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/NOAA_logo.svg/1024px-NOAA_logo.svg.png" title= "NOAA" style="height: 50px;width: auto;float:left;"/>322-632 mm')
    };

    years =data.map(d=> d.Year)
    feature = data.map(d=> + d[value])

    var year = years[0]
    var feat = feature[0]

    // Build line chart
    var color= 'sandybrown';
   
    var trace1 = {
      x: [year],
      y: [feat],
      mode: "scatter",
      line: { shape: "spline" ,color:'sandybrown'},
      fill: "none",
    };
    var dat = [trace1];

    var update = {
        title : {text:`${title}`,
               font:{color:'white',
                     size:18},
                },
        yaxis: {
            title: `${yaxis}`,
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
        annotations: [
            {
              xref: 'paper',
              x: 1,
              y: feature[feature.length -1],
              xanchor: 'right',
              yanchor: 'bottom',
              text: feature[feature.length -1].toFixed(2) +''+ t,
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
                x: 0.05,
                y: feature[0],
                xanchor: 'right',
                yanchor: 'bottom',
                text: feature[0].toFixed(2) +''+ t,
                font:{
                family: 'Arial',
                size: 16,
                color: 'sandybrown',
                },
                bgcolor:"rgba(255,255,255,0.8)",
                showarrow: false
        }],
    }
    
    Plotly.relayout("linechart", update);
    Plotly.addTraces("linechart", dat);

    if (value === 'global_anom'){
        var bound = data.filter(d=> + (d[value] >= 1.98 && d[value] <= 2.01))
        console.log(bound[0][value])
        var update2 = {
            annotations:[
                {
                    xref: 'paper',
                    x: 1,
                    y: feature[feature.length -1],
                    xanchor: 'right',
                    yanchor: 'bottom',
                    text: feature[feature.length -1].toFixed(2) +''+ t,
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
                      x: 0.05,
                      y: feature[0],
                      xanchor: 'right',
                      yanchor: 'bottom',
                      text: feature[0].toFixed(2) +''+ t,
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
                x: 0.6,
                y: bound[0][value],
                xanchor: 'right',
                yanchor: 'bottom',
                text: bound[0][value].toFixed(2) +''+ t,
                font:{
                  family: 'Arial',
                  size: 16,
                  color: 'Red',
                },
                bgcolor:"rgba(255,255,255,0.8)",
                showarrow: true,
                arrowcolor: 'red',
                arrowhead: 3,
                ax: -25,
                ay: -40
              }
            ],
        };
        Plotly.relayout("linechart",update2,[1])
    }

    var cnt = 1;
    
    var interval = setInterval(function () {
    
    year = years[cnt]
    feat = feature[cnt]

    var update1 = {
        x: [[year]],
        y: [[feat]],
    };
    Plotly.extendTraces("linechart", update1, [1])
    cnt = cnt+1;
    if (cnt === years.length) clearInterval(interval);

    },20);
});
};
init()