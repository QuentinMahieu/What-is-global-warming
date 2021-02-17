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
        'tornado_count','waterspouts_count','wind_speed_avg','diff'];
    var chosenXAxis = "avg_temp";
    
    
    function init(chosenYAxis){
        if (chosenYAxis === 'diff'){
            makeLine(chosenYAxis);
            legend({
                color: d3.scaleThreshold([0.8,0.6,0.4,0.2,0,-0.2,-0.4,-0.6,-0.8], d3.schemeRdBu[10]),
                title: "Temperature anomalie (°C)",
                tickSize: 0,
                left: true,
              });
        }else{
            makeScatter(chosenYAxis);
            legend({
                color: d3.scaleThreshold([0.8,0.6,0.4,0.2,0,-0.2,-0.4,-0.6,-0.8], d3.schemeRdBu[10]),
                title: "Temperature anomalie (°C)",
                tickSize: 0,
                left: false,
              });
        }
        
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
            d3.max(data, d => d[chosenYAxis])+1])
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
        .attr("fill", d=>getColor(d[chosenXAxis]))
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
        }else if(chosenYAxis === ycolumns[10]){
            ylabel = "Rise cumul (since 1910): ";
            yylabel = "Sea level rise: ";
            var degrees = "mm";
        }else{
            ylabel = "Wind speed average: ";
            var degrees = "";
        }
        if(chosenYAxis === ycolumns[10]){
            var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-70, 30])
            .html(function(d){
                return (`<strong>${d.Year}</strong><hr>${xlabel}${parseFloat(d[chosenXAxis]+21.8).toFixed(2)}°C<br>
                ${xxlabel}${parseFloat(d[chosenXAxis]).toFixed(2)}${degrees}<br>
                ${ylabel}${parseFloat(d[chosenYAxis]).toFixed(2)}${degrees}<br>
                ${yylabel}${parseFloat(d['rise_year']).toFixed(2)}${degrees}`);
            });
        }else{
            var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-70, 30])
            .html(function(d){
                return (`<strong>${d.Year}</strong><hr>${xlabel}${parseFloat(d[chosenXAxis]+21.8).toFixed(2)}°C<br>
                ${xxlabel}${parseFloat(d[chosenXAxis]).toFixed(2)}${degrees}<br>
                ${ylabel}${parseFloat(d[chosenYAxis]).toFixed(2)}${degrees}`);
            });
        }
        
        
        circlesGroup.call(tip);
        circlesGroup.on('mouseover', function(d) {
            tip.show(d, this);
        })
        .on('mouseout', function(d) {
            tip.hide(d);
        }); 
        return circlesGroup;
    };
    //legend function d3
    function legend({
        color,
        title,
        tickSize = 6,
        width = 180,
        height = 44 + tickSize,
        marginTop = 18,
        marginRight = 0,
        marginBottom = 16 + tickSize,
        marginLeft = 0,
        ticks = width / 64,
        tickFormat,
        tickValues,
        left
    } = {}) {
        if (left === true){
            position = -height-(marginBottom*4)
        
        }else{
            position = -chartHeight-height-marginBottom-marginTop;
        }
        const legend_svg = d3.select("#scatter")
                .append('svg')
                .attr("transform", `translate(${chartWidth-marginRight},${position})`)
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .style("overflow", "visible")
                .style("display", "block");
        let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
        let x;
    
        // Threshold
        const thresholds = color.thresholds ? color.thresholds() // scaleQuantize
        :
        color.quantiles ? color.quantiles() // scaleQuantile
        :
        color.domain(); // scaleThreshold

        const thresholdFormat = tickFormat === undefined ? d => d :
        typeof tickFormat === "string" ? d3.format(tickFormat) :
        tickFormat;

        x = d3.scaleLinear()
        .domain([-1, color.range().length - 1])
        .rangeRound([marginLeft, width - marginRight]);
        // .rangeRound([marginLeft, width - marginRight]);
        
        legend_svg.append("g")
        .attr("transform", `translate(-80,0)`)
        .selectAll("rect")
        .data(color.range())
        .join("rect").transition().duration(500)
        .attr("x", (d, i) => x(i - 1))
        .attr("y", marginTop)
        .attr("width", (d, i) => x(i) - x(i - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", d => d);

        tickValues = d3.range(thresholds.length);
        tickFormat = i => thresholdFormat(thresholds[i], i);

        legend_svg.append("g")
        .attr("transform", `translate(-80,${height - marginBottom})`)
        .call(d3.axisBottom(x)
            .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
            .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
            .tickSize(tickSize)
            .tickValues(tickValues))
            .style('color','white')
        .call(tickAdjust)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text").transition().duration(500)
            .attr("x", marginLeft)
            .attr("y", marginTop + marginBottom - height - 6)
            .attr("fill", "white")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(title));
    
        return legend_svg.node();
    };
    function makeScatter(chosenYAxis){
        var chartGroup = svg.append('g')
            .attr('class', "scatterplot")
            .attr('transform', `translate(${margin.left},${margin.top})`);
        d3.json("/aus_summary/data").then((data,error)=>{
        // d3.csv("../../data/cleaned/australia_extreme_summary.csv").then((data,error)=>{
            if (error) throw error;
            
            //Format the data
            data.forEach((d)=>{
                d['avg_temp'] = + d['avg_temp'];
                d['rise_year'] = +d['rise_year'];
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
            var label;
            if (chosenYAxis === ycolumns[0]){
                label = "Temperature max";
            }else if(chosenYAxis === ycolumns[1]) {
                label = "Temperature min";
            }else if(chosenYAxis === ycolumns[2]){ 
                label = "Rainfall anomalie";
            }else if(chosenYAxis === ycolumns[3]){ 
                label = "Cloud days";
            }else if(chosenYAxis === ycolumns[4]){ 
                label = "Drough index";
            }else if(chosenYAxis === ycolumns[5]){ 
              label = "Lightning count";
            }else if(chosenYAxis === ycolumns[6]){ 
              label = "Hails count";
            }else if(chosenYAxis === ycolumns[7]){ 
              label = "Tornado count";
            }else if(chosenYAxis === ycolumns[8]){ 
              label = "Waterspout count";
            }else{
                label = "Wind speed average";
            }

            var titleGroup = chartGroup.append('g')
            .attr('transform',`translate(${chartWidth/3},20)`);
            var xlabelsGroup = chartGroup.append('g')
                .attr('transform',`translate(${chartWidth/2},${chartHeight+20})`);
            var ylabelsGroup = chartGroup.append('g')
                .attr('transform',`translate(${-40},${chartHeight/2})`)
            var title = titleGroup.append('text')
                .attr("x",0)
                .attr("y",-20)
                .style('fill','white')
                .style('font-size','20')
                .text(`Average temperature vs ${label}`);
            var avg_temp = xlabelsGroup.append('text')
                .attr("x",0)
                .attr("y",20)
                .attr("value",`${chosenXAxis}`)
                .style('fill','white')
                .text(`${label}`); 
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
    function makeLine(chosenYAxis){
        var chartGroup = svg.append('g')
            .attr('class', "scatterplot")
            .attr('transform', `translate(${margin.left},${margin.top})`);
        d3.json("/aus_summary/data").then((data,error)=>{
        // d3.csv("../../data/cleaned/australia_extreme_summary.csv").then((data,error)=>{
            if (error) throw error;
        
            //Format the data
            data.forEach((d)=>{
                d['avg_temp'] = + d['avg_temp'];
                d.Year = parseInt(d.Year);
                for(i=0;i<ycolumns.length;i++){
                  d[ycolumns[i]] = + parseFloat(d[ycolumns[i]]).toFixed(2);
                }
            });
            
            data = data.filter(d=> d.Year > 1992)
        ///creates the initial chart///////// 
            // creates scales
            var xLinearScale = x = d3.scaleLinear()
                .domain([d3.min(data, d => d.Year),
                            d3.max(data, d => d.Year)])
                .range([0,chartWidth]);
            var yLinearScale = y =  yScale(data,chosenYAxis);
            //append axes
            var bottomAxis = d3.axisBottom(xLinearScale).ticks(8).tickFormat(d3.format(".0f"));
            var xAxis = chartGroup.append('g')
                .attr("transform",`translate(0,${chartHeight})`)
                .style("color","white")
                .call(bottomAxis);
            initYAxis(yLinearScale,chartGroup);  
            // append circles
            var line = d3.line()
                .defined(d => !isNaN(d[chosenYAxis]))
                .x(d => x(d.Year))
                .y(d => y(d[chosenYAxis]));

            chartGroup.append("path")
                .datum(data).transition().duration(1500)
                .style("fill",'none')
                .attr("stroke", 'sandybrown')
                .attr("stroke-width", 1.5)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("d", line);
            
                var circlesGroups = chartGroup.selectAll("g circle")
                .data(data)
                .enter()
                .append("g");
                var circles = circlesGroups.append("circle")
                .transition()
                    .duration(1500)
                .attr('class', d=>"y" + d.Year)
                .attr("cx", d => xLinearScale(d.Year))
                .attr("cy", d => yLinearScale(d[chosenYAxis]))
                .attr("r", "8")
                .attr("fill", d=>getColor(d[chosenXAxis]))
                .attr("opacity",d => (d[chosenYAxis] == 0) ? 0 :0.7)
                .attr("stroke-width", d => (d[chosenYAxis] == 0) ? "0" :"1")
                .attr("stroke", "white");
            //labels
            label = "Sea level rise (since 1910): ";

            var titleGroup = chartGroup.append('g')
            .attr('transform',`translate(${chartWidth/3},20)`);
            var xlabelsGroup = chartGroup.append('g')
                .attr('transform',`translate(${chartWidth/2},${chartHeight+20})`);
            var ylabelsGroup = chartGroup.append('g')
                .attr('transform',`translate(${-40},${chartHeight/2})`)

            var title = titleGroup.append('text')
                .attr("x",0)
                .attr("y",-20)
                .style('fill','white')
                .style('font-size','20')
                .text(`Average temperature vs ${label}`);
            var chosenbutton = ylabelsGroup.append('text')
                .attr("transform", "rotate(-90)")
                .attr("x",0)
                .attr('y',0)
                .attr("value",`${chosenYAxis}`)
                .style('fill','white')
                .text(`${label}`)
    
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



