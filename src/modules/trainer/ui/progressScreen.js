// Postępy klienta (trasa progress { clientId }, spec 9.7): wykres ciężaru roboczego albo szacowanego 1RM
// w wybranym ćwiczeniu, sesje w miesiącu i serie robocze w tygodniu według grup. Liczone tylko z zakończonych sesji.
// Dane do DOM tylko przez h() jako węzły tekstowe.
import { h, icon } from './dom.js';
import { lineChart } from './chart.js';
import { groupCountChips, formatDateWords } from './planScreens.js';
import { formatNumber } from '../trainerMeasurements.js';
import { plural } from '../trainerModel.js';
import { addDays, mondayOf, planSettings, toIso } from '../trainerPlan.js';
import { finishedSessions } from '../trainerSession.js';
import {
    bestSet, exerciseNames, workingWeightSeries, e1rmSeries, sessionsPerMonth, weeklySetsByGroup,
} from '../trainerProgress.js';
import { canonicalExerciseName } from '../../../data/ExerciseCatalog.js';

const fullName = (c) => `${c.firstName || ''} ${c.lastName || ''}`.trim();

const MODES = [
    { id: 'weight', label: 'Ciężar roboczy', series: workingWeightSeries },
    { id: 'e1rm', label: 'Szacowane 1RM', series: e1rmSeries },
];

// Podpis kafelka „Postępy” w karcie klienta: „2 sesje w tym miesiącu” albo „brak sesji”.
export function progressTileSub(sessions, today = new Date()) {
    if (!finishedSessions(sessions).length) return 'brak sesji';
    const [month] = sessionsPerMonth(sessions, today, 1);
    return `${plural(month.count, 'sesja', 'sesje', 'sesji')} w tym miesiącu`;
}

// Ćwiczenie na start: pierwsze z ciężarem roboczym (bestSet) w ostatniej sesji, która takie ma;
// bez takiej sesji (same ćwiczenia z ciężarem własnym) pierwsze z serią roboczą w ostatniej sesji.
// `names` to nazwy główne (exerciseNames), więc dawną nazwę z katalogu zamieniamy na nową.
function defaultExercise(finished, names) {
    const known = (ex) => names.includes(canonicalExerciseName(ex.name));
    for (const s of finished) {
        const weighted = (s.exercises || []).find((ex) => known(ex) && bestSet(ex));
        if (weighted) return canonicalExerciseName(weighted.name);
    }
    for (const s of finished) {
        const hit = (s.exercises || []).find(known);
        if (hit) return canonicalExerciseName(hit.name);
    }
    return names[0];
}

// Zachowuje fokus przy przerysowaniu części ekranu (po data-key); wyłączony przycisk oddaje fokus „zastępcy”.
function keepFocus(box, paint, fallback = {}) {
    const key = box.contains(document.activeElement) ? document.activeElement.dataset.key : undefined;
    paint();
    if (key === undefined) return;
    const el = box.querySelector(`[data-key="${key}"]`);
    if (el && !el.disabled) el.focus();
    else if (fallback[key]) box.querySelector(`[data-key="${fallback[key]}"]`)?.focus();
}

