columns = ["Orbital changes", "Solar", "Volcanic", "Natural", "Land use", "Ozone", "Anthropogenic tropospheric aerosol", "Greenhouse gases", "Human", "All forcings"]
names = ['Orbital',"Solar","Volcanic","Natural","Deforestation","Ozone Pollution",'Aerosols Pollution',"Greenhouses","Human","All"]
function init() {
  try{
    Plotly.deleteTraces("graphic", [0,1]);
    d3.selectAll('button').remove();
    d3.selectAll('div>#cause').remove();
  }catch(error){
    console.log(error)
  }
  global_chart();
};
function global_chart(){
  // Load in the data
  d3.json("/glob_anomalies/data").then((data, error) => {
  // d3.csv("../../data/cleaned/global_anomalies.csv").then((data, error) => {
      
      if (error) throw error;
      d3.select('#buttons').append('button')
      .attr('type','button')
      .attr('value',`${columns[0]}`)
      .attr('onclick','new_chart()')
      .attr('class','but')
      .attr('id','button1')
      .text(`${names[0]}`)

      years = data.map(d=> d.Year)
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
      title : {text:`Global Warming anomalies vs pre-industrial avg temperature`,
               font:{color:'white',
                     size:18}},
      showlegend: false,
      margin:{'t': 60},
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
      Plotly.newPlot("graphic", data, layout);
  
      var cnt = 1;
      
      var interval = setInterval(function () {
      
      year = years[cnt]
      globa = glob_anom[cnt]
      
      var update = {
          x: [[year]],
          y: [[globa]]
      };
      Plotly.extendTraces("graphic", update, [0])
      cnt = cnt+1;
      if (cnt === 140) clearInterval(interval);
  
      },20);
  });
};
function new_chart(){
  // Load in the data
  d3.json("/glob_anomalies/data").then((data, error) => {
  // d3.csv("../../data/cleaned/global_anomalies.csv").then((data, error) => {
      if (error) throw error;

      d3.select('#buttons').append('button')
      .attr('type','button')
      .attr('value',`${columns[1]}`)
      .attr('onclick','new_chart1()')
      .attr('class','but')
      .attr('id','button2')
      .text(`${names[1]}`)

      var div = d3.select("#dynamic").append('div')
      .attr('class','row justify-content-center vertical-center').attr('id','cause')
      div.append('h3').attr('id','titlecause').style('text-align','center').text("Is it the Earth's Orbit?")
      div.append('p').attr('id','textcause').style('text-align','center').text(`
      The Earth's Orbit changes over centuries. It pushes the 
      climate into and out of ice ages. Nonetheless based on the research,
      its influence in the last century has been negligible.
      `)

      var f = d3.select('#button1').node().value;

      years =data.map(d=> d.Year)
      feature = data.map(d=>d[f])
      
      var year = years[0]
      var feat = feature[0]

      // Build line chart
     
      var trace1 = {
        x: [year],
        y: [feat],
        mode: "scatter",
        line: { shape: "spline" ,color: 'white'},
        fill: "none"
      };
      var data = [trace1];
      var update = {
        title : {text:`Global Warming anomalies explained by ${columns[0]}`,
                 font:{color:'white',
                       size:18}}
      }
      
      Plotly.relayout("graphic", update);
      Plotly.addTraces("graphic", data);
  
      var cnt = 1;
      
      var interval = setInterval(function () {
      
      year = years[cnt]
      feat = feature[cnt]
      
      var update1 = {
          x: [[year]],
          y: [[feat]],
      };
      Plotly.extendTraces("graphic", update1, [1])
      cnt = cnt+1;
      if (cnt === 140) clearInterval(interval);
  
      },20);
  });
};
function new_chart1(){
  // Load in the data
  d3.json("/glob_anomalies/data").then((data, error) => {
  // d3.csv("../../data/cleaned/global_anomalies.csv").then((data, error) => {
      if (error) throw error;
      //reset buttons and text
      d3.select("#titlecause").html('');
      d3.select("textcause").html('');
      Plotly.deleteTraces("graphic", 1);
      
      d3.select('#buttons').append('button')
      .attr('type','button')
      .attr('value',`${columns[2]}`)
      .attr('onclick','new_chart2()')
      .attr('class','but')
      .attr('id','button3')
      .text(`${names[2]}`)

      d3.select('#titlecause').text("Is it the Sun?")
      d3.select('#textcause').text(`
      The sun's temperatures varies over decades. We obeserve that these 
      variations had almost no effect on the Earth's overall climate.
      `)

      var f = d3.select('#button2').node().value;

      years =data.map(d=> d.Year)
      feature = data.map(d=>d[f])
      
      var year = years[0]
      var feat = feature[0]

      // Build line chart
     
      var trace1 = {
        x: [year],
        y: [feat],
        mode: "scatter",
        line: { shape: "spline" ,color: 'white'},
        fill: "none"
      };
      var data = [trace1];
      var update = {
        title : {text:`Global Warming anomalies explained by ${columns[1]} changes`,
                 font:{color:'white',
                       size:18}}
      }
      
      Plotly.relayout("graphic", update); 
      Plotly.addTraces("graphic", data);
  
      var cnt = 1;
      
      var interval = setInterval(function () {
      
      year = years[cnt]
      feat = feature[cnt]
      
      var update1 = {
          x: [[year]],
          y: [[feat]],
      };
      Plotly.extendTraces("graphic", update1, [1])
      cnt = cnt+1;
      if (cnt === 140) clearInterval(interval);
  
      },20);
  });
};
function new_chart2(){
  // Load in the data
  d3.json("/glob_anomalies/data").then((data, error) => {
  // d3.csv("../../data/cleaned/global_anomalies.csv").then((data, error) => {
      if (error) throw error;
      d3.select('#titlecause').html("");
      d3.select('#textcause').html("");
      Plotly.deleteTraces("graphic", 1);
      
      d3.select('#buttons').append('button')
      .attr('type','button')
      .attr('value',`${columns[3]}`)
      .attr('onclick','new_chart3()')
      .attr('class','but')
      .attr('id','button4')
      .text(`${names[3]}`)

      d3.select('#titlecause').text("Is it Volcanoes?")
      d3.select('#textcause').text(`
      The volcanic activities and eruptions emit CO2. But it also emits
      sulfate chemicals that cool the atmosphere for one to two years.
      `)
      var f = d3.select('#button3').node().value;

      years =data.map(d=> d.Year)
      feature = data.map(d=>d[f])
      
      var year = years[0]
      var feat = feature[0]

      // Build line chart
     
      var trace1 = {
        x: [year],
        y: [feat],
        mode: "scatter",
        line: { shape: "spline" ,color: 'white'},
        fill: "none"
      };
      var data = [trace1];
      var update = {
        title : {text:`Global Warming anomalies explained by ${columns[2]} erruptions`,
                 font:{color:'white',
                       size:18}}
      }
      
      Plotly.relayout("graphic", update);
      Plotly.addTraces("graphic", data);
  
      var cnt = 1;
      
      var interval = setInterval(function () {
      
      year = years[cnt]
      feat = feature[cnt]
      
      var update1 = {
          x: [[year]],
          y: [[feat]],
      };
      Plotly.extendTraces("graphic", update1, [1])
      cnt = cnt+1;
      if (cnt === 140) clearInterval(interval);
  
      },20);
  });
};
function new_chart3(){
  // Load in the data
  d3.json("/glob_anomalies/data").then((data, error) => {
  // d3.csv("../../data/cleaned/global_anomalies.csv").then((data, error) => {
      if (error) throw error;
      d3.select('#titlecause').html("");
      d3.select('#textcause').html("");
      Plotly.deleteTraces("graphic", 1);
      
      d3.select('#buttons').append('button')
      .attr('type','button')
      .attr('value',`${columns[4]}`)
      .attr('onclick','new_chart4()')
      .attr('class','but')
      .attr('id','button5')
      .text(`${names[4]}`)

      d3.select('#titlecause').text("Is it the 3 natural causes combined?")
      d3.select('#textcause').text(`
      We clearly observe that the curve doesn't follow the observed temperature curve.
      `)
      var f = d3.select('#button4').node().value;

      years =data.map(d=> d.Year)
      feature = data.map(d=>d[f])
      
      var year = years[0]
      var feat = feature[0]

      // Build line chart
     
      var trace1 = {
        x: [year],
        y: [feat],
        mode: "scatter",
        line: { shape: "spline" ,color: 'white'},
        fill: "none"
      };
      var data = [trace1];
      var update = {
        title : {text:`Global Warming anomalies explained by all ${columns[3]} changes`,
                 font:{color:'white',
                       size:18}}
      }
      
      Plotly.relayout("graphic", update);
      Plotly.addTraces("graphic", data);
  
      var cnt = 1;
      
      var interval = setInterval(function () {
      
      year = years[cnt]
      feat = feature[cnt]
      
      var update1 = {
          x: [[year]],
          y: [[feat]],
      };
      Plotly.extendTraces("graphic", update1, [1])
      cnt = cnt+1;
      if (cnt === 140) clearInterval(interval);
  
      },20);
  });
};
function new_chart4(){
  // Load in the data
  d3.json("/glob_anomalies/data").then((data, error) => {
  // d3.csv("../../data/cleaned/global_anomalies.csv").then((data, error) => {
      if (error) throw error;
      d3.select('#titlecause').html("");
      d3.select('#textcause').html("");
      Plotly.deleteTraces("graphic", 1);
      
      d3.select('#buttons').append('button')
      .attr('type','button')
      .attr('value',`${columns[5]}`)
      .attr('onclick','new_chart5()')
      .attr('class','but')
      .attr('id','button6')
      .text(`${names[5]}`)

      d3.select('#titlecause').text("Let's find out about Human causes, what about Deforestation?")
      d3.select('#textcause').text(`
      Humans have cut, plowed and paved more than half the Earth's land surface.
      Thick forrest gave place to lighter patches, which reflect more sunligth and 
      have a slight cooling effect.
      `)
      var f = d3.select('#button5').node().value;

      years =data.map(d=> d.Year)
      feature = data.map(d=>d[f])
      
      var year = years[0]
      var feat = feature[0]

      // Build line chart
     
      var trace1 = {
        x: [year],
        y: [feat],
        mode: "scatter",
        line: { shape: "spline" ,color: 'white'},
        fill: "none"
      };
      var data = [trace1];
      var update = {
        title : {text:`Global Warming anomalies explained by ${names[4]}`,
                 font:{color:'white',
                       size:18}}
      }
      
      Plotly.relayout("graphic", update);
      Plotly.addTraces("graphic", data);
  
      var cnt = 1;
      
      var interval = setInterval(function () {
      
      year = years[cnt]
      feat = feature[cnt]
      
      var update1 = {
          x: [[year]],
          y: [[feat]],
      };
      Plotly.extendTraces("graphic", update1, [1])
      cnt = cnt+1;
      if (cnt === 140) clearInterval(interval);
  
      },20);
  });
};
function new_chart5(){
  // Load in the data
  d3.json("/glob_anomalies/data").then((data, error) => {
  // d3.csv("../../data/cleaned/global_anomalies.csv").then((data, error) => {
      if (error) throw error;
      d3.select('#titlecause').html("");
      d3.select('#textcause').html("");
      Plotly.deleteTraces("graphic", 1);
      
      d3.select('#buttons').append('button')
      .attr('type','button')
      .attr('value',`${columns[6]}`)
      .attr('onclick','new_chart6()')
      .attr('class','but')
      .attr('id','button7')
      .text(`${names[6]}`)

      d3.select('#titlecause').text("Could it be Ozone pollution?")
      d3.select('#textcause').text(`
      Natural ozone high in the atmosphere blocks harmful sunlight and cools the global temperature slightly .
      Ozone pollution is different from greenhouse gases. The former are gases, solids or liquid aerosols
      that exceed the environnement to dissipate (ash, fog, soot etc.).
      `)
      var f = d3.select('#button6').node().value;

      years =data.map(d=> d.Year)
      feature = data.map(d=>d[f])
      
      var year = years[0]
      var feat = feature[0]

      // Build line chart
     
      var trace1 = {
        x: [year],
        y: [feat],
        mode: "scatter",
        line: { shape: "spline" ,color: 'white'},
        fill: "none"
      };
      var data = [trace1];
      var update = {
        title : {text:`Global Warming anomalies explained by ${names[5]}`,
                 font:{color:'white',
                       size:18}}
      }
      
      Plotly.relayout("graphic", update);
      Plotly.addTraces("graphic", data);
  
      var cnt = 1;
      
      var interval = setInterval(function () {
      
      year = years[cnt]
      feat = feature[cnt]
      
      var update1 = {
          x: [[year]],
          y: [[feat]],
      };
      Plotly.extendTraces("graphic", update1, [1])
      cnt = cnt+1;
      if (cnt === 140) clearInterval(interval);
  
      },20);
  });
};
function new_chart6(){
  // Load in the data
  d3.json("/glob_anomalies/data").then((data, error) => {
  // d3.csv("../../data/cleaned/global_anomalies.csv").then((data, error) => {
      if (error) throw error;
      d3.select('#titlecause').html("");
      d3.select('#textcause').html("");
      Plotly.deleteTraces("graphic", 1);
      
      d3.select('#buttons').append('button')
      .attr('type','button')
      .attr('value',`${columns[7]}`)
      .attr('onclick','new_chart7()')
      .attr('class','but')
      .attr('id','button8')
      .text(`${names[7]}`)

      d3.select('#titlecause').text("Or Aerosol pollution?")
      d3.select('#textcause').text(`
      Some polluants cool the athmosphere, like sulfate aerosols from coal-burning. This offsets
      some of the warming effect (but they cause acid rain).
      `)
      var f = d3.select('#button7').node().value;

      years =data.map(d=> d.Year)
      feature = data.map(d=>d[f])
      
      var year = years[0]
      var feat = feature[0]

      // Build line chart
     
      var trace1 = {
        x: [year],
        y: [feat],
        mode: "scatter",
        line: { shape: "spline" ,color: 'white'},
        fill: "none"
      };
      var data = [trace1];
      var update = {
        title : {text:`Global Warming anomalies explained by ${names[6]}`,
                 font:{color:'white',
                       size:18}}
      }
      
      Plotly.relayout("graphic", update);
      Plotly.addTraces("graphic", data);
  
      var cnt = 1;
      
      var interval = setInterval(function () {
      
      year = years[cnt]
      feat = feature[cnt]
      
      var update1 = {
          x: [[year]],
          y: [[feat]],
      };
      Plotly.extendTraces("graphic", update1, [1])
      cnt = cnt+1;
      if (cnt === 140) clearInterval(interval);
  
      },20);
  });
};
function new_chart7(){
  // Load in the data
  d3.json("/glob_anomalies/data").then((data, error) => {
  // d3.csv("../../data/cleaned/global_anomalies.csv").then((data, error) => {
      if (error) throw error;
      d3.select('#titlecause').html("");
      d3.select('#textcause').html("");
      Plotly.deleteTraces("graphic", 1);
      
      d3.select('#buttons').append('button')
      .attr('type','button')
      .attr('value',`${columns[8]}`)
      .attr('onclick','new_chart8()')
      .attr('class','but')
      .attr('id','button9')
      .text(`${names[8]}`)

      d3.select('#titlecause').text("No, it is simply the Greenhouse gases..")
      d3.select('#textcause').text(`
      There is 40% more CO2 in the athmosphere than in 1800. According to the research, 
      we can see that the greenhouse curve has the hightest influence on Global warming. 
      `)

      var f = d3.select('#button8').node().value;

      years =data.map(d=> d.Year)
      feature = data.map(d=>d[f])
      
      var year = years[0]
      var feat = feature[0]

      // Build line chart
     
      var trace1 = {
        x: [year],
        y: [feat],
        mode: "scatter",
        line: { shape: "spline" ,color: 'white'},
        fill: "none"
      };
      var data = [trace1];
      var update = {
        title : {text:`Global Warming anomalies explained by ${columns[7]}`,
                 font:{color:'white',
                       size:18}}
      }
      
      Plotly.relayout("graphic", update);
      Plotly.addTraces("graphic", data);
  
      var cnt = 1;
      
      var interval = setInterval(function () {
      
      year = years[cnt]
      feat = feature[cnt]
      
      var update1 = {
          x: [[year]],
          y: [[feat]],
      };
      Plotly.extendTraces("graphic", update1, [1])
      cnt = cnt+1;
      if (cnt === 140) clearInterval(interval);
  
      },20);
  });
};
function new_chart8(){
  // Load in the data
  d3.json("/glob_anomalies/data").then((data, error) => {
  // d3.csv("../../data/cleaned/global_anomalies.csv").then((data, error) => {
      if (error) throw error;
      d3.select('#titlecause').html("");
      d3.select('#textcause').html("");
      Plotly.deleteTraces("graphic", 1);
      
      d3.select('#buttons').append('button')
      .attr('type','button')
      .attr('value',`${columns[9]}`)
      .attr('onclick','new_chart9()')
      .attr('class','but')
      .attr('id','button10')
      .text(`${names[9]}`)

      d3.select('#titlecause').text("Let's now combine the human causes together")
      d3.select('#textcause').text(`
      Greenhouse gases warm the Earth up, Aerosols gases cool it down a little, Ozone and land use 
      add and substract a little bit. Together they match the curve of the observed anomalies
      especially since the 50's.
      `)

      var f = d3.select('#button9').node().value;

      years =data.map(d=> d.Year)
      feature = data.map(d=>d[f])
      
      var year = years[0]
      var feat = feature[0]

      // Build line chart
     
      var trace1 = {
        x: [year],
        y: [feat],
        mode: "scatter",
        line: { shape: "spline" ,color: 'white'},
        fill: "none"
      };
      var data = [trace1];
      var update = {
        title : {text:`Global Warming anomalies explained by ${columns[8]} changes`,
                 font:{color:'white',
                       size:18}}
      }
      
      Plotly.relayout("graphic", update);
      Plotly.addTraces("graphic", data);
  
      var cnt = 1;
      
      var interval = setInterval(function () {
      
      year = years[cnt]
      feat = feature[cnt]
      
      var update1 = {
          x: [[year]],
          y: [[feat]],
      };
      Plotly.extendTraces("graphic", update1, [1])
      cnt = cnt+1;
      if (cnt === 140) clearInterval(interval);
  
      },20);
  });
};
function new_chart9(){
  // Load in the data
  d3.json("/glob_anomalies/data").then((data, error) => {
  // d3.csv("../../data/cleaned/global_anomalies.csv").then((data, error) => {
      if (error) throw error;
      d3.select('#titlecause').html("");
      d3.select('#textcause').html("");
      Plotly.deleteTraces("graphic", 1);
      
      d3.select('#buttons').append('button')
      .attr('type','button')
      .attr('onclick','init()')
      .attr('class','but')
      .attr('id','button11')
      .text('Reset')

      d3.select('#titlecause').text("Natural changes and Human changes combined?")
      d3.select('#textcause').append('p').text(`
      We could observe that Natural causes didn't impact significantly the increase in temperature over the last 
      century. As shown on the graph, the curve of all causes together is almost the same as
      the one caused by Humans.
      According to the research, this is the reason why acting on the Greenhouse gas emissions is 
      a priority for the actual and the future generations.
      
      `)
      d3.select('#textcause').append('p').style('color','sandybrown').html("<br><strong>But why is it so important? Let's have a look at the effects.</strong>")
      d3.select('#textcause').append('div')
      .attr('class','row justify-content-end mt-4 mr-2')
      .html('<a class="next round" href="/effects">Effects &#8250;</a>')

      var f = d3.select('#button10').node().value;

      years =data.map(d=> d.Year)
      feature = data.map(d=>d[f])
      
      var year = years[0]
      var feat = feature[0]

      // Build line chart
     
      var trace1 = {
        x: [year],
        y: [feat],
        mode: "scatter",
        line: { shape: "spline" ,color: 'white'},
        fill: "none"
      };
      var data = [trace1];
      var update = {
        title : {text:`Global Warming anomalies explained Human and Natural changes`,
                 font:{color:'white',
                       size:18}}
      }
      
      Plotly.relayout("graphic", update);
      Plotly.addTraces("graphic", data);
  
      var cnt = 1;
      
      var interval = setInterval(function () {
      
      year = years[cnt]
      feat = feature[cnt]
      
      var update1 = {
          x: [[year]],
          y: [[feat]],
      };
      Plotly.extendTraces("graphic", update1, [1])
      cnt = cnt+1;
      if (cnt === 140) clearInterval(interval);
  
      },20);
  });
};

init();
