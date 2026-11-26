// Model klienta Strefy trenera: wiek, inicjały, wyszukiwanie, sortowanie i tekst „Pokaż dane klienta”.

import { GOALS, STEPS, optionLabels, isVisible } from './trainerQuestionnaire.js';
import { TESTS, EXTRA_TESTS, scoreAssessment } from './trainerAssessment.js';
import { BASE_FIELDS, COMPOSITION_FIELDS, formatNumber } from './trainerMeasurements.js';

export { GOALS };

export function goalLabel(id) {
    const g = GOALS.find((x) => x.id === id);
    return g ? g.label : '';
}

// Cele dodatkowe z wywiadu do pokazania obok celu głównego: znane id, bez celu głównego i bez powtórzeń.
export function extraGoals(mainGoal, goalExtra) {
    const seen = new Set([mainGoal]);
    const out = [];
    for (const id of Array.isArray(goalExtra) ? goalExtra : []) {
        if (seen.has(id) || !goalLabel(id)) continue;
        seen.add(id);
        out.push(id);
    }
    return out;
}

// „1 sesja”, „3 sesje”, „5 sesji”, „22 sesje” (rozstrzygnięcie C3): forma „few” dla 2–4 na końcu, poza 12–14.
export function plural(n, one, few, many) {
    const abs = Math.abs(n);
    const form = abs === 1 ? one
        : abs % 10 >= 2 && abs % 10 <= 4 && !(abs % 100 >= 12 && abs % 100 <= 14) ? few
            : many;
    return `${n} ${form}`;
}

export function clientAge(client, today = new Date()) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((client && client.birthDate) || '');
    if (m) {
        const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
        let age = today.getFullYear() - y;
        if (today.getMonth() + 1 < mo || (today.getMonth() + 1 === mo && today.getDate() < d)) age -= 1;
        return age >= 0 ? age : null;
    }
    const a = client && client.age;
    return Number.isFinite(a) ? a : null;
}

export function initials(client) {
    const first = String((client && client.firstName) || '').trim();
    const last = String((client && client.lastName) || '').trim();
    return (Array.from(first)[0] || '').toLocaleUpperCase('pl') + (Array.from(last)[0] || '').toLocaleUpperCase('pl');
}

// Małe litery bez znaków diakrytycznych; ł nie rozkłada się w NFD, więc osobno.
function fold(s) {
    return String(s || '').toLocaleLowerCase('pl').replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function searchClients(clients, query) {
    const q = fold(query).trim();
    if (!q) return clients.slice();
    return clients.filter((c) => {
        const full = fold(`${c.firstName} ${c.lastName}`);
        const rev = fold(`${c.lastName} ${c.firstName}`);
        return full.includes(q) || rev.includes(q);
    });
}

export function sortClients(clients) {
    const col = new Intl.Collator('pl');
    return clients.slice().sort((a, b) =>
        col.compare(a.lastName || '', b.lastName || '') || col.compare(a.firstName || '', b.firstName || ''));
}

const SEX_LABELS = { K: 'Kobieta', M: 'Mężczyzna' };

const byDateNewest = (a, b) => String(b.date || '').localeCompare(String(a.date || ''))
    || String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));

const filled = (v) => v !== undefined && v !== null && String(v).trim() !== '';

// Odpowiedź na pytanie wywiadu jako tekst (pusta, gdy brak odpowiedzi i notatki).
function answerText(q, a) {
    const v = a ? a.value : undefined;
    let text = '';
    if (q.type === 'yesno') {
        text = v === true ? 'Tak' : v === false ? 'Nie' : '';
        const opts = v === true ? optionLabels(q, a) : [];
        if (opts.length) text = `${text} — ${opts.join(', ')}`;
    } else if (q.type === 'days') {
        const picked = new Set(Array.isArray(v) ? v : []);
        text = (q.options || []).filter((o) => picked.has(o.id)).map((o) => o.label).join(', ');
    } else if (filled(v)) text = String(v);
    const note = a && filled(a.note) ? String(a.note).trim() : '';
    if (text && note) return `${text} (${note})`;
    return text || note;
}

// Wielowierszowe uwagi: kolejne wiersze z wcięciem, żeby zostały pod swoim krokiem.
function notesText(v) {
    return String(v).trim().split(/\r?\n/).map((l) => l.trim()).filter(Boolean).join('\n  ');
}

