var svg = d3.select("svg"),
        margin = 200,
        width = 500,
        height = svg.attr("height") - margin

    svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 50)
       .attr("y", 50)
       .attr("font-size", "24px")
       .text("Bulbasaur stats (GRASS)")

    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");

    d3.csv("vis1_testdata.csv", function(error, data) {
        if (error) {
            throw error;
        }

        xScale.domain(data.map(function(d) { return d.year; }));
        yScale.domain([0, d3.max(data, function(d) { return d.Bulbasaur; })]);

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale))
         .append("text")
         .attr("y", height - 250)
         .attr("x", 100)    //you can do width - 100 to put it at the end
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Stat");

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return d;    //returns the y axis values
         })
         .ticks(10))    //changes how many values will show up on the y-axis
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", "-5.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Value");

        g.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.year); })
         .attr("y", function(d) { return yScale(d.Bulbasaur); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { return height - yScale(d.Bulbasaur); });
    });