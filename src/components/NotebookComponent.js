// wyglad: zar
// Zeszyt: szablony HTML (bez logiki i zdarzeń — te są w modules/notebook/NotebookUI.js).
// Wygląd kartki: styles/zar/ekrany/zeszyt.css (tokeny motywu); tu tylko znaczniki i klasy.
import { ikona } from '../modules/wyglad/ikony.js';

export const escapeHtml = (text) => String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Ikony Lucide ze wspólnego zestawu nowego wyglądu (kreska 1,8, aria-hidden).
export const NotebookIcons = {
    prev: ikona('chevron-left', 22),
    next: ikona('chevron-right', 22),
    check: ikona('check', 14),
    trash: ikona('trash', 18),
    plus: ikona('plus', 16),
    settings: ikona('settings', 22),
    close: ikona('x', 22),
};

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
            <input class="nb-num z-in" data-testid="nb-reps" data-field="reps" type="text" inputmode="numeric" autocomplete="off" aria-label="Powtórzenia" value="${escapeHtml(set.reps ?? '')}">
            <span class="nb-x">×</span>
            <input class="nb-num z-in" data-testid="nb-weight" data-field="weight" type="text" inputmode="decimal" autocomplete="off" aria-label="Ciężar w kg" value="${escapeHtml(weightText(set.weight))}">
            <span class="nb-unit">kg</span>
            ${setBin(armed)}
        </div>
    </div>`;

// Margines wiersza nazwy ćwiczenia: napis „seria” (akcent motywu) nad numerami serii.
const seriesMargin = '<span class="nb-margin nb-margin-head"><span class="nb-series-label" data-testid="nb-series-label">seria</span></span>';

// Pole nazwy (nowe ćwiczenie albo zmiana nazwy) z miejscem na podpowiedzi.
const nameEditor = (value, exerciseId, confirmDelete) => `
    <div class="nb-row nb-name-row">
        ${exerciseId !== null ? seriesMargin : '<span class="nb-margin"></span>'}
        <div class="nb-body">
            <input class="nb-name z-in" data-testid="nb-name-input" type="text" autocomplete="off" autocapitalize="sentences" enterkeyhint="done" placeholder="Nazwa ćwiczenia" aria-label="Nazwa ćwiczenia" value="${escapeHtml(value)}">
            ${exerciseId !== null ? `<button type="button" class="nb-del-ex z-ghost z-danger" data-testid="nb-delete-exercise" data-exercise-id="${escapeHtml(exerciseId)}">${confirmDelete ? 'Na pewno usunąć?' : `${NotebookIcons.trash}<span>Usuń</span>`}</button>` : ''}
            <div class="nb-suggestions"></div>
        </div>
    </div>`;

export const NotebookComponent = {
    setBin,
    render: () => `
        <section class="nb">
            <div class="nb-head">
                <button type="button" class="nb-arrow z-ic z-card" data-testid="nb-prev" aria-label="Poprzedni dzień">${NotebookIcons.prev}</button>
                <div class="nb-day">
                    <span class="nb-day-label z-hd" data-testid="nb-day-label"></span>
                    <input type="date" data-testid="nb-date" aria-label="Wybierz dzień">
                </div>
                <button type="button" class="nb-arrow z-ic z-card" data-testid="nb-next" aria-label="Następny dzień">${NotebookIcons.next}</button>
            </div>
            <div class="nb-status" data-testid="nb-status" role="status" aria-live="polite"></div>
            <div class="nb-sheet" data-font="normal">
                <button type="button" class="nb-gear z-ic" data-testid="nb-settings" aria-label="Ustawienia Zeszytu" aria-haspopup="dialog" aria-expanded="false" aria-controls="nb-settings-panel">${NotebookIcons.settings}</button>
                <!-- Zasłona z arkuszem ustawień: NotebookUI.init przenosi ją do <body>. -->
                <div class="z-sheet-scrim nb-settings-scrim" data-testid="nb-settings-scrim" hidden>
                    <div class="z-sheet nb-panel" id="nb-settings-panel" data-testid="nb-settings-panel" role="dialog" aria-modal="true" aria-labelledby="nb-settings-title">
                        <div class="z-sheet-grip" aria-hidden="true"></div>
                        <div class="z-sheet-head">
                            <h2 class="z-hd" id="nb-settings-title">Ustawienia Zeszytu</h2>
                            <button type="button" class="z-ic" data-testid="nb-settings-close" aria-label="Zamknij">${NotebookIcons.close}</button>
                        </div>
                        <div class="nb-panel-title" id="nb-new-set-title">Nowa seria</div>
                        <div role="group" aria-labelledby="nb-new-set-title">
                            <label class="z-check nb-opt"><span>Kopiuj liczbę powtórzeń z poprzedniej serii</span><input type="checkbox" data-testid="nb-opt-copy-reps" data-option="copyReps"></label>
                            <label class="z-check nb-opt"><span>Kopiuj ciężar z poprzedniej serii</span><input type="checkbox" data-testid="nb-opt-copy-weight" data-option="copyWeight"></label>
                        </div>
                        <hr class="z-sep">
                        <div class="nb-panel-title" id="nb-font-title">Wielkość pisma</div>
                        <div class="z-tabs nb-font-choice" role="group" aria-labelledby="nb-font-title">
                            <button type="button" class="z-tab nb-font-btn z-on" data-testid="nb-font-normal" data-font-size="normal" aria-pressed="true">Normalna</button>
                            <button type="button" class="z-tab nb-font-btn" data-testid="nb-font-large" data-font-size="large" aria-pressed="false">Duża</button>
                            <button type="button" class="z-tab nb-font-btn" data-testid="nb-font-xlarge" data-font-size="xlarge" aria-pressed="false">Bardzo duża</button>
                        </div>
                        <div class="z-card nb-preview" data-testid="nb-font-preview" data-font="normal"><span class="z-hi nb-preview-no">1</span> 12 × 80 kg <span class="z-mut">— podgląd</span></div>
                    </div>
                </div>
                <div class="nb-list"></div>
                <div class="nb-row"><span class="nb-margin"></span><div class="nb-body nb-actions">
                    <button type="button" class="nb-btn nb-btn-set z-btn" data-testid="nb-add-set" hidden>${NotebookIcons.plus}seria</button>
                    <button type="button" class="nb-btn nb-btn-ex z-ghost" data-testid="nb-add-exercise">${NotebookIcons.plus}ćwiczenie</button>
                </div></div>
            </div>
        </section>`,

    // Lista ćwiczeń i serii (przyciski „+ seria”/„+ ćwiczenie”, koło zębate i arkusz ustawień są stałe
    // w render(), żeby ponowne rysowanie listy przy opuszczeniu pola nazwy nie zjadało stuknięcia w nie).
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
    <div class="nb-row">${seriesMargin}<div class="nb-body">
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
