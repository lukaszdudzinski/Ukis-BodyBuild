// Zeszyt: zakładka z kartką dnia. Stan, zdarzenia i zapis do bazy (HTML w components/NotebookComponent.js).
import { NotebookComponent, NotebookIcons } from '../../components/NotebookComponent.js';
import { DatabaseManager } from '../db/DatabaseManager.js';
import { ExerciseCatalog } from '../../data/ExerciseCatalog.js';
import {
    emptyPage, sameName, addExercise, addSet, updateSet, removeSet, renameExercise, removeExercise,
    parseReps, parseWeight, toExercisesJson, fromExercisesJson, localDateStr, shiftDate, formatDayLabel,
} from './notebookModel.js';
import { buildSuggestionSource, suggest } from './exerciseSuggest.js';
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from './notebookSettings.js';

const TAB = 'notebook-dashboard';
const SAVE_DELAY = 400;
const CONFIRM_MS = 3000;
// Kopia niepotwierdzonych zapisów na czas przeładowania strony (sessionStorage, nie localStorage):
// przy zamykaniu strony przeglądarka zatrzymuje wątek bazy, zanim ten dopisze plik, więc zapis
// wysłany z `pagehide` mógłby przepaść. Kopię zapisujemy synchronicznie i wgrywamy przy starcie.
const BACKUP_KEY = 'ukis.bodybuild.zeszyt.niezapisane';

const state = {
    date: null,            // dzień pokazywany w nagłówku
    followToday: true,     // po powrocie do zakładki przejdź na dzisiejszą kartkę (gdy użytkownik jej nie zmieniał)
    page: null,            // kartka w pamięci; null = trwa wczytywanie (edycje są ignorowane)
    loadedDate: null,      // dzień, do którego należy state.page
    ids: new Map(),        // dzień -> id treningu Zeszytu albo null
    editing: null,         // { id: null (nowe ćwiczenie) | id, value }
    confirmDeleteId: null,
    confirmTimer: null,
    confirmSet: null,      // { exerciseId, setIndex } — kosz serii uzbrojony pierwszym stuknięciem
    confirmSetTimer: null,
    seenOn: null,          // lokalna data (dziś) z chwili ostatniego wczytania kartki
    lastExerciseId: null,  // „+ seria” dotyczy ostatnio edytowanego ćwiczenia
    source: null,          // źródło podpowiedzi nazw
    pending: new Map(),    // dzień -> kartka czekająca na zapis (osobno dla każdego dnia)
    unconfirmed: new Map(), // dzień -> najnowsza kartka jeszcze niepotwierdzona przez bazę
    restorePromise: Promise.resolve(),
    restoring: false,      // kopia z poprzedniej strony jeszcze nie wgrana: pagehide jej nie kasuje
    timer: null,
    queue: Promise.resolve(),
    inFlight: 0,
    failed: new Set(),     // dni, których ostatni zapis się nie udał
    loadSeq: 0,
    loadPromise: Promise.resolve(),
    settings: { ...DEFAULT_SETTINGS }, // co „+ seria” przepisuje z poprzedniej serii (okienko pod kołem zębatym)
};

const root = () => document.getElementById(TAB);
const q = (sel) => root().querySelector(sel);
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const exIdFrom = (str) => (state.page ? state.page.exercises.find((e) => String(e.id) === str) : null)?.id;

function setStatus(kind) {
    const el = q('[data-testid="nb-status"]');
    if (!el) return;
    const texts = {
        saving: 'zapisywanie…',
        error: 'Nie udało się zapisać. Spróbuj ponownie.',
        'load-error': 'Nie udało się wczytać kartki. Stuknij, aby spróbować ponownie.',
    };
    el.dataset.kind = kind;
    el.className = 'nb-status' + (kind === 'ok' ? ' nb-ok' : kind === 'error' || kind === 'load-error' ? ' nb-error' : '');
    el.innerHTML = kind === 'ok' ? `${NotebookIcons.check}<span>zapisano</span>` : (texts[kind] || '');
}

function renderHeader() {
    q('[data-testid="nb-day-label"]').textContent = formatDayLabel(state.date, localDateStr());
    q('[data-testid="nb-date"]').value = state.date;
}

