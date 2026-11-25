// Ekran pomiarów klienta (trasa measurements): lista, formularz „+ Pomiar” i wykres wybranego pola.
// Pomiary klienta żyją tylko w sejfie (rekordy measurement); tabela measurements aplikacji nie jest ruszana.
// Niezapisany formularz zostaje jako szkic (rekord measurement_draft w sejfie) przy wyjściu z ekranu
// i przy blokadzie; „+ Pomiar” przywraca go, zapis albo „Anuluj” go usuwa.
// Dane trafiają do DOM wyłącznie przez h() i atrybuty SVG ustawiane jako tekst.
import { h, icon } from './dom.js';
import { activeFields, validateMeasurement, seriesFor, formatNumber } from '../trainerMeasurements.js';

const SAVE_FAILED = 'Nie udało się zapisać. Spróbuj jeszcze raz.';
const SVG_NS = 'http://www.w3.org/2000/svg';

function today() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const fieldLabel = (f) => (f.unit ? `${f.label} (${f.unit})` : f.label);

const DRAFT_KIND = 'measurement_draft';

// Wpisane wartości bez pustych pól, w stałej kolejności (do porównania ze stanem z otwarcia).
const filled = (raw) => Object.entries(raw).filter(([, v]) => String(v ?? '').trim() !== '').sort(([a], [b]) => a.localeCompare(b));

function svg(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
    return el;
}

