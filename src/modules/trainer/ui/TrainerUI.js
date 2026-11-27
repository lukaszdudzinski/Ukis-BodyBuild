// Powłoka Strefy trenera: karta #trainer-zone z własnym nagłówkiem, paskiem, routerem i motywem.
// Ekrany rejestrują się przez register(route, renderFn) w kolejnych modułach (trasy gate, setup, unlock, clients…).
import { h, icon } from './dom.js';
import * as access from '../trainerAccess.js';
import { registerGateScreens } from './gateScreens.js';
import { registerVaultScreens, pendingRecoveryCode } from './vaultScreens.js';
import { registerClientScreens } from './clientScreens.js';
import { registerInterviewScreen } from './interviewScreen.js';
import { registerAssessmentScreen } from './assessmentScreen.js';
import { registerMeasurementsScreen } from './measurementsScreen.js';
import { registerSettingsScreen } from './settingsScreen.js';
import { registerIssueScreen } from './issueScreen.js';
import { registerPlanScreens } from './planScreens.js';
import { registerPlanEditScreen } from './planEditScreen.js';
import { registerPlanExportScreen } from './planExportScreen.js';
import { registerSessionScreens } from './sessionScreen.js';
import { registerProgressScreen } from './progressScreen.js';
import { loadSections, effectiveSections, isTrainerOnly, applySections } from '../trainerSections.js';
import { createVault } from '../trainerVault.js';
import { createAutoLock } from '../trainerLock.js';
import { DatabaseManager } from '../../db/DatabaseManager.js';
import { KLUCZE } from '../../wyglad/wygladModel.js';
import { Wyglad, ZDARZENIE as WYGLAD_ZMIENIONY } from '../../wyglad/tlo.js';

// Motyw Strefy to motyw całej aplikacji (spec rozdz. 5.4); dawny klucz Strefy czyta tylko migracja.
export const MOTYW_KEY = KLUCZE.motyw;
export const MOTYWY = [
    { id: 'zar', label: 'Czerwony żar' },
    { id: 'granat', label: 'Grafit i granat' },
    { id: 'pomarancz', label: 'Czerń i pomarańcz' },
];
const TAB_ID = 'trainer-zone';

// Pasek wydania 1. Terminy i Finanse dojdą w wydaniu 3.
const NAV = [
    { route: 'clients', label: 'Klienci', icon: 'users', match: (r) => r === 'clients' || r === 'client' || r.startsWith('client-') },
    { route: 'settings', label: 'Ustawienia', icon: 'settings', match: (r) => r === 'settings' || r.startsWith('settings-') },
];

const routes = new Map();
let stack = [];
let els = null;
let toastTimer = null;
let dialogSeq = 0;
let accessReady = Promise.resolve();
// Otwarte okna potwierdzenia (funkcje zamykające): blokada zamyka je wszystkie.
const openDialogs = new Set();
// Hak bieżącego ekranu z formularzem: { root, saveDraft } (zapis szkicu przed opuszczeniem ekranu).
let leaveHook = null;
// Bieżący ekran: jego nasłuchy (np. „wygladZmieniony” w karcie motywu) odpinają się, gdy ekran znika.
let viewAbort = null;
const viewSignals = new WeakMap();
// Zapisy szkiców w toku (blokada na nie czeka, zanim zabierze klucz).
let saving = Promise.resolve();
// Zmiany ekranu czekające na zapis szkicu idą po kolei; blokada unieważnia te sprzed niej.
let navQueue = Promise.resolve();
let navPending = 0;
let navGen = 0;
// Zapis szkicu, który się nie kończy (zawieszona baza), nie może zatrzymać zmiany ekranu ani blokady.
const DRAFT_SAVE_TIMEOUT_MS = 3000;
const TIMED_OUT = Symbol('timeout');
const DRAFT_FAILED = 'Nie udało się zapisać szkicu.';
// Zapisy nagrań i zdjęć w toku: zakończenie nagrania i szyfrowanie trwa dłużej niż szkic tekstu,
// więc blokada czeka na nie osobno, najwyżej SLOW_SAVE_TIMEOUT_MS (szkic tekstu zapisuje się pierwszy).
const SLOW_SAVE_TIMEOUT_MS = 8000;
const slowSaves = new Set();

