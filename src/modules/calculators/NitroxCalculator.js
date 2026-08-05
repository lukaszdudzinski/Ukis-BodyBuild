import { DiveMath } from '../core/DiveMath.js';

export const NitroxCalculator = {
    calculateMod: (fo2, limitPo2) => {
        if (fo2 <= 0) return 0;
        return ((limitPo2 / fo2) - 1) * 10;
    },

    calculateEad: (depth, fo2) => {
        const fn2 = 1.0 - fo2;
        return ((depth + 10) * (fn2 / 0.79)) - 10;
    },

    calculateBestMix: (depth, limitPo2, isFreshWater = false) => {
        const ata = DiveMath.calculateATA(depth, isFreshWater);
        const fo2 = (limitPo2 / ata);
        return Math.floor(fo2 * 100);
    },

    calculateCns: (depth, fo2, time, isFreshWater = false) => {
        const ata = DiveMath.calculateATA(depth, isFreshWater);
        const ppo2 = DiveMath.calculatePartialPressure(fo2, ata);

        // Simplified NOAA Table Logic
        const cnsRates = {
            0.6: 0.12, 0.7: 0.17, 0.8: 0.22, 0.9: 0.28,
            1.0: 0.33, 1.1: 0.40, 1.2: 0.48, 1.3: 0.56,
            1.4: 0.67, 1.5: 0.83, 1.6: 1.11
        };

        let rateKey = (Math.floor(ppo2 * 10) / 10).toFixed(1);
        let cnsPerMin = (rateKey < 0.6) ? 0.0 : (rateKey > 1.6 ? 1.11 : cnsRates[rateKey]);

        const totalCns = cnsPerMin * time;

        return {
            ppo2: ppo2,
            cnsPerMin: cnsPerMin,
            totalCns: totalCns
        };
    },

    checkSafety: (depth, fo2, isFreshWater = false) => {
        const ata = DiveMath.calculateATA(depth, isFreshWater);
        const ppo2 = fo2 * ata;

        let status = 'SAFE';
        if (ppo2 > 1.6) status = 'TOXIC';
        else if (ppo2 > 1.4) status = 'WARNING';

        let maxSafeDepth = 0;
        let safeEAD = 0;

        if (status !== 'SAFE') {
            // Calculate max depth for PPO2 1.4 (Safety Limit)
            // ATA = PPO2 / FO2
            // Depth = (ATA - 1) * 10
            const safeLegacyATA = 1.4 / fo2;
            const pressureDrop = isFreshWater ? (10 / 10.3) : 1.0;
            maxSafeDepth = Math.floor(((safeLegacyATA - 1) * 10) / pressureDrop);

            // Calculate EAD for this safe depth
            const fn2 = 1.0 - fo2;
            safeEAD = ((maxSafeDepth + 10) * (fn2 / 0.79)) - 10;
        }

        return {
            status,
            currentPpO2: ppo2,
            maxSafeDepth,
            safeEAD
        };
    }
};
