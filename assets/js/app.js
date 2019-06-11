// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);

var toolTip=d3.select("body").append("div")
	.attr("class","tooltip");

// Importing data from csv
d3.csv("/assets/data/data.csv").then(function(err, data) {
	
	
	   // Parse and Loop through the data
 data.forEach(function(data){
		data.poverty = +data.poverty;
		data.healthcare = +data.healthcare;
	  });
	 
		// Create x and y axis and then scale
		
		var xLinearScale = d3.scaleLinear()
		.domain(d3.extent(data, d => d.poverty))
		.range([0, width]);

		var yLinearScale = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.healthcare)])
		.range([height, 0]);

		var bottomAxis = d3.axisBottom(xLinearScale);
	  var leftAxis = d3.axisLeft(yLinearScale);
		
		chartGroup.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(xAxis);

	  chartGroup.append("g")
		.call(yAxis);

		//set tooltip function
		var toolTip = d3.tip()
		.attr("class", "tooltip")
		.offset([-8, 0])
		.html(function(d) {
			return (`<strong> Poverty:${d.state}</strong><br>Healthcare: ${d.healthcare}`);
		});

		chartGroup.call(toolTip);

	  //Create circless
		
	  var circlesGroup = chartGroup.selectAll("circle")
	  .data(data)
	  .enter()
	  .append("circle")
	  .attr("cx", d => xLinearScale(d.poverty))
	  .attr("cy", d => yLinearScale(d.healthcare))
	  .attr("r", "15")
	  .attr("fill", "lightblue")
	 
      //append text to circles
     var circlesText =  chartGroup.selectAll(".statetext")
       .data(data)
       .enter()
       .append("text")
	   .attr("x", d => xLinearScale(d.poverty))
	   .attr("y", d => yLinearScale(d.healthcare))
	   .attr("dy", ".35em")
	   .text(d=> d["abbr"])
        })
		
		  //create mouseover event
			circlesGroup.on("mouseover", function(d) {
				toolTip.show(d,this);
				})
				// onmouseout event
				.on("mouseout", function(d) {
					toolTip.hide(d);
				});


	// Create axes labels
	chartGroup.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 0 - margin.left + 40)
	.attr("x", 0 - (height / 2))
	.attr("dy", "1em")
	.attr("class", "aText")
	.text("Healthcare");

	chartGroup.append("text")
	.attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
	.attr("class", "aText")
	.text("Poverty");

			

	
	
    
	  