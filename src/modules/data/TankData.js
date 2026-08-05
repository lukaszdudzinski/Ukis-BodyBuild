/**
 * Central definitions for SCUBA tank sizes.
 * Used across SAC, Rock Bottom, Bailout, and Ballast calculators.
 */
export const TANK_DEFINITIONS = [
    {
        group: "Pojedyncze (Single)",
        options: [
            { id: "alu11", label: "Alu 11L (S80)", value: 11.1 },
            { id: "alu7", label: "Alu 7L", value: 7 },
            { id: "steel7", label: "Stal 7L (232b)", value: 7 },
            { id: "steel10", label: "Stal 10L (232b)", value: 10 },
            { id: "steel10_300", label: "Stal 10L (300b)", value: 10 },
            { id: "steel12", label: "Stal 12L (232b)", value: 12 },
            { id: "steel12_300", label: "Stal 12L (300b)", value: 12 },
            { id: "steel15", label: "Stal 15L (232b)", value: 15 },
            { id: "steel18", label: "Stal 18L", value: 18 }
        ]
    },
    {
        group: "Zestawy (Twin)",
        options: [
            { id: "twin7_232", label: "Twin 2x7L (232b)", value: 14 },
            { id: "twin7_300", label: "Twin 2x7L (300b)", value: 14 },
            { id: "twin85_232", label: "Twin 2x8.5L (232b)", value: 17 },
            { id: "twin85_300", label: "Twin 2x8.5L (300b)", value: 17 },
            { id: "twin10_232", label: "Twin 2x10L (232b)", value: 20 },
            { id: "twin10_300", label: "Twin 2x10L (300b)", value: 20 },
            { id: "twin12_232", label: "Twin 2x12L (232b)", value: 24 },
            { id: "twin12_300", label: "Twin 2x12L (300b)", value: 24 },
            { id: "twin15_232", label: "Twin 2x15L (232b)", value: 30 },
            { id: "twin15_300", label: "Twin 2x15L (300b)", value: 30 }
        ]
    }
];

/**
 * Helper to populate a select element with tank options.
 * @param {HTMLSelectElement} selectElement 
 * @param {string} selectedId optional, to pre-select
 */
export const populateTankSelect = (selectElement, selectedId = null) => {
    if (!selectElement) return;

    // Clear existing options
    selectElement.innerHTML = '';

    TANK_DEFINITIONS.forEach(group => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = group.group;

        group.options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.id; // VALUE IS NOW THE ID string (e.g. 'alu11')
            option.textContent = opt.label;

            if (selectedId === opt.id) {
                option.selected = true;
            }

            optgroup.appendChild(option);
        });

        selectElement.appendChild(optgroup);
    });
};

/**
 * Helper to get tank volume in liters from ID.
 * @param {string} id 
 * @returns {number} volume in liters
 */
export const getTankVolume = (id) => {
    for (const group of TANK_DEFINITIONS) {
        const found = group.options.find(opt => opt.id === id);
        if (found) return found.value;
    }
    // Fallback? Or throw?
    // If using <select>, it shouldn't happen unless default is weird.
    return 15; // Safe fallback
};