function setBusy(busy) {
    q('[data-testid="nb-add-exercise"]').disabled = busy;
    q('[data-testid="nb-add-set"]').disabled = busy;
}

function renderList(focus = null) {
    clearTimeout(state.confirmSetTimer);
    state.confirmSet = null; // po każdej zmianie listy indeksy serii mogą się przesunąć
    q('.nb-list').innerHTML = NotebookComponent.renderSheet({ ...state, isToday: state.loadedDate === localDateStr() });
    q('[data-testid="nb-add-set"]').hidden = !(state.page && state.page.exercises.length);
    setBusy(!state.page);
    if (state.editing) {
        const input = q('[data-testid="nb-name-input"]');
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
        showSuggestions(input.value);
    } else if (focus) {
        const row = [...root().querySelectorAll('[data-testid="nb-set"]')]
            .find((r) => r.dataset.exerciseId === String(focus.exerciseId) && r.dataset.setIndex === String(focus.setIndex));
        const input = row && row.querySelector(`[data-field="${focus.field}"]`);
        if (input) {
            input.focus();
            input.scrollIntoView({ block: 'nearest' });
        }
    }
}

// ---------- okienko „Nowa seria” (koło zębate; poza .nb-list, więc rysowanie listy go nie niszczy) ----------

const settingsPanel = () => q('[data-testid="nb-settings-panel"]');
const settingsOpen = () => { const p = settingsPanel(); return !!p && !p.hidden; };

function setSettingsOpen(open) {
    const panel = settingsPanel();
    const gear = q('[data-testid="nb-settings"]');
    if (!panel || !gear) return;
    if (!open && panel.contains(document.activeElement)) gear.focus(); // fokus nie ginie razem z okienkiem
    panel.hidden = !open;
    gear.setAttribute('aria-expanded', String(open));
}

function renderSettings() {
    root().querySelectorAll('[data-option]').forEach((box) => { box.checked = !!state.settings[box.dataset.option]; });
}

function onSettingChange(box) {
    state.settings = { ...state.settings, [box.dataset.option]: box.checked };
    saveSettings(state.settings);
}

function showSuggestions(value) {
    const box = q('.nb-suggestions');
    if (box) box.innerHTML = NotebookComponent.renderSuggestions(suggest(value, state.source));
}

// ---------- zapis: jedna kolejka, zapis zawsze na kartkę dnia, na którym zrobiono zmianę ----------

function scheduleSave() {
    if (!state.page || state.loadedDate === null) return;
    state.pending.set(state.loadedDate, state.page);
    state.unconfirmed.set(state.loadedDate, state.page);
    setStatus('saving');
    clearTimeout(state.timer);
    state.timer = setTimeout(flush, SAVE_DELAY);
}

function flush() {
    clearTimeout(state.timer);
    state.timer = null;
    const jobs = [...state.pending].map(([date, page]) => ({ date, page }));
    state.pending.clear();
    for (const job of jobs) {
        state.inFlight++;
        state.queue = state.queue.then(() => runSave(job));
    }
    return state.queue;
}

// Status wynika ze wszystkich dni: „zapisano” dopiero, gdy żadna kartka nie czeka na potwierdzenie bazy.
function saveStatus() {
    if (state.failed.size) return 'error';
    if (state.pending.size || state.inFlight || state.unconfirmed.size) return 'saving';
    return 'ok';
}

