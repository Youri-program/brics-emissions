// Utility functions for BRICS Emissions Dashboard

// Show tooltip with specified text at mouse position
export function showTooltip(event, text, modalActiveFlag) {
    // Don't show tooltips if modal is active
    if (modalActiveFlag) return;
    
    // Remove any existing tooltips
    d3.selectAll(".tooltip").remove();
    
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .html(text);
        
    const tooltipWidth = tooltip.node().getBoundingClientRect().width;
    
    tooltip.style("left", (event.pageX - tooltipWidth / 2) + "px")
        .style("top", (event.pageY - 40) + "px")
        .transition()
        .duration(200)
        .style("opacity", 1);
}

// Hide all tooltips
export function hideTooltip() {
    d3.selectAll(".tooltip")
        .transition()
        .duration(200)
        .style("opacity", 0)
        .remove();
}

// Animation for sections as they scroll into view
export function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75 && !section.classList.contains('revealed')) {
            section.classList.add('fade-in');
            section.classList.add('revealed');
        }
    });
}

// Set up event detail modal
export function setupModal(onClose) {
    // Create modal element if it doesn't exist
    if (!document.getElementById('event-modal')) {
        const modal = document.createElement('div');
        modal.id = 'event-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3 class="modal-title"></h3>
                <p class="modal-description"></p>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add event listener to close modal
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('event-modal').style.display = 'none';
            onClose();
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('event-modal');
            if (event.target === modal) {
                modal.style.display = 'none';
                onClose();
            }
        });
    }
}

// Show event details in modal
export function showEventDetails(event, onYearChange) {
    const modal = document.getElementById('event-modal');
    const title = modal.querySelector('.modal-title');
    const description = modal.querySelector('.modal-description');
    
    title.textContent = `${event.year}: ${event.title}`;
    description.textContent = event.description;
    
    modal.style.display = 'flex';
    
    // Set slider to event year
    const slider = document.getElementById('year-slider');
    slider.value = event.year;
    
    // Notify about year change
    onYearChange(event.year);
}

// Debounce function for resize events
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}