function readMotyw() {
    return Wyglad.getWyglad().motyw;
}

function iconButton(name, label, onClick) {
    return h('button', { type: 'button', class: 'tz-icbtn', 'aria-label': label, title: label, onclick: onClick }, icon(name));
}

function buildShell(container) {
    const back = iconButton('chevron-left', 'Wstecz', () => goBack());
    const lockBtn = iconButton('lock', 'Zablokuj Strefę', () => ctx.lock && ctx.lock.lockNow());
    const exit = iconButton('log-out', 'Wyjdź ze Strefy trenera', () => window.switchTab && window.switchTab('welcome-screen'));
    const navButtons = NAV.map((item) =>
        h('button', { type: 'button', class: 'tz-navbtn', dataset: { route: item.route }, onclick: () => show(item.route, {}, { reset: true }) },
            icon(item.icon), item.label));
    const nav = h('nav', { class: 'tz-nav', 'aria-label': 'Strefa trenera' }, navButtons);
    const main = h('main', { class: 'tz-main' });
    const root = h('div', { class: 'tz', dataset: { motyw: readMotyw() } },
        h('header', { class: 'tz-head' },
            back,
            h('img', { class: 'tz-logo', src: 'img/logo.png', alt: '', width: 28, height: 28 }),
            h('span', { class: 'tz-title' }, 'Strefa trenera'),
            lockBtn,
            exit),
        main,
        nav);
    container.replaceChildren(root);
    return { root, main, nav, navButtons, back, lockBtn, exit };
}

function updateChrome(route) {
    const tab = NAV.find((item) => item.match(route));
    els.nav.hidden = !tab && route !== '__probka';
    els.navButtons.forEach((btn, i) => {
        const on = tab ? NAV[i] === tab : route === '__probka' && i === 0;
        btn.classList.toggle('tz-navon', on);
        if (on) btn.setAttribute('aria-current', 'page');
        else btn.removeAttribute('aria-current');
    });
    els.back.hidden = stack.length < 2;
    els.lockBtn.hidden = !(ctx.lock && ctx.vault && ctx.vault.isUnlocked()) || !!pendingRecoveryCode();
    els.root.dataset.route = route;
}

function renderPlaceholder(root) {
    root.append(h('section', { class: 'card' },
        h('h2', { class: 'hd' }, 'Wkrótce'),
        h('p', { class: 'sub' }, 'Ten ekran jeszcze powstaje.')));
}

// Ekran z formularzem rejestruje zapis szkicu. Router woła go przed podmianą ekranu (Wstecz, pasek,
// wejście do Strefy, powrót z Profilu) i przed blokadą, póki ekran jest jeszcze w DOM.
// saveDraft sam sprawdza, czy coś się zmieniło. Zwraca funkcję wyrejestrowania (zapis, Anuluj).
export function onLeave(root, saveDraft) {
    const hook = { root, saveDraft };
    leaveHook = hook;
    return () => { if (leaveHook === hook) leaveHook = null; };
}

// Zabiera hak bieżącego ekranu i uruchamia zapis szkicu; null, gdy nie ma czego zapisywać.
function flushLeave() {
    const hook = leaveHook;
    leaveHook = null;
    if (!hook || !hook.root.isConnected) return null;
    let p;
    try { p = Promise.resolve(hook.saveDraft()); } catch (e) { p = Promise.reject(e); }
    p = p.catch((e) => {
        console.error('[Strefa trenera] szkic:', e && e.message);
        toast(DRAFT_FAILED);
    });
    saving = Promise.all([saving, p]).then(() => {});
    return p;
}

