// Cel kaloryczny diety: wyliczenie z pomiarów, ręczna zmiana i strażnik wiarygodności.
// Jedno miejsce dla wszystkich zapisów i odczytów celu (algorytm, ręczna zmiana, import kopii).

// Zapis: { kcal, source: 'auto' | 'manual', at, incident? }.
// 'auto' = wyliczony algorytmem, 'manual' = ustawiony ręcznie. `incident` = ostatnio zgłoszona błędna wartość
// (żeby komunikat i wpis w logu pojawiły się raz na zdarzenie, a nie przy każdym otwarciu Diety).
export const KCAL_GOAL_KEY = 'ukis.bodybuild.dieta.cel-kcal';

// Wiarygodny dzienny cel: 800–6000 kcal.
// 800 kcal to dolna granica diet bardzo niskokalorycznych stosowanych tylko pod opieką lekarza;
// 6000 kcal przekracza zapotrzebowanie nawet zawodników sportów siłowych w okresie masy.
// Nie porównujemy z wyliczonym TDEE (np. ±60%), bo bez płci i wieku wzór używa wartości przybliżonych,
// więc odchylenie od niego bywa uzasadnione; sama wyliczona wartość też przechodzi przez ten zakres.
export const KCAL_MIN = 800;
export const KCAL_MAX = 6000;
export const DEFAULT_KCAL = 2000;

export const SOURCE_LABELS = {
    auto: 'Cel wyliczony automatycznie',
    manual: 'Cel ustawiony ręcznie'
};

export function isPlausibleKcal(value) {
    return typeof value === 'number' && Number.isFinite(value) && value >= KCAL_MIN && value <= KCAL_MAX;
}

// Wpis użytkownika: „2200”, „2 200”. Ułamki i tekst → null.
export function parseKcalInput(text) {
    const s = String(text ?? '').replace(/[\s ]/g, '');
    if (!/^\d{1,6}$/.test(s)) return null;
    return Number(s);
}

// Pomiary z bazy: waga w kg, wzrost w cm. Wzrost wpisany w metrach (1.70) albo milimetrach (1700)
// przeliczamy na cm (normalizeHeightCm; używa go też formularz Pomiarów i analiza sylwetki).
// Wartości spoza zakresu pomijamy i bierzemy wcześniejszy poprawny pomiar.
const WEIGHT_RANGE = [25, 350];
const HEIGHT_RANGE = [100, 250];

export function normalizeHeightCm(h) {
    const n = Number(h);
    if (!Number.isFinite(n) || n <= 0) return null;
    if (n >= 1 && n <= 2.5) return Math.round(n * 1000) / 10; // bez błędu zaokrąglenia (1.65 × 100 = 164.999…)
    if (n >= 1000 && n <= 2500) return n / 10;
    return n >= HEIGHT_RANGE[0] && n <= HEIGHT_RANGE[1] ? n : null;
}

export function normalizeWeightKg(w) {
    const n = Number(w);
    return Number.isFinite(n) && n >= WEIGHT_RANGE[0] && n <= WEIGHT_RANGE[1] ? n : null;
}

// Płeć: `uki-bodybuild-gender` (pole „Płeć” w Pomiarach ciała), a gdy go brak — wybrana w Profilu
// sylwetka awatara (tylko jawny wybór, bez zgadywania z imienia). Wiek: rok urodzenia z Ustawień zapotrzebowania.
export const BIRTH_YEAR_KEY = 'ukis.bodybuild.rok-urodzenia';
const SEX_KEY = 'uki-bodybuild-gender';
const AVATAR_SEX_KEY = 'ukis.bodybuild.avatar-sylwetka';
const AGE_MIN = 14;
const AGE_MAX = 100;
export const DEFAULT_AGE = 30;

// Stała wzoru Mifflin-St Jeor: mężczyźni +5, kobiety −161, płeć nieznana: środek (−78).
const SEX_CONSTANT = { male: 5, female: -161 };
const UNKNOWN_SEX_CONSTANT = -78;

