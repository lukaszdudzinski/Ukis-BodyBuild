// Edytor planu klienta (trasa plan-edit { clientId, planId? }). Pracuje na kopii planu i zapisuje ją
// dopiero „Zapisz”. Niezapisane zmiany zostają jako szkic plan_draft w sejfie (decyzja 1, R17/R24).
// Wartości tygodnia: edytujemy wybrany tydzień; null w weeks[i] znaczy „jak najbliższy wcześniejszy” (decyzja 2).
// Dane planu trafiają do DOM wyłącznie przez h() jako węzły tekstowe.
import { h, icon } from './dom.js';
import { pickExercise } from './exercisePicker.js';
import { activatePlan, formatDateWords } from './planScreens.js';
import { GOALS } from '../trainerModel.js';
import { formatNumber } from '../trainerMeasurements.js';
import {
    DAYS, MUSCLE_GROUPS, newPlan, newWorkout, newExercise, weekValues, setWeekValues, resizeWeeks,
    normalizeReps, normalizeTempo, parseKg, effortRange, mondayOf, validatePlan,
} from '../trainerPlan.js';

const SAVE_FAILED = 'Nie udało się zapisać. Spróbuj jeszcze raz.';
const STALE_DRAFT = 'Plan zmienił się po zapisaniu szkicu. Niezapisane zmiany odrzucono.';
const DRAFT_KIND = 'plan_draft';
const MAX_WEEKS = 16;
const MAX_WORKOUTS = 7;

const findDraft = (ctx, clientId, planId) =>
    ctx.vault.list(DRAFT_KIND, clientId).find((d) => (d.planId || null) === planId && d.plan && Array.isArray(d.plan.workouts)) || null;

async function clearDrafts(ctx, clientId, planId) {
    for (const d of ctx.vault.list(DRAFT_KIND, clientId)) {
        if ((d.planId || null) === planId) await ctx.vault.remove(d.id);
    }
}

// Pole liczby całkowitej: puste → null, cyfry → liczba, reszta zostaje tekstem (walidacja ją oznaczy).
function intOrRaw(raw) {
    const s = String(raw).trim();
    if (s === '') return null;
    return /^\d+$/.test(s) ? Number(s) : s;
}

function kgOrRaw(raw) {
    const kg = parseKg(raw);
    return kg === undefined ? String(raw).trim() : kg;
}

const showKg = (kg) => (typeof kg === 'number' ? formatNumber(kg) : kg ?? '');
const showVal = (v) => (v === null || v === undefined ? '' : String(v));

function effortOptions(intensity) {
    const { min, max, step } = effortRange(intensity);
    const out = [h('option', { value: '' }, '—')];
    for (let v = min; v <= max + 1e-9; v += step) {
        const n = Math.round(v * 10) / 10;
        out.push(h('option', { value: String(n) }, formatNumber(n)));
    }
    return out;
}

