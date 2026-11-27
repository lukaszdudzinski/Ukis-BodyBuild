// wyglad: zar
import { DatabaseManager } from '../db/DatabaseManager.js';
import { MediaManager } from '../db/MediaManager.js';
import { TrainingComponent } from '../../components/TrainingComponent.js';
import { ExerciseCatalog, ExerciseCategories, isCatalogExercise, canonicalExerciseName, exerciseSearchTexts } from '../../data/ExerciseCatalog.js';
import { recordCheck } from '../../data/exerciseTraits.js';
import { PlanImportUI } from './PlanImportUI.js';
import { addDays, parseDate, toIso } from '../trainer/trainerPlan.js';
import { weekIndexFor, applyPlanWeek } from '../trainer/trainerPlanImport.js';
import { ikona } from '../wyglad/ikony.js';
import { dataMenu, cwiczenia } from '../wyglad/menuTrening.js';
import { planyDnia, stanDnia, pominDzien, konfliktJutra, przelozNaJutro, przywrocDzien, zapiszWyjatek, komunikatPrzelozenia, bezSzablonow } from '../wyglad/harmonogram.js';

// Encje HTML dla tekstów wstawianych do szablonów HTML (innerHTML) w tym pliku: nazwy szablonów,
// planów i ćwiczeń mogą pochodzić z obcego pliku (Global Constraints wydania 2).
const esc = (s) => String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
// Argument funkcji w atrybucie onclick="…": literał JS (JSON.stringify), a potem encje HTML,
// bo przeglądarka najpierw dekoduje encje atrybutu, a dopiero potem czyta kod JS.
// Typ wartości zostaje (liczba zostaje liczbą), więc porównania === w harmonogramie działają.
const jsArg = (v) => esc(JSON.stringify(v ?? null));

// Harmonogram i wyjątki z localStorage (zawsze tablica).
const WYJATKI = 'uki_schedule_exceptions';
const czytajListe = (klucz) => {
    try {
        const v = JSON.parse(localStorage.getItem(klucz) || '[]');
        return Array.isArray(v) ? v : [];
    } catch (e) {
        return [];
    }
};
const czytajHarmonogram = () => czytajListe('uki_workout_schedules');
const czytajWyjatki = () => czytajListe(WYJATKI);
const zapiszWyjatki = (lista) => localStorage.setItem(WYJATKI, JSON.stringify(lista));

// Komunikat nowego wyglądu (z-toast), jak na ekranie Wygląd; zastępuje alert() w Treningu i Kreatorze.
// Zwykły: role=status, 4 s. Pilny (błąd zapisu, możliwa utrata danych): role=alert, 10 s.
// Tekst przez textContent, więc nazwy z danych nie wymagają esc().
let zegarKomunikatu = null;
function komunikat(tekst, { pilny = false } = {}) {
    let t = document.getElementById('trening-komunikat');
    if (!t) {
        t = document.createElement('div');
        t.id = 'trening-komunikat';
        t.className = 'z-toast';
        document.body.append(t);
    }
    t.setAttribute('role', pilny ? 'alert' : 'status');
    t.setAttribute('aria-live', pilny ? 'assertive' : 'polite');
    t.textContent = tekst;
    t.hidden = false;
    clearTimeout(zegarKomunikatu);
    zegarKomunikatu = setTimeout(() => { t.hidden = true; }, pilny ? 10000 : 4000);
}

// Okno z-dialog „Jutro masz już trening” (R17): 'oba' | 'tylko' | null (Anuluj, Escape, klik w tło).
function zapytajOKonflikt(nazwy, jutroIso) {
    return new Promise((resolve) => {
        const poprzedni = document.activeElement;
        const scrim = document.createElement('div');
        scrim.className = 'z-dialog-scrim';
        const okno = document.createElement('div');
        okno.className = 'z-dialog';
        okno.setAttribute('role', 'dialog');
        okno.setAttribute('aria-modal', 'true');
        okno.setAttribute('aria-labelledby', 'przeloz-tytul');
        okno.setAttribute('aria-describedby', 'przeloz-opis');
        const tytul = document.createElement('h2');
        tytul.id = 'przeloz-tytul';
        tytul.className = 'z-hd';
        tytul.textContent = 'Jutro masz już trening';
        const opis = document.createElement('p');
        opis.id = 'przeloz-opis';
        opis.className = 'z-sub';
        const dzien = (dataMenu(jutroIso) || jutroIso).toLowerCase();
        opis.textContent = `Na ${dzien} zaplanowano: ${nazwy.map((n) => `„${n}”`).join(', ')}. Który trening zostawić?`;
        const akcje = document.createElement('div');
        akcje.className = 'z-dialog-actions';
        const koniec = (wynik) => {
            document.removeEventListener('keydown', klawisz, true);
            scrim.remove();
            if (poprzedni && typeof poprzedni.focus === 'function' && document.contains(poprzedni)) poprzedni.focus();
            resolve(wynik);
        };
        const klawisz = (e) => { if (e.key === 'Escape') { e.preventDefault(); koniec(null); } };
        const przycisk = (tekst, klasa, wynik) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = klasa;
            b.textContent = tekst;
            b.addEventListener('click', () => koniec(wynik));
            akcje.append(b);
            return b;
        };
        const pierwszy = przycisk('Zostaw oba', 'z-ghost', 'oba');
        przycisk('Tylko przełożony', 'z-ghost', 'tylko');
        przycisk('Anuluj', 'z-ghost', null);
        okno.append(tytul, opis, akcje);
        scrim.append(okno);
        scrim.addEventListener('click', (e) => { if (e.target === scrim) koniec(null); });
        document.addEventListener('keydown', klawisz, true);
        document.body.append(scrim);
        pierwszy.focus();
    });
}

// Jedno przekładanie naraz (podwójne stuknięcie, okno konfliktu otwarte).
let przekladanie = false;

// Katalog ćwiczeń: ćwiczenie, któremu wpisujemy nazwę, wybrana partia i element, do którego wraca fokus.
const katalog = { cwiczenie: null, partia: null, powrot: null };
const WLASNE = 'Własne';
// Dawna nazwa z katalogu zapisana kiedyś jako własna nie dubluje katalogu (zapis zostaje bez zmian).
const wlasneCwiczenia = () => czytajListe('uki_custom_exercises').filter((n) => typeof n === 'string' && n.trim() && !isCatalogExercise(n));

// Okno szablonów: element, do którego wraca fokus po „Wróć”.
let szablonyPowrot = null;
const DNI_TYGODNIA = [
    { num: 1, name: 'Pn' }, { num: 2, name: 'Wt' }, { num: 3, name: 'Śr' }, { num: 4, name: 'Cz' },
    { num: 5, name: 'Pt' }, { num: 6, name: 'So' }, { num: 0, name: 'Nd' },
];
// „1 ćwiczenie”, „2 ćwiczenia”, „5 ćwiczeń”.
const cwiczeniaSlowo = (n) => {
    if (n === 1) return 'ćwiczenie';
    const d = n % 10;
    const s = n % 100;
    return d >= 2 && d <= 4 && (s < 12 || s > 14) ? 'ćwiczenia' : 'ćwiczeń';
};
// Żeton rodzaju szablonu (sesja zapisuje 'class', stare szablony mogą mieć 'classes').
const rodzajSzablonu = (typ) => (typ === 'cardio' ? 'Cardio' : typ === 'class' || typ === 'classes' ? 'Zajęcia' : 'Siłowy');
// „6 ćwiczeń · 18 serii · ok. 60 min” (serie z superserii liczone; czas tylko, gdy szablon go ma).
const metaSzablonu = (t) => {
    const lista = Array.isArray(t.exercises) ? t.exercises : [];
    let serie = 0;
    const policz = (ex) => { if (ex && Array.isArray(ex.sets)) serie += ex.sets.length; };
    lista.forEach((ex) => {
        if (ex && ex.type === 'superset' && Array.isArray(ex.exercises)) ex.exercises.forEach(policz);
        else policz(ex);
    });
    const czesci = [`${lista.length} ${cwiczeniaSlowo(lista.length)}`];
    if (serie > 0) czesci.push(`${serie} ${serieSlowo(serie)}`);
    if (t.duration_seconds > 0) czesci.push(`ok. ${Math.max(1, Math.round(t.duration_seconds / 60))} min`);
    return czesci.join(' · ');
};
// Okno szablonów usuwa też kod spoza tego pliku (PlanImportUI.refresh); wtedy klasa body schodzi sama,
// żeby aplikacja nie została ukryta.
let obserwatorSzablonow = null;
function pilnujOknaSzablonow() {
    if (obserwatorSzablonow || typeof MutationObserver === 'undefined') return;
    obserwatorSzablonow = new MutationObserver(() => {
        if (!document.getElementById('templates-modal-overlay')) document.body.classList.remove('z-szablony-otwarte');
    });
    obserwatorSzablonow.observe(document.body, { childList: true });
}

// „1 seria”, „2 serie”, „5 serii”, „0 serii”.
const serieSlowo = (n) => {
    if (n === 1) return 'seria';
    const d = n % 10;
    const s = n % 100;
    return d >= 2 && d <= 4 && (s < 12 || s > 14) ? 'serie' : 'serii';
};

let currentTraining = {
    date: null,
    startTime: null,
    timerInterval: null,
    exercises: [],
    name: '',
    type: 'strength',
    isPaused: false,
    pauseStartTime: null,
    totalPausedTime: 0
};

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let trainingDates = new Set(); // Stores dates in YYYY-MM-DD format
let allTrainingsCache = [];
// Data lokalna, nie UTC (rozstrzygnięcie C13).
let selectedDate = toIso(new Date());

