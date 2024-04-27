


function drawPieChart(){
    d3.csv('a1-cars.csv').then(function(data) {
        console.log(data);

        var pie = d3.pie().value(function(d){
            return d.MPG;
        })(data);
            
        var svg = d3.select("div").append("svg")
            .attr("width", 500)
            .attr("height", 500);

        var g = svg.append("g")
            .attr("transform", "translate(300, 300)");

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        g.selectAll("path")
            .data(pie)
            .enter()
                .append("path")
            .attr("d", d3.arc()
                .innerRadius(50)
                .outerRadius(150))
            .attr("fill", function(d, i){
                return color(i);
            });

        g.selectAll("text")
            .data(pie)
            .enter().append(text)
            .attr("transform", function(d){
                return "translate(" +d3.arc().centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .text(function(d){
                return d.data.Car;
            });


    });

}

drawPieChart()

    


