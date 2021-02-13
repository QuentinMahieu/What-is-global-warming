var chosenYAxis = "max_temp";
function makeResponsive(chosenYAxis){
    var svgArea = d3.select("body").selectAll("svg");
    // clear svg if not empty
    svgArea.remove();
    
    var svgWidth = (window.innerWidth)*.9;
    var svgHeight = (window.innerHeight)*.7;
    var margin = {
        top: 20,
        right: 20,
        bottom:60,
        left:60
        }
    var chartWidth = svgWidth - margin.right - margin.left;
    var chartHeight = svgHeight - margin.top - margin.bottom;
    
        //creates the svg wrapper and the chartgroup
    var svg = d3.select('#scatter')
            .append('svg')
            .attr('width',svgWidth)
            .attr('height',svgHeight)  
    //Initial Params
    var ycolumns = ['max_temp','min_temp','rainfall_anom',
        'day_cloud','drough_index','lightning_count','hails_count',
        'tornado_count','waterspouts_count','wind_speed_avg'];
    var chosenXAxis = "avg_temp";
    
    
    function init(chosenYAxis){
        makeScatter(chosenYAxis);
    };
    function xScale(data,chosenXAxis){
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis])-0.5,
            d3.max(data, d => d[chosenXAxis])+0.5])
        .range([0,chartWidth]);
        return xLinearScale;
    };
    function yScale(data,chosenYAxis){
        var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis])-1,
            d3.max(data, d => d[chosenYAxis])+1.1])
        .range([chartHeight,0]);
        return yLinearScale;
    };
    function initXAxis(xLinearScale,chartGroup){
        var bottomAxis = d3.axisBottom(xLinearScale).ticks(8);
        var xAxis = chartGroup.append('g')
            .attr("transform",`translate(0,${chartHeight})`)
            .style("color","white")
            .call(bottomAxis);
        return xAxis
    };
    function initYAxis(yLinearScale,chartGroup){
        var leftAxis = d3.axisLeft(yLinearScale).ticks(5);
        var yAxis = chartGroup.append("g")
            .style("color","white")
            .call(leftAxis);
        return yAxis
    };
    function createCirclesGroup(data,chartGroup){
        var circlesGroups = chartGroup.selectAll("g circle")
            .data(data)
            .enter()
            .append("g");
        return circlesGroups
    };
    function makeCircles(circlesGroups,xLinearScale,yLinearScale){
        var circles = circlesGroups.append("circle")
        .transition()
            .duration(1500)
        .attr('class', d=>"y" + d.Year)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "8")
        .attr("fill", d => getColor(d["avg_temp"]))
        .attr("opacity",d => (d[chosenYAxis] == 0) ? 0 :0.7)
        .attr("stroke-width", d => (d[chosenYAxis] == 0) ? "0" :"1")
        .attr("stroke", "white");
        return circles
    };
    //creates color and opacity functions per year of data 
    function getColor(d){
      var color = ['#a50026','#d73027','#f46d43','#fdae61',
        '#fee090','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695'];
      var range = [0.8,0.6,0.4,0.2,0,-0.2,-0.4,-0.6,-0.8];
      for(i=0;i<range.length;i++){
          if (d > range[i]){
              return color[i];
          }
      }
    };
    // update tooltip function
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
        var xlabel;
        var ylabel;
        if (chosenXAxis === 'avg_temp'){
            xlabel = "Average Temperature: ";
            xxlabel = "Anomalie (vs 21.8°C): ";
        }
        if (chosenYAxis === ycolumns[0]){
            ylabel = "Temperature max: ";
            var degrees = "°C";
        }else if(chosenYAxis === ycolumns[1]) {
            ylabel = "Temperature min: ";
            var degrees = "°C";
        }else if(chosenYAxis === ycolumns[2]){ 
            ylabel = "Rainfall anomalie: ";
            var degrees = "mm";
        }else if(chosenYAxis === ycolumns[3]){ 
            ylabel = "Cloud days: ";
            var degrees = "";
        }else if(chosenYAxis === ycolumns[4]){ 
            ylabel = "Drough index: ";
            var degrees = "";
        }else if(chosenYAxis === ycolumns[5]){ 
          ylabel = "Lightning count: ";
          var degrees = "";
        }else if(chosenYAxis === ycolumns[6]){ 
          ylabel = "Hails count: ";
          var degrees = "";
        }else if(chosenYAxis === ycolumns[7]){ 
          ylabel = "Tornado count: ";
          var degrees = "";
        }else if(chosenYAxis === ycolumns[8]){ 
          ylabel = "Waterspout count: ";
          var degrees = "";
        }else{
            ylabel = "Wind speed average: ";
            var degrees = "";
        }
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-70, 30])
            .html(function(d){
                return (`<strong>${d.Year}</strong><hr>${xlabel}${parseFloat(d[chosenXAxis]+21.8).toFixed(2)}°C<br>
                ${xxlabel}${parseFloat(d[chosenXAxis]).toFixed(2)}${degrees}<br>
                ${ylabel}${parseFloat(d[chosenYAxis]).toFixed(2)}${degrees}`);
        });
        circlesGroup.call(tip);
        circlesGroup.on('mouseover', function(d) {
            tip.show(d, this);
        })
        .on('mouseout', function(d) {
            tip.hide(d);
        }); 
        return circlesGroup;
    };
    function makeScatter(chosenYAxis){
        var chartGroup = svg.append('g')
            .attr('class', "scatterplot")
            .attr('transform', `translate(${margin.left},${margin.top})`);
      //   d3.json("/scatter/data")
        d3.csv("../../data/cleaned/australia_extreme_summary.csv").then((data,error)=>{
            if (error) throw error;
            
            //Format the data
            data.forEach((d)=>{
                d['avg_temp'] = + d['avg_temp'];
                for(i=0;i<ycolumns.length;i++){
                  d[ycolumns[i]] = + parseFloat(d[ycolumns[i]]).toFixed(2);
                }
            });
        ///creates the initial chart/////////
            // creates scales
            var xLinearScale = xScale(data,chosenXAxis);
            var yLinearScale = yScale(data,chosenYAxis);
            //append axes
            initXAxis(xLinearScale,chartGroup);
            initYAxis(yLinearScale,chartGroup);  
            // append circles
            var circlesGroups = createCirclesGroup(data,chartGroup);
            makeCircles(circlesGroups,xLinearScale,yLinearScale);
            //labels
            var xlabelsGroup = chartGroup.append('g')
                .attr('transform',`translate(${chartWidth/2},${chartHeight+20})`);
            var ylabelsGroup = chartGroup.append('g')
                .attr('transform',`translate(${-40},${chartHeight/2})`)
            var avg_temp = xlabelsGroup.append('text')
                .attr("x",0)
                .attr("y",20)
                .attr("value",`${chosenXAxis}`)
                .style('fill','white')
                .text(`${chosenXAxis}`); 
            var chosenbutton = ylabelsGroup.append('text')
                .attr("transform", "rotate(-90)")
                .attr("x",0)
                .attr('y',0)
                .attr("value",`${chosenYAxis}`)
                .style('fill','white')
                .text(`${chosenYAxis}`)
    
        //initialise tooltip, call the tip and event usage
            updateToolTip(chosenXAxis,chosenYAxis,circlesGroups);  
        }).catch(function(error) {
          console.log(error);
      });
     }
    
    init(chosenYAxis);
}

makeResponsive(chosenYAxis);

d3.select(window).on("resize", makeResponsive(chosenYAxis));
