// Plany klienta: lista planów (trasa plans), przegląd planu (trasa plan: tygodnie, licznik serii, „Kopiuj tydzień”),
// podpis kafelka „Plan” w karcie klienta i jedno miejsce, które ustawia plan jako aktywny (rozstrzygnięcie C16).
// Dane planu trafiają do DOM wyłącznie przez h() jako węzły tekstowe.
import { h, icon } from './dom.js';
import { goalLabel } from '../trainerModel.js';
import {
    DAYS, MUSCLE_GROUPS, activePlan, mesoWeek, planGroup, planEndDate, plansOverlap, parseDate, toIso,
    weekValues, copyWeek, plannedSetsByGroup, planSettings, formatWeekLine,
} from '../trainerPlan.js';
import { planStartButton } from './sessionScreen.js';

const SAVE_FAILED = 'Nie udało się zapisać. Spróbuj jeszcze raz.';

// „30 listopada 2026”; z weekday: „poniedziałek, 30 listopada 2026”.
export function formatDateWords(iso, { weekday = false, year = true } = {}) {
    const d = parseDate(iso);
    if (!d) return '';
    return d.toLocaleDateString('pl-PL', { weekday: weekday ? 'long' : undefined, day: 'numeric', month: 'long', year: year ? 'numeric' : undefined });
}

// Stan planu jednym zwrotem: „tydz. 2/6”, „start 30 listopada”, „zakończony 10 stycznia 2027”.
export function planStateText(plan, today = new Date()) {
    const iso = typeof today === 'string' ? today : toIso(today);
    const week = mesoWeek(plan, iso);
    if (week) return `tydz. ${week}/${plan.weeks}`;
    if (String(plan.startDate) > iso) return `start ${formatDateWords(plan.startDate, { year: false })}`;
    return `zakończony ${formatDateWords(planEndDate(plan))}`;
}

// Podpis kafelka „Plan” (rozstrzygnięcie C2).
export function planTileSub(plans, today = new Date()) {
    const active = activePlan(plans, today);
    if (active) return `${active.name} · ${planStateText(active, today)}`;
    return (plans || []).some((p) => p.status === 'aktywny') ? 'plan zakończony' : 'brak planu';
}

// Plan staje się aktywny, a inne aktywne plany klienta, które nakładają się z nim w czasie, dostają „nieaktywny”.
// Następny blok zaplanowany po końcu trwającego planu go nie wyłącza (R3).
// Najpierw zapis tego planu: błąd w połowie nie zostawi klienta bez aktywnego planu.
export async function activatePlan(ctx, plan) {
    const saved = await ctx.vault.put({ ...plan, status: 'aktywny' });
    for (const other of ctx.vault.list('plan', saved.clientId)) {
        if (other.id === saved.id || other.status !== 'aktywny' || !plansOverlap(other, saved)) continue;
        await ctx.vault.put({ ...other, status: 'nieaktywny' });
    }
    return saved;
}

const GROUPS = [
    { id: 'aktywny', label: 'Aktywny' },
    { id: 'inne', label: 'Pozostałe' },
    { id: 'archiwum', label: 'Archiwum' },
];

