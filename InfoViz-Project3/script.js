//Default function
window.addEventListener("load", function(){
    drawPieChart('mpg')
})

//Event listener
document.querySelectorAll('input[name="option"]').forEach(input => {
    input.addEventListener('change', () => {
        drawPieChart(input.value);
    });
});

function drawPieChart_(attribute){
    // d3.csv('a1-cars.csv').then(function(data) {
    d3.csv('a1-cars.csv').then(data => {
        // Group the data by origin and calculate various averages
        const originData = d3.rollup(
            data,
            v => ({
              horsepower: d3.mean(v, d => parseInt(d.Horsepower)),
              mpg: d3.mean(v, d => parseFloat(d.MPG)),
              displacement: d3.mean(v, d => parseFloat(d.Displacement)),
              acceleration: d3.mean(v, d => parseFloat(d.Acceleration)),
              weight: d3.mean(v, d => parseFloat(d.Weight))
            }),
            d => d.Cylinders
        );

        const margin = {top: 0, right: 10, bottom: 10, left: 10},
            width = 700 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // Select the SVG container and remove any existing elements
        var svg = d3.select("div").selectAll("svg").remove();
        var legend = d3.select("div").selectAll("legend").remove();


        var svg = d3.select("div").append("svg")
            .attr("width", width)
            .attr("height", height);

        var pie = d3.pie().value(function(d){
            if (attribute === "displacement") {
                return d[1].displacement;
              } else if (attribute === "weight") {
                return d[1].weight;
              } else if (attribute === "horsepower") {
                return d[1].horsepower;
              } else {
                return d[1].mpg;
              }
        })(originData);

        var g = svg.append("g")
            .attr("transform", "translate(300, 300)");

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        const arc = g.selectAll("path")
            .data(pie)
            .enter()
                .append("path")
            .attr("d", d3.arc()
                .innerRadius(50)
                .outerRadius(150))
            .attr("fill", function(d, i){
                return color(i);
            });

        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // Draw legend squares
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        // Draw legend text
        legend.append("text")
            .data(pie)
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { 
                if (attribute === "displacement") {
                    return (d.data[0]+",  "+ d.data[1].displacement.toFixed(2));
                  } else if (attribute === "weight") {
                    return (d.data[0]+",  "+ d.data[1].weight.toFixed(2));
                  } else if (attribute === "horsepower") {
                    return (d.data[0]+",  "+ d.data[1].horsepower.toFixed(2));
                  } else {
                    return (d.data[0]+",  "+ d.data[1].mpg.toFixed(2));
                  }
                return (d.data[0]); 
            });
    });

}

function drawPieChart(attribute) {
    d3.csv('a1-cars.csv').then(data => {
      // Group the data by origin and calculate various averages
      const originData = d3.rollup(
        data,
        v => ({
          horsepower: d3.mean(v, d => parseInt(d.Horsepower)),
          mpg: d3.mean(v, d => parseFloat(d.MPG)),
          displacement: d3.mean(v, d => parseFloat(d.Displacement)),
          acceleration: d3.mean(v, d => parseFloat(d.Acceleration)),
          weight: d3.mean(v, d => parseFloat(d.Weight))
        }),
        d => d.Cylinders
      );
  
      const margin = { top: 0, right: 10, bottom: 10, left: 10 },
        width = 700 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
  
      // Select the SVG container and remove any existing elements
      var svg = d3.select("div").selectAll("svg").remove();
      var legend = d3.select("div").selectAll("legend").remove();
  
      svg = d3.select("div").append("svg")
        .attr("width", width)
        .attr("height", height);
  
      var pie = d3.pie().value(function(d) {
        if (attribute === "displacement") {
          return d[1].displacement;
        } else if (attribute === "weight") {
          return d[1].weight;
        } else if (attribute === "horsepower") {
          return d[1].horsepower;
        } else {
          return d[1].mpg;
        }
      })(originData);
  
      var g = svg.append("g")
        .attr("transform", "translate(300, 300)");
  
      var color = d3.scaleOrdinal(d3.schemeCategory10);
  
      const arc = g.selectAll("path")
        .data(pie)
        .enter()
        .append("path")
        .attr("d", d3.arc()
          .innerRadius(100)
          .outerRadius(240))
        .attr("fill", function(d, i) {
          return color(i);
        });
  
      // Add labels
      const labelArc = d3.arc()
        .outerRadius(180)
        .innerRadius(150);
  
      g.selectAll(".arc-label")
        .data(pie)
        .enter()
        .append("text")
        .attr("class", "arc-label")
        .attr("transform", function(d) {
          return "translate(" + labelArc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .text(function(d) {
          if (attribute === "displacement") {
            return (d.data[0] + ", " + d.data[1].displacement.toFixed(2));
          } else if (attribute === "weight") {
            return (d.data[0] + ", " + d.data[1].weight.toFixed(2));
          } else if (attribute === "horsepower") {
            return (d.data[0] + ", " + d.data[1].horsepower.toFixed(2));
          } else {
            return (d.data[0] + ", " + d.data[1].mpg.toFixed(2));
          }
        });
  
      var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  
      // Draw legend squares
      legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);
  
      // Draw legend text
      legend.append("text")
        .data(pie)
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
          if (attribute === "displacement") {
            return (d.data[0] + ", " + d.data[1].displacement.toFixed(2));
          } else if (attribute === "weight") {
            return (d.data[0] + ", " + d.data[1].weight.toFixed(2));
          } else if (attribute === "horsepower") {
            return (d.data[0] + ", " + d.data[1].horsepower.toFixed(2));
          } else {
            return (d.data[0] + ", " + d.data[1].mpg.toFixed(2));
          }
        });
    });
}
  


    