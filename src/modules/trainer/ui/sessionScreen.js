// Sesja z klientem (spec 9.6, decyzje 7–11): wybór treningu (trasa session-start), ekran sesji (trasa session),
// przycisk startu w karcie klienta i startSession dla karty, wyboru i przeglądu planu.
// Sesja żyje wyłącznie w sejfie: nie woła DatabaseManager ani TrainingUI i nie pisze do localStorage.
// Dane do DOM tylko przez h() jako węzły tekstowe.
import { h, icon } from './dom.js';
import { pickExercise } from './exercisePicker.js';
import { formatNumber } from '../trainerMeasurements.js';
import { DAYS, activePlan, workoutForDate, weekIndexFor, planSettings, formatWeekLine, parseDate, toIso } from '../trainerPlan.js';
import {
    newSession, addExercise, addSet, setValue, toggleSet, toggleSuperset, addActiveTime,
    setSessionNote, setSessionRpe, sessionStats, finishSession, inProgressSession,
} from '../trainerSession.js';

const SAVE_FAILED = 'Nie udało się zapisać. Spróbuj jeszcze raz.';
// Decyzja 8: zapis po zmianie z opóźnieniem, najwyżej jeden naraz.
const SAVE_DELAY_MS = 800;
// Przerwa między tyknięciami stopera dłuższa niż to oznacza uśpioną kartę: tego czasu nie liczymy (decyzja 9).
const MAX_TICK_GAP_MS = 5000;
const RPE_CHIPS = [6, 7, 8, 9, 10];

const fullName = (c) => `${c.firstName || ''} ${c.lastName || ''}`.trim();
const daysText = (days) => DAYS.filter((d) => (days || []).includes(d.id)).map((d) => d.label).join(', ');

// „25 listopada”.
export function sessionDateLabel(iso) {
    const d = parseDate(iso);
    return d ? d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' }) : '';
}

// „Rozpocznij trening A” (rozstrzygnięcie C12: bez imienia w dopełniaczu; imię jest w wierszu nad przyciskiem).
export function startLabel(workoutName) {
    const name = String(workoutName || '').trim();
    return /^Trening\s/.test(name) ? `Rozpocznij t${name.slice(1)}` : `Rozpocznij: ${name}`;
}