export const TrainingUI = {
    init: () => {
        TrainingUI.injectCatalogModalHTML();

        const container = document.getElementById('training-dashboard');
        if (container) {
            container.innerHTML = TrainingComponent.render();
            
            // Add Datalist for Exercise Catalog if not exists
            if (!document.getElementById('exercise-catalog-list')) {
                const dataList = document.createElement('datalist');
                dataList.id = 'exercise-catalog-list';
                
                let customExercises = [];
                try { customExercises = JSON.parse(localStorage.getItem('uki_custom_exercises') || '[]'); } catch(e) {}
                // Ćwiczenie własne, które jest dziś w katalogu (np. dawna nazwa), nie dubluje listy; zapis zostaje bez zmian.
                const fullCatalog = [...ExerciseCatalog, ...customExercises.filter(n => !isCatalogExercise(n))];
                
                fullCatalog.forEach(exName => {
                    const option = document.createElement('option');
                    option.value = exName;
                    dataList.appendChild(option);
                });
                container.appendChild(dataList);
            }
        }

        const startNewBtn = document.getElementById('start-new-session-btn');
        if (startNewBtn) {
            startNewBtn.addEventListener('click', () => TrainingUI.startTraining(null));
        }

        const addExerciseBtn = document.getElementById('add-exercise-to-plan-btn');
        if (addExerciseBtn) {
            addExerciseBtn.addEventListener('click', TrainingUI.addExercise);
        }

        const addSupersetBtn = document.getElementById('add-superset-to-plan-btn');
        if (addSupersetBtn) {
            addSupersetBtn.addEventListener('click', TrainingUI.addSuperset);
        }

        const finishBtn = document.getElementById('finish-training-btn');
        if (finishBtn) {
            finishBtn.addEventListener('click', TrainingUI.finishTraining);
        }

        const saveTemplateBtn = document.getElementById('save-as-template-btn');
        if (saveTemplateBtn) {
            saveTemplateBtn.addEventListener('click', TrainingUI.saveAsTemplate);
        }

        const loadTemplateBtn = document.getElementById('load-template-session-btn');
        if (loadTemplateBtn) {
            loadTemplateBtn.addEventListener('click', TrainingUI.loadTemplatesDialog);
        }

        const cancelBtn = document.getElementById('cancel-training-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', TrainingUI.cancelTraining);
        }

        const pauseBtn = document.getElementById('pause-training-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', TrainingUI.togglePause);
        }

        const continueBtn = document.getElementById('continue-session-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => TrainingUI.continueTraining());
        }

        // Calendar listeners
        const prevMonthBtn = document.getElementById('cal-prev-month');
        if (prevMonthBtn) prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            TrainingUI.renderCalendar();
        });

        // Smart Assistant - Trainer Edward visibility check
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                if (currentTraining && currentTraining.startTime && !currentTraining.isPaused && document.getElementById('active-training-view').style.display !== 'none') {
                    // Update timer immediately
                    TrainingUI.updateTimer();
                    // Show bubble
                    if (window.ChatUI) {
                        window.ChatUI.showContextualBubble("Trenuj, a nie siedzisz w telefonie! 📱💪", true);
                    }
                }
            }
        });
        
        const nextMonthBtn = document.getElementById('cal-next-month');
        if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            TrainingUI.renderCalendar();
        });

        document.addEventListener('tabChanged', (e) => {
            // Pasek dolny chowa się tylko na karcie Treningu z widoczną sesją (body.z-sesja).
            TrainingUI.odswiezTrybSesji();
            if(e.detail && e.detail.tab === 'training-dashboard') {
                TrainingUI.dopasujNazwy();
                TrainingUI.loadHistoryAndCalendar();
            }
        });

        TrainingUI.loadHistoryAndCalendar();
        
        // Draft check
        setTimeout(() => {
            const draft = TrainingUI.loadDraft();
            if (draft && (!currentTraining || !currentTraining.timerInterval)) {
                if (confirm("Wykryto niezapisany trening (draft) z poprzedniej sesji. Czy chcesz go przywrócić? Jeśli klikniesz Anuluj, zostanie on usunięty.")) {
                    TrainingUI.restoreDraft(draft);
                } else {
                    TrainingUI.clearDraft();
                }
            }
        }, 500);
    },

    // Katalog ćwiczeń (spec 8.3, plansza TreningKatalog): pełny ekran nad sesją, bez paska dolnego (body.z-katalog-otwarty).
    // Dane katalogu i dopasowanie nazw bez zmian (ExerciseCatalog.js); okno tylko je pokazuje.
    injectCatalogModalHTML: () => {
        if (document.getElementById('catalog-modal-overlay')) return;
        const html = `
            <div id="catalog-modal-overlay" class="z-okno z-katalog" role="dialog" aria-modal="true" aria-labelledby="catalog-modal-title" hidden>
                <div class="z-okno-w">
                    <div class="z-head-center">
                        <button type="button" class="z-ic z-card" aria-label="Zamknij" onclick="window.TrainingUI.zamknijKatalog()">${ikona('x', 20)}</button>
                        <h2 id="catalog-modal-title" class="z-hd">Katalog ćwiczeń</h2>
                        <span class="z-head-spacer" aria-hidden="true"></span>
                    </div>
                    <div class="z-card z-katalog-szukaj">
                        ${ikona('search', 18)}
                        <label class="z-sr" for="catalog-search">Szukaj</label>
                        <input id="catalog-search" type="search" placeholder="Szukaj ćwiczenia…" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search">
                    </div>
                    <div class="z-katalog-partie" role="group" aria-label="Partie ciała"></div>
                    <div id="catalog-modal-content" class="z-card z-list z-katalog-lista"></div>
                    <div class="z-card z-katalog-wlasne">
                        <label class="z-lab" for="catalog-own-input">Lub dodaj własne ćwiczenie</label>
                        <div class="z-katalog-wlasne-rzad">
                            <input id="catalog-own-input" class="z-in" type="text" placeholder="Własna nazwa…" autocomplete="off" enterkeyhint="done">
                            <button type="button" id="catalog-own-add" class="z-btn">Dodaj</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        const okno = document.getElementById('catalog-modal-overlay');
        okno.querySelector('#catalog-search').addEventListener('input', (e) => TrainingUI.szukajWKatalogu(e.target.value));
        okno.querySelector('.z-katalog-partie').addEventListener('click', (e) => {
            const b = e.target.closest('[data-partia]');
            if (b) TrainingUI.selectCategory(b.dataset.partia);
        });
        okno.querySelector('#catalog-modal-content').addEventListener('click', (e) => {
            const b = e.target.closest('.z-katalog-cw');
            if (b) TrainingUI.wybierzZKatalogu(b.dataset.nazwa);
        });
        okno.querySelector('#catalog-own-add').addEventListener('click', () => TrainingUI.dodajWlasneZKatalogu());
        okno.querySelector('#catalog-own-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); TrainingUI.dodajWlasneZKatalogu(); }
        });
        okno.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { e.preventDefault(); TrainingUI.zamknijKatalog(); }
        });
    },

    toggleExerciseType: (exId) => {
        // Porównanie tekstowe (getExerciseById): id liczbowe ze starych danych i ćwiczenia w superserii też działają.
        const ex = TrainingUI.getExerciseById(exId);
        if (ex) {
            if (ex.type === 'strength') ex.type = 'cardio';
            else if (ex.type === 'cardio') ex.type = 'classes';
            else ex.type = 'strength';
            TrainingUI.renderCurrentExercises();
            TrainingUI.saveDraft();
        }
    },
    openExerciseSelector: (exId) => {
        TrainingUI.openCatalogModal(exId);
    },

    openCatalogModal: (exerciseId) => {
        TrainingUI.injectCatalogModalHTML();
        const okno = document.getElementById('catalog-modal-overlay');
        katalog.cwiczenie = exerciseId;
        katalog.powrot = document.activeElement;
        document.getElementById('catalog-search').value = '';
        document.getElementById('catalog-own-input').value = '';
        // Partie z ExerciseCategories (pełne nazwy) i „Własne”, gdy są własne ćwiczenia.
        const partie = Object.keys(ExerciseCategories);
        if (wlasneCwiczenia().length > 0) partie.push(WLASNE);
        okno.querySelector('.z-katalog-partie').innerHTML = partie
            .map((p) => `<button type="button" class="z-chip" data-partia="${esc(p)}" aria-pressed="false">${esc(p)}</button>`)
            .join('');
        TrainingUI.selectCategory(partie[0], exerciseId);
        okno.hidden = false;
        document.body.classList.add('z-katalog-otwarty');
        okno.scrollTop = 0;
        // Fokus na „Zamknij”, nie na wyszukiwarce: na telefonie nie wysuwa klawiatury.
        okno.querySelector('.z-head-center .z-ic').focus();
    },

    // Wybór partii: żeton z-on, lista ćwiczeń partii, wyszukiwarka pusta.
    selectCategory: (category, exerciseId) => {
        if (exerciseId !== undefined) katalog.cwiczenie = exerciseId;
        katalog.partia = category;
        const szukaj = document.getElementById('catalog-search');
        if (szukaj) szukaj.value = '';
        TrainingUI.pokazZetonyPartii(category);
        const nazwy = category === WLASNE ? wlasneCwiczenia() : (ExerciseCategories[category] || []);
        TrainingUI.pokazListeKatalogu(nazwy.map((nazwa) => ({ nazwa })), '');
    },

    pokazZetonyPartii: (aktywna) => {
        document.querySelectorAll('#catalog-modal-overlay .z-katalog-partie [data-partia]').forEach((b) => {
            const on = b.dataset.partia === aktywna;
            b.classList.toggle('z-on', on);
            b.setAttribute('aria-pressed', String(on));
        });
    },

    // Wyszukiwanie w całym katalogu (z własnymi ćwiczeniami); wiersz pokazuje partię. Puste pole wraca do partii.
    szukajWKatalogu: (tekst) => {
        const q = String(tekst || '').trim().toLocaleLowerCase('pl');
        if (!q) {
            TrainingUI.selectCategory(katalog.partia);
            return;
        }
        TrainingUI.pokazZetonyPartii(null);
        const wyniki = [];
        Object.entries(ExerciseCategories).forEach(([partia, nazwy]) => {
            // Szukanie także po angielskiej i dawnej nazwie; na liście tylko nazwa główna.
            nazwy.forEach((nazwa) => {
                if (exerciseSearchTexts(nazwa).some((t) => t.toLocaleLowerCase('pl').includes(q))) wyniki.push({ nazwa, partia });
            });
        });
        wlasneCwiczenia().forEach((nazwa) => { if (nazwa.toLocaleLowerCase('pl').includes(q)) wyniki.push({ nazwa, partia: WLASNE }); });
        TrainingUI.pokazListeKatalogu(wyniki, String(tekst).trim());
    },

    pokazListeKatalogu: (pozycje, szukane) => {
        const lista = document.getElementById('catalog-modal-content');
        if (!lista) return;
        if (pozycje.length === 0) {
            lista.innerHTML = `<p class="z-katalog-pusto">${szukane ? `Brak ćwiczeń dla „${esc(szukane)}”.` : 'Brak ćwiczeń w tej partii.'} Możesz dodać własne poniżej.</p>`;
            return;
        }
        lista.innerHTML = pozycje.map(({ nazwa, partia }) => `
            <button type="button" class="z-li z-katalog-cw" data-nazwa="${esc(nazwa)}">
                <span class="z-katalog-nazwa">${esc(nazwa)}</span>${partia ? `<span class="z-mut z-katalog-partia">${esc(partia)}</span>` : ''}
            </button>`).join('');
    },

    wybierzZKatalogu: (nazwa) => {
        TrainingUI.updateExerciseField(katalog.cwiczenie, 'name', nazwa);
        TrainingUI.zamknijKatalog({ wybrano: true });
        TrainingUI.renderCurrentExercises();
        TrainingUI.saveDraft();
    },

    // „Dodaj”: nazwa trafia do sesji i do prywatnego katalogu uki_custom_exercises (ten sam zapis co przy zapisie treningu:
    // lista nazw bez duplikatów i bez nazw z katalogu).
    dodajWlasneZKatalogu: () => {
        const pole = document.getElementById('catalog-own-input');
        const nazwa = pole ? pole.value.trim() : '';
        if (!nazwa) {
            if (pole) pole.focus();
            return;
        }
        // Nazwa z katalogu (także dawna) → nazwa główna, bez zapisu jako własne.
        if (isCatalogExercise(nazwa)) {
            TrainingUI.wybierzZKatalogu(canonicalExerciseName(nazwa));
            return;
        }
        // Zapis do pełnej listy (z ewentualnymi dawnymi nazwami), żeby niczego z niej nie zgubić.
        const wlasne = czytajListe('uki_custom_exercises');
        if (!wlasne.includes(nazwa)) {
            wlasne.push(nazwa);
            localStorage.setItem('uki_custom_exercises', JSON.stringify(wlasne));
            const podpowiedzi = document.getElementById('exercise-catalog-list');
            if (podpowiedzi) {
                const opcja = document.createElement('option');
                opcja.value = nazwa;
                podpowiedzi.appendChild(opcja);
            }
        }
        TrainingUI.wybierzZKatalogu(nazwa);
    },

    zamknijKatalog: ({ wybrano = false } = {}) => {
        const okno = document.getElementById('catalog-modal-overlay');
        if (okno) okno.hidden = true;
        document.body.classList.remove('z-katalog-otwarty');
        // Fokus wraca do przycisku „Katalog” (po wyborze karta rysuje się na nowo, więc szukamy go po id ćwiczenia).
        let cel = katalog.powrot;
        if (wybrano || !cel || !document.contains(cel) || cel === document.body) {
            const id = JSON.stringify(String(katalog.cwiczenie));
            cel = [...document.querySelectorAll('#current-exercises-list button[onclick*="openExerciseSelector"]')]
                .find((b) => (b.getAttribute('onclick') || '').includes(id)) || null;
        }
        if (cel && typeof cel.focus === 'function') cel.focus();
        katalog.powrot = null;
    },

    getTemplates: () => {
        try {
            const templates = localStorage.getItem('uki_workout_templates');
            return templates ? JSON.parse(templates) : [];
        } catch (e) {
            console.error("Error reading templates", e);
            return [];
        }
    },

    saveAsTemplate: () => {
        if (!currentTraining || !currentTraining.exercises || currentTraining.exercises.length === 0) {
            if (window.ChatUI) window.ChatUI.showContextualBubble("Hej, nie masz żadnych ćwiczeń żeby zapisać szablon! Dodaj coś najpierw. 😅");
            else komunikat("Dodaj ćwiczenia przed zapisaniem planu.");
            return;
        }

        const templateName = prompt("Podaj nazwę planu treningowego (np. 'Plan Masa: Push Wtorek'):");
        if (!templateName || templateName.trim() === '') return;

        // Clone current training and remove specific data
        const template = {
            id: Date.now(),
            name: templateName.trim(),
            type: currentTraining.type || 'strength',
            exercises: currentTraining.exercises.map(ex => {
                const newEx = { ...ex, cardioInterval: null };
                // Keep the structure but reset weights/reps? Or maybe keep them as baseline. Let's keep them as baseline.
                return newEx;
            })
        };

        const templates = TrainingUI.getTemplates();
        templates.push(template);
        localStorage.setItem('uki_workout_templates', JSON.stringify(templates));
        
        if (window.ChatUI) window.ChatUI.showContextualBubble(`Elegancko! Plan Treningowy "${esc(template.name)}" zapisany. 💪 Możesz go załadować przy kolejnym treningu.`);
        else komunikat(`Plan treningowy „${template.name}” zapisany.`);
    },

    
    exportTemplate: (id) => {
        const templates = TrainingUI.getTemplates();
        const t = templates.find(x => String(x.id) === String(id));
        if (!t) return;
        
        const blob = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", url);
        // Szablon bez nazwy (stare dane, import) też da się wyeksportować: nazwa pliku z „szablon”.
        const nazwa = String(t.name ?? '').trim() || 'szablon';
        dlAnchorElem.setAttribute("download", "UkiPlan_" + nazwa.replace(/\s+/g, '_') + ".json");
        document.body.appendChild(dlAnchorElem);
        dlAnchorElem.click();
        document.body.removeChild(dlAnchorElem);
        URL.revokeObjectURL(url);
    },

    // Decyzja 21: bez `accept` (Safari na iOS wyszarza pliki .bodybuild); o rodzaju pliku decyduje treść.
    // Plik planu od trenera i stary szablon JSON rozpoznaje PlanImportUI.handleText.
    importTemplate: () => {
        document.getElementById('plan-import-file')?.remove();
        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'plan-import-file';
        input.style.display = 'none';
        input.onchange = async e => {
            const file = e.target.files[0];
            input.remove();
            await PlanImportUI.handleFile(file);
        };
        document.body.appendChild(input);
        input.click();
    },

    // Szablony planów (spec 8.3, plansza TreningSzablony): pełny ekran nad kalendarzem (body.z-szablony-otwarte,
    // wygląd w trening-szablony.css). Okno powstaje i znika jako #templates-modal-overlay (PlanImportUI.refresh na tym stoi).
    loadTemplatesDialog: () => {
        // Decyzja 22: okno otwiera się także bez szablonów, żeby nowy klient mógł wczytać plan od trenera.
        const templates = TrainingUI.getTemplates();
        const todayIso = toIso(new Date());
        const schedules = czytajHarmonogram();
        const istniejace = document.getElementById('templates-modal-overlay');
        // Ponowne narysowanie (import, usunięcie) zostawia pierwotny punkt powrotu fokusu.
        if (!istniejace) szablonyPowrot = document.activeElement;

        const karty = templates.map((t) => {
            const mySchedule = schedules.find(s => s && String(s.templateId) === String(t.id)) || { daysOfWeek: [] };
            const src = t.source && t.source.kind === 'trainer-plan' ? t.source : null;
            // Wiersz źródła (R12c): przed startem „od DD.MM”, po końcu „zakończony”, w trakcie tydzień dla dziś.
            let sourceHtml = '';
            if (src) {
                const start = parseDate(src.startDate);
                let when;
                if (start && todayIso < src.startDate) {
                    when = `od ${String(start.getDate()).padStart(2, '0')}.${String(start.getMonth() + 1).padStart(2, '0')}`;
                } else if (src.endDate && todayIso > src.endDate) {
                    when = 'zakończony';
                } else {
                    when = `tydz. ${weekIndexFor(src.startDate, src.weeks, todayIso) + 1} z ${src.weeks}`;
                }
                sourceHtml = `<div class="template-source">${esc(`Od trenera${src.trainer ? ` ${src.trainer}` : ''} · ${when}`)}</div>`;
            }
            const dniHtml = DNI_TYGODNIA.map((d) => {
                const on = Array.isArray(mySchedule.daysOfWeek) && mySchedule.daysOfWeek.includes(d.num);
                return `<button type="button" class="z-szablon-dzien${on ? ' z-on' : ''}" data-dzien="${d.num}" aria-pressed="${on}" onclick="window.TrainingUI.toggleScheduleDay(${jsArg(t.id)}, ${d.num})">${d.name}</button>`;
            }).join('');
            return `
                <div class="z-card template-card" data-szablon="${esc(String(t.id))}">
                    <div class="z-szablon-gora">
                        <div class="z-szablon-txt">
                            <div class="z-szablon-nazwa">${esc(t.name)}</div>
                            <div class="z-mut z-szablon-meta">${esc(metaSzablonu(t))}</div>
                            ${sourceHtml}
                        </div>
                        <span class="z-pill">${rodzajSzablonu(t.type)}</span>
                    </div>
                    <div class="z-szablon-dni" role="group" aria-label="${esc(`Dni w kalendarzu: ${t.name || ''}`)}">${dniHtml}</div>
                    <div class="z-szablon-akcje">
                        <button type="button" class="z-btn z-szablon-wybierz" onclick="window.TrainingUI.startFromTemplate(${jsArg(t.id)})">Wybierz</button>
                        <button type="button" class="z-ghost" onclick="window.TrainingUI.edytujSzablon(${jsArg(t.id)})">Edytuj</button>
                        <button type="button" class="z-ghost z-szablon-ikona" aria-label="Eksportuj szablon" onclick="window.TrainingUI.exportTemplate(${jsArg(t.id)})">${ikona('upload', 18)}</button>
                        <button type="button" class="z-ghost z-danger z-szablon-ikona" aria-label="Usuń szablon" onclick="window.TrainingUI.deleteTemplate(${jsArg(t.id)})">${ikona('trash', 18)}</button>
                    </div>
                </div>`;
        }).join('');

        const pusto = templates.length === 0 ? `
                    <div class="z-card z-szablony-pusto">
                        <p>Nie masz jeszcze szablonów. Wczytaj plan od trenera albo zapisz trening jako szablon.</p>
                        <button type="button" class="z-btn" onclick="window.TrainingUI.importTemplate()">${ikona('download', 18)}Wczytaj plan z pliku</button>
                    </div>` : '';

        const html = `
            <div id="templates-modal-overlay" class="z-okno z-szablony" role="dialog" aria-modal="true" aria-labelledby="templates-modal-title">
                <div class="z-okno-w">
                    <div class="z-head-center">
                        <button type="button" class="z-ic z-card" aria-label="Wróć" onclick="window.TrainingUI.zamknijSzablony()">${ikona('chevron-left', 20)}</button>
                        <h2 id="templates-modal-title" class="z-hd">Szablony planów</h2>
                        <button type="button" class="z-ic z-card" aria-label="Wczytaj plan z pliku (np. od trenera)" onclick="window.TrainingUI.importTemplate()">${ikona('download', 20)}</button>
                    </div>
                    <p class="z-sub z-szablony-opis">Wybierz zapisany plan, aby rozpocząć sesję. Zaznacz dni, aby zaplanować.</p>
                    ${pusto}${karty}
                    <button type="button" class="z-ghost z-szablony-nowy" onclick="window.TrainingUI.nowySzablonWKreatorze()">+ Nowy szablon w kreatorze</button>
                </div>
            </div>
        `;

        if (istniejace) istniejace.remove();
        document.body.insertAdjacentHTML('beforeend', html);
        const okno = document.getElementById('templates-modal-overlay');
        okno.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { e.preventDefault(); TrainingUI.zamknijSzablony(); }
        });
        document.body.classList.add('z-szablony-otwarte');
        pilnujOknaSzablonow();
        if (!istniejace) okno.querySelector('.z-head-center .z-ic').focus();
    },

    // „Wróć” / Escape: okno znika, kalendarz wraca z paskiem dolnym, fokus na przycisk, który okno otworzył.
    zamknijSzablony: () => {
        const okno = document.getElementById('templates-modal-overlay');
        if (okno) okno.remove();
        // Klasę zdejmujemy od razu (nie czekamy na obserwatora): fokus nie trafi w ukrytą treść.
        document.body.classList.remove('z-szablony-otwarte');
        TrainingUI.renderCalendar();
        const cel = szablonyPowrot && document.contains(szablonyPowrot) && szablonyPowrot !== document.body
            ? szablonyPowrot
            : document.getElementById('load-template-session-btn');
        szablonyPowrot = null;
        if (cel && typeof cel.focus === 'function') cel.focus();
    },

    edytujSzablon: (id) => {
        document.getElementById('templates-modal-overlay')?.remove();
        document.body.classList.remove('z-szablony-otwarte');
        if (window.TemplateBuilderUI) window.TemplateBuilderUI.editTemplate(id);
    },

    // Wejście do kreatora (dawniej przycisk „Kreator szablonów” na karcie dnia; plansza TreningSzablony).
    nowySzablonWKreatorze: () => {
        document.getElementById('templates-modal-overlay')?.remove();
        document.body.classList.remove('z-szablony-otwarte');
        if (window.TemplateBuilderUI) window.TemplateBuilderUI.openBuilder();
    },

    toggleScheduleDay: (templateId, dayNum) => {
        let schedules = czytajHarmonogram();

        // Rozstrzygnięcie C18 (decyzja 19): wpis dostaje id szablonu w jego własnym typie (kalendarz porównuje ===),
        // a szablon planu od trenera także daty planu, żeby wyłączenie i ponowne włączenie dnia ich nie gubiło.
        const template = TrainingUI.getTemplates().find(t => String(t.id) === String(templateId));
        let sched = schedules.find(s => s && String(s.templateId) === String(templateId));
        if (!sched) {
            sched = { templateId: template ? template.id : templateId, daysOfWeek: [] };
            const src = template && template.source && template.source.kind === 'trainer-plan' ? template.source : null;
            if (src && src.startDate) sched.startDate = src.startDate;
            if (src && src.endDate) sched.endDate = src.endDate;
            schedules.push(sched);
        }
        if (!Array.isArray(sched.daysOfWeek)) sched.daysOfWeek = [];

        const idx = sched.daysOfWeek.indexOf(dayNum);
        if (idx > -1) {
            sched.daysOfWeek.splice(idx, 1);
        } else {
            sched.daysOfWeek.push(dayNum);
        }

        // Puste harmonogramy znikają.
        schedules = schedules.filter(s => s && Array.isArray(s.daysOfWeek) && s.daysOfWeek.length > 0);
        localStorage.setItem("uki_workout_schedules", JSON.stringify(schedules));

        // Okno zostaje na miejscu (fokus i przewinięcie): zmieniamy tylko przyciski dni tej karty.
        const karta = [...document.querySelectorAll('#templates-modal-overlay .template-card')]
            .find((k) => k.dataset.szablon === String(templateId));
        if (karta) {
            const wlaczone = new Set(sched.daysOfWeek);
            karta.querySelectorAll('.z-szablon-dzien').forEach((b) => {
                const on = wlaczone.has(Number(b.dataset.dzien));
                b.classList.toggle('z-on', on);
                b.setAttribute('aria-pressed', String(on));
            });
        }

        if (document.getElementById("training-calendar-grid") || document.getElementById("calendar-grid")) {
            TrainingUI.renderCalendar();
        }
    },

    // „Przywróć trening”: cofa pominięcie albo przełożenie dnia; trening przełożony z tego dnia znika z jutra (R17).
    restorePlannedTraining: (dateStr) => {
        zapiszWyjatki(przywrocDzien(czytajWyjatki(), dateStr));
        TrainingUI.renderCalendar();
        TrainingUI.handleDayClick(dateStr);
    },

    // „Pomiń dzień”: każdy plan dnia dostaje 'skipped'; z templateId tylko ten szablon. Bez duplikatów (R17).
    skipPlannedTraining: (dateStr, templateId) => {
        const harmonogram = czytajHarmonogram();
        const wyjatki = czytajWyjatki();
        let lista;
        if (templateId === undefined) {
            lista = pominDzien(harmonogram, wyjatki, dateStr);
        } else {
            const plan = planyDnia(harmonogram, wyjatki, dateStr).find((p) => String(p.templateId) === String(templateId));
            lista = zapiszWyjatek(wyjatki, { date: dateStr, templateId, status: 'skipped', from: plan ? plan.from : undefined });
        }
        zapiszWyjatki(lista);
        TrainingUI.renderCalendar();
    },

    // „Przełóż na jutro” (R17): plany dnia na jutro; inny trening jutro → okno z wyborem. Zwraca true po przełożeniu.
    postponePlannedTraining: async (dateStr) => {
        if (przekladanie) return false;
        przekladanie = true;
        try {
            const harmonogram = czytajHarmonogram();
            const wyjatki = czytajWyjatki();
            if (planyDnia(harmonogram, wyjatki, dateStr).length === 0) return false;
            const jutro = addDays(dateStr, 1);
            const konflikt = konfliktJutra(harmonogram, wyjatki, dateStr);
            let tylkoPrzelozony = false;
            if (konflikt.length > 0) {
                const szablony = czytajListe('uki_workout_templates');
                const nazwy = konflikt.map((p) => {
                    const t = szablony.find((x) => x && String(x.id) === String(p.templateId));
                    return t && t.name ? String(t.name) : 'Nieznany szablon';
                });
                const wybor = await zapytajOKonflikt(nazwy, jutro);
                if (!wybor) return false;
                tylkoPrzelozony = wybor === 'tylko';
            }
            // Dane czytane na nowo: okno mogło być otwarte długo.
            zapiszWyjatki(przelozNaJutro(czytajHarmonogram(), czytajWyjatki(), dateStr, { tylkoPrzelozony }));
            komunikat(komunikatPrzelozenia(jutro));
            return true;
        } finally {
            przekladanie = false;
        }
    },

    // Szablon planu od trenera po sesji: serie na kolejne tygodnie są w planie (applyPlanWeek), więc zapisujemy
    // tylko ćwiczenia dodane przez klienta (bez planu) i usunięte. Ćwiczenia z planu zostają z szablonu bez zmian
    // (plan, planInfo, serie), tak samo nazwa, typ i source szablonu.
    saveTrainerPlanChanges: (template, sessionExercises) => {
        const tplExercises = Array.isArray(template.exercises) ? template.exercises : [];
        const kept = new Set();
        const next = [];
        sessionExercises.forEach(ex => {
            const idx = Number.isInteger(ex.fromTemplateIndex) ? ex.fromTemplateIndex : -1;
            const original = idx > -1 ? tplExercises[idx] : null;
            if (original && original.plan) {
                kept.add(idx);
                next.push(original);
                return;
            }
            if (original) kept.add(idx);
            const copy = JSON.parse(JSON.stringify(ex));
            delete copy.fromTemplateIndex;
            delete copy.plan;
            delete copy.planInfo;
            next.push(copy);
        });
        const added = sessionExercises.some(ex => !Number.isInteger(ex.fromTemplateIndex));
        const removed = tplExercises.some((_, i) => !kept.has(i));
        if (!added && !removed) return;
        if (!confirm("Ten trening powstał z planu od trenera. Serie na kolejne tygodnie bierzemy z planu trenera, więc w szablonie zapiszemy tylko dodane lub usunięte ćwiczenia. Zapisać te zmiany?")) return;
        const templates = TrainingUI.getTemplates();
        const i = templates.findIndex(t => String(t.id) === String(template.id));
        if (i < 0) return;
        templates[i] = { ...templates[i], exercises: next };
        localStorage.setItem('uki_workout_templates', JSON.stringify(templates));
    },

    deleteTemplate: (id) => {
        if (confirm("Na pewno usunąć ten plan treningowy?")) {
            let templates = TrainingUI.getTemplates();
            templates = templates.filter(t => String(t.id) !== String(id));
            localStorage.setItem('uki_workout_templates', JSON.stringify(templates));
            // Dni usuniętego szablonu znikają też z kalendarza.
            let schedules = [];
            try { schedules = JSON.parse(localStorage.getItem('uki_workout_schedules') || '[]'); } catch(e) {}
            if (Array.isArray(schedules)) {
                localStorage.setItem('uki_workout_schedules', JSON.stringify(schedules.filter(s => String(s && s.templateId) !== String(id))));
            }
            // …i jego przełożone/pominięte dni (wyjątki harmonogramu).
            zapiszWyjatki(bezSzablonow(czytajWyjatki(), [id]));
            // Okno rysuje się na nowo (punkt powrotu fokusu zostaje); fokus na „Wróć”, bo usunięty przycisk zniknął.
            TrainingUI.loadTemplatesDialog();
            document.querySelector('#templates-modal-overlay .z-head-center .z-ic')?.focus();
        }
    },

    startFromTemplate: (templateId) => {
        const modal = document.getElementById('templates-modal-overlay');
        if (modal) modal.remove();

        const templates = TrainingUI.getTemplates();
        const template = templates.find(t => String(t.id) === String(templateId));
        if (!template) return;

        // Szablon planu od trenera: serie i wiersz planInfo z tygodnia mezocyklu wybranego dnia (decyzja 15).
        // selectedDate to data lokalna RRRR-MM-DD (rozstrzygnięcie C13). Zwykły szablon bez zmian.
        const isTrainerPlan = template.source && template.source.kind === 'trainer-plan';
        const sourceExercises = isTrainerPlan ? applyPlanWeek(template, selectedDate) : (template.exercises || []);

        // Initialize new session from template
        TrainingUI.pokazSesje(true);

        currentTraining = {
            date: selectedDate, // Use selected day instead of today!
            startTime: Date.now(),
            timerInterval: null,
            exercises: sourceExercises.map((ex, i) => {
                const newEx = JSON.parse(JSON.stringify(ex));
                newEx.id = Math.random().toString(36).substr(2, 9);
                // Pozycja ćwiczenia w szablonie planu: na końcu sesji odróżnia ćwiczenia z planu od dodanych.
                if (isTrainerPlan) newEx.fromTemplateIndex = i;
                if (newEx.type === 'superset' && Array.isArray(newEx.exercises)) {
                    newEx.exercises.forEach(nestedEx => {
                        nestedEx.id = Math.random().toString(36).substr(2, 9);
                        if (Array.isArray(nestedEx.sets)) nestedEx.sets.forEach(s => s.isCompleted = false);
                    });
                } else {
                    if (Array.isArray(newEx.sets)) newEx.sets.forEach(s => s.isCompleted = false);
                }
                return newEx;
            }),
            name: template.name,
            type: template.type || 'strength',
            isPaused: false,
            pauseStartTime: null,
            totalPausedTime: 0,
            templateId: templateId
        };

        const nameInput = document.getElementById('training-name-input');
        if (nameInput) nameInput.value = currentTraining.name || '';
        
        const typeSelect = document.getElementById('training-type-select');
        if (typeSelect) {
            typeSelect.value = currentTraining.type;
            if (typeof window.TrainingUI.handleTypeChange === 'function') {
                window.TrainingUI.handleTypeChange(currentTraining.type);
            }
        }

        const manualToggle = document.getElementById('manual-duration-toggle');
        if (manualToggle) manualToggle.checked = false;
        const manualInputs = document.getElementById('manual-duration-inputs');
        if (manualInputs) manualInputs.style.display = 'none';

        const calInput = document.getElementById('smartwatch-calories');
        const hrInput = document.getElementById('smartwatch-hr');
        if (calInput) calInput.value = '';
        if (hrInput) hrInput.value = '';

        TrainingUI.pokazCzasReczny();
        TrainingUI.ustawPrzyciskPauzy(false);

        TrainingUI.renderCurrentExercises();
        TrainingUI.renderTrainingPhotos();
        currentTraining.timerInterval = setInterval(TrainingUI.updateTimer, 1000);
        TrainingUI.saveDraft();
        
        if (window.ChatUI) {
            window.ChatUI.showContextualBubble("Ogień! 🔥 Plan Treningowy załadowany, zegar tyka – bierzemy się do roboty! 💪", true);
        }
    },

    saveDraft: () => {
        if (!currentTraining || !currentTraining.startTime) return;
        // Kopiujemy obiekt by nie zepsuć setIntervals
        const draftCopy = { ...currentTraining, timerInterval: null };
        if (draftCopy.exercises) {
            draftCopy.exercises = draftCopy.exercises.map(ex => ({ ...ex, cardioInterval: null }));
        }

        const nameInput = document.getElementById('training-name-input');
        if (nameInput) draftCopy.name = nameInput.value;

        const manualToggle = document.getElementById('manual-duration-toggle');
        const hoursInput = document.getElementById('manual-training-hours');
        const minutesInput = document.getElementById('manual-training-minutes');
        if (manualToggle && manualToggle.checked) {
            draftCopy.manualTime = {
                hours: hoursInput ? hoursInput.value : '',
                minutes: minutesInput ? minutesInput.value : ''
            };
        }

        const calInput = document.getElementById('smartwatch-calories');
        const hrInput = document.getElementById('smartwatch-hr');
        if ((calInput && calInput.value) || (hrInput && hrInput.value)) {
            draftCopy.smartwatch = {
                calories: calInput ? calInput.value : '',
                hr: hrInput ? hrInput.value : ''
            };
        }

        try {
            localStorage.setItem('uki_active_training_draft', JSON.stringify(draftCopy));
        } catch(e) {
            console.warn("Nie udało się zapisać draftu treningu", e);
        }
    },

    loadDraft: () => {
        try {
            const draft = localStorage.getItem('uki_active_training_draft');
            if (draft) return JSON.parse(draft);
        } catch(e) {}
        return null;
    },

    clearDraft: () => {
        localStorage.removeItem('uki_active_training_draft');
    },

    restoreDraft: (draft) => {
        TrainingUI.pokazSesje(true);
        
        currentTraining = draft;
        
        // HEAL: Naprawa uszkodzonych draftów ze starymi "undefined" ID
        if (currentTraining.exercises) {
            const seenIds = new Set();
            currentTraining.exercises.forEach(ex => {
                if (!ex.id || ex.id === 'undefined' || seenIds.has(ex.id)) {
                    ex.id = Math.random().toString(36).substr(2, 9);
                }
                seenIds.add(ex.id);
                if (ex.type === 'superset' && Array.isArray(ex.exercises)) {
                    ex.exercises.forEach(nestedEx => {
                        if (!nestedEx.id || nestedEx.id === 'undefined' || seenIds.has(nestedEx.id)) {
                            nestedEx.id = Math.random().toString(36).substr(2, 9);
                        }
                        seenIds.add(nestedEx.id);
                    });
                }
            });
        }
        
        const nameInput = document.getElementById('training-name-input');
        if (nameInput) nameInput.value = currentTraining.name || '';
        
        TrainingUI.pokazRodzaj(currentTraining.type || 'strength');
        TrainingUI.renderCurrentExercises();
        TrainingUI.renderTrainingPhotos();

        if (currentTraining.manualTime) {
            const manualToggle = document.getElementById('manual-duration-toggle');
            if (manualToggle && !manualToggle.checked) {
                manualToggle.checked = true;
                const manualContainer = document.getElementById('manual-duration-inputs');
                if (manualContainer) manualContainer.style.display = 'flex';
            }
            const hoursInput = document.getElementById('manual-training-hours');
            const minutesInput = document.getElementById('manual-training-minutes');
            if (hoursInput && currentTraining.manualTime.hours) hoursInput.value = currentTraining.manualTime.hours;
            if (minutesInput && currentTraining.manualTime.minutes) minutesInput.value = currentTraining.manualTime.minutes;
            TrainingUI.pokazCzasReczny();
        }

        if (currentTraining.smartwatch) {
            const calInput = document.getElementById('smartwatch-calories');
            const hrInput = document.getElementById('smartwatch-hr');
            if (calInput && currentTraining.smartwatch.calories) calInput.value = currentTraining.smartwatch.calories;
            if (hrInput && currentTraining.smartwatch.hr) hrInput.value = currentTraining.smartwatch.hr;
        }
        
        // Zawsze zakładamy że był zablokowany/zatrzymany przy przywracaniu, dajemy pause
        if (!currentTraining.isPaused) {
            currentTraining.isPaused = true;
            currentTraining.pauseStartTime = Date.now();
        }
        TrainingUI.ustawPrzyciskPauzy(currentTraining.isPaused);
        
        currentTraining.timerInterval = setInterval(TrainingUI.updateTimer, 1000);
    },

    loadHistoryAndCalendar: async () => {
        try {
            const records = await DatabaseManager.getTrainings();
            allTrainingsCache = records;
            trainingDates.clear();
            records.forEach(rec => {
                trainingDates.add(rec.date);
            });
            if (selectedDate) {
                TrainingUI.handleDayClick(selectedDate, true);
            } else {
                TrainingUI.renderCalendar();
            }
        } catch (err) {
            console.error("Error loading training history:", err);
        }
    },

    renderCalendar: () => {
        const grid = document.getElementById('training-calendar-grid');
        const monthYearLabel = document.getElementById('cal-month-year');
        if (!grid || !monthYearLabel) return;

        const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
        monthYearLabel.textContent = `${months[currentMonth]} ${currentYear}`;

        let html = '';
        const daysOfWeek = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
        daysOfWeek.forEach(day => {
            html += `<div class="calendar-day-header z-mut">${day}</div>`;
        });

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 0; i < adjustedFirstDay; i++) {
            html += `<div class="calendar-day empty" aria-hidden="true"></div>`;
        }

        // Data lokalna, nie UTC (rozstrzygnięcie C13).
        const todayDate = toIso(new Date());
        
        const schedules = czytajHarmonogram();
        const exceptions = czytajWyjatki();

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasTraining = trainingDates.has(dateStr);
            const isToday = dateStr === todayDate;
            const isSelected = dateStr === selectedDate;
            
            // Plan dnia z harmonogramu (decyzja 19) i wyjątków, także trening przełożony na ten dzień (R17).
            const stanPlanu = stanDnia(schedules, exceptions, dateStr);
            const isPlanned = (dateStr >= todayDate) && stanPlanu === 'zaplanowany';

            // Stan dnia (spec 8.3): wykonany > zaplanowany > pominięty / przełożony (ten sam wygląd);
            // „dziś” i „wybrany” dochodzą do każdego.
            let classes = 'calendar-day';
            let stan = '';
            if (hasTraining) { classes += ' has-training z-wykonany'; stan = 'wykonany'; }
            else if (isPlanned) { classes += ' z-zaplanowany'; stan = 'zaplanowany'; }
            else if (stanPlanu === 'przelozony') { classes += ' z-pominiety z-przelozony'; stan = 'przełożony'; }
            else if (stanPlanu === 'pominiety') { classes += ' z-pominiety'; stan = 'pominięty'; }
            if (isToday) classes += ' today z-dzis';
            if (isSelected) classes += ' selected z-wybrany';
            const opis = [`${day}`, isToday ? 'dziś' : '', stan].filter(Boolean).join(', ');

            html += `<button type="button" class="${classes}" aria-label="${opis}" aria-pressed="${isSelected}"${isToday ? ' aria-current="date"' : ''} onclick="window.TrainingUI.handleDayClick('${dateStr}')">${day}</button>`;
        }
        grid.innerHTML = html;
    },

    handleDayClick: (dateStr, preventScroll = false) => {
        selectedDate = dateStr;
        TrainingUI.renderCalendar(); // To update the 'selected' visual state
        
        const panel = document.getElementById('day-action-panel');
        const label = document.getElementById('selected-day-label');
        const pill = document.getElementById('day-status-pill');
        const sep = document.getElementById('day-action-sep');
        
        const emptyState = document.getElementById('day-action-empty-state');
        const existingState = document.getElementById('day-action-existing-state');
        const existingPreview = document.getElementById('existing-training-preview');
        const plannedState = document.getElementById('day-action-planned-state');
        const plannedPreview = document.getElementById('planned-training-preview');
        const postponeBtn = document.getElementById('postpone-planned-btn');
        const cancelPlannedBtn = document.getElementById('cancel-planned-btn');
        const historyList = document.getElementById('history-sessions-list');
        
        if (!panel) return;
        panel.style.display = 'block';
        // „Sobota, 22 listopada” (jak data na Menu).
        label.textContent = dataMenu(dateStr) || dateStr;
        const ustawStan = (tekst) => {
            if (!pill) return;
            pill.textContent = tekst || '';
            pill.hidden = !tekst;
        };
        ustawStan('');

        const existingTrainingsOnDay = allTrainingsCache.filter(t => t.date === dateStr);

        // Always show emptyState which now contains "start new session"
        if (emptyState) emptyState.style.display = 'block';
        
        if (plannedState) {
            plannedState.style.display = 'none'; // hide by default
            
            // Plany dnia z harmonogramu (decyzja 19, data lokalna C13) i wyjątków, także przełożone na ten dzień (R17).
            const schedules = czytajHarmonogram();
            const exceptions = czytajWyjatki();
            const plany = planyDnia(schedules, exceptions, dateStr);
            const stanPlanu = stanDnia(schedules, exceptions, dateStr);
            
            if (existingTrainingsOnDay.length === 0 && plany.length > 0) {
                plannedState.style.display = 'block';
                ustawStan('Zaplanowano');

                const templates = czytajListe('uki_workout_templates');
                // „Szablon „Góra ciała” · Trening siłowy · 6 ćwiczeń” dla każdego planu dnia;
                // trening przełożony ma dopisek, z którego dnia przyszedł.
                const blok = (plan) => {
                    // Starsze wpisy mają templateId jako tekst (C18), więc porównujemy tekstowo.
                    const template = templates.find(t => t && String(t.id) === String(plan.templateId));
                    const tName = template ? template.name : "Nieznany szablon";
                    const typeLabel = template ? (template.type === "cardio" ? "Cardio" : (template.type === "classes" ? "Zajęcia zorganizowane" : "Trening siłowy")) : "";
                    const liczba = template && Array.isArray(template.exercises) ? cwiczenia(template.exercises.length) : '';
                    const opis = [`Szablon „${esc(tName)}”`, typeLabel, liczba].filter(Boolean).join(' · ');
                    const skad = plan.from ? `<p class="z-mut z-dzien-skad">Przełożony z dnia: ${esc(dataMenu(plan.from) || plan.from)}</p>` : '';
                    return `
                        <p class="z-sub z-dzien-opis">${opis}</p>${skad}
                        <button type="button" onclick="window.TrainingUI.startFromTemplate(${jsArg(plan.templateId)})" class="z-btn z-dzien-start">${ikona('play', 18)}Rozpocznij plan</button>
                    `;
                };
                if (plannedPreview) plannedPreview.innerHTML = plany.map(blok).join('');
                if (postponeBtn) {
                    postponeBtn.style.display = '';
                    postponeBtn.onclick = async () => {
                        if (await window.TrainingUI.postponePlannedTraining(dateStr)) TrainingUI.handleDayClick(dateStr);
                    };
                }
                if (cancelPlannedBtn) {
                    cancelPlannedBtn.style.display = '';
                    cancelPlannedBtn.onclick = () => {
                        window.TrainingUI.skipPlannedTraining(dateStr);
                        TrainingUI.handleDayClick(dateStr);
                    };
                }
            } else if (existingTrainingsOnDay.length === 0 && (stanPlanu === 'pominiety' || stanPlanu === 'przelozony')) {
                // Odwołany albo przełożony trening
                const przelozony = stanPlanu === 'przelozony';
                plannedState.style.display = 'block';
                ustawStan(przelozony ? 'Przełożono' : 'Pominięto');
                const jutro = addDays(dateStr, 1);
                const tekst = przelozony
                    ? `Trening przełożono na ${esc((dataMenu(jutro) || jutro).toLowerCase())}.`
                    : 'Ten dzień został pominięty w harmonogramie.';
                if (plannedPreview) {
                    plannedPreview.innerHTML = `
                        <p class="z-sub z-dzien-opis">${tekst}</p>
                        <button type="button" onclick="window.TrainingUI.restorePlannedTraining('${dateStr}')" class="z-ghost z-dzien-start">Przywróć trening</button>
                    `;
                }
                if (postponeBtn) postponeBtn.style.display = 'none';
                if (cancelPlannedBtn) cancelPlannedBtn.style.display = 'none';
            }
        }

        if (existingTrainingsOnDay.length > 0) {
            // Day has trainings
            if (existingState) existingState.style.display = 'block';
            ustawStan('Wykonano');
            
            if (existingPreview) {
                let html = '';
                existingTrainingsOnDay.forEach(existingTraining => {
                    const liczba = cwiczenia(Array.isArray(existingTraining.exercises) ? existingTraining.exercises.length : 0);
                    if (existingTraining.source === 'zeszyt') {
                        html += `
                        <div class="z-dzien-trening">
                            <div class="z-dzien-nazwa">${ikona('notebook', 16)}Zeszyt</div>
                            <div class="z-mut">${liczba}</div>
                            <div class="z-dzien-rzad">
                                <button type="button" data-testid="open-in-notebook" onclick="window.NotebookUI.openDay('${existingTraining.date}')" class="z-ghost z-dzien-szeroki">Otwórz w Zeszycie</button>
                                <button type="button" onclick="window.TrainingUI.deleteTraining(${existingTraining.id})" class="z-ghost z-danger">${ikona('trash', 16)}Usuń</button>
                            </div>
                        </div>
                        `;
                        return;
                    }
                    const nazwa = existingTraining.name ? esc(existingTraining.name) : 'Trening';
                    html += `
                        <div class="z-dzien-trening">
                            <div class="z-dzien-nazwa">${nazwa}</div>
                            <div class="z-mut">Czas ${TrainingUI.formatTime(existingTraining.duration_seconds)} · ${liczba}</div>
                            <div class="z-dzien-rzad">
                                <button type="button" onclick="window.TrainingUI.viewTraining(${existingTraining.id})" class="z-ghost">${ikona('search', 16)}Podgląd</button>
                                <button type="button" onclick="window.TrainingUI.continueTraining(${existingTraining.id})" class="z-ghost">${ikona('play', 16)}Kontynuuj</button>
                                <button type="button" onclick="window.TrainingUI.deleteTraining(${existingTraining.id})" class="z-ghost z-danger">${ikona('trash', 16)}Usuń</button>
                            </div>
                        </div>
                    `;
                });
                existingPreview.innerHTML = html;
            }
        } else {
            // Day has no training
            if (existingState) existingState.style.display = 'none';

            if (historyList) {
                // Ostatnie sesje do skopiowania (rozwijane przyciskiem „Skopiuj”).
                let historyHtml = '<p class="z-mut z-dzien-lista-tytul">Ostatnie treningi: wybierz, aby skopiować do tego dnia</p>';
                // Kartki Zeszytu nie nadają się do kopiowania; indeks z pełnej listy zostaje dla startTraining/toggleHistoryPreview.
                const recentTrainings = allTrainingsCache
                    .map((rec, cacheIdx) => ({ rec, cacheIdx }))
                    .filter(({ rec }) => rec.source !== 'zeszyt')
                    .slice(0, 5); // Take last 5
                
                if (recentTrainings.length === 0) {
                    historyHtml += `<p class="z-mut z-dzien-pusto">Brak sesji w historii do skopiowania.</p>`;
                } else {
                    const serie = (sets) => {
                        if (!sets || sets.length === 0) return `<div class="z-mut">Brak zapisanych serii</div>`;
                        return `<ul class="z-dzien-serie">${sets.map((s, i) => `<li>Seria ${i + 1}: <strong class="z-hi">${esc(s.weight)} kg</strong> × <strong>${esc(s.reps)} powt.</strong></li>`).join('')}</ul>`;
                    };
                    const cwiczenie = (ex) => `<div class="z-dzien-cw"><strong>${esc(ex.name || 'Brak nazwy')}</strong> <span class="z-mut">(${ex.type === 'cardio' ? 'Cardio' : 'Siłowe'})</span>${serie(ex.sets)}</div>`;
                    recentTrainings.forEach(({ rec, cacheIdx: idx }) => {
                        const nazwa = rec.name ? `${esc(rec.name)} <span class="z-mut">(${esc(rec.date)})</span>` : esc(rec.date);
                        
                        let exercisesPreview = '';
                        if (rec.exercises && rec.exercises.length > 0) {
                            rec.exercises.forEach(ex => {
                                if (ex.type === 'superset' && ex.exercises && ex.exercises.length > 0) {
                                    exercisesPreview += `<div class="z-dzien-superseria"><div class="z-mut z-hi">Superseria</div>${ex.exercises.map(cwiczenie).join('')}</div>`;
                                } else {
                                    exercisesPreview += cwiczenie(ex);
                                }
                            });
                        } else {
                            exercisesPreview = `<p class="z-mut">Brak zapisanych ćwiczeń.</p>`;
                        }

                        historyHtml += `
                            <div class="history-item-container z-dzien-kopia">
                                <button type="button" class="z-dzien-kopia-gora" aria-expanded="false" aria-controls="preview-content-${idx}" onclick="window.TrainingUI.toggleHistoryPreview(${idx})">
                                    <span class="z-dzien-kopia-txt">
                                        <span class="z-dzien-nazwa">${nazwa}</span>
                                        <span class="z-mut">Czas ${TrainingUI.formatTime(rec.duration_seconds)} · ${cwiczenia(rec.exercises.length)}</span>
                                    </span>
                                    <span id="preview-icon-${idx}" class="z-dzien-chevron">${ikona('chevron-down', 18)}</span>
                                </button>
                                <div id="preview-content-${idx}" class="z-dzien-podglad" style="display: none;">
                                    <p class="z-mut">Podgląd ćwiczeń</p>
                                    ${exercisesPreview}
                                    <button type="button" onclick="window.TrainingUI.startTraining(${idx})" class="z-btn z-dzien-start">${ikona('copy', 16)}Skopiuj do tego dnia</button>
                                </div>
                            </div>
                        `;
                    });
                }
                historyList.innerHTML = historyHtml;
            }
        }

        // Separator nad akcjami tylko pod planem albo treningami dnia.
        if (sep) {
            const nadAkcjami = (plannedState && plannedState.style.display !== 'none') || existingTrainingsOnDay.length > 0;
            sep.style.display = nadAkcjami ? '' : 'none';
        }
        
        // Scroll to panel
        if (!preventScroll) {
            panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },

    deleteTraining: async (id) => {
        if (confirm("Czy na pewno chcesz bezpowrotnie usunąć ten trening?")) {
            await DatabaseManager.deleteTraining(id);
            if (typeof TrainingUI.loadHistoryAndCalendar === 'function') {
                await TrainingUI.loadHistoryAndCalendar();
            }
        }
    },

    toggleHistoryPreview: (idx) => {
        const content = document.getElementById(`preview-content-${idx}`);
        const icon = document.getElementById(`preview-icon-${idx}`);
        if (!content || !icon) return;
        const otworz = content.style.display === 'none';
        content.style.display = otworz ? 'block' : 'none';
        icon.classList.toggle('z-otwarte', otworz);
        const przycisk = icon.closest('button');
        if (przycisk) przycisk.setAttribute('aria-expanded', String(otworz));
    },

    // „Skopiuj” na karcie dnia rozwija i zwija listę ostatnich sesji (#history-sessions-list).
    toggleCopyList: () => {
        const lista = document.getElementById('history-sessions-list');
        const przycisk = document.getElementById('copy-session-btn');
        if (!lista) return;
        lista.hidden = !lista.hidden;
        if (przycisk) przycisk.setAttribute('aria-expanded', String(!lista.hidden));
    },

    // ---------- Sesja w nowym wyglądzie (spec 8.3, B2): tylko widok, stan sesji bez zmian ----------

    // Widok sesji albo kalendarza na karcie Treningu.
    pokazSesje: (widoczna) => {
        const cal = document.getElementById('training-calendar-view');
        const act = document.getElementById('active-training-view');
        if (cal) cal.style.display = widoczna ? 'none' : 'block';
        if (act) act.style.display = widoczna ? 'block' : 'none';
        if (widoczna) TrainingUI.zamknijWiecej();
        TrainingUI.odswiezTrybSesji();
        if (widoczna) TrainingUI.dopasujNazwy();
    },

    // body.z-sesja (bez paska dolnego, trening-sesja.css): sesja widoczna na aktywnej karcie Treningu.
    // Po „Wróć” albo przejściu na inny ekran pasek wraca, a sesja trwa w tle.
    odswiezTrybSesji: () => {
        const act = document.getElementById('active-training-view');
        const tab = document.getElementById('training-dashboard');
        const on = !!(act && tab && act.style.display !== 'none' && tab.classList.contains('active-tab'));
        document.body.classList.toggle('z-sesja', on);
    },

    // „Wróć”: Menu; sesja (czas, szkic) trwa dalej i wraca po wejściu w Trening.
    wrocZSesji: () => {
        if (typeof window.switchTab === 'function') window.switchTab('welcome-screen');
        else TrainingUI.odswiezTrybSesji();
    },

    // „Wpisz czas ręcznie”: przełącza #manual-duration-toggle (z niego czytają zapis i szkic).
    przelaczCzasReczny: () => {
        const toggle = document.getElementById('manual-duration-toggle');
        if (!toggle) return;
        toggle.checked = !toggle.checked;
        TrainingUI.pokazCzasReczny();
    },

    pokazCzasReczny: () => {
        const toggle = document.getElementById('manual-duration-toggle');
        const pola = document.getElementById('manual-duration-inputs');
        const btn = document.getElementById('manual-duration-btn');
        const on = !!(toggle && toggle.checked);
        if (pola) pola.style.display = on ? 'flex' : 'none';
        if (btn) btn.setAttribute('aria-pressed', String(on));
    },

    ustawPrzyciskPauzy: (wstrzymana) => {
        const btn = document.getElementById('pause-training-btn');
        if (!btn) return;
        btn.innerHTML = wstrzymana ? `${ikona('play', 18)}Wznów` : `${ikona('pause', 18)}Pauza`;
        btn.setAttribute('aria-pressed', String(!!wstrzymana));
        btn.classList.toggle('z-wznow', !!wstrzymana);
    },

    // „Więcej” w pasku akcji: zdjęcia, smartwatch, zapis jako plan, Edward (#bs-action-list).
    przelaczWiecej: () => {
        const list = document.getElementById('bs-action-list');
        if (!list) return;
        list.hidden = !list.hidden;
        const btn = document.getElementById('bs-more-btn');
        if (btn) btn.setAttribute('aria-expanded', String(!list.hidden));
    },

    // Komunikat z-toast dla innych ekranów Treningu (Kreator): window.TrainingUI.komunikat(tekst, { pilny }).
    komunikat,

    // „Zapytaj Edwarda” z „Więcej” (R18): ten sam przycisk czatu co poza sesją (sprawdzenie PRO, otwarcie okna).
    otworzEdwarda: () => {
        TrainingUI.zamknijWiecej();
        const przycisk = document.getElementById('edward-chat-toggle');
        if (przycisk) przycisk.click();
    },

    zamknijWiecej: () => {
        const list = document.getElementById('bs-action-list');
        if (list) list.hidden = true;
        const btn = document.getElementById('bs-more-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    },

    przelaczSmartwatch: () => {
        const pola = document.getElementById('smartwatch-fields');
        if (!pola) return;
        pola.hidden = !pola.hidden;
        const btn = document.getElementById('bs-smartwatch-btn');
        if (btn) btn.setAttribute('aria-expanded', String(!pola.hidden));
    },

    // Najlepszy szacowany 1RM ćwiczenia (ten sam wzór co rekord w addSet): historia + bieżąca sesja.
    rekord1RM: (ex) => {
        const nazwa = (ex && ex.name ? ex.name : '').toLowerCase().trim();
        if (!nazwa) return 0;
        let max = 0;
        const zSerii = (sets) => (Array.isArray(sets) ? sets : []).forEach((s) => {
            const v = (parseFloat(s.weight) || 0) * (1 + ((parseFloat(s.reps) || 0) / 30));
            if (v > max) max = v;
        });
        const sprawdz = (e) => {
            if (e && e.name && e.name.toLowerCase().trim() === nazwa) zSerii(e.sets);
        };
        (allTrainingsCache || []).forEach((t) => (Array.isArray(t.exercises) ? t.exercises : []).forEach((e) => {
            if (e && e.type === 'superset' && Array.isArray(e.exercises)) e.exercises.forEach(sprawdz);
            else sprawdz(e);
        }));
        zSerii(ex.sets);
        return Math.round(max);
    },

    formatTime: (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    },

    updateTimer: () => {
        if (!currentTraining || currentTraining.isPaused) return;

        const now = Date.now();
        const duration = Math.floor((now - currentTraining.startTime - currentTraining.totalPausedTime) / 1000);
        
        // Coach Edward AI co 15 min (900s)
        const edwardInterval = 900;
        if (duration > 0 && Math.floor(duration / edwardInterval) > (currentTraining.lastEdwardIndex || 0)) {
            currentTraining.lastEdwardIndex = Math.floor(duration / edwardInterval);
            
            const messages = [
                "Jak Ci idzie? Ćwicz, a nie siedzisz w telefonie!",
                "Jedziesz! Pamiętaj o oddechu!",
                "Nie odpuszczaj, to buduje charakter!",
                "Czas na kolejną serię. Pokaż na co Cię stać!"
            ];
            const msgText = messages[Math.floor(Math.random() * messages.length)];

            if (window.ChatUI) {
                window.ChatUI.showContextualBubble(`⏱ ${msgText}`, true);
            }

            try {
                if ('speechSynthesis' in window) {
                    const msg = new SpeechSynthesisUtterance(msgText);
                    msg.lang = 'pl-PL';
                    const voices = window.speechSynthesis.getVoices();
                    const maleVoice = voices.find(v => v.lang.includes('pl') && v.name.toLowerCase().includes('male'));
                    if (maleVoice) msg.voice = maleVoice;
                    window.speechSynthesis.speak(msg);
                }
            } catch(e) {}
        }

        document.getElementById('training-timer').innerText = TrainingUI.formatTime(duration);
    },

    togglePause: () => {
        const pauseBtn = document.getElementById('pause-training-btn');
        if (!pauseBtn) return;

        if (currentTraining.isPaused) {
            // Wznów
            currentTraining.isPaused = false;
            currentTraining.totalPausedTime += (Date.now() - currentTraining.pauseStartTime);
            currentTraining.pauseStartTime = null;
        } else {
            // Zapauzuj
            currentTraining.isPaused = true;
            currentTraining.pauseStartTime = Date.now();
        }
        TrainingUI.ustawPrzyciskPauzy(currentTraining.isPaused);
    },

    cancelTraining: () => {
        if (confirm("Czy na pewno chcesz anulować i porzucić ten trening? Ta akcja jest nieodwracalna i wyczyści cały brudnopis!")) {
            if (currentTraining && currentTraining.timerInterval) {
                clearInterval(currentTraining.timerInterval);
            }
            if (currentTraining && currentTraining.exercises) {
                currentTraining.exercises.forEach(ex => {
                    if (ex.cardioInterval) clearInterval(ex.cardioInterval);
                    if (ex.exercises) {
                        ex.exercises.forEach(nex => {
                            if (nex.cardioInterval) clearInterval(nex.cardioInterval);
                        });
                    }
                });
            }
            TrainingUI.clearDraft();
            currentTraining = null;
            TrainingUI.pokazSesje(false);
            TrainingUI.loadHistoryAndCalendar();
        }
    },

    continueTraining: (trainingId) => {
        const existingTraining = trainingId !== undefined 
            ? allTrainingsCache.find(t => t.id === trainingId)
            : allTrainingsCache.find(t => t.date === selectedDate);
        if (!existingTraining) return;

        TrainingUI.pokazSesje(true);

        currentTraining = {
            id: existingTraining.id,
            date: selectedDate,
            startTime: Date.now() - (existingTraining.duration_seconds * 1000), // Simulate started in the past
            timerInterval: null,
            exercises: JSON.parse(JSON.stringify(existingTraining.exercises)),
            name: existingTraining.name || '',
            // R20: rodzaj i zdjęcia tego treningu; bez nich zapis zmieniał cardio w „strength” i kasował zdjęcia.
            // Zdjęcia jako kopia listy: usunięcie w sesji nie zmienia historii, dopóki trening nie zostanie zapisany.
            type: existingTraining.type || 'strength',
            socialPhotos: Array.isArray(existingTraining.socialPhotos) ? [...existingTraining.socialPhotos] : [],
            isPaused: false,
            pauseStartTime: null,
            totalPausedTime: 0
        };
        // Stare treningi mają ćwiczenia bez id (albo z powtórzonym): bez id przyciski karty nie trafiłyby w ćwiczenie.
        // Ta sama naprawa co w restoreDraft.
        const seenIds = new Set();
        const napraw = (ex) => {
            if (!ex || typeof ex !== 'object') return;
            if (ex.id === undefined || ex.id === null || ex.id === '' || ex.id === 'undefined' || seenIds.has(String(ex.id))) {
                ex.id = Math.random().toString(36).substr(2, 9);
            }
            seenIds.add(String(ex.id));
        };
        (currentTraining.exercises || []).forEach((ex) => {
            napraw(ex);
            if (ex && ex.type === 'superset' && Array.isArray(ex.exercises)) ex.exercises.forEach(napraw);
        });

        // Pola smartwatcha z tego treningu albo puste (nie z poprzedniej sesji).
        const sw = existingTraining.smartwatch || {};
        const calInput = document.getElementById('smartwatch-calories');
        const hrInput = document.getElementById('smartwatch-hr');
        if (calInput) calInput.value = sw.calories != null ? String(sw.calories) : '';
        if (hrInput) hrInput.value = sw.hr != null ? String(sw.hr) : '';

        const nameInput = document.getElementById('training-name-input');
        if (nameInput) {
            nameInput.value = currentTraining.name;
        }

        TrainingUI.pokazRodzaj(currentTraining.type);
        TrainingUI.ustawPrzyciskPauzy(false);
        TrainingUI.renderCurrentExercises();
        TrainingUI.renderTrainingPhotos();
        currentTraining.timerInterval = setInterval(TrainingUI.updateTimer, 1000);
    },

    // Podgląd zapisanego treningu z karty dnia (z-dialog; wygląd w trening-kalendarz.css). Nazwy z danych przez esc().
    viewTraining: (trainingId) => {
        const rec = allTrainingsCache.find(t => t.id === trainingId);
        if (!rec) return;
        const cwiczeniaRec = Array.isArray(rec.exercises) ? rec.exercises : [];
        const serie = (sets) => (!Array.isArray(sets) || sets.length === 0)
            ? '<div class="z-mut">Brak serii</div>'
            : sets.map((set, sIdx) => `<div>Seria ${sIdx + 1}: ${esc(set.weight)} kg × ${esc(set.reps)} powt.</div>`).join('');

        const lista = cwiczeniaRec.map((ex, i) => {
            if (ex && ex.type === 'superset' && Array.isArray(ex.exercises) && ex.exercises.length > 0) {
                return `
                    <div class="z-podglad-cw z-podglad-superseria">
                        <div class="z-podglad-nazwa">${i + 1}. Superseria</div>
                        ${ex.exercises.map((nestedEx, nIdx) => `
                            <div class="z-podglad-nazwa">${i + 1}.${nIdx + 1}. ${esc(nestedEx.name || 'Nieznane ćwiczenie')}</div>
                            <div class="z-podglad-serie">${serie(nestedEx.sets)}</div>
                        `).join('')}
                    </div>`;
            }
            return `
                <div class="z-podglad-cw">
                    <div class="z-podglad-nazwa">${i + 1}. ${esc((ex && ex.name) || 'Nieznane ćwiczenie')}</div>
                    <div class="z-podglad-serie">${serie(ex && ex.sets)}</div>
                </div>`;
        }).join('');

        const html = `
            <div id="view-modal-overlay" class="z-dialog-scrim z-podglad-scrim">
                <div class="z-dialog z-podglad" role="dialog" aria-modal="true" aria-labelledby="view-modal-title">
                    <div class="z-podglad-gora">
                        <h2 id="view-modal-title" class="z-hd">Podgląd treningu</h2>
                        <button type="button" class="z-ic" aria-label="Zamknij" data-zamknij>${ikona('x', 20)}</button>
                    </div>
                    <div class="z-podglad-info">
                        <div class="z-podglad-tytul">${esc(rec.date)}${rec.name ? ` · ${esc(rec.name)}` : ''}</div>
                        <div class="z-mut">Czas trwania: ${esc(TrainingUI.formatTime(rec.duration_seconds))}</div>
                        <div class="z-mut">Ćwiczeń: ${cwiczeniaRec.length}</div>
                    </div>
                    <h3 class="z-lab">Zapisane ćwiczenia</h3>
                    ${lista}
                    <div class="z-dialog-actions">
                        <button type="button" class="z-ghost" data-zamknij>Zamknij</button>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('view-modal-overlay')?.remove();
        document.body.insertAdjacentHTML('beforeend', html);
        const okno = document.getElementById('view-modal-overlay');
        const powrot = document.activeElement;
        const zamknij = () => {
            okno.remove();
            if (powrot && document.contains(powrot) && typeof powrot.focus === 'function') powrot.focus();
        };
        okno.addEventListener('click', (e) => {
            if (e.target === okno || e.target.closest('[data-zamknij]')) zamknij();
        });
        okno.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { e.preventDefault(); zamknij(); }
        });
        okno.querySelector('.z-podglad-gora .z-ic').focus();
    },

    startTraining: (copyFromIndex = null) => {
        TrainingUI.pokazSesje(true);
        
        currentTraining = {
            date: selectedDate,
            startTime: Date.now(),
            exercises: [],
            name: '',
            type: 'strength',
            isPaused: false,
            pauseStartTime: null,
            totalPausedTime: 0,
            socialPhotos: [],
            smartwatch: { calories: null, hr: null }
        };

        const typeSelect = document.getElementById('training-type-select');
        if (typeSelect) typeSelect.value = 'strength';
        TrainingUI.handleTypeChange('strength');
        
        const nameInput = document.getElementById('training-name-input');
        if (nameInput) {
            nameInput.value = '';
            setTimeout(() => nameInput.focus(), 50);
        }

        const smartwatchHr = document.getElementById('smartwatch-hr');
        const smartwatchCal = document.getElementById('smartwatch-calories');
        if(smartwatchHr) smartwatchHr.value = '';
        if(smartwatchCal) smartwatchCal.value = '';

        if (copyFromIndex !== null && allTrainingsCache[copyFromIndex]) {
            const rec = allTrainingsCache[copyFromIndex];
            currentTraining.exercises = rec.exercises.map(ex => {
                if (ex.type === 'superset') {
                    return {
                        id: Math.random().toString(36).substr(2, 9),
                        type: 'superset',
                        name: ex.name || '',
                        exercises: (ex.exercises || []).map(nestedEx => ({
                            id: Math.random().toString(36).substr(2, 9),
                            type: nestedEx.type || 'strength',
                            name: nestedEx.name || '',
                            sets: (nestedEx.sets || []).map(s => ({ ...s, completed: false }))
                        }))
                    };
                } else {
                    return {
                        id: Math.random().toString(36).substr(2, 9),
                        type: ex.type || 'strength',
                        name: ex.name || '',
                        sets: (ex.sets || []).map(s => ({ ...s, completed: false }))
                    };
                }
            });
            if (rec.name && nameInput) {
                currentTraining.name = rec.name;
                nameInput.value = rec.name;
            }
        }
        
        TrainingUI.ustawPrzyciskPauzy(false);
        TrainingUI.renderTrainingPhotos();

        // If empty, start with one empty exercise block
        if (currentTraining.exercises.length === 0) {
            TrainingUI.addExercise();
        } else {
            TrainingUI.renderCurrentExercises();
        }

        currentTraining.timerInterval = setInterval(TrainingUI.updateTimer, 1000);
    },

    addExercise: () => {
        currentTraining.exercises.push({
            id: Date.now().toString(),
            type: 'strength',
            name: '',
            sets: []
        });
        TrainingUI.renderCurrentExercises();
        
        // Focus the newly added exercise name input
        setTimeout(() => {
            const inputs = document.querySelectorAll('.exercise-name-input');
            if (inputs.length > 0) {
                inputs[inputs.length - 1].focus();
                inputs[inputs.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    },
    toggleSign: (inputId) => {
        const el = document.getElementById(inputId);
        if(el) {
            let val = parseFloat(el.value || '0');
            el.value = (val * -1).toString();
        }
    },

    addSuperset: (exerciseId = null) => {
        if (!exerciseId || typeof exerciseId !== 'string') {
            // Default behavior - append to end (used by tests or global buttons)
            currentTraining.exercises.push({
                id: Date.now().toString(),
                type: 'superset',
                name: '',
                exercises: [
                    { id: Date.now().toString() + '-1', type: 'strength', name: '', sets: [] }
                ]
            });
            TrainingUI.renderCurrentExercises();
            return;
        }

        const index = currentTraining.exercises.findIndex(e => String(e.id) === String(exerciseId));
        if (index > -1) {
            const ex = currentTraining.exercises[index];
            if (ex.type === 'superset') return; // already a superset
            const supersetId = Date.now().toString();
            const newEx = {
                id: supersetId + '-1',
                type: 'strength',
                name: '',
                sets: []
            };
            const supersetObj = {
                id: supersetId,
                type: 'superset',
                name: '',
                exercises: [ex, newEx]
            };
            currentTraining.exercises[index] = supersetObj;
            TrainingUI.renderCurrentExercises();
        }
    },

    addNestedSuperset: (supersetId) => {
        const superset = currentTraining.exercises.find(e => String(e.id) === String(supersetId));
        if (superset) {
            superset.exercises.push({
                id: Date.now().toString() + '-' + Math.random().toString(36).substr(2,5),
                type: 'strength',
                name: '',
                sets: []
            });
            TrainingUI.renderCurrentExercises();
        }
    },

    getExerciseById: (id) => {
        for (let ex of currentTraining.exercises) {
            if (String(ex.id) === String(id)) return ex;
            if (ex.type === 'superset' && ex.exercises) {
                const nested = ex.exercises.find(e => String(e.id) === String(id));
                if (nested) return nested;
            }
        }
        return null;
    },

    removeExercise: (exerciseId) => {
        if (confirm("Na pewno usunąć to ćwiczenie?")) {
            let foundInSuperset = false;
            for (let i = 0; i < currentTraining.exercises.length; i++) {
                const ex = currentTraining.exercises[i];
                if (ex.type === 'superset' && ex.exercises) {
                    const nestedIdx = ex.exercises.findIndex(e => String(e.id) === String(exerciseId));
                    if (nestedIdx > -1) {
                        ex.exercises.splice(nestedIdx, 1);
                        if (ex.exercises.length === 0) {
                            currentTraining.exercises.splice(i, 1);
                        }
                        foundInSuperset = true;
                        break;
                    }
                }
            }
            if (!foundInSuperset) {
                currentTraining.exercises = currentTraining.exercises.filter(e => String(e.id) !== String(exerciseId));
            }
            TrainingUI.saveDraft();
            TrainingUI.renderCurrentExercises();
        }
    },

    updateExerciseField: (exerciseId, field, value) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (exercise) {
            exercise[field] = value;
        }
    },

    handleCopyCheckbox: (exerciseId, checked) => {
        window.TrainingUI.updateExerciseField(exerciseId, 'autoCopy', checked);
        if (checked) {
            const exercise = TrainingUI.getExerciseById(exerciseId);
            if (exercise && exercise.sets && exercise.sets.length > 0) {
                const lastSet = exercise.sets[exercise.sets.length - 1];
                const w = document.getElementById(`weight-${exerciseId}`);
                const r = document.getElementById(`reps-${exerciseId}`);
                if (w) w.value = lastSet.weight;
                if (r) r.value = lastSet.reps;
            }
        }
    },

    startCardio: (exerciseId) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (!exercise) return;
        if (!exercise.cardioSeconds) exercise.cardioSeconds = 0;
        if (exercise.cardioInterval) return; // already running

        exercise.cardioInterval = setInterval(() => {
            exercise.cardioSeconds++;
            const display = document.getElementById(`cardio-display-${exerciseId}`);
            if (display) {
                display.innerText = window.TrainingUI.formatTime(exercise.cardioSeconds);
            }
            // Zapisujemy na żywo w minutach by backend chwycił
            exercise.duration_minutes = Math.round(exercise.cardioSeconds / 60);
        }, 1000);
        
        TrainingUI.renderCurrentExercises();
    },

    stopCardio: (exerciseId) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (!exercise || !exercise.cardioInterval) return;
        clearInterval(exercise.cardioInterval);
        exercise.cardioInterval = null;
        TrainingUI.renderCurrentExercises();
    },

    updateCardioManual: (exerciseId, minutes) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (exercise) {
            let m = parseInt(minutes, 10);
            if (isNaN(m) || m < 0) m = 0;
            exercise.cardioSeconds = m * 60;
            exercise.duration_minutes = m;
            TrainingUI.saveDraft();
        }
    },

    addSet: (exerciseId, isDropset = false) => {
        try {
            const exercise = TrainingUI.getExerciseById(exerciseId);
            if (!exercise) return;


            let wVal = "0";
            let rVal = "0";

            // Kopiuj ostatnią serię TYLKO jeśli autoCopy jest włączone
            if (exercise.autoCopy && exercise.sets && exercise.sets.length > 0) {
                const lastSet = exercise.sets[exercise.sets.length - 1];
                wVal = String(lastSet.weight ?? "0");
                rVal = String(lastSet.reps ?? "0");
            } else if (!exercise.autoCopy) {
                // Nowa seria zawsze zaczyna się pusta gdy autoCopy wyłączone
                wVal = "";
                rVal = "";
            }

            const newSet = {
                weight: parseFloat(wVal) || 0,
                reps: parseInt(rVal, 10) || 0,
                type: isDropset ? 'dropset' : 'normal'
            };
            
            // 1RM i PR z danych katalogu: historia pod dawną i nową nazwą, bez PR dla ćwiczeń z ciężarem ciała.
            const record = recordCheck(allTrainingsCache, exercise.name, exercise.sets, newSet);
            if (record && record.isPR) newSet.isPR = true;
            if (record && record.beaten && window.ChatUI) {
                window.ChatUI.showContextualBubble(`🏆 Nowy Rekord Życiowy (PR)! 💪 Świetna forma, idziesz jak czołg! 🐗🔥`);
            }

            if (!Array.isArray(exercise.sets)) {
                exercise.sets = [];
            }
            exercise.sets.push(newSet);

            TrainingUI.renderCurrentExercises();
            TrainingUI.saveDraft(); 

            // Refill the inputs if autoCopy is enabled
            if (exercise.autoCopy) {
                setTimeout(() => {
                    const w = document.getElementById(`weight-${exerciseId}`);
                    const r = document.getElementById(`reps-${exerciseId}`);
                    if(w) w.value = wVal; // use parsed wVal, not weightInput.value which might be detached
                    if(r) r.value = rVal;
                }, 50);
            } else {
                setTimeout(() => {
                    const w = document.getElementById(`weight-${exerciseId}`);
                    const r = document.getElementById(`reps-${exerciseId}`);
                    if(w) w.value = '';
                    if(r) r.value = '';
                }, 50);
            }
        } catch (error) {
            console.error("Error in addSet:", error);
            komunikat("Nie udało się dodać serii: " + error.message, { pilny: true });
        }
    },

    removeSet: (exerciseId, setIndex) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (exercise) {
            exercise.sets.splice(setIndex, 1);
            TrainingUI.renderCurrentExercises();
            TrainingUI.saveDraft();
        }
    },

    toggleSetCompletion: (exerciseId, setIndex, isCompleted) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (exercise && exercise.sets[setIndex]) {
            exercise.sets[setIndex].isCompleted = isCompleted;
            TrainingUI.renderCurrentExercises();
        }
    },

    updateSetInline: (exerciseId, setIndex, field, value) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (exercise && exercise.sets[setIndex]) {
            exercise.sets[setIndex][field] = parseFloat(value) || 0;
            TrainingUI.saveDraft();
        }
    },

    updateSetStepper: (exerciseId, setIndex, delta) => {
        const exercise = TrainingUI.getExerciseById(exerciseId);
        if (exercise && exercise.sets[setIndex]) {
            let newVal = parseInt(exercise.sets[setIndex].reps) + delta;
            if (newVal < 0) newVal = 0;
            exercise.sets[setIndex].reps = newVal;
            
            // Update DOM element directly
            const inputEl = document.getElementById(`exp-reps-${exerciseId}-${setIndex}`);
            if (inputEl) inputEl.value = newVal;
            
            TrainingUI.saveDraft();
            if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(20);
        }
    },

    renderCurrentExercises: () => {
        const list = document.getElementById('current-exercises-list');
        if (currentTraining.exercises.length === 0) {
            list.innerHTML = '';
            return;
        }

        let html = '';

        // Karta ćwiczenia (spec 8.3): nazwa, planInfo, „N serie · rekord 1RM”, narzędzia, wiersze serii, przyciski.
        const renderExBlock = (ex, isInsideSuperset = false) => {
            // Id jako tekst: liczbowe i brakujące id ze starych danych trafiają w getExerciseById (porównanie tekstowe).
            const a = jsArg(String(ex.id));
            const sets = Array.isArray(ex.sets) ? ex.sets : [];
            const setsCount = sets.filter(s => s.type !== 'dropset').length;
            const isCardio = ex.type === 'cardio';
            const puste = !isCardio && sets.length === 0;
            const rekord = isCardio ? 0 : TrainingUI.rekord1RM(ex);
            const meta = `${setsCount} ${serieSlowo(setsCount)}${rekord > 0 ? ` · rekord 1RM ok. ${rekord} kg` : ''}`;
            const typ = ex.type === 'classes' ? 'Zajęcia' : (isCardio ? 'Cardio' : 'Siłowy');
            const nameId = `exname-${String(ex.id).replace(/[^\w-]/g, '_')}`;

            html += `
                <div class="z-cw${isInsideSuperset ? ' z-cw-w-serii' : ' z-card'}${puste ? ' z-cw-puste' : ''}">
                    <label class="z-sr" for="${esc(nameId)}">Nazwa ćwiczenia</label>
                    <textarea id="${esc(nameId)}" class="exercise-name-input z-cw-nazwa" placeholder="Wpisz nazwę ćwiczenia…" rows="1" oninput="window.TrainingUI.dopasujNazwe(this)" onchange="window.TrainingUI.updateExerciseField(${a}, 'name', this.value); window.TrainingUI.renderCurrentExercises();">${esc(ex.name)}</textarea>
                    ${ex.planInfo ? `<div class="plan-info z-mut z-cw-plan">${esc(ex.planInfo)}</div>` : ''}
                    <div class="z-mut z-cw-meta">${meta}</div>
                    <div class="z-cw-narzedzia">
                        <button type="button" class="z-ghost" onclick="window.TrainingUI.openExerciseSelector(${a})">Katalog</button>
                        <button type="button" class="z-ghost" onclick="window.TrainingUI.toggleExerciseType(${a})">${typ}</button>
                        <button type="button" class="z-ghost z-cw-foto" aria-label="Zdjęcie" onclick="this.nextElementSibling.click()">${ikona('camera', 18)}</button><input type="file" accept="image/*" hidden onchange="window.TrainingUI.handleTrainingPhoto(event)">
                        <button type="button" class="z-ghost z-cw-usun" aria-label="Usuń ćwiczenie" onclick="window.TrainingUI.removeExercise(${a})">${ikona('trash', 18)}</button>
                    </div>`;

            if (isCardio) {
                const cTime = ex.cardioSeconds || (ex.duration_minutes ? ex.duration_minutes * 60 : 0);
                const minId = `cardio-manual-min-${ex.id}`;
                html += `
                    <div class="z-cw-cardio">
                        <div class="z-mut">Czas trwania (stoper albo wpisz ręcznie)</div>
                        <div class="z-cw-cardio-czas" id="cardio-display-${esc(ex.id)}"${ex.cardioInterval ? '' : ' hidden'}>${window.TrainingUI.formatTime(cTime)}</div>
                        <div class="z-cw-cardio-reczny"${ex.cardioInterval ? ' hidden' : ''}>
                            <label class="z-sr" for="${esc(minId)}">Czas cardio w minutach</label>
                            <input type="number" id="${esc(minId)}" class="z-in" value="${Math.floor(cTime / 60)}" onchange="window.TrainingUI.updateCardioManual(${a}, this.value)" inputmode="numeric">
                            <span class="z-mut">min</span>
                        </div>
                        <div class="z-cw-rzad">
                            ${ex.cardioInterval
                                ? `<button type="button" id="cardio-btn-start-${esc(ex.id)}" class="z-ghost z-cw-stoper" disabled>${ikona('clock', 16)}Stoper działa</button>
                            <button type="button" id="cardio-btn-stop-${esc(ex.id)}" class="z-btn" onclick="window.TrainingUI.stopCardio(${a})">${ikona('pause', 16)}Stop</button>`
                                : `<button type="button" id="cardio-btn-start-${esc(ex.id)}" class="z-btn" onclick="window.TrainingUI.startCardio(${a})">${ikona('play', 16)}Start</button>
                            <button type="button" id="cardio-btn-stop-${esc(ex.id)}" class="z-ghost" disabled>${ikona('pause', 16)}Stop</button>`}
                        </div>
                    </div>`;
            } else {
                // Bieżąca seria: pierwsza nieodhaczona.
                const biezaca = sets.findIndex(s => !s.isCompleted);
                if (sets.length > 0) html += `<div class="z-cw-serie">`;
                // Numer serii bez dropsetów (jak „N serie”): 1, D, 2. Dropset w nazwie dostępnej: „Seria 1, dropset 1”.
                let nrSerii = 0;
                let nrDropsetu = 0;
                sets.forEach((set, i) => {
                    const isDropset = set.type === 'dropset';
                    const done = !!set.isCompleted;
                    if (isDropset) nrDropsetu++;
                    else { nrSerii++; nrDropsetu = 0; }
                    const n = isDropset
                        ? (nrSerii > 0 ? `${nrSerii}, dropset ${nrDropsetu}` : `0, dropset ${nrDropsetu}`)
                        : String(nrSerii);
                    const klasy = ['z-seria', done ? 'z-zrobiona' : '', i === biezaca ? 'z-biezaca' : '', isDropset ? 'z-dropset' : ''].filter(Boolean).join(' ');
                    html += `
                        <div class="${klasy}">
                            <button type="button" class="z-seria-znak" aria-pressed="${done}" aria-label="Seria ${n} wykonana" onclick="window.TrainingUI.toggleSetCompletion(${a}, ${i}, ${!done})"><span class="z-seria-kolo">${done ? ikona('check', 14) : ''}</span></button>
                            <span class="z-mut z-seria-nr"${isDropset ? ' title="Dropset"' : ''}>${isDropset ? 'D' : nrSerii}</span>
                            <input type="number" class="z-in z-seria-kg" value="${esc(set.weight || '')}" placeholder="kg" aria-label="Ciężar, seria ${n}" onchange="window.TrainingUI.updateSetInline(${a}, ${i}, 'weight', this.value)" inputmode="decimal" step="any">
                            <span class="z-mut z-seria-x">kg ×</span>
                            <input type="number" class="z-in z-seria-powt" value="${esc(set.reps || '')}" placeholder="" aria-label="Powtórzenia, seria ${n}" onchange="window.TrainingUI.updateSetInline(${a}, ${i}, 'reps', this.value)" inputmode="numeric">
                            ${set.isPR ? '<span class="z-mut z-seria-rekord">rekord</span>' : ''}
                            <button type="button" class="z-ic z-seria-usun" aria-label="Usuń serię ${n}" onclick="window.TrainingUI.removeSet(${a}, ${i})">${ikona('x', 16)}</button>
                        </div>`;
                });
                if (sets.length > 0) html += `</div>`;

                html += `
                    <div class="z-cw-rzad">
                        <button type="button" class="z-btn" onclick="window.TrainingUI.addSet(${a}, false)">+ Seria</button>
                        <button type="button" class="z-ghost" onclick="window.TrainingUI.addSet(${a}, true)">Dropset</button>
                        ${!isInsideSuperset ? `<button type="button" class="z-ghost" onclick="window.TrainingUI.addSuperset(${a})">Superseria</button>` : ''}
                    </div>`;

                // Autokopia ostatniej serii (zwinięte ćwiczenie bez serii jej nie pokazuje).
                if (!puste) {
                    html += `
                    <label class="z-check z-cw-kopiuj"><input type="checkbox" onchange="window.TrainingUI.handleCopyCheckbox(${a}, this.checked)" ${ex.autoCopy ? 'checked' : ''}>Kopiuj z poprzedniej serii</label>`;
                }
            }

            html += `</div>`; // koniec karty ćwiczenia
        };

        // Ćwiczenia zwykłe i superserie (jedna karta z ćwiczeniami w środku).
        currentTraining.exercises.forEach((ex) => {
            if (ex.type === 'superset' && Array.isArray(ex.exercises)) {
                html += `
                    <div class="z-card z-superseria">
                        <div class="z-superseria-gora">
                            <span class="z-pill">Superseria</span>
                            <button type="button" class="z-ic z-superseria-usun" aria-label="Usuń superserię" onclick="window.TrainingUI.removeExercise(${jsArg(String(ex.id))})">${ikona('trash', 18)}</button>
                        </div>`;
                ex.exercises.forEach((subEx, subIdx) => {
                    if (subIdx > 0) html += `<div class="z-sep"></div>`;
                    renderExBlock(subEx, true);
                });
                html += `</div>`;
            } else {
                renderExBlock(ex, false);
            }
        });

        list.innerHTML = html;
        TrainingUI.dopasujNazwy();
    },

    // Wysokość pola nazwy ćwiczenia według treści. field-sizing: content (CSS) nie działa w Safari na iOS,
    // a <textarea rows="1"> obcinałby tam długą nazwę do jednej linii. Ukryte pole (scrollHeight 0) zostaje bez zmian.
    dopasujNazwe: (el) => {
        if (!el || !el.isConnected) return;
        el.style.height = 'auto';
        const h = el.scrollHeight;
        if (h > 0) el.style.height = `${h}px`;
        else el.style.height = '';
    },

    dopasujNazwy: () => {
        document.querySelectorAll('#current-exercises-list .z-cw-nazwa').forEach((el) => TrainingUI.dopasujNazwe(el));
    },

    handleTrainingPhoto: async (event) => {
        const input = event.target;
        const file = input.files[0];
        // Pole czyszczone po każdym wyborze: to samo zdjęcie da się wybrać drugi raz.
        try { input.value = ''; } catch (e) { /* stare przeglądarki */ }
        if (!file) return;
        if (!currentTraining.socialPhotos) currentTraining.socialPhotos = [];
        if (currentTraining.socialPhotos.length >= 3) {
            komunikat("Możesz dodać najwyżej 3 zdjęcia z treningu.");
            return;
        }

        TrainingUI.compressImage(file, async (compressedDataUrl) => {
            try {
                const id = await MediaManager.saveMedia(compressedDataUrl);
                currentTraining.socialPhotos.push(id);
                TrainingUI.renderTrainingPhotos();
                komunikat('Zdjęcie dodane');
            } catch(e) {
                komunikat("Nie udało się zapisać zdjęcia: " + e.message, { pilny: true });
            }
        });
    },

    removeTrainingPhoto: (index) => {
        if(currentTraining.socialPhotos) {
            currentTraining.socialPhotos.splice(index, 1);
            TrainingUI.renderTrainingPhotos();
        }
    },

    renderTrainingPhotos: () => {
        const list = document.getElementById('training-social-photos-list');
        if (!list) return;
        list.innerHTML = '';
        const photos = currentTraining && Array.isArray(currentTraining.socialPhotos) ? currentTraining.socialPhotos : [];
        photos.forEach((photoId, index) => {
            const imgWrap = document.createElement('div');
            imgWrap.className = 'z-sesja-zdjecie';

            const img = document.createElement('img');
            img.alt = `Zdjęcie ${index + 1}`;
            MediaManager.getMediaUrl(photoId).then(url => {
                if (url) img.src = url;
            });

            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'z-ic z-sesja-zdjecie-usun';
            delBtn.setAttribute('aria-label', `Usuń zdjęcie ${index + 1}`);
            delBtn.innerHTML = ikona('x', 16);
            delBtn.onclick = () => window.TrainingUI.removeTrainingPhoto(index);

            imgWrap.appendChild(img);
            imgWrap.appendChild(delBtn);
            list.appendChild(imgWrap);
        });
    },

    handleTypeChange: (type) => {
        if (!currentTraining) return;
        currentTraining.type = type;
        TrainingUI.pokazRodzaj(type);
    },

    // Widok rodzaju sesji: #training-type-select (źródło prawdy), żetony i sekcje. Stan ustawia handleTypeChange.
    // Stare treningi mogą mieć rodzaj 'classes' (dawny Kreator, klasyczny wygląd): widok pokazuje go jako „Zajęcia”,
    // a zapisany rodzaj zostaje bez zmian (currentTraining.type zmienia tylko handleTypeChange).
    pokazRodzaj: (rodzaj) => {
        const type = rodzaj === 'classes' ? 'class' : rodzaj;
        const select = document.getElementById('training-type-select');
        if (select && select.value !== type) select.value = type;
        document.querySelectorAll('#active-training-view .z-sesja-rodzaje [data-rodzaj]').forEach((b) => {
            const on = b.dataset.rodzaj === type;
            b.classList.toggle('z-on', on);
            b.setAttribute('aria-pressed', String(on));
        });
        const exercisesContainer = document.getElementById('exercises-container-section');
        const classContainer = document.getElementById('class-type-container');
        
        if (exercisesContainer && classContainer) {
            if (type === 'strength') {
                exercisesContainer.style.display = 'block';
                classContainer.style.display = 'none';
            } else if (type === 'cardio') {
                exercisesContainer.style.display = 'none';
                classContainer.style.display = 'none';
            } else if (type === 'class') {
                exercisesContainer.style.display = 'none';
                classContainer.style.display = 'block';
            }
        }
    },

    handleClassChange: (className) => {
        if (!currentTraining) return;
        if (className === 'custom') {
            const customName = prompt("Wpisz nazwę zajęć:");
            if (customName) {
                currentTraining.name = customName;
                const nameInput = document.getElementById('training-name-input');
                if (nameInput) nameInput.value = customName;
            }
        } else {
            currentTraining.name = className;
            const nameInput = document.getElementById('training-name-input');
            if (nameInput) nameInput.value = className;
        }
    },

    finishTraining: async () => {
        if(confirm("Czy na pewno chcesz zakończyć i zapisać ten trening?")) {
            if (currentTraining.timerInterval) {
                clearInterval(currentTraining.timerInterval);
            }

            if (currentTraining.isPaused) {
                currentTraining.totalPausedTime += (Date.now() - currentTraining.pauseStartTime);
            }

            let duration = Math.floor((Date.now() - currentTraining.startTime - currentTraining.totalPausedTime) / 1000);
            
            const manualToggle = document.getElementById('manual-duration-toggle');
            if (manualToggle && manualToggle.checked) {
                const hoursInput = document.getElementById('manual-training-hours');
                const minutesInput = document.getElementById('manual-training-minutes');
                const hrs = hoursInput ? parseInt(hoursInput.value, 10) || 0 : 0;
                const mins = minutesInput ? parseInt(minutesInput.value, 10) || 0 : 0;
                if (hrs > 0 || mins > 0) {
                    duration = (hrs * 3600) + (mins * 60);
                }
            }
            
            // Flush pending exercise names
            document.querySelectorAll('.exercise-name-input').forEach(input => {
                input.blur(); // Force onchange if pending
            });

            // Flush pending sets if they didn't click + Seria (auto-add)
            currentTraining.exercises.forEach(ex => {
                const processEx = (exercise) => {
                    const wInput = document.getElementById(`weight-${exercise.id}`);
                    const rInput = document.getElementById(`reps-${exercise.id}`);
                    if (wInput && rInput && wInput.value && rInput.value) {
                        // Auto-add the set if they typed it but forgot to click +
                        exercise.sets = exercise.sets || [];
                        exercise.sets.push({
                            weight: parseFloat(wInput.value) || 0,
                            reps: parseInt(rInput.value, 10) || 0,
                            type: 'normal'
                        });
                        wInput.value = '';
                        rInput.value = '';
                    }
                };
                if (ex.type === 'superset' && Array.isArray(ex.exercises)) {
                    ex.exercises.forEach(processEx);
                } else {
                    processEx(ex);
                }
            });

            // Filter out empty exercises, supporting nested supersets without throwing TypeError
            const validExercises = currentTraining.exercises.filter(ex => {
                if (ex.type === 'superset' && Array.isArray(ex.exercises)) {
                    return ex.exercises.some(subEx => (subEx.name && subEx.name.trim() !== '') || (Array.isArray(subEx.sets) && subEx.sets.length > 0));
                }
                return (ex.name && ex.name.trim() !== '') || (Array.isArray(ex.sets) && ex.sets.length > 0);
            });

            const nameInput = document.getElementById('training-name-input');
            const trainingName = nameInput ? nameInput.value.trim() : '';

            const calInput = document.getElementById('smartwatch-calories');
            const hrInput = document.getElementById('smartwatch-hr');
            if ((calInput && calInput.value) || (hrInput && hrInput.value)) {
                if (!currentTraining.smartwatch) currentTraining.smartwatch = {};
                if (calInput && calInput.value) currentTraining.smartwatch.calories = parseInt(calInput.value, 10);
                if (hrInput && hrInput.value) currentTraining.smartwatch.hr = parseInt(hrInput.value, 10);
            }

            // Safety cleanup for cardioIntervals to avoid circular reference crashes in DB storage
            currentTraining.exercises.forEach(ex => {
                if (ex.cardioInterval) {
                    clearInterval(ex.cardioInterval);
                    delete ex.cardioInterval;
                }
            });

            // Zapisz własne ćwiczenia do prywatnego katalogu
            let customExercises = [];
            try { customExercises = JSON.parse(localStorage.getItem('uki_custom_exercises') || '[]'); } catch(e) {}
            const allKnownExercises = new Set([...ExerciseCatalog, ...customExercises]);
            let addedNew = false;
            
            const processCustomExercise = (name) => {
                const n = name && name.trim();
                // Dawna nazwa z katalogu (np. ze starego szablonu) to nadal ćwiczenie z katalogu, nie własne.
                if (n && !allKnownExercises.has(n) && !isCatalogExercise(n)) {
                    customExercises.push(n);
                    allKnownExercises.add(n);
                    addedNew = true;
                }
            };
            
            validExercises.forEach(ex => {
                if (ex.type === 'superset' && Array.isArray(ex.exercises)) {
                    ex.exercises.forEach(subEx => processCustomExercise(subEx.name));
                } else {
                    processCustomExercise(ex.name);
                }
            });
            
            if (addedNew) {
                localStorage.setItem('uki_custom_exercises', JSON.stringify(customExercises));
            }

            // Ensure exercises_json doesn't break if validExercises is empty
            const exercisesToSave = validExercises.length > 0 ? validExercises : [];

            try {
                if (currentTraining.id) {
                    await DatabaseManager.updateTraining({
                        id: currentTraining.id,
                        date: currentTraining.date,
                        duration_seconds: duration,
                        exercises: exercisesToSave,
                        name: trainingName,
                        type: currentTraining.type || 'strength',
                        socialPhotos: currentTraining.socialPhotos,
                        smartwatch: currentTraining.smartwatch
                    });
                } else {
                    await DatabaseManager.addTraining({
                        date: currentTraining.date,
                        duration_seconds: duration,
                        exercises: exercisesToSave,
                        name: trainingName,
                        type: currentTraining.type || 'strength',
                        socialPhotos: currentTraining.socialPhotos,
                        smartwatch: currentTraining.smartwatch
                    });
                }
                
                const sourceTemplate = currentTraining.templateId
                    ? TrainingUI.getTemplates().find(t => String(t.id) === String(currentTraining.templateId))
                    : null;
                if (sourceTemplate && sourceTemplate.source && sourceTemplate.source.kind === 'trainer-plan') {
                    TrainingUI.saveTrainerPlanChanges(sourceTemplate, exercisesToSave);
                } else if (currentTraining.templateId) {
                    if (confirm("Ten trening został utworzony z szablonu. Czy zapisać wprowadzone modyfikacje (ćwiczenia, serie, ciężary) z powrotem do szablonu? Zmiany zostaną uwzględnione w przyszłych treningach w kalendarzu.")) {
                        let templates = TrainingUI.getTemplates();
                        const templateIndex = templates.findIndex(t => String(t.id) === String(currentTraining.templateId));
                        if (templateIndex > -1) {
                            templates[templateIndex].exercises = JSON.parse(JSON.stringify(exercisesToSave));
                            templates[templateIndex].name = trainingName;
                            templates[templateIndex].type = currentTraining.type || 'strength';
                            localStorage.setItem('uki_workout_templates', JSON.stringify(templates));
                        }
                    }
                }
                
                if (window.AchievementsSystem) {
                    window.AchievementsSystem.checkPostTrainingAchievements({
                        exercises: exercisesToSave
                    });
                }
                
                TrainingUI.clearDraft(); // Czyścimy brudnopis po sukcesie
                // Pola smartwatcha należą do tej sesji: następna (także „Kontynuuj”) zaczyna od pustych.
                ['smartwatch-calories', 'smartwatch-hr'].forEach((id) => {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
                komunikat("Trening zapisany.");
                
                // Hide active view and show calendar
                TrainingUI.pokazSesje(false);
                TrainingUI.loadHistoryAndCalendar();

                // Trener Edward AI - Gratulacje
                setTimeout(async () => {
                    if (window.ChatUI && window.DatabaseManager) {
                        try {
                            const trainings = await window.DatabaseManager.getTrainings();
                            const count = trainings.length;
                            if (count === 1) {
                                window.ChatUI.showContextualBubble("Świetna robota z pierwszym treningiem! Oby tak dalej! 💪", true);
                            } else if (count % 7 === 0) {
                                window.ChatUI.showContextualBubble(`Niesamowite! Masz już na koncie ${count} treningów! Konsekwencja to klucz do sukcesu! 🏆`, true);
                            } else if (Math.random() > 0.7) {
                                window.ChatUI.showContextualBubble("Dobra robota dzisiaj! Odpocznij, zjedz coś zdrowego i wracaj silniejszy! 🚀", true);
                            }
                        } catch(e) { console.error(e) }
                    }
                }, 1500);

            } catch (err) {
                console.error("Error saving training:", err);
                
                // Awaryjne zrzucenie treningu do logów i pliku lokalnego
                try {
                    localStorage.setItem('uki_active_training_draft', JSON.stringify({
                        ...currentTraining, 
                        isCrashRecovery: true,
                        crashError: err.toString()
                    }));
                } catch(e) {}
                
                if (window.ukiLogError) {
                    window.ukiLogError("KRYTYCZNY Błąd podczas zapisu w finishTraining", err ? err.stack || err.toString() : '');
                } else {
                    // Fallback jeśli ukiLogError nie istnieje
                    console.error("KRYTYCZNY Błąd:", err);
                }
                
                // Jeden pilny komunikat (wcześniej dwa alert() po sobie); sesja zostaje na ekranie.
                komunikat("Nie udało się zapisać treningu (prawdopodobnie brak miejsca w pamięci). Dane są zachowane jako szkic i wrócą po ponownym uruchomieniu aplikacji.", { pilny: true });
                return; // Przerwij żeby nie znikał ekran (nie przełączaj widoków)
            }

            TrainingUI.pokazSesje(false);
            TrainingUI.loadHistoryAndCalendar();
        }
    },

    // Funkcja kompresji zdjęć — używana przez handleTrainingPhoto i SettingsUI (tapeta)
    compressImage: (file, callback) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX = 1200;
                let w = img.width, h = img.height;
                if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
                if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                callback(canvas.toDataURL('image/jpeg', 0.82));
            };
        };
        reader.onerror = () => callback(null);
    }
};

window.TrainingUI = TrainingUI;
PlanImportUI.connect(TrainingUI);