function renderPlans(root, params, ctx) {
    const client = params.clientId ? ctx.vault.get(params.clientId) : null;
    if (!client) { ctx.show('clients', {}, { reset: true }); return; }
    const today = toIso(new Date());
    const plans = ctx.vault.list('plan', client.id)
        .sort((a, b) => String(b.startDate || '').localeCompare(String(a.startDate || '')) || String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));

    const row = (p) => h('button', { type: 'button', class: 'tz-client', onclick: () => ctx.show('plan', { clientId: client.id, planId: p.id }) },
        h('span', { class: 'tz-avatar', 'aria-hidden': 'true' }, icon('dumbbell')),
        h('span', { class: 'tz-client-main' },
            h('span', { class: 'tz-client-name' }, p.name),
            h('span', { class: 'mut' }, `${p.weeks} tyg. · ${planStateText(p, today)}`)));

    const sections = GROUPS.map((g) => {
        const list = plans.filter((p) => planGroup(p, today) === g.id);
        if (!list.length) return null;
        return h('section', { class: 'card tz-stack', dataset: { grupa: g.id } },
            h('h3', { class: 'hd tz-set-hd' }, g.label),
            h('div', { class: 'tz-list' }, list.map(row)));
    }).filter(Boolean);

    root.append(h('div', { class: 'tz-stack' },
        h('section', { class: 'card tz-stack' },
            h('div', { class: 'tz-between' },
                h('div', {},
                    h('h2', { class: 'hd' }, 'Plany'),
                    h('p', { class: 'sub' }, `${client.firstName || ''} ${client.lastName || ''}`.trim())),
                h('button', { type: 'button', class: 'btn', onclick: () => ctx.show('plan-edit', { clientId: client.id }) }, icon('plus'), 'Plan'))),
        sections.length ? sections : h('section', { class: 'card' },
            h('p', { class: 'sub tz-empty' }, 'Klient nie ma jeszcze planu. Dodaj pierwszy.'))));
}

// ---------- Przegląd planu (trasa plan { clientId, planId, week? }) ----------

const STATUS_TEXT = { aktywny: 'aktywny', nieaktywny: 'nieaktywny', archiwum: 'w archiwum' };

const COPY_CHANGES = [
    { id: 'none', label: 'bez zmian', change: { type: 'none' } },
    { id: 'kg25', label: '+2,5 kg', change: { type: 'kg', amount: 2.5 } },
    { id: 'kg5', label: '+5 kg', change: { type: 'kg', amount: 5 } },
    { id: 'reps', label: '+1 powtórzenie', change: { type: 'reps' } },
    { id: 'sets', label: '+1 seria', change: { type: 'sets' } },
];

let copySeq = 0;

// Nagłówek planu: „Tydz. 2 z 6”, „Start 30 listopada 2026” albo „Plan zakończony”.
function headerState(plan, today) {
    const week = mesoWeek(plan, today);
    if (week) return `Tydz. ${week} z ${plan.weeks}`;
    if (String(plan.startDate) > today) return `Start ${formatDateWords(plan.startDate)}`;
    return 'Plan zakończony';
}

const daysText = (days) => DAYS.filter((d) => (days || []).includes(d.id)).map((d) => d.label).join(', ');

