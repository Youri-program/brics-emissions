// Narrative text module for BRICS Emissions Dashboard
import { historicalEvents } from '/static/js/config.js';

/**
 * Updates the narrative text based on the current year selection
 * @param {Array} bricsData - The emissions data for BRICS countries
 * @param {number} currentYear - The currently selected year
 */
export function updateNarrative(bricsData, currentYear) {
    const narrativeText = document.getElementById("narrative-text");
    
    if (!narrativeText) return;
    
    // Get total emissions for current year
    const totalEmissions = bricsData.reduce((sum, country) => sum + country[currentYear], 0);
    
    // Find country with highest emissions
    let highestEmitter = bricsData[0];
    bricsData.forEach(country => {
        if (country[currentYear] > highestEmitter[currentYear]) {
            highestEmitter = country;
        }
    });
    
    // Example narrative logic based on year
    let narrativeHtml = "";
    
    if (+currentYear <= 1995) {
        narrativeHtml = `
            <p>In the early 1990s, BRICS countries contributed approximately <strong>${Math.round(totalEmissions).toLocaleString()}</strong> Mt CO₂e to global emissions. Russia was the largest emitter among them, reflecting its industrial legacy from the Soviet era.</p>
            <p>This period saw the 1992 Earth Summit in Rio de Janeiro, where the UN Framework Convention on Climate Change was established, marking the beginning of global climate negotiations.</p>
        `;
    } else if (+currentYear <= 2000) {
        narrativeHtml = `
            <p>In the late 1990s, <strong>${highestEmitter.Country}</strong> became the largest emitter among BRICS countries with <strong>${Math.round(highestEmitter[currentYear]).toLocaleString()}</strong> Mt CO₂e.</p>
            <p>The Kyoto Protocol was adopted in 1997, setting binding emission reduction targets for developed countries. As developing economies, most BRICS nations were exempt from emission reduction obligations, allowing their continued industrial growth.</p>
        `;
    } else if (+currentYear <= 2010) {
        narrativeHtml = `
            <p>The 2000s marked a period of rapid industrialization in China, which became not only the largest emitter among BRICS countries but also surpassed the United States to become the world's largest emitter around 2006.</p>
            <p>By ${currentYear}, total BRICS emissions had reached <strong>${Math.round(totalEmissions).toLocaleString()}</strong> Mt CO₂e, with China accounting for over 60% of this total.</p>
            <p>The 2008 global financial crisis temporarily slowed emissions growth in some BRICS countries as industrial output decreased.</p>
        `;
    } else {
        narrativeHtml = `
            <p>In ${currentYear}, BRICS countries collectively emitted approximately <strong>${Math.round(totalEmissions).toLocaleString()}</strong> Mt CO₂e, with <strong>${highestEmitter.Country}</strong> contributing the largest share at <strong>${Math.round(highestEmitter[currentYear]).toLocaleString()}</strong> Mt CO₂e.</p>
            <p>The Paris Agreement, signed in 2015, saw all BRICS nations pledge to combat climate change. China committed to peaking emissions around 2030, while India focused on increasing renewable energy capacity significantly.</p>
            <p>Despite their continued economic growth, several BRICS countries began investing heavily in renewable energy, with China becoming the world's largest producer of solar panels and wind turbines.</p>
        `;
    }
    
    // Find significant historical event for current year
    const relevantEvent = historicalEvents.find(event => event.year == currentYear);
    if (relevantEvent) {
        narrativeHtml += `
            <div class="historical-event">
                <h3>${relevantEvent.year}: ${relevantEvent.title}</h3>
                <p>${relevantEvent.description}</p>
            </div>
        `;
    }
    
    narrativeText.innerHTML = narrativeHtml;
    
    // Add fade-in animation
    narrativeText.classList.remove("fade-in");
    void narrativeText.offsetWidth; // Trigger reflow
    narrativeText.classList.add("fade-in");
}

/**
 * Generates key insights based on the current data
 * @param {Array} bricsData - The emissions data for BRICS countries
 * @param {number} currentYear - The currently selected year
 */
export function updateKeyInsights(bricsData, currentYear) {
    const insightsContainer = document.getElementById("key-insights");
    if (!insightsContainer) return;
    
    // Calculate insights
    const insights = [];
    
    // Current year total
    const totalCurrentYear = bricsData.reduce((sum, country) => sum + country[currentYear], 0);
    
    // Previous year for growth calculation
    const prevYear = Math.max(parseInt(currentYear) - 1, 1990).toString();
    const totalPrevYear = bricsData.reduce((sum, country) => sum + country[prevYear], 0);
    
    // Calculate year-over-year change
    const yoyChange = ((totalCurrentYear - totalPrevYear) / totalPrevYear * 100).toFixed(1);
    
    // Country with highest emissions
    const highestCountry = bricsData.reduce((max, country) => 
        country[currentYear] > max.value 
            ? {name: country.Country, value: country[currentYear]} 
            : max, 
        {name: '', value: 0}
    );
    
    // Country with fastest growth (comparing to 5 years ago if possible)
    const compareYear = Math.max(parseInt(currentYear) - 5, 1990).toString();
    let fastestGrowth = {name: '', growth: 0};
    
    bricsData.forEach(country => {
        const growth = ((country[currentYear] - country[compareYear]) / country[compareYear] * 100);
        if (growth > fastestGrowth.growth) {
            fastestGrowth = {name: country.Country, growth: growth};
        }
    });
    
    // Build insights HTML
    const insightsHTML = `
        <div class="insights-grid">
            <div class="insight-card">
                <h4>Total Emissions (${currentYear})</h4>
                <p class="insight-value">${Math.round(totalCurrentYear).toLocaleString()} Mt CO₂e</p>
                <p class="insight-change ${yoyChange >= 0 ? 'positive' : 'negative'}">
                    ${yoyChange >= 0 ? '+' : ''}${yoyChange}% from previous year
                </p>
            </div>
            <div class="insight-card">
                <h4>Largest Emitter</h4>
                <p class="insight-value">${highestCountry.name}</p>
                <p class="insight-detail">${Math.round(highestCountry.value).toLocaleString()} Mt CO₂e 
                (${Math.round(highestCountry.value/totalCurrentYear*100)}% of total)</p>
            </div>
            <div class="insight-card">
                <h4>Fastest Growing</h4>
                <p class="insight-value">${fastestGrowth.name}</p>
                <p class="insight-detail">+${Math.round(fastestGrowth.growth)}% since ${compareYear}</p>
            </div>
        </div>
    `;
    
    insightsContainer.innerHTML = insightsHTML;
    insightsContainer.classList.remove("fade-in");
    void insightsContainer.offsetWidth; // Trigger reflow
    insightsContainer.classList.add("fade-in");
}