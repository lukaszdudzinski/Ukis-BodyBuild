// wyglad: zar
// Plan dnia z harmonogramu i wyjątków (rozstrzygnięcie R17, „Przełóż na jutro”). Czysty moduł, bez DOM i bez
// localStorage; żadna funkcja nie zmienia argumentów. Używają go kalendarz i karta dnia (TrainingUI.js)
// oraz karta „Twój trening” na Menu (menuTrening.js).
//
// Harmonogram (uki_workout_schedules): pierwszy wpis aktywny w dniu (isScheduleActive, decyzja 19) z daysOfWeek
// zawierającym getDay() (0 = niedziela). Wyjątki (uki_schedule_exceptions, klucz bez zmian):
//   { date, templateId, status: 'skipped' }                 — pominięty (jak dotąd);
//   { date, templateId, status: 'postponed' }               — przełożony na następny dzień;
//   { date, templateId, status: 'added', from: <data D> }   — jednorazowy plan przełożony z dnia D.
//   { date, templateId, status: 'skipped', from: <data D>, regular: true }
//                                                           — zwykły plan dnia zdjęty przez „Tylko przełożony” z dnia D.
// 'added', który zastąpił wcześniejszy wpis tego dnia i szablonu (np. pominięcie), niesie go w `poprzedni`;
// „Przywróć” dnia D oddaje ten wpis.
// Wpis 'skipped'/'postponed' bez `from` albo z `regular` zdejmuje zwykły plan dnia (bez względu na szablon).
// Wpis 'skipped'/'postponed' z `from` bez `regular` to dawny 'added' (pominięty albo przełożony dalej); „Przywróć”
// zrobi z niego znów 'added'. Wpis z `regular` „Przywróć” dnia D albo dnia D+1 po prostu usuwa. Na jedną datę i szablon (porównanie tekstowe, C18) jest najwyżej jeden wpis: nowszy zastępuje starszy.
// Daty to tekst RRRR-MM-DD w czasie lokalnym (parseDate/addDays z trainerPlan.js).

import { isScheduleActive } from '../trainer/trainerPlanImport.js';
import { addDays, parseDate } from '../trainer/trainerPlan.js';

export const POMINIETY = 'skipped';
export const PRZELOZONY = 'postponed';
export const DODANY = 'added';

const DNI = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
const MIESIACE = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];

const tenSam = (a, b) => String(a) === String(b);
const obiekty = (x) => (Array.isArray(x) ? x.filter((e) => e && typeof e === 'object') : []);
const odwolanie = (e) => e.status === POMINIETY || e.status === PRZELOZONY;
// Odwołanie zwykłego planu dnia (nie dawnego 'added').
const odwolanieZwyklego = (e) => odwolanie(e) && (!e.from || e.regular === true);

// Pierwszy wpis harmonogramu na ten dzień (bez wyjątków) albo null.
export function wpisHarmonogramu(schedules, iso) {
    const d = parseDate(iso);
    if (!d) return null;
    const dow = d.getDay();
    return obiekty(schedules).find((s) => isScheduleActive(s, iso) && Array.isArray(s.daysOfWeek) && s.daysOfWeek.includes(dow)) || null;
}

// Plany dnia: [{ templateId, from, zrodlo }]; najpierw zwykły plan, potem przełożone ('added') w kolejności zapisu.
// Ten sam szablon tylko raz.
export function planyDnia(schedules, exceptions, iso) {
    if (!parseDate(iso)) return [];
    const dnia = obiekty(exceptions).filter((e) => e.date === iso);
    const wynik = [];
    const wpis = wpisHarmonogramu(schedules, iso);
    if (wpis && !dnia.some(odwolanieZwyklego)) {
        wynik.push({ templateId: wpis.templateId, from: null, zrodlo: 'harmonogram' });
    }
    for (const e of dnia) {
        if (e.status !== DODANY || e.templateId == null) continue;
        if (wynik.some((p) => tenSam(p.templateId, e.templateId))) continue;
        wynik.push({ templateId: e.templateId, from: typeof e.from === 'string' ? e.from : null, zrodlo: 'przelozony' });
    }
    return wynik;
}

// 'zaplanowany' | 'przelozony' | 'pominiety' | null. Odwołanie zwykłego planu liczy się tylko wtedy, gdy harmonogram
// ma ten dzień (jak dotąd w kalendarzu); odwołanie dawnego 'added' (z `from`) zawsze.
export function stanDnia(schedules, exceptions, iso) {
    if (planyDnia(schedules, exceptions, iso).length > 0) return 'zaplanowany';
    const zwykly = !!wpisHarmonogramu(schedules, iso);
    const odwolane = obiekty(exceptions).filter((e) => e.date === iso && odwolanie(e) && (e.from || zwykly));
    if (odwolane.some((e) => e.status === PRZELOZONY)) return 'przelozony';
    if (odwolane.length > 0) return 'pominiety';
    return null;
}

// Nowa lista z wpisem dla (date, templateId): zastępuje starszy wpis w jego miejscu (i usuwa stare duplikaty),
// a gdy go nie było, dochodzi na końcu.
export function zapiszWyjatek(exceptions, wpis) {
    const czysty = { date: wpis.date, templateId: wpis.templateId, status: wpis.status };
    if (typeof wpis.from === 'string' && wpis.from) czysty.from = wpis.from;
    if (czysty.from && wpis.regular === true) czysty.regular = true;
    const p = wpis.poprzedni;
    if (p && typeof p === 'object' && typeof p.date === 'string' && typeof p.status === 'string') {
        const { poprzedni, ...bez } = p; // jeden poziom wstecz wystarcza (nowszy wpis i tak zastępuje starszy)
        czysty.poprzedni = bez;
    }
    const pasuje = (e) => e && e.date === czysty.date && tenSam(e.templateId, czysty.templateId);
    const lista = Array.isArray(exceptions) ? exceptions : [];
    let wstawiony = false;
    const wynik = [];
    for (const e of lista) {
        if (!pasuje(e)) { wynik.push(e); continue; }
        if (!wstawiony) { wynik.push(czysty); wstawiony = true; }
    }
    if (!wstawiony) wynik.push(czysty);
    return wynik;
}

