// wyglad: zar
// Ekran „Wygląd” (#wyglad-panel, spec 8.3, plansza Wyglad): motyw kolorów, tło (poświata albo tapeta),
// przyciemnienie i rozmycie tapety. Wejście z Profilu. Każda zmiana idzie przez window.Wyglad (tlo.js).
import { Wyglad, ZDARZENIE } from './tlo.js';
import { MOTYWY, PRZYCIEMNIENIE } from './wygladModel.js';
import { TAPETY } from './tapety.js';
import { h, icon } from '../trainer/ui/dom.js';

const PANEL = 'wyglad-panel';
const PROFIL = 'settings-panel';
const ROZMYCIA = [
    { id: 'brak', nazwa: 'brak' },
    { id: 'male', nazwa: 'małe' },
    { id: 'srednie', nazwa: 'średnie' },
    { id: 'duze', nazwa: 'duże' },
];
const KOMUNIKAT = {
    ZAPIS: 'Nie udało się zapisać tapety. Spróbuj mniejszego zdjęcia.',
    USUN: 'Nie udało się usunąć tapety. Spróbuj ponownie.',
    USUN_ZDJECIE: 'Nie udało się usunąć zdjęcia. Spróbuj ponownie.',
    ZAPISANA: 'Tapeta zapisana.',
    WYBRANA: 'Tapeta wybrana.',
    USUNIETA: 'Tapeta usunięta.',
    ZDJECIE_USUNIETE: 'Zdjęcie usunięte.',
};
// Błędy z tlo.js / tapeta.js z własnym komunikatem; reszta (NIE_OBRAZ, ZAPIS, …) dostaje komunikat operacji.
const BLEDY = {
    ZA_DUZE: 'Zdjęcie jest za duże (ponad 25 MB).',
    BRAK_ZDJECIA: 'Tego zdjęcia nie ma już na telefonie. Wybierz je ponownie.',
};
const NBSP = ' ';
const procent = (n) => `${n}${NBSP}%`;

export function nazwaMotywu(id) {
    return (MOTYWY.find((m) => m.id === id) || MOTYWY[0]).nazwa;
}

// Zakładka tła wybrana na ekranie; null = jak w ustawieniach (przy każdym wejściu na ekran).
let zakladka = null;
let pokolenie = 0;
let zajety = false;
let ostatni = null; // { tlo, tapeta } z ostatniego pełnego rysowania
let el = {}; // elementy odświeżane bez przebudowy (suwaki w trakcie przeciągania)
let zegarKomunikatu = null;

function loguj(msg, e) {
    try { if (window.ukiLogError) window.ukiLogError(msg, e && (e.stack || String(e))); } catch (_) { /* bez logu */ }
}

function komunikat(tekst) {
    let t = document.getElementById('wyglad-komunikat');
    if (!t) {
        t = h('div', { id: 'wyglad-komunikat', class: 'z-toast', role: 'status', 'aria-live': 'polite' });
        document.body.append(t);
    }
    t.textContent = tekst;
    t.hidden = false;
    clearTimeout(zegarKomunikatu);
    zegarKomunikatu = setTimeout(() => { t.hidden = true; }, 4000);
}

function widoczny() {
    const panel = document.getElementById(PANEL);
    return !!panel && panel.style.display !== 'none' && panel.getClientRects().length > 0;
}

// Po operacji fokus trafia na sensowną kontrolkę (stara zniknęła przy przebudowie): wybrany kafel albo
// podgląd własnego zdjęcia, a gdy go nie ma — „Zmień zdjęcie” / „Wybierz zdjęcie”, na końcu zakładka.
function fokusPoZadaniu() {
    const panel = document.getElementById(PANEL);
    if (!panel || !widoczny()) return;
    const cel = panel.querySelector('#wyglad-tlo-panel [aria-pressed="true"]')
        || panel.querySelector('#wyglad-wybierz')
        || panel.querySelector('#wyglad-zakladka-tapeta');
    if (cel) cel.focus();
}

// Operacja na tapecie: jedna naraz. Wynik ogłasza komunikat (role=status), błąd ma własny komunikat;
// na końcu ekran rysuje się od nowa, a fokus wraca na kontrolkę w karcie tapety.
async function zadanie(fn, { blad, sukces, fokus = fokusPoZadaniu }) {
    if (zajety) return;
    zajety = true;
    document.getElementById(PANEL)?.setAttribute('aria-busy', 'true');
    let tekst = sukces;
    try {
        await fn();
    } catch (e) {
        loguj('Wygląd: tapeta', e);
        tekst = BLEDY[e && e.message] || blad;
    } finally {
        zajety = false;
        document.getElementById(PANEL)?.removeAttribute('aria-busy');
        await render().catch((e) => loguj('Wygląd: ekran', e));
        if (tekst) komunikat(tekst);
        fokus();
    }
}

