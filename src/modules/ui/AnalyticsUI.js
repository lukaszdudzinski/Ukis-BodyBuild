// wyglad: zar
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
        
        // Odczyt punktu wykresu BF% (dotyk, klik, fokus): jedna para obsług na kontenerze, zastępowana przy każdym renderze.
        const pokazBf = (e) => {
            const g = e.target.closest && e.target.closest('.an-bf-wykres .an-pkt');
            const odczyt = g && g.closest('.an-bf-wykres').querySelector('.an-odczyt');
            if (odczyt) odczyt.textContent = g.dataset.opis;
        };
        ['click', 'focusin'].forEach(typ => {
            if (AnalyticsUI._pokazBf) container.removeEventListener(typ, AnalyticsUI._pokazBf);
        });
        AnalyticsUI._pokazBf = pokazBf;
        container.addEventListener('click', pokazBf);
        container.addEventListener('focusin', pokazBf);

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
        // Dane do przycisku „Udostępnij progres” w zakładce Sylwetka.
        AnalyticsUI.cachedProgress = { monthWorkouts: thisMonthWorkouts.length, monthVolume: Math.round(thisMonthVolume), totalVolume: Math.round(totalVolume) };

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

    // Karta „Pomiary pod kontrolą”: ile dni do kolejnego pomiaru wg przypomnienia z Ustawień (uki-bodybuild-reminder).
    _kartaPomiarow: (lastDate) => {
        const dodaj = `<button type="button" class="z-chip an-dodaj" onclick="window.switchTab('measurements-dashboard')">${ikona('plus', 16)} Dodaj pomiar</button>`;
        const [y, m, d] = String(lastDate || '').slice(0, 10).split('-').map(Number);
        const dzis = new Date();
        const dni = Math.round((new Date(dzis.getFullYear(), dzis.getMonth(), dzis.getDate()) - new Date(y, (m || 1) - 1, d || 1)) / 86400000);
        const co = parseInt(localStorage.getItem('uki-bodybuild-reminder') || '30', 10);
        const dniTxt = (n) => `${n} ${n === 1 ? 'dzień' : 'dni'}`;
        let stan = '';
        if (!Number.isFinite(dni) || !Number.isFinite(co)) stan = '';
        else if (co === 0) stan = 'Przypomnienia o pomiarach są wyłączone w Ustawieniach.';
        else if (co - dni > 0) stan = `Następne za ${dniTxt(co - dni)}`;
        else if (co - dni === 0) stan = 'Następny pomiar wypada dziś';
        else stan = `Pomiar spóźniony o ${dniTxt(dni - co)}`;
        const opis = Number.isFinite(dni) ? `Ostatni wpis: ${dni <= 0 ? 'dzisiaj' : `${dniTxt(dni)} temu`}.` : '';
        return `
            <div class="z-card an-pomiary">
                <div class="an-pomiary-tekst">
                    <h3 class="z-hd an-h an-h-karta">Pomiary pod kontrolą</h3>
                    ${stan ? `<p class="an-pomiary-stan">${stan}</p>` : ''}
                    ${opis ? `<p class="z-mut an-pomiary-opis">${opis}</p>` : ''}
                </div>
                ${dodaj}
            </div>`;
    },

    // Seria wskaźnika w czasie: wartość po każdym pomiarze, liczona tą samą funkcją co karta (bodySummary).
    _historiaWskaznikow: (measurements, gender) => {
        const rosnaco = [...measurements].sort((a, b) => new Date(a.date) - new Date(b.date));
        return rosnaco.map(m => ({
            date: m.date,
            s: bodySummary(measurements.filter(x => new Date(x.date) <= new Date(m.date)), gender)
        }));
    },

    _zmiana: (seria, ndec, jednostka, malejeDobrze) => {
        if (seria.length < 2) return '<p class="z-mut an-zmiana-pusta">Pierwszy pomiar: zmiany pojawią się po kolejnym.</p>';
        const v = seria[seria.length - 1] - seria[0];
        const zaokr = Number(Math.abs(v).toFixed(ndec));
        if (zaokr === 0) return '<p class="z-mut an-zmiana-pusta">Bez zmian od pierwszego wpisu.</p>';
        const dobrze = malejeDobrze ? v < 0 : v > 0;
        return `<p class="an-zmiana ${dobrze ? 'an-dobrze' : 'an-zle'}" data-zmiana="${dobrze ? 'korzystna' : 'niekorzystna'}">${ikona(v > 0 ? 'arrow-up' : 'arrow-down', 14)}<span>${v > 0 ? '+' : '−'}${zaokr.toFixed(ndec)}${jednostka} od pierwszego wpisu</span></p>`;
    },

    _wskaznik: ({ klucz, etykieta, wartosc, jednostka, kategoria, zmiana, infoArg }) => `
        <div class="z-card z-stat an-wsk" data-wskaznik="${klucz}">
            <div class="z-mut an-wsk-etykieta">${etykieta}</div>
            <div class="z-big an-wsk-wartosc">${wartosc}${jednostka ? ` <span class="an-jedn">${jednostka}</span>` : ''}</div>
            <p class="an-kat">${kategoria}</p>
            ${zmiana}
            <button type="button" class="an-info" aria-label="Objaśnienie: ${etykieta}" onclick="window.AnalyticsUI.showInfoModal('${klucz}', ${infoArg}, this)">${ikona('info', 16)}</button>
        </div>`,

    // Wykres BF% w czasie (linia SVG; kolory z klas z-chart-* i tokenów). Punkt: dotyk, klik albo fokus pokazuje odczyt.
    _wykresBf: (punkty) => {
        const n = punkty.length;
        const W = 300, H = 170, M = 22, GORA = 26, DOL = H - 40;
        const wart = punkty.map(p => p.bf);
        const min = Math.min(...wart), max = Math.max(...wart);
        const luz = (max - min) * 0.2 || max * 0.1 || 1;
        const lo = min - luz, hi = max + luz;
        const krok = (W - 2 * M) / (n - 1);
        const fmt = (v) => Math.round(v * 10) / 10;
        const pts = punkty.map((p, i) => ({
            ...p,
            x: M + i * krok,
            y: DOL - ((p.bf - lo) / (hi - lo)) * (DOL - GORA),
            opis: `${new Date(p.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}: BF ${p.bf.toFixed(1)}%`
        }));
        const linia = pts.map((p, i) => `${i ? 'L' : 'M'}${fmt(p.x)} ${fmt(p.y)}`).join(' ');
        const pole = `${linia} L${fmt(pts[n - 1].x)} ${DOL} L${fmt(pts[0].x)} ${DOL} Z`;
        const coWart = n > 8 ? 2 : 1;
        const coData = Math.max(1, Math.ceil(44 / krok));
        const opis = `Wykres BF%: ${n} pomiarów, od ${wart[0].toFixed(1)}% do ${wart[n - 1].toFixed(1)}%.`;
        return `
            <svg class="z-chart an-linia" viewBox="0 0 ${W} ${H}" role="group" aria-label="${esc(opis)}" focusable="false">
                <defs>
                    <linearGradient id="an-pole-bf" class="z-chart-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0"/><stop offset="1"/></linearGradient>
                </defs>
                <line class="an-os" x1="${M - 8}" x2="${W - M + 8}" y1="${DOL}" y2="${DOL}"/>
                <path d="${pole}" fill="url(#an-pole-bf)" stroke="none"/>
                <path class="z-chart-line" d="${linia}"/>
                ${pts.map((p, i) => `
                    <g class="an-pkt" tabindex="0" role="img" aria-label="${esc(p.opis)}" data-opis="${esc(p.opis)}">
                        <title>${esc(p.opis)}</title>
                        <circle class="an-trafienie" cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="14"/>
                        <circle class="an-punkt" cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="3.5"/>
                    </g>
                    ${(n - 1 - i) % coWart === 0 ? `<text class="an-wart" x="${fmt(p.x)}" y="${fmt(p.y - 9)}" text-anchor="middle">${p.bf.toFixed(1)}</text>` : ''}
                    ${(n - 1 - i) % coData === 0 ? `<text class="z-chart-axis" x="${fmt(p.x)}" y="${H - 6}" text-anchor="middle">${esc(new Date(p.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' }))}</text>` : ''}
                `).join('')}
            </svg>
            <p class="an-odczyt" aria-live="polite">${esc(pts[n - 1].opis)}</p>`;
    },

    buildBodyTab: (trainings, measurements) => {
        if (measurements.length === 0) {
            return `
                <div class="z-card z-alert an-brak">
                    <h3 class="z-hd an-h an-h-karta">Brak pomiarów ciała!</h3>
                    <p class="z-sub an-brak-tekst">Aby śledzić swój progres sylwetkowy, przejdź do zakładki "Pomiary Ciała" i dodaj pierwszy wpis.</p>
                    <button type="button" class="z-chip an-dodaj" onclick="window.switchTab('measurements-dashboard')">${ikona('plus', 16)} Dodaj pomiar</button>
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
        const hist = AnalyticsUI._historiaWskaznikow(measurements, gender);
        const seria = (pole) => hist.map(h => h.s[pole]).filter(v => v !== null && v !== undefined);

        let wskazniki = '';
        let alertBf = '';
        let bf = null;
        let normalizedFfmi = null;

        if (missingForBF.length === 0) {
            bf = body.bf;
            wskazniki += AnalyticsUI._wskaznik({
                klucz: 'bf', etykieta: 'Szacunkowy BF%', wartosc: bf.toFixed(1), jednostka: '%',
                kategoria: body.bfCategory.text, zmiana: AnalyticsUI._zmiana(seria('bf'), 1, ' %', true), infoArg: bf
            });

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

                wskazniki += AnalyticsUI._wskaznik({
                    klucz: 'ffmi', etykieta: 'FFMI (Index Beztłuszczowy)', wartosc: normalizedFfmi.toFixed(1), jednostka: '',
                    kategoria: ffmiText, zmiana: AnalyticsUI._zmiana(seria('ffmi'), 1, '', false), infoArg: normalizedFfmi
                });
            }
        } else {
            alertBf = `
                <div class="z-card z-alert an-brak">
                    <h3 class="z-hd an-h an-h-karta">Brak danych BF%</h3>
                    <p class="z-sub an-brak-tekst">Uzupełnij: ${missingForBF.join(", ")}.</p>
                    <button type="button" class="z-chip an-dodaj" onclick="window.switchTab('measurements-dashboard')">${ikona('plus', 16)} Dodaj pomiar</button>
                </div>`;
        }

        if (body.whr !== null) {
            const whr = body.whr;
            const whrText = body.whrCategory ? body.whrCategory.text : 'Ustaw płeć w Pomiarach ciała, żeby ocenić ryzyko.';
            wskazniki += AnalyticsUI._wskaznik({
                klucz: 'whr', etykieta: 'WHR (Talia-Biodra)', wartosc: whr.toFixed(2), jednostka: '',
                kategoria: whrText, zmiana: AnalyticsUI._zmiana(seria('whr'), 2, '', true), infoArg: whr
            });
        }

        // Wykres BF% w czasie: tylko pomiary, dla których da się policzyć BF%.
        let wykresBf = '';
        const punktyBf = hist.filter(h => h.s.bf !== null && h.s.bf !== undefined).map(h => ({ date: h.date, bf: h.s.bf })).slice(-12);
        if (punktyBf.length >= 2) {
            const p = AnalyticsUI.cachedProgress;
            wykresBf = `
                <h3 class="z-hd an-h">BF% w czasie</h3>
                <div class="z-card an-bf-wykres">
                    ${AnalyticsUI._wykresBf(punktyBf)}
                </div>
                ${p ? `<button type="button" class="z-ghost an-udostepnij" onclick="window.AnalyticsUI.shareProgress(${Number(p.monthWorkouts)}, ${Number(p.monthVolume)}, ${Number(p.totalVolume)})">${ikona('share', 18)} Udostępnij progres</button>` : ''}`;
        }

        let trendsHtml = '';
        if (sortedMeasurements.length > 1) {
            const dict = { weight: 'Waga', chest: 'Klatka', waist: 'Talia', hips: 'Biodra', thigh: 'Udo', biceps: 'Biceps', neck: 'Szyja' };
            let diffs = '';
            for (const [key, label] of Object.entries(dict)) {
                if (last[key] && first[key]) {
                    const v = last[key] - first[key];
                    if (v !== 0) {
                        const sign = v > 0 ? '+' : '';
                        const dobrze = v > 0 ? key !== 'waist' : key === 'waist';
                        diffs += `<div class="an-zm-wiersz"><span class="z-mut">${label}</span><strong class="an-zm-wart ${dobrze ? 'an-dobrze' : 'an-zle'}">${ikona(v > 0 ? 'arrow-up' : 'arrow-down', 14)} ${sign}${v.toFixed(1)} ${key==='weight'?'kg':'cm'}</strong></div>`;
                    }
                }
            }
            if (diffs) trendsHtml += `<h3 class="z-hd an-h">Zmiany (od pierwszego wpisu)</h3><div class="z-card an-zmiany">${diffs}</div>`;
        }

        return AnalyticsUI._kartaPomiarow(last.date) + alertBf + (wskazniki ? `<div class="an-wskazniki">${wskazniki}</div>` : '') + wykresBf + trendsHtml;
    },

    buildRecoveryTab: (trainings) => {
        if (trainings.length === 0) return '<div class="z-card"><p class="z-sub an-pusto">Brak danych treningowych do analizy regeneracji.</p></div>';
        const now = Date.now();
        const last48h = now - (48 * 60 * 60 * 1000);
        const recentTrainings = trainings.filter(t => (t.startTime || new Date(t.date).getTime()) > last48h);

        const muscles = {
            chest: { name: 'Klatka Piersiowa', tired: false },
            back: { name: 'Plecy', tired: false },
            legs: { name: 'Nogi', tired: false },
            shoulders: { name: 'Barki', tired: false },
            arms: { name: 'Ramiona', tired: false },
            core: { name: 'Brzuch', tired: false }
        };

        recentTrainings.forEach(t => (t.exercises || []).forEach(ex => {
            // Partie z danych katalogu (także pod dawną nazwą); słowa kluczowe tylko dla ćwiczeń własnych.
            atlasMuscles(ex.name).forEach(key => { if (muscles[key]) muscles[key].tired = true; });
        }));

        const lista = Object.entries(muscles);
        const zmeczone = lista.filter(([, m]) => m.tired).map(([, m]) => m.name);
        const atlasCards = lista.map(([key, m]) => `
            <div class="an-partia" data-partia="${key}" data-stan="${m.tired ? 'zmeczone' : 'gotowe'}">
                <strong class="an-partia-nazwa">${m.name}</strong>
                <span class="an-partia-stan">${ikona(m.tired ? 'alert' : 'check', 16)} ${m.tired ? 'Zmęczone' : 'Gotowe'}</span>
            </div>`).join('');
        const podpowiedz = zmeczone.length
            ? `Dziś odpuść: ${zmeczone.join(', ')}. Trenuj partie oznaczone jako gotowe.`
            : 'Wszystkie partie są wypoczęte. Możesz trenować dowolną.';

        return `
            <h3 class="z-hd an-h an-h-pierwszy">Regeneracja i atlas mięśni</h3>
            <div class="z-card an-atlas">
                <p class="z-sub an-atlas-opis">Analiza na podstawie treningów z ostatnich 48 godzin. Partie oznaczone jako zmęczone zaangażowano niedawno i potrzebują czasu na regenerację. Unikaj obciążania ich dzisiaj!</p>
                <div class="an-partie">
                    ${atlasCards}
                </div>
                <p class="an-edward"><strong>Edward:</strong> ${podpowiedz}</p>
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
                color: AnalyticsUI._kolor('--ukis-color-accent')
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
                { label: 'Ciężar przerzucony w miesiącu', value: `${monthVolume} kg`, color: AnalyticsUI._kolor('--ukis-color-accent') },
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

    
    
    // Kolor tokenu (wartość obliczona) dla rysunku na canvasie (grafika do udostępnienia): kolory z motywu, nie z kodu.
    _kolor: (token) => {
        const probka = document.createElement('i');
        probka.style.color = `var(${token})`;
        document.body.append(probka);
        const kolor = getComputedStyle(probka).color;
        probka.remove();
        return kolor;
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
            if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); koniec(); } // nie zamyka też ekranu pod oknem
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

    // Okno objaśnienia wskaźnika (BF%, FFMI, WHR): skala z zaznaczoną wartością. Pasy mają kolory z tokenów (klasy an-pas-N).
    showInfoModal: (type, value, opener) => {
        const sex = readBodyProfile().sex;
        const gender = sex || 'male'; // BF% i FFMI pokazujemy tylko przy znanej płci
        let title, desc, ranges, minVal, maxVal, pasy;

        if (type === 'bf') {
            title = 'Szacunkowy BF% (Tkanka Tłuszczowa)';
            desc = 'BF% obrazuje jak dużą część Twojej masy stanowi tłuszcz. Utrzymanie go w ryzach zmniejsza ryzyko chorób układu krążenia i cukrzycy typu 2. Zbyt niski poziom również jest niezdrowy i może zaburzać gospodarkę hormonalną!';
            ranges = bfRanges(gender); // te same progi ACE co na karcie
            minVal = 2; maxVal = ranges[ranges.length-1].max;
            pasy = [0, 1, 2, 3, 4];
        } else if (type === 'ffmi') {
            title = 'FFMI (Index Beztłuszczowy)';
            desc = 'FFMI to miernik czystej masy mięśniowej niezależny od wzrostu. Im wyższy, tym jesteś bardziej muskularny. Dobrze rozwinięta tkanka mięśniowa to pancerz ochronny stawów, lepszy metabolizm i wyższa wrażliwość insulinowa!';
            if (gender === 'male') {
                ranges = [
                    { label: 'Niska', max: 18 },
                    { label: 'Przeciętna', max: 20 },
                    { label: 'Dobra', max: 22 },
                    { label: 'Doskonała', max: 25 },
                    { label: 'Elita', max: 30 }
                ];
            } else {
                ranges = [
                    { label: 'Niska', max: 15 },
                    { label: 'Przeciętna', max: 17 },
                    { label: 'Dobra', max: 19 },
                    { label: 'Doskonała', max: 21 },
                    { label: 'Elita', max: 26 }
                ];
            }
            minVal = 13; maxVal = ranges[ranges.length-1].max;
            pasy = [0, 1, 2, 3, 4];
        } else if (type === 'whr') {
            title = 'WHR (Talia do Bioder)';
            desc = 'WHR określa typ sylwetki (jabłko vs gruszka). Typ "jabłka" oznacza gromadzenie tłuszczu wokół narządów wewnętrznych (tłuszcz wisceralny), co drastycznie podnosi ryzyko zawałów, zatorów oraz zespołu metabolicznego!';
            ranges = whrRanges(sex); // te same progi WHO co na karcie; bez płci: null
            minVal = 0.6; maxVal = ranges ? ranges[ranges.length-1].max : 1;
            pasy = [2, 4];
        } else {
            return;
        }

        if (!ranges) {
            // Płeć nieznana: zamiast norm innej płci prosimy o jej ustawienie.
            AnalyticsUI._pokazOkno(title, `
                <p>${esc(desc)}</p>
                <p id="analytics-info-nosex" class="an-okno-nota">Ustaw płeć w Pomiarach ciała, żeby ocenić ryzyko.</p>
            `, 'Zamknij', opener);
            return;
        }

        let currentPos = minVal;
        const totalSpan = maxVal - minVal;
        const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2));
        let barsHtml = '';
        let legendaHtml = '';
        ranges.forEach((r, i) => {
            const pct = ((r.max - currentPos) / totalSpan) * 100;
            barsHtml += `<div class="an-pas an-pas-${pasy[i]}" style="width: ${pct}%" title="${esc(r.label)}"></div>`;
            legendaHtml += `<li><span class="an-pas-probka an-pas-${pasy[i]}" aria-hidden="true"></span>${esc(r.label)} <span class="z-mut">${fmt(currentPos)}–${fmt(r.max)}</span></li>`;
            currentPos = r.max;
        });

        const pointerPct = Math.max(0, Math.min(100, ((value - minVal) / totalSpan) * 100));

        AnalyticsUI._pokazOkno(title, `
            <p>${esc(desc)}</p>
            <div class="an-skala">
                <div class="an-pasy" role="img" aria-label="Skala wskaźnika z zaznaczoną wartością ${Number(value).toFixed(2)}">${barsHtml}</div>
                <div class="an-znacznik" style="left: ${pointerPct}%">
                    <span class="an-strzalka" aria-hidden="true"></span>
                    <strong class="an-znacznik-wart">${Number(value).toFixed(2)}</strong>
                </div>
            </div>
            <ul class="an-pas-legenda">${legendaHtml}</ul>
        `, 'Zamknij', opener);
    }
};

window.AnalyticsUI = AnalyticsUI;