// audio: rekordy interview_audio tego wywiadu (bez treści nagrania, liczy się tylko, że są).
function interviewLines(rec, audio = []) {
    const lines = ['', `Wywiad z dnia ${rec.date || '—'}`];
    const consent = rec.consentHealth || {};
    lines.push(consent.given
        ? `Zgoda na zapis danych o zdrowiu: tak (${consent.date || 'bez daty'})`
        : 'Zgoda na zapis danych o zdrowiu: nie');
    const answers = rec.answers || {};
    for (const step of STEPS) {
        // Bez zgody odpowiedzi o zdrowiu się nie liczą, nawet gdyby leżały w rekordzie.
        if (step.id === 'zdrowie' && !consent.given) continue;
        const rows = [];
        for (const q of step.questions) {
            if (!isVisible(q, answers)) continue;
            let text = '';
            if (q.id === 'cel_glowny') text = goalLabel(rec.goal);
            else if (q.id === 'cel_wlasny') text = filled(rec.goalOwnWords) ? String(rec.goalOwnWords).trim() : '';
            else if (q.id === 'cel_dodatkowy') {
                const goals = (rec.goalExtra || []).map(goalLabel).filter(Boolean).join(', ');
                const note = answers[q.id] && filled(answers[q.id].note) ? String(answers[q.id].note).trim() : '';
                text = goals && note ? `${goals} (${note})` : goals || note;
            } else text = answerText(q, answers[q.id]);
            if (text) rows.push(`- ${q.label}: ${text}`);
        }
        const note = rec.notes && filled(rec.notes[step.id]) ? notesText(rec.notes[step.id]) : '';
        if (note) rows.push(`- Uwagi: ${note}`);
        const clips = audio.filter((a) => a.stepId === step.id).length;
        if (clips) rows.push(`- Nagrania głosowe: ${clips} (do odsłuchu w aplikacji trenera)`);
        if (rows.length) lines.push(`${step.label}:`, ...rows);
    }
    return lines;
}

function sideText(v, unit) {
    if (!filled(v)) return '';
    const s = String(v).trim();
    return unit && /^\d+([.,]\d+)?$/.test(s) ? `${s.replace('.', ',')} ${unit}` : s;
}

function assessmentLines(rec) {
    const results = rec.results || {};
    const s = scoreAssessment(results);
    const lines = ['', `Ocena funkcjonalna z dnia ${rec.date || '—'}`,
        `Wynik: ${s.total} / ${s.max}${s.complete ? '' : ' (ocena niepełna)'}`];
    for (const t of TESTS) {
        const r = results[t.id] || {};
        if (t.bilateral) {
            if (!Number.isInteger(r.left) && !Number.isInteger(r.right)) continue;
            const side = (v) => (Number.isInteger(v) ? String(v) : '—');
            lines.push(`- ${t.label}: L ${side(r.left)}, P ${side(r.right)}`);
        } else if (Number.isInteger(r.score)) {
            lines.push(`- ${t.label}: ${r.score}`);
        }
    }
    const extra = rec.extra || {};
    for (const t of EXTRA_TESTS) {
        const e = extra[t.id] || {};
        const left = sideText(e.left, t.unit);
        const right = sideText(e.right, t.unit);
        if (left || right) lines.push(`- ${t.label}: L ${left || '—'}, P ${right || '—'}`);
    }
    for (const c of Array.isArray(extra.custom) ? extra.custom : []) {
        if (!c || (!filled(c.label) && !filled(c.value))) continue;
        lines.push(`- ${filled(c.label) ? String(c.label).trim() : 'Test własny'}: ${filled(c.value) ? String(c.value).trim() : '—'}`);
    }
    if (filled(rec.note)) lines.push(`Notatka: ${String(rec.note).trim()}`);
    return lines;
}

function planLine(p) {
    return `Plan: ${p.name || 'bez nazwy'} (${p.weeks} tyg., od ${p.startDate || '—'}, ${p.status === 'aktywny' ? 'aktywny' : 'nieaktywny'})`;
}

function sessionLine(r) {
    const sets = (r.exercises || []).reduce((n, ex) => n + (ex.sets || []).filter((x) => x && x.done).length, 0);
    const minutes = Math.round((r.durationSec || 0) / 60);
    const note = filled(r.note) ? `; notatka: ${String(r.note).trim()}` : '';
    return `Sesja ${r.date || '—'}: ${minutes} min, ${plural(sets, 'seria', 'serie', 'serii')}${note}`;
}

