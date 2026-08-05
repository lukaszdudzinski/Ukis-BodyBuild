import { DiveMath } from '../core/DiveMath.js';

export const BlendingCalculator = {
    calculateNitroxTopUp: (startBar, startO2, targetBar, targetO2) => {
        const topUpO2 = DiveMath.CONSTANTS.AIR_O2;
        const o2InAirFraction = 1.0 - topUpO2;

        // Calculate required Oxygen addition
        // Target O2 pressure = TargetBar * TargetO2
        // Existing O2 pressure = StartBar * StartO2
        // We add X bar of O2 (1.0 fraction) and Y bar of Air (0.21 O2)
        // System:
        // 1) X + Y = TargetBar - StartBar
        // 2) 1.0*X + 0.21*Y + StartBar*StartO2 = TargetBar*TargetO2
        // Solving for X (Oxygen to add):

        const numerator = (targetBar * (targetO2 - topUpO2)) - (startBar * (startO2 - topUpO2));
        const oxygenToAdd = numerator / o2InAirFraction;

        const pressureAfterO2 = startBar + oxygenToAdd;
        const airTopUp = targetBar - pressureAfterO2;

        return {
            oxygenToAdd,
            pressureAfterO2,
            airTopUp,
            possible: oxygenToAdd >= 0 && pressureAfterO2 <= targetBar
        };
    },

    calculateTrimixBlend: (startBar, targetBar, targetO2, targetHe) => {
        // Logic extracted from script.js
        const heBar = (targetHe / 100) * targetBar;
        const o2Bar = (targetO2 / 100) * targetBar;
        const totalHeO2 = heBar + o2Bar;
        const airBar = targetBar - totalHeO2;
        const n2Percent = 100 - targetO2 - targetHe;

        const pressureAfterHe = startBar + heBar;
        const pressureAfterO2 = pressureAfterHe + o2Bar;

        return {
            heBar,
            o2Bar,
            airBar,
            n2Percent,
            pressureAfterHe,
            pressureAfterO2,
            isValid: (targetO2 + targetHe <= 100) && (targetO2 >= 16) && (targetBar > startBar)
        };
    }
};
