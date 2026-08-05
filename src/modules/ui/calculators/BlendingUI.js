import { BlendingCalculator } from '../../calculators/BlendingCalculator.js';
import { AppUI } from '../AppUI.js';

export function initBlendingUI() {
    initGasBlenderUI();
    initTrimixUI();
}

function initGasBlenderUI() {
    const blenderForm = document.getElementById('blenderForm');
    const blenderResult = document.getElementById('blenderResult');
    if (blenderForm && blenderResult) {
        blenderForm.addEventListener('submit', function (e) {
            e.preventDefault();
            try {
                const startBar = parseFloat(document.getElementById('blendStartBar').value);
                const startO2 = parseFloat(document.getElementById('blendStartO2').value) / 100;
                const targetBar = parseFloat(document.getElementById('blendTargetBar').value);
                const targetO2 = parseFloat(document.getElementById('blendTargetO2').value) / 100;

                const result = BlendingCalculator.calculateNitroxTopUp(startBar, startO2, targetBar, targetO2);

                if (!result.possible) {
                    if (result.oxygenToAdd < 0) {
                        blenderResult.innerHTML = `<p class="result-error">Nie można uzyskać mieszanki (Zbyt dużo tlenu w butli startowej).</p>`;
                    } else if (result.pressureAfterO2 > targetBar) {
                        blenderResult.innerHTML = `<p class="result-error">Przekroczono ciśnienie docelowe.</p>`;
                    }
                    blenderResult.style.display = 'block';
                    return;
                }

                const explanationHTML = `
                    <div class="formula-box-small">
                        <h5>Mieszanie Parcjalne</h5>
                        <p>Obliczamy ile czystego tlenu (100%) dodać, aby resztę dobić powietrzem (21%).</p>
                        <ul>
                            <li>Cel: ${targetBar} bar o stężeniu ${(targetO2 * 100).toFixed(0)}%</li>
                            <li>Krok 1 (Tlen): <strong>+${result.oxygenToAdd.toFixed(1)} bar</strong></li>
                            <li>Krok 2 (Powietrze): +${result.airTopUp.toFixed(1)} bar</li>
                        </ul>
                    </div>
                `;

                blenderResult.innerHTML = `
                    <div class="result-info-icon tooltip-trigger" data-tooltip-type="calculation" data-pro-feature="true">i</div>
                    <div class="calculation-details" style="display: none;">${explanationHTML}</div>
                    <div class="result-section">
                        <p class="result-label">Krok 1: Dodaj 100% Tlenu</p>
                        <p class="result-value-main" style="color: #00d1b2 !important;">+${result.oxygenToAdd.toFixed(1)}<span class="unit">bar</span></p>
                        <p class="result-value-sub">Ciśnienie pośrednie: ${result.pressureAfterO2.toFixed(1)} bar</p>
                    </div>
                    <div class="result-section">
                        <p class="result-label">Krok 2: Dopełnij Powietrzem</p>
                        <p class="result-value-main" style="color: #fff !important;">+${result.airTopUp.toFixed(1)}<span class="unit">bar</span></p>
                        <p class="result-value-sub">Do ciśnienia: ${targetBar} bar</p>
                    </div>`;
                blenderResult.style.display = 'block';
                blenderResult.style.display = 'block';
                if (AppUI && AppUI.scrollToResult) AppUI.scrollToResult(blenderResult);
            } catch (error) { console.error(error); }
        });
    }
}

