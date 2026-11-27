// Postępy klienta z zakończonych sesji (spec 9.7, decyzje 12 i 13). Same funkcje czyste, bez DOM i bez sejfu.
// Sesje w toku nigdy się nie liczą. Daty to tekst RRRR-MM-DD w czasie lokalnym.

import { MUSCLE_GROUPS, addDays, toIso } from './trainerPlan.js';
import { isWorkingSet, finishedSessions } from './trainerSession.js';
import { canonicalExerciseName } from '../../data/ExerciseCatalog.js';

const MONTHS = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
    'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];
const GROUP_IDS = new Set(MUSCLE_GROUPS.map((g) => g.id));

const isPositive = (n) => typeof n === 'number' && Number.isFinite(n) && n > 0;
const round1 = (n) => Math.round(n * 10) / 10;

// Decyzja 13: wzór Epleya kg × (1 + powt. / 30), przy 1 powtórzeniu = kg; tylko 1–12 powtórzeń, zaokrąglone do 0,1.
export function estimate1RM(kg, reps) {
    if (!isPositive(kg) || !Number.isInteger(reps) || reps < 1 || reps > 12) return null;
    return round1(reps === 1 ? kg : kg * (1 + reps / 30));
}

// Ciężar roboczy w sesji: najcięższa odhaczona seria `normal` z kg > 0, przy remisie więcej powtórzeń.
export function bestSet(sessionExercise) {
    let best = null;
    for (const set of (sessionExercise && sessionExercise.sets) || []) {
        if (!isWorkingSet(set) || !isPositive(set.kg)) continue;
        const reps = Number.isInteger(set.reps) ? set.reps : 0;
        if (!best || set.kg > best.kg || (set.kg === best.kg && reps > best.reps)) best = { kg: set.kg, reps };
    }
    return best;
}

// Nazwy ćwiczeń z co najmniej jedną serią roboczą w zakończonych sesjach, alfabetycznie po polsku.
// Dawna nazwa z katalogu liczy się jako nazwa główna (jedno ćwiczenie przed i po zmianie nazw).
export function exerciseNames(sessions) {
    const names = new Set();
    for (const s of finishedSessions(sessions)) {
        for (const ex of s.exercises || []) {
            if ((ex.sets || []).some(isWorkingSet)) names.add(canonicalExerciseName(ex.name));
        }
    }
    return [...names].sort(new Intl.Collator('pl').compare);
}

// Wartość dnia = maksimum z sesji tego dnia (i z powtórzeń ćwiczenia w jednej sesji), rosnąco po dacie.
function dailySeries(sessions, name, valueOf) {
    const byDate = new Map();
    const wanted = canonicalExerciseName(name);
    for (const s of finishedSessions(sessions)) {
        for (const ex of s.exercises || []) {
            if (canonicalExerciseName(ex.name) !== wanted) continue;
            const v = valueOf(ex);
            if (v === null || !s.date) continue;
            if (!byDate.has(s.date) || v > byDate.get(s.date)) byDate.set(s.date, v);
        }
    }
    return [...byDate].sort(([a], [b]) => a.localeCompare(b)).map(([date, value]) => ({ date, value }));
}

export function workingWeightSeries(sessions, name) {
    return dailySeries(sessions, name, (ex) => { const b = bestSet(ex); return b ? b.kg : null; });
}

// Szacowane 1RM sesji: najwyższe z serii roboczych (każda seria 1–12 powtórzeń może dać najlepsze oszacowanie).
export function e1rmSeries(sessions, name) {
    return dailySeries(sessions, name, (ex) => {
        let best = null;
        for (const set of ex.sets || []) {
            if (!isWorkingSet(set)) continue;
            const v = estimate1RM(set.kg, set.reps);
            if (v !== null && (best === null || v > best)) best = v;
        }
        return best;
    });
}

// Liczba zakończonych sesji w ostatnich `months` miesiącach (z bieżącym), od najstarszego.
export function sessionsPerMonth(sessions, today, months = 6) {
    const iso = typeof today === 'string' ? today : toIso(today || new Date());
    const [y, m] = iso.split('-').map(Number);
    const out = [];
    for (let i = months - 1; i >= 0; i--) {
        const d = new Date(y, m - 1 - i, 1);
        const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        out.push({ month, label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, count: 0 });
    }
    const index = new Map(out.map((row, i) => [row.month, i]));
    for (const s of finishedSessions(sessions)) {
        const i = index.get(String(s.date || '').slice(0, 7));
        if (i !== undefined) out[i].count += 1;
    }
    return out;
}

// Serie robocze (decyzja 12) na grupę mięśniową w tygodniu od poniedziałku `mondayIso` do niedzieli.
export function weeklySetsByGroup(sessions, mondayIso) {
    const sunday = addDays(mondayIso, 6);
    const out = {};
    if (!sunday) return out;
    for (const s of finishedSessions(sessions)) {
        const date = String(s.date || '');
        if (date < mondayIso || date > sunday) continue;
        for (const ex of s.exercises || []) {
            if (!GROUP_IDS.has(ex.muscleGroup)) continue;
            const n = (ex.sets || []).filter(isWorkingSet).length;
            if (n > 0) out[ex.muscleGroup] = (out[ex.muscleGroup] || 0) + n;
        }
    }
    return out;
}
