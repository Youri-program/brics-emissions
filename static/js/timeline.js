// Timeline visualization module for BRICS Emissions Dashboard
import { historicalEvents } from '/static/js/config.js';
import { showEventDetails } from '/static/js/utils.js';

/**
 * Sets up the timeline slider and event markers
 * @param {Array} years - List of years in the dataset
 * @param {number} currentYear - The currently selected year
 * @param {Function} onYearChange - Callback function when year changes
 */
export function setupTimeline(years, currentYear, onYearChange) {
    const slider = document.getElementById("year-slider");
    const yearDisplay = document.getElementById("year-display");
    const sliderContainer = document.querySelector(".year-slider-container");

    console.log("Setting up timeline with years:", years);

    // Set up initial values
    slider.min = years[0];
    slider.max = years[years.length - 1];
    slider.value = currentYear;
    yearDisplay.textContent = currentYear;

    // Calculate the slider width and the thumb position
    const sliderWidth = sliderContainer.offsetWidth - 20; // Adjusting for padding
    const yearRange = parseInt(years[years.length - 1]) - parseInt(years[0]);

    // Place year display at the correct position initially
    updateYearDisplayPosition(slider, sliderWidth, yearRange, parseInt(years[0]));

    // Add historical events to timeline
    const timelineEvents = document.getElementById("timeline-events");
    timelineEvents.innerHTML = ''; // Clear existing events

    historicalEvents.forEach(event => {
        const position = ((event.year - parseInt(years[0])) / yearRange) * sliderWidth;
        const eventMarker = document.createElement("div");
        eventMarker.className = "timeline-event";
        eventMarker.style.left = position + "px";
        eventMarker.setAttribute("data-title", `${event.year}: ${event.title}`);
        eventMarker.addEventListener("click", () => {
            showEventDetails(event, onYearChange);
        });
        timelineEvents.appendChild(eventMarker);
    });

    // Clean up any existing event listeners
    slider.removeEventListener("input", sliderInputHandler);

    // Create a named function for the event listener so we can remove it if needed
    function sliderInputHandler() {
        const year = this.value;
        console.log("Timeline year changed to:", year);
        yearDisplay.textContent = year;

        // Update the year display position
        updateYearDisplayPosition(slider, sliderWidth, yearRange, parseInt(years[0]));

        // Important: Call the onYearChange callback to update visualizations
        onYearChange(year);
    }

    // Add the event listener
    slider.addEventListener("input", sliderInputHandler);

    // Also add change event listener for browsers that might not trigger input events continuously
    slider.addEventListener("change", sliderInputHandler);

    // Handle window resize
    window.addEventListener('resize', function() {
        // Recalculate slider width
        const newSliderWidth = sliderContainer.offsetWidth - 20;
        updateYearDisplayPosition(slider, newSliderWidth, yearRange, parseInt(years[0]));
    });

    console.log("Timeline setup complete");
}

/**
 * Update the position of the year display to follow the slider thumb
 * @param {HTMLElement} slider - The slider element
 * @param {number} sliderWidth - Width of the slider
 * @param {number} yearRange - Range between min and max years
 * @param {number} minYear - Minimum year value
 */
function updateYearDisplayPosition(slider, sliderWidth, yearRange, minYear) {
    const yearDisplay = document.getElementById("year-display");
    if (!yearDisplay) {
        console.error("Year display element not found");
        return;
    }

    const currentYear = parseInt(slider.value);

    // Calculate position based on current year value
    const percentage = (currentYear - minYear) / yearRange;
    const position = percentage * sliderWidth;

    // Update the left position of the year display
    yearDisplay.style.left = `${position}px`;
}