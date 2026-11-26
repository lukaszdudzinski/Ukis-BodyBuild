// Plik planu dla klienta (spec 11.1, decyzje 2, 4, 14 i 18): budowa pliku u trenera i ścisłe wczytanie u klienta.
// Moduł czysty, bez DOM i bez bazy. Plik u klienta to obce dane: parsePlanFile sprawdza strukturę, typy, zakresy
// i długości, pomija pola nieznane i zwraca nowe obiekty z oczyszczonymi tekstami. Nigdy nie kopiuje całych
// obiektów z pliku (ochrona przed __proto__, constructor, prototype) i nie używa eval ani Function.
// W pliku nie ma danych klienta: bez clientId, bez id planu, treningów i ćwiczeń, bez muscleGroup.

import { weekValues, DAYS } from './trainerPlan.js';
import { GOALS } from './trainerModel.js';

export const PLAN_FILE_FORMAT = 'ukis-bodybuild-plan';
export const PLAN_FILE_VERSION = 1;
export const PLAN_FILE_MAX_CHARS = 1000000;

export const DEFAULT_INCLUDE = Object.freeze({ params: true, warmup: true, days: true, notes: false });

export const PLAN_FILE_MESSAGES = Object.freeze({
    FORMAT: 'To nie jest plik planu BodyBuild.',
    WERSJA: 'Ten plan zapisano w nowszej wersji BodyBuild. Zaktualizuj aplikację i wczytaj plik ponownie.',
    USZKODZONY: 'Plik planu jest uszkodzony. Poproś trenera o nowy plik.',
});

const EX = 'plan.workouts[].exercises[]';
export const ALLOWED_PATHS = Object.freeze([
    'format', 'version', 'createdAt',
    'trainer', 'trainer.name',
    'plan', 'plan.name', 'plan.goal', 'plan.weeks', 'plan.startDate', 'plan.intensity', 'plan.warmup',
    'plan.workouts', 'plan.workouts[].name', 'plan.workouts[].days', 'plan.workouts[].exercises',
    `${EX}.name`, `${EX}.tempo`, `${EX}.restSec`, `${EX}.note`, `${EX}.supersetWithNext`, `${EX}.weeks`,
    `${EX}.weeks[].sets`, `${EX}.weeks[].reps`, `${EX}.weeks[].kg`, `${EX}.weeks[].rir`, `${EX}.weeks[].rpe`,
]);

// Limity tekstów (decyzja 18, rozstrzygnięcie R7) i tablic.
// plan.warmup łączy rozgrzewki wszystkich treningów (decyzja 4): 7 × 2000 znaków z edytora
// plus etykiety „<nazwa treningu, do 120>: ” i separatory „\n\n” to najwyżej 14 866 znaków, więc limit 15 000
// nigdy nie przycina pliku zbudowanego w aplikacji.
// Tempo i powtórzenia za długie są odrzucane (USZKODZONY), a nie przycinane: przycięta wartość
// zmieniłaby znaczenie (np. „8–100” → „8–10”). Przycinamy tylko teksty opisowe.
// Edytor nie ma limitu ćwiczeń w treningu. MAX_EXERCISES = 100 leży powyżej tego, na co i tak pozwala
// limit 1 000 000 znaków przy realnym planie, i tylko domyka rozmiar danych z obcego pliku.
const LEN = { name: 120, note: 500, warmup: 15000, tempo: 4, reps: 9 };
const MAX_WEEKS = 16;
const MAX_WORKOUTS = 7;
const MAX_EXERCISES = 100;
const MAX_SETS = 20;
const MAX_KG = 500;
const MAX_REST = 600;
const REPS_RE = /^\d{1,3}(\+|–\d{1,3})?$/;
const TEMPO_RE = /^[0-9X]{4}$/;
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const CREATED_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;
const DAY_IDS = DAYS.map((d) => d.id);
const GOAL_IDS = GOALS.map((g) => g.id);

// ---------- Teksty ----------

// Decyzja 18 z rozstrzygnięciem R7: znaki HTML na podobne typograficzne, „\” na „⧵” (U+29F5, przegląd końcowy); „&” przed literą albo „#”
// (także encje bez średnika, np. „&#39)”, „&quot)”), „Push & pull” zostaje; bez znaków sterujących poza \n
// i bez znaków niewidocznych (zero-width, sterowanie kierunkiem tekstu, separatory wiersza i akapitu);
// długość liczona w znakach (emoji nie jest przecinane na pół).
const INVISIBLE_RE = /[\u0000-\u0009\u000B-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202E\u2066-\u2069]/g;

