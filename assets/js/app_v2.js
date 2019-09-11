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

      // Initial Params
      var chosenXAxis = "poverty";
      // var chosenYAxis = "obesity";

      // Step 2: Create scale functions
      // ==============================

      function xScale(healthData, chosenXAxis) {
        // create scales
        var xLinearScale = d3.scaleLinear()
          .domain([d3.min(healthData, d => d[chosenXAxis]) +1,
            d3.max(healthData, d => d[chosenXAxis]) +!
          ])
          .range([0, width]);

        return xLinearScale;

      }
      //
      // function yScale(healthData, chosenYAxis) {
      //
      // var yLinearScale = d3.scaleLinear()
      //   .domain([0, d3.max(healthData, d => d[chosenYAxis]) + 1])
      //   .range([height, 0]);
      //
      //   return yLinearScale;
      // }

      // Step 3: Create axis functions
      // ==============================
      // var bottomAxis = d3.axisBottom(xLinearScale);
      // var leftAxis = d3.axisLeft(yLinearScale);

      function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
          .duration(1000)
          .call(bottomAxis);

        return xAxis;
      }


//adding for Y axis
      // function renderYAxes(newYScale, yAxis) {
      //   var leftAxis = d3.axisLeft(newYScale);
      //
      //   yAxis.transition()
      //     .duration(1000)
      //     .call(leftAxis);
      //
      //   return yAxis;
      // }


      // Step 4: Append Axes to the chart
      // ==============================
      // chartGroup.append("g")
      //   .attr("transform", `translate(0, ${height})`)
      //   .call(bottomAxis.tickSize(-height*1.3).ticks(10)).select(".domain").remove()
      //
      //
      // chartGroup.append("g")
      //   .call(leftAxis.tickSize(-width*1.3).ticks(7)).select(".domain").remove()
      //
      // chartGroup.selectAll(".tick line").attr("stroke", "white")

  // append initial circles
      // var circlesGroup = chartGroup.selectAll("circle")
      //   .data(healthData)
      //   .enter()
      //   .append("circle")
      //   .classed("stateCircle", true)
      //   .attr("cx", d => xLinearScale(d[chosenXAxis]))
      //   .attr("cy", d => yLinearScale(d[chosenYAxis]))
      //   .attr("r", 15)
      //   .attr("fill", "blue")
      //   .attr("opacity", ".5");
      //


      // Step 5: Create Circles
      // ==============================
      function renderCircles(circlesGroup, newXScale, chosenXaxis) {

        circlesGroup.transition()
          .duration(1000)
          .attr("cx", d => newXScale(d[chosenXAxis]));

        return circlesGroup;
      }

      // function used for updating circles group with new tooltip
      function updateToolTip(chosenXAxis, circlesGroup) {

        if (chosenXAxis === "poverty") {
          var label = "Poverty22:";
        }
        else if (chosenXAxis === "age") {
            var label = "Age22:";
        }
        else {
          var label = "Income22";
        }

        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html(function(d) {
            return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
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

      // Import Data
      d3.csv("healthData.csv")
        .then(function(healthData) {

          // Step 1: Parse Data/Cast as numbers
          // ==============================
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
            var yLinearScale = d3.scaleLinear()
              .domain([0, d3.max(healthData, d => d.obesity)])
              .range([height, 0]);

            // Create initial axis functions
            var bottomAxis = d3.axisBottom(xLinearScale);
            var leftAxis = d3.axisLeft(yLinearScale);

            // append x axis
            var xAxis = chartGroup.append("g")
              .classed("x-axis", true)
              .attr("transform", `translate(0, ${height})`)
              .call(bottomAxis);

            // append y axis
            chartGroup.append("g")
              .call(leftAxis);

            // append initial circles
            var circlesGroup = chartGroup.selectAll("circle")
              .data(healthData)
              .enter()
              .append("circle")
              .attr("cx", d => xLinearScale(d[chosenXAxis]))
              .attr("cy", d => yLinearScale(d.obesity))
              .attr("r", 20)
              .attr("fill", "blue")
              .attr("opacity", ".5");

            // Create group for  2 x- axis labels
            var labelsGroup = chartGroup.append("g")
              .attr("transform", `translate(${width / 2}, ${height + 20})`);

            var povertyLabel = labelsGroup.append("text")
              .attr("x", 0)
              .attr("y", 20)
              .attr("value", "poverty") // value to grab for event listener
              .classed("active", true)
              .text("Poverty %");

            var ageLabel = labelsGroup.append("text")
              .attr("x", 0)
              .attr("y", 40)
              .attr("value", "age") // value to grab for event listener
              .classed("inactive", true)
              .text("Age (median)");

            // append y axis
            chartGroup.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - margin.left)
              .attr("x", 0 - (height / 2))
              .attr("dy", "1em")
              .classed("axis-text", true)
              .text("OBESITY");

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
                  xAxis = renderAxes(xLinearScale, xAxis);

                  // updates circles with new x values
                  circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                  // updates tooltips with new info
                  circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                  // changes classes to change bold text
                  if (chosenXAxis === "age") {
                    ageLabel
                      .classed("active", true)
                      .classed("inactive", false);
                    povertyLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  }
                  else {
                    ageLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    povertyLabel
                      .classed("active", true)
                      .classed("inactive", false);
                  }
                }
              });
          });