// Wykres: polyline w kolorze akcentu motywu, z opisem zmiany dla czytników ekranu.
function chart(field, series) {
    if (series.length === 0) return h('p', { class: 'mut' }, 'Brak danych do wykresu.');
    const W = 300;
    const H = 120;
    const pad = 12;
    const values = series.map((s) => s.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const pts = series.map((s, i) => [
        series.length === 1 ? W / 2 : pad + (i * (W - 2 * pad)) / (series.length - 1),
        H - pad - ((s.value - min) / span) * (H - 2 * pad),
    ]);
    const unit = field.unit ? ` ${field.unit}` : '';
    const first = series[0];
    const last = series[series.length - 1];
    const label = series.length === 1
        ? `${field.label}: ${formatNumber(last.value)}${unit}`
        : `${field.label}: z ${formatNumber(first.value)} do ${formatNumber(last.value)}${unit}`;
    const el = svg('svg', { class: 'tz-chart', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': label, preserveAspectRatio: 'none' });
    if (series.length > 1) {
        el.appendChild(svg('polyline', { points: pts.map((p) => p.join(',')).join(' '), fill: 'none', stroke: 'var(--tz-hi)', 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke' }));
    }
    pts.forEach(([x, y]) => el.appendChild(svg('circle', { cx: x, cy: y, r: 3.5, fill: 'var(--tz-hi)' })));
    return el;
}

function renderMeasurements(root, params, ctx) {
    const client = params.clientId ? ctx.vault.get(params.clientId) : null;
    if (!client) { ctx.show('clients', {}, { reset: true }); return; }
    const settings = ctx.vault.list('trainer_settings')[0];
    const fields = activeFields(settings);
    const state = { adding: false, chartField: 'weight' };
    // Hak szkicu otwartego formularza (zdejmowany, gdy formularz znika z ekranu).
    let leave = () => {};
    const discardDrafts = async () => {
        for (const d of ctx.vault.list(DRAFT_KIND, client.id)) await ctx.vault.remove(d.id);
    };

    const paint = () => {
        leave();
        leave = () => {};
        const all = ctx.vault.list('measurement', client.id);
        const sorted = all.slice().sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))
            || String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
        root.replaceChildren(state.adding || sorted.length === 0 ? form(sorted.length > 0) : overview(sorted));
    };

    const overview = (sorted) => {
        const withData = fields.filter((f) => seriesFor(sorted, f.id).length > 0);
        // Wybrane pole spoza pól z danymi: wykres i lista przechodzą na pierwsze pole z danymi.
        const field = withData.find((f) => f.id === state.chartField) || withData[0] || fields[0];
        const select = h('select', { class: 'in', 'aria-label': 'Pole wykresu', value: field.id,
            onchange: (e) => { state.chartField = e.target.value; paint(); } },
            (withData.length ? withData : [field]).map((f) => h('option', { value: f.id }, fieldLabel(f))));
        const rows = sorted.map((m) => h('div', { class: 'card tz-meas-row' },
            h('strong', {}, m.date || ''),
            h('span', { class: 'sub' }, m.values && typeof m.values.weight === 'number' ? `${formatNumber(m.values.weight)} kg` : '—'),
            h('span', { class: 'sub' }, m.values && typeof m.values.fat_pct === 'number' ? `${formatNumber(m.values.fat_pct)}%` : '—')));
        return h('div', { class: 'tz-stack' },
            h('section', { class: 'card tz-stack' },
                h('h2', { class: 'hd' }, 'Pomiary'),
                h('button', { type: 'button', class: 'btn', onclick: () => { state.adding = true; paint(); } }, icon('plus'), 'Pomiar')),
            h('section', { class: 'card tz-stack' }, select, chart(field, seriesFor(sorted, field.id))),
            rows);
    };

    const form = (canCancel) => {
        const draft = ctx.vault.list(DRAFT_KIND, client.id)[0] || null;
        const raw = draft && draft.raw ? { ...draft.raw } : {};
        let date = (draft && draft.date) || today();
        let draftId = draft ? draft.id : null;
        // Nietknięty formularz nie zostawia szkicu; wyczyszczony formularz usuwa szkic.
        const snap = () => JSON.stringify([date, filled(raw)]);
        const baseline = snap();
        const saveDraft = async () => {
            if (snap() === baseline) return;
            if (filled(raw).length === 0) { await discardDrafts(); draftId = null; return; }
            const saved = await ctx.vault.put({ kind: DRAFT_KIND, id: draftId || undefined, clientId: client.id, date, raw: { ...raw } });
            draftId = saved.id;
        };
        leave = ctx.onLeave(root, saveDraft);
        const errBoxes = {};
        const formErr = h('p', { class: 'tz-error', role: 'alert', hidden: true });
        const inputs = fields.map((f) => {
            const err = h('p', { class: 'tz-error', role: 'alert', hidden: true });
            errBoxes[f.id] = err;
            return h('label', { class: 'tz-field' },
                h('span', { class: 'sub' }, fieldLabel(f)),
                h('input', { class: 'in', type: 'text', inputmode: 'decimal', autocomplete: 'off', 'aria-label': fieldLabel(f),
                    value: raw[f.id] ?? '', oninput: (e) => { raw[f.id] = e.target.value; } }),
                err);
        });
        const save = h('button', { type: 'button', class: 'btn' }, icon('check'), 'Zapisz pomiar');
        save.addEventListener('click', async () => {
            const res = validateMeasurement(raw, fields);
            fields.forEach((f) => {
                errBoxes[f.id].textContent = res.errors[f.id] || '';
                errBoxes[f.id].hidden = !res.errors[f.id];
            });
            formErr.textContent = res.errors._form || '';
            formErr.hidden = !res.errors._form;
            if (!res.ok) return;
            // Hak szkicu znika przed zapisem: wyjście albo blokada w trakcie zapisu nie tworzy szkicu.
            // Nieudany zapis przywraca hak (a gdy ekranu już nie ma, od razu zapisuje szkic).
            save.disabled = true;
            leave();
            try {
                await ctx.vault.put({ kind: 'measurement', clientId: client.id, date, values: res.values, photoMediaId: null });
            } catch (e) {
                console.error('[Strefa trenera] zapis pomiaru:', e && e.message);
                if (root.isConnected) leave = ctx.onLeave(root, saveDraft);
                else await saveDraft().catch(() => {});
                ctx.toast(SAVE_FAILED);
                save.disabled = false;
                return;
            }
            try { await discardDrafts(); } catch (e) { console.error('[Strefa trenera] szkic pomiaru:', e && e.message); }
            ctx.toast('Pomiar zapisany.');
            if (root.isConnected) ctx.show('client', { id: client.id });
        });
        const cancel = async () => {
            leave();
            try { await discardDrafts(); } catch (e) { console.error('[Strefa trenera] szkic pomiaru:', e && e.message); }
            state.adding = false;
            paint();
        };
        return h('div', { class: 'tz-stack' },
            h('section', { class: 'card tz-stack' },
                h('h2', { class: 'hd' }, 'Nowy pomiar'),
                h('label', { class: 'tz-field' }, h('span', { class: 'sub' }, 'Data'),
                    h('input', { class: 'in', type: 'date', 'aria-label': 'Data', value: date, oninput: (e) => { date = e.target.value || today(); } })),
                inputs, formErr, save,
                canCancel ? h('button', { type: 'button', class: 'ghost', onclick: cancel }, 'Anuluj') : null));
    };

    paint();
}

export function registerMeasurementsScreen(register) {
    register('measurements', renderMeasurements);
}
