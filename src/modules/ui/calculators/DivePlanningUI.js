import { DivePlanningCalculator } from '../../calculators/DivePlanningCalculator.js';
import { AppUI } from '../AppUI.js';
import { getTankVolume } from '../../data/TankData.js';

export function initDivePlanningUI() {
    try { initSacUI(); } catch (e) { console.error("SAC UI Init Error", e); }
    try { initGasConsumptionUI(); } catch (e) { console.error("Gas Consumption UI Init Error", e); }
    try { initRockBottomUI(); } catch (e) { console.error("Rock Bottom UI Init Error", e); }
    try { initBailoutUI(); } catch (e) { console.error("Bailout UI Init Error", e); }
    try { initProGasUI(); } catch (e) { console.error("Pro Gas UI Init Error", e); }
    try { autoLoadSavedSac(); } catch (e) { console.log("Auto Load SAC Error", e); }
}

function initSacUI() {
    const sacForm = document.getElementById('sacForm');
    const resultDiv = document.getElementById('sacResult');
    if (sacForm && resultDiv) {
        // Remove existing listener to prevent duplicates if init called twice (though clonning is safer)
        const newForm = sacForm.cloneNode(true);
        sacForm.parentNode.replaceChild(newForm, sacForm);

        newForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log("SAC Form Submitted");
            try {
                const p1 = parseFloat(document.getElementById('p1').value);
                const p2 = parseFloat(document.getElementById('p2').value);

                // Fix for Select Element returning ID string (e.g. "steel12") instead of volume number
                const vbId = document.getElementById('vb').value;
                const vb = getTankVolume(vbId);

                const time = parseFloat(document.getElementById('time').value);
                const depth = parseFloat(document.getElementById('depth').value); // ID mismatch fix: HTML has 'depth', not 'avgDepth' in some versions?
                // Checking HTML (Step 18, L329): id="depth". 
                // Previous code (Step 13, L21): id="avgDepth". BUG FOUND!
                // Fixed ID to 'depth'.

                const waterTypeElement = document.getElementById('waterType');
                const isFreshWater = waterTypeElement ? waterTypeElement.value === 'fresh' : false;
                const pressureConversion = isFreshWater ? (10 / 10.3) : 1.0;

                const avgPressure = (depth / 10 * pressureConversion) + 1;
                const consumedGas = (p1 - p2) * vb;
                const sac = DivePlanningCalculator.calculateSac(consumedGas, avgPressure, time);

                // Save SAC Logic (Button)
                window.saveCalculatedSac = function () {
                    try {
                        localStorage.setItem('uki-user-sac', sac.toFixed(1));

                        // Update inputs immediately
                        const gcSAC = document.getElementById('gcSAC');
                        if (gcSAC) gcSAC.value = sac.toFixed(1);
                        const proSAC = document.getElementById('proSAC');
                        if (proSAC) proSAC.value = sac.toFixed(1);
                        const rbSAC = document.getElementById('rbSAC');
                        if (rbSAC) rbSAC.value = sac.toFixed(1);

                        // Update Settings Display
                        const settingsDisplay = document.getElementById('settings-sac-value');
                        if (settingsDisplay) settingsDisplay.textContent = sac.toFixed(1) + ' l/min';

                        // alert(`Zapisano SAC: ${sac.toFixed(1)} l/min`); // Suppressed per user request
                    } catch (e) { console.warn("SAC Save Failed", e); }
                };

                const explanationHTML = `
                    <div class="formula-box-small">
                        <h5>Obliczenia SAC</h5>
                        <p class="formula">SAC = (Zużyte Litry) / (Śr. Ciśnienie * Czas)</p>
                        <ul>
                            <li>Zużyty gaz: (${p1} - ${p2}) bar * ${vb} l = <strong>${consumedGas.toFixed(0)} litrów</strong></li>
                            <li>Śr. ciśnienie (ATA): (${depth}m / 10) + 1 = <strong>${avgPressure.toFixed(2)} ATA</strong></li>
                            <li>SAC: ${consumedGas.toFixed(0)} / (${avgPressure.toFixed(2)} * ${time}) = <strong>${sac.toFixed(1)} l/min</strong></li>
                        </ul>
                        <div style="margin-top: 10px; border-top: 1px solid #eee; padding-top: 5px;">
                            <strong>Interpretacja:</strong><br>
                            Twój SAC to ${sac.toFixed(1)} l/min. Oznacza to, że na powierzchni zużywasz tyle gazu w minutę. 
                            Użyj tej wartości w planowaniu gazu (Rock Bottom, Gas Consumption) dla przyszłych nurkowań.
                        </div>
                    </div>
                `;

                resultDiv.innerHTML = `
                    <div class="result-info-icon tooltip-trigger" data-tooltip-type="calculation" data-pro-feature="false">i</div>
                    <div class="calculation-details" style="display: none;">${explanationHTML}</div>
                    <div class="result-section">
                        <p class="result-label">Twój wskaźnik SAC</p>
                        <p class="result-value-main">${sac.toFixed(1)}<span class="unit">l/min</span></p>
                    </div>
                    <div style="text-align: center; margin-top: 10px;">
                        <button type="button" onclick="saveCalculatedSac()" class="action-button">Zapisz wynik</button>
                    </div>
                     <p class="result-disclaimer" style="text-align: center; color: #bbb; font-size: 0.8em; margin-top: 5px;">
                        Obliczony SAC: ${sac.toFixed(1)} l/min
                    </p>`;
                resultDiv.style.display = 'block';
                resultDiv.style.display = 'block';
                if (AppUI && AppUI.scrollToResult) AppUI.scrollToResult(resultDiv);
            } catch (error) { console.error(error); }
        });
    }
}

