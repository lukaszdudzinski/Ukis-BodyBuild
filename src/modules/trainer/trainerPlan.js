// Plan treningowy klienta (spec 9.5): daty mezocyklu, tygodnie, licznik serii, pola i walidacja.
// Same funkcje czyste, bez DOM i bez sejfu. Żadna funkcja nie zmienia argumentów, tylko zwraca nowe obiekty.
// Daty to tekst RRRR-MM-DD w czasie lokalnym; liczymy przez new Date(r, m - 1, d), nigdy przez new Date('RRRR-MM-DD').

import { continuumForGoal } from './trainerQuestionnaire.js';
import { goalLabel } from './trainerModel.js';
import { parseNumber, formatNumber } from './trainerMeasurements.js';
import { ExerciseCategories } from '../../data/ExerciseCatalog.js';

// Kolejność tygodnia od poniedziałku; dow jak w Date.getDay().
export const DAYS = [
    { id: 'mon', label: 'Pn', dow: 1 },
    { id: 'tue', label: 'Wt', dow: 2 },
    { id: 'wed', label: 'Śr', dow: 3 },
    { id: 'thu', label: 'Cz', dow: 4 },
    { id: 'fri', label: 'Pt', dow: 5 },
    { id: 'sat', label: 'So', dow: 6 },
    { id: 'sun', label: 'Nd', dow: 0 },
];

export const MUSCLE_GROUPS = [
    { id: 'klatka', label: 'klatka' },
    { id: 'plecy', label: 'plecy' },
    { id: 'nogi', label: 'nogi' },
    { id: 'barki', label: 'barki' },
    { id: 'triceps', label: 'triceps' },
    { id: 'biceps', label: 'biceps' },
    { id: 'brzuch', label: 'brzuch' },
];

// Kategorie katalogu bez grupy (Cardio, Zajęcia zorganizowane) i ćwiczenia własne są poza licznikiem serii.
const CATEGORY_TO_GROUP = {
    'Klatka': 'klatka',
    'Plecy': 'plecy',
    'Nogi i Pośladki': 'nogi',
    'Barki': 'barki',
    'Triceps': 'triceps',
    'Biceps': 'biceps',
    'Brzuch': 'brzuch',
};

const GROUP_BY_NAME = new Map();
for (const [category, names] of Object.entries(ExerciseCategories)) {
    const group = CATEGORY_TO_GROUP[category];
    if (group) for (const name of names) GROUP_BY_NAME.set(name, group);
}

export function muscleGroupFor(exerciseName) {
    return GROUP_BY_NAME.get(String(exerciseName ?? '').trim()) || null;
}

export const RAMP_DEFAULT = 'R — rozgrzanie: 5 min lekkiego cardio.\n'
    + 'A — aktywacja: pośladki i mięśnie tułowia.\n'
    + 'M — mobilizacja: stawy pracujące w tym treningu.\n'
    + 'P — potencjacja: 2–3 serie pierwszego ćwiczenia z rosnącym ciężarem.';

export const SESSION_MINUTES = [30, 45, 60, 75, 90];

const MAX_WEEKS = 16;
const MAX_WORKOUTS = 7;
const MAX_SETS = 20;
const MAX_KG = 500;
const MAX_REST = 600;
const REPS_RE = /^\d{1,3}(\+|–\d{1,3})?$/;
const TEMPO_RE = /^[0-9X]{4}$/;

// Rekord trainer_settings może nie istnieć albo mieć pola spoza zakresu: wtedy wartości domyślne.
export function planSettings(settings) {
    const s = settings || {};
    const limit = s.weeklySetsLimit;
    return {
        intensity: s.intensity === 'rpe' ? 'rpe' : 'rir',
        weeklySetsLimit: Number.isInteger(limit) && limit >= 1 && limit <= 40 ? limit : 10,
        sessionMinutes: SESSION_MINUTES.includes(s.sessionMinutes) ? s.sessionMinutes : 60,
    };
}