async function runSave(job) {
    try {
        const exercises = toExercisesJson(job.page);
        // Dzień jeszcze niewczytany (np. kopia po przeładowaniu): id bierzemy z bazy, żeby nie zrobić drugiej kartki.
        if (!state.ids.has(job.date)) {
            const t = await DatabaseManager.getNotebookTraining(job.date);
            state.ids.set(job.date, t ? t.id : null);
        }
        const id = state.ids.get(job.date);
        if (!exercises.length) {
            if (id !== null) await DatabaseManager.deleteTraining(id);
            state.ids.set(job.date, null);
        } else {
            state.ids.set(job.date, await DatabaseManager.saveNotebookTraining({ id, date: job.date, exercises }));
        }
        if (state.unconfirmed.get(job.date) === job.page) state.unconfirmed.delete(job.date);
        if (state.pending.get(job.date) === job.page) state.pending.delete(job.date); // ta sama kartka już zapisana
        state.failed.delete(job.date);
    } catch (e) {
        console.warn('Zeszyt: zapis nieudany', e);
        state.failed.add(job.date);
        // Dane zostają do ponownej próby: zawsze najnowsza kartka tego dnia (starsze zadanie z kolejki
        // mogło się wywrócić już po pobraniu nowszego, więc nie wstawiamy job.page na ślepo).
        if (!state.pending.has(job.date)) state.pending.set(job.date, state.unconfirmed.get(job.date) || job.page);
    } finally {
        state.inFlight--;
        if (state.inFlight === 0) setStatus(saveStatus());
    }
}

function writeBackup() {
    try {
        const data = state.restoring ? (JSON.parse(sessionStorage.getItem(BACKUP_KEY) || 'null') || {}) : {};
        if (!state.unconfirmed.size && !Object.keys(data).length) { sessionStorage.removeItem(BACKUP_KEY); return; }
        for (const [date, page] of state.unconfirmed) data[date] = toExercisesJson(page);
        sessionStorage.setItem(BACKUP_KEY, JSON.stringify(data));
    } catch (e) { /* brak sessionStorage: zostaje zwykły zapis */ }
}

// Wgrywa kopię z poprzedniej strony (gdy zamknięcie przerwało zapis). Kopię kasuje dopiero po udanym zapisie.
async function restoreBackup() {
    let data = null;
    try { data = JSON.parse(sessionStorage.getItem(BACKUP_KEY) || 'null'); } catch (e) { data = null; }
    if (!data || typeof data !== 'object') return;
    state.restoring = true;
    const entries = Object.entries(data).filter(([date, ex]) => /^\d{4}-\d{2}-\d{2}$/.test(date) && Array.isArray(ex));
    let done = 0;
    try {
        for (const [date, exercises] of entries) {
            const t = await DatabaseManager.getNotebookTraining(date);
            if (exercises.length) await DatabaseManager.saveNotebookTraining({ id: t ? t.id : null, date, exercises });
            else if (t) await DatabaseManager.deleteTraining(t.id);
            done++;
        }
        sessionStorage.removeItem(BACKUP_KEY);
    } catch (e) {
        console.warn('Zeszyt: nie udało się wgrać kopii kartki', e);
        // Niewgrane dni trafiają do zwykłej kolejki: są widoczne na kartce, ponawiane i znów kopiowane przy pagehide.
        for (const [date, exercises] of entries.slice(done)) {
            const page = fromExercisesJson(exercises);
            state.unconfirmed.set(date, page);
            state.pending.set(date, page);
            state.failed.add(date);
        }
    } finally {
        state.restoring = false;
    }
}

// ---------- wczytywanie dnia ----------

async function load(date) {
    const seq = ++state.loadSeq;
    // Ta sama kartka w pamięci zostaje (ze szkicami serii), jeśli baza ma dokładnie to, co z niej zapisano.
    const memPage = state.loadedDate === date ? state.page : null;
    state.page = null;
    state.loadedDate = null;
    state.editing = null;
    state.confirmDeleteId = null;
    state.date = date;
    state.seenOn = localDateStr(); // dzień, w którym zdecydowano, którą kartkę pokazać
    renderHeader();
    setBusy(true);
    if (!memPage) {
        q('.nb-list').innerHTML = '';
        q('[data-testid="nb-add-set"]').hidden = true;
    }
    await state.restorePromise;
    flush();
    // Odczyt idzie przez kolejkę zapisów: ponowiony zapis nie wstawi kartki między odczytem a ustawieniem id.
    const read = state.queue.then(async () => {
        const t = await DatabaseManager.getNotebookTraining(date);
        state.ids.set(date, t ? t.id : null);
        return t;
    });
    state.queue = read.then(() => {}, () => {});
    let training;
    let page;
    try {
        training = await read;
        if (seq !== state.loadSeq) return;
        const saved = training ? training.exercises : [];
        const unsaved = state.unconfirmed.get(date); // zapis tej kartki się nie udał: ekran pokazuje dane z pamięci, nie starsze z bazy
        if (memPage && (unsaved || JSON.stringify(toExercisesJson(memPage)) === JSON.stringify(saved))) {
            page = memPage;
        } else if (unsaved) {
            page = unsaved;
        } else {
            page = training ? fromExercisesJson(saved) : emptyPage();
            page.exercises.forEach((e) => { if (e.id === undefined || e.id === null) e.id = newId(); });
        }
    } catch (e) {
        // Błąd odczytu albo nieczytelna kartka: nic nie nadpisujemy, stuknięcie w komunikat ponawia.
        console.warn('Zeszyt: wczytanie nieudane', e);
        if (seq === state.loadSeq) setStatus('load-error');
        return;
    }
    state.page = page;
    state.loadedDate = date;
    renderList();
    setStatus(state.failed.size ? 'error' : state.unconfirmed.size || training ? saveStatus() : '');
}