function initGasConsumptionUI() {
    const gcForm = document.getElementById('gasConsumptionForm');
    const gcResultContainer = document.getElementById('gcResult');
    if (gcForm && gcResultContainer) {
        const newForm = gcForm.cloneNode(true);
        gcForm.parentNode.replaceChild(newForm, gcForm);

        newForm.addEventListener('submit', function (e) {
            e.preventDefault();
            try {
                const sac = parseFloat(document.getElementById('gcSAC').value);
                const depth = parseFloat(document.getElementById('gcDepth').value);
                const bottomTime = parseFloat(document.getElementById('gcBottomTime').value);

                // Tank Size via getTankVolume
                const tankId = document.getElementById('gcTankSize').value;
                const tankSize = getTankVolume(tankId);

                const reservePressure = parseFloat(document.getElementById('gcReserve').value);

                // Extra params from form or defaults
                const descentRate = parseFloat(document.getElementById('gcDescentRate').value) || 20;
                const ascentRate = parseFloat(document.getElementById('gcAscentRate').value) || 10;
                const stopDepth = parseFloat(document.getElementById('gcStopDepth').value) || 5;
                const stopTime = parseFloat(document.getElementById('gcStopTime').value) || 3;
                const startPressure = parseFloat(document.getElementById('gcStartPressure').value) || 200;

                const consumptionParams = {
                    sac, depth, bottomTime,
                    descentRate, ascentRate,
                    stopDepth, stopTime,
                    tankSize, startPressure
                };

                const consumptionResult = DivePlanningCalculator.calculateGasConsumption(consumptionParams);
                const requiredReserveLiters = tankSize * reservePressure;

                // --- Educational Breakdown Calculation ---
                const pSurf = 1.0;
                const pDepth = (depth / 10) + 1.0;
                const pStop = (stopDepth / 10) + 1.0;

                // 1. Descent
                const descentTime = depth / descentRate;
                const avgP_descent = (pSurf + pDepth) / 2;
                const cons_descent = sac * avgP_descent * descentTime;

                // 2. Bottom
                const avgP_bottom = pDepth;
                const cons_bottom = sac * avgP_bottom * bottomTime;

                // 3. Ascent to Stop
                const distToStop = depth - stopDepth;
                const ascentTime1 = distToStop / ascentRate;
                const avgP_ascent1 = (pDepth + pStop) / 2;
                const cons_ascent1 = sac * avgP_ascent1 * ascentTime1;

                // 4. Stop
                const avgP_stop = pStop;
                const cons_stop = sac * avgP_stop * stopTime;

                // 5. Ascent to Surface
                const ascentTime2 = stopDepth / ascentRate;
                const avgP_ascent2 = (pStop + pSurf) / 2;
                const cons_ascent2 = sac * avgP_ascent2 * ascentTime2;

                const totalConsCheck = cons_descent + cons_bottom + cons_ascent1 + cons_stop + cons_ascent2;

                const explanationHTML = `
                    <div class="formula-box-small">
                        <h5>Szczegóły Zużycia Gazu</h5>
                        <p style="font-size:0.9em; margin-bottom:5px;">SAC: ${sac} l/min (Woda: słodka/słona ~1.0 ATA)</p>
                        <ul style="font-size: 0.85em;">
                            <li><strong>Zanurzenie:</strong> ${depth}m / ${descentRate}m/min = ${descentTime.toFixed(1)} min<br>
                                Gaz: ${sac} * ${(avgP_descent).toFixed(2)} ATA * ${descentTime.toFixed(1)} = <strong>${cons_descent.toFixed(0)} l</strong></li>
                            
                            <li><strong>Pobyt na dnie:</strong> ${bottomTime} min @ ${depth}m<br>
                                Gaz: ${sac} * ${avgP_bottom.toFixed(2)} ATA * ${bottomTime} = <strong>${cons_bottom.toFixed(0)} l</strong></li>
                            
                            <li><strong>Wynurzanie (do ${stopDepth}m):</strong> ${(distToStop).toFixed(1)}m<br>
                                Gaz: ${sac} * ${avgP_ascent1.toFixed(2)} ATA * ${ascentTime1.toFixed(1)} = <strong>${cons_ascent1.toFixed(0)} l</strong></li>
                            
                            <li><strong>Przystanek:</strong> ${stopTime} min @ ${stopDepth}m<br>
                                Gaz: ${sac} * ${avgP_stop.toFixed(2)} ATA * ${stopTime} = <strong>${cons_stop.toFixed(0)} l</strong></li>

                            <li><strong>Ostatnie metry:</strong> ${stopDepth}m do 0m<br>
                                Gaz: ${sac} * ${avgP_ascent2.toFixed(2)} ATA * ${ascentTime2.toFixed(1)} = <strong>${cons_ascent2.toFixed(0)} l</strong></li>
                        </ul>
                        <div style="margin-top: 5px; border-top: 1px solid #444; padding-top: 5px;">
                            <strong>Suma Wyliczona: ~${totalConsCheck.toFixed(0)} l</strong><br>
                            <span style="font-size:0.8em; color:#bbb;">(Może się różnić minimalnie od algorytmu głównego przez zaokrąglenia etapów)</span>
                        </div>
                    </div>
                `;

                renderConsumptionResult(gcResultContainer, consumptionResult, { requiredReserveLiters }, tankSize, explanationHTML);
                if (AppUI && AppUI.scrollToResult) AppUI.scrollToResult(gcResultContainer);

            } catch (error) { console.error(error); }
        });
    }
}

