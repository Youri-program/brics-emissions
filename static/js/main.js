// Main application file for BRICS Emissions Dashboard
// Using absolute paths for imports
const staticUrlBase = '/static/js/';

// Import modules with absolute paths
import { createSyntheticData } from '/static/js/emissions-data.js';
import { setupModal, revealOnScroll } from '/static/js/utils.js';
import { createMap, updateMapCircles } from '/static/js/map.js';
import { setupTimeline } from '/static/js/timeline.js';
import { createLineChart, updateLineChart } from '/static/js/line-chart.js';
import { createStackedBar, updateStackedBar, setupSectorControls } from '/static/js/stacked-bar.js';
import { updateNarrative, updateKeyInsights } from '/static/js/narrative.js';

// Global variables
let bricsData;
let years;
let currentYear = 2018;
let viewMode = 'total'; // 'total' or 'perCapita'
let eventModalActive = false;
let map, lineChart, stackedBarChart;

/**
 * Main function to load data and initialize visualizations
 */
function init() {
    console.log("Initializing BRICS Dashboard...");

    // Check if we're on the visualization page
    if (!document.getElementById("line-chart")) {
        console.log("Not on visualization page, skipping initialization");
        return; // Not on visualization page
    }

    // Get data
    const syntheticDataSet = createSyntheticData();
    bricsData = syntheticDataSet.data;
    years = syntheticDataSet.years;

    console.log(`Loaded data for ${bricsData.length} countries, from ${years[0]} to ${years[years.length-1]}`);

    // Initialize visualizations
    setupTimeline(years, currentYear, updateYear);

    // Create visualizations
    const mapContainer = document.getElementById("map-container");
    map = createMap(mapContainer, bricsData, currentYear, eventModalActive);

    const lineChartContainer = document.getElementById("line-chart");
    lineChart = createLineChart(lineChartContainer, bricsData, years, currentYear, viewMode, eventModalActive);

    const stackedBarContainer = document.getElementById("stacked-bar");
    stackedBarChart = createStackedBar(stackedBarContainer, bricsData, currentYear, eventModalActive);

    updateNarrative(bricsData, currentYear);
    updateKeyInsights(bricsData, currentYear);
    setupModal(() => { eventModalActive = false; });

    // Set up event listeners for view mode
    document.getElementById("total-emissions").addEventListener("click", function() {
        viewMode = 'total';
        document.getElementById("per-capita").classList.remove("active");
        this.classList.add("active");
        updateVisualizations();
    });

    document.getElementById("per-capita").addEventListener("click", function() {
        viewMode = 'perCapita';
        document.getElementById("total-emissions").classList.remove("active");
        this.classList.add("active");
        updateVisualizations();
    });

    // Setup country selector for stacked bar
    setupSectorControls(() => {
        updateStackedBar(stackedBarChart, document.getElementById("stacked-bar"), bricsData, currentYear, eventModalActive);
    });

    // Add smooth animations
    window.addEventListener('scroll', revealOnScroll);
}

/**
 * Update year function
 * @param {number} year - The newly selected year
 */
function updateYear(year) {
    console.log("updateYear called with year:", year);
    currentYear = year;

    // The year display text is already updated in the timeline handler
    // but we set it here again just to be sure
    const yearDisplay = document.getElementById("year-display");
    if (yearDisplay) {
        yearDisplay.textContent = currentYear;
    }

    // Update all visualizations with the new year
    updateVisualizations();
}

/**
 * Update all visualizations based on current settings
 */
function updateVisualizations() {
    console.log("updateVisualizations called for year:", currentYear);

    // Only continue if on visualization page
    if (!document.getElementById("line-chart")) {
        console.log("Not on visualization page or line-chart not found, skipping updates");
        return;
    }

    if (typeof map === 'undefined' || !map || !map.svg || !map.projection) {
        console.error("Map not properly initialized");
        return;
    }

    // Check if bricsData is available
    if (!bricsData || !Array.isArray(bricsData) || bricsData.length === 0) {
        console.error("No BRICS data available for visualization");
        return;
    }

    // Debug data access
    const sampleCountry = bricsData.find(country => country.Country === "China");
    if (sampleCountry) {
        console.log(`Sample data - China ${currentYear}: ${sampleCountry[currentYear]}`);
    }

    try {
        // Update each visualization
        updateMapCircles(map.svg, map.projection, bricsData, currentYear);
        updateLineChart(lineChart, document.getElementById("line-chart"), bricsData, years, currentYear, viewMode, eventModalActive);
        updateStackedBar(stackedBarChart, document.getElementById("stacked-bar"), bricsData, currentYear, eventModalActive);
        updateNarrative(bricsData, currentYear);
        updateKeyInsights(bricsData, currentYear);
        console.log("All visualizations updated successfully");
    } catch (error) {
        console.error("Error updating visualizations:", error);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM loaded, initializing application");
    init();
});