// Okno „Kopiuj tydzień”: zapisuje plan z tygodniem fromIdx + 1 skopiowanym z fromIdx (copyWeek).
// Zwraca zapisany plan albo null (Anuluj, Escape, tło, blokada Strefy przez ctx.registerOverlay).
function copyWeekDialog(ctx, plan, fromIdx) {
    return new Promise((resolve) => {
        const seq = ++copySeq;
        const titleId = `tz-copy-${seq}`;
        let unregister = () => {};
        let closed = false;
        let busy = false;
        const close = (value) => {
            if (closed) return;
            closed = true;
            unregister();
            backdrop.remove();
            document.removeEventListener('keydown', onKey, true);
            resolve(value);
        };
        const onKey = (e) => { if (e.key === 'Escape' && !busy) { e.preventDefault(); close(null); } };

        let choice = COPY_CHANGES[0];
        const radios = COPY_CHANGES.map((c) => {
            const input = h('input', { type: 'radio', name: `tz-copy-change-${seq}`, value: c.id, checked: c === choice });
            input.addEventListener('change', () => { if (input.checked) { choice = c; paintKg(); } });
            return h('label', { class: 'tz-check' }, input, h('span', {}, c.label));
        });

        // Przy zmianie ciężaru: ćwiczenia tygodnia z wpisanym kg, domyślnie wszystkie zaznaczone.
        const withKg = [];
        for (const w of plan.workouts || []) {
            for (const ex of w.exercises || []) {
                if (typeof weekValues(ex, fromIdx).kg === 'number') withKg.push({ ex, w });
            }
        }
        const picked = new Set(withKg.map(({ ex }) => ex.id));
        const kgList = withKg.length
            ? withKg.map(({ ex, w }) => {
                const cb = h('input', { type: 'checkbox', checked: true });
                cb.addEventListener('change', () => { if (cb.checked) picked.add(ex.id); else picked.delete(ex.id); });
                return h('label', { class: 'tz-check' }, cb,
                    h('span', { class: 'tz-stack tz-tight' }, h('span', {}, ex.name), h('span', { class: 'mut' }, w.name)));
            })
            : h('p', { class: 'mut' }, 'W tym tygodniu żadne ćwiczenie nie ma ciężaru.');
        const kgBox = h('fieldset', { class: 'tz-stack tz-tight tz-copy-kg' },
            h('legend', { class: 'sub' }, 'Ćwiczenia ze zmianą ciężaru'), kgList);
        const paintKg = () => { kgBox.hidden = choice.change.type !== 'kg'; };
        paintKg();

        const error = h('p', { class: 'tz-error', role: 'alert' });
        const ok = h('button', { type: 'button', class: 'btn' }, icon('copy'), `Kopiuj na tydzień ${fromIdx + 2}`);
        const cancel = h('button', { type: 'button', class: 'ghost', onclick: () => { if (!busy) close(null); } }, 'Anuluj');
        ok.addEventListener('click', async () => {
            const change = { ...choice.change };
            if (change.type === 'kg') change.exerciseIds = [...picked];
            busy = true;
            ok.disabled = true;
            cancel.disabled = true;
            error.textContent = '';
            try {
                const saved = await ctx.vault.put(copyWeek(plan, fromIdx, change));
                close(saved);
            } catch (e) {
                console.error('[Strefa trenera] kopiowanie tygodnia:', e && e.message);
                if (closed) return;
                error.textContent = SAVE_FAILED;
                busy = false;
                ok.disabled = false;
                cancel.disabled = false;
            }
        });

        const dialog = h('div', { class: 'card tz-dialog tz-picker', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId },
            h('h2', { class: 'hd', id: titleId }, `Kopiuj tydzień ${fromIdx + 1}`),
            h('p', { class: 'sub' }, `Tydzień ${fromIdx + 2} dostanie wartości tygodnia ${fromIdx + 1} z jedną zmianą. Jego obecne wartości znikną.`),
            h('fieldset', { class: 'tz-stack tz-tight' }, h('legend', { class: 'sub' }, 'Zmiana'), radios),
            kgBox,
            error,
            h('div', { class: 'tz-dialog-actions' }, cancel, ok));
        const backdrop = h('div', { class: 'tz-backdrop', onclick: (e) => { if (e.target === backdrop && !busy) close(null); } }, dialog);

        unregister = ctx.registerOverlay(() => close(null), backdrop);
        if (!backdrop.isConnected) { close(null); return; }
        document.addEventListener('keydown', onKey, true);
        radios[0].querySelector('input').focus();
    });
}

function exerciseView(plan, ex, weekIdx, last) {
    const superset = !last && ex.supersetWithNext;
    const line = formatWeekLine(weekValues(ex, weekIdx), { intensity: plan.intensity, tempo: ex.tempo, restSec: ex.restSec });
    return h('div', { class: `tz-plan-ex tz-stack tz-tight${superset ? ' tz-ex-ss' : ''}` },
        h('span', { class: 'tz-ex-name' }, ex.name),
        line ? h('p', { class: 'sub' }, line) : null,
        ex.note ? h('p', { class: 'mut tz-note' }, ex.note) : null,
        superset ? h('p', { class: 'mut tz-iconline' }, icon('link'), h('span', {}, 'Superseria z następnym')) : null);
}

