// wyglad: zar
// Nakładanie wyglądu na stronę (spec rozdz. 7): motyw na <html>, kolor paska systemu (theme-color),
// tło (poświata motywu albo tapeta z przyciemnieniem i rozmyciem).
// Jedyne publiczne API wyglądu to window.Wyglad: ten sam obiekt, który eksportuje ten moduł.
// Przed modułami motyw ustawia już skrypt #wyglad-start w <head> index.html (bez mignięcia).
import {
    MOTYWY, KLUCZE, KLUCZ_TAPETY_ZDJECIE, ROZMYCIE,
    czytajWyglad, zapiszMotyw, zapiszTlo, zapiszTapete as zapiszTapeteModel, usunTapete as usunTapeteModel,
    zapiszPrzyciemnienie, zapiszRozmycie, migruj
} from './wygladModel.js';
import { TAPETY, tapetaWbudowana } from './tapety.js';
import { zmniejszZdjecie, zmierzZdjecie } from './tapeta.js';
import { MediaManager } from '../db/MediaManager.js';

export const ZDARZENIE = 'wygladZmieniony';

// Bez dostępu do localStorage (zablokowana pamięć strony) model dostaje pustą pamięć i daje wartości domyślne.
const BEZ_PAMIECI = { getItem: () => null, setItem: () => { throw new Error('brak pamięci'); }, removeItem: () => {} };

function pamiec() {
    try { return globalThis.localStorage || BEZ_PAMIECI; } catch (e) { return BEZ_PAMIECI; }
}

function odczyt(klucz) {
    try { return pamiec().getItem(klucz); } catch (e) { return null; }
}

function zapis(m, klucz, wartosc) {
    try { m.setItem(klucz, wartosc); return true; } catch (e) { return false; }
}

function loguj(msg, e) {
    try { if (window.ukiLogError) window.ukiLogError(msg, e && (e.stack || String(e))); } catch (_) { /* bez logu */ }
}

export function getWyglad() {
    return czytajWyglad(pamiec(), { tapety: TAPETY.map((t) => t.id) });
}

function oglos(wyglad) {
    document.dispatchEvent(new CustomEvent(ZDARZENIE, { detail: wyglad }));
}

// Jeden <meta name="theme-color">: kolor powierzchni bieżącego motywu (--ukis-surface z tokens.css).
function ustawKolorPaska(doc) {
    let meta = doc.querySelector('meta[name="theme-color"]');
    if (!meta) {
        meta = doc.createElement('meta');
        meta.setAttribute('name', 'theme-color');
        doc.head.append(meta);
    }
    const kolor = getComputedStyle(doc.documentElement).getPropertyValue('--ukis-surface').trim();
    if (kolor) meta.setAttribute('content', kolor);
}

function zastosuj(doc, wyglad) {
    doc.documentElement.dataset.motyw = wyglad.motyw;
    ustawKolorPaska(doc);
}

// --- Tło ---

function ustawKlasyTla(doc, tapeta) {
    if (!doc.body) return;
    doc.body.classList.toggle('z-tlo-tapeta', tapeta);
    doc.body.classList.toggle('z-tlo-poswiata', !tapeta);
}

function ustawZmienneTla(doc, wyglad) {
    const root = doc.documentElement.style;
    root.setProperty('--ukis-scrim', String(wyglad.przyciemnienie / 100));
    root.setProperty('--ukis-wallpaper-blur', `${ROZMYCIE[wyglad.rozmycie]}px`);
}

// Plik tapety: własne zdjęcie z bazy mediów albo plik wbudowany.
async function zdjecieTapety(tapeta) {
    if (tapeta === 'wlasna') {
        const id = odczyt(KLUCZ_TAPETY_ZDJECIE);
        if (!id) return null;
        // Bardzo stare tapety z Profilu mogą być zapisane wprost jako data: URL.
        const blob = id.startsWith('data:') ? async () => (await fetch(id)).blob() : () => MediaManager.getMediaBlob(id);
        return { id, url: () => MediaManager.getMediaUrl(id), blob };
    }
    const t = tapetaWbudowana(String(tapeta || '').replace(/^wbudowana:/, ''));
    if (!t) return null;
    return { id: t.plik, url: async () => t.plik, blob: async () => (await fetch(t.plik)).blob() };
}

let pokolenie = 0;