function renderProgress(root, params, ctx) {
    const client = params.clientId ? ctx.vault.get(params.clientId) : null;
    if (!client) { ctx.show('clients', {}, { reset: true }); return; }
    const sessions = ctx.vault.list('session', client.id);
    const finished = finishedSessions(sessions);
    const head = h('section', { class: 'card tz-stack' },
        h('h2', { class: 'hd' }, 'Postępy'),
        h('p', { class: 'sub' }, fullName(client)));
    if (!finished.length) {
        root.append(h('div', { class: 'tz-stack' }, head,
            h('section', { class: 'card' }, h('p', { class: 'sub tz-empty' }, 'Postępy pojawią się po pierwszej zakończonej sesji.'))));
        return;
    }

    const today = toIso(new Date());
    const { weeklySetsLimit } = planSettings(ctx.vault.list('trainer_settings')[0] || null);
    const names = exerciseNames(sessions);
    const state = { name: defaultExercise(finished, names), mode: 'weight', monday: mondayOf(today) };

    // --- Ćwiczenie: wykres i szacowane 1RM ---
    const exerciseBox = h('section', { class: 'card tz-stack' });
    const paintExercise = () => {
        if (!names.length) {
            exerciseBox.replaceChildren(h('h3', { class: 'hd tz-set-hd' }, 'Ćwiczenia'),
                h('p', { class: 'mut' }, 'Brak odhaczonych serii.'));
            return;
        }
        const mode = MODES.find((m) => m.id === state.mode);
        const select = h('select', { class: 'in', 'aria-label': 'Ćwiczenie', value: state.name, dataset: { key: 'exercise' },
            onchange: (e) => { state.name = e.target.value; keepFocus(exerciseBox, paintExercise); } },
        names.map((n) => h('option', { value: n }, n)));
        const chips = MODES.map((m) => h('button', {
            type: 'button', class: `chip${m.id === state.mode ? ' chipon' : ''}`, 'aria-pressed': String(m.id === state.mode),
            dataset: { key: `mode-${m.id}` },
            onclick: () => { state.mode = m.id; keepFocus(exerciseBox, paintExercise); },
        }, m.label));
        const e1rm = e1rmSeries(sessions, state.name);
        const last = e1rm[e1rm.length - 1];
        exerciseBox.replaceChildren(
            h('label', { class: 'tz-field' }, h('span', { class: 'sub' }, 'Ćwiczenie'), select),
            h('div', { class: 'tz-row', role: 'group', 'aria-label': 'Wykres' }, chips),
            lineChart({ label: mode.label, unit: 'kg' }, mode.series(sessions, state.name)),
            last ? h('p', { class: 'tz-stat' }, `Szacowane 1RM: ${formatNumber(last.value)} kg`) : null,
            last ? h('p', { class: 'mut' }, `z sesji ${formatDateWords(last.date)}`) : null);
    };

    // --- Sesje w miesiącu: wiersz z liczbą i paskiem ---
    const months = sessionsPerMonth(sessions, today);
    const most = Math.max(1, ...months.map((m) => m.count));
    const monthsBox = h('section', { class: 'card tz-stack' },
        h('h3', { class: 'hd tz-set-hd' }, 'Sesje w miesiącu'),
        h('div', { class: 'tz-stack tz-tight' }, months.map((m) => h('div', { class: 'tz-month' },
            h('span', { class: 'sub' }, m.label),
            h('strong', { class: 'tz-month-count' }, String(m.count)),
            h('div', { class: 'tz-bar', 'aria-hidden': 'true' },
                h('div', { class: 'tz-bar-fill', style: { width: `${Math.round((m.count / most) * 100)}%` } }))))));

    // --- Serie robocze w tygodniu: ‹ tydzień › i żeton na grupę ---
    const oldestDate = finished.map((s) => String(s.date || '')).filter(Boolean).sort()[0];
    const oldestMonday = mondayOf(oldestDate) || state.monday;
    const thisMonday = state.monday;
    const weekBox = h('section', { class: 'card tz-stack tz-weekbox' });
    const paintWeek = () => {
        const sunday = addDays(state.monday, 6);
        const step = (days) => { state.monday = addDays(state.monday, days); keepFocus(weekBox, paintWeek, { 'week-prev': 'week-next', 'week-next': 'week-prev' }); };
        const counts = groupCountChips(weeklySetsByGroup(sessions, state.monday), weeklySetsLimit);
        weekBox.replaceChildren(
            h('h3', { class: 'hd tz-set-hd' }, 'Serie robocze w tygodniu'),
            h('div', { class: 'tz-between' },
                h('button', { type: 'button', class: 'tz-icbtn', 'aria-label': 'Poprzedni tydzień', title: 'Poprzedni tydzień',
                    dataset: { key: 'week-prev' }, disabled: state.monday <= oldestMonday, onclick: () => step(-7) }, icon('chevron-left')),
                h('span', { class: 'sub' }, `${formatDateWords(state.monday, { year: false })} – ${formatDateWords(sunday)}`),
                h('button', { type: 'button', class: 'tz-icbtn', 'aria-label': 'Następny tydzień', title: 'Następny tydzień',
                    dataset: { key: 'week-next' }, disabled: state.monday >= thisMonday, onclick: () => step(7) }, icon('chevron-right'))),
            counts.length ? h('div', { class: 'tz-row' }, counts) : h('p', { class: 'mut' }, 'Brak serii roboczych w tym tygodniu.'));
    };

    paintExercise();
    paintWeek();
    root.append(h('div', { class: 'tz-stack' }, head, exerciseBox, monthsBox, weekBox));
}

export function registerProgressScreen(register) {
    register('progress', renderProgress);
}
