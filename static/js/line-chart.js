// Line chart visualization module for BRICS Emissions Dashboard
import { countryColors } from './config.js';
import { populationData } from './config.js';
import { showTooltip, hideTooltip } from './utils.js';

/**
 * Creates a line chart showing emissions over time
 * @param {HTMLElement} container - The DOM element to contain the chart
 * @param {Array} bricsData - The emissions data for BRICS countries
 * @param {Array} years - List of years in the dataset
 * @param {number} currentYear - The currently selected year
 * @param {string} viewMode - Display mode ('total' or 'perCapita')
 * @param {boolean} eventModalActive - Whether an event modal is currently shown
 * @returns {Object} The D3 selection of the SVG element
 */
export function createLineChart(container, bricsData, years, currentYear, viewMode, eventModalActive) {
    const width = container.offsetWidth;
    const height = 400;
    const margin = {top: 20, right: 80, bottom: 30, left: 60};

    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3.scaleLinear()
        .domain([d3.min(years, d => +d), d3.max(years, d => +d)])
        .range([0, width - margin.left - margin.right]);

    // Y scale (will be updated based on data)
    const y = d3.scaleLinear()
        .range([height - margin.top - margin.bottom, 0]);

    // Line generator
    const line = d3.line()
        .x(d => x(+d.year))
        .y(d => y(+d.value))
        .curve(d3.curveMonotoneX); // Smoother curve

    // Add X axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add Y axis
    const yAxis = svg.append("g")
        .attr("class", "y-axis");

    // Add lines for each country
    const countryLines = svg.append("g")
        .attr("class", "lines");

    // Add legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - margin.left - margin.right - 10}, 0)`);

    // Add legend items
    ["Brazil", "Russia", "India", "China", "South Africa"].forEach((country, i) => {
        legend.append("rect")
            .attr("x", -80)
            .attr("y", i * 20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", countryColors[country]);

        legend.append("text")
            .attr("x", -65)
            .attr("y", i * 20 + 9)
            .text(country)
            .attr("fill", "white")
            .style("font-size", "12px");
    });

    // Initial update
    updateLineChart(svg, container, bricsData, years, currentYear, viewMode, eventModalActive);

    return svg;
}

/**
 * Updates the line chart based on current settings
 * @param {Object} svg - The D3 selection of the SVG element
 * @param {HTMLElement} container - The DOM element containing the chart
 * @param {Array} bricsData - The emissions data for BRICS countries
 * @param {Array} years - List of years in the dataset
 * @param {number} currentYear - The currently selected year
 * @param {string} viewMode - Display mode ('total' or 'perCapita')
 * @param {boolean} eventModalActive - Whether an event modal is currently shown
 */
export function updateLineChart(svg, container, bricsData, years, currentYear, viewMode, eventModalActive) {
    const width = container.offsetWidth;
    const height = container.offsetHeight || 400;
    const margin = {top: 20, right: 80, bottom: 30, left: 60};

    // Process data for line chart
    const chartData = [];

    ["Brazil", "Russia", "India", "China", "South Africa"].forEach(country => {
        const countryData = bricsData.find(d => d.Country === country);
        if (countryData) {
            years.forEach(year => {
                let value = countryData[year];

                // If per capita view, divide by population (in millions)
                if (viewMode === 'perCapita') {
                    // Find closest population year
                    const popYears = Object.keys(populationData[country]).map(Number);
                    const closestPopYear = popYears.reduce((prev, curr) => {
                        return (Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev);
                    });
                    value = value / populationData[country][closestPopYear];
                }

                chartData.push({
                    country: country,
                    year: year,
                    value: value
                });
            });
        }
    });

    // Update scales
    const x = d3.scaleLinear()
        .domain([d3.min(years, d => +d), d3.max(years, d => +d)])
        .range([0, width - margin.left - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.value) * 1.1])
        .range([height - margin.top - margin.bottom, 0]);

    // Update Y axis
    svg.select(".y-axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y).ticks(5));

    // Update Y axis label
    svg.select(".y-axis-label").remove();
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -(height - margin.top - margin.bottom) / 2)
        .attr("text-anchor", "middle")
        .text(viewMode === 'perCapita' ? "Emissions per capita (Mt CO₂e)" : "Emissions (Mt CO₂e)")
        .attr("fill", "white");

    // Line generator
    const line = d3.line()
        .x(d => x(+d.year))
        .y(d => y(+d.value))
        .curve(d3.curveMonotoneX);

    // Group data by country
    const nestedData = d3.group(chartData, d => d.country);

    // Update lines
    // Remove existing lines
    svg.selectAll(".country-line").remove();

    // Add lines for each country with animation
    nestedData.forEach((values, country) => {
        // Sort values by year
        values.sort((a, b) => +a.year - +b.year);
        
        // Create path
        const path = svg.append("path")
            .datum(values)
            .attr("class", "country-line")
            .attr("id", `line-${country.toLowerCase().replace(/\s/g, '-')}`)
            .attr("fill", "none")
            .attr("stroke", countryColors[country])
            .attr("stroke-width", 2.5)
            .attr("d", line);
        
        // Animate path drawing
        const pathLength = path.node().getTotalLength();
        path
            .attr("stroke-dasharray", pathLength)
            .attr("stroke-dashoffset", pathLength)
            .transition()
            .duration(1500)
            .attr("stroke-dashoffset", 0);
    });
    
    // Add vertical line for current year
    svg.selectAll(".current-year-line").remove();
    
    svg.append("line")
        .attr("class", "current-year-line")
        .attr("x1", x(currentYear))
        .attr("x2", x(currentYear))
        .attr("y1", 0)
        .attr("y2", height - margin.top - margin.bottom)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "5,5");
        
    // Add circles for current year values
    svg.selectAll(".current-year-point").remove();
    
    nestedData.forEach((values, country) => {
        const currentYearData = values.find(d => +d.year === +currentYear);
        if (currentYearData) {
            svg.append("circle")
                .attr("class", "current-year-point")
                .attr("cx", x(currentYearData.year))
                .attr("cy", y(currentYearData.value))
                .attr("r", 6)
                .attr("fill", countryColors[country])
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.5)
                .on("mouseover", function(event) {
                    const valueLabel = viewMode === 'perCapita' ? 
                        `${country}: ${currentYearData.value.toFixed(2)} Mt CO₂e per capita` : 
                        `${country}: ${Math.round(currentYearData.value)} Mt CO₂e`;
                    showTooltip(event, valueLabel, eventModalActive);
                })
                .on("mouseout", hideTooltip);
        }
    });
}