// Czeka na zapis najwyżej DRAFT_SAVE_TIMEOUT_MS; po czasie daje TIMED_OUT (zapis może skończyć się później).
function settleWithin(p, ms = DRAFT_SAVE_TIMEOUT_MS) {
    let timer = null;
    const limit = new Promise((resolve) => { timer = setTimeout(() => resolve(TIMED_OUT), ms); });
    return Promise.race([p, limit]).finally(() => clearTimeout(timer));
}

// Szkic przed zmianą ekranu: po przekroczeniu czasu ekran i tak się zmienia, z komunikatem.
async function awaitDraft(pending) {
    if (!pending) return;
    if ((await settleWithin(pending)) === TIMED_OUT) {
        console.error('[Strefa trenera] szkic: zapis nie skończył się w czasie');
        toast(DRAFT_FAILED);
    }
}

// Każda zmiana ekranu: najpierw szkic bieżącego formularza, potem nowy ekran (w kolejności wywołań).
// Bez szkicu do zapisania i bez kolejki ekran zmienia się od razu, jak dotąd.
function navigate(apply) {
    const pending = flushLeave();
    if (!pending && navPending === 0) {
        apply();
        return Promise.resolve();
    }
    const gen = navGen;
    navPending += 1;
    const run = navQueue
        .then(() => awaitDraft(pending))
        .then(() => { if (gen === navGen) apply(); })
        .catch((e) => reportError('nawigacja', e))
        .finally(() => { navPending -= 1; });
    navQueue = run;
    return run;
}

// Ekran znika (inna trasa, błąd otwarcia, ponowne wejście do Strefy): odpinamy jego nasłuchy.
function leaveView() {
    if (viewAbort) viewAbort.abort();
    viewAbort = null;
}

// Sygnał ekranu, w którym leży `node`: do addEventListener(…, { signal }) na document/window.
// null, gdy `node` nie leży w ekranie routera (wtedy nasłuchu nie ma czym odpiąć).
function viewSignal(node) {
    const view = node && node.closest ? node.closest('.tz-view') : null;
    return (view && viewSignals.get(view)) || null;
}

function render() {
    const { route, params } = stack[stack.length - 1];
    const view = h('div', { class: 'tz-view' });
    leaveView();
    viewAbort = new AbortController();
    viewSignals.set(view, viewAbort.signal);
    els.main.replaceChildren(view);
    els.main.scrollTop = 0;
    updateChrome(route);
    // Tryb sesji autoblokady (decyzja 10): włączony dokładnie wtedy, gdy otwarty jest ekran sesji.
    ctx.lock?.setSessionActive?.(route === 'session');
    const fn = routes.get(route) || renderPlaceholder;
    try {
        Promise.resolve(fn(view, params, ctx)).catch((e) => reportError(route, e));
    } catch (e) {
        reportError(route, e);
    }
}

function reportError(route, e) {
    console.error(`[Strefa trenera] ekran ${route}:`, e);
    toast('Coś poszło nie tak. Spróbuj jeszcze raz.');
}

// show(route, params, { reset }) — reset czyści historię (wejście do Strefy, pasek, blokada),
// inaczej ekran trafia na stos, a powrót do ekranu ze stosu ucina stos do niego.
export function show(route, params = {}, { reset = false } = {}) {
    if (!els) return Promise.resolve();
    return navigate(() => {
        if (reset) stack = [];
        const i = stack.findIndex((e) => e.route === route);
        if (i >= 0) stack = stack.slice(0, i);
        stack.push({ route, params: params || {} });
        render();
    });
}

function goBack() {
    if (stack.length < 2) return Promise.resolve();
    return navigate(() => {
        if (stack.length < 2) return;
        stack.pop();
        render();
    });
}

export function register(route, renderFn) {
    routes.set(route, renderFn);
}

// Ekran startowy według stanu: brak kodu → gate, brak sejfu → setup, zablokowany → unlock, inaczej → clients.
async function resolveRoute() {
    if (!access.hasTrainerLicenseSync()) return 'gate';
    const vault = ctx.vault;
    if (!vault || !(await vault.isSetUp())) return 'setup';
    if (!vault.isUnlocked()) return 'unlock';
    return pendingRecoveryCode() ? 'recovery-show' : 'clients';
}

