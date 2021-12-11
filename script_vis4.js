// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 1900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var t_tot = 725;
var m_hp = 260;
var m_a = 175;
var m_d = 235;
var m_sa = 159;
var m_sd = 235;
var m_s = 160;
var hold = 0;
// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
// Initialize X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(["NORMAL", "FIRE", "WATER", "ELECTRIC", "GRASS", "ICE", "FIGHTING", "POISON", "GROUND", "FLYING", "PSYCHIC", "BUG", "ROCK", "GHOST", "DRAGON", "DARK", "STEEL", "FAIRY"])
  .paddingInner(1)
  .paddingOuter(.5)
var xAxis = svg.append("g")
.attr("class", "myXaxis")
svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x))
// Initialize Y axis
var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")
// Read the data and compute summary statistics for each specie
var stat = 0;
function update2(stat) {
d3.csv("Final_data.csv", function(data) {
  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.Type;})
    .rollup(function(d) {
      q1 = d3.quantile(d.map(function(g) { return g.Total_Stat_Sum;}).sort(d3.ascending),.25)
      median = d3.quantile(d.map(function(g) { return g.Total_Stat_Sum;}).sort(d3.ascending),.5)
      q3 = d3.quantile(d.map(function(g) { return g.Total_Stat_Sum;}).sort(d3.ascending),.75)
      interQuantileRange = q3 - q1
      min = q1 - 1.5 * interQuantileRange
      max = q3 + 1.5 * interQuantileRange
      return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
    })
    .entries(data)
    // Y axis
    //y.domain([0, d3.max(data, function(d) { return +d[document.getElementById("fname").value] }) ]);
    if (stat == "Total_Stat_Sum"){
		y.domain([0, t_tot]);
		hold = t_tot;
	}
    if (stat == "HP"){
		y.domain([0, m_hp]);
		hold = m_hp;
	}
        
    if (stat == "Attack"){
		y.domain([0, m_a]);
		hold = m_a;
	}
        
    if (stat == "Defense"){
		y.domain([0, m_d]);
		hold = m_d;
	}
        
    if (stat == "Special Attack"){
		y.domain([0, m_sa]);
		hold = m_sa;
	}
        
    if (stat == "Special Defense"){
		y.domain([0, m_sd]);
		hold = m_sd;
	}
        
    if (stat == "Speed"){
		y.domain([0, m_s]);
		hold = m_s;
	}
        
    
    //y.domain([0, d3.max(data, function(d) { return d[stat] }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));
  // Show the main vertical line
  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key)+50)})
      .attr("x2", function(d){return(x(d.key)+50)})
      //.attr("y1", function(d){return(y(d.value.min))})
      .attr("y1", function(d){return(y(0))})  //this used to be y(175) for Total_Stat_Sum
      .attr("y2", function(d){return(y(750))})
      .attr("stroke", "black")
      .style("width", 40)
  // rectangle for the main box
  var boxWidth = 100
  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    // .append("rect")
    //     .attr("x", function(d){return(x(d.key)-boxWidth/2)})
    //     .attr("y", function(d){return(y(d.value.q3))})
    //     .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
    //     .attr("width", boxWidth )
    //     .attr("stroke", "black")
    //     .style("fill", "#69b3a2")
  // Show the median
//   svg
//     .selectAll("medianLines")
//     .data(sumstat)
//     .enter()
//     .append("line")
//       .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
//       .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
//       .attr("y1", function(d){return(y(d.value.median))})
//       .attr("y2", function(d){return(y(d.value.median))})
//       .attr("stroke", "black")
//       .style("width", 80)
  // create a tooltip
  var Tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("fill", "blue")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip
      .html("Name: <b>" + d.Name + "</b><br>The " + stat + " value for this Pokemon is: <b>" + d[stat] + "</b><br><br><i>CLICK TO SEE MORE INFO</i>")
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "black")
      .style("fill", "white")
      .style("opacity", 1.0)
  }
  // Add individual points with jitter
  var jitterWidth = 50
  d3.selectAll('circle').remove();

  ticks.forEach(t =>
	t_svg.append("circle")
	.attr("cx", 300)
	.attr("cy", 300)
	.attr("fill", "none")
	.attr("stroke", "gray")
	.attr("r", radialScale(t))
);
  
  var u = svg.selectAll("indPoints")
      .data(data)
  u
    // .selectAll("indPoints")
    // .data(data)
    .enter()
    .append("circle")
    .merge(u)
      .attr("cx", function(d){return(x(d.Type) - jitterWidth/2 + Math.random()*jitterWidth )})
    //   .attr("cy", function(d){return(y(d.Total_Stat_Sum))})
      .attr("cy", function(d){return(y(d[stat]))})
      .attr("r", 4)
      .style("fill", "white")
      .attr("stroke", "black")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("click", function(d) {
       update(d.Name)
      })
})
}
update2("Attack")