function renderPlanEdit(root, params, ctx) {
    const client = params.clientId ? ctx.vault.get(params.clientId) : null;
    if (!client) { ctx.show('clients', {}, { reset: true }); return; }
    const existing = params.planId ? ctx.vault.get(params.planId) : null;
    if (params.planId && (!existing || existing.kind !== 'plan')) { ctx.show('plans', { clientId: client.id }); return; }
    const planKey = existing ? existing.id : null;

    let draft = findDraft(ctx, client.id, planKey);
    // Szkic starszy niż zapisany plan (np. po „Kopiuj tydzień” albo zapisie z innego miejsca) nie nadpisuje planu (R4).
    // Dotyczy też szkicu nowego planu, który zdążył się zapisać pod swoim id przed nieudanym dokończeniem zapisu.
    const draftRecord = draft && draft.plan.id ? ctx.vault.get(draft.plan.id) : null;
    if (draftRecord && draftRecord.kind === 'plan' && String(draftRecord.updatedAt || '') > String(draft.updatedAt || '')) {
        const staleId = draft.id;
        draft = null;
        ctx.vault.remove(staleId).catch((e) => console.error('[Strefa trenera] szkic planu:', e && e.message));
        ctx.toast(STALE_DRAFT);
    }
    const settings = ctx.vault.list('trainer_settings')[0] || null;
    const plan = structuredClone(draft ? draft.plan : existing || newPlan({ client, settings, today: new Date() }));

    let weekIdx = 0;
    let weeksRaw = String(plan.weeks);
    let errors = {};
    let showSummary = false;

    // Szkic tylko wtedy, gdy plan zmienił się od otwarcia ekranu.
    const snap = () => JSON.stringify(plan);
    const baseline = snap();
    let draftId = draft ? draft.id : null;
    const saveDraft = async () => {
        if (snap() === baseline) return;
        const saved = await ctx.vault.put({ kind: DRAFT_KIND, id: draftId || undefined, clientId: client.id, planId: planKey, plan });
        draftId = saved.id;
    };
    let leave = ctx.onLeave(root, saveDraft);

    const weeksValid = () => {
        const n = Number(weeksRaw);
        return weeksRaw.trim() !== '' && Number.isInteger(n) && n >= 1 && n <= MAX_WEEKS;
    };

    // Ścieżki błędów, które mają swoje miejsce w formularzu; reszta trafia do zdania nad przyciskami.
    let shown = new Set();
    let uid = 0;
    const nextId = () => `tz-pe-${++uid}`;
    // Komunikat błędu tylko przy polu z błędem; pole dostaje aria-invalid i opis (aria-describedby).
    const errorFor = (path, control) => {
        shown.add(path);
        const msg = errors[path];
        if (!msg) return null;
        const err = h('p', { class: 'tz-error', id: nextId() }, msg);
        if (control) {
            control.setAttribute('aria-invalid', 'true');
            control.setAttribute('aria-describedby', err.id);
            const clear = () => {
                delete errors[path];
                err.remove();
                control.removeAttribute('aria-invalid');
                control.removeAttribute('aria-describedby');
            };
            control.addEventListener('input', clear, { once: true });
            control.addEventListener('change', clear, { once: true });
        }
        return err;
    };
    const field = (label, control, path, cls = '') => {
        control.id = nextId();
        return h('div', { class: `tz-field ${cls}`.trim() },
            h('label', { class: 'sub', for: control.id }, label), control, path ? errorFor(path, control) : null);
    };

    // Fokus wraca na ten sam przycisk po przebudowie (np. „W dół”, żeton tygodnia).
    const keepFocus = (fn) => {
        const key = document.activeElement && root.contains(document.activeElement) ? document.activeElement.dataset.fk : null;
        fn();
        if (key) {
            const el = [...root.querySelectorAll('[data-fk]')].find((e) => e.dataset.fk === key);
            if (el && !el.disabled) el.focus();
        }
    };

    // Ostatnie ćwiczenie treningu nie ma superserii z następnym: bez ukrytej flagi w kopii i w szkicu (R4).
    const clearLastSuperset = (w) => {
        const list = w.exercises || [];
        if (list.length) list[list.length - 1].supersetWithNext = false;
    };

    // Zmiana układu (przesunięcie, usunięcie, nowy trening) zmienia ścieżki błędów: stare komunikaty znikają.
    const restructure = () => {
        errors = {};
        showSummary = false;
        keepFocus(paint);
    };

    // ---------- Karta „Plan” ----------

    const weekChips = h('div', { class: 'tz-row' });
    const weekHint = h('p', { class: 'mut' });
    const paintWeekChips = () => {
        weekChips.replaceChildren(...Array.from({ length: plan.weeks }, (_, k) => h('button', {
            type: 'button', class: `chip${k === weekIdx ? ' chipon' : ''}`, 'aria-pressed': String(k === weekIdx), dataset: { fk: `week-${k}` },
            onclick: () => { weekIdx = k; keepFocus(paint); },
        }, `Tydz. ${k + 1}`)));
        weekHint.textContent = `Zmieniasz tydzień ${weekIdx + 1}. Wcześniejsze tygodnie zostają, a kolejne bez własnych zmian przejmą tę zmianę.`;
    };

    function planCard() {
        const name = h('input', { class: 'in', type: 'text', autocomplete: 'off', maxlength: 120, value: plan.name || '' });
        name.addEventListener('input', () => { plan.name = name.value; });

        const goalChips = GOALS.map((g) => h('button', {
            type: 'button', class: 'chip', onclick: () => { plan.goal = plan.goal === g.id ? null : g.id; paintGoal(); },
        }, g.label));
        const paintGoal = () => goalChips.forEach((chip, i) => {
            const on = GOALS[i].id === plan.goal;
            chip.classList.toggle('chipon', on);
            chip.setAttribute('aria-pressed', String(on));
        });
        paintGoal();

        const weeks = h('input', { class: 'in', type: 'number', inputmode: 'numeric', min: 1, max: MAX_WEEKS, step: 1, value: weeksRaw });
        weeks.addEventListener('input', () => {
            weeksRaw = weeks.value;
            if (!weeksValid()) return;
            // Bez obcinania tygodni ćwiczeń: 6 → 4 → 6 przed zapisem nie gubi wpisanych wartości.
            plan.weeks = Number(weeksRaw);
            if (weekIdx >= plan.weeks) { weekIdx = plan.weeks - 1; paintWeekChips(); paintWorkouts(); } else paintWeekChips();
        });

        const words = h('span', {}, formatDateWords(plan.startDate, { weekday: true }));
        const start = h('input', { class: 'in', type: 'date', value: plan.startDate || '' });
        start.addEventListener('change', () => {
            const monday = mondayOf(start.value);
            plan.startDate = monday || '';
            if (monday && start.value !== monday) start.value = monday;
            words.textContent = formatDateWords(plan.startDate, { weekday: true });
        });

        paintWeekChips();
        return h('section', { class: 'card tz-stack' },
            h('h2', { class: 'hd' }, existing ? 'Edytuj plan' : 'Nowy plan'),
            draft ? h('p', { class: 'mut' }, 'Wznowiony niezapisany plan.') : null,
            field('Nazwa planu', name, 'name'),
            h('div', { class: 'tz-field' }, h('span', { class: 'sub' }, 'Cel'), h('div', { class: 'tz-goals' }, goalChips)),
            field('Mezocykl (tygodnie)', weeks, 'weeks'),
            field('Start (poniedziałek tygodnia 1)', start, 'startDate'),
            h('p', { class: 'sub tz-iconline' }, icon('calendar'), words),
            h('p', { class: 'sub' }, 'Intensywność: ', h('strong', {}, plan.intensity === 'rpe' ? 'RPE' : 'RIR')),
            errorFor('intensity'),
            h('div', { class: 'tz-field' }, h('span', { class: 'sub' }, 'Tydzień'), weekChips, weekHint));
    }

    // ---------- Treningi ----------

    const workoutsBox = h('div', { class: 'tz-stack' });
    let dayButtons = [];
    const refreshDays = () => {
        for (const { btn, w, day } of dayButtons) {
            const on = (w.days || []).includes(day);
            const owner = plan.workouts.find((o) => o !== w && (o.days || []).includes(day));
            btn.classList.toggle('chipon', on);
            btn.setAttribute('aria-pressed', String(on));
            btn.disabled = !on && !!owner;
            if (owner) btn.title = `Ten dzień ma już ${owner.name}`;
            else btn.removeAttribute('title');
        }
    };

    function exerciseRow(w, wi, ex, ei) {
        const p = `workouts.${wi}.exercises.${ei}`;
        const kp = `${p}.weeks.${weekIdx}`;
        const last = ei === w.exercises.length - 1;
        const v = weekValues(ex, weekIdx);
        const setWeek = (key, value) => { ex.weeks = setWeekValues(ex, weekIdx, { [key]: value }).weeks; };
        let source = weekIdx;
        while (source > 0 && !(ex.weeks || [])[source]) source -= 1;

        const sets = h('input', { class: 'in', type: 'text', inputmode: 'numeric', autocomplete: 'off', value: showVal(v.sets) });
        sets.addEventListener('input', () => setWeek('sets', intOrRaw(sets.value)));
        const reps = h('input', { class: 'in', type: 'text', autocomplete: 'off', placeholder: '8–10', value: showVal(v.reps) });
        reps.addEventListener('input', () => setWeek('reps', reps.value.trim()));
        reps.addEventListener('change', () => {
            const n = normalizeReps(reps.value);
            if (n !== null && n !== reps.value) { reps.value = n; setWeek('reps', n); }
        });
        const kg = h('input', { class: 'in', type: 'text', inputmode: 'decimal', autocomplete: 'off', value: showKg(v.kg) });
        kg.addEventListener('input', () => setWeek('kg', kgOrRaw(kg.value)));
        const effort = h('select', { class: 'in', value: showVal(v.effort) }, effortOptions(plan.intensity));
        effort.addEventListener('change', () => setWeek('effort', effort.value === '' ? null : Number(effort.value)));

        const tempo = h('input', { class: 'in', type: 'text', autocomplete: 'off', maxlength: 4, placeholder: '3010', value: ex.tempo || '' });
        tempo.addEventListener('input', () => { ex.tempo = tempo.value.trim(); });
        tempo.addEventListener('change', () => {
            const t = normalizeTempo(tempo.value);
            if (t !== null && t !== tempo.value) { tempo.value = t; ex.tempo = t; }
        });
        const rest = h('input', { class: 'in', type: 'text', inputmode: 'numeric', autocomplete: 'off', value: showVal(ex.restSec) });
        rest.addEventListener('input', () => { ex.restSec = intOrRaw(rest.value); });
        const note = h('input', { class: 'in', type: 'text', autocomplete: 'off', maxlength: 500, value: ex.note || '' });
        note.addEventListener('input', () => { ex.note = note.value; });

        const group = h('select', { class: 'in', value: ex.muscleGroup || '' },
            h('option', { value: '' }, 'bez grupy'),
            MUSCLE_GROUPS.map((g) => h('option', { value: g.id }, g.label)));
        group.addEventListener('change', () => { ex.muscleGroup = group.value || null; });

        const superset = h('input', { type: 'checkbox', checked: !last && !!ex.supersetWithNext, disabled: last });
        superset.addEventListener('change', () => { ex.supersetWithNext = superset.checked; row.classList.toggle('tz-ex-ss', superset.checked); });

        const move = (dir) => {
            const list = w.exercises;
            [list[ei], list[ei + dir]] = [list[ei + dir], list[ei]];
            clearLastSuperset(w);
            restructure();
        };
        const iconBtn = (ic, label, fk, onClick, disabled = false) =>
            h('button', { type: 'button', class: 'ghost tz-info', 'aria-label': label, title: label, dataset: { fk }, disabled, onclick: onClick }, icon(ic));

        const change = h('button', { type: 'button', class: 'ghost tz-info', 'aria-label': 'Zmień ćwiczenie', title: 'Zmień ćwiczenie', onclick: async () => {
            const picked = await pickExercise(ctx, { title: 'Zmień ćwiczenie' });
            if (!picked || !root.isConnected) return;
            ex.name = picked.name;
            ex.muscleGroup = picked.muscleGroup;
            restructure();
        } }, icon('pencil'));

        const row = h('div', { class: `tz-ex tz-stack${!last && ex.supersetWithNext ? ' tz-ex-ss' : ''}` },
            h('div', { class: 'tz-between' }, h('span', { class: 'tz-ex-name' }, ex.name), change),
            errorFor(`${p}.name`),
            field('Grupa', group, null),
            h('p', { class: 'mut' }, source === weekIdx ? `Tydzień ${weekIdx + 1}` : `Tydzień ${weekIdx + 1} · jak tydzień ${source + 1}`),
            h('div', { class: 'tz-ex-grid' },
                field('Serie', sets, `${kp}.sets`),
                field('Powtórzenia', reps, `${kp}.reps`),
                field('kg', kg, `${kp}.kg`),
                field(plan.intensity === 'rpe' ? 'RPE' : 'RIR', effort, `${kp}.effort`)),
            errorFor(`${p}.weeks.0`),
            h('div', { class: 'tz-ex-grid tz-ex-grid2' },
                field('Tempo', tempo, `${p}.tempo`),
                field('Przerwa (s)', rest, `${p}.restSec`)),
            field('Uwaga', note, null),
            h('label', { class: 'tz-check' }, superset, icon('link'), h('span', {}, 'Superseria z następnym')),
            h('div', { class: 'tz-row' },
                iconBtn('arrow-up', 'W górę', `up-${ex.id}`, () => move(-1), ei === 0),
                iconBtn('arrow-down', 'W dół', `down-${ex.id}`, () => move(1), last),
                iconBtn('trash', 'Usuń', `del-${ex.id}`, () => { w.exercises.splice(ei, 1); clearLastSuperset(w); restructure(); })));
        return row;
    }

    function workoutCard(w, wi) {
        const name = h('input', { class: 'in', type: 'text', autocomplete: 'off', maxlength: 120, value: w.name || '' });
        name.addEventListener('input', () => { w.name = name.value; refreshDays(); });
        const days = DAYS.map((d) => {
            const btn = h('button', { type: 'button', class: 'chip', dataset: { fk: `day-${w.id}-${d.id}` }, onclick: () => {
                const set = new Set(w.days || []);
                if (set.has(d.id)) set.delete(d.id); else set.add(d.id);
                w.days = DAYS.map((x) => x.id).filter((id) => set.has(id));
                refreshDays();
            } }, d.label);
            dayButtons.push({ btn, w, day: d.id });
            return btn;
        });
        const warmup = h('textarea', { class: 'in', rows: 4, maxlength: 2000, value: w.warmup || '' });
        warmup.addEventListener('input', () => { w.warmup = warmup.value; });

        const addExercise = h('button', { type: 'button', class: 'ghost', onclick: async () => {
            const picked = await pickExercise(ctx, { title: 'Dodaj ćwiczenie' });
            if (!picked || !root.isConnected) return;
            w.exercises.push(newExercise(plan, picked));
            restructure();
        } }, icon('plus'), 'Ćwiczenie');
        const remove = h('button', { type: 'button', class: 'ghost tz-danger', disabled: plan.workouts.length <= 1, onclick: async () => {
            const ok = await ctx.confirm({ title: `Usunąć ${w.name || 'trening'}?`, text: 'Trening zniknie z planu razem z ćwiczeniami.', okLabel: 'Usuń', danger: true });
            if (!ok || !root.isConnected) return;
            const i = plan.workouts.indexOf(w);
            if (i >= 0) plan.workouts.splice(i, 1);
            restructure();
        } }, icon('trash'), 'Usuń trening');

        return h('section', { class: 'card tz-stack tz-workout' },
            field('Nazwa treningu', name, `workouts.${wi}.name`),
            h('div', { class: 'tz-field' }, h('span', { class: 'sub' }, 'Dni'), h('div', { class: 'tz-row' }, days), errorFor(`workouts.${wi}.days`)),
            field('Rozgrzewka (RAMP)', warmup, null),
            (w.exercises || []).map((ex, ei) => exerciseRow(w, wi, ex, ei)),
            h('div', { class: 'tz-row' }, addExercise, remove));
    }

    function paintWorkouts() {
        dayButtons = [];
        workoutsBox.replaceChildren(...plan.workouts.map(workoutCard));
        refreshDays();
        addWorkout.disabled = plan.workouts.length >= MAX_WORKOUTS;
    }

    const addWorkout = h('button', { type: 'button', class: 'ghost', onclick: () => {
        if (plan.workouts.length >= MAX_WORKOUTS) return;
        plan.workouts.push(newWorkout(plan));
        restructure();
    } }, icon('plus'), 'Trening');

    // ---------- Zapis ----------

    const summary = h('div', { class: 'tz-stack tz-tight', role: 'alert' });
    const save = h('button', { type: 'button', class: 'btn' }, icon('check'), 'Zapisz');
    const cancel = h('button', { type: 'button', class: 'ghost' }, 'Anuluj');

    // Ujednolica zapis pól (8-10 → 8–10, x → X); błędne wartości zostają, żeby walidacja je oznaczyła.
    const normalizeFields = () => {
        for (const w of plan.workouts) {
            for (const ex of w.exercises || []) {
                const t = normalizeTempo(ex.tempo);
                if (t !== null) ex.tempo = t;
                for (const wk of ex.weeks || []) {
                    if (!wk) continue;
                    const r = normalizeReps(wk.reps);
                    if (r !== null) wk.reps = r;
                }
            }
        }
    };

    const buildRecord = () => {
        const rec = resizeWeeks(plan, plan.weeks);
        rec.kind = 'plan';
        rec.clientId = client.id;
        rec.name = String(rec.name || '').trim();
        for (const w of rec.workouts) {
            w.name = String(w.name || '').trim();
            w.exercises = (w.exercises || []).map((ex, i, all) => ({
                ...ex, note: String(ex.note || '').trim(), supersetWithNext: i < all.length - 1 && !!ex.supersetWithNext,
            }));
        }
        return rec;
    };

    save.addEventListener('click', async () => {
        normalizeFields();
        const candidate = weeksValid() ? buildRecord() : { ...plan, weeks: weeksRaw };
        const result = validatePlan(candidate);
        if (!result.ok) {
            errors = result.errors;
            showSummary = true;
            const badWeeks = Object.keys(errors).map((k) => /\.weeks\.(\d+)\./.exec(k)).filter(Boolean).map((m) => Number(m[1]));
            if (badWeeks.length && !badWeeks.includes(weekIdx)) weekIdx = Math.min(...badWeeks);
            paint();
            return;
        }
        errors = {};
        showSummary = false;
        // Id nadane przed pierwszym zapisem zostaje w kopii roboczej: gdy zapis planu się uda, a dalszy krok nie
        // (np. wyłączenie poprzedniego aktywnego planu), ponowne „Zapisz” nadpisze ten sam rekord (R4).
        if (!plan.id) plan.id = crypto.randomUUID();
        candidate.id = plan.id;
        // Hak szkicu znika przed zapisem: wyjście albo blokada w trakcie zapisu nie tworzy szkicu.
        // Nieudany zapis przywraca hak (a gdy ekranu już nie ma, od razu zapisuje szkic).
        save.disabled = true;
        leave();
        let saved;
        try {
            saved = candidate.status === 'aktywny' ? await activatePlan(ctx, candidate) : await ctx.vault.put(candidate);
        } catch (e) {
            console.error('[Strefa trenera] zapis planu:', e && e.message);
            if (root.isConnected) leave = ctx.onLeave(root, saveDraft);
            else await saveDraft().catch(() => {});
            ctx.toast(SAVE_FAILED);
            save.disabled = false;
            return;
        }
        try { await clearDrafts(ctx, client.id, planKey); } catch (e) { console.error('[Strefa trenera] szkic planu:', e && e.message); }
        ctx.toast('Plan zapisany.');
        if (!root.isConnected) return;
        // Historia: … → plany → plan, żeby „Wstecz” z planu wracało do listy, a nie do edytora.
        ctx.show('plans', { clientId: client.id });
        ctx.show('plan', { clientId: client.id, planId: saved.id });
    });

    cancel.addEventListener('click', async () => {
        leave();
        try { await clearDrafts(ctx, client.id, planKey); } catch (e) { console.error('[Strefa trenera] szkic planu:', e && e.message); }
        if (existing) ctx.show('plan', { clientId: client.id, planId: existing.id });
        else ctx.show('plans', { clientId: client.id });
    });

    function paint() {
        shown = new Set();
        const card = planCard();
        paintWorkouts();
        const workoutsError = errorFor('workouts');
        // Błąd w tygodniu innym niż wybrany: zdanie z numerem tygodnia nad przyciskami.
        const orphans = Object.keys(errors).filter((k) => !shown.has(k)).map((k) => {
            const m = /\.weeks\.(\d+)\./.exec(k);
            return m ? `Tydz. ${Number(m[1]) + 1}: ${errors[k]}` : errors[k];
        });
        summary.replaceChildren(
            showSummary && Object.keys(errors).length ? h('p', { class: 'tz-error' }, 'Popraw zaznaczone pola.') : null,
            orphans.map((msg) => h('p', { class: 'tz-error' }, msg)));
        root.replaceChildren(h('div', { class: 'tz-stack' },
            card,
            workoutsBox,
            h('div', { class: 'tz-row' }, addWorkout),
            workoutsError,
            summary,
            h('div', { class: 'tz-row' }, save, cancel)));
    }

    paint();
    if (!existing && !draft) root.querySelector('input')?.focus();
}

export function registerPlanEditScreen(register) {
    register('plan-edit', renderPlanEdit);
}
