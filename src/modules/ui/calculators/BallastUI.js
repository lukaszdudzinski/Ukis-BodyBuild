import { BallastCalculator } from '../../calculators/BallastCalculator.js';
import { AppUI } from '../AppUI.js';

export function initBallastUI() {
    const form = document.getElementById('ballastForm');
    const weightInput = document.getElementById('ballastWeight');
    const bodyTypeSelect = document.getElementById('ballastBodyType');
    const suitSelect = document.getElementById('ballastSuit');
    const vestSelect = document.getElementById('ballastVest');
    const warmerSelect = document.getElementById('ballastWarmer');
    const tankSelect = document.getElementById('ballastTank');
    const plateSelect = document.getElementById('ballastPlate');
    const waterSelect = document.getElementById('ballastWater');
    const resultContainer = document.getElementById('ballastResult');

    const warmerGroup = document.getElementById('ballast-warmer-group');
    const plateGroup = document.getElementById('ballast-plate-group');

    if (!form) return;

    // Dynamic Field Visibility
    function updateVisibility() {
        const suit = suitSelect.value;
        const tank = tankSelect.value;

        // Warmer only for dry suits
        if (suit.startsWith('dry')) {
            warmerGroup.style.display = 'flex';
        } else {
            warmerGroup.style.display = 'none';
        }

        // Plate usually for twinsets or wing config (implied by twin)
        // For simplicity, let's show for twins
        if (tank.startsWith('twin')) {
            plateGroup.style.display = 'flex';
        } else {
            plateGroup.style.display = 'none';
        }
    }

    suitSelect.addEventListener('change', updateVisibility);
    tankSelect.addEventListener('change', updateVisibility);
    updateVisibility(); // Init

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
            const weight = parseFloat(weightInput.value);
            const suit = suitSelect.value;
            const tank = tankSelect.value;
            const body = bodyTypeSelect.value;
            const water = waterSelect.value;
            const warmer = warmerSelect.value;
            const plate = plateSelect.value;
            const vest = vestSelect.value;

            // Call Calculator with correct positional arguments
            // calculateBallast: (weight, suitType, tankType, bodyType, waterType, warmerType, plateType, vestType)
            const result = BallastCalculator.calculateBallast(
                weight, suit, tank, body, water, warmer, plate, vest
            );

            resultContainer.innerHTML = `
                <div class="result-info-icon tooltip-trigger" data-tooltip-type="calculation" data-pro-feature="false">i</div>
                <div class="calculation-details" style="display: none;">
                    <div class="formula-box-small">
                        <p>Baza (Ciało): ${result.baseBallast.toFixed(1)} kg</p>
                        <p>Skafander: ${result.suitMod.toFixed(1)} kg</p>
                        <p>Sprzęt (Butla/Płyta): ${result.tankMod.toFixed(1)} kg</p>
                        <p>Woda: ${result.waterMod.toFixed(1)} kg</p>
                    </div>
                </div>
                <div class="result-container-header"><h4>Sugerowany Balast</h4></div>
                <div class="result-section">
                    <p class="result-label">Całkowita waga ołowiu:</p>
                    <p class="result-value-main">${result.totalBallast.toFixed(1)} <span class="unit">kg</span></p>
                </div>
                <div class="result-section" style="margin-top: 15px;">
                    <p class="result-label" style="font-size: 0.9em; color: #b0b0b0;">Sugerowany balast do zabrania:</p>
                    <p class="result-value-sub" style="font-size: 1.1em; color: #e0e0e0; margin-top: 5px;">
                        ~ ${result.minBallast} - ${result.maxBallast} kg
                    </p>
                </div>
                <div class="result-section" style="margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                    <p style="font-size: 0.9em; color: #ffd700;">⚠️ Wynik orientacyjny. Wykonaj wyważenie w wodzie!</p>
                </div>
            `;
            resultContainer.style.display = 'block';

            // Use global scroller
            if (AppUI && AppUI.scrollToResult) {
                AppUI.scrollToResult(resultContainer);
            }
        } catch (error) { console.error(error); }
    });
}


