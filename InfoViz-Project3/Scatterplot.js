function createChart() {
    const svgWidth = 928, svgHeight = 600;
    const margin = { top: 25, right: 20, bottom: 60, left: 60 };

    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Load data
    d3.csv("a1-cars.csv", d3.autoType).then(data => {
        // Create scales
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.MPG)) // Assuming field is 'MPG'
            .nice()
            .range([0, width]);
        const y = d3.scaleLinear()
            .domain(d3.extent(data, d => d.Horsepower))
            .nice()
            .range([height, 0]);
            
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const shape = d3.scaleOrdinal(d3.symbols.map(s => d3.symbol().type(s)));

        // Create SVG container
        const svg = d3.create("svg")
            .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .style("max-width", "100%")
            .style("height", "auto")
            .classed("svg-content", true);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add scatterplot points
        g.selectAll("path")
            .data(data)
            .join("path")
            .attr("transform", d => `translate(${x(d.MPG)},${y(d.Horsepower)})`)
            .attr("fill", d => color(d.Origin))
            .attr("d", d => shape(d.Origin)());

        // Append axes
        const gx = g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        gx.append("text")
            .attr("fill", "#000")
            .attr("x", width / 2)
            .attr("y", 40)
            .attr("text-anchor", "end")
            .text("MPG");

        const gy = g.append("g")
            .call(d3.axisLeft(y));

        gy.append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("text-anchor", "end")
            .text("Horsepower");

        // Brushing functionality
        const brush = d3.brush()
            .extent([[0, 0], [width, height]])
            .on("start brush end", brushed);

        g.append("g")
            .attr("class", "brush")
            .call(brush);

        function brushed({selection}) {
            if (!selection) {
                g.selectAll("path")
                    .style("stroke", null);
                return;
            }
            const [[x0, y0], [x1, y1]] = selection;
            g.selectAll("path")
                .style("stroke", d => x0 <= x(d.MPG) && x(d.MPG) <= x1 && y0 <= y(d.Horsepower) && y(d.Horsepower) <= y1 ? "red" : null);
        }

        // Populate dropdowns once
        const origins = Array.from(new Set(data.map(d => d.Origin))).sort();
        const modelYears = Array.from(new Set(data.map(d => d.ModelYear))).sort((a, b) => a - b);

        d3.select("#origin")
            .selectAll("option")
            .data(['all', ...origins])
            .join("option")
            .attr("value", d => d)
            .text(d => d);

        d3.select("#modelYear")
            .selectAll("option")
            .data(['all', ...modelYears])
            .join("option")
            .attr("value", d => d)
            .text(d => d);

        // Define and set up event handlers
        d3.select("#origin").on("change", function() {
            updateChart(this.value, d3.select("#modelYear").node().value);
        });

        d3.select("#modelYear").on("change", function() {
            updateChart(d3.select("#origin").node().value, this.value);
        });

        function updateChart(selectedOrigin, selectedYear) {
            // Filter data based on selection
            const filteredData = data.filter(d =>
                (selectedOrigin === 'all' || d.Origin === selectedOrigin) &&
                (selectedYear === 'all' || d.ModelYear === +selectedYear)
            );

            // Update the visualization with filtered data
            const update = g.selectAll("body")
                .data(filteredData, d => d.ID || d); 

            // Enter new elements
            update.enter()
                .append("body")
                .attr("r", 4)
                .attr("fill", d => color(d.ModelYear))  // Assuming color scale is defined
                .merge(update)  // Merge enter and update selections
                .attr("cx", d => x(d.MPG))
                .attr("cy", d => y(d.Horsepower));

                // Remove old elements
                update.exit().remove();
        }

        // Initial update - display all data
        updateChart('all', 'all');

        // Append SVG to the body or a specific element
        document.body.append(svg.node());
    });
}

createChart();
