// Stacked bar chart visualization module for BRICS Emissions Dashboard
import { sectorColors, sectorProportions } from './config.js';
import { showTooltip, hideTooltip } from './utils.js';

/**
 * Creates a stacked bar chart for sector breakdown
 * @param {HTMLElement} container - The DOM element to contain the chart
 * @param {Array} bricsData - The emissions data for BRICS countries
 * @param {number} currentYear - The currently selected year
 * @param {boolean} eventModalActive - Whether an event modal is currently shown
 * @returns {Object} The D3 selection of the SVG element
 */
export function createStackedBar(container, bricsData, currentYear, eventModalActive) {
    const width = container.offsetWidth;
    const height = 400;
    const margin = {top: 20, right: 20, bottom: 30, left: 60};
    
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Add legend for sectors
    const legend = svg.append("g")
        .attr("class", "sector-legend")
        .attr("transform", `translate(${width - margin.left - margin.right - 150}, 0)`);
    
    const sectors = Object.keys(sectorProportions.Brazil);
    
    sectors.forEach((sector, i) => {
        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", sectorColors[sector]);
            
        legend.append("text")
            .attr("x", 15)
            .attr("y", i * 20 + 9)
            .text(sector)
            .attr("fill", "white")
            .style("font-size", "12px");
    });
    
    // We'll update this based on the selected country
    updateStackedBar(svg, container, bricsData, currentYear, eventModalActive);
    
    return svg;
}

/**
 * Updates the stacked bar chart based on selected country and year
 * @param {Object} svg - The D3 selection of the SVG element
 * @param {HTMLElement} container - The DOM element containing the chart
 * @param {Array} bricsData - The emissions data for BRICS countries
 * @param {number} currentYear - The currently selected year
 * @param {boolean} eventModalActive - Whether an event modal is currently shown
 */
export function updateStackedBar(svg, container, bricsData, currentYear, eventModalActive) {
    const selectedCountry = document.getElementById("country-select").value;
    const width = container.offsetWidth;
    const height = container.offsetHeight || 400;
    const margin = {top: 20, right: 20, bottom: 30, left: 60};
    
    // Get sectors and their proportions
    const sectors = Object.keys(sectorProportions[selectedCountry]);
    
    // Get total emission for selected country and year
    const countryData = bricsData.find(d => d.Country === selectedCountry);
    const totalEmission = countryData ? countryData[currentYear] : 0;
    
    // Create sector data with values based on proportions
    const sectorData = sectors.map(sector => ({
        sector: sector,
        value: totalEmission * sectorProportions[selectedCountry][sector]
    }));
    
    // Set up scales
    const x = d3.scaleBand()
        .domain([selectedCountry])
        .range([0, width - margin.left - margin.right - 150]) // Adjust for legend
        .padding(0.3);
    
    const y = d3.scaleLinear()
        .domain([0, totalEmission])
        .range([height - margin.top - margin.bottom, 0]);
    
    // Update y-axis
    svg.selectAll(".y-axis").remove();
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));
    
    // Update Y axis label
    svg.selectAll(".y-axis-label").remove();
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -(height - margin.top - margin.bottom) / 2)
        .attr("text-anchor", "middle")
        .text("Emissions (Mt CO₂e)")
        .attr("fill", "white");
    
    // Stack the data
    let cumulative = 0;
    sectorData.forEach(d => {
        d.start = cumulative;
        cumulative += d.value;
        d.end = cumulative;
    });
    
    // Remove existing bars
    svg.selectAll(".bar-segment").remove();
    
    // Add a group for each segment with animation
    const bars = svg.selectAll(".bar-segment")
        .data(sectorData)
        .enter()
        .append("rect")
        .attr("class", "bar-segment")
        .attr("x", x(selectedCountry))
        .attr("y", height - margin.top - margin.bottom) // Start from bottom
        .attr("height", 0) // Start with height 0
        .attr("width", x.bandwidth())
        .attr("fill", d => sectorColors[d.sector])
        .on("mouseover", function(event, d) {
            showTooltip(event, `${d.sector}: ${Math.round(d.value)} Mt CO₂e (${Math.round(d.value/totalEmission*100)}%)`, eventModalActive);
        })
        .on("mouseout", hideTooltip);
    
    // Animate bars growing from bottom
    bars.transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr("y", d => y(d.end))
        .attr("height", d => y(d.start) - y(d.end));
    
    // Add country name label
    svg.selectAll(".country-label").remove();
    svg.append("text")
        .attr("class", "country-label")
        .attr("x", x(selectedCountry) + x.bandwidth() / 2)
        .attr("y", height - margin.top - margin.bottom + 20)
        .attr("text-anchor", "middle")
        .text(selectedCountry)
        .attr("fill", "white");
}

/**
 * Sets up event listeners for the stacked bar controls
 * @param {Function} onCountryChange - Callback function when country selection changes
 */
export function setupSectorControls(onCountryChange) {
    const countrySelect = document.getElementById("country-select");
    if (countrySelect) {
        countrySelect.addEventListener("change", () => {
            onCountryChange();
        });
    }
}