const safeGet = (storage, key) => {
    try {
        return storage.getItem(key);
    } catch (e) {
        return null;
    }
};

// Wiek z roku urodzenia (dokładność do roku). Poza 14–100 lat → null.
export function ageFromBirthYear(year, now = new Date()) {
    const s = String(year ?? '').trim();
    if (!/^\d{4}$/.test(s)) return null;
    const age = now.getFullYear() - Number(s);
    return age >= AGE_MIN && age <= AGE_MAX ? age : null;
}

export function readBodyProfile(storage = localStorage, now = new Date()) {
    const pick = (v) => (v === 'male' || v === 'female' ? v : null);
    const sex = pick(safeGet(storage, SEX_KEY)) || pick(safeGet(storage, AVATAR_SEX_KEY));
    const rawYear = safeGet(storage, BIRTH_YEAR_KEY);
    const age = ageFromBirthYear(rawYear, now);
    return { sex, age, birthYear: age === null ? null : Number(rawYear) };
}

// Rok urodzenia: poprawny zapisuje, pusty usuwa. Zwraca false dla błędnego (nic nie zmienia).
export function saveBirthYear(text, storage = localStorage, now = new Date()) {
    const s = String(text ?? '').trim();
    try {
        if (!s) {
            storage.removeItem(BIRTH_YEAR_KEY);
            return true;
        }
        if (ageFromBirthYear(s, now) === null) return false;
        storage.setItem(BIRTH_YEAR_KEY, s);
        return true;
    } catch (e) {
        return false;
    }
}

export const BIRTH_YEAR_ERROR = 'Wpisz rok urodzenia (np. 1990). Wiek musi być między 14 a 100 lat.';
export const NO_DATA_HINT = 'Dodaj pomiar (waga, wzrost), żeby wyliczyć cel.';

// Jednolinijkowa podpowiedź, gdy wyliczenie używa wartości przybliżonych ('' gdy płeć i wiek są znane).
export function profileHint({ sex, age }) {
    if (!sex && age === null) return 'Ustaw płeć w Pomiarach ciała i rok urodzenia, żeby cel był dokładniejszy.';
    if (!sex) return 'Ustaw płeć w Pomiarach ciała, żeby cel był dokładniejszy.';
    if (age === null) return 'Podaj rok urodzenia w Ustawieniach zapotrzebowania, żeby cel był dokładniejszy.';
    return '';
}

// Wzór Mifflin-St Jeor × aktywność ± cel. `measurements` od najnowszego.
//   mężczyźni: 10·kg + 6.25·cm − 5·wiek + 5;  kobiety: … − 161;  płeć nieznana: … − 78.
// Wiek nieznany → 30 lat. Zwraca null, gdy nie ma żadnej poprawnej wagi.
export function computeTdee(measurements, { activity = 1.55, goal = 'maintenance', sex = null, age = null } = {}) {
    const list = Array.isArray(measurements) ? measurements : [];
    let weight = null;
    let height = null;
    for (const m of list) {
        if (weight === null) weight = normalizeWeightKg(m && m.weight);
        if (height === null) height = normalizeHeightCm(m && m.height);
        if (weight !== null && height !== null) break;
    }
    if (weight === null) return null;
    if (height === null) height = 175;
    const years = Number.isFinite(age) && age >= AGE_MIN && age <= AGE_MAX ? age : DEFAULT_AGE;
    const sexConstant = SEX_CONSTANT[sex] ?? UNKNOWN_SEX_CONSTANT;
    const bmr = (10 * weight) + (6.25 * height) - (5 * years) + sexConstant;
    const multiplier = Number(activity);
    let tdee = bmr * (Number.isFinite(multiplier) && multiplier >= 1 && multiplier <= 2.5 ? multiplier : 1.55);
    if (goal === 'cut') tdee -= 500;
    if (goal === 'bulk') tdee += 300;
    return Math.round(tdee);
}