// Adres zdjęcia tapety tylko wtedy, gdy plik naprawdę jest (własne: w bazie mediów; wbudowane: z listy).
// Sam klucz w pamięci strony nie wystarczy: dane strony mogły zostać wyczyszczone.
export async function adresTapety(tapeta = getWyglad().tapeta) {
    const zdjecie = await zdjecieTapety(tapeta);
    if (!zdjecie) return null;
    try {
        return (await zdjecie.url()) || null;
    } catch (e) {
        loguj('Wygląd: odczyt tapety', e);
        return null;
    }
}

// Nakłada tło na stronę: klasy body, zmienne przyciemnienia i rozmycia, adres zdjęcia na warstwie #z-tlo.
// Nie dekoduje zdjęcia (granicę przyciemnienia liczy zapis tapety albo przeliczGranice na starcie).
export async function zastosujTlo(doc = document, wyglad = getWyglad()) {
    const nr = ++pokolenie;
    const tapeta = wyglad.tlo === 'tapeta';
    ustawKlasyTla(doc, tapeta);
    ustawZmienneTla(doc, wyglad);
    const warstwa = doc.querySelector('#z-tlo .z-tapeta');
    if (!tapeta) {
        if (warstwa) warstwa.style.backgroundImage = '';
        return wyglad;
    }
    const url = await adresTapety(wyglad.tapeta);
    if (nr !== pokolenie) return wyglad;
    if (!url) {
        // Zdjęcia nie ma w bazie (np. wyczyszczone dane strony): na razie poświata, ustawień nie ruszamy.
        ustawKlasyTla(doc, false);
        if (warstwa) warstwa.style.backgroundImage = '';
        return wyglad;
    }
    if (warstwa) warstwa.style.backgroundImage = `url("${url}")`;
    return wyglad;
}

// Granica przyciemnienia liczona od nowa ze zdjęcia: dla własnego zdjęcia zawsze (mogło się zmienić,
// np. w klasycznym wyglądzie), dla wbudowanego tylko, gdy jej brak. Jedno dekodowanie zdjęcia.
export async function przeliczGranice() {
    const przed = getWyglad();
    if (!przed.tapeta) return przed;
    const wlasna = przed.tapeta === 'wlasna';
    if (!wlasna && odczyt(KLUCZE.przyciemnienieMin) !== null) return przed;
    const zdjecie = await zdjecieTapety(przed.tapeta);
    const blob = zdjecie ? await zdjecie.blob() : null;
    if (!blob) return przed;
    const { przyciemnienieMin } = await zmierzZdjecie(blob);
    // W międzyczasie zapisano albo usunięto tapetę: wynik dotyczy starego zdjęcia.
    const teraz = getWyglad();
    if (teraz.tapeta !== przed.tapeta || (wlasna && odczyt(KLUCZ_TAPETY_ZDJECIE) !== zdjecie.id)) return teraz;
    if (odczyt(KLUCZE.przyciemnienieMin) === String(przyciemnienieMin)) return teraz;
    zapiszTapeteModel(pamiec(), { tapeta: przed.tapeta, przyciemnienieMin });
    const po = getWyglad();
    ustawZmienneTla(document, po);
    oglos(po);
    return po;
}

// Praca w tle: gdy przeglądarka jest bezczynna (Safari bez requestIdleCallback: krótkie opóźnienie).
function wTle(fn) {
    if (typeof globalThis.requestIdleCallback === 'function') globalThis.requestIdleCallback(() => fn(), { timeout: 3000 });
    else setTimeout(fn, 1200);
}

let granicaZaplanowana = false;

// Start aplikacji: migracje, motyw, tło. Granica przyciemnienia tapety raz na start, w tle (nie przy nawigacji).
export function zastosujWyglad(doc = document) {
    const m = pamiec();
    migruj(m);
    const wyglad = getWyglad();
    zastosuj(doc, wyglad);
    zastosujTlo(doc, wyglad).catch((e) => loguj('Wygląd: tło', e));
    if (wyglad.tapeta && !granicaZaplanowana) {
        granicaZaplanowana = true;
        wTle(() => przeliczGranice().catch((e) => loguj('Wygląd: granica przyciemnienia', e)));
    }
    return wyglad;
}

function poZmianie() {
    const wyglad = getWyglad();
    zastosuj(document, wyglad);
    zastosujTlo(document, wyglad).catch((e) => loguj('Wygląd: tło', e));
    oglos(wyglad);
    return wyglad;
}

