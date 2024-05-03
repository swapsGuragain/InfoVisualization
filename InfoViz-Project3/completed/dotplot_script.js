window.addEventListener('load', function() {
    updateChart('mpg');  // Default option now focuses on mpg for the dot plot
});

// Event listener for radio buttons (if applicable for switching between features)
document.querySelectorAll('input[name="option"]').forEach(input => {
    input.addEventListener('change', () => {
        console.log(input.value);
        updateChart(input.value);
    });
});

function updateChart(selectedOption) {
    d3.csv('a1-cars.csv').then(data => {
        const originData = d3.rollup(
            data,
            v => ({
                horsepower: d3.mean(v, d => parseInt(d.Horsepower)),
                mpg: d3.mean(v, d => parseFloat(d.MPG)),
                displacement: d3.mean(v, d => parseFloat(d.Displacement)),
                acceleration: d3.mean(v, d => parseFloat(d.Acceleration)),
                weight: d3.mean(v, d => parseFloat(d.Weight)),
                cylinders: d3.mean(v, d => parseFloat(d.Cylinders))
            }),
            d => d.Origin
        );

        const colorMapping = {
            'American': '#FF6347',
            'European': '#4682B4',
            'Japanese': '#32CD32'
        };

        const width = 800;
        const height = 600;
        const padding = { top: 20, right: 20, bottom: 40, left: 40 };

        d3.select('svg').selectAll('*').remove();

        const svg = d3.select('svg')
            .attr('width', width)
            .attr('height', height);

        const xScale = d3.scaleBand()
            .domain(Array.from(originData.keys()))
            .range([padding.left, width - padding.right])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(Array.from(originData.values()), d => d[selectedOption])])
            .range([height - padding.bottom, padding.top]);

        // Initialize tooltip
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background-color', 'white')
            .style('border', '1px solid black')
            .style('padding', '5px');

        const dots = svg.selectAll('.dot')
            .data(Array.from(originData.entries()))
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d[0]) + xScale.bandwidth() / 2)
            .attr('cy', d => yScale(d[1][selectedOption]))
            .attr('r', 20)
            .attr('fill', d => colorMapping[d[0]] || 'gray')
            .attr('stroke', 'black')
            .style('cursor', 'pointer');

        dots.on('click', function (event, d) {
            svg.select('.data-label').remove();  // Remove existing label
            svg.append('text')  // Add new label
                .attr('class', 'data-label')
                .attr('x', xScale(d[0]) + xScale.bandwidth() / 2)
                .attr('y', yScale(d[1][selectedOption]) - 10)
                .text(`MPG: ${d[1].mpg.toFixed(2)}`)
                .attr('text-anchor', 'middle')
                .style('fill', 'black')
                .style('font-size', '12px');
        });

        dots.on('mouseover', function (event, d) {
            tooltip.style('opacity', 1)
                .html(`Origin: ${d[0]}<br>Avg. Horsepower: ${d[1].horsepower.toFixed(2)}<br>
                    Avg. MPG: ${d[1].mpg.toFixed(2)}<br>
                    Avg. Displacement: ${d[1].displacement.toFixed(2)}<br>
                    Avg. Acceleration: ${d[1].acceleration.toFixed(2)}<br>
                    Avg. Cylinders: ${d[1].cylinders.toFixed(2)}<br>
                    Avg. Weight: ${d[1].weight.toFixed(2)}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY + 10) + 'px');
        }).on('mouseout', function () {
            tooltip.style('opacity', 0);
        });

        svg.append('g')
            .attr('transform', `translate(0,${height - padding.bottom})`)
            .call(d3.axisBottom(xScale));

        svg.append('g')
            .attr('transform', `translate(${padding.left},0)`)
            .call(d3.axisLeft(yScale));
              
            window.addEventListener('load', function() {
                loadData();  // This will load the data and set up the initial chart
            });
            

    });
}