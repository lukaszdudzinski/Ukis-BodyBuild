// Ekran wywiadu (trasa interview): 5 kroków, zgoda RODO, szkic w sejfie (przy wyjściu z ekranu i przy autoblokadzie).
// Odpowiedzi trafiają do DOM wyłącznie przez h() jako węzły tekstowe lub właściwości value.
import { h, icon } from './dom.js';
import { STEPS, GOALS, QUESTIONNAIRE_VERSION, continuumForGoal } from '../trainerQuestionnaire.js';
import { goalLabel, extraGoals } from '../trainerModel.js';

const SAVE_FAILED = 'Nie udało się zapisać. Spróbuj jeszcze raz.';
const CONSENT_LABEL = 'Klient zgodził się na zapisanie danych o zdrowiu w celu prowadzenia treningów';
const NEED_CONSENT = 'Najpierw zgoda klienta';

// Pola rekordu zamiast answers: cel główny, cele dodatkowe, cel własnymi słowami.
const TOP = { cel_glowny: 'goal', cel_dodatkowy: 'goalExtra', cel_wlasny: 'goalOwnWords' };

function today() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function isDraft(r) {
    return r.status === 'szkic';
}

function newest(list) {
    return list.slice().sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))[0] || null;
}

const HEALTH_IDS = new Set(STEPS.find((s) => s.id === 'zdrowie').questions.map((q) => q.id));

// base: wznawiany szkic (przywracany w całości) albo poprzedni wywiad (przenosimy tylko kroki
// niezdrowotne; zgoda i odpowiedzi o zdrowiu w nowym wywiadzie zaczynają od zera).
function blankState(base, resume) {
    const keep = (id) => resume || !HEALTH_IDS.has(id);
    const answers = {};
    if (base) for (const [id, a] of Object.entries(base.answers || {})) if (keep(id)) answers[id] = structuredClone(a);
    return {
        id: null,
        consent: base && resume ? { ...base.consentHealth } : { given: false, date: null },
        answers,
        goal: base ? base.goal || null : null,
        goalExtra: base ? (base.goalExtra || []).slice() : [],
        goalOwnWords: base ? base.goalOwnWords || '' : '',
    };
}


