// Okrojenie zwykłej części aplikacji (spec rozdz. 10). Ustawienie jest jawne (localStorage),
// bo działa też przed odblokowaniem Strefy. Wyłączona sekcja tylko się chowa: dane zostają.
// Elementy sekcji mają w index.html atrybut data-sekcja="<id>". Profil i Serwis nigdy go nie mają.

export const SECTIONS_KEY = 'ukis.bodybuild.trener.sekcje';

export const SECTIONS = [
    { id: 'trening', label: 'Trening' },
    { id: 'zeszyt', label: 'Zeszyt' },
    { id: 'historia', label: 'Historia' },
    { id: 'analiza', label: 'Analiza' },
    { id: 'pomiary', label: 'Pomiary' },
    { id: 'dieta', label: 'Dieta' },
    { id: 'ai', label: 'Analizy AI i Edward' },
    { id: 'kawa', label: 'Postaw kawę' },
];

export const MODES = ['pelna', 'tylko-trener', 'wybrane'];

// Karty, które zostają w trybie „Tylko Strefa trenera” (Wygląd otwiera się z Profilu).
export const TRAINER_ONLY_TABS = ['trainer-zone', 'settings-panel', 'wyglad-panel', 'diagnostics-dashboard'];

const allSections = (value) => Object.fromEntries(SECTIONS.map((s) => [s.id, value]));

export function defaultSections() {
    return { mode: 'pelna', enabled: allSections(true) };
}

// Uszkodzone albo obce dane → ustawienie domyślne; nieznane sekcje odpadają, brakujące są włączone.
export function loadSections(storage = globalThis.localStorage) {
    let parsed = null;
    try {
        parsed = JSON.parse(storage.getItem(SECTIONS_KEY));
    } catch (e) {
        return defaultSections();
    }
    if (!parsed || typeof parsed !== 'object' || !MODES.includes(parsed.mode)) return defaultSections();
    const enabled = allSections(true);
    const stored = parsed.enabled && typeof parsed.enabled === 'object' ? parsed.enabled : {};
    for (const s of SECTIONS) {
        if (stored[s.id] === false) enabled[s.id] = false;
    }
    return { mode: parsed.mode, enabled };
}

export function saveSections(value, storage = globalThis.localStorage) {
    const mode = MODES.includes(value && value.mode) ? value.mode : 'pelna';
    const enabled = allSections(true);
    for (const s of SECTIONS) {
        if (value && value.enabled && value.enabled[s.id] === false) enabled[s.id] = false;
    }
    storage.setItem(SECTIONS_KEY, JSON.stringify({ mode, enabled }));
}

// Ustawienie działa tylko przy włączonym „Jestem trenerem” i ważnym kodzie (spec rozdz. 10).
const active = ({ sections, trainerEnabled, hasLicense }) => !!(trainerEnabled && hasLicense && sections);

export function effectiveSections({ sections, trainerEnabled, hasLicense }) {
    if (!active({ sections, trainerEnabled, hasLicense }) || sections.mode === 'pelna') return allSections(true);
    if (sections.mode === 'tylko-trener') return allSections(false);
    return Object.fromEntries(SECTIONS.map((s) => [s.id, !(sections.enabled && sections.enabled[s.id] === false)]));
}

export function isTrainerOnly({ sections, trainerEnabled, hasLicense }) {
    return active({ sections, trainerEnabled, hasLicense }) && sections.mode === 'tylko-trener';
}

// Chowa elementy wyłączonych sekcji. Pływający czat AI powstaje dynamicznie, więc chowa go CSS po klasie
// tz-bez-ai na <body>. Pasek aplikacji dostaje liczbę widocznych przycisków (--tz-pasek-n) i zwęża się.
// Aktywna karta z ukrytej sekcji przełącza się na Menu, a w trybie „Tylko Strefa trenera” każda karta
// poza Strefą, Profilem (z ekranem „Wygląd”) i Serwisem otwiera Strefę.
export function applySections(doc, visible, {
    trainerOnly = false,
    openZone = () => {},
    switchTab = (id) => doc.defaultView && doc.defaultView.switchTab && doc.defaultView.switchTab(id),
} = {}) {
    for (const el of doc.querySelectorAll('[data-sekcja]')) {
        el.hidden = visible[el.dataset.sekcja] === false;
    }
    doc.body.classList.toggle('tz-bez-ai', visible.ai === false);
    doc.body.classList.toggle('tz-tylko', !!trainerOnly);
    const bar = doc.querySelector('.bottom-nav-bar');
    if (bar) {
        const buttons = [...bar.querySelectorAll('.nav-btn')];
        const shown = buttons.filter((b) => !b.hidden).length;
        bar.style.setProperty('--tz-pasek-n', String(shown));
        bar.classList.toggle('tz-pasek-wezszy', shown < buttons.length);
    }

    const tab = doc.querySelector('.tab-content.active-tab');
    if (!tab) return;
    if (trainerOnly) {
        if (!TRAINER_ONLY_TABS.includes(tab.id)) openZone();
        return;
    }
    if (tab.dataset.sekcja && visible[tab.dataset.sekcja] === false) switchTab('welcome-screen');
}
