// @TODO: YOUR CODE HERE!
// Using the D3 create a scatter plot that represents
//  each state with circle elements. pull in the data from data.csv
// by using the d3.csv function.

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// add different styling
chartGroup
  .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("height", height)
    .attr("width", width)
    .style("fill", "EBEBEB")

// why is this not working?
chartGroup.selectAll(".tick line").attr("stroke", "white")

  // Import Data
  d3.csv("healthData.csv")
    .then(function(healthData) {

      // Step 1: Parse Data/Cast as numbers
      // ==============================
      healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });

      // Step 2: Create scale functions
      // ==============================
      var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(healthData, d => d.poverty)])
        .range([0, width]);

      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)])
        .range([height, 0]);

      // Step 3: Create axis functions
      // ==============================
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      // Step 4: Append Axes to the chart
      // ==============================
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      chartGroup.append("g")
        .call(leftAxis);

      // Step 5: Create Circles
      // ==============================
      var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .classed("stateCircle", true)
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")

      //adding label sate

    chartGroup.selectAll("text")
         .data(healthData)
         .enter()
         .append("text")
         .classed("stateText", true)
         .attr("x", d => xLinearScale(d.poverty))
         .attr("y", d => yLinearScale(d.healthcare))
         .text(function(d) {
         return (`${d.abbr}`)
       });

      // Step 6: Initialize tool tip
      // ==============================
      var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<hr>Poverty %: ${d.poverty}<br>Healthcare %: ${d.healthcare}`);
        });

      // Step 7: Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);

      chartGroup.selectAll("text")
         .data(healthData)
         .enter()
         .append("text")
         .text(function(d) {
           return (`${d.abb}`);
         })
         .attr("x", d => xLinearScale(d.poverty))
         .attr("y", d => yLinearScale(d.healthcare))


      // Step 8: Create event listeners to display and hide the tooltip
      // ==============================
      circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Lacks Healthcare %");

      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "aText")
        .text("Poverty %");
    });