async function refreshSource() {
    try {
        state.source = buildSuggestionSource(await DatabaseManager.getTrainings(), ExerciseCatalog);
    } catch (e) {
        state.source = buildSuggestionSource([], ExerciseCatalog);
    }
}

function changeDay(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return state.loadPromise;
    state.followToday = date === localDateStr();
    state.loadPromise = load(date);
    return state.loadPromise;
}

function enter() {
    const today = localDateStr();
    // Kartka z innego dnia (np. otwarta z historii) zostaje tylko do końca dnia, w którym ją otwarto.
    if (state.followToday || !state.date || (state.seenOn && state.seenOn !== today)) {
        state.date = today;
        state.followToday = true;
    }
    state.loadPromise = Promise.all([load(state.date), refreshSource()]).then(() => {});
    return state.loadPromise;
}

// ---------- edycja ----------

function commitName(raw) {
    const ed = state.editing;
    if (!ed || !state.page) return;
    state.editing = null;
    state.confirmDeleteId = null;
    const name = String(raw ?? '').trim();
    let focus = null;
    if (name && ed.id === null) {
        const r = addExercise(state.page, name, newId(), state.settings);
        state.page = r.page;
        state.lastExerciseId = r.exerciseId;
        const ex = r.page.exercises.find((e) => e.id === r.exerciseId);
        if (r.setIndex >= 0 && ex) focus = { exerciseId: r.exerciseId, setIndex: r.setIndex, field: ex.sets[r.setIndex].reps === null ? 'reps' : 'weight' };
    } else if (name) {
        state.page = renameExercise(state.page, ed.id, name);
        state.lastExerciseId = (state.page.exercises.find((e) => sameName(e.name, name)) || {}).id ?? null;
    }
    renderList(focus);
    if (name) scheduleSave();
}

function onNumberInput(input) {
    const row = input.closest('[data-testid="nb-set"]');
    const exId = exIdFrom(row.dataset.exerciseId);
    if (!state.page || exId === undefined) return;
    const text = input.value.trim();
    const isReps = input.dataset.field === 'reps';
    const value = text === '' ? null : isReps ? parseReps(text) : parseWeight(text);
    const valid = text === '' || value !== null;
    input.classList.toggle('nb-invalid', !valid);
    if (!valid) return;
    state.page = updateSet(state.page, exId, Number(row.dataset.setIndex), { [input.dataset.field]: value });
    state.lastExerciseId = exId;
    scheduleSave();
}

function onAddSet() {
    if (!state.page || !state.page.exercises.length) return;
    const ids = state.page.exercises.map((e) => e.id);
    const exId = ids.includes(state.lastExerciseId) ? state.lastExerciseId : ids[ids.length - 1];
    const r = addSet(state.page, exId, state.settings);
    if (r.setIndex < 0) return;
    state.page = r.page;
    state.lastExerciseId = exId;
    const set = r.page.exercises.find((e) => e.id === exId).sets[r.setIndex];
    renderList({ exerciseId: exId, setIndex: r.setIndex, field: set.reps === null ? 'reps' : 'weight' });
    scheduleSave();
}

