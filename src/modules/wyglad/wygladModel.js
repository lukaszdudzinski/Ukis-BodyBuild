// wyglad: zar
// Model wyglądu (spec rozdz. 7 i 10): motyw, tło, tapeta, przyciemnienie, rozmycie i migracje.
// Czysty moduł bez DOM; pamięć ({ getItem, setItem, removeItem }) jest wstrzykiwana.

export const MOTYWY = [
    { id: 'zar', nazwa: 'Czerwony żar', opis: 'domyślny' },
    { id: 'granat', nazwa: 'Grafit i granat', opis: 'spokojny' },
    { id: 'pomarancz', nazwa: 'Czerń i pomarańcz', opis: 'energetyczny' }
];

const P = 'ukis.bodybuild.wyglad.';
export const KLUCZE = {
    motyw: P + 'motyw',
    tlo: P + 'tlo',
    tapeta: P + 'tapeta',
    przyciemnienie: P + 'przyciemnienie',
    przyciemnienieMin: P + 'przyciemnienie-min',
    rozmycie: P + 'rozmycie',
    zKlasycznego: P + 'z-klasycznego',
    komunikatKlasyczny: P + 'komunikat-klasyczny'
};
export const KLUCZ_TAPETY_ZDJECIE = 'uki-bodybuild-wallpaper';
export const KLUCZ_MOTYWU_STREFY = 'ukis.bodybuild.trener.motyw';

export const ROZMYCIE = { brak: 0, male: 4, srednie: 8, duze: 14 };
export const PRZYCIEMNIENIE = { min: 45, max: 90, domyslne: 55 };

const DOMYSLNY_MOTYW = 'zar';
const DOMYSLNE_ROZMYCIE = 'srednie';

function odczyt(storage, klucz) {
    try { return storage.getItem(klucz); } catch (e) { return null; }
}
function zapis(storage, klucz, wartosc) {
    try { storage.setItem(klucz, String(wartosc)); return true; } catch (e) { return false; }
}
function usun(storage, klucz) {
    try { storage.removeItem(klucz); } catch (e) { /* brak pamięci: nic do usunięcia */ }
}

function motywPoprawny(id) {
    return MOTYWY.some((m) => m.id === id);
}

function liczba(wartosc) {
    if (wartosc === null || wartosc === undefined || String(wartosc).trim() === '') return null;
    const n = Number(wartosc);
    return Number.isFinite(n) ? Math.round(n) : null;
}

function przytnij(n, min, max) {
    return Math.min(max, Math.max(min, n));
}

// Granica bez pomiaru: bez tapety najniższa, a przy tapecie najwyższa (np. jasne zdjęcie po migracji
// z Profilu jest czytelne od pierwszej klatki, zanim granica zostanie policzona w tle).
function czytajMin(storage, { maTapete = false } = {}) {
    const n = liczba(odczyt(storage, KLUCZE.przyciemnienieMin));
    if (n === null) return maTapete ? PRZYCIEMNIENIE.max : PRZYCIEMNIENIE.min;
    return przytnij(n, PRZYCIEMNIENIE.min, PRZYCIEMNIENIE.max);
}

// `tapety` (lista id tapet wbudowanych): gdy podana, „wbudowana:<id>” spoza listy jest niepoprawna.
function tapetaPoprawna(storage, tapety) {
    const t = odczyt(storage, KLUCZE.tapeta);
    if (t === 'wlasna') return !!odczyt(storage, KLUCZ_TAPETY_ZDJECIE);
    const m = typeof t === 'string' ? /^wbudowana:(.+)$/.exec(t) : null;
    if (!m) return false;
    return Array.isArray(tapety) ? tapety.includes(m[1]) : true;
}

export function czytajWyglad(storage, { tapety } = {}) {
    const motyw = odczyt(storage, KLUCZE.motyw);
    const rozmycie = odczyt(storage, KLUCZE.rozmycie);
    const maTapete = tapetaPoprawna(storage, tapety);
    const przyciemnienieMin = czytajMin(storage, { maTapete });
    const zapisane = liczba(odczyt(storage, KLUCZE.przyciemnienie));
    const podstawa = zapisane === null ? PRZYCIEMNIENIE.domyslne : zapisane;
    return {
        motyw: motywPoprawny(motyw) ? motyw : DOMYSLNY_MOTYW,
        tlo: odczyt(storage, KLUCZE.tlo) === 'tapeta' && maTapete ? 'tapeta' : 'poswiata',
        tapeta: maTapete ? odczyt(storage, KLUCZE.tapeta) : undefined,
        przyciemnienie: przytnij(podstawa, Math.max(PRZYCIEMNIENIE.min, przyciemnienieMin), PRZYCIEMNIENIE.max),
        przyciemnienieMin,
        rozmycie: Object.prototype.hasOwnProperty.call(ROZMYCIE, rozmycie) ? rozmycie : DOMYSLNE_ROZMYCIE
    };
}

export function zapiszMotyw(storage, id) {
    if (!motywPoprawny(id)) return false;
    return zapis(storage, KLUCZE.motyw, id);
}

export function zapiszTlo(storage, tlo) {
    if (tlo !== 'tapeta' && tlo !== 'poswiata') return false;
    return zapis(storage, KLUCZE.tlo, tlo);
}

export function zapiszTapete(storage, { tapeta, przyciemnienieMin }) {
    const ok = zapis(storage, KLUCZE.tapeta, tapeta);
    const min = przytnij(liczba(przyciemnienieMin) ?? PRZYCIEMNIENIE.min, PRZYCIEMNIENIE.min, PRZYCIEMNIENIE.max);
    return zapis(storage, KLUCZE.przyciemnienieMin, min) && ok;
}

export function usunTapete(storage) {
    usun(storage, KLUCZE.tapeta);
    usun(storage, KLUCZE.przyciemnienieMin);
    zapis(storage, KLUCZE.tlo, 'poswiata');
}

export function zapiszPrzyciemnienie(storage, n) {
    const wartosc = przytnij(liczba(n) ?? PRZYCIEMNIENIE.domyslne, Math.max(PRZYCIEMNIENIE.min, czytajMin(storage, { maTapete: tapetaPoprawna(storage) })), PRZYCIEMNIENIE.max);
    zapis(storage, KLUCZE.przyciemnienie, wartosc);
    return wartosc;
}

export function zapiszRozmycie(storage, id) {
    if (!Object.prototype.hasOwnProperty.call(ROZMYCIE, id)) return false;
    return zapis(storage, KLUCZE.rozmycie, id);
}

// Migracje jednorazowe i idempotentne; zwraca nazwy tych, które się wykonały.
export function migruj(storage) {
    const wykonane = [];
    if (odczyt(storage, KLUCZE.motyw) === null) {
        const strefa = odczyt(storage, KLUCZ_MOTYWU_STREFY);
        if (motywPoprawny(strefa) && zapiszMotyw(storage, strefa)) wykonane.push('motyw-strefy');
    }
    if (odczyt(storage, KLUCZ_TAPETY_ZDJECIE) && odczyt(storage, KLUCZE.tapeta) === null) {
        // przyciemnienie-min zostaje puste: granicę policzy ekran po wczytaniu zdjęcia
        zapis(storage, KLUCZE.tapeta, 'wlasna');
        zapis(storage, KLUCZE.tlo, 'tapeta');
        wykonane.push('tapeta-profilu');
    }
    return wykonane;
}