function initRockBottomUI() {
    const rbForm = document.getElementById('rbForm');
    const rbResultContainer = document.getElementById('rbResult');
    if (rbForm && rbResultContainer) {
        const newForm = rbForm.cloneNode(true);
        rbForm.parentNode.replaceChild(newForm, rbForm);

        newForm.addEventListener('submit', function (e) {
            e.preventDefault();
            try {
                const sac = parseFloat(document.getElementById('rbSAC').value);
                const depth = parseFloat(document.getElementById('rbDepth').value);

                const tankId = document.getElementById('rbVolume').value;
                const tankSize = getTankVolume(tankId);

                // IDs check
                // L433: rbSAC, L436: rbDepth, L438: rbVolume
                // L440: rbStopDepth, L442: rbAscentRate, L446: rbStressFactor
                // L448: rbDivers, L450: rbEmergencyTime, L452: rbSafetyMargin

                const stopDepth = parseFloat(document.getElementById('rbStopDepth').value);
                const ascentRate = parseFloat(document.getElementById('rbAscentRate').value);
                const stressFactor = parseFloat(document.getElementById('rbStressFactor').value);
                const divers = parseFloat(document.getElementById('rbDivers').value);
                const emergencyTime = parseFloat(document.getElementById('rbEmergencyTime').value);
                const safetyMargin = parseFloat(document.getElementById('rbSafetyMargin').value);

                const params = {
                    sac, depth, stopDepth, ascentRate,
                    stressFactor, divers, emergencyTime,
                    volume: tankSize,
                    safetyMargin
                };

                const d = DivePlanningCalculator.calculateRockBottom(params);

                const explanationHTML = `
                    <div class="formula-box-small">
                        <h5>Obliczenia Rock Bottom</h5>
                        <p style="font-size: 0.9em; margin-bottom: 5px;">Dla ${divers} nurków, przy SAC Stres = ${d.details.SAC_stressed.toFixed(1)} l/min.</p>
                        <ul>
                            <li><strong>Reakcja:</strong> ${d.details.Gas_reaction.toFixed(0)} l (czas na rozwiązanie problemu na dnie)</li>
                            <li><strong>Wynurzenie:</strong> ${d.details.Gas_ascent.toFixed(0)} l (bezpieczny powrót na powierzchnię)</li>
                            <li><strong>Suma Gazów:</strong> ${d.details.TotalGasLiters.toFixed(0)} l</li>
                        </ul>
                        <div style="margin-top: 10px; border-top: 1px solid #eee; padding-top: 5px; color: #ff3860;">
                            <strong>Co to znaczy?</strong><br>
                            Musisz mieć <strong>${d.roundedBars} bar</strong> żelaznej rezerwy. 
                            Jeśli Twój manometr pokaże tę wartość, <strong>NATYCHMIAST</strong> rozpocznij wynurzanie. 
                            To ilość gazu potrzebna na bezpieczny powrót z partnerem w sytuacji awaryjnej.
                        </div>
                    </div>`;

                rbResultContainer.innerHTML = `
                    <div class="result-info-icon tooltip-trigger" data-tooltip-type="calculation" data-pro-feature="false">i</div>
                    <div class="calculation-details" style="display: none;">${explanationHTML}</div>
                    <div class="result-section">
                        <p class="result-label">Rock Bottom (Min. Rezerwa)</p>
                        <p class="result-value-main" style="color: #ff3860 !important;">${d.roundedBars}<span class="unit">bar</span></p>
                    </div>
                    <p class="result-disclaimer" style="text-align: center; color: #ff3860; font-size: 0.8em; margin-top: 5px;">Żelazne minimum do rozpoczęcia wynurzania!</p>`;
                rbResultContainer.style.display = 'block';
                rbResultContainer.style.display = 'block';
                if (AppUI && AppUI.scrollToResult) AppUI.scrollToResult(rbResultContainer);

            } catch (error) { console.error(error); }
        });
    }
}