export function setMotyw(id) {
    if (!MOTYWY.some((m) => m.id === id)) return false;
    // Nieudany zapis (prywatne okno, pełna pamięć): motyw i tak działa do przeładowania.
    zapiszMotyw(pamiec(), id);
    const wyglad = { ...getWyglad(), motyw: id };
    zastosuj(document, wyglad);
    oglos(wyglad);
    return true;
}

// 'tapeta' tylko wtedy, gdy jest zdjęcie (własne albo wbudowane z listy).
export function ustawTlo(tlo) {
    if (tlo !== 'poswiata' && tlo !== 'tapeta') return false;
    if (tlo === 'tapeta' && !getWyglad().tapeta) return false;
    if (!zapiszTlo(pamiec(), tlo)) return false;
    poZmianie();
    // Tapeta bez policzonej granicy (np. własne zdjęcie po odznaczeniu wbudowanej): do pomiaru najmocniejsze
    // przyciemnienie (wygladModel), a pomiar od razu, w tle. Jedno dekodowanie, tylko po wyborze użytkownika.
    if (tlo === 'tapeta' && odczyt(KLUCZE.przyciemnienieMin) === null) {
        przeliczGranice().catch((e) => loguj('Wygląd: granica przyciemnienia', e));
    }
    return true;
}

// Stan kluczy tapety przed zapisem, żeby nieudany zapis niczego nie zmienił.
function migawka() {
    return { zdjecie: odczyt(KLUCZ_TAPETY_ZDJECIE), tapeta: odczyt(KLUCZE.tapeta), min: odczyt(KLUCZE.przyciemnienieMin), tlo: odczyt(KLUCZE.tlo) };
}

function przywroc(m, stan) {
    const ustaw = (k, v) => { try { if (v === null) m.removeItem(k); else m.setItem(k, v); } catch (e) { /* bez pamięci */ } };
    ustaw(KLUCZ_TAPETY_ZDJECIE, stan.zdjecie);
    ustaw(KLUCZE.tapeta, stan.tapeta);
    ustaw(KLUCZE.przyciemnienieMin, stan.min);
    ustaw(KLUCZE.tlo, stan.tlo);
}

async function poZapisieTapety() {
    const wyglad = getWyglad();
    zastosuj(document, wyglad);
    await zastosujTlo(document, wyglad);
    oglos(wyglad);
    return wyglad;
}

// Zapis tapety: zdjęcie własne (zmniejszone i zapisane w bazie mediów) albo wbudowane ('wbudowana:<id>').
// Błąd = wyjątek, a poprzednia tapeta zostaje bez zmian.
export async function zapiszTapete(blob, { zrodlo = 'wlasna' } = {}) {
    const wlasna = zrodlo === 'wlasna';
    if (!wlasna) {
        const m = /^wbudowana:(.+)$/.exec(String(zrodlo));
        if (!m || !tapetaWbudowana(m[1])) throw new Error('NIEZNANA_TAPETA');
    }
    const plik = wlasna ? await zmniejszZdjecie(blob) : blob;
    const { przyciemnienieMin } = await zmierzZdjecie(plik);
    const m = pamiec();
    const stan = migawka();
    let noweId = null;
    if (wlasna) {
        noweId = await MediaManager.saveMedia(plik);
        try {
            m.setItem(KLUCZ_TAPETY_ZDJECIE, noweId);
        } catch (e) {
            await MediaManager.deleteMedia(noweId).catch(() => {});
            throw new Error('ZAPIS');
        }
    }
    if (!zapiszTapeteModel(m, { tapeta: zrodlo, przyciemnienieMin }) || !zapiszTlo(m, 'tapeta')) {
        // Pamięć strony odmówiła zapisu: przywróć poprzedni stan i usuń nowy plik.
        przywroc(m, stan);
        if (noweId) await MediaManager.deleteMedia(noweId).catch(() => {});
        throw new Error('ZAPIS');
    }
    // Poprzednie własne zdjęcie usuwamy dopiero po udanym zapisie nowego. Wybór tapety wbudowanej
    // zostawia własne zdjęcie w bazie (R8), żeby dało się do niego wrócić bez ponownego wgrywania.
    if (noweId && stan.zdjecie && stan.zdjecie !== noweId) {
        await MediaManager.deleteMedia(stan.zdjecie).catch((e) => loguj('Wygląd: usuwanie starej tapety', e));
    }
    return poZapisieTapety();
}

