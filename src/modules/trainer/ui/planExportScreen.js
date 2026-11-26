// Eksport planu u trenera (trasa plan-export { clientId, planId }, spec 11.1): podgląd, przełączniki „Co trafi do pliku”,
// udostępnienie albo zapis pliku .bodybuild. Plik zawiera tylko plan (budowa w trainerPlanFile.js), bez danych klienta.
import { h, icon } from './dom.js';
import { plural } from '../trainerModel.js';
import { isTestMode } from '../trainerAccess.js';
import {
    buildPlanFile, serializePlanFile, planFileName, DEFAULT_INCLUDE,
} from '../trainerPlanFile.js';

const TYPE = 'application/json';

// Przełącznik: prawdziwy przycisk role="switch" (klawiatura, czytnik ekranu), cel dotyku min. 44 px w CSS.
function switchRow(label, checked, { disabled = false, hint = '', onChange } = {}) {
    const btn = h('button', {
        type: 'button', class: 'tz-switch', role: 'switch', 'aria-checked': String(checked), disabled,
    }, h('span', { class: 'tz-switch-text' }, h('span', {}, label), hint ? h('span', { class: 'mut' }, hint) : null),
    h('span', { class: 'tz-switch-knob', 'aria-hidden': 'true' }));
    btn.addEventListener('click', () => {
        const on = btn.getAttribute('aria-checked') !== 'true';
        btn.setAttribute('aria-checked', String(on));
        if (onChange) onChange(on);
    });
    return btn;
}

function download(file) {
    const url = URL.createObjectURL(file);
    const a = h('a', { href: url, download: file.name });
    a.style.display = 'none';
    document.body.append(a);
    a.click();
    a.remove();
    // 60 s: wolny telefon może zacząć pobieranie z opóźnieniem, a adres musi wtedy jeszcze działać.
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}

async function renderPlanExport(root, params, ctx) {
    const client = params.clientId ? ctx.vault.get(params.clientId) : null;
    if (!client) { ctx.show('clients', {}, { reset: true }); return; }
    const plan = params.planId ? ctx.vault.get(params.planId) : null;
    if (!plan || plan.kind !== 'plan' || plan.clientId !== client.id) { ctx.show('plans', { clientId: client.id }); return; }

    let license = { ok: false };
    try { license = await ctx.access.getTrainerLicense(); } catch (e) { /* bez imienia trenera */ }
    if (!root.isConnected) return;
    const trainerName = license.ok ? license.name : '';
    const first = String(client.firstName || '').trim() || 'Klient';
    const name = planFileName(client.firstName, plan.name);
    const include = { ...DEFAULT_INCLUDE };

    const makeFile = () => {
        const text = serializePlanFile(buildPlanFile(plan, { trainerName, include }));
        return { name, text, file: new File([text], name, { type: TYPE }) };
    };
    // Hak testowy (wzór __tzMailtoSink): zamiast arkusza udostępniania plik trafia do tablicy.
    const toSink = ({ name: n, text }) => {
        if (isTestMode() && Array.isArray(window.__tzFileSink)) { window.__tzFileSink.push({ name: n, text }); return true; }
        return false;
    };

    const share = async () => {
        const f = makeFile();
        if (toSink(f)) return;
        try {
            if (navigator.canShare && navigator.canShare({ files: [f.file] }) && navigator.share) {
                await navigator.share({ files: [f.file], title: f.name });
                return;
            }
        } catch (e) {
            if (e && e.name === 'AbortError') return;
            console.warn('[Strefa trenera] udostępnianie:', e && e.message);
        }
        download(f.file);
    };
    const save = () => {
        const f = makeFile();
        if (!toSink(f)) download(f.file);
    };

    const workouts = (plan.workouts || []).length;
    const toggles = h('div', { class: 'tz-stack tz-tight', role: 'group', 'aria-label': 'Co trafi do pliku' },
        switchRow('Treningi i ćwiczenia', true, { disabled: true }),
        switchRow('Tempo, RIR/RPE i przerwy', include.params, { onChange: (v) => { include.params = v; } }),
        switchRow('Rozgrzewka', include.warmup, { onChange: (v) => { include.warmup = v; } }),
        switchRow('Dni tygodnia', include.days, { onChange: (v) => { include.days = v; } }),
        switchRow('Uwagi trenera do ćwiczeń', include.notes, { onChange: (v) => { include.notes = v; } }));

    root.append(h('div', { class: 'tz-stack' },
        h('section', { class: 'card tz-stack' },
            h('h2', { class: 'hd' }, plan.name),
            h('p', { class: 'sub' }, `${plan.weeks} tyg. · ${plural(workouts, 'trening', 'treningi', 'treningów')}`),
            h('p', { class: 'mut tz-filename' }, name)),
        h('section', { class: 'card tz-stack' },
            h('h3', { class: 'hd tz-set-hd' }, 'Co trafi do pliku'),
            toggles),
        h('section', { class: 'card tz-safe tz-stack' },
            h('p', { class: 'tz-iconline' }, icon('check'),
                h('span', {}, 'W pliku jest tylko plan treningowy. Nie ma w nim wywiadu, zdrowia, oceny, pomiarów, sesji, rozliczeń ani danych kontaktowych.'))),
        h('p', { class: 'sub' }, `${first} zapisuje plik i otwiera go w BodyBuild: Trening → Szablony → Wczytaj plan.`),
        h('div', { class: 'tz-stack tz-tight' },
            h('button', { type: 'button', class: 'btn', onclick: () => { share(); } }, icon('share'), 'Udostępnij plik'),
            h('button', { type: 'button', class: 'ghost', onclick: save }, 'Zapisz w Plikach'))));
}

export function registerPlanExportScreen(register) {
    register('plan-export', renderPlanExport);
}