function initBailoutUI() {
    const bailoutForm = document.getElementById('bailoutForm');
    const bailoutResult = document.getElementById('bailoutResult');
    if (bailoutForm && bailoutResult) {
        const newForm = bailoutForm.cloneNode(true);
        bailoutForm.parentNode.replaceChild(newForm, bailoutForm);

        newForm.addEventListener('submit', function (e) {
            e.preventDefault();
            try {
                const sac = parseFloat(document.getElementById('bailoutSac').value);
                const depth = parseFloat(document.getElementById('bailoutDepth').value);
                const targetDepth = parseFloat(document.getElementById('bailoutTargetDepth').value);
                const reactionTime = parseFloat(document.getElementById('bailoutTime').value);
                const ascentRate = parseFloat(document.getElementById('bailoutAscentRate').value);

                const tankId = document.getElementById('bailoutTank').value;
                const tankSize = getTankVolume(tankId);

                const pressureAtDepth = (depth / 10) + 1;
                const gasReaction = sac * pressureAtDepth * reactionTime;

                const travelDist = Math.abs(depth - targetDepth); // Ensure positive
                const travelTime = travelDist / ascentRate;

                const pressureAtTarget = (targetDepth / 10) + 1;
                const avgPressure = (pressureAtDepth + pressureAtTarget) / 2;
                const gasAscent = sac * avgPressure * travelTime;

                const totalLitres = gasReaction + gasAscent;
                const requiredBar = totalLitres / tankSize;

                const explanationHTML = `
                    <div class="formula-box-small">
                        <h5>Kalkulacja Bailout</h5>
                        <ul>
                            <li><strong>Reakcja:</strong> ${sac} l/min * ${pressureAtDepth} ATA * ${reactionTime} min = <strong>${gasReaction.toFixed(0)} l</strong></li>
                            <li><strong>Wynurzenie:</strong> ${sac} l/min * ${avgPressure.toFixed(1)} ATA * ${travelTime.toFixed(1)} min = <strong>${gasAscent.toFixed(0)} l</strong></li>
                            <li><strong>Suma:</strong> ${totalLitres.toFixed(0)} l</li>
                        </ul>
                    </div>
                `;

                bailoutResult.innerHTML = `
                    <div class="result-info-icon tooltip-trigger" data-tooltip-type="calculation" data-pro-feature="true">i</div>
                    <div class="calculation-details" style="display: none;">${explanationHTML}</div>
                    <div class="result-section">
                        <p class="result-label">Wymagany Gaz (Minimum)</p>
                        <p class="result-value-main">${totalLitres.toFixed(0)}<span class="unit">litrów</span></p>
                    </div>
                    <div class="result-section">
                        <p class="result-label">Dla butli ${tankSize}l:</p>
                        <p class="result-value-main" style="color: #ff3860 !important;">${Math.ceil(requiredBar)}<span class="unit">bar</span></p>
                    </div>`;
                bailoutResult.style.display = 'block';
                bailoutResult.style.display = 'block';
                if (AppUI && AppUI.scrollToResult) AppUI.scrollToResult(bailoutResult);

            } catch (error) { console.error(error); }
        });
    }
}

