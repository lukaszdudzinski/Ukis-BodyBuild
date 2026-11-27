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
            <div style="padding: 15px; background: rgba(17,17,24,0.85); backdrop-filter: blur(10px); display: flex; gap: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); position: sticky; top: 0; z-index: 10;">
                <button id="btn-tab-1" class="analytics-tab-btn active" onclick="window.AnalyticsUI.switchTab(1)" style="flex: 1; background: rgba(0, 191, 255, 0.15); border: 1px solid rgba(0, 191, 255, 0.3); color: #00BFFF; font-weight: 600; padding: 12px 4px; border-radius: 14px; font-size: 0.8em; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; box-sizing: border-box;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
                    <span style="white-space: nowrap;">Siła</span>
                </button>
                <button id="btn-tab-2" class="analytics-tab-btn" onclick="window.AnalyticsUI.switchTab(2)" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #8E8E93; padding: 12px 4px; border-radius: 14px; font-size: 0.8em; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; box-sizing: border-box; transition: all 0.2s;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    <span style="white-space: nowrap;">Sylwetka</span>
                </button>
                <button id="btn-tab-3" class="analytics-tab-btn" onclick="window.AnalyticsUI.switchTab(3)" style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #8E8E93; padding: 12px 4px; border-radius: 14px; font-size: 0.8em; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; box-sizing: border-box; transition: all 0.2s;">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"/><line x1="23" y1="13" x2="23" y2="11"/><polyline points="11 6 7 12 13 12 9 18"/></svg>
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
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(0, 191, 255, 0.3); padding: 15px; border-radius: 16px; text-align: center; backdrop-filter: blur(10px);">
                    <div style="font-size: 2em; color: #00BFFF; font-weight: 700; margin-bottom: 4px; line-height: 1;">${totalWorkouts}</div>
                    <div style="font-size: 0.8em; color: #8E8E93; text-transform: uppercase; font-weight: 600;">Treningów</div>
                </div>
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255, 152, 0, 0.3); padding: 15px; border-radius: 16px; text-align: center; backdrop-filter: blur(10px);">
                    <div style="font-size: 1.8em; color: #FF9800; font-weight: 700; margin-bottom: 4px; line-height: 1;">${totalCalories > 0 ? totalCalories.toLocaleString("pl-PL") : "0"} <span style="font-size: 0.55em;">kcal</span></div>
                    <div style="font-size: 0.8em; color: #8E8E93; text-transform: uppercase; font-weight: 600;">Spalone</div>
                </div>
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(233, 30, 99, 0.3); padding: 15px; border-radius: 16px; text-align: center; backdrop-filter: blur(10px);">
                    <div style="font-size: 1.4em; color: #E91E63; font-weight: 700; margin-bottom: 4px; line-height: 1.2;">${Math.round(totalVolMachine)} <span style="font-size: 0.6em;">kg</span></div>
                    <div style="font-size: 0.75em; color: #8E8E93; text-transform: uppercase; font-weight: 600;">Tonaż Żelastwa</div>
                </div>
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(46, 204, 113, 0.3); padding: 15px; border-radius: 16px; text-align: center; backdrop-filter: blur(10px);">
                    <div style="font-size: 1.4em; color: #2ECC71; font-weight: 700; margin-bottom: 4px; line-height: 1.2;">${Math.round(totalVolBody)} <span style="font-size: 0.6em;">kg</span></div>
                    <div style="font-size: 0.75em; color: #8E8E93; text-transform: uppercase; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;">
                        Tonaż Ciała
                        <button type="button" onclick="window.AnalyticsUI.showBodyweightInfoModal()" style="background: rgba(255,255,255,0.1); border: none; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer;" title="Informacja o tonażu ciała">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <h4 style="color: #00BFFF; border-bottom: 1px solid rgba(0,191,255,0.2); padding-bottom: 8px; margin-bottom: 20px; font-weight: 600;">Zaawansowana Analityka (PRO)</h4>
            
            <div style="background: rgba(0, 191, 255, 0.05); border: 1px solid rgba(0, 191, 255, 0.2); padding: 20px; border-radius: 20px; margin-bottom: 25px;">
                <p style="margin: 0 0 12px 0; font-size: 1.05em; color: #fff; line-height: 1.5;">W tym miesiącu: <strong style="color: #00BFFF;">${thisMonthWorkouts.length}</strong> aktywności, w tym <strong style="color: #00BFFF;">${thisMonthVolume > 0 ? (thisMonthVolume >= 1000 ? (thisMonthVolume/1000).toFixed(1) + " t" : thisMonthVolume + " kg") : "0 kg"}</strong> tonażu siłowego!</p>
                ${thisMonthWorkouts.length >= 8 
                    ? '<p style="color: #2ECC71; margin: 0; font-weight: 600; display: flex; align-items: center; gap: 8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Konsekwencja mistrza! Świetna robota!</p>' 
                    : '<p style="color: #00BFFF; margin: 0; display: flex; align-items: center; gap: 8px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/></svg> Każda sesja przybliża Cię do życiowej formy. Nie przestawaj!</p>'}
            </div>
            
            <h5 style="color: #FFD700; margin-top: 20px; margin-bottom: 12px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                Ostatnie 10 sesji treningowych
            </h5>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px;">
                ${workoutsWithVolume.slice(0,10).reverse().map(w => {
                    const dateStr = new Date(w.date).toLocaleDateString('pl-PL', {weekday:'short', day:'numeric', month:'short'});
                    const isCardioOrClasses = (w.type === "cardio" || w.type === "classes") || (w.volume === 0 && (w.calories > 0 || w.duration_seconds > 0));
                    
                    let barColor = "#FF9800";
                    let displayVal = "";
                    let typeBadge = "";
                    let typeIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>';

                    if (isCardioOrClasses) {
                        const isClasses = w.type === "classes" || (!w.type && w.volume === 0);
                        typeBadge = isClasses ? "Zajęcia" : "Cardio";
                        typeIcon = isClasses ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>';
                        barColor = isClasses ? "#FF5722" : "#00BFFF";
                        
                        displayVal = w.calories > 0 ? `${w.calories} kcal` : (w.durationMinutes ? `${w.durationMinutes} min` : `Aktywność`);
                        if (w.hr) displayVal += ` <span style="font-size: 0.85em; opacity: 0.85;">(HR: ${w.hr})</span>`;
                    } else {
                        typeBadge = "Siłowe";
                        const barPct = Math.min(100, Math.max(8, Math.round((w.volume / maxStrengthVol) * 100)));
                        barColor = barPct >= 80 ? "#2ECC71" : (barPct >= 50 ? "#FFD700" : "#FF9800");
                        displayVal = w.volume >= 1000 ? (w.volume/1000).toFixed(1) + " t" : Math.round(w.volume) + " kg";
                        if (w.calories > 0) displayVal += ` <span style="font-size: 0.8em; opacity: 0.85;">(${w.calories} kcal)</span>`;
                    }

                    const workoutNameDisplay = w.name ? w.name : typeBadge;

                    return `
                    <div class="glass-card" style="display: flex; align-items: center; padding: 14px;">
                        <div style="width: 48px; height: 48px; border-radius: 14px; background: ${barColor}15; border: 1px solid ${barColor}40; display: flex; align-items: center; justify-content: center; color: ${barColor}; flex-shrink: 0;">
                            ${typeIcon}
                        </div>
                        <div style="flex: 1; margin-left: 14px; overflow: hidden;">
                            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
                                <span style="font-weight: 600; font-size: 0.95em; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%;">${workoutNameDisplay}</span>
                                <span style="font-size: 0.75em; color: #8E8E93;">${dateStr}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 0.8em; color: #8E8E93; text-transform: uppercase;">${typeBadge}</span>
                                <span style="font-weight: 700; font-size: 1.05em; color: ${barColor};">${displayVal}</span>
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

        const recordsList = Object.values(exerciseMaxMap).sort((a,b) => b.max1Rm - a.max1Rm); // Sort by 1RM instead of just weight for better PR display

        if (recordsList.length > 0) {
            html += `
                <div style="margin-top: 30px; margin-bottom: 25px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,215,0,0.3); padding-bottom: 8px; margin-bottom: 15px;">
                        <h4 style="color: #FFD700; margin: 0; display: flex; align-items: center; gap: 8px; font-size: 1.1em; font-weight: 600;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                            Twoje Rekordy Siłowe
                        </h4>
                        <button type="button" onclick="window.AnalyticsUI.show1RmInfoModal()" style="background: rgba(255,215,0,0.15); border: 1px solid rgba(255,215,0,0.3); color: #FFD700; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;" title="Czym jest 1RM?">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </button>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        ${recordsList.slice(0, 4).map(r => `
                            <div class="glass-card" style="padding: 14px; display: flex; flex-direction: column; justify-content: space-between; border-color: rgba(255,215,0,0.4);">
                                <div style="font-size: 0.85em; color: #fff; font-weight: 600; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${r.name}">${r.name}</div>
                                <div>
                                    <div style="font-size: 1.4em; color: #FFD700; font-weight: 700; line-height: 1.1; margin-bottom: 6px;">${r.actualWeight} <span style="font-size: 0.65em; color: #8E8E93; font-weight: normal;">kg</span> <span style="font-size: 0.7em; color: #8E8E93; font-weight: normal;">x ${r.reps}</span></div>
                                    <div style="font-size: 0.75em; color: #8E8E93; margin-bottom: 8px;">${new Date(r.date).toLocaleDateString("pl-PL", {day:"numeric", month:"short"})}</div>
                                    <div style="font-size: 0.75em; color: #00BFFF; display: flex; align-items: center; gap: 4px;">
                                        <span style="background: rgba(0, 191, 255, 0.1); padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(0, 191, 255, 0.2); display: flex; align-items: center; gap: 4px;">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                            1RM: ~${r.max1Rm.toFixed(1)} kg
                                        </span>
                                    </div>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                    <div style="text-align: center; margin-top: 15px;">
                        <button type="button" onclick="window.AnalyticsUI.shareRecords()" style="background: rgba(255,215,0,0.15); color: #FFD700; border: 1px solid rgba(255,215,0,0.3); padding: 12px 18px; border-radius: 12px; font-size: 0.9em; font-weight: 600; cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                            Udostępnij swoje rekordy
                        </button>
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
                <div style="margin-top: 35px; margin-bottom: 25px;">
                    <h4 style="color: #2ECC71; border-bottom: 1px solid rgba(46,204,113,0.3); padding-bottom: 8px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; font-size: 1.1em; font-weight: 600;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        Śledzenie Progresu (Wykres 1RM)
                    </h4>
                    <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(10px);">
                        <select id="analytics-exercise-select" onchange="window.AnalyticsUI.renderExerciseChart(this.value)" style="width: 100%; padding: 14px; border-radius: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(46,204,113,0.3); color: #fff; font-size: 0.95em; margin-bottom: 15px; outline: none;">
                            <option value="">-- Wybierz ćwiczenie --</option>
                            ${exListOptions.map(name => `<option value="${name}">${name}</option>`).join('')}
                        </select>
                        <div id="analytics-exercise-chart-container" style="min-height: 180px; display: flex; align-items: center; justify-content: center; color: #8E8E93; font-size: 0.9em; border-radius: 12px; background: rgba(0,0,0,0.1);">Wybierz ćwiczenie z listy.</div>
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
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(0, 191, 255, 0.3); padding: 20px; border-radius: 16px; margin-bottom: 16px; position: relative; backdrop-filter: blur(10px);">
                    <strong style="color: #00BFFF; font-size: 1.1em; font-weight: 600;">Szacunkowy BF%</strong>
                    <button onclick="window.AnalyticsUI.showInfoModal('bf', ${bf})" style="position: absolute; right: 20px; top: 20px; background: rgba(0, 191, 255, 0.1); border: none; color: #00BFFF; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </button>
                    <div style="font-size: 2.2em; font-weight: 700; margin: 12px 0; color: #fff;">${bf.toFixed(1)} <span style="font-size: 0.5em; font-weight: normal; color: #8E8E93;">%</span></div>
                    <p style="margin: 0; font-size: 0.9em; font-weight: 500; color: #00BFFF;">${bfText}</p>
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
                    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(46, 204, 113, 0.3); padding: 20px; border-radius: 16px; margin-bottom: 16px; position: relative; backdrop-filter: blur(10px);">
                        <strong style="color: #2ECC71; font-size: 1.1em; font-weight: 600;">FFMI (Index Beztłuszczowy)</strong>
                        <button onclick="window.AnalyticsUI.showInfoModal('ffmi', ${normalizedFfmi})" style="position: absolute; right: 20px; top: 20px; background: rgba(46, 204, 113, 0.1); border: none; color: #2ECC71; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </button>
                        <div style="font-size: 2.2em; font-weight: 700; margin: 12px 0; color: #fff;">${normalizedFfmi.toFixed(1)}</div>
                        <p style="margin: 0; font-size: 0.9em; font-weight: 500; color: #2ECC71;">${ffmiText}</p>
                    </div>
                `;
            }
        } else {
            bfHtml = `<div style="background: rgba(255, 68, 68, 0.05); border: 1px solid rgba(255, 68, 68, 0.3); border-radius: 12px; padding: 15px; margin-bottom: 20px; text-align: center;"><strong style="color: #ff4444; font-size: 1.1em;">Brak danych BF%</strong><p style="margin: 8px 0 0 0; font-size: 0.9em; color: #8E8E93;">Uzupełnij: ${missingForBF.join(", ")}.</p></div>`;
        }

        if (body.whr !== null) {
            const whr = body.whr;
            const whrText = body.whrCategory ? body.whrCategory.text : 'Ustaw płeć w Pomiarach ciała, żeby ocenić ryzyko.';

            whrHtml = `
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(155, 89, 182, 0.3); padding: 20px; border-radius: 16px; margin-bottom: 25px; position: relative; backdrop-filter: blur(10px);">
                    <strong style="color: #9B59B6; font-size: 1.1em; font-weight: 600;">WHR (Talia-Biodra)</strong>
                    <button onclick="window.AnalyticsUI.showInfoModal('whr', ${whr})" style="position: absolute; right: 20px; top: 20px; background: rgba(155, 89, 182, 0.1); border: none; color: #9B59B6; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </button>
                    <div style="font-size: 2.2em; font-weight: 700; margin: 12px 0; color: #fff;">${whr.toFixed(2)}</div>
                    <p style="margin: 0; font-size: 0.9em; font-weight: 500; color: #9B59B6;">${whrText}</p>
                </div>
            `;
        }

        let trendsHtml = '';
        if (sortedMeasurements.length > 1) {
            trendsHtml += '<h5 style="color: #FF9800; margin-top: 25px; margin-bottom: 15px; font-weight: 600; font-size: 1.1em;">Zmiany (od pierwszego wpisu)</h5>';
            const dict = { weight: 'Waga', chest: 'Klatka', waist: 'Talia', hips: 'Biodra', thigh: 'Udo', biceps: 'Biceps', neck: 'Szyja' };
            let diffs = '';
            for (const [key, label] of Object.entries(dict)) {
                if (last[key] && first[key]) {
                    const v = last[key] - first[key];
                    if (v !== 0) {
                        const sign = v > 0 ? '+' : '';
                        const color = v > 0 ? (key==='waist' ? '#FF453A' : '#2ECC71') : (key==='waist' ? '#2ECC71' : '#FF453A');
                        const iconSvg = v > 0 
                            ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`
                            : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/></svg>`;
                        diffs += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; font-size: 0.95em;"><span style="color: #8E8E93;">${label}</span><strong style="color: ${color}; display: flex; align-items: center; gap: 4px;">${iconSvg} ${sign}${v.toFixed(1)} ${key==='weight'?'kg':'cm'}</strong></div>`;
                    }
                }
            }
            if(diffs) trendsHtml += `<div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 16px; backdrop-filter: blur(10px);">${diffs}</div>`;
        }
        
        return bfHtml + ffmiHtml + whrHtml + trendsHtml;
    },

    buildRecoveryTab: (trainings) => {
        if (trainings.length === 0) return '<p style="color: #8E8E93; text-align: center;">Brak danych treningowych do analizy regeneracji.</p>';
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
            const bg = m.status === 'red' ? 'rgba(255, 69, 58, 0.1)' : 'rgba(46, 204, 113, 0.1)';
            const border = m.status === 'red' ? 'rgba(255, 69, 58, 0.3)' : 'rgba(46, 204, 113, 0.3)';
            const color = m.status === 'red' ? '#FF453A' : '#2ECC71';
            const iconSvg = m.status === 'red' 
                ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' 
                : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
            const label = m.status === 'red' ? 'Zmęczone' : 'Gotowe';

            atlasCards += `
                <div style="background: ${bg}; border: 1px solid ${border}; padding: 16px 12px; border-radius: 16px; text-align: center; display: flex; flex-direction: column; justify-content: center; backdrop-filter: blur(10px);">
                    <strong style="color: #fff; font-size: 0.9em; margin-bottom: 8px;">${m.name}</strong>
                    <span style="font-size: 0.8em; color: ${color}; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;">
                        ${iconSvg} ${label}
                    </span>
                </div>
            `;
        });

        return `
            <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 25px; backdrop-filter: blur(10px);">
                <p style="margin: 0 0 20px 0; font-size: 0.9em; color: #8E8E93; line-height: 1.5;">Analiza na podstawie treningów z ostatnich 48 godzin. Partie oznaczone na czerwono zaangażowano niedawno i potrzebują czasu na regenerację. Unikaj obciążania ich dzisiaj!</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
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
