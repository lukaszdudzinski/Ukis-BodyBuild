import { DatabaseManager } from '../db/DatabaseManager.js';
import { ShareUtils } from '../../utils/ShareUtils.js';
import { readBodyProfile } from '../diet/kcalGoal.js';
import { bodySummary, bfRanges, whrRanges } from '../body/bodyMetrics.js';
import { canonicalExerciseName } from '../../data/ExerciseCatalog.js';
import { atlasMuscles, bodyweightFactor } from '../../data/exerciseTraits.js';
import { ikona } from '../wyglad/ikony.js';

// Encje HTML dla nazw treningów i ćwiczeń wstawianych do szablonów (mogą pochodzić z importu).
const esc = (s) => String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

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
        
        container.innerHTML = '<p class="z-sub an-pusto">Ładowanie danych...</p>';

        try {
            const trainings = await DatabaseManager.getTrainings();
            const measurements = await DatabaseManager.getMeasurements();
            
            AnalyticsUI.cachedTrainings = trainings;
            AnalyticsUI.cachedMeasurements = measurements;
            
            AnalyticsUI.renderAnalytics(container, trainings, measurements);
        } catch (err) {
            console.error("Error loading analytics:", err);
            container.innerHTML = '<p class="an-blad an-pusto">Błąd ładowania statystyk.</p>';
        }
    },

    renderAnalytics: (container, trainings, measurements) => {
        AnalyticsUI.renderNewAnalytics(container, trainings, measurements);
    },

    renderNewAnalytics: (container, trainings, measurements) => {
        const zakladka = (n, etykieta) => `<button type="button" role="tab" id="btn-tab-${n}" class="z-tab analytics-tab-btn${n === 1 ? ' z-on' : ''}" aria-selected="${n === 1}" aria-controls="analytics-tab-${n}" tabindex="${n === 1 ? 0 : -1}" onclick="window.AnalyticsUI.switchTab(${n})">${etykieta}</button>`;
        container.innerHTML = `
            <div class="z-tabs an-tabs" role="tablist" aria-label="Rodzaj analizy" onkeydown="window.AnalyticsUI.tabKey(event)">
                ${zakladka(1, 'Siła')}
                ${zakladka(2, 'Sylwetka')}
                ${zakladka(3, 'Regeneracja')}
            </div>

            <div id="analytics-tab-1" class="analytics-tab-content an-panel" role="tabpanel" aria-labelledby="btn-tab-1">
                ${AnalyticsUI.buildStrengthTab(trainings, measurements)}
            </div>
            <div id="analytics-tab-2" class="analytics-tab-content an-panel" role="tabpanel" aria-labelledby="btn-tab-2" hidden>
                ${AnalyticsUI.buildBodyTab(trainings, measurements)}
            </div>
            <div id="analytics-tab-3" class="analytics-tab-content an-panel" role="tabpanel" aria-labelledby="btn-tab-3" hidden>
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
        document.querySelectorAll('#analytics-content .analytics-tab-btn').forEach((btn, i) => {
            const aktywna = i + 1 === index;
            btn.classList.toggle('z-on', aktywna);
            btn.setAttribute('aria-selected', String(aktywna));
            btn.tabIndex = aktywna ? 0 : -1;
        });
        document.querySelectorAll('#analytics-content .analytics-tab-content').forEach((content, i) => {
            content.hidden = i + 1 !== index;
        });
    },

    // Strzałki, Home i End między zakładkami (wzorzec WAI-ARIA tablist).
    tabKey: (e) => {
        const taby = [...document.querySelectorAll('#analytics-content .analytics-tab-btn')];
        const biezacy = taby.indexOf(document.activeElement);
        if (biezacy < 0) return;
        let cel = null;
        if (e.key === 'ArrowRight') cel = (biezacy + 1) % taby.length;
        else if (e.key === 'ArrowLeft') cel = (biezacy - 1 + taby.length) % taby.length;
        else if (e.key === 'Home') cel = 0;
        else if (e.key === 'End') cel = taby.length - 1;
        if (cel === null) return;
        e.preventDefault();
        AnalyticsUI.switchTab(cel + 1);
        taby[cel].focus();
    },

    buildStrengthTab: (trainings, measurements) => {
        let html = '';
        if (trainings.length === 0) {
            return '<div class="z-card"><p class="z-sub an-pusto">Za mało danych treningowych do przeprowadzenia analizy.</p></div>';
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

        const miesiacTonaz = thisMonthVolume > 0 ? (thisMonthVolume >= 1000 ? (thisMonthVolume/1000).toFixed(1) + " t" : thisMonthVolume + " kg") : "0 kg";
        const ostatnie = workoutsWithVolume.slice(0, 10).reverse();

        // Rodzaj sesji: siłowa (seria 1), cardio (seria 2), zajęcia (seria 3); tak samo słupki, legenda i ikony wierszy.
        const sesje = ostatnie.map(w => {
            const dateStr = new Date(w.date).toLocaleDateString('pl-PL', {weekday:'short', day:'numeric', month:'short'});
            const isCardioOrClasses = (w.type === "cardio" || w.type === "classes") || (w.volume === 0 && (w.calories > 0 || w.duration_seconds > 0));
            let rodzaj = 'silowe', typeBadge = 'Siłowe', pct, displayVal;
            if (isCardioOrClasses) {
                const isClasses = w.type === "classes" || (!w.type && w.volume === 0);
                rodzaj = isClasses ? 'zajecia' : 'cardio';
                typeBadge = isClasses ? "Zajęcia" : "Cardio";
                pct = w.calories > 0 ? Math.min(100, Math.max(8, Math.round((w.calories / maxCardioCalories) * 100))) : 8;
                displayVal = w.calories > 0 ? `${w.calories} kcal` : (w.durationMinutes ? `${w.durationMinutes} min` : `Aktywność`);
                if (w.hr) displayVal += ` <span class="z-mut">(HR: ${w.hr})</span>`;
            } else {
                pct = Math.min(100, Math.max(8, Math.round((w.volume / maxStrengthVol) * 100)));
                displayVal = w.volume >= 1000 ? (w.volume/1000).toFixed(1) + " t" : Math.round(w.volume) + " kg";
                if (w.calories > 0) displayVal += ` <span class="z-mut">(${w.calories} kcal)</span>`;
            }
            return { w, dateStr, rodzaj, typeBadge, pct, displayVal, nazwa: w.name ? w.name : typeBadge };
        });
        const seria = { silowe: '', cardio: ' z-s2', zajecia: ' z-s3' };
        const ikonaRodzaju = { silowe: 'dumbbell', cardio: 'line-chart', zajecia: 'users' };

        html += `
            <div class="an-staty">
                <div class="z-card z-stat an-stat">
                    <div class="z-big">${totalWorkouts}</div>
                    <div class="z-mut">Treningów</div>
                </div>
                <div class="z-card z-stat an-stat">
                    <div class="z-big">${totalCalories > 0 ? totalCalories.toLocaleString("pl-PL") : "0"} <span class="an-jedn">kcal</span></div>
                    <div class="z-mut">Spalone</div>
                </div>
                <div class="z-card z-stat an-stat">
                    <div class="z-big z-hi">${Math.round(totalVolMachine)} <span class="an-jedn">kg</span></div>
                    <div class="z-mut">Tonaż żelastwa</div>
                </div>
                <div class="z-card z-stat an-stat">
                    <div class="z-big">${Math.round(totalVolBody)} <span class="an-jedn">kg</span></div>
                    <div class="z-mut">Tonaż ciała</div>
                    <button type="button" class="an-info" aria-label="Informacja o tonażu ciała" onclick="window.AnalyticsUI.showBodyweightInfoModal(this)">${ikona('info', 16)}</button>
                </div>
            </div>

            <div class="z-card an-miesiac">
                <p class="an-miesiac-tekst">W tym miesiącu: <strong class="z-hi">${thisMonthWorkouts.length}</strong> aktywności, w tym <strong class="z-hi">${miesiacTonaz}</strong> tonażu siłowego!</p>
                ${thisMonthWorkouts.length >= 8
                    ? `<p class="z-sub an-motyw">${ikona('check', 18)} Konsekwencja mistrza! Świetna robota!</p>`
                    : `<p class="z-sub an-motyw">${ikona('arrow-up', 18)} Każda sesja przybliża Cię do życiowej formy. Nie przestawaj!</p>`}
            </div>

            <h3 class="z-hd an-h">Ostatnie ${sesje.length} sesji</h3>
            <div class="z-card an-sesje">
                <div class="z-chart-bars an-slupki" role="img" aria-label="Ostatnie ${sesje.length} sesji treningowych od najstarszej: słupki pokazują tonaż w treningach siłowych albo spalone kalorie w cardio i zajęciach. Szczegóły w liście poniżej.">
                    ${sesje.map(s => `<div class="z-chart-bar${seria[s.rodzaj]}" style="height: ${s.pct}%" title="${esc(s.nazwa)}"></div>`).join('')}
                </div>
                <div class="z-chart-legend an-legenda">
                    <span class="z-chart-key">Siłowe</span>
                    <span class="z-chart-key z-s2">Cardio</span>
                    <span class="z-chart-key z-s3">Zajęcia</span>
                </div>
            </div>
            <div class="z-card z-list an-lista">
                ${sesje.map(s => `
                    <div class="an-sesja" data-rodzaj="${s.rodzaj}">
                        <span class="an-ikona" aria-hidden="true">${ikona(ikonaRodzaju[s.rodzaj], 20)}</span>
                        <div class="an-sesja-tekst">
                            <div class="an-sesja-gora">
                                <span class="an-sesja-nazwa">${esc(s.nazwa)}</span>
                                <span class="z-mut">${s.dateStr}</span>
                            </div>
                            <div class="an-sesja-dol">
                                <span class="z-mut an-rodzaj">${s.typeBadge}</span>
                                <span class="an-wartosc">${s.displayVal}</span>
                            </div>
                        </div>
                    </div>`).join('')}
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
                <div class="an-sekcja-gora">
                    <h3 class="z-hd an-h">Twoje rekordy siłowe</h3>
                    <button type="button" class="z-chip" onclick="window.AnalyticsUI.show1RmInfoModal(this)">Czym jest 1RM?</button>
                </div>
                <div class="z-card z-list an-lista">
                    ${recordsList.slice(0, 4).map(r => `
                        <div class="an-rekord">
                            <div class="an-rek-opis">
                                <div class="an-rek-nazwa" title="${esc(r.name)}">${esc(r.name)}</div>
                                <div class="z-mut">${r.actualWeight} kg × ${r.reps} · ${new Date(r.date).toLocaleDateString("pl-PL", {day:"numeric", month:"short"})}</div>
                            </div>
                            <div class="an-rm"><span class="z-mut">1RM:</span> <span class="an-rm-val">~${r.max1Rm.toFixed(1)} kg</span></div>
                        </div>
                    `).join("")}
                </div>
                <button type="button" class="z-ghost an-udostepnij" onclick="window.AnalyticsUI.shareRecords()">${ikona('share', 18)} Udostępnij rekordy</button>
            `;
        }

        // Add Progress Chart
        const uniqueExNames = new Set();
        trainings.forEach(t => (t.exercises || []).forEach(ex => { if(ex.name && ex.name.trim()) uniqueExNames.add(canonicalExerciseName(ex.name)); }));
        const exListOptions = Array.from(uniqueExNames).sort();
        
        if (exListOptions.length > 0) {
            html += `
                <div class="z-card an-progres">
                    <label class="z-lab" for="analytics-exercise-select">Śledzenie progresu: wybierz ćwiczenie</label>
                    <select id="analytics-exercise-select" class="z-in" onchange="window.AnalyticsUI.renderExerciseChart(this.value)">
                        <option value="">-- Wybierz ćwiczenie --</option>
                        ${exListOptions.map(name => `<option value="${esc(name)}">${esc(name)}</option>`).join('')}
                    </select>
                    <div id="analytics-exercise-chart-container" class="an-wykres"><p class="z-mut an-pusto">Wybierz ćwiczenie z listy.</p></div>
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
            container.innerHTML = '<p class="z-mut an-pusto">Wybierz ćwiczenie z listy powyżej, aby zobaczyć wykres swojego progresu na przestrzeni czasu.</p>';
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
            container.innerHTML = '<p class="an-blad an-pusto">Brak wystarczających danych z poprawnym ciężarem do wygenerowania wykresu dla tego ćwiczenia.</p>';
            return;
        }

        // Sort ascending by date
        historyData.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Take last 12 entries so it fits well on mobile
        const chartData = historyData.slice(-12);
        const n = chartData.length;

        // Wykres liniowy SVG: kolory z klas z-chart-* i tokenów (zmieniają się razem z motywem), bez kolorów w kodzie.
        const W = 300, H = 190, MARGINES = 22, GORA = 28, DOL = H - 46;
        const ciezary = chartData.map(d => d.maxWeight);
        const min = Math.min(...ciezary), max = Math.max(...ciezary);
        const luz = (max - min) * 0.2 || max * 0.1;
        const lo = min - luz, hi = max + luz;
        const krok = n > 1 ? (W - 2 * MARGINES) / (n - 1) : 0;
        const dataKrotka = (dt) => { const x = new Date(dt); return `${String(x.getDate()).padStart(2, '0')}.${String(x.getMonth() + 1).padStart(2, '0')}`; };
        const punkty = chartData.map((d, i) => ({
            ...d,
            opis: `${dataKrotka(d.date)}: ${d.maxWeight} kg × ${d.reps} powt.`,
            x: n > 1 ? MARGINES + i * krok : W / 2,
            y: DOL - ((d.maxWeight - lo) / (hi - lo)) * (DOL - GORA),
        }));
        const fmt = (v) => Math.round(v * 10) / 10;
        const linia = punkty.map((p, i) => `${i ? 'L' : 'M'}${fmt(p.x)} ${fmt(p.y)}`).join(' ');
        const pole = `${linia} L${fmt(punkty[n - 1].x)} ${DOL} L${fmt(punkty[0].x)} ${DOL} Z`;
        // Etykiety: co druga wartość przy gęstym wykresie (zawsze ostatnia), daty tak, by nie nachodziły.
        const coWartosc = n > 8 ? 2 : 1;
        const coData = krok ? Math.max(1, Math.ceil(44 / krok)) : 1;
        const opis = `Wykres postępu: ${exerciseName}. ${n} ${n === 1 ? 'sesja' : 'sesji'}, najcięższa seria dnia od ${chartData[0].maxWeight} kg do ${chartData[n - 1].maxWeight} kg, rekord ${max} kg.`;

        container.innerHTML = `
            <svg class="z-chart an-linia" viewBox="0 0 ${W} ${H}" role="group" aria-label="${esc(opis)}" focusable="false">
                <defs>
                    <linearGradient id="an-pole" class="z-chart-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0"/><stop offset="1"/></linearGradient>
                </defs>
                <line class="an-os" x1="${MARGINES - 8}" x2="${W - MARGINES + 8}" y1="${DOL}" y2="${DOL}"/>
                ${n > 1 ? `<path d="${pole}" fill="url(#an-pole)" stroke="none"/>` : ''}
                <path class="z-chart-line" d="${linia}"/>
                ${punkty.map((p, i) => `
                    <g class="an-pkt" tabindex="0" role="img" aria-label="${esc(p.opis)}" data-opis="${esc(p.opis)}">
                        <title>${esc(p.opis)}</title>
                        <circle class="an-trafienie" cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="14"/>
                        <circle class="an-punkt" cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="3.5"/>
                    </g>
                    ${(n - 1 - i) % coWartosc === 0 ? `<text class="an-wart" x="${fmt(p.x)}" y="${fmt(p.y - 9)}" text-anchor="middle">${p.maxWeight}</text>` : ''}
                    <text class="z-chart-axis" x="${fmt(p.x)}" y="${DOL + 16}" text-anchor="middle">x${p.reps}</text>
                    ${(n - 1 - i) % coData === 0 ? `<text class="z-chart-axis" x="${fmt(p.x)}" y="${H - 6}" text-anchor="middle">${esc(new Date(p.date).toLocaleDateString('pl-PL', {day:'numeric', month:'short'}))}</text>` : ''}
                `).join('')}
            </svg>
            <p class="an-odczyt" aria-live="polite">${esc(punkty[n - 1].opis)}</p>
        `;
        // Każdy punkt (dotyk, klik, fokus z klawiatury) pokazuje swoją datę, ciężar i powtórzenia pod wykresem.
        const odczyt = container.querySelector('.an-odczyt');
        container.querySelectorAll('.an-pkt').forEach(g => {
            const pokaz = () => { odczyt.textContent = g.dataset.opis; };
            g.addEventListener('click', pokaz);
            g.addEventListener('focus', pokaz);
        });
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

    
    
    // Okno objaśnienia z komponentów z-dialog (role="dialog", Escape, klik w tło, powrót fokusu).
    // `opener`: przycisk, który otworzył okno (Safari nie ustawia fokusu po kliknięciu przycisku).
    _pokazOkno: (tytul, trescHtml, etykietaPrzycisku, opener) => {
        const stare = document.getElementById('analytics-info-modal');
        if (stare) stare.remove();
        const poprzedni = opener || document.activeElement;
        const scrim = document.createElement('div');
        scrim.id = 'analytics-info-modal';
        scrim.className = 'z-dialog-scrim';
        scrim.innerHTML = `
            <div class="z-dialog an-okno" role="dialog" aria-modal="true" aria-labelledby="analytics-okno-tytul">
                <h2 id="analytics-okno-tytul" class="z-hd">${esc(tytul)}</h2>
                <div class="an-okno-tresc">${trescHtml}</div>
                <div class="z-dialog-actions">
                    <button type="button" class="z-btn an-okno-ok">${esc(etykietaPrzycisku)}</button>
                </div>
            </div>
        `;
        const przycisk = scrim.querySelector('.an-okno-ok');
        const koniec = () => {
            document.removeEventListener('keydown', klawisz, true);
            scrim.remove();
            if (poprzedni && typeof poprzedni.focus === 'function' && document.contains(poprzedni)) poprzedni.focus();
        };
        const klawisz = (e) => {
            if (e.key === 'Escape') { e.preventDefault(); koniec(); }
            else if (e.key === 'Tab') { e.preventDefault(); przycisk.focus(); } // jedyna kontrolka w oknie
        };
        przycisk.addEventListener('click', koniec);
        scrim.addEventListener('click', (e) => { if (e.target === scrim) koniec(); });
        document.addEventListener('keydown', klawisz, true);
        document.body.append(scrim);
        przycisk.focus();
    },

    show1RmInfoModal: (opener) => {
        AnalyticsUI._pokazOkno('Czym jest 1RM (One Repetition Max)?', `
            <p>
                <strong>1RM</strong> to wskaźnik oznaczający <em>Maksimum Jednego Powtórzenia</em> – czyli największy możliwy ciężar, jaki jesteś w stanie podnieść w danym ćwiczeniu dokładnie <strong>jeden raz</strong> z prawidłową techniką.
            </p>
            <p class="an-okno-nota">
                <strong>Dlaczego to szacujemy, a nie sprawdzamy na żywo?</strong><br>
                Próby podnoszenia 100% maksa na 1 powtórzenie niosą ze sobą ogromne ryzyko kontuzji stawów, ścięgien i kręgosłupa. Aplikacja bezpiecznie oblicza Twój teoretyczny rekord ze zwykłych serii roboczych (np. seria 80 kg × 8 powtórzeń daje szacowany max ok. 101 kg).
            </p>
            <p>
                <strong>Jak to wykorzystać w treningu?</strong><br>
                • <strong>Budowanie masy mięśniowej:</strong> trenuj na <strong>70–80%</strong> swojego 1RM (8–12 powtórzeń).<br>
                • <strong>Budowanie czystej siły:</strong> trenuj na <strong>80–90%</strong> swojego 1RM (3–5 powtórzeń).
            </p>
        `, 'Wszystko jasne!', opener);
    },

    showBodyweightInfoModal: (opener) => {
        AnalyticsUI._pokazOkno('Co to jest tonaż ciała?', `
            <p>
                To szacowana objętość pracy wykonana przy użyciu masy własnego ciała.
            </p>
            <p>
                Aplikacja automatycznie przelicza Twoją wagę na realne obciążenie:<br>
                • <strong>Podciąganie / Brzuszki:</strong> 100% wagi ciała<br>
                • <strong>Pompki klasyczne:</strong> ok. 65% wagi ciała
            </p>
            <p>
                Dzięki temu ćwiczenia kalisteniczne są sprawiedliwie wliczane do Twojej całkowitej objętości treningowej!
            </p>
        `, 'Rozumiem', opener);
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