// Wszystkie znane pola pomiarów, także wyłączone w ustawieniach (dane mogły powstać, gdy były włączone).
function measurementFieldMap(settings) {
    const cfg = (settings && settings.measurementFields) || {};
    const custom = Array.isArray(cfg.customFields) ? cfg.customFields : (settings && settings.customFields) || [];
    const map = new Map();
    for (const f of [...BASE_FIELDS, ...COMPOSITION_FIELDS]) map.set(f.id, f);
    for (const f of custom) if (f && f.id && f.label) map.set(f.id, { id: f.id, label: f.label, unit: f.unit || '' });
    return map;
}

const POSE_LABELS = [['przod', 'Przód'], ['bok', 'Bok'], ['tyl', 'Tył']];

// photos: opisy zdjęć sylwetki tego pomiaru (bez treści zdjęć).
function measurementLines(rec, fields, photos = []) {
    const values = rec.values || {};
    const lines = ['', `Pomiary z dnia ${rec.date || '—'}`];
    const ids = [...fields.keys()].filter((id) => id in values);
    for (const id of Object.keys(values)) if (!fields.has(id)) ids.push(id);
    for (const id of ids) {
        const v = values[id];
        if (!filled(v)) continue;
        const f = fields.get(id) || { label: id, unit: '' };
        const text = typeof v === 'number' ? formatNumber(v) : String(v);
        lines.push(`- ${f.label}: ${text}${f.unit ? ` ${f.unit}` : ''}`);
    }
    const poses = new Set(photos.map((p) => p.pose));
    const shown = POSE_LABELS.filter(([id]) => poses.has(id)).map(([, label]) => label);
    if (shown.length) lines.push(`- Zdjęcia sylwetki: ${shown.join(', ')}`);
    return lines;
}

// „Pokaż dane klienta” (spec 9.2, RODO): wszystko, co zapisano o kliencie. Szkice (klienta, wywiadu,
// oceny) nie są danymi klienta, więc ich tu nie ma. options.settings daje nazwy własnych pól pomiarów.
export function clientDataText(client, records = [], today = new Date(), { settings = null } = {}) {
    const lines = [`${client.firstName || ''} ${client.lastName || ''}`.trim()];
    const age = clientAge(client, today);
    if (client.birthDate) lines.push(`Data urodzenia: ${client.birthDate}`);
    if (age !== null) lines.push(`Wiek: ${age}`);
    if (client.sex) lines.push(`Płeć: ${SEX_LABELS[client.sex] || client.sex}`);
    if (client.heightCm) lines.push(`Wzrost: ${client.heightCm} cm`);
    if (client.phone) lines.push(`Telefon: ${client.phone}`);
    if (client.email) lines.push(`E-mail: ${client.email}`);
    if (client.goal) lines.push(`Cel: ${goalLabel(client.goal)}`);
    if (client.photoConsent && client.photoConsent.given) lines.push(`Zgoda na zdjęcia sylwetki: tak (${client.photoConsent.date || 'bez daty'})`);
    if (client.note) lines.push(`Notatka: ${client.note}`);

    const of = (kind) => records.filter((r) => r && r.kind === kind).sort(byDateNewest);
    const interviews = of('interview').filter((r) => r.status !== 'szkic');
    const assessments = of('assessment');
    const measurements = of('measurement');

    const audio = records.filter((r) => r && r.kind === 'interview_audio');
    if (interviews.length) interviews.forEach((r) => lines.push(...interviewLines(r, audio.filter((a) => r.id && a.interviewId === r.id))));
    else lines.push('', 'Wywiad: brak');
    if (assessments.length) assessments.forEach((r) => lines.push(...assessmentLines(r)));
    else lines.push('', 'Ocena funkcjonalna: brak');
    if (measurements.length) {
        const fields = measurementFieldMap(settings);
        const photos = records.filter((r) => r && r.kind === 'measurement_photo');
        measurements.forEach((r) => lines.push(...measurementLines(r, fields, photos.filter((p) => r.id && p.measurementId === r.id))));
    } else lines.push('', 'Pomiary: brak');

    // Plany i zakończone sesje (szkice planów i sesje w toku nie są jeszcze danymi klienta).
    const plans = records.filter((r) => r && r.kind === 'plan').sort((a, b) => String(b.startDate || '').localeCompare(String(a.startDate || '')));
    const sessions = records.filter((r) => r && r.kind === 'session' && r.status === 'zakonczona').sort(byDateNewest);
    if (plans.length) lines.push('', ...plans.map(planLine));
    if (sessions.length) lines.push('', ...sessions.map(sessionLine));
    return lines.join('\n');
}