function readRaw(storage) {
    try {
        return storage.getItem(KCAL_GOAL_KEY);
    } catch (e) {
        return null;
    }
}

function writeRecord(record, storage) {
    try {
        storage.setItem(KCAL_GOAL_KEY, JSON.stringify(record));
    } catch (e) {
        // Brak miejsca albo zablokowany storage: cel i tak działa w tej sesji.
    }
}

// Odczyt zapisu bez ufania mu. `rejected` = zapisana wartość, której nie wolno użyć.
export function loadKcalGoal(storage = localStorage) {
    const raw = readRaw(storage);
    if (raw === null || raw === '') return { goal: null, rejected: null, incident: null };
    let rec = null;
    try {
        rec = JSON.parse(raw);
    } catch (e) {
        rec = null;
    }
    if (!rec || typeof rec !== 'object') {
        return { goal: null, rejected: { value: String(raw).slice(0, 20), source: 'zapis' }, incident: null };
    }
    const source = rec.source === 'manual' ? 'manual' : 'auto';
    const kcal = typeof rec.kcal === 'string' ? Number(rec.kcal) : rec.kcal;
    const incident = typeof rec.incident === 'string' ? rec.incident : null;
    if (!isPlausibleKcal(kcal)) {
        return { goal: null, rejected: { value: rec.kcal, source }, incident };
    }
    return { goal: { kcal: Math.round(kcal), source, at: rec.at || null }, rejected: null, incident };
}

// Zapis ręczny lub automatyczny. Wartość spoza zakresu nie trafia do pamięci (zwraca false).
export function saveKcalGoal(kcal, source, storage = localStorage) {
    if (!isPlausibleKcal(kcal)) return false;
    const prev = loadKcalGoal(storage);
    writeRecord({
        kcal: Math.round(kcal),
        source: source === 'manual' ? 'manual' : 'auto',
        at: new Date().toISOString(),
        ...(prev.incident ? { incident: prev.incident } : {})
    }, storage);
    return true;
}

// Powrót do wyliczonego celu. Gdy wyliczenie jest błędne, zostaje ostatni poprawny cel (już jako 'auto').
export function useComputedKcalGoal(computed, storage = localStorage) {
    if (saveKcalGoal(computed, 'auto', storage)) return computed;
    const { goal } = loadKcalGoal(storage);
    const kcal = goal ? goal.kcal : DEFAULT_KCAL;
    saveKcalGoal(kcal, 'auto', storage);
    return kcal;
}

const incidentKey = (inc) => `${inc.source}:${inc.value}`;

// Cel do pokazania. `computed` = wynik algorytmu (null, gdy brak pomiarów z wagą).
// Zwraca { kcal, source, suggested, incidents, noData } — `incidents` to nowe, jeszcze niezgłoszone błędne wartości,
// `noData` = nie ma z czego wyliczyć celu (wartość domyślna lub ostatni zapis, bez ikony AI).
// Ręczny cel zostaje, nawet gdy wyliczenie się zmieni; wyliczenie wraca jako `suggested`.
export function resolveKcalGoal(computed, storage = localStorage) {
    const found = [];
    const { goal: stored, rejected, incident: lastIncident } = loadKcalGoal(storage);
    if (rejected) found.push(rejected);

    const computedOk = isPlausibleKcal(computed);
    if (computed !== null && computed !== undefined && !computedOk) {
        found.push({ value: computed, source: 'auto' });
    }
    const suggested = computedOk ? computed : null;

    let kcal;
    let source;
    if (stored && stored.source === 'manual') {
        kcal = stored.kcal;
        source = 'manual';
    } else {
        // Wyliczony cel; gdy wyliczenie jest błędne — ostatni poprawny zapis albo wartość domyślna.
        kcal = suggested ?? (stored ? stored.kcal : DEFAULT_KCAL);
        source = 'auto';
    }

    const incidents = found.filter(inc => incidentKey(inc) !== lastIncident);
    const newIncident = incidents.length ? incidentKey(incidents[incidents.length - 1]) : lastIncident;

    const noData = computed === null || computed === undefined;
    // Bez pomiarów nie zapisujemy wartości domyślnej jako „wyliczonego” celu.
    const changed = rejected || newIncident !== lastIncident
        || (stored ? stored.kcal !== kcal || stored.source !== source : !noData);
    if (changed) {
        writeRecord({
            kcal, source,
            at: stored && stored.kcal === kcal && stored.source === source ? stored.at : new Date().toISOString(),
            ...(newIncident ? { incident: newIncident } : {})
        }, storage);
    }
    return { kcal, source, suggested: suggested ?? kcal, incidents, noData };
}

