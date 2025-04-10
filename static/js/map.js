// Map visualization module for BRICS Emissions Dashboard
import { countryColors } from '/static/js/config.js';
import { showTooltip, hideTooltip } from '/static/js/utils.js';

/**
 * Creates the world map with BRICS countries highlighted
 * @param {HTMLElement} container - The DOM element to contain the map
 * @param {Array} bricsData - The emissions data for BRICS countries
 * @param {number} currentYear - The currently selected year
 * @param {boolean} eventModalActive - Whether an event modal is currently shown
 * @returns {Object} Object containing the svg and projection for later updates
 */
export function createMap(container, bricsData, currentYear, eventModalActive) {
    // Clear any existing content
    container.innerHTML = "";

    const width = container.offsetWidth;
    const height = 400;

    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    // Adjust projection scale and center to ensure map is fully visible
    const projection = d3.geoNaturalEarth1()
        .scale(width / 5.5) // Reduced scale to fit all continents
        .center([0, 15]) // Adjust center slightly north to better fit the view
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Add a background rect for debugging
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .attr("opacity", 0.2);

    // Draw simple world outline
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .then(function(world) {
            // Draw countries
            svg.append("g")
                .selectAll("path")
                .data(world.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", d => {
                    const countryName = d.properties.name;
                    if (countryName === "Brazil" || countryName === "Russia" ||
                        countryName === "India" || countryName === "China" ||
                        countryName === "South Africa") {
                        return countryColors[countryName];
                    }
                    return "#2d3436";
                })
                .attr("stroke", "#111")
                .attr("stroke-width", 0.5)
                .attr("opacity", d => {
                    const countryName = d.properties.name;
                    if (countryName === "Brazil" || countryName === "Russia" ||
                        countryName === "India" || countryName === "China" ||
                        countryName === "South Africa") {
                        return 1;
                    }
                    return 0.3; // Fade non-BRICS countries
                })
                .on("mouseover", function(event, d) {
                    if (["Brazil", "Russia", "India", "China", "South Africa"].includes(d.properties.name)) {
                        d3.select(this).attr("fill-opacity", 0.7);

                        // Find emissions data for this country in the current year
                        const countryData = bricsData.find(item => item.Country === d.properties.name);
                        const emissionValue = countryData ? countryData[currentYear] : 'No data';

                        showTooltip(event, `${d.properties.name}: ${emissionValue} Mt CO₂e`, eventModalActive);
                    }
                })
                .on("mouseout", function() {
                    d3.select(this).attr("fill-opacity", 1);
                    hideTooltip();
                });

            // Add circles proportional to emissions in current year
            updateMapCircles(svg, projection, bricsData, currentYear);
    });

    return { svg, projection };
}

/**
 * Updates the circles on the map based on the current year's data
 * @param {Object} svg - The D3 selection of the SVG element
 * @param {Object} projection - The D3 geo projection
 * @param {Array} bricsData - The emissions data for BRICS countries
 * @param {number} currentYear - The currently selected year
 */
export function updateMapCircles(svg, projection, bricsData, currentYear) {
    // Remove existing circles
    svg.selectAll(".country-circle").remove();

    // Add new circles based on current year
    bricsData.forEach(country => {
        const countryName = country.Country;
        const emission = country[currentYear];

        // Skip if country name is not in BRICS or no emission data
        if (!["Brazil", "Russia", "India", "China", "South Africa"].includes(countryName) || !emission) {
            return;
        }

        // Define circle size based on emissions (scaled)
        const circleSize = Math.sqrt(emission) / 10;

        // Adjusted coordinates for better visibility
        const coords = {
            "Brazil": [-55, -15],
            "Russia": [90, 60],
            "India": [80, 22],
            "China": [105, 35],
            "South Africa": [25, -30]
        };

        if (coords[countryName]) {
            const [lon, lat] = coords[countryName];
            const [x, y] = projection([lon, lat]);

            svg.append("circle")
                .attr("class", "country-circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 0) // Start with radius 0 for animation
                .attr("fill", countryColors[countryName])
                .attr("fill-opacity", 0.7)
                .attr("stroke", "#fff")
                .attr("stroke-width", 1)
                .transition()
                .duration(1000)
                .attr("r", circleSize); // Animate to actual size
        }
    });
}