export const ACCESS_EVENT = 'trainerAccessChanged';

function sectionsInput() {
    let sections = null;
    let trainerEnabled = false;
    try {
        sections = loadSections();
        trainerEnabled = access.isTrainerEnabled();
    } catch (e) { /* prywatne okno: pełna aplikacja */ }
    return { sections, trainerEnabled, hasLicense: access.hasTrainerLicenseSync() };
}

// Okrojenie zwykłej części aplikacji (spec rozdz. 10). W trybie „Tylko Strefa trenera” każda inna karta
// niż Strefa, Profil (z ekranem „Wygląd”) i Serwis otwiera Strefę, a nagłówek Strefy nie ma ikony wyjścia.
export function applyAppSections() {
    const input = sectionsInput();
    const trainerOnly = isTrainerOnly(input);
    applySections(document, effectiveSections(input), {
        trainerOnly,
        openZone: () => { open().catch((e) => reportError('open', e)); },
    });
    if (els) els.exit.hidden = trainerOnly;
    return trainerOnly;
}

// Powrót z Profilu albo Serwisu do ekranu Strefy, z którego trener wyszedł (zwykle Ustawienia).
export function returnToZone() {
    if (!els || !stack.length) return open();
    if (window.switchTab) window.switchTab(TAB_ID);
    return navigate(() => { if (stack.length) render(); });
}

// Kafelek „Strefa trenera” w Menu widzi tylko ten, kto włączył „Jestem trenerem”.
export function refreshEntryPoints() {
    const tile = document.getElementById('trainer-menu-tile');
    if (!tile) return;
    let on = false;
    try { on = access.isTrainerEnabled(); } catch (e) { /* prywatne okno */ }
    tile.hidden = !on;
}

// Sprawdza zapisany kod i odświeża wszystko, co zależy od licencji (napis Heavy/PRO, karta w Profilu).
export async function refreshAccess() {
    let license = { ok: false };
    try { license = await access.getTrainerLicense(); } catch (e) { console.warn('[Strefa trenera] licencja:', e); }
    const label = document.getElementById('premium-status');
    if (label && license.ok) label.textContent = 'Wersja Heavy';
    if (window.PremiumUI) window.PremiumUI.renderPremiumBanner();
    refreshEntryPoints();
    document.dispatchEvent(new CustomEvent(ACCESS_EVENT, { detail: { license } }));
    return license;
}

// Ekran poprzedniej wizyty (np. dane klienta) nie może mignąć, zanim trasa się rozstrzygnie.
// Otwarty formularz zapisuje się najpierw jako szkic. Błąd (np. zajęta baza) daje kartę „Spróbuj ponownie”.
export async function open() {
    const pending = flushLeave();
    leaveView();
    if (els) els.main.replaceChildren();
    if (window.switchTab) window.switchTab(TAB_ID);
    try {
        await awaitDraft(pending);
        await accessReady;
        const route = await resolveRoute();
        await show(route, {}, { reset: true });
    } catch (e) {
        console.error('[Strefa trenera] otwieranie Strefy:', e);
        renderOpenError();
    }
}

function renderOpenError() {
    // Bez render(): tryb sesji autoblokady (włączony np. przez powrót na kartę ze stosem „session”) trzeba wyłączyć tu,
    // także gdy widoku już nie ma.
    ctx.lock?.setSessionActive?.(false);
    leaveView();
    if (!els) return;
    stack = [];
    const retry = h('button', { type: 'button', class: 'btn', onclick: () => { open(); } }, 'Spróbuj ponownie');
    els.main.replaceChildren(h('div', { class: 'tz-view' },
        h('section', { class: 'card tz-stack', role: 'alert' },
            h('h2', { class: 'hd' }, 'Nie udało się otworzyć Strefy'),
            h('p', { class: 'sub' }, 'Baza danych może być chwilowo zajęta. Spróbuj ponownie za chwilę.'),
            h('div', { class: 'tz-row' }, retry))));
    els.nav.hidden = true;
    els.back.hidden = true;
    els.root.dataset.route = 'blad';
}

