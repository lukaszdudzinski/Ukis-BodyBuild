// wyglad: zar
// Karta „Twój trening” na Menu (spec 8.3): czysty moduł, bez DOM i bez bazy. Żadna funkcja nie zmienia argumentów.
// Plan dnia liczymy tak jak kalendarz (TrainingUI.renderCalendar): pierwszy wpis harmonogramu aktywny w dniu
// (isScheduleActive, decyzja 19) z daysOfWeek zawierającym getDay() (0 = niedziela), chyba że ten dzień
// ma wyjątek { status: 'skipped' }. Daty to tekst RRRR-MM-DD w czasie lokalnym.
// Treningi z DatabaseManager.getTrainings(): pola `date` (RRRR-MM-DD), `name`, `duration_seconds`.

import { isScheduleActive } from '../trainer/trainerPlanImport.js';
import { addDays, mondayOf, parseDate } from '../trainer/trainerPlan.js';

const DNI = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
const MIESIACE = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];

export const BEZ_PLANU = { tytul: 'Wolne od planu', opis: 'Zacznij pustą sesję albo wybierz szablon' };

const lista = (x) => (Array.isArray(x) ? x.filter((e) => e && typeof e === 'object') : []);

// „1 ćwiczenie”, „3 ćwiczenia”, „5 ćwiczeń”, „22 ćwiczenia”, „12 ćwiczeń”.
function cwiczenia(n) {
    if (n === 1) return '1 ćwiczenie';
    const j = n % 10;
    const d = n % 100;
    return `${n} ${j >= 2 && j <= 4 && (d < 12 || d > 14) ? 'ćwiczenia' : 'ćwiczeń'}`;
}

// Wpis harmonogramu na dany dzień albo null (dzień pominięty też daje null).
function planDnia(schedules, exceptions, iso) {
    const d = parseDate(iso);
    if (!d) return null;
    const dow = d.getDay();
    if (exceptions.some((e) => e.date === iso && e.status === 'skipped')) return null;
    return schedules.find((s) => isScheduleActive(s, iso) && Array.isArray(s.daysOfWeek) && s.daysOfWeek.includes(dow)) || null;
}

// Średni czas ostatnich 3 treningów o tej nazwie (z czasem > 0), zaokrąglony do 5 min; null przy mniej niż 2.
function sredniCzas(trainings, nazwa) {
    const zCzasem = trainings
        .filter((t) => t.name === nazwa && Number(t.duration_seconds) > 0 && typeof t.date === 'string')
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
        .slice(0, 3);
    if (zCzasem.length < 2) return null;
    const min = zCzasem.reduce((s, t) => s + Number(t.duration_seconds), 0) / zCzasem.length / 60;
    return Math.max(5, Math.round(min / 5) * 5);
}

export function menuTrening({ templates, schedules, exceptions, trainings, today } = {}) {
    const szablony = lista(templates);
    const harmonogram = lista(schedules);
    const wyjatki = lista(exceptions);
    const treningi = lista(trainings);

    // Tydzień pon.–niedz. z dniem dzisiejszym.
    const pon = mondayOf(today);
    const tydzien = pon ? Array.from({ length: 7 }, (_, i) => addDays(pon, i)) : [];
    const dniTygodnia = new Set(tydzien);
    const wykonane = new Set(treningi.filter((t) => dniTygodnia.has(t.date)).map((t) => t.date)).size;
    const zaplanowaneDni = tydzien.filter((iso) => planDnia(harmonogram, wyjatki, iso)).length;
    const zaplanowane = zaplanowaneDni > 0 ? zaplanowaneDni : null;

    // Starsze wpisy mają templateId jako tekst (C18), więc porównujemy tekstowo.
    const wpis = planDnia(harmonogram, wyjatki, today);
    const szablon = wpis ? szablony.find((t) => String(t.id) === String(wpis.templateId)) : null;
    if (!szablon) return { ...BEZ_PLANU, wykonane, zaplanowane, templateId: null };

    const nazwa = String(szablon.name ?? '');
    const czas = sredniCzas(treningi, nazwa);
    const n = Array.isArray(szablon.exercises) ? szablon.exercises.length : 0;
    return {
        tytul: nazwa,
        opis: czas ? `${cwiczenia(n)} · ok. ${czas} min` : cwiczenia(n),
        wykonane,
        zaplanowane,
        templateId: szablon.id,
    };
}

// „Czwartek, 26 listopada” dla daty RRRR-MM-DD (lokalnie); pusty tekst dla złej daty.
export function dataMenu(iso) {
    const d = parseDate(iso);
    if (!d) return '';
    return `${DNI[d.getDay()]}, ${d.getDate()} ${MIESIACE[d.getMonth()]}`;
}

// „Cześć, <nick>” albo „Cześć!” bez nicku.
export function pozdrowienie(nick) {
    const n = String(nick ?? '').trim();
    return n ? `Cześć, ${n}` : 'Cześć!';
}
