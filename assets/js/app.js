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

  chartGroup
    .append("rect")
      .attr("x",0)
      .attr("y",0)
      .attr("height", height)
      .attr("width", width)
      .style("fill", "EBEBEB")

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]),
      d3.max(healthData, d => d[chosenXAxis])
    ])
    .range([0, height]);

  return xLinearScale;

}

//ADDED FOR Y axis: function used for updating Y-scale var upon click on axis label

function yScale(healthData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]),
      d3.max(healthData, d => d[chosenYAxis])
    ])
    .range([0, width]);

  return yLinearScale;

}


// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// added Y axis
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}


// function used for updating circles group with new tooltip
// Do I need to add chosenYAxis to the function or do I create a new one?
// Why circlesGroup in the function?

// how can I update tooltip for both X and Y

function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var label = "Poverty:";
  }
  else if (chosenXAxis === "age") {
    var label = "Age:";
  }
  else {
    var label = "Income:";
  }

//just added, not from oriningal CODE

if (chosenYAxis === "obesity") {
  var label = "Obesity %:";
}
else if (chosenYAxis === "smokes") {
  var label = "Smokes %:";
}
else {
  var label = "Healthcare %:";
}


  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]} ${d[chosenYAxis]} `);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("healthData.csv").then(function(healthData) {

  // parse data
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.healthcare = +data.healthcare;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);

  // Create y scale function

  var yLinearScale = yScale(healthData, chosenYAxis);


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("aText", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("aText", true)
    .attr("transform", `translate(0, ${width})`)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", ".5");


    chartGroup.selectAll("text")
         .data(healthData)
         .enter()
         .append("text")
         .classed("stateText", true)
         .attr("x", d => xLinearScale(d[chosenXAxis]))
         .attr("y", d => yLinearScale(d[chosenYAxis]))
         .text(function(d) {
         return (`${d.abbr}`)
       });

  // Create group for  2 x- axis labels - NOT SURE HOW TO ADAPT
  var labelsGroupX = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    // var labelsGroupY = chartGroup.append("g")
    //   .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty %");

  var ageLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = labelsGroupX.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Income (Median)");


var obesityLabel = labelsGroupY.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("value", "obesity") // value to grab for event listener
          .classed("inactive", true)
          .text("Obesity (%)");

var smokeLabel = labelsGroupY.append("text")
  .attr("x", 40)
  .attr("y", 0)
  .attr("value", "smokes") // value to grab for event listener
  .classed("inactive", true)
  .text("Smoke (%)");

  var healthcareLabel = labelsGroupY.append("text")
    .attr("x", 60)
    .attr("y", 0)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Healthcare (%)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2)) // WHY DIVIDED BY 2?
    .attr("value", "obesity")
    .attr("dy", "1em")
    .classed("d3-tip", true)
    .text("Obese (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // X AXIS changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }


        // Y AXIS changes classes to change bold text
        // if (chosenYAxis === "obesity") {
        //   obesityLabel
        //     .classed("active", true)
        //     .classed("inactive", false);
        // }
        // else if (chosenYAxis === "smokes") {
        //   smokeLabel
        //     .classed("active", false)
        //     .classed("inactive", true);
        // }
        // else {
        //   healthcareLabel
        //     .classed("active", true)
        //     .classed("inactive", false);
        // }



      }
    });
});