function workoutView(plan, w, weekIdx) {
    const exercises = w.exercises || [];
    const days = daysText(w.days);
    return h('section', { class: 'card tz-stack' },
        h('div', { class: 'tz-between' },
            h('h3', { class: 'hd tz-set-hd' }, w.name),
            h('span', { class: 'sub' }, days || 'bez stałych dni')),
        w.warmup ? h('details', { class: 'tz-warmup' },
            h('summary', { class: 'sub' }, 'Rozgrzewka (RAMP)'),
            h('p', { class: 'tz-note' }, w.warmup)) : null,
        exercises.length
            ? h('div', { class: 'tz-stack' }, exercises.map((ex, i) => exerciseView(plan, ex, weekIdx, i === exercises.length - 1)))
            : h('p', { class: 'mut' }, 'Brak ćwiczeń.'));
}

// Żeton serii roboczych na grupę, „nogi 11 / 10” (plan i postępy). Ponad limit: kolor i ikona, bez blokady.
export function groupCountChips(byGroup, limit) {
    return MUSCLE_GROUPS.filter((g) => byGroup[g.id] > 0).map((g) => {
        const n = byGroup[g.id];
        const over = n > limit;
        return h('span', { class: `tz-count${over ? ' tz-over' : ''}` },
            over ? icon('alert') : null,
            `${g.label} ${n} / ${limit}`,
            over ? h('span', { class: 'tz-sr' }, ', ponad limit') : null);
    });
}