// ---------- Daty ----------

export function parseDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? ''));
    if (!m) return null;
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
    const date = new Date(y, mo - 1, d);
    return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d ? date : null;
}

export function toIso(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// „Dziś” przychodzi jako Date albo jako tekst RRRR-MM-DD.
const isoOf = (day) => (typeof day === 'string' ? day : toIso(day || new Date()));

export function addDays(iso, n) {
    const d = parseDate(iso);
    if (!d) return null;
    d.setDate(d.getDate() + n);
    return toIso(d);
}

export function mondayOf(iso) {
    const d = parseDate(iso);
    if (!d) return null;
    return addDays(iso, -((d.getDay() + 6) % 7));
}

// Doba przy zmianie czasu ma 23 albo 25 godzin, dlatego zaokrąglamy.
function daysBetween(fromIso, toIsoStr) {
    const a = parseDate(fromIso);
    const b = parseDate(toIsoStr);
    if (!a || !b) return null;
    return Math.round((b - a) / 86400000);
}

export function planEndDate(plan) {
    return addDays(plan.startDate, plan.weeks * 7 - 1);
}

// Numer tygodnia mezocyklu (1…weeks); null przed startem i po końcu.
export function mesoWeek(plan, iso) {
    const diff = daysBetween(plan.startDate, iso);
    if (diff === null || diff < 0) return null;
    const week = Math.floor(diff / 7) + 1;
    return week > plan.weeks ? null : week;
}

// Indeks tygodnia (0…weeks−1) przycięty do zakresu: przed startem tydzień 1, po końcu ostatni (rozstrzygnięcie C4).
export function weekIndexFor({ startDate, weeks }, iso) {
    const diff = daysBetween(startDate, iso);
    if (diff === null || diff < 0) return 0;
    return Math.min(Math.floor(diff / 7), Math.max(weeks - 1, 0));
}

export function workoutForDate(plan, iso) {
    const week = mesoWeek(plan, iso);
    if (week === null) return null;
    const dow = parseDate(iso).getDay();
    const day = DAYS.find((d) => d.dow === dow).id;
    const workout = (plan.workouts || []).find((w) => (w.days || []).includes(day));
    return workout ? { workout, week } : null;
}

// ---------- Nowy plan, trening, ćwiczenie ----------

// Podpowiedź z kontinuum celu (decyzja 6, rozstrzygnięcie C6): powtórzenia to pierwszy człon zapisu,
// przerwa to dolna granica zakresu w sekundach („1,5–2 min” → 90, „30–60 s” → 30).
export function goalPrefill(goalId) {
    const c = continuumForGoal(goalId);
    if (!c) return null;
    const reps = c.reps.split(' ')[0];
    const m = /^(\d+(?:,\d+)?)\s*–.*?(min|s)$/.exec(c.rest);
    const lower = m ? Number(m[1].replace(',', '.')) : null;
    const restSec = lower === null ? null : Math.round(m[2] === 'min' ? lower * 60 : lower);
    return { reps, restSec };
}

export function newPlan({ client, settings, today } = {}) {
    const day = isoOf(today);
    const monday = mondayOf(day);
    const goal = (client && client.goal) || null;
    const label = goal ? goalLabel(goal) : '';
    const plan = {
        kind: 'plan',
        clientId: client ? client.id : null,
        name: label ? `Plan — ${label}` : 'Plan treningowy',
        goal,
        weeks: 6,
        startDate: monday === day ? day : addDays(monday, 7),
        intensity: planSettings(settings).intensity,
        status: 'aktywny',
        workouts: [],
    };
    plan.workouts = [newWorkout(plan)];
    return plan;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export function newWorkout(plan) {
    const workouts = (plan && plan.workouts) || [];
    const used = new Set(workouts.map((w) => w.name));
    const letter = LETTERS.find((l) => !used.has(`Trening ${l}`));
    return {
        id: crypto.randomUUID(),
        name: letter ? `Trening ${letter}` : `Trening ${workouts.length + 1}`,
        days: [],
        warmup: RAMP_DEFAULT,
        exercises: [],
    };
}

export function newExercise(plan, { name, muscleGroup } = {}) {
    const prefill = goalPrefill(plan && plan.goal);
    const weeks = Array.from({ length: Math.max((plan && plan.weeks) || 1, 1) }, () => null);
    weeks[0] = { sets: 3, reps: prefill?.reps ?? '', kg: null, effort: null };
    return {
        id: crypto.randomUUID(),
        name: String(name ?? ''),
        muscleGroup: muscleGroup === undefined ? muscleGroupFor(name) : muscleGroup,
        tempo: '',
        restSec: prefill?.restSec ?? null,
        note: '',
        supersetWithNext: false,
        weeks,
    };
}

// ---------- Tygodnie (decyzja 2: null = jak najbliższy wcześniejszy zapisany tydzień) ----------

export function weekValues(exercise, weekIdx) {
    const weeks = exercise.weeks || [];
    for (let i = Math.min(weekIdx, weeks.length - 1); i >= 0; i--) {
        const w = weeks[i];
        if (w) return { sets: w.sets, reps: w.reps, kg: w.kg, effort: w.effort };
    }
    return { sets: null, reps: '', kg: null, effort: null };
}

export function setWeekValues(exercise, weekIdx, values) {
    const next = structuredClone(exercise);
    const base = weekValues(exercise, weekIdx);
    const v = { ...base, ...(values || {}) };
    while (next.weeks.length <= weekIdx) next.weeks.push(null);
    next.weeks[weekIdx] = { sets: v.sets, reps: v.reps, kg: v.kg, effort: v.effort };
    return next;
}

const eachExercise = (plan, fn) => {
    for (const w of plan.workouts || []) for (const ex of w.exercises || []) fn(ex, w);
};

export function resizeWeeks(plan, n) {
    const weeks = Math.max(1, Math.floor(n));
    const next = structuredClone(plan);
    next.weeks = weeks;
    eachExercise(next, (ex) => {
        const w = (ex.weeks || []).slice(0, weeks);
        while (w.length < weeks) w.push(null);
        ex.weeks = w;
    });
    return next;
}

const bumpReps = (reps) => String(reps ?? '').replace(/\d+/g, (d) => String(Math.min(Number(d) + 1, 999)));

export function copyWeek(plan, fromIdx, change = { type: 'none' }) {
    if (fromIdx >= plan.weeks - 1) throw new Error('OSTATNI_TYDZIEN');
    const next = structuredClone(plan);
    const ids = new Set(change.exerciseIds || []);
    eachExercise(next, (ex) => {
        const v = weekValues(ex, fromIdx);
        if (change.type === 'kg' && ids.has(ex.id) && typeof v.kg === 'number') {
            v.kg = Math.min(Math.round((v.kg + change.amount) * 100) / 100, MAX_KG);
        } else if (change.type === 'reps') {
            v.reps = bumpReps(v.reps);
        } else if (change.type === 'sets' && Number.isInteger(v.sets)) {
            v.sets = Math.min(v.sets + 1, MAX_SETS);
        }
        while (ex.weeks.length <= fromIdx + 1) ex.weeks.push(null);
        ex.weeks[fromIdx + 1] = v;
    });
    return next;
}

// Serie robocze tygodnia na grupę (decyzja 12): serie × liczba dni treningu, co najmniej 1.
export function plannedSetsByGroup(plan, weekIdx) {
    const out = {};
    eachExercise(plan, (ex, workout) => {
        if (!ex.muscleGroup) return;
        const sets = Number(weekValues(ex, weekIdx).sets) || 0;
        const times = Math.max((workout.days || []).length, 1);
        out[ex.muscleGroup] = (out[ex.muscleGroup] || 0) + sets * times;
    });
    return out;
}

export function daysPerWeek(plan) {
    return (plan.workouts || []).reduce((sum, w) => sum + (w.days || []).length, 0);
}

// ---------- Pola: polski zapis ----------

// '' dla pustego, null dla błędnego; „-” zamienia się na „–”, zakres musi rosnąć.
export function normalizeReps(input) {
    const s = String(input ?? '').replace(/\s+/g, '').replace(/[-—]/g, '–');
    if (s === '') return '';
    if (!REPS_RE.test(s)) return null;
    const [a, b] = s.split('–');
    if (b !== undefined && Number(b) <= Number(a)) return null;
    return s;
}

export function repsLowerBound(reps) {
    const m = /^(\d+)/.exec(String(reps ?? ''));
    return m ? Number(m[1]) : null;
}

// null dla pustego, undefined dla błędnego.
export function parseKg(input) {
    const s = String(input ?? '').trim();
    if (s === '') return null;
    const n = parseNumber(s);
    return n === null || n > MAX_KG ? undefined : n;
}

// '' dla pustego, null dla błędnego; „x” zamienia się na „X”.
export function normalizeTempo(input) {
    const s = String(input ?? '').trim().toUpperCase();
    if (s === '') return '';
    return TEMPO_RE.test(s) ? s : null;
}

export function effortRange(intensity) {
    return intensity === 'rpe' ? { min: 6, max: 10, step: 0.5 } : { min: 0, max: 5, step: 1 };
}

export function formatEffort(intensity, effort) {
    if (effort === null || effort === undefined || effort === '') return '';
    return intensity === 'rpe' ? `RPE ${formatNumber(effort)}` : `RIR ${effort}`;
}

export function formatRest(sec) {
    if (sec === null || sec === undefined || sec === '') return '';
    const s = Math.round(Number(sec));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// Jeden wiersz tygodnia dla planu, sesji i u klienta (rozstrzygnięcie C5),
// np. „4 × 5 · 80 kg · RIR 2 · tempo 3010 · przerwa 2:30”. Puste części są pominięte.
export function formatWeekLine({ sets, reps, kg, effort } = {}, { intensity, tempo, restSec } = {}) {
    const parts = [];
    if (sets !== null && sets !== undefined && sets !== '') parts.push(reps ? `${sets} × ${reps}` : `serie: ${sets}`);
    if (typeof kg === 'number') parts.push(`${formatNumber(kg)} kg`);
    const eff = formatEffort(intensity, effort);
    if (eff) parts.push(eff);
    if (tempo) parts.push(`tempo ${tempo}`);
    const rest = formatRest(restSec);
    if (rest) parts.push(`przerwa ${rest}`);
    return parts.join(' · ');
}

// ---------- Walidacja ----------

const isBlank = (v) => v === null || v === undefined || v === '';

function effortError(intensity, effort) {
    if (isBlank(effort)) return null;
    const n = Number(effort);
    if (intensity === 'rpe') {
        return n >= 6 && n <= 10 && Number.isInteger(n * 2) ? null : 'RPE: od 6 do 10 co 0,5.';
    }
    return Number.isInteger(n) && n >= 0 && n <= 5 ? null : 'RIR: liczba całkowita od 0 do 5.';
}

export function validatePlan(plan) {
    const errors = {};
    if (!String(plan.name ?? '').trim()) errors.name = 'Podaj nazwę planu.';
    if (!Number.isInteger(plan.weeks) || plan.weeks < 1 || plan.weeks > MAX_WEEKS) errors.weeks = 'Mezocykl: od 1 do 16 tygodni.';
    const start = parseDate(plan.startDate);
    if (!start) errors.startDate = 'Podaj datę startu.';
    else if (start.getDay() !== 1) errors.startDate = 'Plan zaczyna się w poniedziałek.';
    if (plan.intensity !== 'rir' && plan.intensity !== 'rpe') errors.intensity = 'Wybierz RIR albo RPE.';

    const workouts = plan.workouts || [];
    if (workouts.length < 1 || workouts.length > MAX_WORKOUTS) errors.workouts = 'Plan ma od 1 do 7 treningów.';
    const dayOwner = new Map();
    workouts.forEach((w, wi) => {
        const wp = `workouts.${wi}`;
        if (!String(w.name ?? '').trim()) errors[`${wp}.name`] = 'Podaj nazwę treningu.';
        for (const day of w.days || []) {
            if (!DAYS.some((d) => d.id === day)) { errors[`${wp}.days`] = 'Nieznany dzień tygodnia.'; break; }
            const owner = dayOwner.get(day);
            if (owner !== undefined && owner !== wi) { errors[`${wp}.days`] = `Ten dzień ma już ${workouts[owner].name}.`; break; }
            dayOwner.set(day, wi);
        }
        (w.exercises || []).forEach((ex, ei) => {
            const ep = `${wp}.exercises.${ei}`;
            if (!String(ex.name ?? '').trim()) errors[`${ep}.name`] = 'Podaj nazwę ćwiczenia.';
            if (normalizeTempo(ex.tempo) === null) errors[`${ep}.tempo`] = 'Tempo: 4 znaki, cyfry albo X, np. 3010.';
            if (!isBlank(ex.restSec) && !(Number.isInteger(ex.restSec) && ex.restSec >= 0 && ex.restSec <= MAX_REST)) {
                errors[`${ep}.restSec`] = 'Przerwa: od 0 do 600 s.';
            }
            const weeks = ex.weeks || [];
            if (!weeks[0]) errors[`${ep}.weeks.0`] = 'Uzupełnij tydzień 1.';
            weeks.forEach((v, k) => {
                if (!v) return;
                const kp = `${ep}.weeks.${k}`;
                if (!(Number.isInteger(v.sets) && v.sets >= 1 && v.sets <= MAX_SETS)) errors[`${kp}.sets`] = 'Serie: liczba całkowita od 1 do 20.';
                if (normalizeReps(v.reps) === null) errors[`${kp}.reps`] = 'Powtórzenia: liczba albo zakres, np. 8–10.';
                if (!isBlank(v.kg) && !(typeof v.kg === 'number' && v.kg >= 0 && v.kg <= MAX_KG)) errors[`${kp}.kg`] = 'Ciężar: od 0 do 500 kg.';
                const eff = effortError(plan.intensity, v.effort);
                if (eff) errors[`${kp}.effort`] = eff;
            });
        });
    });
    return { ok: Object.keys(errors).length === 0, errors };
}

// ---------- Grupy planów ----------

export function planGroup(plan, today) {
    if (plan.status === 'archiwum' || planEndDate(plan) < isoOf(today)) return 'archiwum';
    return plan.status === 'aktywny' ? 'aktywny' : 'inne';
}

// Dwa plany nakładają się, gdy ich zakresy dat (start…koniec mezocyklu) mają choć jeden wspólny dzień.
export function plansOverlap(a, b) {
    const endA = planEndDate(a);
    const endB = planEndDate(b);
    if (!endA || !endB) return false;
    return String(a.startDate) <= endB && String(b.startDate) <= endA;
}

// Aktywny = status „aktywny” i plan się nie skończył (rozstrzygnięcie C2). Najpierw plan, który trwa dziś,
// potem najbliższy przyszły (R3: zaplanowany następny blok nie zasłania trwającego). Remis: najnowszy updatedAt.
export function activePlan(plans, today) {
    const day = isoOf(today);
    const newer = (p, best) => String(p.updatedAt || '') > String(best.updatedAt || '');
    let running = null;
    let upcoming = null;
    for (const p of plans || []) {
        if (planGroup(p, day) !== 'aktywny') continue;
        if (String(p.startDate) <= day) {
            if (!running || newer(p, running)) running = p;
        } else if (!upcoming || String(p.startDate) < String(upcoming.startDate)
            || (p.startDate === upcoming.startDate && newer(p, upcoming))) {
            upcoming = p;
        }
    }
    return running || upcoming;
}