function initTrimixUI() {
    const trimixForm = document.getElementById('trimixForm');
    const trimixResult = document.getElementById('trimixResult');
    if (trimixForm && trimixResult) {
        trimixForm.addEventListener('submit', function (e) {
            e.preventDefault();
            try {
                const targetO2 = parseFloat(document.getElementById('trimixTargetO2').value);
                const targetHe = parseFloat(document.getElementById('trimixTargetHe').value);
                const tankSize = parseFloat(document.getElementById('trimixTankSize').value);
                const startBar = parseFloat(document.getElementById('trimixStartBar').value);
                const targetBar = parseFloat(document.getElementById('trimixTargetBar').value);

                // Validation in Logic
                if (targetO2 + targetHe > 100) {
                    trimixResult.innerHTML = `<p class="result-error">Błąd: Suma O2 i He nie może przekraczać 100%!</p>`;
                    trimixResult.style.display = 'block';
                    return;
                }

                const result = BlendingCalculator.calculateTrimixBlend(startBar, targetBar, targetO2, targetHe);

                if (!result.isValid) {
                    // Check specific errors
                    if (targetO2 < 16) {
                        trimixResult.innerHTML = `<p class="result-error">Błąd: Zawartość tlenu musi być ≥ 16% (minimalna frakcja do oddychania).</p>`;
                    } else if (targetBar <= startBar) {
                        trimixResult.innerHTML = `<p class="result-error">Błąd: Ciśnienie docelowe musi być wyższe niż początkowe.</p>`;
                    }
                    trimixResult.style.display = 'block';
                    return;
                }

                // Tooltip with formulas
                const explanationHTML = `
                    <div class="formula-box-small">
                        <h5>Partial Pressure Blending (Trimix)</h5>
                        <p>Obliczenia ciśnień parcjalnych dla mieszanki ${targetO2}/${targetHe}:</p>
                        <ul>
                            <li>P<sub>He</sub> = (${targetHe}% × ${targetBar} bar) / 100 = <strong>${result.heBar.toFixed(1)} bar</strong></li>
                            <li>P<sub>O2</sub> = (${targetO2}% × ${targetBar} bar) / 100 = <strong>${result.o2Bar.toFixed(1)} bar</strong></li>
                            <li>P<sub>Air</sub> = ${targetBar} - ${result.heBar.toFixed(1)} - ${result.o2Bar.toFixed(1)} = <strong>${result.airBar.toFixed(1)} bar</strong></li>
                            <li>N<sub>2</sub> = 100% - ${targetO2}% - ${targetHe}% = <strong>${result.n2Percent.toFixed(1)}%</strong></li>
                        </ul>
                    </div>
                `;

                trimixResult.innerHTML = `
                    <div class="result-info-icon tooltip-trigger" data-tooltip-type="calculation" data-pro-feature="true">i</div>
                    <div class="calculation-details" style="display: none;">${explanationHTML}</div>
                    <div class="result-section">
                        <p class="result-label">Krok 1: Dodaj 100% Hel (He)</p>
                        <p class="result-value-main" style="color: #e0e0e0 !important;">+${result.heBar.toFixed(1)}<span class="unit">bar</span></p>
                        <p class="result-value-sub">Ciśnienie pośrednie: ${result.pressureAfterHe.toFixed(1)} bar</p>
                    </div>
                    <div class="result-section">
                        <p class="result-label">Krok 2: Dodaj 100% Tlen (O2)</p>
                        <p class="result-value-main" style="color: #00d1b2 !important;">+${result.o2Bar.toFixed(1)}<span class="unit">bar</span></p>
                        <p class="result-value-sub">Ciśnienie pośrednie: ${result.pressureAfterO2.toFixed(1)} bar</p>
                    </div>
                    <div class="result-section">
                        <p class="result-label">Krok 3: Dopełnij Powietrzem (21% O2)</p>
                        <p class="result-value-main" style="color: #fff !important;">+${result.airBar.toFixed(1)}<span class="unit">bar</span></p>
                        <p class="result-value-sub">Do ciśnienia: ${targetBar} bar</p>
                    </div>
                    <div class="result-section" style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 10px; margin-top: 10px;">
                        <p class="result-label">Końcowa Mieszanka</p>
                        <p class="result-value-main" style="font-size: 1.8em;">Trimix ${targetO2.toFixed(0)}/${targetHe.toFixed(0)}</p>
                        <p class="result-value-sub">O<sub>2</sub>: ${targetO2}% | He: ${targetHe}% | N<sub>2</sub>: ${result.n2Percent.toFixed(1)}%</p>
                    </div>`;
                trimixResult.style.display = 'block';
                if (AppUI && AppUI.scrollToResult) AppUI.scrollToResult(trimixResult);
            } catch (error) { console.error(error); }
        });
    }
}