function initProGasUI() {
    console.log("Initializing ProGas UI...");
    const proForm = document.getElementById('proGasForm');
    const proResult = document.getElementById('proGasResult');

    if (proForm && proResult) {
        // Clone to ensure clean event listeners
        const newForm = proForm.cloneNode(true);
        proForm.parentNode.replaceChild(newForm, proForm);

        newForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log("ProGas Form Submitted");
            try {
                // Helper to safely get float value
                const getVal = (id) => {
                    const el = document.getElementById(id);
                    if (!el) {
                        console.error(`Missing element: ${id}`);
                        throw new Error(`Brak pola: ${id}`);
                    }
                    const val = parseFloat(el.value);
                    if (isNaN(val)) {
                        console.error(`Invalid value for: ${id}`);
                        throw new Error(`Nieprawidłowa wartość w polu: ${id}`);
                    }
                    return val;
                };

                // Collect Inputs
                const sac = getVal('gcSAC_pro');
                const depth = getVal('gcDepth_pro');
                const bottomTime = getVal('gcBottomTime_pro');
                const descentRate = getVal('gcDescentRate_pro');
                const ascentRate = getVal('gcAscentRate_pro');
                const stopDepth = getVal('gcStopDepth_pro');
                const stopTime = getVal('gcStopTime_pro');

                const tankId = document.getElementById('gcTankSize_pro').value;
                const tankSize = getTankVolume(tankId);

                const startPressure = getVal('gcStartPressure_pro');

                // RB Stuff
                const stressFactor = getVal('rbStressFactor_pro');
                const divers = getVal('rbDivers_pro');
                const emergencyTime = getVal('rbEmergencyTime_pro');
                const safetyMargin = getVal('rbSafetyMargin_pro');

                console.log("ProGas Inputs Collected", { sac, depth, bottomTime });

                // 1. Calculate Consumption
                const consParams = {
                    sac, depth, bottomTime, descentRate, ascentRate, stopDepth, stopTime, tankSize, startPressure
                };
                const consResult = DivePlanningCalculator.calculateGasConsumption(consParams);
                console.log("Consumption Calculated", consResult);

                // 2. Calculate RB
                const rbParams = {
                    sac, depth, stopDepth, ascentRate, stressFactor, divers, emergencyTime, volume: tankSize, safetyMargin
                };
                const rbResult = DivePlanningCalculator.calculateRockBottom(rbParams);
                console.log("RB Calculated", rbResult);

                // --- Educational Breakdown (Combined) ---
                const pSurf = 1.0;
                const pDepth = (depth / 10) + 1.0;
                const pStop = (stopDepth / 10) + 1.0;

                // Consumption Breakdown
                const descentTime = depth / descentRate;
                const avgP_descent = (pSurf + pDepth) / 2;
                const cons_descent = sac * avgP_descent * descentTime;

                const avgP_bottom = pDepth;
                const cons_bottom = sac * avgP_bottom * bottomTime;

                const distToStop = depth - stopDepth;
                const ascentTime1 = distToStop / ascentRate;
                const avgP_ascent1 = (pDepth + pStop) / 2;
                const cons_ascent1 = sac * avgP_ascent1 * ascentTime1;

                const avgP_stop = pStop;
                const cons_stop = sac * avgP_stop * stopTime;

                const ascentTime2 = stopDepth / ascentRate;
                const avgP_ascent2 = (pStop + pSurf) / 2;
                const cons_ascent2 = sac * avgP_ascent2 * ascentTime2;

                const totalConsCheck = cons_descent + cons_bottom + cons_ascent1 + cons_stop + cons_ascent2;

                // RB Breakdown
                const rb_details = rbResult.details;

                const explanationHTML = `
                    <div class="formula-box-small">
                        <h5>Raport Planowania (PRO)</h5>
                        <h6>1. Zużycie Gazu (Plan)</h6>
                        <ul style="font-size: 0.85em;">
                            <li><strong>Zanurzenie:</strong> ${cons_descent.toFixed(0)} l</li>
                            <li><strong>Dno:</strong> ${cons_bottom.toFixed(0)} l</li>
                            <li><strong>Wynurzenie + Stop:</strong> ${(cons_ascent1 + cons_stop + cons_ascent2).toFixed(0)} l</li>
                            <li><strong>Suma Planu:</strong> ~${totalConsCheck.toFixed(0)} l</li>
                        </ul>
                        
                        <h6 style="margin-top:10px;">2. Rock Bottom (Rezerwa)</h6>
                        <p style="font-size: 0.8em; margin-bottom: 2px;">Dla ${divers} nurków, SAC Stres = ${rb_details.SAC_stressed.toFixed(1)} l/min</p>
                        <ul style="font-size: 0.85em;">
                            <li><strong>Reakcja (${emergencyTime} min):</strong> ${rb_details.Gas_reaction.toFixed(0)} l</li>
                            <li><strong>Powrót (${rb_details.T_ascent.toFixed(1)} min):</strong> ${rb_details.Gas_ascent.toFixed(0)} l</li>
                            <li><strong>Całkowity RB:</strong> ${rb_details.TotalGasLiters.toFixed(0)} l (${rbResult.roundedBars} bar)</li>
                        </ul>
                        <div style="margin-top: 5px; border-top: 1px solid #444; padding-top: 5px; color: #00d1b2;">
                            <strong>Całkowite wymagane minimum:</strong> ${(totalConsCheck + rb_details.TotalGasLiters).toFixed(0)} l
                        </div>
                    </div>
                `;

                // 3. Render Combined
                const requiredReserveLiters = rbResult.liters; // RB is the reserve!

                renderConsumptionResult(proResult, consResult, { requiredReserveLiters }, tankSize, explanationHTML);

                // Append RB Specifics
                const rbLabel = document.createElement('div');
                rbLabel.className = 'result-section';
                rbLabel.innerHTML = `<p class="result-label">Wymagany Rock Bottom:</p><p class="result-value-main" style="color: #ff3860;">${rbResult.roundedBars}<span class="unit">bar</span></p>`;
                proResult.appendChild(rbLabel);

                // Explicitly scroll to result
                console.log("Scrolling to result...");
                console.log("Scrolling to result...");
                if (AppUI && AppUI.scrollToResult) AppUI.scrollToResult(proResult);

            } catch (error) {
                console.error("ProGas Calculation Error:", error);
                proResult.innerHTML = `<div class="result-error" style="color: #ff3860; padding: 10px; border: 1px solid #ff3860;">Błąd obliczeń: ${error.message}</div>`;
                proResult.style.display = 'block';
            }
        });
    } else {
        console.warn("ProGas UI elements not found (probably not loaded in DOM yet).");
    }
}