// Wybór tapety, której plik już jest: 'wlasna' (zapisane własne zdjęcie, bez ponownego wgrywania)
// albo 'wbudowana:<id>'. Granica przyciemnienia liczy się ze zdjęcia. Błąd = wyjątek, stan bez zmian.
export async function wybierzTapete(zrodlo) {
    if (zrodlo !== 'wlasna') {
        const m = /^wbudowana:(.+)$/.exec(String(zrodlo));
        const t = m && tapetaWbudowana(m[1]);
        if (!t) throw new Error('NIEZNANA_TAPETA');
        const odp = await fetch(t.plik);
        if (!odp.ok) throw new Error('ZAPIS');
        return zapiszTapete(await odp.blob(), { zrodlo });
    }
    const zdjecie = await zdjecieTapety('wlasna');
    const blob = zdjecie ? await zdjecie.blob() : null;
    if (!blob) throw new Error('BRAK_ZDJECIA');
    const { przyciemnienieMin } = await zmierzZdjecie(blob);
    const m = pamiec();
    const stan = migawka();
    if (!zapiszTapeteModel(m, { tapeta: 'wlasna', przyciemnienieMin }) || !zapiszTlo(m, 'tapeta')) {
        przywroc(m, stan);
        throw new Error('ZAPIS');
    }
    return poZapisieTapety();
}

// Usuwa tapetę: wraca poświata.
// - Własne zdjęcie (albo brak wyboru): plik znika z bazy mediów, a z nim dawny klucz zdjęcia z Profilu,
//   żeby migracja nie przywróciła tapety po przeładowaniu.
// - Tapeta wbudowana: tylko odznaczenie. Zapisane własne zdjęcie zostaje (usuwa je usunZdjecie) i staje się
//   wyborem w zakładce „Własna tapeta”, więc migracja z Profilu nie włączy go samo. Granicę policzy start.
export async function usunTapete() {
    const przed = getWyglad();
    const id = odczyt(KLUCZ_TAPETY_ZDJECIE);
    const m = pamiec();
    if (przed.tapeta && przed.tapeta !== 'wlasna' && id) {
        usunTapeteModel(m);
        zapis(m, KLUCZE.tapeta, 'wlasna');
        zapiszTlo(m, 'poswiata');
        return poZapisieTapety();
    }
    if (id) await MediaManager.deleteMedia(id).catch((e) => loguj('Wygląd: usuwanie tapety', e));
    try { m.removeItem(KLUCZ_TAPETY_ZDJECIE); } catch (e) { /* bez pamięci */ }
    usunTapeteModel(m);
    return poZapisieTapety();
}

// Usuwa zapisane własne zdjęcie. Gdy to ono jest tapetą, działa jak usunTapete; przy tapecie wbudowanej
// zostaje wybrana tapeta wbudowana.
export async function usunZdjecie() {
    if (getWyglad().tapeta === 'wlasna') return usunTapete();
    const id = odczyt(KLUCZ_TAPETY_ZDJECIE);
    if (id) await MediaManager.deleteMedia(id).catch((e) => loguj('Wygląd: usuwanie zdjęcia', e));
    try { pamiec().removeItem(KLUCZ_TAPETY_ZDJECIE); } catch (e) { /* bez pamięci */ }
    return poZapisieTapety();
}

export function ustawPrzyciemnienie(n) {
    const wartosc = zapiszPrzyciemnienie(pamiec(), n);
    // Bez pamięci strony zapis się nie udaje, ale wartość działa do przeładowania.
    const wyglad = { ...getWyglad(), przyciemnienie: wartosc };
    ustawZmienneTla(document, wyglad);
    oglos(wyglad);
    return wartosc;
}

export function ustawRozmycie(id) {
    if (!Object.prototype.hasOwnProperty.call(ROZMYCIE, id)) return false;
    zapiszRozmycie(pamiec(), id);
    const wyglad = { ...getWyglad(), rozmycie: id };
    ustawZmienneTla(document, wyglad);
    oglos(wyglad);
    return true;
}

export const Wyglad = Object.assign(globalThis.Wyglad || {}, {
    setMotyw, getWyglad, zastosujTlo, ustawTlo, zapiszTapete, wybierzTapete, usunTapete, usunZdjecie, ustawPrzyciemnienie, ustawRozmycie,
    adresTapety, przeliczGranice
});
globalThis.Wyglad = Wyglad;