export function toast(msg) {
    if (!els) return;
    els.root.querySelectorAll('.tz-toast').forEach((t) => t.remove());
    const el = h('div', { class: 'tz-toast', role: 'status', 'aria-live': 'polite' }, msg);
    els.root.append(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.remove(), 3500);
}

export function confirm({ title, text, okLabel = 'OK', danger = false } = {}) {
    return new Promise((resolve) => {
        if (!els) { resolve(false); return; }
        const titleId = `tz-dlg-${++dialogSeq}`;
        let backdrop = null;
        const done = (value) => {
            if (!openDialogs.delete(done)) return;
            backdrop.remove();
            document.removeEventListener('keydown', onKey, true);
            resolve(value);
        };
        const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); done(false); } };
        const cancel = h('button', { type: 'button', class: 'ghost', onclick: () => done(false) }, 'Anuluj');
        const ok = h('button', { type: 'button', class: 'btn', onclick: () => done(true) }, danger ? icon('alert') : null, okLabel);
        const dialog = h('div', { class: 'card tz-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId },
            h('h2', { class: 'hd', id: titleId }, title || ''),
            text ? h('p', { class: 'sub' }, text) : null,
            h('div', { class: 'tz-dialog-actions' }, cancel, ok));
        backdrop = h('div', { class: 'tz-backdrop', onclick: (e) => { if (e.target === backdrop) done(false); } }, dialog);
        els.root.append(backdrop);
        openDialogs.add(done);
        document.addEventListener('keydown', onKey, true);
        (danger ? cancel : ok).focus();
    });
}

// Własne okno ekranu (np. wybór ćwiczenia): blokada zamyka je jak „Anuluj”, tak jak okna potwierdzenia.
// el (opcjonalnie) trafia do karty Strefy; zamknięcie usuwa je samo. Zwraca funkcję wyrejestrowania.
export function registerOverlay(close, el = null) {
    const done = () => {
        if (!openDialogs.delete(done)) return;
        close();
    };
    openDialogs.add(done);
    if (el && els) els.root.append(el);
    return () => { openDialogs.delete(done); };
}

export function setMotyw(id) {
    if (!MOTYWY.some((m) => m.id === id)) return false;
    if (!Wyglad.setMotyw(id)) return false;
    if (els) els.root.dataset.motyw = id;
    return true;
}

export async function lockNowForTest() {
    if (!access.isTestMode() || !ctx.lock) return;
    await ctx.lock.lockNow();
}

