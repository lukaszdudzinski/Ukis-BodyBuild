// Ekran oceny funkcjonalnej (trasa assessment): lista ocen klienta i edycja jednej oceny.
// Niezapisana ocena zostaje jako szkic (rekord assessment_draft w sejfie) przy wyjściu z ekranu
// i przy autoblokadzie; po powrocie formularz wraca ze szkicu, zapis albo „Anuluj” go usuwa.
// Dane klienta trafiają do DOM wyłącznie przez h() (węzły tekstowe i właściwość value).
import { h, icon } from './dom.js';
import { TESTS, EXTRA_TESTS, scoreAssessment, compareAssessments } from '../trainerAssessment.js';

const SAVE_FAILED = 'Nie udało się zapisać. Spróbuj jeszcze raz.';
const ARROW = { up: '↑', down: '↓' };
const CRITERIA_ORDER = [3, 2, 1, 0];

function today() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function byNewest(list) {
    return list.slice().sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))
        || String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
}

const testLabel = (id) => TESTS.find((t) => t.id === id).label;

function blankExtra() {
    return { ankle: { left: '', right: '' }, thomas: { left: '', right: '' }, custom: [] };
}

function renderList(root, client, list, ctx, edit) {
    const rows = list.map((rec, i) => {
        const s = scoreAssessment(rec.results);
        const older = list[i + 1];
        const diff = older ? compareAssessments(older.results, rec.results) : {};
        const arrows = TESTS.filter((t) => ARROW[diff[t.id]]).map((t) => `${t.label} ${ARROW[diff[t.id]]}`);
        return h('button', { type: 'button', class: 'card tz-asm-row', onclick: () => edit(rec) },
            h('span', { class: 'tz-between' },
                h('strong', {}, rec.date || ''),
                h('span', { class: 'hd tz-asm-total' }, `${s.total} / ${s.max}`)),
            s.pain.length ? h('span', { class: 'hi' }, `Ból: ${s.pain.map(testLabel).join(', ')}`) : null,
            s.asymmetry.length ? h('span', { class: 'mut' }, `Asymetrie: ${s.asymmetry.length}`) : null,
            arrows.length ? h('span', { class: 'sub' }, arrows.join(' · ')) : null);
    });
    root.append(h('div', { class: 'tz-stack' },
        h('section', { class: 'card tz-stack' },
            h('h2', { class: 'hd' }, 'Ocena funkcjonalna'),
            h('button', { type: 'button', class: 'btn', onclick: () => edit(null) }, icon('plus'), 'Nowa ocena')),
        rows));
}

const DRAFT_KIND = 'assessment_draft';

const findDraft = (ctx, clientId) => ctx.vault.list(DRAFT_KIND, clientId)[0] || null;

async function discardDrafts(ctx, clientId) {
    for (const d of ctx.vault.list(DRAFT_KIND, clientId)) await ctx.vault.remove(d.id);
}