const odwolaj = (lista, iso, plan, status) =>
    zapiszWyjatek(lista, { date: iso, templateId: plan.templateId, status, from: plan.from || undefined });

// „Pomiń dzień”: każdy plan dnia dostaje 'skipped' (dawny 'added' zachowuje `from`).
export function pominDzien(schedules, exceptions, iso) {
    return planyDnia(schedules, exceptions, iso).reduce((lista, p) => odwolaj(lista, iso, p, POMINIETY), obiekty(exceptions));
}

// Plany jutra, które zderzają się z przekładanymi: inne szablony, gdy choć jeden przekładany trening jutro dojdzie.
export function konfliktJutra(schedules, exceptions, iso) {
    const jutro = addDays(iso, 1);
    if (!jutro) return [];
    const dzis = planyDnia(schedules, exceptions, iso);
    const juz = planyDnia(schedules, exceptions, jutro);
    const dojda = dzis.filter((p) => !juz.some((q) => tenSam(q.templateId, p.templateId)));
    if (dojda.length === 0) return [];
    return juz.filter((q) => !dzis.some((p) => tenSam(p.templateId, q.templateId)));
}

// „Przełóż na jutro”: plany dnia D dostają 'postponed', a jutro 'added' z from: D (ten sam szablon jutro: bez 'added').
// tylkoPrzelozony: dotychczasowe inne plany jutra dostają 'skipped'.
export function przelozNaJutro(schedules, exceptions, iso, { tylkoPrzelozony = false } = {}) {
    const jutro = addDays(iso, 1);
    const dzis = planyDnia(schedules, exceptions, iso);
    if (!jutro || dzis.length === 0) return obiekty(exceptions);
    const juz = planyDnia(schedules, exceptions, jutro);
    const konflikt = konfliktJutra(schedules, exceptions, iso);
    let lista = obiekty(exceptions);
    for (const p of dzis) lista = odwolaj(lista, iso, p, PRZELOZONY);
    // Zwykły plan jutra dostaje from: D i regular, żeby „Przywróć” dnia D mógł go cofnąć; dawny 'added' zostaje sobą.
    if (tylkoPrzelozony) {
        for (const q of konflikt) {
            lista = q.zrodlo === 'harmonogram'
                ? zapiszWyjatek(lista, { date: jutro, templateId: q.templateId, status: POMINIETY, from: iso, regular: true })
                : odwolaj(lista, jutro, q, POMINIETY);
        }
    }
    for (const p of dzis) {
        if (juz.some((q) => tenSam(q.templateId, p.templateId))) continue;
        const stary = lista.find((e) => e.date === jutro && tenSam(e.templateId, p.templateId));
        lista = zapiszWyjatek(lista, { date: jutro, templateId: p.templateId, status: DODANY, from: iso, poprzedni: stary });
    }
    return lista;
}

// Wyjątki usuniętych szablonów (usunięcie szablonu, „Zastąp” przy wczytaniu planu) znikają, żeby kalendarz
// nie pokazywał planu bez szablonu.
export function bezSzablonow(exceptions, templateIds) {
    const ids = new Set((templateIds || []).map(String));
    return obiekty(exceptions).filter((e) => !ids.has(String(e.templateId)));
}

// Usuwa z dnia po `iso` wpisy szablonu przełożone z `iso`; przełożony dalej ciągnie za sobą kolejny dzień.
function usunPrzelozone(lista, iso, templateId) {
    const jutro = addDays(iso, 1);
    if (!jutro) return lista;
    let wynik = lista;
    for (const e of lista) {
        if (e.date !== jutro || e.from !== iso || !tenSam(e.templateId, templateId)) continue;
        wynik = wynik.filter((x) => x !== e);
        if (e.status === PRZELOZONY) wynik = usunPrzelozone(wynik, jutro, templateId);
        if (e.poprzedni) wynik = [...wynik, e.poprzedni];
    }
    return wynik;
}

// „Przywróć trening”: odwołania dnia znikają (dawny 'added' wraca jako 'added'), a treningi przełożone z tego dnia
// znikają z następnego (i dalszych, gdy przełożono je znowu).
export function przywrocDzien(exceptions, iso) {
    const lista = obiekty(exceptions);
    const przelozone = lista.filter((e) => e.date === iso && e.status === PRZELOZONY);
    let wynik = [];
    for (const e of lista) {
        if (e.date !== iso || !odwolanie(e)) { wynik.push(e); continue; }
        if (e.from && e.regular !== true) wynik.push({ date: e.date, templateId: e.templateId, status: DODANY, from: e.from });
    }
    for (const e of przelozone) wynik = usunPrzelozone(wynik, iso, e.templateId);
    // Zwykły plan następnego dnia zdjęty przez „Tylko przełożony” z tego dnia wraca.
    const jutro = addDays(iso, 1);
    return wynik.filter((e) => !(e.date === jutro && e.regular === true && e.from === iso));
}

// „Trening przełożony na jutro (czwartek 26 listopada)” dla daty jutra.
export function komunikatPrzelozenia(jutroIso) {
    const d = parseDate(jutroIso);
    const tekst = 'Trening przełożony na jutro';
    return d ? `${tekst} (${DNI[d.getDay()]} ${d.getDate()} ${MIESIACE[d.getMonth()]})` : tekst;
}