// Ekran próbny do testu kontrastu: każdy rodzaj tekstu z płótna na szklanej karcie.
function renderProbe(root) {
    root.append(
        h('section', { class: 'card tz-stack' },
            h('h2', { class: 'hd' }, 'Anna Kowalska'),
            h('p', {}, 'Zwykły tekst na karcie: Łódź, żółć, gęś.'),
            h('p', { class: 'sub' }, 'Tekst drugorzędny — ostatnia sesja wczoraj'),
            h('p', { class: 'mut' }, 'Tekst wyciszony · 3 dni temu'),
            h('p', { class: 'hi' }, 'Wyróżnienie: brak wywiadu'),
            h('div', { class: 'tz-list' },
                h('button', { type: 'button', class: 'tz-client' },
                    h('span', { class: 'tz-avatar', 'aria-hidden': 'true' }, 'AK'),
                    h('span', { class: 'tz-client-main' },
                        h('span', { class: 'tz-client-name' }, 'Anna Kowalska'),
                        h('span', { class: 'mut' }, '34 lat · Siła')),
                    h('span', { class: 'hi tz-badge' }, 'wywiad'))),
            h('div', { class: 'tabs', role: 'tablist' },
                h('button', { type: 'button', class: 'tab tabon', role: 'tab', 'aria-selected': 'true' }, 'Aktywni'),
                h('button', { type: 'button', class: 'tab', role: 'tab', 'aria-selected': 'false' }, 'Archiwum')),
            h('div', { class: 'tz-row' },
                h('span', { class: 'chip chipon' }, 'Siła'),
                h('span', { class: 'chip' }, 'Redukcja')),
            h('div', { class: 'tz-row' },
                h('button', { type: 'button', class: 'chip tz-week chipon', 'aria-pressed': 'true' }, 'Tydz. 1'),
                h('button', { type: 'button', class: 'chip tz-week', 'aria-pressed': 'false' }, 'Tydz. 2')),
            h('div', { class: 'tz-row' },
                h('span', { class: 'tz-count' }, 'plecy 8 / 10'),
                h('span', { class: 'tz-count tz-over' }, icon('alert'), 'nogi 11 / 10')),
            h('p', { class: 'tz-stat' }, 'Szacowane 1RM: 93,5 kg'),
            h('div', { class: 'tz-month' },
                h('span', { class: 'sub' }, 'listopad 2026'),
                h('strong', { class: 'tz-month-count' }, '2'),
                h('div', { class: 'tz-bar', 'aria-hidden': 'true' }, h('div', { class: 'tz-bar-fill', style: { width: '60%' } }))),
            h('input', { class: 'in', type: 'text', value: 'Wpisany tekst', 'aria-label': 'Pole próbne' }),
            h('div', { class: 'tz-sess-ex tz-stack tz-tight' },
                h('div', { class: 'tz-between' },
                    h('h3', { class: 'tz-ex-name' }, 'Przysiad ze sztangą'),
                    h('span', { class: 'tz-clock' }, '12:34')),
                h('p', { class: 'sub tz-planned' }, 'Plan: 4 × 5 · 80 kg · RIR 2 · tempo 3010 · przerwa 2:30'),
                h('div', { class: 'tz-sets' },
                    h('div', { class: 'tz-sets-hd mut' }, h('span', {}, 'Seria'), h('span', {}, 'kg'), h('span', {}, 'Powt.'), h('span', {})),
                    h('div', { class: 'tz-set tz-done' },
                        h('span', { class: 'tz-setnum' }, '1'),
                        h('input', { class: 'in', type: 'text', value: '82,5', 'aria-label': 'Ciężar próbny' }),
                        h('input', { class: 'in', type: 'text', value: '5', 'aria-label': 'Powtórzenia próbne' }),
                        h('button', { type: 'button', class: 'tz-tick', 'aria-pressed': 'true', 'aria-label': 'Seria próbna' }, icon('check'))),
                    h('div', { class: 'tz-set tz-drop' },
                        h('span', { class: 'tz-setnum' }, 'drop'),
                        h('input', { class: 'in tz-invalid', type: 'text', value: '60,', 'aria-label': 'Ciężar błędny' }),
                        h('input', { class: 'in', type: 'text', value: '8', 'aria-label': 'Powtórzenia drop' }),
                        h('button', { type: 'button', class: 'tz-tick', 'aria-pressed': 'false', 'aria-label': 'Drop próbny' }, icon('check'))))),
            h('div', { class: 'tz-stack tz-tight' },
                h('button', { type: 'button', class: 'tz-switch', role: 'switch', 'aria-checked': 'true' },
                    h('span', { class: 'tz-switch-text' }, h('span', {}, 'Rozgrzewka'), h('span', { class: 'mut' }, 'przełącznik próbny')),
                    h('span', { class: 'tz-switch-knob', 'aria-hidden': 'true' }))),
            h('div', { class: 'card tz-safe' }, h('p', { class: 'tz-iconline' }, icon('check'), h('span', {}, 'W pliku jest tylko plan treningowy.'))),
            h('section', { class: 'card tz-stack tz-notes' },
                h('label', { class: 'tz-field' }, h('span', { class: 'hd tz-notes-hd' }, 'Uwagi'),
                    h('textarea', { class: 'in', rows: 3, 'aria-label': 'Uwagi próbne' }, 'Klient woli poranne treningi.')),
                h('p', { class: 'mut' }, 'Możesz też dyktować z klawiatury (ikona mikrofonu).'),
                h('div', { class: 'tz-row tz-rec' },
                    h('span', { class: 'tz-rec-time', role: 'timer' }, '0:42 / 3:00'),
                    h('button', { type: 'button', class: 'btn' }, icon('square'), 'Zatrzymaj'),
                    h('button', { type: 'button', class: 'ghost' }, icon('mic'), 'Nagraj')),
                h('p', { class: 'tz-error' }, 'Brak dostępu do mikrofonu.'),
                h('div', { class: 'tz-body-facts tz-row tz-between' },
                    h('p', { class: 'sub' }, 'Wiek: 34 · Waga: 80,5 kg (2026-11-22)'),
                    h('button', { type: 'button', class: 'ghost' }, icon('ruler'), 'Dodaj pomiar')),
                h('label', { class: 'ghost tz-photo-pick' }, icon('camera'), 'Przód',
                    h('input', { type: 'file', class: 'tz-file', 'aria-label': 'Zdjęcie próbne' })),
                h('div', { class: 'tz-compare' },
                    h('figure', { class: 'tz-compare-side' }, h('div', { class: 'tz-compare-empty mut' }, 'Brak zdjęcia'),
                        h('figcaption', { class: 'sub' }, '2026-10-01 · Przód'))),
                h('ul', { class: 'tz-audio' },
                    h('li', { class: 'tz-audio-item' },
                        h('button', { type: 'button', class: 'tz-icbtn', 'aria-pressed': 'true', 'aria-label': 'Nagranie próbne' }, icon('square')),
                        h('span', { class: 'tz-audio-main' }, h('span', { class: 'tz-audio-time' }, '1:05'), h('span', { class: 'mut' }, '26.11.2026, 12:30')),
                        h('button', { type: 'button', class: 'tz-icbtn', 'aria-label': 'Usuń próbne' }, icon('trash'))))),
            h('div', { class: 'tz-row' },
                h('button', { type: 'button', class: 'btn' }, icon('plus'), 'Klient'),
                h('button', { type: 'button', class: 'ghost' }, 'Anuluj'))));
}

