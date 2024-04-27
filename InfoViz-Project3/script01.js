const margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var dataArray = [20, 40, 80, 100, 60];

var widthScale = d3.scaleLinear()
                .domain([0, 120])
                .range([0, width]);

var color = d3.scaleLinear()
            .domain([0, 120])
            .range(["red", "black"]);

var axis = d3.axisBottom(widthScale)
            .ticks(6);

var canvas = d3.select("div")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(10, 10)");

var bar = canvas.selectAll("rect")
            .data(dataArray)
            .enter()
                .append("rect")
                .attr("width", function(d) { 
                    return widthScale(d); 
                })
                .attr("height", 20)
                .attr("fill", function(d){
                    return color(d)
                })
                .attr("y", function(d, i){
                    return i * 30;
                });

canvas.append("g")
    .attr("transform", "translate(0, 150)")
    .call(axis);

// const svg = d3.select("div")
//     .append("svg")
//        .attr("width", width + margin.left + margin.right)
//        .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//        .attr("transform",
//              "translate(" + margin.left + "," + margin.top + ")");


// d3.csv("a1-cars.csv").then(function(data){
//     const root = d3.hierarchy(data)
//         .sum(d => d.MPG)
//         .sort((a,b) => b.height - a.heaight || b.MPG - a.MPG);

//     const treemap = d3.treemap()
//         .size([width, height])
//         .padding(1);

//     treemap(root);


//     const node = svg.selectAll(".node")
//         .data(root.leaves())
//         .enter().append("rect")
//         .attr("class", "node")
//         .attr("x", d => d.x0)
//         .attr("y", d => d.y0)
//         .attr("width", d => d.x1 - d.x0)
//         .attr("height", d => d.y1 - d.y0)
//         .style("fill", d => d.data.color)
//         .on("click", d => console.log(d.data.name));

//     const label = svg.selectAll(".label")
//         .data(root.leaves())
//         .enter().append("text")
//         .attr("class", "label")
//         .attr("x", d => d.x0)
//         .attr("y", d => d.y0)
//         .attr("dy", ".75em")
//         .attr("dx", ".75em")
//         .text(d => d.data.name)
//         .attr("font-size", "10px")
//         .attr("fill", "#fff");
// }).catch(function(error) {
//     console.log("Error loading CSV:", error);
// });