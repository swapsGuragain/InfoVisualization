window.addEventListener('load', function() {
    // Default option is 'horsepower'
    updateChart('horsepower');
});

// Event listener for radio buttons
document.querySelectorAll('input[name="option"]').forEach(input => {
    input.addEventListener('change', () => {
        console.log(input.value);
        updateChart(input.value);
    });
});

function updateChart(selectedOption) {
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
  
      // Set up the chart dimensions and padding
      const width = 450;
      const height = 600;
      const padding = {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60
      };
  
      // Create the SVG container
      const svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);
  
      // Create the scales
      const x = d3.scaleBand()
        .range([padding.left, width - padding.right])
        .padding(0.1);
      const y = d3.scaleLinear()
        .range([height - padding.bottom, padding.top]);
  
      // Set domains for the scales
      x.domain(Array.from(originData.keys()));
  
      // Create the tooltip element
      const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background-color', '#eeeeee')
        .style('border', 'solid 1px black')
        .style('padding', '5px')
        .style('font-size', '12px')
        .style('border-radius', '5px');
  
      // Set y-axis domain based on selected option
      if (selectedOption === "displacement") {
        y.domain([0, d3.max(Array.from(originData.values()), d => d.displacement)]);
      } else if (selectedOption === "weight") {
        y.domain([0, d3.max(Array.from(originData.values()), d => d.weight)]);
      } else if (selectedOption === "mpg") {
        y.domain([0, d3.max(Array.from(originData.values()), d => d.mpg)]);
      } else {
        y.domain([0, d3.max(Array.from(originData.values()), d => d.horsepower)]);
      }
  
      // Select all existing bars and remove them
      svg.selectAll('.bar').remove();
  
      // Select and remove existing axes
      svg.selectAll('g').remove();
  
      // Create the bars based on selected option
      svg.selectAll('.bar')
        .data(Array.from(originData.entries()))
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d[0]))
        .attr('width', x.bandwidth())
        .attr('y', d => {
          if (selectedOption === "displacement") {
            return y(d[1].displacement);
          } else if (selectedOption === "weight") {
            return y(d[1].weight);
          } else if (selectedOption === "mpg") {
            return y(d[1].mpg);
          } else {
            return y(d[1].horsepower);
          }
        })
        .attr('height', d => {
          if (selectedOption === "displacement") {
            return height - padding.bottom - y(d[1].displacement);
          } else if (selectedOption === "weight") {
            return height - padding.bottom - y(d[1].weight);
          } else if (selectedOption === "mpg") {
            return height - padding.bottom - y(d[1].mpg);
          } else {
            return height - padding.bottom - y(d[1].horsepower);
          }
        })
        .attr('fill', d => {
          switch (d[0]) {
            case 'American':
              return '#40e0d0';
            case 'European':
              return '#ffb6c1';
            case 'Japanese':
              return '#2acaea';
            default:
              return 'gray';
          }
        })
        .attr('stroke', 'black')
        .style('cursor', 'pointer')
        .on('mouseover', function (evt, d) {
          // Update tooltip position and content
          tooltip.style('opacity', 1)
            .html(`
              Origin: ${d[0]}<br>
              Avg. Horsepower: ${d[1].horsepower.toFixed(2)}<br>
              Avg. MPG: ${d[1].mpg.toFixed(2)}<br>
              Avg. Displacement: ${d[1].displacement.toFixed(2)}<br>
              Avg. Acceleration: ${d[1].acceleration.toFixed(2)}<br>
              Avg. Weight: ${d[1].weight.toFixed(2)} lbs
            `)
            .style('left', (evt.pageX + 10) + 'px')
            .style('top', (evt.pageY + 10) + 'px');
  
          d3.select(this)
            .transition().duration(100)
            .attr('fill', '#CCCCFF');
        })
        .on('mouseout', function (evt, d) {
          tooltip.style('opacity', 0);
          d3.select(this)
            .transition().duration(100)
            .attr('fill', d => {
              switch (d[0]) {
                case 'American':
                  return '#40e0d0';
                case 'European':
                  return '#ffb6c1';
                case 'Japanese':
                  return '#2acaea';
                default:
                  return 'gray';
              }
            });
        });

      // Add the x-axis
      svg.append('g')
        .attr('transform', `translate(0, ${height - padding.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        // .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'middle');
  
      // Add the y-axis based on selected option
      svg.append('g')
        .attr('transform', `translate(${padding.left}, 0)`)
        .call(d3.axisLeft(y))
        .append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text(selectedOption === "displacement" ? "Average Displacement" :
             selectedOption === "weight" ? "Average Weight" :
             selectedOption === "mpg" ? "Average MPG" :
             "Average Horsepower");
  
      // Add labels
      svg.append('text')
        .text('Origin')
        .attr('x', width / 2)
        .attr('y', height - 5)
        .style('text-anchor', 'middle')
        .style('font-size', 15);
  
    /*This is removed because the labels are overwriting each other  */
    //   svg.append('text')
    //     .text(selectedOption === "displacement" ? "Average Displacement" :
    //          selectedOption === "weight" ? "Average Weight" :
    //          selectedOption === "mpg" ? "Average MPG" :
    //          "Average Horsepower")
    //     .attr('x', -height / 2)
    //     .attr('y', 20)
    //     .attr('transform', 'rotate(-90)')
    //     .style('text-anchor', 'middle')
    //     .style('font-size', 15);
    });
}