// --- Części ekranu ---

function naglowek() {
    return h('header', { class: 'z-head-center' },
        h('button', {
            type: 'button', class: 'z-ic z-card', 'aria-label': 'Wróć',
            onclick: () => window.switchTab && window.switchTab(PROFIL),
        }, icon('chevron-left')),
        h('h2', { class: 'z-hd' }, 'Wygląd'),
        h('span', { class: 'z-head-spacer', 'aria-hidden': 'true' }));
}

function kafleMotywow(w) {
    el.motywy = MOTYWY.map((m) => h('button', {
        type: 'button', class: 'z-motyw', dataset: { motyw: m.id }, 'aria-pressed': String(m.id === w.motyw),
        onclick: () => Wyglad.setMotyw(m.id),
    },
    h('span', { class: 'z-motyw-podglad', dataset: { motyw: m.id }, 'aria-hidden': 'true' },
        h('span', { class: 'z-motyw-pigulka' }),
        h('span', { class: 'z-motyw-linia' }),
        h('span', { class: 'z-motyw-linia z-krotka' })),
    h('span', { class: 'z-motyw-nazwa' }, m.nazwa),
    h('span', { class: 'z-mut' }, m.opis)));
    return h('div', { class: 'z-motywy' }, el.motywy);
}

async function wybierzZakladke(id) {
    zakladka = id;
    if (id === 'poswiata') {
        Wyglad.ustawTlo('poswiata');
    } else {
        // Tapeta tylko wtedy, gdy jej zdjęcie naprawdę jest; bez zdjęcia zostaje poświata i karta „Wybierz zdjęcie”.
        const w = Wyglad.getWyglad();
        if (w.tapeta && (await Wyglad.adresTapety(w.tapeta))) Wyglad.ustawTlo('tapeta');
    }
    await render();
    document.getElementById(`wyglad-zakladka-${id}`)?.focus();
}

function zakladki() {
    const ZAKLADKI = [['poswiata', 'Poświata motywu'], ['tapeta', 'Własna tapeta']];
    const naKlawisz = (e) => {
        const i = ZAKLADKI.findIndex(([id]) => id === zakladka);
        let j = null;
        const n = ZAKLADKI.length;
        if (e.key === 'ArrowRight') j = (i + 1) % n;
        if (e.key === 'ArrowLeft') j = (i - 1 + n) % n;
        if (e.key === 'Home') j = 0;
        if (e.key === 'End') j = n - 1;
        if (j === null) return;
        e.preventDefault();
        wybierzZakladke(ZAKLADKI[j][0]);
    };
    return h('div', { class: 'z-tabs', role: 'tablist', 'aria-label': 'Tło' },
        ZAKLADKI.map(([id, nazwa]) => h('button', {
            type: 'button', role: 'tab', class: 'z-tab', id: `wyglad-zakladka-${id}`,
            'aria-selected': String(zakladka === id), 'aria-controls': 'wyglad-tlo-panel',
            tabindex: zakladka === id ? '0' : '-1',
            onclick: () => { if (zakladka !== id) wybierzZakladke(id); },
            onkeydown: naKlawisz,
        }, nazwa)));
}

// Wybór zapisanej tapety (własnej albo wbudowanej) bez ponownego wgrywania.
const wybierz = (zrodlo) => zadanie(() => Wyglad.wybierzTapete(zrodlo), { blad: KOMUNIKAT.ZAPIS, sukces: KOMUNIKAT.WYBRANA });
const wybrana = (w, zrodlo) => w.tapeta === zrodlo && w.tlo === 'tapeta';

function miniatura({ zrodlo, nazwa, url, pressed }) {
    return h('button', {
        type: 'button', class: 'z-wyglad-miniatura', 'aria-pressed': String(pressed),
        onclick: () => { if (!pressed) wybierz(zrodlo); },
    },
    h('span', { class: 'z-wyglad-miniatura-obraz', style: { backgroundImage: `url("${url}")` }, 'aria-hidden': 'true' }),
    h('span', { class: 'z-wyglad-miniatura-podpis' }, nazwa));
}

// Podgląd 76 × 116. Bez tapet wbudowanych to on jest kontrolką zapisanego własnego zdjęcia (R8):
// <button aria-pressed>, który wraca do zdjęcia bez ponownego wgrywania.
function podglad(w, { aktualny, wlasny }) {
    const scrim = h('span', { class: 'z-wyglad-podglad-scrim' });
    if (!TAPETY.length && wlasny) {
        const pressed = wybrana(w, 'wlasna');
        return h('button', {
            type: 'button', class: 'z-wyglad-podglad', 'aria-pressed': String(pressed), 'aria-label': 'Własne zdjęcie',
            style: { backgroundImage: `url("${wlasny}")` },
            onclick: () => { if (!pressed) wybierz('wlasna'); },
        }, scrim);
    }
    return h('div', {
        class: `z-wyglad-podglad${aktualny ? '' : ' z-pusty'}`, 'aria-hidden': 'true',
        style: aktualny ? { backgroundImage: `url("${aktualny}")` } : {},
    }, scrim);
}

