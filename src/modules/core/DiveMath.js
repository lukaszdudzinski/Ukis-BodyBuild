/**
 * DiveMath - Core Physics & Constants
 * Centralizes all common diving calculations to prevent duplication.
 */
export const DiveMath = {
    CONSTANTS: {
        GRAVITY_ACCELERATION: 9.81,
        SALT_WATER_DENSITY: 1.03,
        FRESH_WATER_DENSITY: 1.0,
        ATMOSPHERE_BAR: 1.0,
        METERS_PER_ATM: 10,
        FRESH_WATER_CONVERSION: 10 / 10.3, // ~0.97
        AIR_O2: 0.21,
        AIR_N2: 0.79
    },

    /**
     * Calculates pressure in ATA at a given depth.
     * @param {number} depth - Depth in meters.
     * @param {boolean} isFreshWater - True if fresh water, false if salt (default).
     * @returns {number} Pressure in ATA.
     */
    calculateATA: (depth, isFreshWater = false) => {
        const conversion = isFreshWater ? DiveMath.CONSTANTS.FRESH_WATER_CONVERSION : 1.0;
        return (depth / 10 * conversion) + 1;
    },

    /**
     * Calculates Partial Pressure of a gas.
     * @param {number} fraction - Fraction of gas (e.g., 0.21).
     * @param {number} ata - Total pressure in ATA.
     * @returns {number} Partial pressure.
     */
    calculatePartialPressure: (fraction, ata) => {
        return fraction * ata;
    },

    /**
     * Calculates Depth from Pressure.
     * Inverse of calculateATA.
     */
    calculateDepthFromATA: (ata, isFreshWater = false) => {
        const conversion = isFreshWater ? DiveMath.CONSTANTS.FRESH_WATER_CONVERSION : 1.0;
        return (ata - 1) * 10 / conversion;
    }
};
