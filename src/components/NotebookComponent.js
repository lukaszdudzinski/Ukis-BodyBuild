// Zeszyt: szablony HTML (bez logiki i zdarzeń — te są w modules/notebook/NotebookUI.js).

export const escapeHtml = (text) => String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const svg = (paths, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

export const NotebookIcons = {
    prev: svg('<path d="m15 18-6-6 6-6"/>', 24),
    next: svg('<path d="m9 18 6-6-6-6"/>', 24),
    check: svg('<path d="M20 6 9 17l-5-5"/>', 14),
    trash: svg('<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>', 18),
    plus: svg('<path d="M5 12h14"/><path d="M12 5v14"/>', 16),
};

const STYLE = `
<style>
#notebook-dashboard .nb { max-width: 640px; margin: 0 auto; padding-bottom: 90px; color: #fff; }
#notebook-dashboard .nb-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
#notebook-dashboard .nb-arrow { background: none; border: none; color: #00BFFF; padding: 10px; min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
#notebook-dashboard .nb-day { position: relative; flex: 1; text-align: center; font-size: 1.1em; font-weight: 600; text-transform: none; }
#notebook-dashboard .nb-day-label { display: block; padding: 10px 0; }
#notebook-dashboard .nb-day input[type="date"] { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; border: none; cursor: pointer; font-size: 16px; }
#notebook-dashboard .nb-status { min-height: 20px; text-align: center; font-size: 0.85em; color: #8E8E93; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 4px; }
#notebook-dashboard .nb-status.nb-ok { color: #00D26A; }
#notebook-dashboard .nb-status.nb-error { color: #ff6b6b; cursor: pointer; }
#notebook-dashboard .nb-sheet { position: relative; background-color: #050505; background-image: linear-gradient(#232323 1px, transparent 1px), linear-gradient(90deg, #232323 1px, transparent 1px); background-size: 18px 18px; border: 1px solid #232323; border-radius: 6px; padding: 18px 12px 18px 0; min-height: 216px; font-size: 17px; }
#notebook-dashboard .nb-sheet::before { content: ""; position: absolute; top: 0; bottom: 0; left: 44px; border-left: 2px solid #a33; pointer-events: none; }
#notebook-dashboard .nb-row { display: flex; align-items: center; min-height: 36px; }
#notebook-dashboard .nb-margin { width: 44px; flex: 0 0 44px; text-align: center; color: #e04848; font-weight: 700; }
#notebook-dashboard .nb-body { flex: 1; min-width: 0; padding-left: 12px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
#notebook-dashboard .nb-ex-name { background: none; border: none; color: #00BFFF; font: inherit; font-weight: 700; text-align: left; padding: 6px 0; white-space: normal; overflow-wrap: anywhere; cursor: pointer; }
#notebook-dashboard .nb-set:focus-within { background: rgba(0, 191, 255, 0.10); }
#notebook-dashboard .nb-num { width: 3.4em; background: transparent; border: 1px solid #333; border-radius: 6px; color: #fff; font: inherit; font-size: 17px; text-align: right; padding: 4px 6px; box-sizing: border-box; }
#notebook-dashboard .nb-num:focus { outline: none; border-color: #00BFFF; }
#notebook-dashboard .nb-num.nb-invalid { border-color: #ff4d4d; box-shadow: 0 0 0 1px #ff4d4d; }
#notebook-dashboard .nb-x, #notebook-dashboard .nb-unit { color: #b0b0b0; }
#notebook-dashboard .nb-del { margin-left: auto; background: none; border: none; color: #8E8E93; min-width: 40px; min-height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0.55; }
#notebook-dashboard .nb-set:focus-within .nb-del { opacity: 1; color: #ff6b6b; }
#notebook-dashboard .nb-del.nb-armed { opacity: 1; color: #ff6b6b; font: inherit; font-size: 13px; font-weight: 700; gap: 2px; }
#notebook-dashboard .nb-name { flex: 1; min-width: 0; background: #111; border: 1px solid #00BFFF; border-radius: 6px; color: #fff; font: inherit; font-size: 17px; padding: 6px 8px; }
#notebook-dashboard .nb-del-ex { background: none; border: 1px solid #ff6b6b; border-radius: 6px; color: #ff6b6b; font: inherit; font-size: 14px; padding: 6px 8px; display: flex; align-items: center; gap: 4px; cursor: pointer; }
#notebook-dashboard .nb-suggestions { flex-basis: 100%; display: flex; flex-direction: column; gap: 4px; }
#notebook-dashboard .nb-suggestions:empty { display: none; }
#notebook-dashboard .nb-suggestion { background: #161616; border: 1px solid #333; border-radius: 6px; color: #fff; font: inherit; font-size: 15px; text-align: left; padding: 8px 10px; white-space: normal; overflow-wrap: anywhere; cursor: pointer; }
#notebook-dashboard .nb-actions { gap: 10px; padding-top: 10px; }
#notebook-dashboard .nb-btn { background: none; border: 1px solid currentColor; border-radius: 18px; font: inherit; font-size: 15px; font-weight: 600; padding: 7px 14px; display: flex; align-items: center; gap: 4px; cursor: pointer; }
#notebook-dashboard .nb-btn-set { color: #00D26A; }
#notebook-dashboard .nb-btn-ex { color: #00BFFF; }
#notebook-dashboard .nb-btn[hidden] { display: none; }
#notebook-dashboard .nb-empty { color: #b0b0b0; padding: 6px 0; }
</style>`;

// Ciężar po polsku: przecinek dziesiętny (parsowanie przyjmuje i przecinek, i kropkę).
const weightText = (w) => (w === null || w === undefined ? '' : String(w).replace('.', ','));

// Kosz serii: pierwsze stuknięcie go uzbraja (napis „Usunąć?”), drugie usuwa.
const setBin = (armed) => armed
    ? `<button type="button" class="nb-del nb-armed" data-testid="nb-delete-set" aria-label="Na pewno usunąć?">${NotebookIcons.trash}<span>Usunąć?</span></button>`
    : `<button type="button" class="nb-del" data-testid="nb-delete-set" aria-label="Usuń serię">${NotebookIcons.trash}</button>`;

const setRow = (ex, set, i, armed) => `
    <div class="nb-row nb-set" data-testid="nb-set" data-exercise-id="${escapeHtml(ex.id)}" data-set-index="${i}">
        <span class="nb-margin" data-testid="nb-set-no">${i + 1}</span>
        <div class="nb-body">
            <input class="nb-num" data-testid="nb-reps" data-field="reps" type="text" inputmode="numeric" autocomplete="off" aria-label="Powtórzenia" value="${escapeHtml(set.reps ?? '')}">
            <span class="nb-x">×</span>
            <input class="nb-num" data-testid="nb-weight" data-field="weight" type="text" inputmode="decimal" autocomplete="off" aria-label="Ciężar w kg" value="${escapeHtml(weightText(set.weight))}">
            <span class="nb-unit">kg</span>
            ${setBin(armed)}
        </div>
    </div>`;

// Pole nazwy (nowe ćwiczenie albo zmiana nazwy) z miejscem na podpowiedzi.
const nameEditor = (value, exerciseId, confirmDelete) => `
    <div class="nb-row nb-name-row">
        <span class="nb-margin"></span>
        <div class="nb-body">
            <input class="nb-name" data-testid="nb-name-input" type="text" autocomplete="off" autocapitalize="sentences" enterkeyhint="done" placeholder="Nazwa ćwiczenia" aria-label="Nazwa ćwiczenia" value="${escapeHtml(value)}">
            ${exerciseId !== null ? `<button type="button" class="nb-del-ex" data-testid="nb-delete-exercise" data-exercise-id="${escapeHtml(exerciseId)}">${confirmDelete ? 'Na pewno usunąć?' : `${NotebookIcons.trash}<span>Usuń</span>`}</button>` : ''}
            <div class="nb-suggestions"></div>
        </div>
    </div>`;

export const NotebookComponent = {
    setBin,
    render: () => `
        ${STYLE}
        <section class="nb">
            <div class="nb-head">
                <button type="button" class="nb-arrow" data-testid="nb-prev" aria-label="Poprzedni dzień">${NotebookIcons.prev}</button>
                <div class="nb-day">
                    <span class="nb-day-label" data-testid="nb-day-label"></span>
                    <input type="date" data-testid="nb-date" aria-label="Wybierz dzień">
                </div>
                <button type="button" class="nb-arrow" data-testid="nb-next" aria-label="Następny dzień">${NotebookIcons.next}</button>
            </div>
            <div class="nb-status" data-testid="nb-status" role="status" aria-live="polite"></div>
            <div class="nb-sheet">
                <div class="nb-list"></div>
                <div class="nb-row"><span class="nb-margin"></span><div class="nb-body nb-actions">
                    <button type="button" class="nb-btn nb-btn-set" data-testid="nb-add-set" hidden>${NotebookIcons.plus}seria</button>
                    <button type="button" class="nb-btn nb-btn-ex" data-testid="nb-add-exercise">${NotebookIcons.plus}ćwiczenie</button>
                </div></div>
            </div>
        </section>`,

    // Lista ćwiczeń i serii (przyciski „+ seria”/„+ ćwiczenie” są stałe w render(), żeby ponowne
    // rysowanie listy przy opuszczeniu pola nazwy nie zjadało stuknięcia w nie).
    // view: { page, editing: null | { id: string|null, value }, confirmDeleteId }
    // confirmSet: { exerciseId, setIndex } uzbrojonego kosza serii; isToday: czy kartka jest dzisiejsza.
    renderSheet: ({ page, editing, confirmDeleteId, confirmSet, isToday }) => {
        if (!page) return '';
        const parts = [];
        for (const ex of page.exercises) {
            if (editing && editing.id === ex.id) {
                parts.push(nameEditor(editing.value, ex.id, confirmDeleteId === ex.id));
            } else {
                parts.push(`
    <div class="nb-row"><span class="nb-margin"></span><div class="nb-body">
        <button type="button" class="nb-ex-name" data-testid="nb-exercise" data-exercise-id="${escapeHtml(ex.id)}">${escapeHtml(ex.name)}</button>
    </div></div>`);
            }
            ex.sets.forEach((set, i) => parts.push(setRow(ex, set, i,
                !!confirmSet && confirmSet.exerciseId === ex.id && confirmSet.setIndex === i)));
        }
        if (editing && editing.id === null) parts.push(nameEditor(editing.value, null, false));
        if (!page.exercises.length && !editing) {
            const hint = isToday ? 'Zapisz dzisiejszy trening: dodaj pierwsze ćwiczenie.' : 'Dodaj pierwsze ćwiczenie na ten dzień.';
            parts.push(`<div class="nb-row"><span class="nb-margin"></span><div class="nb-body nb-empty">${hint}</div></div>`);
        }
        return parts.join('');
    },

    renderSuggestions: (names) => names
        .map((n) => `<button type="button" class="nb-suggestion" data-testid="nb-suggestion" data-name="${escapeHtml(n)}">${escapeHtml(n)}</button>`)
        .join(''),
};
