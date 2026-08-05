export const BallastCalculator = {
    calculateBallast: (weight, suitType, tankType, bodyType, waterType, warmerType, plateType, vestType) => {
        let baseBallast = weight * 0.10;

        // Body Composition Adjustments
        if (bodyType === 'slim') baseBallast -= 1;
        if (bodyType === 'athletic') baseBallast -= 3; // Muscle is negative (increased exp value).
        if (bodyType === 'overweight') baseBallast += 2; // Fat is positive.

        let suitMod = 0;
        let suitName = "";

        // Base Suits
        switch (suitType) {
            case 'foam3': suitMod = 1; suitName = "Pianka 3mm"; break;
            case 'foam5': suitMod = 3; suitName = "Pianka 5mm"; break;
            case 'foam7': suitMod = 5; suitName = "Pianka 7mm"; break;
            case 'dryTri':
            case 'dryCrash':
            case 'dryNeo':
                suitName = "Suchy Skafander";
                suitMod = 6; // Base for shell
                if (suitType === 'dryNeo') suitMod = 8; // Neo is floaty
                if (suitType === 'dryCrash') suitMod = 3; // Crash is heavy/compressed (less buoyant than foam/tri air?)
                if (warmerType === 'thick') { suitMod += 5; suitName += " (Gruby Ocieplacz)"; }
                else { suitName += " (Cienki Ocieplacz)"; }
                break;
        }

        // Vest Add-on (Docieplenie)
        if (vestType === 'vest') {
            suitMod += 2;
            suitName += " + Docieplenie";
        }

        let waterMod = 0;
        if (waterType === 'salt') { waterMod = 2.5; }

        let tankMod = 0;
        let tankName = "";

        // Tank Logic: empiric adjustments
        const tanks = {
            // Singles
            'alu11': { n: "Alu 11L (S80)", v: 2 },
            'alu7': { n: "Alu 7L", v: 1 },
            'steel7': { n: "Stal 7L (232)", v: -1 },
            'steel10': { n: "Stal 10L (232)", v: -2 },
            'steel12': { n: "Stal 12L (232)", v: -2 },
            'steel15': { n: "Stal 15L (232)", v: -3 },
            'steel10_300': { n: "Stal 10L (300)", v: -3 },
            'steel12_300': { n: "Stal 12L (300)", v: -4.5 },

            // Twins (assuming bands + manifold add ~2.5kg neg effective)
            // Values here represent the buoyancy of the cylinder SET full + manifold relative to neutral
            'twin7_232': { n: "Twin 2x7L (232)", v: -5 },
            'twin7_300': { n: "Twin 2x7L (300)", v: -10 },
            'twin85_232': { n: "Twin 2x8.5L (232)", v: -6 },
            'twin85_300': { n: "Twin 2x8.5L (300)", v: -11 }, // Est.
            'twin10_232': { n: "Twin 2x10L (232)", v: -7 },
            'twin10_300': { n: "Twin 2x10L (300)", v: -13 }, // Est.
            'twin12_232': { n: "Twin 2x12L (232)", v: -10 },
            'twin12_300': { n: "Twin 2x12L (300)", v: -14 }, // Very heavy
            'twin15_232': { n: "Twin 2x15L (232)", v: -12 },
            'twin15_300': { n: "Twin 2x15L (300)", v: -17 }, // Total anchor
        };

        const selTank = tanks[tankType] || { n: "Nieznana butla", v: 0 };
        tankMod = selTank.v;
        tankName = selTank.n;

        // Plate Mod
        if (tankType.includes('twin') || tankType.includes('double')) {
            // Tech Diver Base Reduction: Skilled divers carry less lead
            baseBallast = baseBallast * 0.8;

            if (plateType === 'steel') {
                tankMod -= 2.5; // Backplate is ~2.5kg neg
                tankName += " + Płyta Stal";
            } else if (plateType === 'alu') {
                tankMod -= 0.5;
                tankName += " + Płyta Alu";
            }

            // Heavy Gear heuristics for Twins
            tankMod -= 1.5; // Manifold, heavy regs, bolts
        }

        const totalBallast = Math.max(0, Math.round((baseBallast + suitMod + waterMod + tankMod) * 2) / 2);

        // Range Logic: Equipment variation (Regulators ~1kg, Valve types, etc.)
        const minBallast = Math.max(0, Math.floor(totalBallast - 1));
        const maxBallast = Math.ceil(totalBallast + 1.5);

        return {
            baseBallast,
            suitMod,
            suitName,
            waterMod,
            tankMod,
            tankName,
            totalBallast,
            minBallast,
            maxBallast
        };
    }
};