// rec: edytowana ocena (null = nowa); draft: wznawiany szkic (jego wyniki zastępują wyniki oceny).
function renderForm(root, client, rec, ctx, draft = null) {
    const src = draft || rec;
    const results = src ? structuredClone(src.results || {}) : {};
    const extra = src && src.extra ? { ...blankExtra(), ...structuredClone(src.extra) } : blankExtra();
    let note = src ? src.note || '' : '';

    // Zmiana względem stanu z otwarcia: nietknięty formularz nie zostawia szkicu.
    const snap = () => JSON.stringify([results, extra, note]);
    const baseline = snap();
    let draftId = draft ? draft.id : (findDraft(ctx, client.id) || {}).id || null;
    const saveDraft = async () => {
        if (snap() === baseline) return;
        const saved = await ctx.vault.put({
            kind: DRAFT_KIND, id: draftId || undefined, clientId: client.id,
            assessmentId: rec ? rec.id : null, results, extra, note,
        });
        draftId = saved.id;
    };
    let leave = ctx.onLeave(root, saveDraft);

    const summary = h('section', { class: 'card tz-stack', 'aria-live': 'polite' });
    const paintSummary = () => {
        const s = scoreAssessment(results);
        summary.replaceChildren(
            h('div', { class: 'tz-between' },
                h('span', { class: 'hd tz-asm-total' }, `${s.total} / ${s.max}`),
                s.complete ? null : h('span', { class: 'mut' }, 'ocena niepełna')),
            h('div', { class: 'tz-row' },
                h('span', { class: 'sub' }, `Asymetrie: ${s.asymmetry.length}`),
                s.pain.length ? h('span', { class: 'hi' }, `Ból: ${s.pain.map(testLabel).join(', ')}`) : null));
    };

    const scoreRow = (t, label, get, set) => {
        const group = h('div', { class: 'tz-scores', role: 'group', 'aria-label': label });
        const paint = () => group.replaceChildren(...[0, 1, 2, 3].map((n) => h('button', {
            type: 'button', class: `tz-sc tz-sc${n}`, 'aria-pressed': String(get() === n),
            onclick: () => { set(n); paint(); paintSummary(); },
        }, String(n))));
        paint();
        return group;
    };

    const testBlock = (t) => {
        const how = h('div', { class: 'tz-how tz-stack', hidden: true },
            h('p', {}, t.how),
            h('ul', { class: 'tz-crit' }, CRITERIA_ORDER.map((n) => h('li', {}, h('strong', {}, `${n}: `), t.criteria[n]))));
        const info = h('button', { type: 'button', class: 'ghost tz-info', 'aria-label': `Jak wykonać: ${t.label}`, 'aria-expanded': 'false',
            onclick: () => { how.hidden = !how.hidden; info.setAttribute('aria-expanded', String(!how.hidden)); } }, icon('info'));
        const rowsEl = t.bilateral
            ? ['left', 'right'].map((side) => h('div', { class: 'tz-side' },
                h('span', { class: 'sub tz-sidelabel' }, side === 'left' ? 'L' : 'P'),
                scoreRow(t, `${t.label}, ${side === 'left' ? 'lewa' : 'prawa'}`,
                    () => (results[t.id] || {})[side],
                    (n) => { results[t.id] = { ...results[t.id], [side]: n }; })))
            : [scoreRow(t, t.label, () => (results[t.id] || {}).score, (n) => { results[t.id] = { score: n }; })];
        return h('section', { class: 'card tz-stack' },
            h('div', { class: 'tz-between' }, h('h3', { class: 'hd tz-asm-name' }, t.label), info),
            how, rowsEl);
    };

    const extraInput = (label, unit, obj, key) => h('label', { class: 'tz-field' },
        h('span', { class: 'sub' }, label),
        h('input', { class: 'in', type: unit ? 'number' : 'text', inputmode: unit ? 'decimal' : null, autocomplete: 'off',
            'aria-label': label, value: obj[key] ?? '', oninput: (e) => { obj[key] = e.target.value; } }));

    const customBox = h('div', { class: 'tz-stack' });
    const paintCustom = () => customBox.replaceChildren(
        ...extra.custom.map((c, i) => h('div', { class: 'tz-row tz-custom' },
            h('input', { class: 'in', type: 'text', autocomplete: 'off', placeholder: 'Nazwa testu', 'aria-label': `Test własny ${i + 1}, nazwa`, value: c.label, oninput: (e) => { c.label = e.target.value; } }),
            h('input', { class: 'in', type: 'text', autocomplete: 'off', placeholder: 'Wynik', 'aria-label': `Test własny ${i + 1}, wynik`, value: c.value, oninput: (e) => { c.value = e.target.value; } }),
            h('button', { type: 'button', class: 'ghost', 'aria-label': `Usuń test własny ${i + 1}`, onclick: () => { extra.custom.splice(i, 1); paintCustom(); } }, icon('trash')))),
        h('button', { type: 'button', class: 'ghost', onclick: () => { extra.custom.push({ label: '', value: '' }); paintCustom(); } }, icon('plus'), 'Dodaj własny test'));
    paintCustom();

    const extraBody = h('section', { class: 'card tz-stack', hidden: true },
        EXTRA_TESTS.map((t) => h('div', { class: 'tz-stack' },
            h('p', { class: 'mut' }, t.how),
            t.unit
                ? [extraInput(`${t.label}, lewa (${t.unit})`, t.unit, extra[t.id], 'left'),
                    extraInput(`${t.label}, prawa (${t.unit})`, t.unit, extra[t.id], 'right'),
                    h('p', { class: 'mut' }, `Norma: co najmniej ${t.norm} ${t.unit}.`)]
                : [extraInput(`${t.label}, lewa`, null, extra[t.id], 'left'), extraInput(`${t.label}, prawa`, null, extra[t.id], 'right')])),
        customBox);
    const extraBtn = h('button', { type: 'button', class: 'ghost', 'aria-expanded': 'false',
        onclick: () => { extraBody.hidden = !extraBody.hidden; extraBtn.setAttribute('aria-expanded', String(!extraBody.hidden)); } }, 'Testy dodatkowe');

    const save = h('button', { type: 'button', class: 'btn' }, icon('check'), 'Zapisz ocenę');
    // Hak szkicu znika przed zapisem: wyjście albo blokada w trakcie zapisu nie tworzy szkicu,
    // który potem wróciłby jako „Wznowiona niezapisana ocena”. Nieudany zapis przywraca hak
    // (a gdy ekranu już nie ma, od razu zapisuje szkic).
    save.addEventListener('click', async () => {
        save.disabled = true;
        leave();
        try {
            await ctx.vault.put({
                ...(rec || {}), kind: 'assessment', clientId: client.id, date: rec ? rec.date : today(),
                results, extra, note,
            });
        } catch (e) {
            console.error('[Strefa trenera] zapis oceny:', e && e.message);
            if (root.isConnected) leave = ctx.onLeave(root, saveDraft);
            else await saveDraft().catch(() => {});
            ctx.toast(SAVE_FAILED);
            save.disabled = false;
            return;
        }
        try { await discardDrafts(ctx, client.id); } catch (e) { console.error('[Strefa trenera] szkic oceny:', e && e.message); }
        ctx.toast('Ocena zapisana.');
        // Trener w międzyczasie wyszedł z ekranu albo Strefa się zablokowała: zostaje tam, gdzie jest.
        if (root.isConnected) ctx.show('client', { id: client.id });
    });

    const cancel = h('button', { type: 'button', class: 'ghost' }, 'Anuluj');
    cancel.addEventListener('click', async () => {
        leave();
        try { await discardDrafts(ctx, client.id); } catch (e) { console.error('[Strefa trenera] szkic oceny:', e && e.message); }
        ctx.show('client', { id: client.id });
    });

    paintSummary();
    root.append(h('div', { class: 'tz-stack' },
        draft ? h('p', { class: 'mut' }, 'Wznowiona niezapisana ocena.') : null,
        summary,
        TESTS.map(testBlock),
        extraBtn, extraBody,
        h('label', { class: 'tz-field' }, h('span', { class: 'sub' }, 'Notatka'),
            h('input', { class: 'in', type: 'text', autocomplete: 'off', value: note, oninput: (e) => { note = e.target.value; } })),
        h('div', { class: 'tz-row' }, save, cancel)));
}

function renderAssessment(root, params, ctx) {
    const client = params.clientId ? ctx.vault.get(params.clientId) : null;
    if (!client) { ctx.show('clients', {}, { reset: true }); return; }
    const list = byNewest(ctx.vault.list('assessment', client.id));
    const edit = (rec, draft = null) => {
        root.replaceChildren();
        renderForm(root, client, rec, ctx, draft);
    };
    const draft = findDraft(ctx, client.id);
    // Szkic wraca od razu (do edytowanej oceny, a gdy jej już nie ma, jako nowa ocena).
    if (draft) edit(draft.assessmentId ? ctx.vault.get(draft.assessmentId) : null, draft);
    else if (list.length === 0) renderForm(root, client, null, ctx);
    else renderList(root, client, list, ctx, edit);
}

export function registerAssessmentScreen(register) {
    register('assessment', renderAssessment);
}
