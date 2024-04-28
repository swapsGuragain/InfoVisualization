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

function drawPieChart(attribute){
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
            d => d.Origin
        );


        const margin = {top: 0, right: 10, bottom: 10, left: 10},
            width = 700 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // Select the SVG container and remove any existing elements
        var svg = d3.select("div").selectAll("svg").remove();


        var svg = d3.select("div").append("svg")
            .attr("width", width)
            .attr("height", height);

        
        // svg.selectAll("path").remove();

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
                .innerRadius(90)
                .outerRadius(200))
            .attr("fill", function(d, i){
                return color(i);
            });

        g.selectAll("text")
            .data(pie)
            .enter().append("text")
            // .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("transform", function(d) { 
                var centroid = d3.arc().centroid(d);
                if (isNaN(centroid[0]) || isNaN(centroid[1])) {
                    var fallbackX = width / 20; // Center horizontally
                    var fallbackY = height / 20; // Place at 1/4 of the height from the top
                    return "translate(" + fallbackX + "," + fallbackY + ")";
                }
                return "translate(" + centroid + ")";
            })
            .attr("dy", ".35em")
            .text(function(d) { 
                return d.data[0];
             });
    });

}


    


