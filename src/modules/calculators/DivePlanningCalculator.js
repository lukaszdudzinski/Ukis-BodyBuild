import { DiveMath } from '../core/DiveMath.js';

export const DivePlanningCalculator = {
    calculateSac: (usedGasLiters, avgPressure, time) => {
        if (time <= 0 || avgPressure <= 0) return 0;
        return usedGasLiters / (avgPressure * time);
    },

    calculateRockBottom: (params) => {
        const { sac, depth, stopDepth, ascentRate, stressFactor, divers, emergencyTime, volume, safetyMargin } = params;
        const P_depth = DiveMath.calculateATA(depth); // Default salt
        const P_stop = DiveMath.calculateATA(stopDepth);
        const P_avg_ascent = (P_depth + P_stop) / 2;

        const T_ascent = (depth - stopDepth) / ascentRate;
        const SAC_stressed = sac * stressFactor;

        const Gas_reaction = SAC_stressed * P_depth * emergencyTime * divers;
        const Gas_ascent = SAC_stressed * P_avg_ascent * T_ascent * divers;

        const TotalGasLiters = Gas_reaction + Gas_ascent;
        const RB_pressure = TotalGasLiters / volume;
        const FinalRB = RB_pressure + safetyMargin;

        return {
            liters: (FinalRB * volume),
            bars: FinalRB,
            roundedBars: Math.ceil(FinalRB),
            details: {
                SAC_stressed, Gas_reaction, Gas_ascent, TotalGasLiters,
                P_depth, P_avg_ascent, T_ascent
            }
        };
    },

    calculateGasConsumption: (params) => {
        const { sac, depth, bottomTime, descentRate, ascentRate, stopDepth, stopTime, tankSize, startPressure } = params;
        const P_surface = 1.0;
        const P_bottom = DiveMath.calculateATA(depth); // Default salt
        const P_stop = DiveMath.calculateATA(stopDepth);

        const P_avg_descent = (P_surface + P_bottom) / 2;
        const P_avg_ascent_to_stop = (P_bottom + P_stop) / 2;
        const P_avg_ascent_to_surface = (P_stop + P_surface) / 2;

        const T_descent = depth / descentRate;
        const T_bottom = bottomTime;
        const T_ascent_to_stop = (depth - stopDepth) / ascentRate;
        const T_stop = stopTime;
        const T_ascent_to_surface = stopDepth / ascentRate;

        const L_descent = sac * P_avg_descent * T_descent;
        const L_bottom = sac * P_bottom * T_bottom;
        const L_ascent_to_stop = sac * P_avg_ascent_to_stop * T_ascent_to_stop;
        const L_stop = sac * P_stop * T_stop;
        const L_ascent_to_surface = sac * P_avg_ascent_to_surface * T_ascent_to_surface;

        const totalDemandLiters = L_descent + L_bottom + L_ascent_to_stop + L_stop + L_ascent_to_surface;
        const totalDemandBars = totalDemandLiters / tankSize;
        const totalSupplyLiters = tankSize * startPressure;
        const totalSupplyBars = startPressure;

        return {
            totalDemandLiters,
            totalDemandBars,
            totalSupplyLiters,
            totalSupplyBars,
            breakdown: {
                T_descent, L_descent, P_avg_descent,
                T_bottom, L_bottom, P_bottom,
                T_ascent_to_stop, L_ascent_to_stop, P_avg_ascent_to_stop,
                T_stop, L_stop, P_stop,
                T_ascent_to_surface, L_ascent_to_surface, P_avg_ascent_to_surface
            }
        };
    }
};