let features = ["HP","Attack","Defence","Special Attack","Special Defence","Speed"];
var pokemon_count = -1;

let image_src = ['PNG/BugIC.png', 'PNG/DarkIC.png', 'PNG/DragonIC.png', 'PNG/ElectricIC.png', 'PNG/FairyIC.png'
, 'PNG/FightingIC.png', 'PNG/FireIC.png', 'PNG/FlyingIC.png', 'PNG/GhostIC.png', 'PNG/GrassIC.png'
, 'PNG/GroundIC.png', 'PNG/IceIC.png', 'PNG/NormalIC.png', 'PNG/PoisonIC.png', 'PNG/PsychicIC.png'
, 'PNG/RockIC.png', 'PNG/SteelIC.png', 'PNG/WaterIC.png'];

let radius = 250;
let t_svg = d3.select("body").append("svg")
	.attr("width", 1800)
	.attr("height", 600)
	.attr("x", 600)
	.attr("y", 300)


let radialScale = d3.scaleLinear()
	.domain([0,radius])
	.range([0,250]);
let ticks = [radius * 0.2, radius * 0.4, radius * 0.6, radius * 0.8, radius];

ticks.forEach(t =>
	t_svg.append("circle")
	.attr("cx", 300)
	.attr("cy", 300)
	.attr("fill", "none")
	.attr("stroke", "gray")
	.attr("r", radialScale(t))
);

ticks.forEach(t =>
	t_svg.append("text")
	.attr("x", 305)
	.attr("y", 300 - radialScale(t))
	.text(t.toString())
);

function angleToCoordinate(angle, value){
	let x = Math.cos(angle) * radialScale(value);
	let y = Math.sin(angle) * radialScale(value);
	return {"x": 300 + x, "y": 300 - y};
}

for (var i = 0; i < features.length; i++) {
	let ft_name = features[i];
	let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
	let line_coordinate = angleToCoordinate(angle, radius);
	let label_coordinate = angleToCoordinate(angle, radius * 1.1);

	//draw axis line
	t_svg.append("line")
	.attr("x1", 300)
	.attr("y1", 300)
	.attr("x2", line_coordinate.x)
	.attr("y2", line_coordinate.y)
	.attr("stroke","black");

	//draw axis label
	t_svg.append("text")
	.attr("x", label_coordinate.x)
	.attr("y", label_coordinate.y)
	.text(ft_name);
}

// var div = d3.select("body").append("div")	
//     .attr("class", "tooltip")				
//     .style("opacity", 0);

// var div2 = d3.select("body").append("div")	
//     .attr("class", "tooltip")				
//     .style("opacity", 0);

var div3 = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var att_eff = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
var def_eff = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
var pref_type = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var type_1;
var type_2;

//#region Image Loading
const base_x = 700;
const base_y = 50
const y_incr = 25

