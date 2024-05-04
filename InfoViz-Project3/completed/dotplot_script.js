document.addEventListener('DOMContentLoaded', function () {
    // Load data once and update chart based on global data
    let globalData;
    d3.csv('a1-cars.csv').then(data => {
        globalData = data;
        updateDotChart('mpg');  // Default option
    });

    // Event listener for radio buttons
    document.querySelectorAll('input[name="option"]').forEach(input => {
        input.addEventListener('change', () => {
            updateDotChart(input.value);
        });
    });

    // Initialize tooltip once outside the update function
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background-color', 'white')
        .style('border', '1px solid black')
        .style('padding', '5px');

    function updateDotChart(selectedOption) {
        // Assuming data is pre-loaded and stored in globalData
        const yearData = d3.rollup(
            globalData,
            v => ({
                horsepower: d3.mean(v, d => +d.Horsepower),
                mpg: d3.mean(v, d => +d.MPG),
                displacement: d3.mean(v, d => +d.Displacement),
                acceleration: d3.mean(v, d => +d.Acceleration),
                weight: d3.mean(v, d => +d.Weight),
                cylinders: d3.mean(v, d => +d.Cylinders)
            }),
            d => d.ModelYear // Group by ModelYear
        );

        const width = 800, height = 600, padding = {top: 20, right: 20, bottom: 40, left: 40};
        const svg = d3.select('svg').attr('width', width).attr('height', height);
        svg.selectAll('*').remove();  // Clear previous SVG elements

        const xScale = d3.scaleBand()
            .domain(Array.from(yearData.keys()))
            .range([padding.left, width - padding.right])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(Array.from(yearData.values()), d => d[selectedOption])])
            .range([height - padding.bottom, padding.top]);

        const colorScale = d3.scaleSequential(d3.interpolateTurbo) // Using a sequential color scale
            .domain(d3.extent(Array.from(yearData.keys())));

        svg.selectAll('.dot')
            .data(Array.from(yearData.entries()))
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d[0]) + xScale.bandwidth() / 2)
            .attr('cy', d => yScale(d[1][selectedOption]))
            .attr('r', 10)
            .attr('fill', d => colorScale(d[0])) // Color by ModelYear
            .attr('stroke', 'black')
            .on('mouseover', (event, d) => {
                tooltip.style('opacity', 1)
                    .html(`Model Year: ${d[0]}<br>Avg. ${selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}: ${d[1][selectedOption].toFixed(2)}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px');
            })
            .on('mouseout', () => tooltip.style('opacity', 0));

        svg.append('g')
            .attr('transform', `translate(0,${height - padding.bottom})`)
            .call(d3.axisBottom(xScale));

        svg.append('g')
            .attr('transform', `translate(${padding.left},0)`)
            .call(d3.axisLeft(yScale));
    }
});