// Import kopii zapasowej: zapisuje tylko wiarygodny cel. Zwraca incydent albo null.
export function importKcalGoal(value, storage = localStorage) {
    let rec = value;
    if (typeof rec === 'string') {
        try { rec = JSON.parse(rec); } catch (e) { rec = null; }
    }
    if (!rec || typeof rec !== 'object') return { value: String(value).slice(0, 20), source: 'import' };
    const kcal = typeof rec.kcal === 'string' ? Number(rec.kcal) : rec.kcal;
    if (!saveKcalGoal(kcal, rec.source, storage)) {
        return { value: rec.kcal, source: `import (${rec.source === 'manual' ? 'manual' : 'auto'})` };
    }
    return null;
}

export const kcalIncidentMessage = (inc) =>
    `Cel kaloryczny wyglądał na błędny (${inc.value} kcal) i nie został zapisany. Ustaw go ponownie w Ustawieniach zapotrzebowania.`;

// Wpis w Serwis → Logi błędów + krótki komunikat (styl jak toast importu planu).
export function reportKcalIncident(inc) {
    const safe = (v) => String(v).replace(/[<>]/g, '').slice(0, 40);
    const details = `wartość: ${safe(inc.value)} kcal | źródło: ${safe(inc.source)} | data: ${new Date().toISOString()}`;
    try {
        if (typeof window !== 'undefined' && window.ukiLogError) window.ukiLogError('Odrzucony cel kaloryczny', details);
    } catch (e) { /* log nie może zatrzymać Diety */ }
    if (typeof document === 'undefined' || !document.body) return;
    const id = 'diet-kcal-toast';
    document.getElementById(id)?.remove();
    const toast = document.createElement('div');
    toast.id = id;
    toast.setAttribute('role', 'status');
    toast.textContent = kcalIncidentMessage({ value: safe(inc.value) });
    toast.style.cssText = 'position: fixed; left: 50%; transform: translateX(-50%); bottom: 96px; z-index: 10002; max-width: 90vw; '
        + 'background: rgba(20, 20, 20, 0.95); border: 1px solid rgba(255, 152, 0, 0.6); color: #fff; padding: 12px 16px; '
        + 'border-radius: 12px; font-weight: bold; box-shadow: 0 8px 24px rgba(0,0,0,0.5);';
    document.body.append(toast);
    setTimeout(() => toast.remove(), 8000);
}

// Ikony w stylu Lucide: „sparkles” (jak przycisk „Analizuj z AI”) i „hand”.
const ICON_PATHS = {
    auto: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
    manual: '<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>'
};

// Zawartość znacznika ikony źródła (span z role="img"); `el` dostaje też aria-label, title i data-source.
// `source` null = brak ikony (np. cel domyślny, gdy nie ma pomiarów).
export function setKcalSourceIcon(el, source, size = 14) {
    if (!el) return;
    if (source !== 'manual' && source !== 'auto') {
        delete el.dataset.source;
        el.removeAttribute('role');
        el.removeAttribute('aria-label');
        el.removeAttribute('title');
        el.innerHTML = '';
        return;
    }
    const s = source === 'manual' ? 'manual' : 'auto';
    el.dataset.source = s;
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', SOURCE_LABELS[s]);
    el.title = SOURCE_LABELS[s];
    el.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON_PATHS[s]}</svg>`;
}
