import { DatabaseManager } from '../db/DatabaseManager.js';
import { ShareUtils } from '../../utils/ShareUtils.js';
import { readBodyProfile } from '../diet/kcalGoal.js';
import { bodySummary, bfRanges, whrRanges } from '../body/bodyMetrics.js';
import { canonicalExerciseName } from '../../data/ExerciseCatalog.js';
import { atlasMuscles, bodyweightFactor } from '../../data/exerciseTraits.js';

export const AnalyticsUI = {
    init: () => {
        document.addEventListener('tabChanged', (e) => {
            if(e.detail && e.detail.tab === 'analytics-dashboard') {
                AnalyticsUI.loadAnalytics();
            }
        });
    },

    loadAnalytics: async () => {
        const container = document.getElementById('analytics-content');
        if (!container) return;
        
        container.innerHTML = '<p style="text-align: center; color: #aaa;">Ładowanie danych...</p>';

        try {
            const trainings = await DatabaseManager.getTrainings();
            const measurements = await DatabaseManager.getMeasurements();
            
            AnalyticsUI.cachedTrainings = trainings;
            AnalyticsUI.cachedMeasurements = measurements;
            
            AnalyticsUI.renderAnalytics(container, trainings, measurements);
        } catch (err) {
            console.error("Error loading analytics:", err);
            container.innerHTML = '<p style="text-align: center; color: #ff4444;">Błąd ładowania statystyk.</p>';
        }
    },

    renderAnalytics: (container, trainings, measurements) => {
        AnalyticsUI.renderNewAnalytics(container, trainings, measurements);
    },

    renderNewAnalytics: (container, trainings, measurements) => {
        container.innerHTML = `
            <!-- TABS / PILLS NAVIGATION -->
            <div style="padding: 10px; background: #181818; display: flex; gap: 6px; border-bottom: 1px solid #333; position: sticky; top: 0; z-index: 10;">
                <button id="btn-tab-1" class="analytics-tab-btn active" onclick="window.AnalyticsUI.switchTab(1)" style="flex: 1; background: rgba(0, 191, 255, 0.15); border: 1px solid #00BFFF; color: #00BFFF; font-weight: bold; padding: 10px 2px; border-radius: 12px; font-size: 0.75em; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; box-sizing: border-box;">
                    <span style="font-size: 1.6em;">🏋️</span>
                    <span style="white-space: nowrap;">Trening & Siła</span>
                </button>
                <button id="btn-tab-2" class="analytics-tab-btn" onclick="window.AnalyticsUI.switchTab(2)" style="flex: 1; background: #222; border: 1px solid #444; color: #aaa; padding: 10px 2px; border-radius: 12px; font-size: 0.75em; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; box-sizing: border-box; transition: all 0.2s;">
                    <span style="font-size: 1.6em;">📏</span>
                    <span style="white-space: nowrap;">Sylwetka</span>
                </button>
                <button id="btn-tab-3" class="analytics-tab-btn" onclick="window.AnalyticsUI.switchTab(3)" style="flex: 1; background: #222; border: 1px solid #444; color: #aaa; padding: 10px 2px; border-radius: 12px; font-size: 0.75em; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; box-sizing: border-box; transition: all 0.2s;">
                    <span style="font-size: 1.6em;">🔋</span>
                    <span style="white-space: nowrap;">Regeneracja</span>
                </button>
            </div>
            
            <div id="analytics-tab-1" class="analytics-tab-content" style="display: block; padding-top: 15px; animation: fadeIn 0.3s ease-out;">
                ${AnalyticsUI.buildStrengthTab(trainings, measurements)}
            </div>
            <div id="analytics-tab-2" class="analytics-tab-content" style="display: none; padding-top: 15px; animation: fadeIn 0.3s ease-out;">
                ${AnalyticsUI.buildBodyTab(trainings, measurements)}
            </div>
            <div id="analytics-tab-3" class="analytics-tab-content" style="display: none; padding-top: 15px; animation: fadeIn 0.3s ease-out;">
                ${AnalyticsUI.buildRecoveryTab(trainings)}
            </div>
        `;
        
        // Resolve media/charts if needed
        const select = document.getElementById('analytics-exercise-select');
        if (select && select.value) {
            setTimeout(() => window.AnalyticsUI.renderExerciseChart(select.value), 100);
        }
    },

    switchTab: (index) => {
        const btns = document.querySelectorAll('.analytics-tab-btn');
        btns.forEach((btn, i) => {
            if (i + 1 === index) {
                btn.classList.add('active');
                btn.style.background = 'rgba(0, 191, 255, 0.15)';
                btn.style.borderColor = '#00BFFF';
                btn.style.color = '#00BFFF';
                btn.style.fontWeight = 'bold';
            } else {
                btn.classList.remove('active');
                btn.style.background = '#222';
                btn.style.borderColor = '#444';
                btn.style.color = '#aaa';
                btn.style.fontWeight = 'normal';
            }
        });
        
        const contents = document.querySelectorAll('.analytics-tab-content');
        contents.forEach((content, i) => {
            if (i + 1 === index) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    },

    buildStrengthTab: (trainings, measurements) => {
        let html = '';
        if (trainings.length === 0) {
            return "<p style=\"text-align: center; color: #888;\">Za mało danych treningowych do przeprowadzenia analizy.</p>";
        }

        let totalVolume = 0;
        let totalWorkouts = trainings.length;
        let thisMonthWorkouts = [];
        let thisMonthVolume = 0;
        let totalCalories = 0;

        const workoutsWithVolume = trainings.map(t => {
            let vol = 0;
            let volBody = 0;
            let volMachine = 0;
            const exercises = t.exercises || [];
            exercises.forEach(ex => {
                // Ciężar ciała z danych katalogu (pompki 0,65, podciąganie 1); słowa kluczowe tylko dla ćwiczeń własnych.
                const bwFactor = bodyweightFactor(ex.name);
                
                if (ex.sets) {
                    ex.sets.forEach(set => {
                        let weightForVolume = (set.weight !== undefined && set.weight !== null) ? Number(set.weight) : 0;
                        if (bwFactor > 0) weightForVolume += (measurements.length > 0 ? (measurements[0].weight * bwFactor) : 0);
                        
                        const setTonnage = weightForVolume * (set.reps ? Number(set.reps) : 0);
                        vol += setTonnage;
                        if (bwFactor > 0) volBody += setTonnage;
                        else volMachine += setTonnage;
                    });
                }
            });

            const sw = t.smartwatch || {};
            const calories = sw.calories ? Number(sw.calories) : 0;
            const hr = sw.hr ? Number(sw.hr) : null;
            const type = t.type || (vol > 0 ? "strength" : (calories > 0 ? "classes" : "strength"));
            const durationMinutes = t.duration_seconds ? Math.round(t.duration_seconds / 60) : null;

            return { id: t.id, name: t.name || "", date: new Date(t.date), volume: vol, volBody, volMachine, type, calories, hr, durationMinutes, duration_seconds: t.duration_seconds || 0 };
        });

        workoutsWithVolume.sort((a, b) => b.date - a.date);
        
        let totalVolBody = 0, totalVolMachine = 0;
        workoutsWithVolume.forEach(w => {
            totalVolume += w.volume; totalVolBody += w.volBody; totalVolMachine += w.volMachine;
            if (w.calories > 0) totalCalories += w.calories;
        });

        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        thisMonthWorkouts = workoutsWithVolume.filter(w => w.date.getMonth() === thisMonth && w.date.getFullYear() === thisYear);
        thisMonthWorkouts.forEach(w => thisMonthVolume += w.volume);

        const maxStrengthVol = Math.max(...workoutsWithVolume.filter(w => w.type === "strength" || w.volume > 0).map(wo => wo.volume), 1);
        const maxCardioCalories = Math.max(...workoutsWithVolume.filter(w => w.type === "cardio" || w.type === "classes" || w.volume === 0).map(wo => wo.calories), 1);

        html += `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 25px;">
                <div style="background: rgba(0,0,0,0.5); border: 1px solid #00BFFF; padding: 12px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 1.8em; color: #00BFFF; font-weight: bold; margin-bottom: 3px;">${totalWorkouts}</div>
                    <div style="font-size: 0.75em; color: #aaa; text-transform: uppercase;">Wszystkich Treningów</div>
                </div>
                <div style="background: rgba(0,0,0,0.5); border: 1px solid #FF9800; padding: 12px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 1.8em; color: #FF9800; font-weight: bold; margin-bottom: 3px;">${totalCalories > 0 ? totalCalories.toLocaleString("pl-PL") : "0"} <span style="font-size: 0.6em;">kcal</span></div>
                    <div style="font-size: 0.75em; color: #aaa; text-transform: uppercase;">Spalone (Smartwatch)</div>
                </div>
                <div style="background: rgba(0,0,0,0.5); border: 1px solid #E91E63; padding: 12px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 1.4em; color: #E91E63; font-weight: bold; margin-bottom: 3px;">${Math.round(totalVolMachine)} kg</div>
                    <div style="font-size: 0.7em; color: #aaa; text-transform: uppercase;">Tonaż Żelastwa</div>
                </div>
                <div style="background: rgba(0,0,0,0.5); border: 1px solid #2ECC71; padding: 12px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 1.4em; color: #2ECC71; font-weight: bold; margin-bottom: 3px;">${Math.round(totalVolBody)} kg</div>
                    <div style="font-size: 0.7em; color: #aaa; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 4px;">
                    <span>Tonaż Ciała</span>
                    <button type="button" onclick="window.AnalyticsUI.showBodyweightInfoModal()" style="background: none; border: none; padding: 0; font-size: 1.1em; cursor: pointer; line-height: 1;" title="Informacja o tonażu ciała">ℹ️</button>
                </div>
                </div>
            </div>
            
            <h4 style="color: #00BFFF; border-bottom: 1px solid rgba(0,191,255,0.2); padding-bottom: 5px; margin-bottom: 15px;">Zaawansowana Analityka (PRO)</h4>
            
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; font-size: 1.05em; color: #fff;">W tym miesiącu: <strong>${thisMonthWorkouts.length}</strong> aktywności, w tym <strong>${thisMonthVolume > 0 ? (thisMonthVolume >= 1000 ? (thisMonthVolume/1000).toFixed(1) + " t" : thisMonthVolume + " kg") : "0 kg"}</strong> tonażu siłowego!</p>
                ${thisMonthWorkouts.length >= 8 
                    ? '<p style="color: #2ECC71; margin: 0; font-weight: bold;">🔥 Konsekwencja mistrza! Świetna robota!</p>' 
                    : '<p style="color: #00BFFF; margin: 0;">💪 Każda sesja przybliża Cię do życiowej formy. Nie przestawaj!</p>'}
            </div>
            
            <h5 style="color: #FFD700; margin-top: 15px; margin-bottom: 5px;">📈 Ostatnie 10 sesji treningowych</h5>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 25px;">
                ${workoutsWithVolume.slice(0,10).reverse().map(w => {
                    const dateStr = new Date(w.date).toLocaleDateString('pl-PL', {weekday:'short', day:'numeric', month:'short'});
                    const isCardioOrClasses = (w.type === "cardio" || w.type === "classes") || (w.volume === 0 && (w.calories > 0 || w.duration_seconds > 0));
                    
                    let barColor = "#FF9800";
                    let displayVal = "";
                    let typeBadge = "";
                    let typeIcon = "🏋️";

                    if (isCardioOrClasses) {
                        const isClasses = w.type === "classes" || (!w.type && w.volume === 0);
                        typeBadge = isClasses ? "Zajęcia" : "Cardio";
                        typeIcon = isClasses ? "🔥" : "🏃";
                        barColor = isClasses ? "#FF5722" : "#00BFFF";
                        
                        displayVal = w.calories > 0 ? `${w.calories} kcal` : (w.durationMinutes ? `⏱️ ${w.durationMinutes} min` : `Aktywność`);
                        if (w.hr) displayVal += ` <span style="font-size: 0.85em; opacity: 0.85;">(💓${w.hr})</span>`;
                    } else {
                        typeBadge = "Siłowe";
                        typeIcon = "🏋️";
                        const barPct = Math.min(100, Math.max(8, Math.round((w.volume / maxStrengthVol) * 100)));
                        barColor = barPct >= 80 ? "#2ECC71" : (barPct >= 50 ? "#FFD700" : "#FF9800");
                        displayVal = w.volume >= 1000 ? (w.volume/1000).toFixed(1) + " t" : Math.round(w.volume) + " kg";
                        if (w.calories > 0) displayVal += ` <span style="font-size: 0.8em; opacity: 0.85;">(🔥${w.calories})</span>`;
                    }

                    const workoutNameDisplay = w.name ? w.name : typeBadge;

                    return `
                    <div style="display: flex; align-items: center; background: #1a1a1a; border-radius: 12px; padding: 12px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <div style="width: 44px; height: 44px; border-radius: 50%; background: ${barColor}15; border: 1px solid ${barColor}40; display: flex; align-items: center; justify-content: center; font-size: 1.3em; flex-shrink: 0;">
                            ${typeIcon}
                        </div>
                        <div style="flex: 1; margin-left: 12px; overflow: hidden;">
                            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                                <span style="font-weight: bold; font-size: 0.95em; color: #eee; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%;">${workoutNameDisplay}</span>
                                <span style="font-size: 0.75em; color: #888;">${dateStr}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 0.8em; color: #aaa;">${typeBadge}</span>
                                <span style="font-weight: bold; font-size: 1em; color: ${barColor};">${displayVal}</span>
                            </div>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        `;

        // Add 1RM Records
        const exerciseMaxMap = {};
        trainings.forEach(t => {
            (t.exercises || []).forEach(ex => {
                if (!ex.name) return;
                const cleanName = canonicalExerciseName(ex.name); // rekord dawnej nazwy z katalogu liczy się pod nową
                if (!cleanName) return;
                (ex.sets || []).forEach(s => {
                    const weight = Number(s.weight), reps = Number(s.reps);
                    if (!isNaN(weight) && weight > 0 && !isNaN(reps) && reps >= 1) {
                        const estimated1Rm = reps === 1 ? weight : Math.round(weight * (1 + (reps / 30)) * 10) / 10;
                        if (!exerciseMaxMap[cleanName] || weight > exerciseMaxMap[cleanName].actualWeight || (weight === exerciseMaxMap[cleanName].actualWeight && reps > exerciseMaxMap[cleanName].reps)) {
                            exerciseMaxMap[cleanName] = { name: cleanName, actualWeight: weight, max1Rm: estimated1Rm, reps: reps, date: t.date };
                        }
                    }
                });
            });
        });

        const recordsList = Object.values(exerciseMaxMap).sort((a, b) => b.actualWeight - a.actualWeight);
        if (recordsList.length > 0) {
            html += `
                <div style="margin-top: 25px; margin-bottom: 25px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,215,0,0.3); padding-bottom: 5px; margin-bottom: 8px;">
                        <h4 style="color: #FFD700; margin: 0; display: flex; align-items: center; gap: 6px; font-size: 1.1em;">🏆 Twoje Rekordy Siłowe</h4>
                        <button type="button" onclick="window.AnalyticsUI.show1RmInfoModal()" style="background: rgba(255,215,0,0.15); border: 1px solid #FFD700; color: #FFD700; border-radius: 50%; width: 26px; height: 26px; font-size: 0.9em; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; line-height: 1;" title="Czym jest 1RM?">ℹ️</button>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${recordsList.slice(0, 4).map(r => `
                            <div style="flex: 1 1 calc(50% - 10px); min-width: 140px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,215,0,0.2); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; justify-content: space-between;">
                                <div style="font-size: 0.85em; color: #eee; font-weight: bold; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${r.name}">${r.name}</div>
                                <div>
                                    <div style="font-size: 1.25em; color: #FFD700; font-weight: 800; line-height: 1.1; margin-bottom: 4px;">${r.actualWeight} <span style="font-size: 0.65em; color: #fff; font-weight: normal;">kg</span> <span style="font-size: 0.8em; color: #aaa; font-weight: normal;">x ${r.reps}</span></div>
                                    <div style="font-size: 0.72em; color: #bbb;">${new Date(r.date).toLocaleDateString("pl-PL", {day:"numeric", month:"short"})}</div>
                                    <div style="font-size: 0.7em; color: #00BFFF; margin-top: 6px; display: flex; align-items: center; gap: 4px;">
                                        <span style="background: rgba(0, 191, 255, 0.15); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(0, 191, 255, 0.3);">ℹ️ Szac. 1RM: ~${r.max1Rm.toFixed(1)} kg</span>
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                    <div style="text-align: center; margin-top: 12px;">
                        <button type="button" onclick="window.AnalyticsUI.shareRecords()" class="action-button" style="background: linear-gradient(135deg, #FFD700, #FF9800); color: #000; font-weight: bold; border: none; padding: 10px 18px; border-radius: 6px; font-size: 0.9em; cursor: pointer; width: 100%; box-shadow: 0 4px 12px rgba(255,215,0,0.25);">📤 Udostępnij swoje rekordy</button>
                    </div>
                </div>
            `;
        }

        // Add Progress Chart
        const uniqueExNames = new Set();
        trainings.forEach(t => (t.exercises || []).forEach(ex => { if(ex.name && ex.name.trim()) uniqueExNames.add(canonicalExerciseName(ex.name)); }));
        const exListOptions = Array.from(uniqueExNames).sort();
        
        if (exListOptions.length > 0) {
            html += `
                <div style="margin-top: 30px; margin-bottom: 25px;">
                    <h4 style="color: #2ECC71; border-bottom: 1px solid rgba(46,204,113,0.2); padding-bottom: 5px; margin-bottom: 15px;">📈 Śledzenie Progresu (Wykres Max Ciężaru)</h4>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                        <select id="analytics-exercise-select" onchange="window.AnalyticsUI.renderExerciseChart(this.value)" style="width: 100%; padding: 10px; border-radius: 6px; background: #222; border: 1px solid #2ECC71; color: #fff; font-size: 1em; margin-bottom: 15px;">
                            <option value="">-- Wybierz ćwiczenie --</option>
                            ${exListOptions.map(name => `<option value="${name}">${name}</option>`).join('')}
                        </select>
                        <div id="analytics-exercise-chart-container" style="min-height: 160px; display: flex; align-items: center; justify-content: center; color: #888; font-size: 0.9em;">Wybierz ćwiczenie z listy.</div>
                    </div>
                </div>
            `;
        }
        return html;
    },

    buildBodyTab: (trainings, measurements) => {
        let html = '';
        if (measurements.length === 0) {
            return `
                <div style="background: rgba(255, 165, 0, 0.1); border-left: 4px solid orange; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                    <strong style="color: orange;">Brak pomiarów ciała!</strong>
                    <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #ddd;">Aby śledzić swój progres sylwetkowy, przejdź do zakładki "Pomiary Ciała" i dodaj pierwszy wpis.</p>
                </div>
            `;
        }

        const sortedMeasurements = [...measurements].sort((a, b) => new Date(b.date) - new Date(a.date));
        const last = sortedMeasurements[0];
        const first = sortedMeasurements[sortedMeasurements.length - 1];
        // Najnowsza wartość każdego pola osobno (wpis z samą wagą nie ukrywa BF% ani FFMI); normy ACE i WHO.
        const gender = readBodyProfile().sex;
        const body = bodySummary(measurements, gender);
        const missingForBF = body.missing;

        let bfHtml = '';
        let ffmiHtml = '';
        let whrHtml = '';
        let bf = null;
        let normalizedFfmi = null;

        if (missingForBF.length === 0) {
            bf = body.bf;

            const bfText = body.bfCategory.text;

            bfHtml = `
                <div style="background: rgba(0,0,0,0.5); border: 1px solid #00BFFF; padding: 15px; border-radius: 8px; margin-bottom: 15px; position: relative;">
                    <strong style="color: #00BFFF; font-size: 1.2em;">Szacunkowy BF%</strong>
                    <button onclick="window.AnalyticsUI.showInfoModal('bf', ${bf})" style="position: absolute; right: 15px; top: 15px; background: none; border: none; color: #00BFFF; font-size: 1.2em; cursor: pointer;">ℹ️</button>
                    <div style="font-size: 2em; font-weight: bold; margin: 10px 0;">${bf.toFixed(1)} <span style="font-size: 0.5em; font-weight: normal;">%</span></div>
                    <p style="margin: 0; font-size: 0.9em; font-weight: bold; color: #fff;">${bfText}</p>
                </div>
            `;

            if (body.ffmi !== null) {
                normalizedFfmi = body.ffmi;

                let ffmiText = "";
                if (gender === 'male') {
                    if(normalizedFfmi < 18) ffmiText = "Poniżej przeciętnej";
                    else if(normalizedFfmi < 20) ffmiText = "Przeciętna muskulatura";
                    else if(normalizedFfmi < 22) ffmiText = "Dobra muskulatura (Wysportowany)";
                    else if(normalizedFfmi < 25) ffmiText = "Doskonała muskulatura";
                    else ffmiText = "Genetyczna elita (lub doping)";
                } else {
                    if(normalizedFfmi < 15) ffmiText = "Poniżej przeciętnej";
                    else if(normalizedFfmi < 17) ffmiText = "Przeciętna muskulatura";
                    else if(normalizedFfmi < 19) ffmiText = "Dobra muskulatura (Wysportowana)";
                    else if(normalizedFfmi < 21) ffmiText = "Doskonała muskulatura";
                    else ffmiText = "Genetyczna elita";
                }

                ffmiHtml = `
                    <div style="background: rgba(0,0,0,0.5); border: 1px solid #2ECC71; padding: 15px; border-radius: 8px; margin-bottom: 15px; position: relative;">
                        <strong style="color: #2ECC71; font-size: 1.2em;">FFMI (Index Beztłuszczowy)</strong>
                        <button onclick="window.AnalyticsUI.showInfoModal('ffmi', ${normalizedFfmi})" style="position: absolute; right: 15px; top: 15px; background: none; border: none; color: #2ECC71; font-size: 1.2em; cursor: pointer;">ℹ️</button>
                        <div style="font-size: 2em; font-weight: bold; margin: 10px 0;">${normalizedFfmi.toFixed(1)}</div>
                        <p style="margin: 0; font-size: 0.9em; font-weight: bold; color: #fff;">${ffmiText}</p>
                    </div>
                `;
            }
        } else {
            bfHtml = `<div style="background: rgba(255, 68, 68, 0.1); border-left: 4px solid #ff4444; padding: 15px; margin-bottom: 15px; border-radius: 4px;"><strong style="color: #ff4444;">Brak danych BF%</strong><p style="margin: 5px 0 0 0; font-size: 0.9em; color: #ddd;">Uzupełnij: ${missingForBF.join(", ")}.</p></div>`;
        }

        if (body.whr !== null) {
            const whr = body.whr;
            const whrText = body.whrCategory ? body.whrCategory.text : 'Ustaw płeć w Pomiarach ciała, żeby ocenić ryzyko.';

            whrHtml = `
                <div style="background: rgba(0,0,0,0.5); border: 1px solid #9B59B6; padding: 15px; border-radius: 8px; margin-bottom: 15px; position: relative;">
                    <strong style="color: #9B59B6; font-size: 1.2em;">WHR (Talia-Biodra)</strong>
                    <button onclick="window.AnalyticsUI.showInfoModal('whr', ${whr})" style="position: absolute; right: 15px; top: 15px; background: none; border: none; color: #9B59B6; font-size: 1.2em; cursor: pointer;">ℹ️</button>
                    <div style="font-size: 2em; font-weight: bold; margin: 10px 0;">${whr.toFixed(2)}</div>
                    <p style="margin: 0; font-size: 0.9em; font-weight: bold; color: #fff;">${whrText}</p>
                </div>
            `;
        }

        let trendsHtml = '';
        if (sortedMeasurements.length > 1) {
            trendsHtml += '<h5 style="color: #00BFFF; margin-top: 15px; margin-bottom: 10px;">Zmiany (od pierwszego wpisu)</h5>';
            const dict = { weight: 'Waga', chest: 'Klatka', waist: 'Talia', hips: 'Biodra', thigh: 'Udo', biceps: 'Biceps', neck: 'Szyja' };
            let diffs = '';
            for (const [key, label] of Object.entries(dict)) {
                if (last[key] && first[key]) {
                    const v = last[key] - first[key];
                    if (v !== 0) {
                        const sign = v > 0 ? '+' : '';
                        const color = v > 0 ? (key==='waist' ? '#ff4444' : '#2ECC71') : (key==='waist' ? '#2ECC71' : '#ff4444');
                        diffs += `<div style="display: flex; justify-content: space-between; margin-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px;"><span>${label}</span><strong style="color: ${color};">${v > 0 ? '↗️' : '↘️'} ${sign}${v.toFixed(1)} ${key==='weight'?'kg':'cm'}</strong></div>`;
                    }
                }
            }
            if(diffs) trendsHtml += `<div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">${diffs}</div>`;
        }
        
        return bfHtml + ffmiHtml + whrHtml + trendsHtml;
    },

    buildRecoveryTab: (trainings) => {
        if (trainings.length === 0) return '<p style="color: #888;">Brak danych treningowych do analizy regeneracji.</p>';
        const now = Date.now();
        const last48h = now - (48 * 60 * 60 * 1000);
        const recentTrainings = trainings.filter(t => (t.startTime || new Date(t.date).getTime()) > last48h);

        const muscles = {
            chest: { name: 'Klatka Piersiowa', status: 'green' },
            back: { name: 'Plecy', status: 'green' },
            legs: { name: 'Nogi', status: 'green' },
            shoulders: { name: 'Barki', status: 'green' },
            arms: { name: 'Ramiona', status: 'green' },
            core: { name: 'Brzuch', status: 'green' }
        };

        recentTrainings.forEach(t => (t.exercises || []).forEach(ex => {
            // Partie z danych katalogu (także pod dawną nazwą); słowa kluczowe tylko dla ćwiczeń własnych.
            atlasMuscles(ex.name).forEach(key => { if (muscles[key]) muscles[key].status = 'red'; });
        }));

        let atlasCards = '';
        Object.keys(muscles).forEach(key => {
            const m = muscles[key];
            const bg = m.status === 'red' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(46, 204, 113, 0.1)';
            const border = m.status === 'red' ? '#E74C3C' : '#2ECC71';
            const icon = m.status === 'red' ? '🔴 Zmęczone' : '🟢 Gotowe';
            const shadow = m.status === 'red' ? 'box-shadow: 0 0 10px rgba(231,76,60,0.2);' : '';
            atlasCards += `
                <div style="background: ${bg}; border: 1px solid ${border}; padding: 12px; border-radius: 8px; text-align: center; display: flex; flex-direction: column; justify-content: center; ${shadow}">
                    <strong style="color: #fff; font-size: 0.9em; margin-bottom: 5px;">${m.name}</strong>
                    <span style="font-size: 0.8em; color: ${border}; font-weight: bold;">${icon}</span>
                </div>
            `;
        });

        return `
            <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid #00BFFF; margin-bottom: 20px;">
                <p style="margin: 0 0 15px 0; font-size: 0.9em; color: #ccc;">Analiza na podstawie treningów z ostatnich 48 godzin. Partie oznaczone na czerwono (🔴) zaangażowano niedawno i potrzebują czasu na regenerację. Unikaj obciążania ich dzisiaj!</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    ${atlasCards}
                </div>
            </div>
        `;
    },

    renderExerciseChart: (exerciseName) => {
        const container = document.getElementById('analytics-exercise-chart-container');
        if (!container) return;
        if (!exerciseName) {
            container.innerHTML = 'Wybierz ćwiczenie z listy powyżej, aby zobaczyć wykres swojego progresu na przestrzeni czasu.';
            return;
        }

        const trainings = AnalyticsUI.cachedTrainings || [];
        // Extract max weight per day for this exercise
        const historyData = [];
        
        trainings.forEach(t => {
            if (!t.exercises) return;
            let dayMax = 0;
            let dayReps = 0;
            let found = false;
            
            t.exercises.forEach(ex => {
                if (ex.name && canonicalExerciseName(ex.name) === canonicalExerciseName(exerciseName)) {
                    if (ex.sets) {
                        ex.sets.forEach(s => {
                            const w = Number(s.weight);
                            const r = Number(s.reps);
                            if (!isNaN(w) && w > 0 && !isNaN(r) && r > 0) {
                                found = true;
                                if (w > dayMax || (w === dayMax && r > dayReps)) {
                                    dayMax = w;
                                    dayReps = r;
                                }
                            }
                        });
                    }
                }
            });
            
            if (found && dayMax > 0) {
                historyData.push({ date: t.date, maxWeight: dayMax, reps: dayReps });
            }
        });

        if (historyData.length === 0) {
            container.innerHTML = '<span style="color: #ff4444;">Brak wystarczających danych z poprawnym ciężarem do wygenerowania wykresu dla tego ćwiczenia.</span>';
            return;
        }

        // Sort ascending by date
        historyData.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Take last 12 entries so it fits well on mobile
        const chartData = historyData.slice(-12);
        
        const absoluteMax = Math.max(...chartData.map(d => d.maxWeight));
        
        let chartHtml = `
            <div style="width: 100%; display: flex; align-items: flex-end; justify-content: flex-start; gap: 8px; height: 180px; padding: 10px 10px 35px 10px; background: rgba(0,0,0,0.3); border-radius: 8px; overflow-x: auto; margin-top: 10px; position: relative; border-bottom: 1px solid #2ECC71;">
        `;
        
        chartData.forEach(d => {
            const heightPct = Math.max(5, (d.maxWeight / absoluteMax) * 100);
            const dateShort = new Date(d.date).toLocaleDateString('pl-PL', {day:'numeric', month:'short'});
            
            chartHtml += `
                <div style="display: flex; flex-direction: column; justify-content: flex-end; align-items: center; flex: 1; min-width: 40px; max-width: 60px; height: 100%; position: relative;">
                    <div style="font-size: 0.75em; color: #2ECC71; font-weight: bold; margin-bottom: 2px;">${d.maxWeight} <span style="font-size:0.7em;color:#aaa;">kg</span></div>
                    <div style="font-size: 0.65em; color: #888; margin-bottom: 5px;">x${d.reps}</div>
                    <div style="width: 100%; max-width: 30px; height: ${heightPct}%; background: linear-gradient(to top, rgba(46,204,113,0.3), #2ECC71); border-radius: 4px 4px 0 0; min-height: 5px; box-shadow: 0 0 5px rgba(46,204,113,0.2);"></div>
                    <div style="font-size: 0.65em; color: #aaa; margin-top: 8px; position: absolute; bottom: -25px; white-space: nowrap;">${dateShort}</div>
                </div>
            `;
        });
        
        chartHtml += `</div>`;
        container.innerHTML = chartHtml;
    },

    
    shareRecords: async () => {
        try {
            const trainings = await DatabaseManager.getTrainings();
            const exerciseMaxMap = {};

            trainings.forEach(t => {
                const exList = t.exercises || [];
                const tDate = t.date;

                exList.forEach(ex => {
                    if (!ex.name) return;
                    const cleanName = canonicalExerciseName(ex.name);
                    if (!cleanName) return;

                    const sets = ex.sets || [];
                    sets.forEach(s => {
                        const weight = Number(s.weight);
                        const reps = Number(s.reps);

                        if (!isNaN(weight) && weight > 0 && !isNaN(reps) && reps >= 1) {
                            const estimated1Rm = reps === 1 ? weight : Math.round(weight * (1 + (reps / 30)) * 10) / 10;
                            if (!exerciseMaxMap[cleanName] || weight > exerciseMaxMap[cleanName].actualWeight || (weight === exerciseMaxMap[cleanName].actualWeight && reps > exerciseMaxMap[cleanName].reps)) {
                                exerciseMaxMap[cleanName] = {
                                    name: cleanName,
                                    actualWeight: weight,
                                    max1Rm: estimated1Rm,
                                    reps: reps,
                                    date: tDate
                                };
                            }
                        }
                    });
                });
            });

            const topRecords = Object.values(exerciseMaxMap).sort((a, b) => b.actualWeight - a.actualWeight).slice(0, 4);

            if (topRecords.length === 0) {
                alert("Brak zarejestrowanych serii siłowych do wygenerowania grafiki.");
                return;
            }

            let avatar = localStorage.getItem("uki-avatar") || localStorage.getItem("uki-bodybuild-avatar") || null;
            let nickname = localStorage.getItem("uki-nickname") || localStorage.getItem("userNick") || "BodyBuilder";

            const statsList = topRecords.map(r => ({
                label: r.name,
                value: `${r.actualWeight} kg (${r.reps} powt.)`,
                color: "#FFD700"
            }));

            const textToShare = `Moje aktualne rekordy siłowe z Uki's BodyBuild! 🔥 Dźwigaj i rośnij: https://lukaszdudzinski.github.io/Ukis-BodyBuild/`;
            await ShareUtils.generateAndShareImage("Rekordy Siłowe", statsList, avatar, nickname, textToShare);
        } catch (error) {
            console.log("Błąd podczas udostępniania rekordów:", error);
            if (error.name === "AbortError") return;
            alert("Nie udało się udostępnić grafiki: " + error.message);
        }
    },

    shareProgress: async (monthWorkouts, monthVolume, totalVolume) => {
        const gender = localStorage.getItem('uki-bodybuild-gender') || 'male';
        const didText = gender === 'female' ? 'zrobiłam' : 'zrobiłem';
        const liftedText = gender === 'female' ? 'przerzuciłam' : 'przerzuciłem';
        const textToShare = `W tym miesiącu ${didText} ${monthWorkouts} treningów i ${liftedText} ${monthVolume} kg! 🔥 Buduję formę z Uki's BodyBuild! 💪 Dołącz do nas: https://lukaszdudzinski.github.io/Ukis-BodyBuild/`;
        try {
            // Fetch avatar and nickname from settings
            const settingsStr = localStorage.getItem('uki_bodybuild_settings');
            let avatar = localStorage.getItem('uki-bodybuild-avatar') || null;
            let nickname = 'BodyBuilder';
            if (settingsStr) {
                const settings = JSON.parse(settingsStr);
                nickname = settings.nickname || 'BodyBuilder';
            }

            const statsList = [
                { label: 'Treningi w tym miesiącu', value: String(monthWorkouts) },
                { label: 'Ciężar przerzucony w miesiącu', value: `${monthVolume} kg`, color: '#00BFFF' },
                { label: 'Całkowita objętość', value: `${totalVolume} kg` }
            ];

            await ShareUtils.generateAndShareImage("Raport Progresu", statsList, avatar, nickname, textToShare);
            
        } catch (error) {
            console.log('Błąd podczas udostępniania:', error);
            if (error.name === 'AbortError') {
                // User cancelled the share dialog, do nothing.
                return;
            }
            // Fallback: Copy to clipboard if writeText fails due to lack of focus or unsupported share API
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(textToShare);
                    alert("Skopiowano tekst do schowka. Możesz go wkleić do wybranej aplikacji.");
                } else {
                    window.prompt("Udostępnianie graficzne niedostępne na tym urządzeniu. Skopiuj swój wynik poniżej (Ctrl+C / Cmd+C):", textToShare);
                }
            } catch(e) {
                console.error("Fallback również zawiódł", e);
                window.prompt("Skopiuj swój wynik poniżej (Ctrl+C / Cmd+C):", textToShare);
            }
        }
    },

    
    
    show1RmInfoModal: () => {
        let modal = document.getElementById("analytics-info-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "analytics-info-modal";
            modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box; backdrop-filter: blur(5px); flex-direction: column; opacity: 0; transition: opacity 0.3s;";
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div style="background: #1e1e1e; padding: 25px; border-radius: 12px; width: 100%; max-width: 420px; border-top: 5px solid #FFD700; box-shadow: 0 10px 30px rgba(0,0,0,0.8); position: relative; box-sizing: border-box; text-align: left;">
                <h3 style="color: #FFD700; margin-top: 0; font-size: 1.3em; display: flex; align-items: center; gap: 8px;">
                    🏆 Czym jest 1RM (One Repetition Max)?
                </h3>
                <p style="color: #ddd; font-size: 0.9em; line-height: 1.6; margin-bottom: 15px;">
                    <strong>1RM</strong> to wskaźnik oznaczający <em>Maksimum Jednego Powtórzenia</em> – czyli największy możliwy ciężar, jaki jesteś w stanie podnieść w danym ćwiczeniu dokładnie <strong>jeden raz</strong> z prawidłową techniką.
                </p>
                <div style="background: rgba(255,215,0,0.08); border-left: 3px solid #FFD700; padding: 10px 12px; border-radius: 4px; margin-bottom: 15px; font-size: 0.85em; color: #eee; line-height: 1.5;">
                    💡 <strong>Dlaczego to szacujemy, a nie sprawdzamy na żywo?</strong><br>
                    Próby podnoszenia 100% maksa na 1 powtórzenie niosą ze sobą ogromne ryzyko kontuzji stawów, ścięgien i kręgosłupa. Aplikacja bezpiecznie oblicza Twój teoretyczny rekord ze zwykłych serii roboczych (np. seria 80 kg × 8 powtórzeń daje szacowany max ok. 101 kg).
                </div>
                <p style="color: #bbb; font-size: 0.85em; line-height: 1.5; margin-bottom: 20px;">
                    🎯 <strong>Jak to wykorzystać w treningu?</strong><br>
                    • <strong>Budowanie masy mięśniowej:</strong> trenuj na <strong>70–80%</strong> swojego 1RM (8–12 powtórzeń).<br>
                    • <strong>Budowanie czystej siły:</strong> trenuj na <strong>80–90%</strong> swojego 1RM (3–5 powtórzeń).
                </p>
                <div style="text-align: center;">
                    <button onclick="document.getElementById('analytics-info-modal').style.opacity='0'; setTimeout(()=>document.getElementById('analytics-info-modal').style.display='none', 300);" style="background: #333; color: #fff; border: 1px solid #555; padding: 10px 30px; border-radius: 6px; font-weight: bold; font-size: 1em; cursor: pointer; display: inline-block;">Wszystko jasne!</button>
                </div>
            </div>
        `;
        modal.style.display = "flex";
        setTimeout(() => modal.style.opacity = "1", 10);
    },

    showBodyweightInfoModal: () => {
        let modal = document.getElementById("analytics-info-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "analytics-info-modal";
            modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box; backdrop-filter: blur(5px); flex-direction: column; opacity: 0; transition: opacity 0.3s;";
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div style="background: #1e1e1e; padding: 25px; border-radius: 12px; width: 100%; max-width: 400px; border-top: 5px solid #2ECC71; box-shadow: 0 10px 30px rgba(0,0,0,0.8); position: relative; box-sizing: border-box; text-align: center;">
                <h3 style="color: #2ECC71; margin-top: 0; font-size: 1.3em;">ℹ️ Co to jest Tonaż Ciała?</h3>
                <p style="color: #ddd; font-size: 0.95em; line-height: 1.6; margin-bottom: 25px; text-align: left;">
                    To szacowana objętość pracy wykonana przy użyciu masy własnego ciała.<br><br>
                    Aplikacja automatycznie przelicza Twoją wagę na realne obciążenie:<br>
                    • <strong>Podciąganie / Brzuszki:</strong> 100% wagi ciała<br>
                    • <strong>Pompki klasyczne:</strong> ok. 65% wagi ciała<br><br>
                    Dzięki temu ćwiczenia kalisteniczne są sprawiedliwie wliczane do Twojej całkowitej objętości treningowej!
                </p>
                <button onclick="document.getElementById('analytics-info-modal').style.opacity='0'; setTimeout(()=>document.getElementById('analytics-info-modal').style.display='none', 300);" style="background: #333; color: #fff; border: 1px solid #555; padding: 10px 30px; border-radius: 6px; font-weight: bold; font-size: 1em; cursor: pointer; display: inline-block;">Rozumiem</button>
            </div>
        `;
        modal.style.display = "flex";
        setTimeout(() => modal.style.opacity = "1", 10);
    },

    showInfoModal: (type, value) => {
        let modal = document.getElementById('analytics-info-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'analytics-info-modal';
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box; backdrop-filter: blur(5px); flex-direction: column; opacity: 0; transition: opacity 0.3s;';
            document.body.appendChild(modal);
        }

        const sex = readBodyProfile().sex;
        const gender = sex || 'male'; // BF% i FFMI pokazujemy tylko przy znanej płci
        let title, color, desc, ranges, minVal, maxVal;

        if (type === 'bf') {
            title = 'Szacunkowy BF% (Tkanka Tłuszczowa)';
            color = '#00BFFF';
            desc = 'BF% obrazuje jak dużą część Twojej masy stanowi tłuszcz. Utrzymanie go w ryzach zmniejsza ryzyko chorób układu krążenia i cukrzycy typu 2. Zbyt niski poziom również jest niezdrowy i może zaburzać gospodarkę hormonalną!';
            ranges = bfRanges(gender); // te same progi ACE co na karcie
            minVal = 2; maxVal = ranges[ranges.length-1].max;
        } else if (type === 'ffmi') {
            title = 'FFMI (Index Beztłuszczowy)';
            color = '#2ECC71';
            desc = 'FFMI to miernik czystej masy mięśniowej niezależny od wzrostu. Im wyższy, tym jesteś bardziej muskularny. Dobrze rozwinięta tkanka mięśniowa to pancerz ochronny stawów, lepszy metabolizm i wyższa wrażliwość insulinowa!';
            if (gender === 'male') {
                ranges = [
                    { label: 'Niska', max: 18, color: '#f1c40f' },
                    { label: 'Przeciętna', max: 20, color: '#3498db' },
                    { label: 'Dobra', max: 22, color: '#2ecc71' },
                    { label: 'Doskonała', max: 25, color: '#9b59b6' },
                    { label: 'Elita', max: 30, color: '#e74c3c' }
                ];
            } else {
                ranges = [
                    { label: 'Niska', max: 15, color: '#f1c40f' },
                    { label: 'Przeciętna', max: 17, color: '#3498db' },
                    { label: 'Dobra', max: 19, color: '#2ecc71' },
                    { label: 'Doskonała', max: 21, color: '#9b59b6' },
                    { label: 'Elita', max: 26, color: '#e74c3c' }
                ];
            }
            minVal = 13; maxVal = ranges[ranges.length-1].max;
        } else if (type === 'whr') {
            title = 'WHR (Talia do Bioder)';
            color = '#9B59B6';
            desc = 'WHR określa typ sylwetki (jabłko vs gruszka). Typ "jabłka" oznacza gromadzenie tłuszczu wokół narządów wewnętrznych (tłuszcz wisceralny), co drastycznie podnosi ryzyko zawałów, zatorów oraz zespołu metabolicznego!';
            ranges = whrRanges(sex); // te same progi WHO co na karcie; bez płci: null
            minVal = 0.6; maxVal = ranges ? ranges[ranges.length-1].max : 1;
        }

        if (!ranges) {
            // Płeć nieznana: zamiast norm innej płci prosimy o jej ustawienie.
            modal.innerHTML = `
                <div style="background: #1e1e1e; padding: 25px; border-radius: 12px; width: 100%; max-width: 400px; border-top: 5px solid ${color}; box-shadow: 0 10px 30px rgba(0,0,0,0.8); position: relative; box-sizing: border-box;">
                    <h3 style="color: ${color}; margin-top: 0; font-size: 1.4em;">${title}</h3>
                    <p style="color: #ddd; font-size: 0.95em; line-height: 1.5; margin-bottom: 15px;">${desc}</p>
                    <p id="analytics-info-nosex" style="color: #fff; font-weight: 600; margin-bottom: 20px;">Ustaw płeć w Pomiarach ciała, żeby ocenić ryzyko.</p>
                    <div style="text-align: center;">
                        <button onclick="document.getElementById('analytics-info-modal').style.opacity='0'; setTimeout(()=>document.getElementById('analytics-info-modal').style.display='none', 300);" style="background: #333; color: #fff; border: 1px solid #555; padding: 10px 25px; border-radius: 8px; cursor: pointer;">Zamknij</button>
                    </div>
                </div>
            `;
            modal.style.display = 'flex';
            setTimeout(() => modal.style.opacity = '1', 10);
            return;
        }

        // Generate bars
        let currentPos = minVal;
        const totalSpan = maxVal - minVal;
        let barsHtml = '';
        ranges.forEach(r => {
            const span = r.max - currentPos;
            const pct = (span / totalSpan) * 100;
            barsHtml += `<div style="width: ${pct}%; background: ${r.color}; height: 100%; border-right: 1px solid rgba(0,0,0,0.3);" title="${r.label}"></div>`;
            currentPos = r.max;
        });

        const pointerPct = Math.max(0, Math.min(100, ((value - minVal) / totalSpan) * 100));

        modal.innerHTML = `
            <div style="background: #1e1e1e; padding: 25px; border-radius: 12px; width: 100%; max-width: 400px; border-top: 5px solid ${color}; box-shadow: 0 10px 30px rgba(0,0,0,0.8); position: relative; box-sizing: border-box;">
                <h3 style="color: ${color}; margin-top: 0; font-size: 1.4em;">${title}</h3>
                <p style="color: #ddd; font-size: 0.95em; line-height: 1.5; margin-bottom: 25px;">${desc}</p>
                
                <div style="position: relative; height: 30px; margin-bottom: 30px;">
                    <!-- The Gauge -->
                    <div style="display: flex; height: 16px; border-radius: 8px; overflow: hidden; width: 100%; box-sizing: border-box; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);">
                        ${barsHtml}
                    </div>
                    <!-- Pointer -->
                    <div style="position: absolute; left: ${pointerPct}%; top: 12px; transform: translateX(-50%); text-align: center; z-index: 2;">
                        <div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 10px solid #fff; margin: 0 auto;"></div>
                        <strong style="color: #fff; background: #000; padding: 3px 8px; border-radius: 4px; display: inline-block; margin-top: 4px; font-size: 1.1em; border: 1px solid ${color};">${Number(value).toFixed(2)}</strong>
                    </div>
                </div>

                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; font-size: 0.85em; color: #888; margin-top: 15px; margin-bottom: 20px; line-height: 1.3;">
                    ${ranges.map(r => `<span style="color: ${r.color}; margin: 2px;">${r.label}</span>`).join('')}
                </div>

                <div style="text-align: center;">
                    <button onclick="document.getElementById('analytics-info-modal').style.opacity='0'; setTimeout(()=>document.getElementById('analytics-info-modal').style.display='none', 300);" style="background: #333; color: #fff; border: 1px solid #555; padding: 10px 30px; border-radius: 6px; font-weight: bold; font-size: 1em; cursor: pointer; display: inline-block;">Zamknij</button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        setTimeout(() => modal.style.opacity = '1', 10);
    }
};

window.AnalyticsUI = AnalyticsUI;
