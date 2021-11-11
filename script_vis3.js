
let features = ["HP","Attack","Defence","Special Attack","Special Defence","Speed"];

let radius = 250;
let svg = d3.select("body").append("svg")
	.attr("width", 800)
	.attr("height", 600);


let radialScale = d3.scaleLinear()
	.domain([0,radius])
	.range([0,250]);
let ticks = [radius * 0.2, radius * 0.4, radius * 0.6, radius * 0.8, radius];

ticks.forEach(t =>
	svg.append("circle")
	.attr("cx", 300)
	.attr("cy", 300)
	.attr("fill", "none")
	.attr("stroke", "gray")
	.attr("r", radialScale(t))
);

ticks.forEach(t =>
	svg.append("text")
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
	svg.append("line")
	.attr("x1", 300)
	.attr("y1", 300)
	.attr("x2", line_coordinate.x)
	.attr("y2", line_coordinate.y)
	.attr("stroke","black");

	//draw axis label
	svg.append("text")
	.attr("x", label_coordinate.x)
	.attr("y", label_coordinate.y)
	.text(ft_name);
}

function update(name){
	

	d3.selectAll('path').remove();


	d3.csv("vis3_testdata.csv", function(data) {
		document.getElementById("p_name").innerHTML = name
		document.getElementById("p_index").innerHTML = data[6][name]
		document.getElementById("p_hp").innerHTML = data[0][name]
		document.getElementById("p_a").innerHTML = data[1][name]
		document.getElementById("p_d").innerHTML = data[2][name]
		document.getElementById("p_sa").innerHTML = data[3][name]
		document.getElementById("p_sd").innerHTML = data[4][name]
		document.getElementById("p_s").innerHTML = data[5][name]
		document.getElementById("p_tot").innerHTML = (parseInt(data[5][name]) + parseInt(data[4][name]) + parseInt(data[3][name]) + parseInt(data[2][name]) + parseInt(data[1][name]) + parseInt(data[0][name]))



		let coordinates = [];
		let coordinates_label = [];

		let line = d3.line()
			.x(d => d.x)
			.y(d => d.y);
		let colors = "#e41a1c";
		

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
			// svg.append("text")
			// .attr("x", coordinates_label[i].x)
			// .attr("y", coordinates_label[i].y)
			// .text(data[i][name]);
		}


		var u = svg.selectAll("path")
		.data(data)


		//draw path element
		u.enter()
		.append("path")
		.datum(coordinates)
		.attr("d",line)
		.attr("stroke-width", 3)
		.attr("stroke", colors)
		.attr("fill", colors)
		.attr("stroke-opacity", 1)
		.attr("opacity", 0.1);

	})

	
}

update("Bulbasaur")