var bug1 = t_svg.append('image')
	.attr('xlink:href', 'PNG/BugIC.png')
	.attr('width', 34)
	.attr('height', 14)
	.attr('x', base_x)
	.attr('y', base_y + y_incr * 0)
	.on("mouseover", function(d) {		
		div.transition()		
			.duration(200)		
			.style("opacity", .9);		
		div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[0] + "<br/>"+
		"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[0])	
			.style("left", (550) + "px")		
			.style("top", (780) + "px");
		div2.transition()		
			.duration(200)		
			.style("opacity", .9);		
		div2.html("Using type: " + "<img src=" + image_src[eff_type(0)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[0] + "<br/>"+
		"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[0])	
			.style("left", (880) + "px")
			.style("top", (780) + "px")
		})					
	.on("mouseout", function(d) {		
		div.transition()		
			.duration(500)		
			.style("opacity", 0);
		div2.transition()		
			.duration(500)		
			.style("opacity", 0);	
});


var dark1 = t_svg.append('image')
.attr('xlink:href', 'PNG/DarkIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', 700)
.attr('y', base_y + y_incr * 1)
.on("mouseover", function(d) {		
	div.transition()		
		.duration(200)		
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (800) + "px");		
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[1] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[1])
	div2.transition()		
		.duration(200)		
		.style("opacity", .9);		
	div2.html("Using type: " + "<img src=" + image_src[eff_type(1)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[1] + "<br/>"+
	"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[1])	
		.style("left", (880) + "px")
		.style("top", (800) + "px")
	})					
.on("mouseout", function(d) {		
	div.transition()		
		.duration(500)		
		.style("opacity", 0);
	div2.transition()		
		.duration(500)		
		.style("opacity", 0);	
});

var drag1 = t_svg.append('image')
.attr('xlink:href', 'PNG/DragonIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', 700)
.attr('y', base_y + y_incr * 2)
.on("mouseover", function(d) {		
	div.transition()		
		.duration(200)		
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (820) + "px");		
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[2] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[2])	
	div2.transition()		
		.duration(200)		
		.style("opacity", .9);		
	div2.html("Using type: " + "<img src=" + image_src[eff_type(2)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[2] + "<br/>"+
		"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[2])	
		.style("left", (880) + "px")
		.style("top", (820) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});

var elec1 = t_svg.append('image')
.attr('xlink:href', 'PNG/ElectricIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', 700)
.attr('y', base_y + y_incr * 3)
.on("mouseover", function(d) {		
	div.transition()		
		.duration(200)		
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (840) + "px");	
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[3] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[3])	
	div2.transition()		
		.duration(200)		
		.style("opacity", .9);		
	div2.html("Using type: " + "<img src=" + image_src[eff_type(3)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[3] + "<br/>"+
		"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[3])	
		.style("left", (880) + "px")
		.style("top", (840) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});

var fairy1 = t_svg.append('image')
.attr('xlink:href', 'PNG/FairyIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', base_x)
.attr('y', base_y + y_incr * 4)
.on("mouseover", function(d) {		
	div.transition()		
		.duration(200)		
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (860) + "px");	
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[4] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[4])	
	div2.transition()		
	.duration(200)		
	.style("opacity", .9);		
div2.html("Using type: " + "<img src=" + image_src[eff_type(4)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[4] + "<br/>"+
"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[4])	
	.style("left", (880) + "px")
	.style("top", (860) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});

var fight1 = t_svg.append('image')
.attr('xlink:href', 'PNG/FightingIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', base_x)
.attr('y', base_y + y_incr * 5)
.on("mouseover", function(d) {		
	div.transition()		
		.duration(200)		
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (880) + "px");	
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[5] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[5])	
	div2.transition()		
	.duration(200)		
	.style("opacity", .9);		
div2.html("Using type: " + "<img src=" + image_src[eff_type(5)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[5] + "<br/>"+
"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[5])	
	.style("left", (880) + "px")
	.style("top", (880) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});

var fire1 = t_svg.append('image')
.attr('xlink:href', 'PNG/FireIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', base_x)
.attr('y', base_y + y_incr * 6)
.on("mouseover", function(d) {		
	div.transition()		
		.duration(200)		
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (900) + "px");	
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[6] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[6])	
	div2.transition()		
	.duration(200)		
	.style("opacity", .9);		
div2.html("Using type: " + "<img src=" + image_src[eff_type(6)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[6] + "<br/>"+
"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[6])	
	.style("left", (880) + "px")
	.style("top", (900) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});

var fly1 = t_svg.append('image')
.attr('xlink:href', 'PNG/FlyingIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', base_x)
.attr('y', base_y + y_incr * 7)
.on("mouseover", function(d) {		
	div.transition()		
		.duration(200)		
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (920) + "px");
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[7] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[7])	
	div2.transition()		
	.duration(200)		
	.style("opacity", .9);		
div2.html("Using type: " + "<img src=" + image_src[eff_type(7)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[7] + "<br/>"+
"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[7])	
	.style("left", (880) + "px")
	.style("top", (920) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});

var ghost1 = t_svg.append('image')
.attr('xlink:href', 'PNG/GhostIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', base_x)
.attr('y', base_y + y_incr * 8)
.on("mouseover", function(d) {		
	div.transition()		
		.duration(200)		
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (940) + "px");
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[8] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[8])	
	div2.transition()		
	.duration(200)		
	.style("opacity", .9);		
div2.html("Using type: " + "<img src=" + image_src[eff_type(8)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[8] + "<br/>"+
"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[8])	
	.style("left", (880) + "px")
	.style("top", (940) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});

var grass1 = t_svg.append('image')
.attr('xlink:href', 'PNG/GrassIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', base_x)
.attr('y', base_y + y_incr * 9)
.on("mouseover", function(d) {		
	div.transition()		
		.duration(200)		
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (960) + "px");
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[9] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[9])	
	div2.transition()		
	.duration(200)		
	.style("opacity", .9);		
div2.html("Using type: " + "<img src=" + image_src[eff_type(9)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[9] + "<br/>"+
"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[9])	
	.style("left", (880) + "px")
	.style("top", (960) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});

var ground1 = t_svg.append('image')
.attr('xlink:href', 'PNG/GroundIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', base_x)
.attr('y', base_y + y_incr * 10)
.on("mouseover", function(d) {		
	div.transition()		
		.duration(200)		
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (980) + "px");
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[10] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[10])	
	div2.transition()		
	.duration(200)		
	.style("opacity", .9);		
div2.html("Using type: " + "<img src=" + image_src[eff_type(10)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[10] + "<br/>"+
"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[10])	
	.style("left", (880) + "px")
	.style("top", (980) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});

var ice1 = t_svg.append('image')
.attr('xlink:href', 'PNG/IceIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', base_x)
.attr('y', base_y + y_incr * 11)
.on("mouseover", function(d) {		
	div.transition()		
		.duration(200)		
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (1000) + "px");
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[11] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[11])	
	div2.transition()		
	.duration(200)		
	.style("opacity", .9);		
div2.html("Using type: " + "<img src=" + image_src[eff_type(11)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[11] + "<br/>"+
"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[11])	
	.style("left", (880) + "px")
	.style("top", (1000) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});

var norm1 = t_svg.append('image')
.attr('xlink:href', 'PNG/NormalIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', base_x)
.attr('y', base_y + y_incr * 12)
.on("mouseover", function(d) {		
	div.transition()		
		.duration(200)		
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (1020) + "px");
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[12] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[12])	
	div2.transition()		
	.duration(200)		
	.style("opacity", .9);		
div2.html("Using type: " + "<img src=" + image_src[eff_type(12)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[12] + "<br/>"+
"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[12])	
	.style("left", (880) + "px")
	.style("top", (1020) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});

var pois1 = t_svg.append('image')
.attr('xlink:href', 'PNG/PoisonIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', base_x)
.attr('y', base_y + y_incr * 13)
.on("mouseover", function(d) {		
	div.transition()		
		.duration(200)		
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (1040) + "px");
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[13] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[13])	
	div2.transition()		
	.duration(200)		
	.style("opacity", .9);		
div2.html("Using type: " + "<img src=" + image_src[eff_type(13)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[13] + "<br/>"+
"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[13])	
	.style("left", (880) + "px")
	.style("top", (1040) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});


var psych1 = t_svg.append('image')
.attr('xlink:href', 'PNG/PsychicIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', base_x)
.attr('y', base_y + y_incr * 14)
.on("mouseover", function(d) {		
	div.transition()		
		.duration(200)		
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (1060) + "px");
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[14] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[14])	
	div2.transition()		
	.duration(200)		
	.style("opacity", .9);		
div2.html("Using type: " + "<img src=" + image_src[eff_type(14)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[14] + "<br/>"+
"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[14])	
	.style("left", (880) + "px")
	.style("top", (1060) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});

var rock1 = t_svg.append('image')
.attr('xlink:href', 'PNG/RockIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', base_x)
.attr('y', base_y + y_incr * 15)
.on("mouseover", function(d) {		
	div.transition()		
		.duration(200)		
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (1080) + "px");
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[15] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[16])	
	div2.transition()		
	.duration(200)		
	.style("opacity", .9);		
div2.html("Using type: " + "<img src=" + image_src[eff_type(15)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[15] + "<br/>"+
"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[15])	
	.style("left", (880) + "px")
	.style("top", (1080) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});

var steel1 = t_svg.append('image')
.attr('xlink:href', 'PNG/SteelIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', base_x)
.attr('y', base_y + y_incr * 16)
.on("mouseover", function(d) {
	div.transition()
		.duration(200)
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (1100) + "px");
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[16] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[16])
	div2.transition()		
	.duration(200)		
	.style("opacity", .9);		
div2.html("Using type: " + "<img src=" + image_src[eff_type(16)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[16] + "<br/>"+
"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[16])	
	.style("left", (880) + "px")
	.style("top", (1100) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});

var water1 = t_svg.append('image')
.attr('xlink:href', 'PNG/WaterIC.png')
.attr('width', 34)
.attr('height', 14)
.attr('x', base_x)
.attr('y', base_y + y_incr * 17)
.on("mouseover", function(d) {
	div.transition()
		.duration(200)
		.style("opacity", .9)
		.style("left", (550) + "px")		
		.style("top", (1120) + "px");
	div	.html("Effective stats<br/>"+"Defense: " + document.getElementById("p" + pokemon_count + "_d").innerHTML * def_eff[17] + "<br/>"+
	"Special Defense: " + document.getElementById("p" + pokemon_count + "_sd").innerHTML * def_eff[17])
	div2.transition()		
	.duration(200)		
	.style("opacity", .9);		
div2.html("Using type: " + "<img src=" + image_src[eff_type(17)] +">" +"<br/>Effective stats<br/>"+"Attack: " + document.getElementById("p" + pokemon_count + "_a").innerHTML * att_eff[17] + "<br/>"+
"Special Attack: " + document.getElementById("p" + pokemon_count + "_sa").innerHTML * att_eff[17])	
	.style("left", (880) + "px")
	.style("top", (1120) + "px")
})					
.on("mouseout", function(d) {		
div.transition()		
	.duration(500)		
	.style("opacity", 0);
div2.transition()		
	.duration(500)		
	.style("opacity", 0);	
});
//#endregion





//#region Arrays
var img_arr = [bug1, dark1, drag1, elec1, fairy1, fight1, fire1, fly1, ghost1,
	grass1, ground1, ice1, norm1, pois1, psych1, rock1, steel1, water1]
var types_id = {"BUG": 0, "DARK": 1, "DRAGON": 2, "ELECTRIC": 3, "FAIRY": 4, "FIGHTING": 5,
				"FIRE": 6, "FLYING": 7, "GHOST": 8, "GRASS": 9, "GROUND": 10, "ICE": 11,
				"NORMAL": 12, "POISON": 13, "PSYCHIC": 14, "ROCK": 15, "STEEL": 16, "WATER": 17};


	
var types = ["BUG", "DARK", "DRAGON", "ELECTRIC", "FAIRY", "FIGHTING",
				"FIRE", "FLYING", "GHOST", "GRASS", "GROUND", "ICE",
				"NORMAL", "POISON", "PSYCHIC", "ROCK", "STEEL", "WATER"];
	//#endregion


// Draw effectiveness labels

//draw axis label
t_svg.append("text")
	.attr("x", base_x)
	.attr("y", 35)
	.text("Types");

t_svg.append("text")
	.attr("x", base_x  + 55)
	.attr("y", 35)
	.text("Attacking with..................Type");


t_svg.append("text")
	.attr("x", base_x + 15 + 340)
	.attr("y", 35)
	.text("Sp. Attack Stat");

t_svg.append("text")
	.attr("x", base_x + 15 + 250)
	.attr("y", 35)
	.text("Attack Stat");

t_svg.append("text")
	.attr("x", base_x + 15 + 660)
	.attr("y", 35)
	.text("Effective Defence");

t_svg.append("text")
	.attr("x", base_x + 15 + 810)
	.attr("y", 35)
	.text("Effective Sp. Defence");

t_svg.append("text")
	.attr("x", base_x + 15 + 500)
	.attr("y", 35)
	.text("When Defending");


var att_dict = {2:"100% Bonus Damage", 1:"Normal", 0.5:"50% Damage Reduction", 0:"No Effect"}
var def_dict = {4:"200% Bonus Damage", 2:"100% Bonus Damage", 1:"Normal", 0.5:"50% Damage Reduction", 0.25:"75% Damage Reduction", 0:"No Effect"}
var eff_labels = [];
var IF = [];

for(k = 0; k < types.length; k++){
	eff_labels[k] = [
		t_svg.append("text")
		.attr("x", base_x + 15 + 500)
		.attr("y", 63 + k * y_incr)
		.text("1")
		.attr('text-anchor', 'right'),

		t_svg.append("text")
		.attr("x", base_x + 15 + 40)
		.attr("y", 63 + k * y_incr)
		.text("1")
		.attr('text-anchor', 'right'),

		t_svg.append("text")
		.attr("x", base_x + 15 + 280)
		.attr("y", 63 + k * y_incr)
		.text("1")
		.attr('text-anchor', 'right'),

		t_svg.append("text")
		.attr("x", base_x + 15 + 380)
		.attr("y", 63 + k * y_incr)
		.text("1")
		.attr('text-anchor', 'right'),

		t_svg.append("text")
		.attr("x", base_x + 15 + 720)
		.attr("y", 63 + k * y_incr)
		.text("1")
		.attr('text-anchor', 'right'),

		t_svg.append("text")
		.attr("x", base_x + 15 + 870)
		.attr("y", 63 + k * y_incr)
		.text("1")
		.attr('text-anchor', 'right'),
	]

	IF[k] = t_svg.append('image')
	.attr('xlink:href', 'PNG/WaterIC.png')
	.attr('width', 34)
	.attr('height', 14)
	.attr('x', base_x + 15 + 210)
	.attr('y', 50 + k * y_incr)
}




function update(name){
	
	if(pokemon_count == 2){
		clear()
	}
	else{
		pokemon_count++;
	}
	


	d3.csv("pokemon.csv", function(data) {
		document.getElementById("p" + pokemon_count + "_name").innerHTML = name
		document.getElementById("sprite" + pokemon_count).src = "sprites/" + data[6][name] + ".png";
		document.getElementById("p" + pokemon_count + "_index").innerHTML = data[6][name]
		
		document.getElementById("p" + pokemon_count + "_type").src = image_src[types_id[data[7][name]]];
		document.getElementById("p" + pokemon_count + "_type").alt = data[7][name];

		if(data[8][name] != "none"){
			document.getElementById("p" + pokemon_count + "_type2").src = image_src[types_id[data[8][name]]];
			document.getElementById("p" + pokemon_count + "_type2").alt = data[8][name];
		}
		else{
			document.getElementById("p" + pokemon_count + "_type2").src = "";
			document.getElementById("p" + pokemon_count + "_type2").alt = "";
		}
		
		document.getElementById("p" + pokemon_count + "_hp").innerHTML = data[0][name]
		document.getElementById("p" + pokemon_count + "_a").innerHTML = data[1][name]
		document.getElementById("p" + pokemon_count + "_d").innerHTML = data[2][name]
		document.getElementById("p" + pokemon_count + "_sa").innerHTML = data[3][name]
		document.getElementById("p" + pokemon_count + "_sd").innerHTML = data[4][name]
		document.getElementById("p" + pokemon_count + "_s").innerHTML = data[5][name]
		document.getElementById("p" + pokemon_count + "_tot").innerHTML = (parseInt(data[5][name]) + parseInt(data[4][name]) + parseInt(data[3][name]) + parseInt(data[2][name]) + parseInt(data[1][name]) + parseInt(data[0][name]))



		let coordinates = [];
		let coordinates_label = [];

		let line = d3.line()
			.x(d => d.x)
			.y(d => d.y);
		let colors = ["#e41a1c", '#b19cd9', '#FF5733'];
		

		function getPathCoordinates(data_point){
			let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
			coordinates.push(angleToCoordinate(angle, data_point[name]));
			return coordinates;
		}

		function getPathCoordinates_label(data_point){
			
			for (var i = 0; i < features.length; i++){
				let ft_name = features[i];
				let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
				coordinates_label.push(angleToCoordinate(angle, (data_point[name] * 1.7)))
			}
			return coordinates_label;
		}

		for (var i = 0; i < features.length; i ++){
			let d = data[i];
			let color = colors;
			let coordinates = getPathCoordinates(d);
		}
		
		

		for(i = 0; i < features.length; i++){
			let d = data[i];
			let coordinates_label = getPathCoordinates_label(d)
			// //draw axis label
			// t_svg.append("text")
			// .attr("x", coordinates_label[i].x)
			// .attr("y", coordinates_label[i].y)
			// .text(data[i][name]);
		}


		var u = t_svg.selectAll("#path" + pokemon_count)
		.data(data)


		//draw path element
		u.enter()
		.append("path")
		.datum(coordinates)
		.attr("d",line)
		.attr("stroke-width", 3)
		.attr("stroke", colors[pokemon_count])
		.attr("fill", colors[pokemon_count])
		.attr("stroke-opacity", 1)
		.attr("opacity", 0.1)
		.on("mouseover", function(d) {
			div3.transition()
				.duration(200)
				.style("opacity", .9)
				.style("left", (d3.event.pageX) + "px")		
				.style("top", (d3.event.pageY - 28) + "px");
			div3	.html("Name: "+ document.getElementById("p" + pokemon_count + "_name").innerHTML + "<br/> " +"<img height = 45 width=60 src= " + document.getElementById("sprite" + pokemon_count).src + ">")
		})
		.on("mouseout", function(d) {		
		div3.transition()		
			.duration(500)		
			.style("opacity", 0);	
		});
		


		att_eff = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
		def_eff = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
		pref_type = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

		d3.csv("chart.csv", function(eff_data) {

			
			
			
			for(j = 0; j < types.length; j++){
				att_eff[j] = att_eff[j] * eff_data[types_id[data[7][name]]][types[j]]
			}
			if(data[8][name] != "none"){
				for(j = 0; j < types.length; j++){
					if(att_eff[j] < eff_data[types_id[data[8][name]]][types[j]]){
						pref_type[j] = 1;
						att_eff[j] = eff_data[types_id[data[8][name]]][types[j]]
					}
					
				}
			}

			for(j = 0; j < types.length; j++){
				def_eff[j] = def_eff[j] * eff_data[j][data[7][name]]
				eff_labels[j][0].text(def_dict[def_eff[j]]);
				eff_labels[j][1].text(att_dict[att_eff[j]]);
				eff_labels[j][2].text(att_eff[j] * document.getElementById("p" + pokemon_count + "_a").innerHTML);
				eff_labels[j][3].text(att_eff[j] * document.getElementById("p" + pokemon_count + "_sa").innerHTML);
				eff_labels[j][4].text(document.getElementById("p" + pokemon_count + "_d").innerHTML / def_eff[j]);
				eff_labels[j][5].text(document.getElementById("p" + pokemon_count + "_sd").innerHTML / def_eff[j]);
				IF[j].attr('xlink:href', image_src[eff_type(pref_type[j])])
			}
			if(data[8][name] != "none"){
				for(j = 0; j < types.length; j++){
					def_eff[j] = def_eff[j] * eff_data[j][data[8][name]]
				}
			}

			for(h = 0; h < types.length; h++){
				
			}
			
			
		});

		

	});
	
}

function clear(){
	console.log("Cleaning time!")
	for(p = 0; p < 3; p++ ){
		d3.selectAll('path').remove();


		document.getElementById("p" + p + "_name").innerHTML = ""
		document.getElementById("sprite" + p).src = "sprites/blank.png";
		document.getElementById("p" + p + "_index").innerHTML = "0"
		document.getElementById("p" + p + "_type").src = "sprites/blank.png"
		document.getElementById("p" + p + "_type2").src = "sprites/blank.png"
		document.getElementById("p" + p + "_hp").innerHTML = "0"
		document.getElementById("p" + p + "_a").innerHTML = "0"
		document.getElementById("p" + p + "_d").innerHTML = "0"
		document.getElementById("p" + p + "_sa").innerHTML = "0"
		document.getElementById("p" + p + "_sd").innerHTML = "0"
		document.getElementById("p" + p + "_s").innerHTML = "0"
		document.getElementById("p" + p + "_tot").innerHTML = "0"
	}
	pokemon_count = 0;
	
}

function eff_type(type_id){
	if(pref_type[type_id] == 0){
		return types_id[document.getElementById("p" + pokemon_count + "_type").alt];
	}
	else{
		return types_id[document.getElementById("p" + pokemon_count + "_type2").alt];
	}
}

update("Bulbasaur")