// Plan z pliku u klienta (spec 11.2, decyzje 15, 16, 17, 19 i 20): zamiana wczytanego pliku na szablony
// i wpisy harmonogramu zwykłej części aplikacji, wartości tygodnia mezocyklu i ponowne wczytanie tego samego planu.
// Moduł czysty, bez DOM i bez bazy. Żadna funkcja nie zmienia argumentów.
// Plik przychodzi z parsePlanFile (trainerPlanFile.js), więc teksty są już oczyszczone przez sanitizeText.
// Daty to tekst RRRR-MM-DD w czasie lokalnym; liczymy przez parseDate/addDays z trainerPlan.js.

import {
    DAYS, addDays, mondayOf, parseDate, planEndDate, repsLowerBound, formatWeekLine,
    weekIndexFor as planWeekIndexFor,
} from './trainerPlan.js';

const norm = (s) => String(s ?? '').normalize('NFC').trim().toLowerCase();

// Decyzja 17: ten sam plan rozpoznajemy po imieniu trenera i nazwie planu.
export function planKey(file) {
    return `${norm(file?.trainer?.name)}|${norm(file?.plan?.name)}`;
}

// Decyzja 20: data z pliku, gdy jest dziś lub później; inaczej dziś, jeśli to poniedziałek,
// a w przeciwnym razie najbliższy poniedziałek.
export function defaultImportStart(fileStart, todayIso) {
    if (parseDate(fileStart) && fileStart >= todayIso) return fileStart;
    const monday = mondayOf(todayIso);
    return monday === todayIso ? todayIso : addDays(monday, 7);
}

// Cienka nakładka na weekIndexFor z trainerPlan.js (rozstrzygnięcie C4): 0…weeks−1, przycięte do zakresu.
export function weekIndexFor(startDate, weeks, dateIso) {
    return planWeekIndexFor({ startDate, weeks }, dateIso);
}

// Decyzja 19: wpis bez dat działa jak dotąd; z datami tylko od startDate do endDate włącznie.
export function isScheduleActive(schedule, dateIso) {
    if (!schedule) return false;
    if (schedule.startDate && dateIso < schedule.startDate) return false;
    if (schedule.endDate && dateIso > schedule.endDate) return false;
    return true;
}

// Plik zapisuje natężenie pod kluczem rir albo rpe (spec 11.1); formatWeekLine potrzebuje effort (P33).
function effortOf(week, intensity) {
    if (!week) return null;
    if (week.effort !== undefined) return week.effort;
    if (intensity && week[intensity] !== undefined) return week[intensity];
    return week.rir ?? week.rpe ?? null;
}

function weekAt(exPlan, weekIdx) {
    const weeks = exPlan?.weeks || [];
    return weeks[Math.min(Math.max(weekIdx, 0), weeks.length - 1)] || null;
}

// Wiersz pod nazwą ćwiczenia (decyzje 15 i 16, rozstrzygnięcie C5):
// „Tydz. W/N: ” + wiersz tygodnia z formatWeekLine + „superseria z: …” + uwaga; puste części pominięte.
export function planInfoText(exPlan, weekIdx) {
    const total = (exPlan?.weeks || []).length;
    const idx = Math.min(Math.max(weekIdx, 0), Math.max(total - 1, 0));
    const wk = weekAt(exPlan, idx) || {};
    const line = formatWeekLine(
        { sets: wk.sets, reps: wk.reps, kg: wk.kg, effort: effortOf(wk, exPlan?.intensity) },
        { intensity: exPlan?.intensity, tempo: exPlan?.tempo, restSec: exPlan?.restSec },
    );
    const parts = [line];
    if (exPlan?.supersetWith) parts.push(`superseria z: ${exPlan.supersetWith}`);
    if (exPlan?.note) parts.push(exPlan.note);
    const body = parts.filter(Boolean).join(' · ');
    const head = `Tydz. ${idx + 1}/${total}`;
    return body ? `${head}: ${body}` : head;
}

function setsFor(week) {
    const n = Number.isInteger(week?.sets) ? week.sets : 0;
    const set = { weight: typeof week?.kg === 'number' ? week.kg : 0, reps: repsLowerBound(week?.reps) ?? 0, type: 'normal' };
    return Array.from({ length: n }, () => ({ ...set }));
}

