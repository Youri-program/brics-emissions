// Configuration file for BRICS Emissions Dashboard
// Contains all constants, colors, events, and data configurations

// Color scheme for BRICS countries
export const countryColors = {
    "Brazil": "#2ecc71",
    "Russia": "#3498db", 
    "India": "#f1c40f",
    "China": "#e74c3c",
    "South Africa": "#9b59b6"
};

// Sector colors
export const sectorColors = {
    "Energy": "#e67e22",
    "Industrial Processes": "#f39c12",
    "Agriculture": "#16a085",
    "Waste": "#27ae60",
    "Land-Use Change": "#2980b9"
};

// Historical events that affected emissions
export const historicalEvents = [
    { year: 1992, title: "Earth Summit", description: "The United Nations Conference on Environment and Development (Earth Summit) was held in Rio de Janeiro. It resulted in the UN Framework Convention on Climate Change, which set non-binding limits on greenhouse gas emissions for individual countries." },
    { year: 1997, title: "Kyoto Protocol", description: "The Kyoto Protocol was adopted, committing industrialized countries to reduce greenhouse gas emissions. While Russia eventually ratified it, other BRICS nations were not obligated to reduce emissions as developing countries." },
    { year: 2001, title: "China joins WTO", description: "China's entry into the World Trade Organization accelerated its industrial growth and export-oriented manufacturing, leading to a significant increase in emissions in the following years." },
    { year: 2008, title: "Global Financial Crisis", description: "The economic downturn temporarily reduced emissions growth in BRICS countries, particularly affecting industrial output and energy consumption in Russia and Brazil." },
    { year: 2015, title: "Paris Agreement", description: "All BRICS countries signed the Paris Agreement, pledging to limit global warming. China committed to peaking its carbon emissions by around 2030, while India focused on increasing renewable energy capacity." }
];

// Country population data (millions) for per capita calculations
export const populationData = {
    "Brazil": { 1990: 149.4, 2000: 174.8, 2010: 195.7, 2018: 209.5 },
    "Russia": { 1990: 147.7, 2000: 146.6, 2010: 142.8, 2018: 144.5 },
    "India": { 1990: 873.3, 2000: 1056.6, 2010: 1234.3, 2018: 1352.6 },
    "China": { 1990: 1135.2, 2000: 1262.6, 2010: 1337.7, 2018: 1392.7 },
    "South Africa": { 1990: 36.8, 2000: 44.0, 2010: 51.2, 2018: 57.8 }
};

// Synthetic sector data for demonstration (since we don't have actual sector breakdown)
export const sectorProportions = {
    "Brazil": { "Energy": 0.33, "Industrial Processes": 0.07, "Agriculture": 0.32, "Waste": 0.05, "Land-Use Change": 0.23 },
    "Russia": { "Energy": 0.78, "Industrial Processes": 0.11, "Agriculture": 0.06, "Waste": 0.03, "Land-Use Change": 0.02 },
    "India": { "Energy": 0.68, "Industrial Processes": 0.08, "Agriculture": 0.16, "Waste": 0.03, "Land-Use Change": 0.05 },
    "China": { "Energy": 0.73, "Industrial Processes": 0.14, "Agriculture": 0.09, "Waste": 0.02, "Land-Use Change": 0.02 },
    "South Africa": { "Energy": 0.80, "Industrial Processes": 0.10, "Agriculture": 0.05, "Waste": 0.03, "Land-Use Change": 0.02 }
};