function renderInterview(root, params, ctx) {
    const client = params.clientId ? ctx.vault.get(params.clientId) : null;
    if (!client) { ctx.show('clients', {}, { reset: true }); return; }

    const records = ctx.vault.list('interview', client.id);
    const draft = newest(records.filter(isDraft));
    const lastDone = newest(records.filter((r) => !isDraft(r)));
    const state = blankState(draft || lastDone, !!draft);
    if (draft) state.id = draft.id;
    // Zmiana względem stanu początkowego ekranu: nietknięty ekran nie zostawia szkicu.
    const snap = () => JSON.stringify([state.consent, state.answers, state.goal, state.goalExtra, state.goalOwnWords]);
    let baseline = snap();

    const get = (q) => {
        if (TOP[q.id]) return state[TOP[q.id]];
        const a = state.answers[q.id];
        return a ? a.value : undefined;
    };
    const set = (q, value) => {
        if (TOP[q.id]) { state[TOP[q.id]] = value; return; }
        state.answers[q.id] = { ...state.answers[q.id], value };
    };
    const getNote = (q) => (state.answers[q.id] && state.answers[q.id].note) || '';
    const setNote = (q, note) => { state.answers[q.id] = { ...state.answers[q.id], note }; };

    const record = (status) => ({
        ...(draft && state.id === draft.id ? draft : {}),
        kind: 'interview',
        id: state.id || undefined,
        clientId: client.id,
        version: QUESTIONNAIRE_VERSION,
        date: today(),
        status,
        consentHealth: { given: state.consent.given, date: state.consent.given ? state.consent.date : null },
        answers: state.consent.given ? state.answers
            : Object.fromEntries(Object.entries(state.answers).filter(([id]) => !HEALTH_IDS.has(id))),
        goal: state.goal,
        goalExtra: state.goalExtra,
        goalOwnWords: state.goalOwnWords,
    });

    // Zapisy idą jeden po drugim, żeby szkic z przycisku i z autoblokady nie utworzył dwóch rekordów.
    // Szkic nigdy nie nadpisuje wywiadu, który już jest zakończony (np. szkic z kolejki po „Zakończ wywiad”).
    let queue = Promise.resolve();
    const isFinished = () => {
        const stored = state.id ? ctx.vault.get(state.id) : null;
        return !!stored && stored.status === 'gotowy';
    };
    const persist = (status) => {
        const run = queue.then(async () => {
            if (status === 'szkic' && isFinished()) return null;
            const saved = await ctx.vault.put(record(status));
            state.id = saved.id;
            baseline = snap();
            return saved;
        });
        queue = run.catch(() => {});
        return run;
    };

    // Router zapisuje szkic przed zmianą ekranu (Wstecz, pasek, wyjście ze Strefy) i przed blokadą.
    const saveDraft = async () => {
        if (snap() === baseline) return;
        await persist('szkic');
    };
    let leave = ctx.onLeave(root, saveDraft);

    let step = 0;
    const body = h('div', { class: 'tz-stack' });
    const stepBar = h('div', { class: 'tz-steps', role: 'group', 'aria-label': 'Kroki wywiadu' });
    const prev = h('button', { type: 'button', class: 'ghost' }, icon('chevron-left'), 'Wstecz');
    const next = h('button', { type: 'button', class: 'btn' });
    const draftBtn = h('button', { type: 'button', class: 'ghost' }, 'Zapisz szkic');

    const noteInput = (q, disabled, placeholder) => h('input', {
        class: 'in', type: 'text', value: getNote(q), disabled, autocomplete: 'off', 'aria-label': `${q.label} — ${placeholder}`,
        placeholder, oninput: (e) => setNote(q, e.target.value),
    });

    function renderQuestion(q, locked) {
        if (q.type === 'yesno') {
            const note = noteInput(q, locked, q.withNote);
            const sync = () => { note.hidden = get(q) !== true; };
            const radio = (label, value) => h('label', { class: 'chip tz-yn' },
                h('input', {
                    type: 'radio', name: `q-${q.id}`, disabled: locked, checked: get(q) === value,
                    onchange: () => { set(q, value); sync(); },
                }), label);
            sync();
            return h('fieldset', { class: 'tz-q', disabled: locked },
                h('legend', { class: 'sub' }, q.label),
                h('div', { class: 'tz-row' }, radio('Tak', true), radio('Nie', false)),
                note);
        }
        if (q.type === 'text') {
            return h('label', { class: 'tz-field tz-q' }, h('span', { class: 'sub' }, q.label),
                h('input', { class: 'in', type: 'text', disabled: locked, value: get(q) || '', autocomplete: 'off', oninput: (e) => set(q, e.target.value) }));
        }
        if (q.type === 'number') {
            return h('label', { class: 'tz-field tz-q' }, h('span', { class: 'sub' }, q.label),
                h('input', {
                    class: 'in', type: 'number', inputmode: 'decimal', min: 0, value: get(q) ?? '',
                    oninput: (e) => set(q, e.target.value === '' ? null : Number(e.target.value)),
                }));
        }
        if (q.id === 'cel_glowny') return renderGoalPicker(q);
        if (q.type === 'multi') return renderExtraGoals(q);
        // choice
        const chips = q.options.map((o) => h('button', {
            type: 'button', class: 'chip', 'aria-pressed': 'false',
            onclick: () => { set(q, get(q) === o ? null : o); paint(); },
        }, o));
        const paint = () => chips.forEach((c, i) => {
            const on = q.options[i] === get(q);
            c.classList.toggle('chipon', on);
            c.setAttribute('aria-pressed', String(on));
        });
        paint();
        return h('div', { class: 'tz-field tz-q' }, h('span', { class: 'sub' }, q.label), h('div', { class: 'tz-row' }, chips));
    }

    // Karta „Podpowiedź do planu”: wiersz dla celu głównego i dla każdego celu dodatkowego, który ma kontinuum.
    // Odświeżana także przy zmianie celów dodatkowych (ten sam krok „Cel”).
    let paintHint = () => {};

    function renderGoalPicker(q) {
        const card = h('section', { class: 'card tz-cont tz-stack', 'aria-live': 'polite' });
        const buttons = GOALS.map((g) => h('button', {
            type: 'button', class: 'chip', 'aria-pressed': 'false',
            onclick: () => { set(q, state.goal === g.id ? null : g.id); paint(); },
        }, g.label));
        const cell = (label, value) => h('div', { class: 'tz-cont-cell' }, h('span', { class: 'mut' }, label), h('strong', {}, value));
        paintHint = () => {
            const ids = [...(state.goal ? [state.goal] : []), ...extraGoals(state.goal, state.goalExtra)];
            const rows = ids.map((id) => [id, continuumForGoal(id)]).filter(([, c]) => c).map(([id, c]) => h('div', { class: 'tz-cont-row' },
                h('h4', { class: 'tz-cont-goal' }, goalLabel(id)),
                h('div', { class: 'tz-cont-grid' }, cell('Powtórzenia', c.reps), cell('% CM', c.pct), cell('Przerwa', c.rest))));
            card.hidden = !rows.length;
            card.replaceChildren(...(rows.length ? [h('h3', { class: 'sub' }, 'Podpowiedź do planu'), ...rows] : []));
        };
        const paint = () => {
            buttons.forEach((b, i) => {
                const on = GOALS[i].id === state.goal;
                b.classList.toggle('chipon', on);
                b.setAttribute('aria-pressed', String(on));
            });
            paintHint();
        };
        paint();
        return h('div', { class: 'tz-field tz-q' }, h('span', { class: 'sub' }, q.label),
            h('div', { class: 'tz-goals' }, buttons), card);
    }

    function renderExtraGoals(q) {
        const boxes = GOALS.map((g) => h('label', { class: 'chip tz-yn' },
            h('input', {
                type: 'checkbox', checked: state.goalExtra.includes(g.id),
                onchange: (e) => {
                    state.goalExtra = e.target.checked ? [...state.goalExtra, g.id] : state.goalExtra.filter((x) => x !== g.id);
                    paintHint();
                },
            }), g.label));
        return h('div', { class: 'tz-field tz-q' }, h('span', { class: 'sub' }, q.label),
            h('div', { class: 'tz-goals' }, boxes), noteInput(q, false, q.withNote));
    }

    function paintStep() {
        const s = STEPS[step];
        stepBar.replaceChildren(...STEPS.map((x, i) => h('button', {
            type: 'button', class: `tz-stepbtn${i === step ? ' tz-stepon' : ''}`, 'aria-current': i === step ? 'step' : null,
            onclick: () => { step = i; paintStep(); },
        }, h('span', { class: 'tz-stepnum' }, String(i + 1)), h('span', { class: 'tz-steplbl' }, x.label))));

        const parts = [];
        let locked = false;
        if (s.id === 'zdrowie') {
            locked = !state.consent.given;
            const consent = h('input', {
                type: 'checkbox', checked: state.consent.given,
                onchange: async (e) => {
                    if (e.target.checked) {
                        state.consent = { given: true, date: today() };
                    } else {
                        const ok = await ctx.confirm({
                            title: 'Usunąć odpowiedzi o zdrowiu?',
                            text: 'Bez zgody klienta nie przechowujemy danych o zdrowiu. Odpowiedzi z tego kroku zostaną usunięte.',
                            okLabel: 'Usuń', danger: true,
                        });
                        if (ok) {
                            state.consent = { given: false, date: null };
                            for (const id of HEALTH_IDS) delete state.answers[id];
                        }
                    }
                    paintStep();
                },
            });
            parts.push(h('section', { class: 'card tz-stack' },
                h('label', { class: 'tz-check' }, consent, h('span', {}, CONSENT_LABEL)),
                state.consent.given ? h('p', { class: 'mut' }, `Zgoda z dnia ${state.consent.date}`) : h('p', { class: 'mut' }, NEED_CONSENT)));
        }
        parts.push(h('section', { class: 'card tz-stack' },
            h('h2', { class: 'hd' }, s.label),
            s.questions.map((q) => renderQuestion(q, locked))));
        body.replaceChildren(...parts);
        prev.hidden = step === 0;
        next.replaceChildren(step === STEPS.length - 1 ? [icon('check'), 'Zakończ wywiad'] : ['Dalej']);
    }

    const busy = (btn, fn) => async () => {
        btn.disabled = true;
        try { await fn(); } catch (e) {
            console.error('[Strefa trenera] zapis wywiadu:', e && e.message);
            ctx.toast(SAVE_FAILED);
        }
        btn.disabled = false;
    };

    prev.addEventListener('click', () => { if (step > 0) { step -= 1; paintStep(); } });
    draftBtn.addEventListener('click', busy(draftBtn, async () => {
        await persist('szkic');
        ctx.toast('Szkic zapisany.');
    }));
    // „Zakończ wywiad”: hak szkicu znika przed zapisem, więc wyjście albo blokada w trakcie zapisu
    // nie dokłada szkicu. Nieudany zapis przywraca hak (a gdy ekranu już nie ma, od razu zapisuje szkic).
    next.addEventListener('click', busy(next, async () => {
        if (step < STEPS.length - 1) { step += 1; paintStep(); return; }
        leave();
        try {
            await persist('gotowy');
        } catch (e) {
            if (root.isConnected) leave = ctx.onLeave(root, saveDraft);
            else await saveDraft().catch(() => {});
            throw e;
        }
        if (state.goal && state.goal !== client.goal) await ctx.vault.put({ ...client, goal: state.goal });
        if (root.isConnected) ctx.show('client', { id: client.id });
    }));

    root.append(h('div', { class: 'tz-stack' },
        h('section', { class: 'card tz-stack' },
            h('h2', { class: 'hd' }, 'Wywiad'),
            stepBar),
        body,
        h('div', { class: 'tz-row tz-between' }, prev, h('div', { class: 'tz-row' }, draftBtn, next))));
    paintStep();
}

export function registerInterviewScreen(register) {
    register('interview', renderInterview);
}