function onDeleteSet(btn) {
    const row = btn.closest('[data-testid="nb-set"]');
    const exId = exIdFrom(row.dataset.exerciseId);
    const idx = Number(row.dataset.setIndex);
    if (exId === undefined) return;
    clearTimeout(state.confirmSetTimer);
    const c = state.confirmSet;
    if (!c || c.exerciseId !== exId || c.setIndex !== idx) {
        root().querySelectorAll('[data-testid="nb-delete-set"].nb-armed').forEach((b) => { b.outerHTML = NotebookComponent.setBin(false); });
        state.confirmSet = { exerciseId: exId, setIndex: idx };
        btn.outerHTML = NotebookComponent.setBin(true);
        state.confirmSetTimer = setTimeout(() => {
            state.confirmSet = null;
            root().querySelectorAll('[data-testid="nb-delete-set"].nb-armed').forEach((b) => { b.outerHTML = NotebookComponent.setBin(false); });
        }, CONFIRM_MS);
        return;
    }
    state.page = removeSet(state.page, exId, idx);
    renderList();
    scheduleSave();
    flush();
}

// Powrót do aplikacji (iPhone trzyma ją w pamięci nawet przez noc): po północy przejdź na nową dzisiejszą kartkę.
function onResume() {
    const el = root();
    if (!el || !state.date || !el.classList.contains('active-tab')) return;
    const today = localDateStr();
    if (state.seenOn && state.seenOn !== today) changeDay(today); // load() najpierw zapisuje zmiany starego dnia
    else renderHeader();
}

function onDeleteExercise(btn) {
    const exId = exIdFrom(btn.dataset.exerciseId);
    if (!state.page || exId === undefined) return;
    clearTimeout(state.confirmTimer);
    if (state.confirmDeleteId !== exId) {
        state.confirmDeleteId = exId;
        btn.textContent = 'Na pewno usunąć?';
        state.confirmTimer = setTimeout(() => {
            if (state.confirmDeleteId !== exId) return;
            state.confirmDeleteId = null;
            const b = q('[data-testid="nb-delete-exercise"]');
            if (b) b.innerHTML = `${NotebookIcons.trash}<span>Usuń</span>`;
        }, CONFIRM_MS);
        return;
    }
    state.confirmDeleteId = null;
    state.editing = null;
    state.page = removeExercise(state.page, exId);
    renderList();
    scheduleSave();
    flush();
}

function onClick(e) {
    const t = e.target.closest('[data-testid]');
    if (!t || !root().contains(t)) return;
    const id = t.dataset.testid;
    if (id === 'nb-settings') {
        setSettingsOpen(!settingsOpen());
    } else if (id === 'nb-prev' || id === 'nb-next') {
        if (state.date) changeDay(shiftDate(state.date, id === 'nb-prev' ? -1 : 1));
    } else if (id === 'nb-date') {
        try { t.showPicker(); } catch (err) { /* iOS otwiera wybór sam */ }
    } else if (id === 'nb-status') {
        if (t.dataset.kind === 'error') { setStatus('saving'); flush(); }
        else if (t.dataset.kind === 'load-error' && state.date) changeDay(state.date);
    } else if (!state.page) {
        return; // trwa wczytywanie dnia
    } else if (id === 'nb-add-exercise') {
        if (!state.editing || state.editing.id !== null) {
            state.editing = { id: null, value: '' };
            state.confirmDeleteId = null;
        }
        renderList();
    } else if (id === 'nb-add-set') {
        onAddSet();
    } else if (id === 'nb-delete-set') {
        onDeleteSet(t);
    } else if (id === 'nb-exercise') {
        const exId = exIdFrom(t.dataset.exerciseId);
        const ex = state.page.exercises.find((x) => x.id === exId);
        if (!ex) return;
        state.editing = { id: exId, value: ex.name };
        state.confirmDeleteId = null;
        renderList();
    } else if (id === 'nb-delete-exercise') {
        onDeleteExercise(t);
    } else if (id === 'nb-suggestion') {
        commitName(t.dataset.name);
    }
}