export const ctx = {
    vault: null, lock: null, access, show, toast, confirm, registerOverlay, refreshAccess, resolve: resolveRoute, onLeave, viewSignal, holdLock,
    theme: { list: MOTYWY, get: readMotyw, set: setMotyw },
    applySections: applyAppSections,
};

const exec = (sql, bind) => DatabaseManager.sendMessage('exec', { sql, bind, rowMode: 'object' }).then((r) => r.result);

// Długi zapis (nagranie, zdjęcie), na który blokada poczeka do SLOW_SAVE_TIMEOUT_MS.
export function holdLock(p) {
    const tracked = Promise.resolve(p).catch(() => {});
    slowSaves.add(tracked);
    tracked.finally(() => slowSaves.delete(tracked));
    return p;
}

// Przed blokadą: szkic otwartego formularza (póki ekran jest w DOM) i zapisy szkiców w toku,
// a osobno, dłużej, zapisy nagrań. Blokada zawsze wygrywa: zapisy, które nie skończyły się w czasie,
// zostają porzucone (nagranie zaczęte przed blokadą i tak dopisze się kluczem z chwili startu).
async function saveBeforeLock() {
    flushLeave();
    const [draft, slow] = await Promise.all([
        settleWithin(saving),
        settleWithin(Promise.all([...slowSaves]), SLOW_SAVE_TIMEOUT_MS),
    ]);
    if (draft === TIMED_OUT) {
        console.error('[Strefa trenera] szkic: zapis nie skończył się przed blokadą');
        saving = Promise.resolve();
    }
    if (slow === TIMED_OUT) console.error('[Strefa trenera] nagranie: zapis nie skończył się przed blokadą');
}

