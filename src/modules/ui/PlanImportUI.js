// Wczytanie planu od trenera u klienta (spec 11.2, decyzje 5, 17, 19, 20, 21, 22; rozstrzygnięcia C17, R9, R10).
// Plik to obce dane. Całe DOM tego okna powstaje przez createElement/textContent, bez innerHTML z danymi.
// Teksty pliku przychodzą już oczyszczone z parsePlanFile (sanitizeText), a stary format szablonu
// czyścimy tutaj tą samą funkcją.
// TrainingUI podłącza się przez connect(), żeby nie było cyklu importów TrainingUI.js ↔ PlanImportUI.js.

import { parsePlanFile, PLAN_FILE_MESSAGES, PLAN_FILE_MAX_CHARS, sanitizeText } from '../trainer/trainerPlanFile.js';
import { toTemplates, mergeImport, findPlanTemplates, defaultImportStart, planKey } from '../trainer/trainerPlanImport.js';
import { DAYS, mondayOf, parseDate, toIso } from '../trainer/trainerPlan.js';
import { goalLabel, plural } from '../trainer/trainerModel.js';

const TEMPLATES_KEY = 'uki_workout_templates';
const SCHEDULES_KEY = 'uki_workout_schedules';
const OVERLAY_ID = 'plan-import-overlay';
const TOAST_ID = 'plan-import-toast';
// Bajty na znak w UTF-8 to najwyżej 4: większy plik na pewno przekracza PLAN_FILE_MAX_CHARS.
const MAX_FILE_BYTES = PLAN_FILE_MAX_CHARS * 4;

let ui = null;

const C = {
    orange: '#FF9800',
    text: '#eee',
    muted: '#aaa',
    green: '#2ECC71',
};

// ---------- DOM ----------

function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
        if (v === undefined || v === null || v === false) continue;
        if (k === 'style') node.style.cssText = v;
        else if (k === 'text') node.textContent = v;
        else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
        else if (k in node && k !== 'list') node[k] = v;
        else node.setAttribute(k, v === true ? '' : String(v));
    }
    for (const c of children.flat()) {
        if (c === null || c === undefined || c === false) continue;
        node.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return node;
}

const BTN = 'padding: 12px; border-radius: 12px; font-weight: bold; font-size: 0.95em; cursor: pointer; width: 100%;';
const primaryBtn = (text, onclick) => el('button', {
    type: 'button', text, onclick,
    style: `${BTN} background: rgba(46, 204, 113, 0.2); border: 1px solid rgba(46, 204, 113, 0.5); color: ${C.green};`,
});
const plainBtn = (text, onclick) => el('button', {
    type: 'button', text, onclick,
    style: `${BTN} background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff;`,
});

function closeOverlay() {
    document.getElementById(OVERLAY_ID)?.remove();
}

// Nakładka w stylu okna szablonów, nad nim (z-index 10000 → 10001).
function openOverlay(card, { labelledBy, role = 'dialog' } = {}) {
    closeOverlay();
    card.setAttribute('role', role);
    if (role === 'dialog') {
        card.setAttribute('aria-modal', 'true');
        if (labelledBy) card.setAttribute('aria-labelledby', labelledBy);
    }
    card.style.cssText = 'background: rgba(30, 30, 30, 0.95); border: 1px solid rgba(255, 152, 0, 0.4); border-radius: 20px; '
        + 'width: 100%; max-width: 480px; max-height: 85vh; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 20px; '
        + `box-sizing: border-box; color: ${C.text}; box-shadow: 0 15px 50px rgba(0,0,0,0.7); display: flex; flex-direction: column; gap: 12px;`;
    const overlay = el('div', {
        id: OVERLAY_ID,
        style: 'position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 10001; display: flex; justify-content: center; '
            + 'align-items: center; padding: 16px; box-sizing: border-box;',
        onclick: (e) => { if (e.target === overlay) closeOverlay(); },
        onkeydown: (e) => { if (e.key === 'Escape') closeOverlay(); },
    }, card);
    document.body.append(overlay);
    card.querySelector('button, input')?.focus();
    return overlay;
}

