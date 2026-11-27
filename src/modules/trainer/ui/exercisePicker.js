// Wybór ćwiczenia do planu: kategorie katalogu rozwijane listą, wyszukiwarka bez polskich znaków
// i ćwiczenie własne. Okno w stylu ctx.confirm; blokada Strefy zamyka je jak „Anuluj” (ctx.registerOverlay).
// Pod nazwą wyszarzony wzorzec ruchowy i drobna nazwa angielska; szukanie obejmuje też angielskie i dawne nazwy.
import { h, icon } from './dom.js';
import { ExerciseEntries } from '../../../data/ExerciseCatalog.js';
import { movementPatternLabel } from '../../../data/movementPatterns.js';
import { muscleGroupFor } from '../trainerPlan.js';

const MAX_NAME = 120;
const MAX_RESULTS = 60;
let seq = 0;

// Małe litery bez znaków diakrytycznych; ł nie rozkłada się w NFD, więc osobno.
function fold(s) {
    return String(s || '').toLocaleLowerCase('pl').replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

const CATALOG = [];
for (const e of ExerciseEntries) {
    let c = CATALOG.find((x) => x.category === e.category);
    if (!c) CATALOG.push(c = { category: e.category, items: [] });
    c.items.push({
        name: e.name,
        en: e.en || '',
        pattern: movementPatternLabel(e.wzorzec),
        key: fold([e.name, e.en, ...(e.aliases || [])].filter(Boolean).join(' | ')),
    });
}

// Zwraca { name, muscleGroup } albo null (Anuluj, Escape, tło, blokada).
export function pickExercise(ctx, { title = 'Wybierz ćwiczenie' } = {}) {
    return new Promise((resolve) => {
        const titleId = `tz-pick-${++seq}`;
        let unregister = () => {};
        let closed = false;
        const close = (value) => {
            if (closed) return;
            closed = true;
            unregister();
            backdrop.remove();
            document.removeEventListener('keydown', onKey, true);
            resolve(value);
        };
        const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); close(null); } };

        const choose = (name) => close({ name, muscleGroup: muscleGroupFor(name) });
        // Nazwa dostępna to sama nazwa ćwiczenia; wzorzec i nazwa angielska jako opis.
        const itemButton = (it) => {
            if (!it.pattern && !it.en) return h('button', { type: 'button', class: 'tz-pick', onclick: () => choose(it.name) }, it.name);
            const subId = `tz-pick-sub-${++seq}`;
            return h('button', { type: 'button', class: 'tz-pick tz-pick-2l', 'aria-label': it.name, 'aria-describedby': subId, onclick: () => choose(it.name) },
                h('span', { class: 'tz-pick-name' }, it.name),
                h('span', { class: 'tz-pick-sub mut', id: subId },
                    it.pattern, it.en ? h('small', { class: 'tz-pick-en' }, it.pattern ? ` · ${it.en}` : it.en) : null));
        };

        const search = h('input', { class: 'in', type: 'search', autocomplete: 'off', placeholder: 'Szukaj ćwiczenia', 'aria-label': 'Szukaj ćwiczenia' });
        const list = h('div', { class: 'tz-stack tz-tight' });
        const open = new Set();
        const paint = () => {
            const q = fold(search.value).trim();
            if (q) {
                const words = q.split(/\s+/);
                const hits = CATALOG.flatMap((c) => c.items).filter((it) => words.every((w) => it.key.includes(w)));
                list.replaceChildren(hits.length
                    ? h('div', { class: 'tz-list' }, hits.slice(0, MAX_RESULTS).map(itemButton))
                    : h('p', { class: 'sub tz-empty' }, 'Nic nie znaleziono. Dodaj własne ćwiczenie poniżej.'));
                return;
            }
            list.replaceChildren(...CATALOG.map((c) => {
                const expanded = open.has(c.category);
                const head = h('button', {
                    type: 'button', class: 'ghost tz-pick-cat', 'aria-expanded': String(expanded),
                    onclick: () => { if (expanded) open.delete(c.category); else open.add(c.category); paint(); },
                }, h('span', {}, c.category), h('span', { class: 'mut' }, String(c.items.length)));
                return h('div', { class: 'tz-stack tz-tight' }, head,
                    expanded ? h('div', { class: 'tz-list' }, c.items.map(itemButton)) : null);
            }));
        };
        search.addEventListener('input', paint);

        const own = h('input', { class: 'in', type: 'text', autocomplete: 'off', maxlength: MAX_NAME, 'aria-label': 'Własne ćwiczenie', placeholder: 'Nazwa ćwiczenia' });
        const ownError = h('p', { class: 'tz-error', role: 'alert' });
        const addOwn = () => {
            const name = own.value.trim().slice(0, MAX_NAME);
            if (!name) { ownError.textContent = 'Wpisz nazwę ćwiczenia.'; own.focus(); return; }
            close({ name, muscleGroup: muscleGroupFor(name) });
        };
        own.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addOwn(); } });
        own.addEventListener('input', () => { ownError.textContent = ''; });

        const dialog = h('div', { class: 'card tz-dialog tz-picker', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId },
            h('h2', { class: 'hd', id: titleId }, title),
            search,
            list,
            h('div', { class: 'tz-field' },
                h('span', { class: 'sub' }, 'Własne ćwiczenie'),
                h('div', { class: 'tz-row tz-custom' }, own,
                    h('button', { type: 'button', class: 'btn', onclick: addOwn }, icon('plus'), 'Dodaj')),
                ownError),
            h('div', { class: 'tz-dialog-actions' },
                h('button', { type: 'button', class: 'ghost', onclick: () => close(null) }, 'Anuluj')));
        const backdrop = h('div', { class: 'tz-backdrop', onclick: (e) => { if (e.target === backdrop) close(null); } }, dialog);

        paint();
        unregister = ctx.registerOverlay(() => close(null), backdrop);
        if (!backdrop.isConnected) { close(null); return; }
        document.addEventListener('keydown', onKey, true);
        search.focus();
    });
}
