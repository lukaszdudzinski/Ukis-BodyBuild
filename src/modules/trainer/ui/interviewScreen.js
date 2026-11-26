// Ekran wywiadu (trasa interview): 5 kroków, zgoda RODO, szkic w sejfie (przy wyjściu z ekranu i przy autoblokadzie).
// Na dole każdego kroku „Uwagi” (notes[stepId]) z nagraniami głosowymi (interviewNotes.js).
// Odpowiedzi trafiają do DOM wyłącznie przez h() jako węzły tekstowe lub właściwości value.
import { h, icon } from './dom.js';
import { STEPS, GOALS, QUESTIONNAIRE_VERSION, continuumForGoal, isVisible } from '../trainerQuestionnaire.js';
import { goalLabel, extraGoals, clientAge } from '../trainerModel.js';
import { latestValue, formatNumber } from '../trainerMeasurements.js';
import { createInterviewNotes } from './interviewNotes.js';

const SAVE_FAILED = 'Nie udało się zapisać. Spróbuj jeszcze raz.';
const CONSENT_LABEL = 'Klient zgodził się na zapisanie danych o zdrowiu w celu prowadzenia treningów';
const NEED_CONSENT = 'Najpierw zgoda klienta';
const HEALTH_STEP = 'zdrowie';

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

const QUESTION_BY_ID = new Map(STEPS.flatMap((s) => s.questions.map((q) => [q.id, q])));
const HEALTH_IDS = new Set(STEPS.find((s) => s.id === 'zdrowie').questions.map((q) => q.id));