function renderConsumptionResult(container, consumptionData, reserveData, tankSize, explanationHTML = '') {
    const { totalDemandLiters, totalDemandBars, totalSupplyLiters, totalSupplyBars } = consumptionData;
    const { requiredReserveLiters } = reserveData;
    const remainingLiters = totalSupplyLiters - totalDemandLiters;
    const remainingBars = remainingLiters / tankSize;
    const isSafe = (remainingLiters >= requiredReserveLiters);

    let verdictHTML = '';
    if (isSafe) {
        verdictHTML = `<div class="result-safe">Plan Bezpieczny</div>`;
    } else {
        verdictHTML = `<div class="result-danger">RYZYKO (Naruszenie Rezerwy)</div>`;
    }

    // Default explanation if missing
    if (!explanationHTML) {
        explanationHTML = `<div class="formula-box-small"><p>Brak szczegółów obliczeń.</p></div>`;
    }

    container.innerHTML = `
        <div class="result-info-icon tooltip-trigger" data-tooltip-type="calculation" data-pro-feature="false">i</div>
        <div class="calculation-details" style="display: none;">${explanationHTML}</div>
        <div class="result-container-header"><h4>Zużycie Gazu</h4></div>
        <div class="result-section"><p class="result-label">Zapotrzebowanie (Plan):</p><p class="result-value-main">${totalDemandLiters.toFixed(0)}<span class="unit">l</span> <span>(${totalDemandBars.toFixed(1)} bar)</span></p></div>
        <div class="result-section"><p class="result-label">Pozostało:</p><p class="result-value-main">${remainingLiters.toFixed(0)}<span class="unit">l</span> <span>(${remainingBars.toFixed(1)} bar)</span></p></div>
        ${verdictHTML}
    `;
    container.style.display = 'block';

    // Add tooltip listener logic if needed globally, but likely handled by AppUI
}

function autoLoadSavedSac() {
    const savedSac = localStorage.getItem('uki-user-sac');
    if (!savedSac) return;

    const gcSAC = document.getElementById('gcSAC');
    if (gcSAC) gcSAC.value = savedSac;

    const proSAC = document.getElementById('gcSAC_pro');
    if (proSAC) proSAC.value = savedSac;

    const rbSAC = document.getElementById('rbSAC');
    if (rbSAC) rbSAC.value = savedSac;
}