// Okna potwierdzenia (np. z nazwiskiem klienta) zamykają się jak „Anuluj”, komunikat znika (spec 7.4).
function closeOverlays() {
    for (const done of [...openDialogs]) done(false);
    clearTimeout(toastTimer);
    if (els) els.root.querySelectorAll('.tz-toast').forEach((t) => t.remove());
}

// Blokada (ręczna, za brak dotyku, w tle): klucz i rekordy znikają z pamięci, ekran wraca do hasła.
// Autoblokada startuje dopiero po udanym odblokowaniu (ekrany sejfu wołają ctx.lock.start()).
function onLock() {
    // Kod awaryjny jeszcze niezapisany: sejf jest pusty, a blokada zabrałaby kod bez śladu.
    // Autoblokadę uzbraja dopiero „Gotowe” (lock.start() zdejmuje też stan „zablokowane”).
    if (pendingRecoveryCode()) return;
    closeOverlays();
    ctx.lock?.setSessionActive?.(false);
    ctx.vault.lock();
    if (!els) return;
    leaveHook = null;
    // Zmiany ekranu sprzed blokady nie wyrenderują się; ekran hasła od razu, bez czekania w kolejce.
    navGen += 1;
    stack = [{ route: 'unlock', params: {} }];
    render();
}

export function init() {
    const container = document.getElementById(TAB_ID);
    if (!container || els) return;
    els = buildShell(container);
    // Zmiana motywu w ekranie „Wygląd” (albo gdziekolwiek przez window.Wyglad) przechodzi na Strefę.
    document.addEventListener(WYGLAD_ZMIENIONY, (e) => {
        const id = e.detail && e.detail.motyw;
        if (els && MOTYWY.some((m) => m.id === id)) els.root.dataset.motyw = id;
    });
    ctx.vault = createVault({ exec });
    ctx.lock = createAutoLock({ onLock });
    ctx.lock.beforeLock(saveBeforeLock);
    registerGateScreens(register);
    registerVaultScreens(register);
    registerClientScreens(register);
    registerInterviewScreen(register);
    registerAssessmentScreen(register);
    registerMeasurementsScreen(register);
    registerSettingsScreen(register);
    registerIssueScreen(register);
    registerPlanScreens(register);
    registerPlanEditScreen(register);
    registerPlanExportScreen(register);
    registerSessionScreens(register);
    registerProgressScreen(register);
    if (access.isTestMode() && new URLSearchParams(location.search).has('tz-probka')) {
        register('__probka', renderProbe);
    }
    // Strefa ma własny pasek: pasek aplikacji chowa się, gdy karta Strefy jest aktywna.
    // Sekcje sprawdzane po zakończeniu przełączania karty, żeby inne moduły skończyły obsługę zdarzenia.
    document.addEventListener('tabChanged', (e) => {
        const onZone = !!(e.detail && e.detail.tab === TAB_ID);
        document.body.classList.toggle('tz-on', onZone);
        // Poza kartą Strefy ekran sesji nie jest otwarty: wracają zwykłe progi autoblokady (decyzja 10).
        const top = stack[stack.length - 1];
        ctx.lock?.setSessionActive?.(onZone && !!top && top.route === 'session');
        queueMicrotask(applyAppSections);
    });
    document.body.append(h('button', { type: 'button', id: 'tz-return', class: 'tz-return', onclick: () => returnToZone() },
        icon('chevron-left'), 'Wróć do Strefy trenera'));
    refreshEntryPoints();
    document.addEventListener(ACCESS_EVENT, refreshEntryPoints);
    // Po sprawdzeniu kodu (refreshAccess) i po zmianie „Jestem trenerem” w Profilu.
    document.addEventListener(ACCESS_EVENT, applyAppSections);
    // open() czeka na sprawdzenie kodu, inaczej kliknięcie tuż po starcie pokazałoby ekran bez kodu.
    accessReady = refreshAccess().catch((e) => console.warn('[Strefa trenera] dostęp:', e));
}

export const TrainerUI = { init, open, show, register, onLeave, ctx, setMotyw, lockNowForTest, refreshEntryPoints, refreshAccess, applyAppSections, returnToZone, MOTYWY };