// base: wznawiany szkic (przywracany w całości) albo poprzedni wywiad (przenosimy tylko kroki
// niezdrowotne; zgoda i odpowiedzi o zdrowiu w nowym wywiadzie zaczynają od zera).
function blankState(base, resume) {
    const keep = (id) => resume || !HEALTH_IDS.has(id);
    const answers = {};
    if (base) for (const [id, a] of Object.entries(base.answers || {})) if (keep(id)) answers[id] = structuredClone(a);
    const notes = {};
    if (base) for (const [id, n] of Object.entries(base.notes || {})) if ((resume || id !== HEALTH_STEP) && typeof n === 'string') notes[id] = n;
    return {
        id: null,
        consent: base && resume ? { ...base.consentHealth } : { given: false, date: null },
        answers,
        notes,
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
    const snap = () => JSON.stringify([state.consent, state.answers, state.notes, state.goal, state.goalExtra, state.goalOwnWords]);
    let baseline = snap();

    const get = (q) => {
        if (TOP[q.id]) return state[TOP[q.id]];
        const a = state.answers[q.id];
        return a ? a.value : undefined;
    };
    // Widoczność pytań zależnych (dyspozycyjność: „Stałe” / „Zmienne”) na bieżącym kroku.
    let refreshVisibility = () => {};
    const set = (q, value) => {
        if (TOP[q.id]) { state[TOP[q.id]] = value; return; }
        const next = { ...state.answers[q.id], value };
        // „Nie” przy pytaniu z wyborem (hormony) czyści zaznaczenia: nie zostają ukryte w rekordzie.
        if (q.options && q.type === 'yesno' && value === false) delete next.options;
        state.answers[q.id] = next;
        refreshVisibility();
    };
    const getNote = (q) => (state.answers[q.id] && state.answers[q.id].note) || '';
    const setNote = (q, note) => { state.answers[q.id] = { ...state.answers[q.id], note }; };
    const getOptions = (q) => (state.answers[q.id] && state.answers[q.id].options) || [];
    const setOption = (q, id, on) => {
        const picked = new Set(getOptions(q));
        if (on) picked.add(id); else picked.delete(id);
        state.answers[q.id] = { ...state.answers[q.id], options: q.options.filter((o) => picked.has(o.id)).map((o) => o.id) };
    };
    // Uwagi kroku: tylko niepuste; bez zgody bez uwag kroku „Zdrowie”.
    const storedNotes = () => Object.fromEntries(Object.entries(state.notes)
        .filter(([id, n]) => String(n || '').trim() !== '' && (state.consent.given || id !== HEALTH_STEP)));

    const record = (status) => ({
        ...(draft && state.id === draft.id ? draft : {}),
        kind: 'interview',
        id: state.id || undefined,
        clientId: client.id,
        version: QUESTIONNAIRE_VERSION,
        date: today(),
        status,
        consentHealth: { given: state.consent.given, date: state.consent.given ? state.consent.date : null },
        // Bez zgody bez odpowiedzi o zdrowiu; odpowiedzi ukrytych pytań (np. dni przy „Zmienne”) nie zostają.
        answers: Object.fromEntries(Object.entries(state.answers)
            .filter(([id]) => (state.consent.given || !HEALTH_IDS.has(id)) && isVisible(QUESTION_BY_ID.get(id), state.answers))),
        notes: storedNotes(),
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

    // Nagrania należą do wywiadu: bez rekordu wywiadu najpierw powstaje szkic.
    const notesKit = createInterviewNotes(ctx, {
        clientId: client.id,
        interviewId: () => state.id,
        // Szkic zapisuje się także przy niezapisanych zmianach: nagranie o zdrowiu ma w sejfie wywiad ze zgodą.
        ensureInterviewId: async () => {
            if (!state.id || snap() !== baseline) await persist('szkic');
            return state.id;
        },
    });
    notesKit.load();

    // Router zapisuje szkic przed zmianą ekranu (Wstecz, pasek, wyjście ze Strefy) i przed blokadą.
    // Nagranie w toku kończy się wtedy zapisem, a mikrofon i odtwarzanie są zwalniane.
    // Tekst zapisuje się pierwszy: wolny zapis nagrania nigdy nie zabiera wpisanych uwag.
    const saveDraft = async () => {
        notesKit.stopPlayback();
        const audio = notesKit.stopAndSave();
        if (snap() !== baseline) await persist('szkic');
        await audio;
    };
    let leave = ctx.onLeave(root, saveDraft);

    // Zwykła część aplikacji albo tło: nagrywanie kończy się zapisem, odtwarzanie się zatrzymuje.
    const pause = () => {
        notesKit.stopPlayback();
        notesKit.stopAndSave().catch(() => {});
    };
    const onTab = (e) => {
        if (!root.isConnected) { detach(); return; }
        if (!(e.detail && e.detail.tab === 'trainer-zone')) pause();
    };
    const onVisibility = () => {
        if (!root.isConnected) { detach(); return; }
        if (document.visibilityState === 'hidden') pause();
    };
    const detach = () => {
        document.removeEventListener('tabChanged', onTab);
        document.removeEventListener('visibilitychange', onVisibility);
    };
    document.addEventListener('tabChanged', onTab);
    document.addEventListener('visibilitychange', onVisibility);

    let step = Number.isInteger(params.step) ? Math.min(Math.max(params.step, 0), STEPS.length - 1) : 0;
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
            // Pytanie z wyborem (hormony): pola do zaznaczenia pokazują się po „Tak”, jak notatka.
            const opts = q.options ? h('div', { class: 'tz-row' }, q.options.map((o) => h('label', { class: 'chip tz-yn' },
                h('input', {
                    type: 'checkbox', disabled: locked, checked: getOptions(q).includes(o.id),
                    onchange: (e) => setOption(q, o.id, e.target.checked),
                }), o.label))) : null;
            const sync = () => {
                note.hidden = get(q) !== true;
                if (opts) opts.hidden = get(q) !== true;
                if (opts && get(q) === false) opts.querySelectorAll('input').forEach((i) => { i.checked = false; });
            };
            const radio = (label, value) => h('label', { class: 'chip tz-yn' },
                h('input', {
                    type: 'radio', name: `q-${q.id}`, disabled: locked, checked: get(q) === value,
                    onchange: () => { set(q, value); sync(); },
                }), label);
            sync();
            return h('fieldset', { class: 'tz-q', disabled: locked },
                h('legend', { class: 'sub' }, q.label),
                h('div', { class: 'tz-row' }, radio('Tak', true), radio('Nie', false)),
                opts,
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
        if (q.type === 'days') {
            const picked = () => new Set(Array.isArray(get(q)) ? get(q) : []);
            const chips = q.options.map((o) => h('button', {
                type: 'button', class: 'chip', 'aria-pressed': 'false',
                onclick: () => {
                    const cur = picked();
                    if (cur.has(o.id)) cur.delete(o.id); else cur.add(o.id);
                    set(q, q.options.filter((x) => cur.has(x.id)).map((x) => x.id));
                    paint();
                },
            }, o.label));
            const paint = () => chips.forEach((c, i) => {
                const on = picked().has(q.options[i].id);
                c.classList.toggle('chipon', on);
                c.setAttribute('aria-pressed', String(on));
            });
            paint();
            return h('div', { class: 'tz-field tz-q' }, h('span', { class: 'sub' }, q.label), h('div', { class: 'tz-row' }, chips));
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

    // Pytania kroku z nagłówkami sekcji (np. „Dyspozycyjność”); pytania z showIf chowają się same.
    function questionNodes(s, locked) {
        const dependent = [];
        const nodes = s.questions.flatMap((q) => {
            const node = renderQuestion(q, locked);
            if (q.showIf) dependent.push([q, node]);
            return q.section ? [h('h3', { class: 'hd tz-notes-hd' }, q.section), node] : [node];
        });
        refreshVisibility = () => dependent.forEach(([q, node]) => { node.hidden = !isVisible(q, state.answers); });
        refreshVisibility();
        return nodes;
    }

    // Wiek z karty klienta, ostatnia waga i wzrost z pomiarów (z datą). Pomiary zostają rekordami w czasie;
    // „Dodaj pomiar” otwiera formularz pomiaru i wraca na ten krok wywiadu.
    function bodyFacts() {
        const fresh = ctx.vault.get(client.id) || client;
        const ms = ctx.vault.list('measurement', client.id);
        const age = clientAge(fresh);
        const weight = latestValue(ms, 'weight');
        const height = latestValue(ms, 'height');
        const parts = [];
        if (age !== null) parts.push(`Wiek: ${age}`);
        if (weight) parts.push(`Waga: ${formatNumber(weight.value)} kg (${weight.date})`);
        if (height) parts.push(`Wzrost: ${formatNumber(height.value)} cm (${height.date})`);
        else if (fresh.heightCm) parts.push(`Wzrost: ${fresh.heightCm} cm (z karty klienta)`);
        if (!weight && !height) parts.push('Brak pomiarów');
        return h('div', { class: 'tz-body-facts tz-row tz-between' },
            h('p', { class: 'sub' }, parts.join(' · ')),
            h('button', {
                type: 'button', class: 'ghost',
                onclick: () => ctx.show('measurements', { clientId: client.id, add: true, back: { route: 'interview', params: { clientId: client.id, step } } }),
            }, icon('ruler'), 'Dodaj pomiar'));
    }

    function paintStep() {
        const s = STEPS[step];
        // Karta „Uwagi” poprzedniego kroku znika: nagranie w toku kończy się zapisem.
        if (notesKit.isRecording()) notesKit.stopAndSave().catch(() => {});
        notesKit.stopPlayback();
        notesKit.unmount();
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
                        const clips = notesKit.healthClipCount();
                        const ok = await ctx.confirm({
                            title: 'Usunąć odpowiedzi o zdrowiu?',
                            text: 'Bez zgody klienta nie przechowujemy danych o zdrowiu. Odpowiedzi i uwagi z tego kroku zostaną usunięte'
                                + (clips ? `, a także nagrania o zdrowiu ze wszystkich wywiadów klienta (${clips}).` : '.'),
                            okLabel: 'Usuń', danger: true,
                        });
                        if (ok) {
                            state.consent = { given: false, date: null };
                            for (const id of HEALTH_IDS) delete state.answers[id];
                            delete state.notes[HEALTH_STEP];
                            try {
                                await notesKit.removeHealthClips();
                            } catch (err) {
                                console.error('[Strefa trenera] usuwanie nagrań o zdrowiu:', err && err.message);
                                ctx.toast('Nie udało się usunąć nagrań. Spróbuj jeszcze raz.');
                            }
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
            questionNodes(s, locked)));
        parts.push(notesKit.card(s, {
            value: locked ? '' : state.notes[s.id] || '',
            disabled: locked,
            onInput: (v) => { state.notes[s.id] = v; },
        }));
        body.replaceChildren(...parts);
        prev.hidden = step === 0;
        next.replaceChildren(...(step === STEPS.length - 1 ? [icon('check'), 'Zakończ wywiad'] : ['Dalej']));
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
        notesKit.stopPlayback();
        await notesKit.stopAndSave();
        leave();
        try {
            await persist('gotowy');
        } catch (e) {
            if (root.isConnected) leave = ctx.onLeave(root, saveDraft);
            else await saveDraft().catch(() => {});
            throw e;
        }
        const fresh = ctx.vault.get(client.id) || client;
        if (state.goal && state.goal !== fresh.goal) await ctx.vault.put({ ...fresh, goal: state.goal });
        if (root.isConnected) ctx.show('client', { id: client.id });
    }));

    root.append(h('div', { class: 'tz-stack' },
        h('section', { class: 'card tz-stack' },
            h('h2', { class: 'hd' }, 'Wywiad'),
            stepBar,
            bodyFacts()),
        body,
        h('div', { class: 'tz-row tz-between' }, prev, h('div', { class: 'tz-row' }, draftBtn, next))));
    paintStep();
}

export function registerInterviewScreen(register) {
    register('interview', renderInterview);
}