function onKeyDown(e) {
    const id = e.target.dataset && e.target.dataset.testid;
    if (e.key === 'Enter' && id === 'nb-name-input') {
        e.preventDefault();
        commitName(e.target.value);
    } else if (e.key === 'Escape' && id === 'nb-name-input') {
        state.editing = null;
        renderList();
    } else if (e.key === 'Enter' && id === 'nb-reps') {
        e.preventDefault();
        e.target.closest('[data-testid="nb-set"]').querySelector('[data-field="weight"]').focus();
    } else if (e.key === 'Enter' && id === 'nb-weight') {
        e.preventDefault();
        e.target.blur();
    }
}

export const NotebookUI = {
    init: () => {
        const el = root();
        if (!el) return;
        el.innerHTML = NotebookComponent.render();
        state.settings = loadSettings();
        renderSettings();

        el.addEventListener('click', onClick);
        el.addEventListener('keydown', onKeyDown);
        // Stuknięcie w podpowiedź lub „Usuń” nie zabiera fokusu polu nazwy (inaczej blur zatwierdziłby wpisany fragment).
        el.addEventListener('mousedown', (e) => {
            if (e.target.closest('[data-testid="nb-suggestion"], [data-testid="nb-delete-exercise"]')) e.preventDefault();
        });
        el.addEventListener('input', (e) => {
            const id = e.target.dataset.testid;
            if (id === 'nb-name-input' && state.editing) {
                state.editing.value = e.target.value;
                showSuggestions(e.target.value);
            } else if (id === 'nb-reps' || id === 'nb-weight') {
                onNumberInput(e.target);
            }
        });
        el.addEventListener('change', (e) => {
            const id = e.target.dataset.testid;
            if (id === 'nb-reps' || id === 'nb-weight') flush();
            else if (id === 'nb-date') changeDay(e.target.value);
            else if (e.target.dataset.option) onSettingChange(e.target);
        });
        el.addEventListener('focusin', (e) => {
            const row = e.target.closest('[data-testid="nb-set"]');
            if (row && exIdFrom(row.dataset.exerciseId) !== undefined) state.lastExerciseId = exIdFrom(row.dataset.exerciseId);
        });
        el.addEventListener('focusout', (e) => {
            if (e.target.dataset.testid !== 'nb-name-input' || !e.target.isConnected) return;
            const rel = e.relatedTarget;
            if (rel && rel.closest && rel.closest('.nb-name-row')) return;
            commitName(e.target.value);
        });

        // Okienko zamyka stuknięcie poza nim (i poza kołem, które samo je przełącza) oraz Escape.
        document.addEventListener('pointerdown', (e) => {
            if (!settingsOpen()) return;
            const t = e.target;
            if (t instanceof Node && (settingsPanel().contains(t) || q('[data-testid="nb-settings"]').contains(t))) return;
            setSettingsOpen(false);
        }, true);
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape' || !settingsOpen()) return;
            setSettingsOpen(false);
            e.stopPropagation(); // Escape zamyka tylko okienko (nie anuluje np. wpisywanej nazwy ćwiczenia)
        }, true);

        document.addEventListener('tabChanged', (e) => {
            setSettingsOpen(false);
            if (e.detail && e.detail.tab === TAB) enter();
        });
        // Zapis przed zamknięciem / schowaniem aplikacji (iPhone: przełączenie aplikacji, zablokowanie ekranu).
        window.addEventListener('pagehide', () => { flush(); writeBackup(); });
        window.addEventListener('pageshow', (e) => {
            if (e.persisted) { try { sessionStorage.removeItem(BACKUP_KEY); } catch (err) { /* nic */ } }
            onResume();
        });
        state.restorePromise = restoreBackup();
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') flush();
            else onResume();
        });
    },

    openDay: async (date) => {
        state.date = date;
        state.followToday = date === localDateStr();
        state.seenOn = localDateStr(); // wybrany dzień wygrywa z regułą „nowy dzień → dzisiejsza kartka” w enter()
        if (window.switchTab) window.switchTab(TAB);
        else enter();
        await state.loadPromise;
    },

    flush: () => flush(),
};
