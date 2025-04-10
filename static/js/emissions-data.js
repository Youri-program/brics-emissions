// Function to create synthetic BRICS data
export function createSyntheticData() {
    // Base values for 1990 (in Mt CO2 equivalent)
    const baseEmissions = {
        "Brazil": 1500,
        "Russia": 3000,
        "India": 1000,
        "China": 2500,
        "South Africa": 350
    };

    // Growth patterns
    const growthPatterns = {
        "Brazil": { steadyUntil: 2004, peakYear: 2004, peakValue: 2700, decline: true },
        "Russia": { steadyUntil: 1991, dropUntil: 1998, dropTo: 2200, steadyGrowth: 0.01 },
        "India": { baseGrowth: 0.04, accelerationYear: 2002, acceleratedGrowth: 0.06 },
        "China": { baseGrowth: 0.03, accelerationYear: 2001, acceleratedGrowth: 0.08, slowdownYear: 2012, slowdownGrowth: 0.03 },
        "South Africa": { baseGrowth: 0.02, plateau: 2010 }
    };

    const yearsList = [];
    for (let year = 1990; year <= 2018; year++) {
        yearsList.push(year.toString());
    }

    const syntheticData = [];

    Object.keys(baseEmissions).forEach(country => {
        const countryData = {
            Country: country,
            "Data source": "Synthetic",
            Sector: "All",
            Gas: "All GHG",
            Unit: "Mt CO2 equivalent"
        };

        let emissions = baseEmissions[country];
        const growth = growthPatterns[country];

        yearsList.forEach(year => {
            const numYear = parseInt(year);

            // Apply different growth patterns based on country model
            if (country === "Brazil") {
                if (numYear <= growth.steadyUntil) {
                    emissions *= (1 + 0.02);
                } else if (numYear === growth.peakYear) {
                    emissions = growth.peakValue;
                } else if (growth.decline && numYear > growth.peakYear) {
                    emissions *= (1 - 0.01);
                }
            } else if (country === "Russia") {
                if (numYear <= growth.steadyUntil) {
                    // Steady
                } else if (numYear <= growth.dropUntil) {
                    emissions = baseEmissions[country] - ((numYear - growth.steadyUntil) / (growth.dropUntil - growth.steadyUntil)) * (baseEmissions[country] - growth.dropTo);
                } else {
                    emissions *= (1 + growth.steadyGrowth);
                }
            } else if (country === "India") {
                if (numYear < growth.accelerationYear) {
                    emissions *= (1 + growth.baseGrowth);
                } else {
                    emissions *= (1 + growth.acceleratedGrowth);
                }
            } else if (country === "China") {
                if (numYear < growth.accelerationYear) {
                    emissions *= (1 + growth.baseGrowth);
                } else if (numYear < growth.slowdownYear) {
                    emissions *= (1 + growth.acceleratedGrowth);
                } else {
                    emissions *= (1 + growth.slowdownGrowth);
                }
            } else if (country === "South Africa") {
                if (numYear < growth.plateau) {
                    emissions *= (1 + growth.baseGrowth);
                } else {
                    emissions *= (1 + 0.005); // Very slow growth after plateau
                }
            }

            // Add some randomness (±2%)
            const randomFactor = 0.98 + Math.random() * 0.04;
            emissions *= randomFactor;

            countryData[year] = Math.round(emissions);
        });

        syntheticData.push(countryData);
    });

    return { data: syntheticData, years: yearsList };
}