function kartaTapety(w, { aktualny, wlasny }) {
    const plik = () => document.getElementById('wyglad-plik')?.click();
    // Rząd miniatur tylko z tapetami wbudowanymi (A12); wtedy zapisane własne zdjęcie jest pierwszym kaflem (R8).
    const kafle = [];
    if (TAPETY.length) {
        if (wlasny) kafle.push(miniatura({ zrodlo: 'wlasna', nazwa: 'Własne zdjęcie', url: wlasny, pressed: wybrana(w, 'wlasna') }));
        for (const t of TAPETY) {
            const zrodlo = `wbudowana:${t.id}`;
            kafle.push(miniatura({ zrodlo, nazwa: t.nazwa, url: t.plik, pressed: wybrana(w, zrodlo) }));
        }
    }
    const wbudowana = TAPETY.find((t) => w.tapeta === `wbudowana:${t.id}`);
    const nazwa = !aktualny ? 'Brak zdjęcia' : (wbudowana ? wbudowana.nazwa : 'Własne zdjęcie');
    const usun = () => zadanie(() => Wyglad.usunTapete(), { blad: KOMUNIKAT.USUN, sukces: KOMUNIKAT.USUNIETA });
    // Przy tapecie wbudowanej „Usuń tapetę” tylko ją odznacza; zapisane własne zdjęcie usuwa osobna akcja.
    const usunZdjecie = () => zadanie(() => Wyglad.usunZdjecie(), { blad: KOMUNIKAT.USUN_ZDJECIE, sukces: KOMUNIKAT.ZDJECIE_USUNIETE });
    return h('div', { class: 'z-card z-wyglad-karta' },
        kafle.length ? h('div', { class: 'z-wyglad-miniatury' }, kafle) : null,
        h('div', { class: 'z-wyglad-tapeta' },
            podglad(w, { aktualny, wlasny }),
            h('div', { class: 'z-wyglad-tapeta-opis' },
                h('div', { class: 'z-wyglad-tapeta-nazwa' }, nazwa),
                h('button', { type: 'button', class: 'z-ghost', id: 'wyglad-wybierz', onclick: plik }, wlasny ? 'Zmień zdjęcie' : 'Wybierz zdjęcie'),
                aktualny || wlasny
                    ? h('button', { type: 'button', class: 'z-ghost z-danger', onclick: usun }, 'Usuń tapetę')
                    : null,
                wbudowana && wlasny
                    ? h('button', { type: 'button', class: 'z-ghost z-danger', onclick: usunZdjecie }, 'Usuń własne zdjęcie')
                    : null)));
}

function suwak({ id, nazwa, min, max, value }) {
    const wartosc = h('span', { class: 'z-mut', id: `${id}-wartosc` });
    const input = h('input', { type: 'range', class: 'z-range', id, min: String(min), max: String(max), step: '1', value: String(value) });
    return { input, wartosc, wezel: h('div', {},
        h('div', { class: 'z-wyglad-suwak-gora' }, h('label', { for: id }, nazwa), wartosc),
        input) };
}

function kartaSuwakow(w) {
    const p = suwak({ id: 'wyglad-przyciemnienie', nazwa: 'Przyciemnienie tapety', min: granica(w), max: PRZYCIEMNIENIE.max, value: w.przyciemnienie });
    const r = suwak({ id: 'wyglad-rozmycie', nazwa: 'Rozmycie tapety', min: 0, max: ROZMYCIA.length - 1, value: indeksRozmycia(w.rozmycie) });
    p.input.addEventListener('input', () => Wyglad.ustawPrzyciemnienie(Number(p.input.value)));
    r.input.addEventListener('input', () => Wyglad.ustawRozmycie(ROZMYCIA[Number(r.input.value)].id));
    const tekst = h('p', { class: 'z-mut z-wyglad-granica', id: 'wyglad-granica' });
    el.przyciemnienie = p;
    el.rozmycie = r;
    el.granica = tekst;
    odswiezSuwaki(w);
    return h('div', { class: 'z-card z-wyglad-suwaki' }, p.wezel, r.wezel, tekst);
}

const granica = (w) => Math.max(PRZYCIEMNIENIE.min, w.przyciemnienieMin);
const indeksRozmycia = (id) => Math.max(0, ROZMYCIA.findIndex((r) => r.id === id));