// mm:ss; ponad godzinę minuty rosną dalej („75:03”).
function clockText(sec) {
    const s = Math.max(0, Math.floor(sec));
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

const starting = new Map();

// Sesja w toku klienta otwiera się zamiast drugiej. Inaczej nowa sesja z treningu planu (tydzień przycięty
// do mezocyklu, rozstrzygnięcie C4) albo pusta, zapisana od razu, żeby przetrwała zamknięcie aplikacji.
export function startSession(ctx, { clientId, planId = null, workoutId = null } = {}) {
    if (starting.has(clientId)) return starting.get(clientId);
    const run = (async () => {
        const open = inProgressSession(ctx.vault.list('session', clientId), clientId);
        if (open) {
            await ctx.show('session', { clientId, sessionId: open.id });
            return;
        }
        const plan = planId ? ctx.vault.get(planId) : null;
        const usable = plan && plan.kind === 'plan' && plan.clientId === clientId ? plan : null;
        const workout = usable && workoutId ? (usable.workouts || []).find((w) => w.id === workoutId) || null : null;
        const now = new Date();
        const week = workout ? weekIndexFor(usable, toIso(now)) + 1 : null;
        let saved;
        try {
            saved = await ctx.vault.put(newSession({ clientId, plan: workout ? usable : null, workout, week, now }));
        } catch (e) {
            console.error('[Strefa trenera] start sesji:', e && e.message);
            ctx.toast(SAVE_FAILED);
            return;
        }
        await ctx.show('session', { clientId, sessionId: saved.id });
    })().finally(() => starting.delete(clientId));
    starting.set(clientId, run);
    return run;
}

// Przycisk główny w karcie klienta: dokończenie sesji w toku, trening na dziś z aktywnego planu albo wybór.
export function sessionCard(ctx, client) {
    const iso = toIso(new Date());
    const open = inProgressSession(ctx.vault.list('session', client.id), client.id);
    if (open) {
        return h('section', { class: 'card tz-stack' },
            h('button', { type: 'button', class: 'btn', onclick: () => ctx.show('session', { clientId: client.id, sessionId: open.id }) },
                icon('play'), `Dokończ sesję (${sessionDateLabel(open.date)})`));
    }
    const plan = activePlan(ctx.vault.list('plan', client.id), iso);
    const today = plan ? workoutForDate(plan, iso) : null;
    if (today) {
        return h('section', { class: 'card tz-stack' },
            h('p', { class: 'sub' }, `${client.firstName || fullName(client)}: dziś ${today.workout.name} · tydz. ${today.week}/${plan.weeks}`),
            h('button', { type: 'button', class: 'btn', onclick: () => startSession(ctx, { clientId: client.id, planId: plan.id, workoutId: today.workout.id }) },
                icon('play'), startLabel(today.workout.name)),
            h('div', { class: 'tz-links' },
                h('button', { type: 'button', class: 'tz-link', onclick: () => ctx.show('session-start', { clientId: client.id }) }, 'Inny trening')));
    }
    return h('section', { class: 'card tz-stack' },
        h('button', { type: 'button', class: 'btn', onclick: () => ctx.show('session-start', { clientId: client.id }) },
            icon('play'), 'Rozpocznij sesję z klientem'));
}

// Przycisk „Rozpocznij trening A” w przeglądzie planu: tylko trening, który przypada na dziś.
export function planStartButton(ctx, plan, today = new Date()) {
    if (!plan || plan.status === 'archiwum') return null;
    const hit = workoutForDate(plan, toIso(today));
    if (!hit) return null;
    return h('button', { type: 'button', class: 'btn', onclick: () => startSession(ctx, { clientId: plan.clientId, planId: plan.id, workoutId: hit.workout.id }) },
        icon('play'), startLabel(hit.workout.name));
}

// ---------- Wybór treningu (trasa session-start { clientId }) ----------

function renderStart(root, params, ctx) {
    const client = params.clientId ? ctx.vault.get(params.clientId) : null;
    if (!client) { ctx.show('clients', {}, { reset: true }); return; }
    const open = inProgressSession(ctx.vault.list('session', client.id), client.id);
    if (open) {
        root.append(h('section', { class: 'card tz-stack' },
            h('h2', { class: 'hd' }, 'Sesja w toku'),
            h('p', { class: 'sub' }, 'Najpierw dokończ albo odrzuć sesję, która jest w toku.'),
            h('div', { class: 'tz-row' },
                h('button', { type: 'button', class: 'btn', onclick: () => ctx.show('session', { clientId: client.id, sessionId: open.id }) },
                    icon('play'), `Dokończ sesję (${sessionDateLabel(open.date)})`))));
        return;
    }
    const iso = toIso(new Date());
    const plan = activePlan(ctx.vault.list('plan', client.id), iso);
    const today = plan ? workoutForDate(plan, iso) : null;
    const start = (opts) => startSession(ctx, { clientId: client.id, ...opts });
    const workouts = plan ? plan.workouts || [] : [];

    const planCard = plan
        ? h('section', { class: 'card tz-stack' },
            h('div', {},
                h('h3', { class: 'hd tz-set-hd' }, plan.name),
                h('p', { class: 'mut' }, `Tydzień ${weekIndexFor(plan, iso) + 1} z ${plan.weeks}`)),
            workouts.length
                ? h('div', { class: 'tz-list' }, workouts.map((w) => h('button', {
                    type: 'button', class: 'tz-client', onclick: () => start({ planId: plan.id, workoutId: w.id }),
                },
                h('span', { class: 'tz-avatar', 'aria-hidden': 'true' }, icon('dumbbell')),
                h('span', { class: 'tz-client-main' },
                    h('span', { class: 'tz-client-name' }, `${w.name} · ${daysText(w.days) || 'bez stałych dni'}`),
                    today && today.workout.id === w.id ? h('span', { class: 'mut' }, 'na dziś') : null))))
                : h('p', { class: 'mut' }, 'Plan nie ma jeszcze treningów.'))
        : h('section', { class: 'card' }, h('p', { class: 'sub' }, 'Klient nie ma aktywnego planu.'));

    root.append(h('div', { class: 'tz-stack' },
        h('section', { class: 'card tz-stack' },
            h('h2', { class: 'hd' }, 'Sesja z klientem'),
            h('p', { class: 'sub' }, fullName(client))),
        planCard,
        h('section', { class: 'card tz-stack' },
            h('div', { class: 'tz-row' },
                h('button', { type: 'button', class: 'ghost', onclick: () => start({}) }, icon('plus'), 'Pusta sesja')),
            h('p', { class: 'mut' }, 'Ćwiczenia dodasz w trakcie sesji.'))));
}

// ---------- Ekran sesji (trasa session { clientId, sessionId }) ----------

function renderSession(root, params, ctx) {
    const client = params.clientId ? ctx.vault.get(params.clientId) : null;
    if (!client) { ctx.show('clients', {}, { reset: true }); return; }
    let session = params.sessionId ? ctx.vault.get(params.sessionId) : null;
    if (!session || session.kind !== 'session' || session.clientId !== client.id || session.status !== 'w_toku') {
        ctx.show('client', { id: client.id });
        return;
    }
    const plan = session.planId ? ctx.vault.get(session.planId) : null;
    const { sessionMinutes } = planSettings(ctx.vault.list('trainer_settings')[0] || null);

    // --- Czas (decyzja 9): liczy się tylko, gdy ekran sesji jest widoczny. ---
    let pendingMs = 0;
    let lastTick = Date.now();
    const visible = () => root.isConnected && document.visibilityState !== 'hidden' && root.getClientRects().length > 0;
    const tick = () => {
        const now = Date.now();
        const gap = now - lastTick;
        lastTick = now;
        if (gap > 0 && gap <= MAX_TICK_GAP_MS && visible()) pendingMs += gap;
    };
    const accrue = () => {
        tick();
        const secs = Math.floor(pendingMs / 1000);
        if (secs > 0) {
            session = addActiveTime(session, secs);
            pendingMs -= secs * 1000;
        }
    };
    const activeNow = () => (session.activeSec || 0) + Math.floor(pendingMs / 1000);

    // --- Zapis (decyzja 8): po zmianie z opóźnieniem, od razu przy wyjściu, przed blokadą i w tle. ---
    let dirty = false;
    let timer = null;
    let chain = Promise.resolve();
    let closed = false;
    let savedActive = session.activeSec || 0;
    const write = async () => {
        if (closed || !ctx.vault.isUnlocked()) return;
        accrue();
        if (!dirty && session.activeSec === savedActive) return;
        const rec = session;
        dirty = false;
        try {
            await ctx.vault.put(rec);
            savedActive = rec.activeSec;
        } catch (e) {
            // Ponowienie przy następnej zmianie (albo przy wyjściu z ekranu).
            console.error('[Strefa trenera] zapis sesji:', e && e.message);
            dirty = true;
            ctx.toast(SAVE_FAILED);
        }
    };
    const saveNow = () => {
        clearTimeout(timer);
        timer = null;
        chain = chain.then(write);
        return chain;
    };
    const schedule = () => {
        dirty = true;
        clearTimeout(timer);
        timer = setTimeout(saveNow, SAVE_DELAY_MS);
    };
    let leave = ctx.onLeave(root, saveNow);

    // iOS potrafi zamknąć aplikację w tle bez żadnego zdarzenia: zapis przy przejściu w tło.
    const onVisibility = () => {
        if (document.visibilityState === 'hidden') { if (root.isConnected) saveNow(); }
        else lastTick = Date.now();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const clock = h('span', { class: 'tz-clock' }, clockText(activeNow()));
    const interval = setInterval(() => {
        if (!root.isConnected) { stop(); return; }
        tick();
        clock.textContent = clockText(activeNow());
    }, 1000);
    function stop() {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', onVisibility);
    }

    const weekText = session.week ? (plan && plan.weeks ? ` · tydz. ${session.week}/${plan.weeks}` : ` · tydz. ${session.week}`) : '';
    const head = h('section', { class: 'card tz-stack tz-sess-head' },
        h('div', { class: 'tz-between' },
            h('div', {},
                h('h2', { class: 'hd' }, fullName(client)),
                h('p', { class: 'sub' }, `${session.workoutName || 'Pusta sesja'}${weekText}`)),
            h('div', { class: 'tz-clockbox' },
                h('span', { class: 'tz-sr' }, 'Czas sesji'),
                clock,
                h('span', { class: 'mut' }, `z ${sessionMinutes} min`))));

    // --- Ćwiczenia i serie ---
    const list = h('div', { class: 'tz-stack' });
    const change = (next) => {
        if (next === session || closed) return;
        session = next;
        schedule();
        paint();
    };

    // Błędny wpis (niezapisany) po data-key pola: wraca po przerysowaniu, póki wartość serii się nie zmieni
    // (poprawny wpis albo odhaczenie, które bierze wartość z planu).
    const rawInputs = new Map();

    const setRow = (exIdx, setIdx) => {
        const ex = session.exercises[exIdx];
        const set = ex.sets[setIdx];
        const n = setIdx + 1;
        const p = ex.planned;
        const drop = set.type === 'dropset';
        const kg = h('input', {
            class: 'in', type: 'text', inputmode: 'decimal', autocomplete: 'off', 'aria-label': `Ciężar, seria ${n}`,
            placeholder: p && typeof p.kg === 'number' ? formatNumber(p.kg) : 'kg',
            value: set.kg === null || set.kg === undefined ? '' : formatNumber(set.kg),
            dataset: { key: `kg-${exIdx}-${setIdx}` },
        });
        const reps = h('input', {
            class: 'in', type: 'text', inputmode: 'numeric', autocomplete: 'off', 'aria-label': `Powtórzenia, seria ${n}`,
            placeholder: p && p.reps ? String(p.reps) : 'powt.',
            value: set.reps === null || set.reps === undefined ? '' : String(set.reps),
            dataset: { key: `reps-${exIdx}-${setIdx}` },
        });
        const markInvalid = (input, bad) => {
            input.classList.toggle('tz-invalid', bad);
            if (bad) input.setAttribute('aria-invalid', 'true');
            else input.removeAttribute('aria-invalid');
        };
        // Wpisywanie nie przerysowuje ekranu (fokus zostaje w polu); błędna wartość zostaje oznaczona i niezapisana.
        const bind = (input, fieldName) => {
            const key = input.dataset.key;
            const raw = rawInputs.get(key);
            if (raw && raw.stored === set[fieldName]) {
                input.value = raw.text;
                markInvalid(input, true);
            } else rawInputs.delete(key);
            input.addEventListener('input', () => {
                if (closed) return;
                const next = setValue(session, exIdx, setIdx, fieldName, input.value);
                const bad = next === session;
                markInvalid(input, bad);
                if (bad) rawInputs.set(key, { text: input.value, stored: session.exercises[exIdx].sets[setIdx][fieldName] });
                else {
                    rawInputs.delete(key);
                    session = next;
                    schedule();
                }
            });
        };
        bind(kg, 'kg');
        bind(reps, 'reps');
        const done = h('button', {
            type: 'button', class: 'tz-tick', 'aria-pressed': String(!!set.done), 'aria-label': `Seria ${n} wykonana`,
            dataset: { key: `tick-${exIdx}-${setIdx}` }, onclick: () => change(toggleSet(session, exIdx, setIdx)),
        }, icon('check'));
        return h('div', { class: `tz-set${set.done ? ' tz-done' : ''}${drop ? ' tz-drop' : ''}` },
            h('span', { class: 'tz-setnum' }, drop ? 'drop' : String(n)),
            kg, reps, done);
    };

    const exerciseView = (exIdx) => {
        const ex = session.exercises[exIdx];
        const last = exIdx === session.exercises.length - 1;
        const p = ex.planned;
        const line = p ? formatWeekLine(p, p) : '';
        const linked = !last && !!ex.supersetWithNext;
        return h('div', { class: 'tz-sess-ex tz-stack tz-tight' },
            h('h3', { class: 'tz-ex-name' }, ex.name),
            line ? h('p', { class: 'sub tz-planned' }, `Plan: ${line}`) : null,
            p && p.note ? h('p', { class: 'mut tz-note' }, p.note) : null,
            h('div', { class: 'tz-sets' },
                h('div', { class: 'tz-sets-hd mut', 'aria-hidden': 'true' },
                    h('span', {}, 'Seria'), h('span', {}, 'kg'), h('span', {}, 'Powt.'), h('span', {})),
                ex.sets.map((_, setIdx) => setRow(exIdx, setIdx))),
            h('div', { class: 'tz-row' },
                h('button', { type: 'button', class: 'ghost tz-small', dataset: { key: `add-${exIdx}` }, onclick: () => change(addSet(session, exIdx, 'normal')) },
                    icon('plus'), 'Seria'),
                h('button', { type: 'button', class: 'ghost tz-small', dataset: { key: `drop-${exIdx}` }, onclick: () => change(addSet(session, exIdx, 'dropset')) },
                    icon('plus'), 'Dropset'),
                last ? null : h('button', {
                    type: 'button', class: `chip${linked ? ' chipon' : ''}`, 'aria-pressed': String(linked),
                    title: 'Łączy z następnym ćwiczeniem', dataset: { key: `ss-${exIdx}` },
                    onclick: () => change(toggleSuperset(session, exIdx)),
                }, icon('link'), 'Superseria')));
    };

    // Ćwiczenia w superserii są w jednej ramce; supersetWithNext ostatniego ćwiczenia nic nie łączy.
    const paint = () => {
        const focused = root.contains(document.activeElement) ? document.activeElement.dataset.key : undefined;
        const exs = session.exercises;
        const blocks = [];
        for (let i = 0; i < exs.length; i++) {
            const from = i;
            while (i < exs.length - 1 && exs[i].supersetWithNext) i++;
            const views = [];
            for (let k = from; k <= i; k++) views.push(exerciseView(k));
            blocks.push(views.length > 1
                ? h('section', { class: 'card tz-stack tz-ss-group' },
                    h('p', { class: 'mut tz-iconline' }, icon('link'), h('span', {}, 'Superseria')), views)
                : h('section', { class: 'card tz-stack' }, views));
        }
        list.replaceChildren(...(blocks.length ? blocks
            : [h('section', { class: 'card' }, h('p', { class: 'sub tz-empty' }, 'Brak ćwiczeń. Dodaj pierwsze.'))]));
        if (focused) list.querySelector(`[data-key="${focused}"]`)?.focus();
    };

    const addEx = h('button', { type: 'button', class: 'ghost' }, icon('plus'), 'Ćwiczenie');
    addEx.addEventListener('click', async () => {
        const picked = await pickExercise(ctx, { title: 'Dodaj ćwiczenie' });
        if (!picked || !root.isConnected || closed) return;
        change(addExercise(session, picked));
        addEx.focus();
    });

    // --- Notatka i RPE sesji ---
    const note = h('textarea', { class: 'in', rows: 3, maxlength: 2000, value: session.note || '' });
    note.addEventListener('input', () => {
        if (closed) return;
        session = setSessionNote(session, note.value);
        schedule();
    });
    const rpeChips = RPE_CHIPS.map((v) => h('button', {
        type: 'button', class: 'chip tz-rpe',
        onclick: () => {
            if (closed) return;
            session = setSessionRpe(session, session.sessionRpe === v ? null : v);
            schedule();
            paintRpe();
        },
    }, String(v)));
    const paintRpe = () => rpeChips.forEach((chip, i) => {
        const on = session.sessionRpe === RPE_CHIPS[i];
        chip.classList.toggle('chipon', on);
        chip.setAttribute('aria-pressed', String(on));
    });
    paintRpe();

    // --- Zakończ i Odrzuć ---
    const finishBtn = h('button', { type: 'button', class: 'btn' }, icon('check'), 'Zakończ');
    const discardBtn = h('button', { type: 'button', class: 'ghost tz-danger' }, icon('trash'), 'Odrzuć sesję');
    const setBusy = (on) => { finishBtn.disabled = on; discardBtn.disabled = on; };

    // Przed ostatnim zapisem: hak szkicu zdjęty, czekające zapisy zatrzymane (nie wskrzeszą usuniętej sesji).
    // Nieudana operacja przywraca hak i zapisy.
    const closeSaving = async () => {
        setBusy(true);
        leave();
        closed = true;
        clearTimeout(timer);
        timer = null;
        await chain;
    };
    const reopenSaving = async () => {
        closed = false;
        dirty = true;
        if (root.isConnected) leave = ctx.onLeave(root, saveNow);
        else await saveNow();
        setBusy(false);
    };

    finishBtn.addEventListener('click', async () => {
        if (closed) return;
        accrue();
        const ok = await ctx.confirm({
            title: 'Zakończyć sesję?',
            text: `Wykonane serie: ${sessionStats(session).doneSets}. Czas: ${Math.round(activeNow() / 60)} min.`,
            okLabel: 'Zakończ',
        });
        if (!ok || !root.isConnected || closed) return;
        await closeSaving();
        accrue();
        try {
            await ctx.vault.put(finishSession(session));
        } catch (e) {
            console.error('[Strefa trenera] zakończenie sesji:', e && e.message);
            await reopenSaving();
            ctx.toast(SAVE_FAILED);
            return;
        }
        stop();
        if (!root.isConnected) return;
        ctx.toast('Sesja zapisana.');
        ctx.show('clients', {}, { reset: true });
        ctx.show('client', { id: client.id });
    });

    discardBtn.addEventListener('click', async () => {
        if (closed) return;
        const ok = await ctx.confirm({
            title: 'Odrzucić sesję?',
            text: 'Wpisane serie znikną. Tego nie da się cofnąć.',
            okLabel: 'Odrzuć', danger: true,
        });
        if (!ok || !root.isConnected || closed) return;
        await closeSaving();
        try {
            await ctx.vault.remove(session.id);
        } catch (e) {
            console.error('[Strefa trenera] odrzucenie sesji:', e && e.message);
            await reopenSaving();
            ctx.toast('Nie udało się usunąć. Spróbuj jeszcze raz.');
            return;
        }
        stop();
        if (!root.isConnected) return;
        ctx.toast('Sesja odrzucona.');
        ctx.show('client', { id: client.id });
    });

    paint();
    root.append(h('div', { class: 'tz-stack' },
        head,
        list,
        h('div', { class: 'tz-row' }, addEx),
        h('section', { class: 'card tz-stack' },
            h('label', { class: 'tz-field' }, h('span', { class: 'sub' }, 'Notatka (samopoczucie, ból)'), note),
            h('div', { class: 'tz-field' },
                h('span', { class: 'sub', id: 'tz-sess-rpe' }, 'RPE sesji (opcjonalnie)'),
                h('div', { class: 'tz-row', role: 'group', 'aria-labelledby': 'tz-sess-rpe' }, rpeChips))),
        h('div', { class: 'tz-row' }, finishBtn, discardBtn)));
}

export function registerSessionScreens(register) {
    register('session-start', renderStart);
    register('session', renderSession);
}
