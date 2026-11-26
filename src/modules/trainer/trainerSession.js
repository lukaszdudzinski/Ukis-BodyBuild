// Model sesji treningowej z klientem (decyzja 7). Funkcje nie mutują argumentów.
// Rekord jest samodzielny (nazwy i plan tygodnia skopiowane); `billing` pozwala wydaniu 3
// odliczyć pakiet z sesji `zakonczona` bez zmiany formatu.

import { weekValues, repsLowerBound, toIso, muscleGroupFor, parseKg } from './trainerPlan.js';

const BLANK_SET = (type = 'normal') => ({ kg: null, reps: null, type, done: false });

function plannedFor(ex, plan, weekIdx) {
    const v = weekValues(ex, weekIdx);
    return {
        sets: v.sets, reps: v.reps, kg: v.kg, effort: v.effort,
        intensity: plan.intensity ?? null,
        tempo: ex.tempo ?? '',
        restSec: ex.restSec ?? null,
        note: ex.note ?? '',
    };
}

export function newSession({ clientId, plan = null, workout = null, week = null, now = new Date() }) {
    const exercises = [];
    if (plan && workout) {
        const weekIdx = Math.max(0, (week || 1) - 1);
        for (const ex of workout.exercises || []) {
            const planned = plannedFor(ex, plan, weekIdx);
            const count = Math.max(1, planned.sets || 1);
            exercises.push({
                name: ex.name,
                muscleGroup: ex.muscleGroup ?? muscleGroupFor(ex.name),
                supersetWithNext: !!ex.supersetWithNext,
                planned,
                sets: Array.from({ length: count }, () => BLANK_SET()),
            });
        }
        // Ostatnie ćwiczenie nie ma z czym się łączyć: superseria z niego zniknęłaby po dodaniu ćwiczenia.
        if (exercises.length) exercises[exercises.length - 1].supersetWithNext = false;
    }
    return {
        kind: 'session',
        clientId,
        planId: plan && workout ? (plan.id ?? null) : null,
        workoutId: plan && workout ? (workout.id ?? null) : null,
        workoutName: workout ? workout.name : null,
        week: plan && workout ? (week || 1) : null,
        status: 'w_toku',
        date: toIso(now),
        startedAt: now.toISOString(),
        endedAt: null,
        activeSec: 0,
        durationSec: null,
        exercises,
        note: '',
        sessionRpe: null,
        billing: { status: 'do_rozliczenia', packageId: null },
    };
}

function edit(session, fn) {
    const next = structuredClone(session);
    fn(next);
    return next;
}

export function addExercise(session, { name, muscleGroup = null }) {
    return edit(session, (s) => {
        s.exercises.push({ name, muscleGroup: muscleGroup ?? null, supersetWithNext: false, planned: null, sets: [BLANK_SET()] });
    });
}

export function addSet(session, exIdx, type = 'normal') {
    if (!session.exercises[exIdx]) return session;
    return edit(session, (s) => { s.exercises[exIdx].sets.push(BLANK_SET(type)); });
}

export function removeSet(session, exIdx, setIdx) {
    if (!session.exercises[exIdx]?.sets[setIdx]) return session;
    return edit(session, (s) => { s.exercises[exIdx].sets.splice(setIdx, 1); });
}

export function setValue(session, exIdx, setIdx, field, raw) {
    if (!session.exercises[exIdx]?.sets[setIdx]) return session;
    let value;
    if (field === 'kg') {
        value = parseKg(raw);
        if (value === undefined) return session;
    } else if (field === 'reps') {
        const t = String(raw ?? '').trim();
        if (t === '') value = null;
        else if (/^\d{1,3}$/.test(t)) value = Number(t);
        else return session;
    } else return session;
    return edit(session, (s) => { s.exercises[exIdx].sets[setIdx][field] = value; });
}

// Decyzja 11: pusta seria bierze wartości z planu, a bez planu z poprzedniej serii.
export function toggleSet(session, exIdx, setIdx) {
    const ex = session.exercises[exIdx];
    if (!ex?.sets[setIdx]) return session;
    return edit(session, (s) => {
        const e = s.exercises[exIdx];
        const set = e.sets[setIdx];
        if (set.done) { set.done = false; return; }
        if (set.kg === null) {
            if (e.planned && e.planned.kg !== null && e.planned.kg !== undefined) set.kg = e.planned.kg;
            else for (let i = setIdx - 1; i >= 0; i--) if (e.sets[i].kg !== null) { set.kg = e.sets[i].kg; break; }
        }
        if (set.reps === null) {
            const low = e.planned ? repsLowerBound(e.planned.reps) : null;
            if (low !== null) set.reps = low;
            else for (let i = setIdx - 1; i >= 0; i--) if (e.sets[i].reps !== null) { set.reps = e.sets[i].reps; break; }
        }
        set.done = true;
    });
}

export function toggleSuperset(session, exIdx) {
    if (exIdx < 0 || exIdx >= session.exercises.length - 1) return session;
    return edit(session, (s) => { s.exercises[exIdx].supersetWithNext = !s.exercises[exIdx].supersetWithNext; });
}

export function setSessionNote(session, note) {
    return { ...session, note: String(note ?? '') };
}

// RPE całej sesji: 6–10 co 0,5 albo null (bez oceny). Błędna wartość zostawia sesję bez zmian.
export function setSessionRpe(session, rpe) {
    if (rpe === null || rpe === undefined || rpe === '') return { ...session, sessionRpe: null };
    const n = typeof rpe === 'number' ? rpe : NaN;
    if (!(n >= 6 && n <= 10 && Number.isInteger(n * 2))) return session;
    return { ...session, sessionRpe: n };
}

export function addActiveTime(session, seconds) {
    return { ...session, activeSec: (session.activeSec || 0) + Math.max(0, Math.round(seconds || 0)) };
}

// Seria robocza: odhaczona seria typu `normal` (decyzja 12).
export function isWorkingSet(set) {
    return !!set && set.done === true && set.type === 'normal';
}

export function sessionStats(session) {
    let doneSets = 0, workingSets = 0, volumeKg = 0;
    for (const ex of session.exercises || []) {
        for (const set of ex.sets || []) {
            if (!set.done) continue;
            doneSets++;
            if (isWorkingSet(set)) workingSets++;
            volumeKg += (set.kg || 0) * (set.reps || 0);
        }
    }
    return { doneSets, workingSets, volumeKg: Math.round(volumeKg * 10) / 10 };
}

export function finishSession(session, now = new Date()) {
    return { ...session, status: 'zakonczona', endedAt: now.toISOString(), durationSec: session.activeSec || 0 };
}

export function inProgressSession(sessions, clientId) {
    return (sessions || []).find((s) => s.status === 'w_toku' && s.clientId === clientId) || null;
}

export function finishedSessions(sessions) {
    return (sessions || [])
        .filter((s) => s.status === 'zakonczona')
        .sort((a, b) => String(b.endedAt || b.startedAt || '').localeCompare(String(a.endedAt || a.startedAt || '')));
}