function showToast(text) {
    document.getElementById(TOAST_ID)?.remove();
    const toast = el('div', {
        id: TOAST_ID, role: 'status', text,
        style: 'position: fixed; left: 50%; transform: translateX(-50%); bottom: 96px; z-index: 10002; max-width: 90vw; '
            + 'background: rgba(20, 20, 20, 0.95); border: 1px solid rgba(46, 204, 113, 0.6); color: #fff; padding: 12px 16px; '
            + 'border-radius: 12px; font-weight: bold; box-shadow: 0 8px 24px rgba(0,0,0,0.5);',
    });
    document.body.append(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ---------- Pamięć ----------

function readList(key) {
    try {
        const v = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(v) ? v : [];
    } catch {
        return [];
    }
}

function getTemplates() {
    return ui?.getTemplates ? ui.getTemplates() : readList(TEMPLATES_KEY);
}

function save(templates, schedules) {
    try {
        localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
        if (schedules) localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
        return true;
    } catch {
        return false;
    }
}

function refresh() {
    document.getElementById('templates-modal-overlay')?.remove();
    ui?.loadTemplatesDialog?.();
    ui?.renderCalendar?.();
}

// ---------- Stary format szablonu ({ name, exercises }) ----------

const BAD_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

// Kopia obcego JSON-a: teksty przez sanitizeText, liczby tylko skończone, bez kluczy prototypu.
function cleanValue(value, key, depth) {
    if (depth > 8) return undefined;
    if (typeof value === 'string') return sanitizeText(value, key === 'name' ? 120 : 2000);
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value === 'boolean' || value === null) return value;
    if (Array.isArray(value)) return value.slice(0, 500).map((v) => cleanValue(v, null, depth + 1)).filter((v) => v !== undefined);
    if (typeof value === 'object') {
        const out = {};
        for (const k of Object.keys(value)) {
            if (BAD_KEYS.has(k)) continue;
            const v = cleanValue(value[k], k, depth + 1);
            if (v !== undefined) out[k] = v;
        }
        return out;
    }
    return undefined;
}

function parseLegacyTemplate(text) {
    if (typeof text !== 'string' || text.length > PLAN_FILE_MAX_CHARS) return null;
    let obj;
    try {
        obj = JSON.parse(text);
    } catch {
        return null;
    }
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
    if (typeof obj.name !== 'string' || !obj.name.trim() || !Array.isArray(obj.exercises)) return null;
    const t = cleanValue(obj, null, 0);
    t.name = t.name.trim();
    // R12a: nazwa z samych znaków niewidocznych jest pusta dopiero po sanitizeText.
    if (!t.name) return null;
    // Pochodzenie z planu trenera daje tylko import pliku planu, nie stary szablon.
    delete t.source;
    return t;
}

function freshId(templates) {
    const taken = new Set(templates.map((t) => String(t?.id)));
    let id = Date.now();
    while (taken.has(String(id))) id += 1;
    return id;
}

function addLegacyTemplate(template) {
    const templates = getTemplates();
    templates.push({ ...template, id: freshId(templates) });
    if (!save(templates)) {
        PlanImportUI.showError('Nie udało się zapisać szablonu w pamięci telefonu.');
        return;
    }
    showToast(`Szablon dodany: ${template.name}`);
    refresh();
}

// ---------- Podgląd planu ----------

const dayLabels = (days) => DAYS.filter((d) => (days || []).includes(d.id)).map((d) => d.label).join(', ');

function addPlan(file, { how, mode, startDate }) {
    const current = { templates: getTemplates(), schedules: readList(SCHEDULES_KEY) };
    const imported = toTemplates(file, { startDate, mode, existingIds: current.templates.map((t) => t?.id) });
    const merged = mergeImport(current, imported, how);
    if (!save(merged.templates, merged.schedules)) {
        PlanImportUI.showError('Nie udało się zapisać planu w pamięci telefonu.');
        return;
    }
    closeOverlay();
    showToast(`Plan dodany: ${file.plan.name}`);
    refresh();
}

function renderPreview(file, how) {
    const plan = file.plan;
    const todayIso = toIso(new Date());
    // Rozstrzygnięcie R10c: pole pokazuje poniedziałek, który trafi do zapisu (toTemplates i tak bierze mondayOf).
    const defaultStart = mondayOf(defaultImportStart(plan.startDate, todayIso));
    const copy = how === 'kopia';
    // Bez dni w pliku nie ma czego wpisać do kalendarza: tylko szablony.
    const hasDays = plan.workouts.some((w) => (w.days || []).length > 0);
    const templatesOnly = copy || !hasDays;

    const goal = goalLabel(plan.goal);
    const workouts = plan.workouts.map((w) => el('div', {
        style: 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px 12px;',
    },
    el('div', { style: 'display: flex; justify-content: space-between; gap: 8px;' },
        el('strong', { text: w.name, style: 'color: #00BFFF;' }),
        w.days?.length ? el('span', { text: dayLabels(w.days), style: `color: ${C.orange}; font-weight: bold; white-space: nowrap;` }) : null),
    el('ul', { style: `margin: 6px 0 0 0; padding-left: 18px; color: ${C.text}; font-size: 0.9em; line-height: 1.5;` },
        w.exercises.map((ex) => el('li', { text: ex.name })))));

    const radioCal = el('input', { type: 'radio', name: 'plan-import-mode', id: 'plan-import-mode-cal', value: 'kalendarz', checked: !templatesOnly, disabled: templatesOnly });
    const radioTpl = el('input', { type: 'radio', name: 'plan-import-mode', id: 'plan-import-mode-tpl', value: 'szablony', checked: templatesOnly });
    const dateInput = el('input', {
        type: 'date', id: 'plan-import-start', value: defaultStart,
        style: 'background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; padding: 8px; font-size: 1em;',
        // R12b: poniedziałek dopiero po wyjściu z pola; „change” przychodzi już w trakcie wybierania daty (iOS).
        // Zapis i tak bierze mondayOf.
        onblur: () => { if (parseDate(dateInput.value)) dateInput.value = mondayOf(dateInput.value); },
    });
    const radioRow = (input, label) => el('label', {
        for: input.id, style: `display: flex; align-items: center; gap: 8px; padding: 4px 0; color: ${input.disabled ? '#777' : C.text};`,
    }, input, label);

    const card = el('div', {},
        el('p', { text: `Od trenera: ${file.trainer?.name || 'Trener'}`, style: `margin: 0; color: ${C.muted};` }),
        el('h3', { id: 'plan-import-title', text: plan.name, style: `margin: 0; color: ${C.orange}; font-size: 1.2em;` }),
        goal ? el('p', { text: `Cel: ${goal}`, style: 'margin: 0;' }) : null,
        el('p', {
            text: `${plural(plan.weeks, 'tydzień', 'tygodnie', 'tygodni')} · ${plural(plan.workouts.length, 'trening', 'treningi', 'treningów')}`,
            style: 'margin: 0;',
        }),
        workouts,
        el('fieldset', { style: 'border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 8px 12px; margin: 0;' },
            el('legend', { text: 'Jak dodać?', style: `color: ${C.orange}; font-weight: bold; padding: 0 4px;` }),
            radioRow(radioCal, 'Szablony + kalendarz'),
            radioRow(radioTpl, 'Tylko szablony'),
            !hasDays ? el('p', { text: 'W pliku nie ma dni treningów, więc plan trafi tylko do szablonów.', style: `margin: 4px 0 0 0; color: ${C.muted}; font-size: 0.85em;` }) : null),
        el('label', { for: 'plan-import-start', style: 'display: flex; flex-direction: column; gap: 4px;' },
            el('span', { text: 'Start planu', style: `color: ${C.orange}; font-weight: bold;` }),
            dateInput),
        el('p', { text: 'Tydzień planu zaczyna się w poniedziałek.', style: `margin: 0; color: ${C.muted}; font-size: 0.85em;` }),
        primaryBtn('Dodaj plan', () => addPlan(file, {
            how,
            mode: !templatesOnly && radioCal.checked ? 'kalendarz' : 'szablony',
            startDate: mondayOf(dateInput.value) || defaultStart,
        })),
        plainBtn('Anuluj', closeOverlay));
    openOverlay(card, { labelledBy: 'plan-import-title' });
}

// Rozstrzygnięcie R10a/b: przed „Zastąp” lista szablonów do usunięcia; kopia bez nowych dni w kalendarzu.
function renderQuestion(file, existing) {
    const card = el('div', {},
        el('h3', { id: 'plan-import-title', text: 'Ten plan już jest w Twoich szablonach.', style: `margin: 0; color: ${C.orange}; font-size: 1.1em;` }),
        el('p', { text: '„Zastąp” usunie te szablony i ich dni w kalendarzu:', style: 'margin: 0;' }),
        el('ul', { style: 'margin: 0; padding-left: 18px; line-height: 1.5;' }, existing.map((t) => el('li', { text: String(t?.name ?? '') }))),
        el('p', { text: 'Kopia trafi tylko do szablonów, bez dni w kalendarzu.', style: `margin: 0; color: ${C.muted};` }),
        primaryBtn('Zastąp', () => renderPreview(file, 'zastap')),
        plainBtn('Dodaj jako kopię', () => renderPreview(file, 'kopia')),
        plainBtn('Anuluj', closeOverlay));
    openOverlay(card, { labelledBy: 'plan-import-title' });
}

export const PlanImportUI = {
    connect(trainingUI) {
        ui = trainingUI;
    },

    // Rozstrzygnięcie C17: najpierw parsePlanFile; tylko przy FORMAT próbujemy starego szablonu { name, exercises }.
    async handleText(text) {
        const res = parsePlanFile(text);
        if (res.ok) {
            PlanImportUI.openPreview(res.file);
            return;
        }
        if (res.error === 'FORMAT') {
            const legacy = parseLegacyTemplate(text);
            if (legacy) {
                addLegacyTemplate(legacy);
                return;
            }
        }
        PlanImportUI.showError(PLAN_FILE_MESSAGES[res.error] || PLAN_FILE_MESSAGES.FORMAT);
    },

    async handleFile(file) {
        if (!file) return;
        if (file.size > MAX_FILE_BYTES) {
            PlanImportUI.showError(PLAN_FILE_MESSAGES.FORMAT);
            return;
        }
        let text;
        try {
            text = await file.text();
        } catch {
            PlanImportUI.showError(PLAN_FILE_MESSAGES.FORMAT);
            return;
        }
        await PlanImportUI.handleText(text);
    },

    openPreview(file) {
        const existing = findPlanTemplates(getTemplates(), planKey(file));
        if (existing.length) renderQuestion(file, existing);
        else renderPreview(file, 'nowy');
    },

    showError(message) {
        const card = el('div', {},
            el('div', { role: 'alert', style: 'display: flex; flex-direction: column; gap: 8px;' },
                el('strong', { text: 'Nie można wczytać pliku', style: `color: ${C.orange}; font-size: 1.05em;` }),
                el('p', { text: message, style: 'margin: 0; line-height: 1.5;' })),
            plainBtn('Zamknij', closeOverlay));
        openOverlay(card, { role: 'dialog' });
        card.setAttribute('aria-label', 'Błąd pliku');
    },
};