// „Trening A” → „A”; inne nazwy zostają całe.
function workoutLabel(name) {
    const m = /^Trening\s+(\p{L}|\d+)$/u.exec(String(name ?? '').trim());
    return m ? m[1] : String(name ?? '').trim();
}

const dowOf = (dayId) => DAYS.find((d) => d.id === dayId)?.dow;

export function toTemplates(file, { startDate, mode, existingIds = [], now = new Date() } = {}) {
    const plan = file.plan;
    const key = planKey(file);
    const start = mondayOf(startDate);
    const end = planEndDate({ startDate: start, weeks: plan.weeks });
    const intensity = plan.intensity ?? null;
    const taken = new Set(existingIds.map(String));
    let nextId = now.getTime();
    const freshId = () => {
        while (taken.has(String(nextId))) nextId += 1;
        taken.add(String(nextId));
        return nextId++;
    };

    const source = {
        kind: 'trainer-plan', trainer: file.trainer?.name ?? '', planName: plan.name, planKey: key,
        goal: plan.goal ?? null, startDate: start, endDate: end, weeks: plan.weeks, intensity,
        importedAt: now.toISOString(),
    };

    const templates = [];
    const schedules = [];
    for (const w of plan.workouts) {
        const id = freshId();
        const exercises = w.exercises.map((ex, i) => {
            const next = w.exercises[i + 1];
            const exPlan = {
                weeks: ex.weeks.map((wk) => ({ sets: wk.sets, reps: wk.reps, kg: wk.kg, effort: effortOf(wk, intensity) })),
                intensity,
                tempo: ex.tempo ?? null,
                restSec: ex.restSec ?? null,
                note: ex.note ?? null,
                supersetWith: ex.supersetWithNext && next ? next.name : null,
            };
            return {
                id: `${id}-${i + 1}`,
                type: 'strength',
                name: ex.name,
                sets: setsFor(exPlan.weeks[0]),
                plan: exPlan,
                planInfo: planInfoText(exPlan, 0),
            };
        });
        templates.push({ id, name: `${plan.name} · ${workoutLabel(w.name)}`, type: 'strength', source: { ...source }, exercises });
        const days = (w.days || []).map(dowOf).filter((d) => d !== undefined);
        if (mode === 'kalendarz' && days.length) schedules.push({ templateId: id, daysOfWeek: days, startDate: start, endDate: end });
    }
    return { templates, schedules };
}

// Kopia ćwiczeń szablonu z seriami i planInfo dla tygodnia mezocyklu wybranego dnia (decyzja 15).
export function applyPlanWeek(template, dateIso) {
    const src = template?.source || {};
    const idx = weekIndexFor(src.startDate, src.weeks, dateIso);
    return (template?.exercises || []).map((ex) => {
        if (!ex.plan) return structuredClone(ex);
        const copy = structuredClone(ex);
        copy.sets = setsFor(weekAt(ex.plan, idx));
        copy.planInfo = planInfoText(ex.plan, idx);
        return copy;
    });
}

export function findPlanTemplates(templates, key) {
    return (templates || []).filter((t) => t?.source?.kind === 'trainer-plan' && t.source.planKey === key);
}

// Ponowne wczytanie (Review Focus 2): „zastap” podmienia tylko szablony i wpisy tego planu,
// „kopia” dopisuje „ (kopia)” do nazw, „nowy” tylko dopisuje. Pozostałe zostają w tej samej kolejności.
export function mergeImport({ templates = [], schedules = [] } = {}, imported, how) {
    let keptTemplates = templates.slice();
    let keptSchedules = schedules.slice();
    let added = imported.templates.map((t) => ({ ...t }));
    if (how === 'zastap') {
        const key = imported.templates[0]?.source?.planKey;
        const gone = new Set((key ? findPlanTemplates(templates, key) : []).map((t) => String(t.id)));
        keptTemplates = templates.filter((t) => !gone.has(String(t?.id)));
        keptSchedules = schedules.filter((s) => !gone.has(String(s?.templateId)));
    } else if (how === 'kopia') {
        added = added.map((t) => ({ ...t, name: `${t.name} (kopia)` }));
    }
    return {
        templates: [...keptTemplates, ...added],
        schedules: [...keptSchedules, ...imported.schedules.map((s) => ({ ...s, daysOfWeek: [...s.daysOfWeek] }))],
    };
}