function renderPlan(root, params, ctx) {
    const client = params.clientId ? ctx.vault.get(params.clientId) : null;
    if (!client) { ctx.show('clients', {}, { reset: true }); return; }
    const plan = params.planId ? ctx.vault.get(params.planId) : null;
    if (!plan || plan.kind !== 'plan' || plan.clientId !== client.id) { ctx.show('plans', { clientId: client.id }); return; }

    const today = toIso(new Date());
    const { weeklySetsLimit } = planSettings(ctx.vault.list('trainer_settings')[0] || null);
    const requested = Number(params.week);
    let weekIdx = Number.isInteger(requested) && requested >= 1 && requested <= plan.weeks
        ? requested - 1
        : (mesoWeek(plan, today) || 1) - 1;
    const reload = () => ctx.show('plan', { clientId: client.id, planId: plan.id, week: weekIdx + 1 });

    // Po await ekran mógł zniknąć (blokada, Wstecz): wtedy bez przeładowania.
    const act = async (fn, okText) => {
        try {
            await fn();
        } catch (e) {
            console.error('[Strefa trenera] plan:', e && e.message);
            ctx.toast(SAVE_FAILED);
            return false;
        }
        if (okText) ctx.toast(okText);
        return root.isConnected;
    };

    const actionBtn = (ic, label, onClick, cls = 'ghost') => h('button', { type: 'button', class: cls, onclick: onClick }, icon(ic), label);
    const group = planGroup(plan, today);
    const actions = [
        actionBtn('pencil', 'Edytuj', () => ctx.show('plan-edit', { clientId: client.id, planId: plan.id })),
        group === 'inne' ? actionBtn('check', 'Ustaw jako aktywny', async () => {
            if (await act(() => activatePlan(ctx, plan), 'Plan jest aktywny.')) reload();
        }) : null,
        plan.status === 'archiwum'
            ? actionBtn('archive', 'Przywróć', async () => {
                const ok = await ctx.confirm({ title: `Przywrócić plan „${plan.name}”?`, text: 'Plan wróci do pozostałych planów jako nieaktywny.', okLabel: 'Przywróć' });
                if (!ok || !root.isConnected) return;
                if (await act(() => ctx.vault.put({ ...plan, status: 'nieaktywny' }), 'Plan przywrócony.')) reload();
            })
            : actionBtn('archive', 'Przenieś do archiwum', async () => {
                const ok = await ctx.confirm({ title: `Przenieść plan „${plan.name}” do archiwum?`, text: 'Plan zniknie z aktywnych i pozostałych. Możesz go przywrócić.', okLabel: 'Przenieś' });
                if (!ok || !root.isConnected) return;
                if (await act(() => ctx.vault.put({ ...plan, status: 'archiwum' }), 'Plan w archiwum.')) reload();
            }),
        actionBtn('trash', 'Usuń plan', async () => {
            const ok = await ctx.confirm({
                title: `Usunąć plan „${plan.name}”?`,
                text: 'Plan zniknie z karty klienta. Sesje z klientem zostają. Tego nie da się cofnąć.',
                okLabel: 'Usuń', danger: true,
            });
            if (!ok || !root.isConnected) return;
            const removed = await act(async () => {
                await ctx.vault.remove(plan.id);
                for (const d of ctx.vault.list('plan_draft', client.id)) {
                    if (d.planId === plan.id) await ctx.vault.remove(d.id).catch(() => {});
                }
            }, 'Plan usunięty.');
            if (removed) ctx.show('plans', { clientId: client.id });
        }, 'ghost tz-danger'),
    ].filter(Boolean);

    const header = h('section', { class: 'card tz-stack' },
        h('div', {},
            h('h2', { class: 'hd' }, plan.name),
            plan.goal ? h('p', { class: 'sub' }, `Cel: ${goalLabel(plan.goal)}`) : null),
        h('p', { class: 'sub tz-iconline' }, icon('calendar'), h('span', {}, headerState(plan, today))),
        h('p', { class: 'mut' }, `${formatDateWords(plan.startDate)} – ${formatDateWords(planEndDate(plan))} · ${STATUS_TEXT[plan.status] || plan.status}`),
        // „Rozpocznij trening A” na dziś i „Wyślij plan” (plik dla klienta, Task 10).
        h('div', { class: 'tz-plan-actions tz-row' }, planStartButton(ctx, plan),
            h('button', { type: 'button', class: 'ghost', onclick: () => ctx.show('plan-export', { clientId: client.id, planId: plan.id }) },
                icon('share'), `Wyślij plan: ${String(client.firstName || '').trim() || 'klient'} (plik)`)),
        h('div', { class: 'tz-row' }, actions));

    const weekBox = h('div', { class: 'tz-stack' });
    const paintWeek = () => {
        const focused = root.contains(document.activeElement) ? document.activeElement.dataset.week : undefined;
        const lastWeek = weekIdx >= plan.weeks - 1;
        const copy = h('button', { type: 'button', class: 'ghost', disabled: lastWeek, title: lastWeek ? 'To ostatni tydzień planu.' : null }, icon('copy'), 'Kopiuj tydzień');
        copy.addEventListener('click', async () => {
            const saved = await copyWeekDialog(ctx, plan, weekIdx);
            if (!root.isConnected) return;
            if (!saved) { copy.focus(); return; }
            weekIdx += 1;
            ctx.toast(`Skopiowano na tydzień ${weekIdx + 1}.`);
            reload();
        });
        const chips = Array.from({ length: plan.weeks }, (_, k) => h('button', {
            type: 'button', class: `chip tz-week${k === weekIdx ? ' chipon' : ''}`, 'aria-pressed': String(k === weekIdx), dataset: { week: String(k) },
            onclick: () => { weekIdx = k; params.week = k + 1; paintWeek(); },
        }, `Tydz. ${k + 1}`));
        const counts = groupCountChips(plannedSetsByGroup(plan, weekIdx), weeklySetsLimit);
        weekBox.replaceChildren(
            h('section', { class: 'card tz-stack' },
                h('div', { class: 'tz-between' }, h('h3', { class: 'hd tz-set-hd' }, `Tydzień ${weekIdx + 1}`), copy),
                h('div', { class: 'tz-row', role: 'group', 'aria-label': 'Tydzień planu' }, chips),
                h('p', { class: 'sub' }, 'Serie robocze na grupę w tygodniu'),
                counts.length ? h('div', { class: 'tz-row' }, counts) : h('p', { class: 'mut' }, 'Brak ćwiczeń z grupą mięśniową.')),
            ...(plan.workouts || []).map((w) => workoutView(plan, w, weekIdx)));
        if (focused !== undefined) weekBox.querySelector(`[data-week="${focused}"]`)?.focus();
    };
    paintWeek();

    root.append(h('div', { class: 'tz-stack' }, header, weekBox));
}

export function registerPlanScreens(register) {
    register('plans', renderPlans);
    register('plan', renderPlan);
}