export function sanitizeText(value, maxLen) {
    const s = String(value ?? '')
        .replace(INVISIBLE_RE, '')
        .replace(/</g, '‹')
        .replace(/>/g, '›')
        .replace(/"/g, '”')
        .replace(/'/g, '’')
        .replace(/`/g, 'ʼ')
        .replace(/\\/g, '⧵')
        .replace(/&(?=[#A-Za-z])/g, '＆');
    const chars = Array.from(s);
    return chars.length > maxLen ? chars.slice(0, maxLen).join('') : s;
}

// „Łukasz Dudziński” → „Łukasz D.”, „Jan Maria Rokita” → „Jan R.”, „Anna” → „Anna”.
export function trainerDisplayName(fullName) {
    const parts = String(fullName ?? '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${Array.from(parts[parts.length - 1])[0]}.`;
}

// Decyzja 14: znaki /\:*?"<>| usunięte, ciągi białych znaków zamienione na „_”.
export function planFileName(clientFirstName, planName) {
    const clean = (s) => String(s ?? '')
        .replace(/[/\\:*?"<>|\u0000-\u001F\u007F]/g, '')
        .trim()
        .replace(/\s+/g, '_');
    return `${['Plan', clean(clientFirstName), clean(planName)].filter(Boolean).join('_')}.bodybuild`;
}

// ---------- Budowa pliku (trener) ----------

const text = (v) => String(v ?? '').trim();
const numOrNull = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

// Decyzja 4: jeden tekst, gdy wszystkie treningi mają ten sam; inaczej „Trening A: …\n\nTrening B: …” bez pustych.
function combinedWarmup(workouts) {
    const texts = workouts.map((w) => text(w.warmup));
    if (texts.every((t) => t === texts[0])) return texts[0] || '';
    return workouts
        .map((w, i) => (texts[i] ? `${text(w.name)}: ${texts[i]}` : ''))
        .filter(Boolean)
        .join('\n\n');
}

export function buildPlanFile(plan, { trainerName, include = DEFAULT_INCLUDE, now = new Date() } = {}) {
    const inc = { ...DEFAULT_INCLUDE, ...(include || {}) };
    const intensity = plan.intensity === 'rpe' ? 'rpe' : 'rir';
    const weeks = plan.weeks;
    const workouts = plan.workouts || [];

    const out = {
        name: text(plan.name),
        goal: plan.goal || null,
        weeks,
        startDate: plan.startDate || null,
    };
    if (inc.params) out.intensity = intensity;
    if (inc.warmup) out.warmup = combinedWarmup(workouts);
    out.workouts = workouts.map((w) => {
        const wo = {
            name: text(w.name),
            exercises: (w.exercises || []).map((ex) => {
                const e = { name: text(ex.name) };
                if (inc.params) {
                    e.tempo = text(ex.tempo) || null;
                    e.restSec = numOrNull(ex.restSec);
                }
                e.note = inc.notes ? text(ex.note) || null : null;
                e.supersetWithNext = !!ex.supersetWithNext;
                e.weeks = Array.from({ length: weeks }, (_, i) => {
                    const v = weekValues(ex, i);
                    const wk = { sets: v.sets, reps: String(v.reps ?? ''), kg: numOrNull(v.kg) };
                    if (inc.params) wk[intensity] = numOrNull(v.effort);
                    return wk;
                });
                return e;
            }),
        };
        if (inc.days) wo.days = DAY_IDS.filter((d) => (w.days || []).includes(d));
        return wo;
    });

    return {
        format: PLAN_FILE_FORMAT,
        version: PLAN_FILE_VERSION,
        createdAt: now.toISOString(),
        trainer: { name: trainerDisplayName(trainerName) },
        plan: out,
    };
}

export function serializePlanFile(obj) {
    return JSON.stringify(obj, null, 2);
}

// ---------- Wczytanie pliku (klient) ----------

class Broken extends Error {}
const fail = () => { throw new Broken(); };
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
// Tylko własne pola: nigdy nie sięgamy do prototypu (np. „constructor”).
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const get = (o, k) => (has(o, k) ? o[k] : undefined);
const isBlank = (v) => v === undefined || v === null || v === '';

function reqObj(v) { return isObj(v) ? v : fail(); }

function reqArray(v, min, max) {
    if (!Array.isArray(v) || v.length < min || v.length > max) fail();
    return v;
}

function reqName(v) {
    if (typeof v !== 'string') fail();
    const s = sanitizeText(v, LEN.name).trim();
    return s || fail();
}

function optText(v, maxLen) {
    if (isBlank(v)) return null;
    if (typeof v !== 'string') fail();
    return sanitizeText(v, maxLen).trim() || null;
}

function intIn(v, min, max) {
    return Number.isInteger(v) && v >= min && v <= max ? v : fail();
}

function validDate(v) {
    const m = typeof v === 'string' ? DATE_RE.exec(v) : null;
    if (!m) fail();
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
    const date = new Date(y, mo - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) fail();
    return v;
}

function parseReps(v) {
    if (isBlank(v)) return '';
    if (typeof v !== 'string' || v.length > LEN.reps || !REPS_RE.test(v)) fail();
    const [a, b] = v.split('–');
    if (b !== undefined && Number(b) <= Number(a)) fail();
    return v;
}

function parseEffort(v, intensity) {
    if (isBlank(v)) return null;
    if (typeof v !== 'number') fail();
    if (intensity === 'rpe') return v >= 6 && v <= 10 && Number.isInteger(v * 2) ? v : fail();
    return intIn(v, 0, 5);
}

function parseWeek(raw, intensity) {
    const w = reqObj(raw);
    const kg = get(w, 'kg');
    if (!isBlank(kg) && !(typeof kg === 'number' && kg >= 0 && kg <= MAX_KG)) fail();
    const out = { sets: intIn(get(w, 'sets'), 1, MAX_SETS), reps: parseReps(get(w, 'reps')), kg: isBlank(kg) ? null : kg };
    // Klucz natężenia tylko ten, który wskazuje plan.intensity; drugi jest polem nieznanym.
    if (intensity && has(w, intensity)) out[intensity] = parseEffort(w[intensity], intensity);
    return out;
}

function parseExercise(raw, weeks, intensity) {
    const ex = reqObj(raw);
    const out = { name: reqName(get(ex, 'name')) };
    if (has(ex, 'tempo')) {
        const t = ex.tempo;
        if (isBlank(t)) out.tempo = null;
        else if (typeof t === 'string' && t.length === LEN.tempo && TEMPO_RE.test(t.toUpperCase())) out.tempo = t.toUpperCase();
        else fail();
    }
    if (has(ex, 'restSec')) out.restSec = isBlank(ex.restSec) ? null : intIn(ex.restSec, 0, MAX_REST);
    out.note = optText(get(ex, 'note'), LEN.note);
    const sup = get(ex, 'supersetWithNext');
    if (sup !== undefined && typeof sup !== 'boolean') fail();
    out.supersetWithNext = sup === true;
    // Decyzja 2: plik ma tygodnie rozwinięte, każda tablica ma dokładnie plan.weeks pozycji.
    const list = get(ex, 'weeks');
    if (!Array.isArray(list) || list.length !== weeks) fail();
    out.weeks = list.map((w) => parseWeek(w, intensity));
    return out;
}

function parseDays(v, used) {
    const days = reqArray(v, 0, DAY_IDS.length);
    const seen = new Set();
    for (const d of days) {
        if (typeof d !== 'string' || !DAY_IDS.includes(d) || seen.has(d)) fail();
        // Decyzja 5: jeden dzień tygodnia to najwyżej jeden trening planu.
        if (used.has(d)) fail();
        seen.add(d);
        used.add(d);
    }
    return DAY_IDS.filter((d) => seen.has(d));
}

function parsePlan(raw) {
    const p = reqObj(raw);
    const weeks = intIn(get(p, 'weeks'), 1, MAX_WEEKS);
    const out = { name: reqName(get(p, 'name')) };
    const goal = get(p, 'goal');
    if (!isBlank(goal) && typeof goal !== 'string') fail();
    out.goal = GOAL_IDS.includes(goal) ? goal : null;
    out.weeks = weeks;
    const start = get(p, 'startDate');
    out.startDate = isBlank(start) ? null : validDate(start);
    let intensity = null;
    if (has(p, 'intensity')) {
        intensity = p.intensity;
        if (intensity !== 'rir' && intensity !== 'rpe') fail();
        out.intensity = intensity;
    }
    if (has(p, 'warmup')) {
        const w = p.warmup;
        if (w !== null && typeof w !== 'string') fail();
        out.warmup = sanitizeText(w ?? '', LEN.warmup).trim();
    }
    const used = new Set();
    out.workouts = reqArray(get(p, 'workouts'), 1, MAX_WORKOUTS).map((rawW) => {
        const w = reqObj(rawW);
        const wo = {
            name: reqName(get(w, 'name')),
            exercises: reqArray(get(w, 'exercises'), 0, MAX_EXERCISES).map((ex) => parseExercise(ex, weeks, intensity)),
        };
        if (has(w, 'days')) wo.days = parseDays(w.days, used);
        return wo;
    });
    return out;
}

export function parsePlanFile(textIn) {
    if (typeof textIn !== 'string' || textIn.length > PLAN_FILE_MAX_CHARS) return { ok: false, error: 'FORMAT' };
    let obj;
    try {
        obj = JSON.parse(textIn);
    } catch {
        return { ok: false, error: 'FORMAT' };
    }
    if (!isObj(obj) || get(obj, 'format') !== PLAN_FILE_FORMAT) return { ok: false, error: 'FORMAT' };
    const version = get(obj, 'version');
    if (Number.isInteger(version) && version > PLAN_FILE_VERSION) return { ok: false, error: 'WERSJA' };
    if (version !== PLAN_FILE_VERSION) return { ok: false, error: 'USZKODZONY' };
    try {
        const createdAt = get(obj, 'createdAt');
        if (typeof createdAt !== 'string' || !CREATED_RE.test(createdAt)) fail();
        const trainer = reqObj(get(obj, 'trainer'));
        const name = get(trainer, 'name');
        if (typeof name !== 'string') fail();
        const file = {
            format: PLAN_FILE_FORMAT,
            version: PLAN_FILE_VERSION,
            createdAt,
            trainer: { name: sanitizeText(name, LEN.name).trim() },
            plan: parsePlan(get(obj, 'plan')),
        };
        return { ok: true, file };
    } catch (e) {
        if (e instanceof Broken) return { ok: false, error: 'USZKODZONY' };
        throw e;
    }
}