function wypelnij(input) {
    const min = Number(input.min);
    const max = Number(input.max);
    const pct = max > min ? ((Number(input.value) - min) / (max - min)) * 100 : 0;
    input.style.setProperty('--z-val', `${pct}%`);
}

// Odświeżenie bez przebudowy: zaznaczenie motywu, suwaki i tekst granicy.
function odswiezSuwaki(w) {
    const p = el.przyciemnienie;
    if (p) {
        const min = granica(w);
        p.input.min = String(min);
        if (Number(p.input.value) !== w.przyciemnienie) p.input.value = String(w.przyciemnienie);
        p.input.setAttribute('aria-valuetext', procent(w.przyciemnienie));
        p.wartosc.textContent = procent(w.przyciemnienie);
        wypelnij(p.input);
        el.granica.textContent = `Przyciemnienie nie zejdzie poniżej ${procent(min)} — przy jaśniejszym tle tekst przestałby być czytelny. Zdjęcie zostaje tylko na tym telefonie.`;
    }
    const r = el.rozmycie;
    if (r) {
        const i = indeksRozmycia(w.rozmycie);
        if (Number(r.input.value) !== i) r.input.value = String(i);
        r.input.setAttribute('aria-valuetext', ROZMYCIA[i].nazwa);
        r.wartosc.textContent = ROZMYCIA[i].nazwa;
        wypelnij(r.input);
    }
}

function odswiez(w) {
    (el.motywy || []).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.motyw === w.motyw)));
    odswiezSuwaki(w);
    // Tło albo tapeta zmienione poza ekranem (np. granica policzona w tle po starcie): pełne rysowanie.
    if (!zajety && ostatni && (ostatni.tlo !== w.tlo || ostatni.tapeta !== w.tapeta) && widoczny()) {
        render().catch((e) => loguj('Wygląd: ekran', e));
    }
}

// --- Rysowanie ---

export async function render() {
    const korzen = document.getElementById('wyglad-tresc');
    if (!korzen) return;
    const nr = ++pokolenie;
    const w = Wyglad.getWyglad();
    if (zakladka === null) zakladka = w.tlo;
    // Adresy tylko dla plików, które są (sam klucz w pamięci nie wystarczy).
    const [aktualny, wlasny] = await Promise.all([
        w.tapeta ? Wyglad.adresTapety(w.tapeta) : null,
        Wyglad.adresTapety('wlasna'),
    ]);
    if (nr !== pokolenie) return;
    const naTapecie = w.tlo === 'tapeta' && !!aktualny;
    el = {};
    ostatni = { tlo: w.tlo, tapeta: w.tapeta };
    const tlo = h('div', {
        class: 'z-wyglad-tlo', id: 'wyglad-tlo-panel', role: 'tabpanel', 'aria-labelledby': `wyglad-zakladka-${zakladka}`,
    }, zakladka === 'tapeta'
        ? [kartaTapety(w, { aktualny, wlasny }), naTapecie ? kartaSuwakow(w) : null]
        : h('p', { class: 'z-sub' }, 'Tło w kolorach wybranego motywu.'));
    korzen.replaceChildren(h('div', { class: 'z-wyglad' },
        naglowek(),
        h('h3', { class: 'z-wyglad-tytul' }, 'Motyw kolorów'),
        kafleMotywow(w),
        h('p', { class: 'z-wyglad-uwaga' }, icon('check'),
            h('span', {}, `Każdy motyw ma sprawdzony kontrast: tekst co najmniej 4,5${NBSP}:${NBSP}1`)),
        h('h3', { class: 'z-wyglad-tytul' }, 'Tło'),
        zakladki(),
        tlo));
}

let zainicjowany = false;

export function init() {
    if (zainicjowany) return;
    zainicjowany = true;
    const plik = document.getElementById('wyglad-plik');
    if (plik) {
        plik.addEventListener('change', () => {
            const f = plik.files && plik.files[0];
            plik.value = '';
            if (!f) return;
            zakladka = 'tapeta';
            zadanie(() => Wyglad.zapiszTapete(f), {
                blad: KOMUNIKAT.ZAPIS,
                sukces: KOMUNIKAT.ZAPISANA,
                fokus: () => document.getElementById('wyglad-wybierz')?.focus(),
            });
        });
    }
    document.addEventListener('tabChanged', (e) => {
        if (!e.detail || e.detail.tab !== PANEL) return;
        zakladka = null;
        render().catch((err) => loguj('Wygląd: ekran', err));
    });
    document.addEventListener(ZDARZENIE, (e) => odswiez(e.detail || Wyglad.getWyglad()));
}

export const WygladUI = { init, render };
