import { DatabaseManager } from '../db/DatabaseManager.js';
import { DietAIEngine } from '../diet/DietAIEngine.js';
import { MediaManager } from '../db/MediaManager.js';
import { ikona } from '../wyglad/ikony.js';
import { computeTdee, readBodyProfile, ageFromBirthYear, saveBirthYear, profileHint, BIRTH_YEAR_ERROR, NO_DATA_HINT, resolveKcalGoal, loadKcalGoal, saveKcalGoal, useComputedKcalGoal, parseKcalInput, isPlausibleKcal, reportKcalIncident, setKcalSourceIcon, KCAL_MIN, KCAL_MAX } from '../diet/kcalGoal.js';

// Dane użytkownika w innerHTML zawsze przez esc() (także w atrybutach w cudzysłowie).
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const liczba = (v) => Number(v) || 0;
// Szerokość/wysokość w procentach z jednym miejscem po przecinku, najwyżej 100 %.
const procent = (czesc, calosc) => `${calosc > 0 ? Math.min(100, Math.round((czesc / calosc) * 1000) / 10) : 0}%`;

export const DietUI = {
    attachedImages: [],

    init: async () => {
        const dashboard = document.getElementById('diet-dashboard');
        if (!dashboard) return;

        // Inicjalizacja struktury UI (okno ustawień z poprzedniego renderu siedzi w <body>, patrz bindEvents)
        document.getElementById('diet-tdee-modal')?.remove();
        DietUI.renderUI(dashboard);

        // Załadowanie dzisiejszych danych i wyliczenie TDEE
        await DietUI.loadTodayData();
        
        // Podpięcie zdarzeń
        DietUI.bindEvents();
    },

    // Treść ekranu (spec 8.3, plansza Dieta) wpada do #diet-content; nagłówek z „Ustawieniami zapotrzebowania”
    // (#diet-config-btn) stoi w index.html. Okno celu kcal (#diet-tdee-modal) bindEvents przenosi do <body>.
    renderUI: (container) => {
        const tresc = container.querySelector('#diet-content') || container;
        const makro = (klucz, nazwa) => `
                    <div class="diet-makro">
                        <div class="diet-makro-opis"><span class="diet-makro-nazwa">${nazwa}</span><span class="diet-makro-wartosc z-mut"><span id="diet-${klucz}-display">0</span> g</span></div>
                    </div>`;
        tresc.innerHTML = `
            <div class="diet">
            <!-- Podsumowanie: kcal zjedzone z celu i makro -->
            <section class="z-card diet-summary-card" aria-label="Podsumowanie dnia">
                <div class="diet-summary">
                    <div class="z-chart z-chart-donut" id="diet-kcal-ring" role="img" aria-label="Zjedzono 0 z 0 kcal" style="--z-val: 0%">
                        <div class="z-chart-donut-in" aria-hidden="true">
                            <div class="z-big diet-kcal-zjedzone" id="diet-kcal-consumed">0</div>
                            <div class="z-mut diet-kcal-cel">z <span id="diet-tdee-display">---</span> kcal <span id="diet-kcal-source" class="diet-kcal-zrodlo"></span></div>
                        </div>
                    </div>
                    <div class="diet-makra">${makro('protein', 'Białko')}${makro('carbs', 'Węgle')}${makro('fat', 'Tłuszcze')}
                    </div>
                </div>
                <p id="diet-kcal-hint" class="z-mut diet-kcal-hint" hidden></p>
            </section>

            <!-- Co dzisiaj jadłeś? Opis, zdjęcia (do 3) i analiza AI -->
            <section class="z-card diet-dodaj">
                <label class="diet-dodaj-tytul" for="diet-context-input">Co dzisiaj jadłeś?</label>
                <textarea id="diet-context-input" class="z-in" rows="2" placeholder="Napisz lub podyktuj…"></textarea>
                <div id="diet-image-preview-container" class="diet-zdjecia" hidden></div>
                <input type="file" id="diet-camera-input" accept="image/*" multiple hidden>
                <div class="diet-dodaj-akcje">
                    <button type="button" id="diet-attach-btn" class="z-ghost">${ikona('camera', 18)}Zdjęcie</button>
                    <button type="button" id="diet-analyze-btn" class="z-btn">${ikona('sparkles', 18)}Analizuj z AI</button>
                </div>
                <div id="diet-loading" class="diet-loading z-sub" role="status" hidden>
                    <span class="diet-spinner" aria-hidden="true"></span>
                    <span id="diet-loading-text">Edward analizuje...</span>
                </div>
            </section>

            <!-- Dzisiejsze posiłki -->
            <h3 class="diet-sec">Dzisiejsze posiłki</h3>
            <div id="diet-logs-list" class="diet-lista"></div>

            <!-- Historia 30 dni: mini-słupki, dziś akcentem -->
            <section class="z-card diet-historia">
                <div class="diet-historia-gora"><h3 class="diet-historia-tytul">Historia 30 dni</h3><span class="z-mut diet-historia-sr"></span></div>
                <div id="diet-history-chart" class="z-chart z-chart-mini" role="group" aria-label="Historia 30 dni"></div>
                <div class="z-mut diet-historia-daty" aria-hidden="true"></div>
                <div class="z-chart-legend diet-historia-legenda" aria-hidden="true"></div>
            </section>
            </div>

            <!-- Modal konfiguracji TDEE -->
            <!-- z-index nad menu dolnym i przyciskiem „Start” (2000); okno przewija się na niskich ekranach -->
            <div id="diet-tdee-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(17,17,24,0.8); backdrop-filter: blur(5px); z-index: 2500; justify-content: center; align-items: flex-start; overflow-y: auto; box-sizing: border-box; padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));">
                <div style="background: rgba(255,255,255,0.08); backdrop-filter: blur(20px); padding: 30px 25px; border-radius: 24px; max-width: 400px; width: 100%; position: relative; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5); margin: auto; box-sizing: border-box; max-height: calc(100vh - 32px); max-height: calc(100dvh - 32px); overflow-y: auto; -webkit-overflow-scrolling: touch;">
                    <button id="diet-tdee-close" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: #8E8E93; font-size: 1.5em; cursor: pointer; transition: color 0.2s;">×</button>
                    <h3 style="margin: 0 0 25px 0; color: #fff; font-size: 1.2em; font-weight: 600;">Cel kaloryczny</h3>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #8E8E93; font-size: 0.85em; font-weight: 500;">Aktywność i Treningi</label>
                        <select id="diet-tdee-activity" class="input-field" style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; font-size: 1em; outline: none; appearance: none;">
                            <option value="1.2">Praca siedząca (Brak treningów)</option>
                            <option value="1.375">Niska (1-2 treningi)</option>
                            <option value="1.55" selected>Umiarkowana (3-4 treningi)</option>
                            <option value="1.725">Wysoka (5-6 treningów)</option>
                            <option value="1.9">Bardzo wysoka (Praca fiz. + treningi)</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <label style="display: block; margin-bottom: 8px; color: #8E8E93; font-size: 0.85em; font-weight: 500;">Obecny cel</label>
                        <select id="diet-tdee-goal" class="input-field" style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; font-size: 1em; outline: none; appearance: none;">
                            <option value="cut">Redukcja (-500 kcal)</option>
                            <option value="maintenance" selected>Utrzymanie wagi</option>
                            <option value="bulk">Budowa masy (+300 kcal)</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label for="diet-kcal-birth-year" style="display: block; margin-bottom: 8px; color: #8E8E93; font-size: 0.85em; font-weight: 500;">Rok urodzenia</label>
                        <input type="text" inputmode="numeric" maxlength="4" id="diet-kcal-birth-year" class="input-field" autocomplete="bday-year" placeholder="np. 1990" aria-describedby="diet-kcal-birth-error" style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; font-size: 1em; outline: none; box-sizing: border-box;">
                        <div id="diet-kcal-birth-error" role="alert" style="display: none; color: #FF453A; font-size: 0.8em; margin-top: 6px;"></div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label for="diet-kcal-manual" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; color: #8E8E93; font-size: 0.85em; font-weight: 500;">Cel kaloryczny (kcal) <span id="diet-kcal-source-modal" style="display: inline-flex; color: #FF9800;"></span></label>
                        <input type="text" inputmode="numeric" id="diet-kcal-manual" class="input-field" autocomplete="off" aria-describedby="diet-kcal-manual-error" style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; font-size: 1em; outline: none; box-sizing: border-box;">
                        <div id="diet-kcal-manual-error" role="alert" style="display: none; color: #FF453A; font-size: 0.8em; margin-top: 6px;"></div>
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-top: 8px; font-size: 0.8em; color: #8E8E93;">
                            <span id="diet-kcal-suggested"></span>
                            <button type="button" id="diet-kcal-restore" style="display: none; background: none; border: 1px solid rgba(255,152,0,0.4); color: #FF9800; border-radius: 10px; padding: 6px 10px; font-size: 1em; cursor: pointer; white-space: nowrap;">Przywróć wyliczony</button>
                        </div>
                        <div id="diet-kcal-profile-hint" style="display: none; margin-top: 8px; font-size: 0.8em; color: #8E8E93; line-height: 1.4;"></div>
                    </div>

                    <p style="font-size: 0.8em; color: #8E8E93; margin-bottom: 25px; line-height: 1.5;">
                        Zapotrzebowanie wyliczane jest ze wzoru Mifflin-St Jeor na podstawie Twojej najnowszej wagi w sekcji Pomiary. Możesz wpisać własny cel; wtedy zmiana wagi czy aktywności go nie nadpisze.
                    </p>

                    <button id="diet-tdee-save" style="width: 100%; background: #FF9800; color: #FFF; border: none; padding: 15px; border-radius: 12px; font-weight: 600; font-size: 1em; cursor: pointer; transition: opacity 0.2s;">
                        Zapisz ustawienia
                    </button>
                </div>
            </div>
        `;
    },

    bindEvents: () => {
        const cameraInput = document.getElementById('diet-camera-input');
        if (cameraInput) {
            cameraInput.addEventListener('change', DietUI.handleImageAttach);
        }
        // „Zdjęcie” to przycisk (osiągalny z klawiatury), a nie <label>: otwiera ukryte pole wyboru pliku.
        const attachBtn = document.getElementById('diet-attach-btn');
        if (attachBtn && cameraInput) {
            attachBtn.addEventListener('click', () => cameraInput.click());
        }

        const removeImgBtn = document.getElementById('diet-remove-image-btn');
        if (removeImgBtn) {
            removeImgBtn.addEventListener('click', DietUI.removeAttachedImage);
        }

        const analyzeBtn = document.getElementById('diet-analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', DietUI.handleAnalyze);
        }

        const configBtn = document.getElementById('diet-config-btn');
        const modal = document.getElementById('diet-tdee-modal');
        // Okno ustawień przenosimy do <body>: w zakładce (osobny kontekst warstw) jego z-index nie przykryłby
        // menu dolnego ani przycisku „Start” (z-index 2000) na telefonie.
        if (modal && modal.parentElement !== document.body) document.body.appendChild(modal);
        const closeBtn = document.getElementById('diet-tdee-close');
        const saveBtn = document.getElementById('diet-tdee-save');

        if (configBtn && modal) {
            // Przycisk stoi w nagłówku w index.html (nie jest renderowany na nowo), więc onclick zamiast
            // addEventListener: ponowne DietUI.init() nie podwoi obsługi.
            configBtn.onclick = async () => {
                // Załaduj zapisane ustawienia
                const savedGoal = localStorage.getItem('dietGoal') || 'maintenance';
                const savedActivity = localStorage.getItem('dietActivity') || '1.55';

                document.getElementById('diet-tdee-goal').value = savedGoal;
                document.getElementById('diet-tdee-activity').value = savedActivity;

                modal.style.display = 'flex';
                await DietUI.fillKcalGoalForm();
            };
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Zmiana aktywności lub celu w oknie: nowe wyliczenie obok (ręczny cel zostaje bez zmian).
        ['diet-tdee-goal', 'diet-tdee-activity'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', () => DietUI.refreshKcalSuggestion());
        });

        const manualInput = document.getElementById('diet-kcal-manual');
        if (manualInput) {
            manualInput.addEventListener('input', () => {
                DietUI.kcalForm.source = manualInput.value.trim() ? 'manual' : 'auto';
                DietUI.kcalForm.edited = true;
                DietUI.showKcalError('');
                DietUI.renderKcalFormState();
            });
        }

        const birthInput = document.getElementById('diet-kcal-birth-year');
        if (birthInput) {
            birthInput.addEventListener('input', () => {
                DietUI.showBirthError('');
                const v = birthInput.value.trim();
                if (!v || /^\d{4}$/.test(v)) DietUI.refreshKcalSuggestion();
            });
        }

        const restoreBtn = document.getElementById('diet-kcal-restore');
        if (restoreBtn) {
            // Tylko w oknie: nic nie zapisuje się przed „Zapisz” (aktywność, rok urodzenia ani cel).
            restoreBtn.addEventListener('click', async () => {
                const { birthYear } = DietUI.readTdeeForm();
                if (birthYear && ageFromBirthYear(birthYear) === null) {
                    DietUI.showBirthError(BIRTH_YEAR_ERROR);
                    return;
                }
                await DietUI.refreshKcalSuggestion();
                if (DietUI.kcalForm.suggested === null) return;
                DietUI.kcalForm.source = 'auto';
                DietUI.kcalForm.edited = false;
                if (manualInput) manualInput.value = DietUI.kcalForm.suggested;
                DietUI.showKcalError('');
                DietUI.renderKcalFormState();
            });
        }

        if (saveBtn && modal) {
            saveBtn.addEventListener('click', async () => {
                const { goal, activity, birthYear } = DietUI.readTdeeForm();

                if (birthYear && ageFromBirthYear(birthYear) === null) {
                    DietUI.showBirthError(BIRTH_YEAR_ERROR);
                    return;
                }

                let manualKcal = null;
                if (DietUI.kcalForm.source === 'manual') {
                    const n = parseKcalInput(manualInput ? manualInput.value : '');
                    if (n === null || !isPlausibleKcal(n)) {
                        DietUI.showKcalError(n === null
                            ? `Wpisz liczbę od ${KCAL_MIN} do ${KCAL_MAX} kcal.`
                            : `${n} kcal to nierealny cel. Wpisz liczbę od ${KCAL_MIN} do ${KCAL_MAX} kcal.`);
                        return;
                    }
                    manualKcal = n;
                }

                localStorage.setItem('dietGoal', goal);
                localStorage.setItem('dietActivity', activity);
                if (birthYear !== undefined) saveBirthYear(birthYear);
                if (manualKcal !== null) saveKcalGoal(manualKcal, 'manual');
                else useComputedKcalGoal(await DietUI.calculateTDEE({ goal, activity, birthYear }));

                modal.style.display = 'none';
                await DietUI.loadTodayData();
            });
        }
    },

    // Stan pola celu w oknie ustawień: źródło (auto/manual) i aktualne wyliczenie.
    kcalForm: { source: 'auto', suggested: null, pending: false, edited: false },

    readTdeeForm: () => {
        const birth = document.getElementById('diet-kcal-birth-year');
        return {
            goal: document.getElementById('diet-tdee-goal')?.value || 'maintenance',
            activity: document.getElementById('diet-tdee-activity')?.value || '1.55',
            birthYear: birth ? birth.value.trim() : undefined
        };
    },

    // Najpierw od razu zapisany cel (pole gotowe do wpisywania), potem wyliczenie z bazy.
    fillKcalGoalForm: async () => {
        const input = document.getElementById('diet-kcal-manual');
        const { goal } = loadKcalGoal();
        const source = goal && goal.source === 'manual' ? 'manual' : 'auto';
        DietUI.kcalForm = { source, suggested: null, pending: true, edited: false, noData: false };
        if (input) input.value = goal ? goal.kcal : '';
        const birth = document.getElementById('diet-kcal-birth-year');
        if (birth) birth.value = readBodyProfile().birthYear ?? '';
        DietUI.showKcalError('');
        DietUI.showBirthError('');
        DietUI.renderKcalFormState();
        await DietUI.refreshKcalSuggestion();
    },

    refreshKcalSuggestion: async () => {
        const computed = await DietUI.calculateTDEE(DietUI.readTdeeForm());
        DietUI.kcalForm.suggested = isPlausibleKcal(computed) ? computed : null;
        DietUI.kcalForm.noData = computed === null;
        DietUI.kcalForm.pending = false;
        const input = document.getElementById('diet-kcal-manual');
        // Wpis użytkownika ma pierwszeństwo: wyliczenie trafia do pola tylko przy celu automatycznym.
        if (input && DietUI.kcalForm.source === 'auto' && !DietUI.kcalForm.edited && DietUI.kcalForm.suggested !== null) {
            input.value = DietUI.kcalForm.suggested;
        }
        DietUI.renderKcalFormState();
    },

    renderKcalFormState: () => {
        const { source, suggested, pending, noData } = DietUI.kcalForm;
        // Bez pomiarów nie ma celu „wyliczonego automatycznie”, więc nie ma też ikony AI.
        setKcalSourceIcon(document.getElementById('diet-kcal-source-modal'), source === 'auto' && (noData || pending) ? null : source);
        const hint = document.getElementById('diet-kcal-suggested');
        if (hint) {
            hint.textContent = pending ? '' : suggested !== null
                ? `Wyliczony: ${suggested} kcal`
                : noData ? NO_DATA_HINT : 'Wyliczenie wygląda na błędne. Sprawdź wagę i wzrost w Pomiarach.';
        }
        const restore = document.getElementById('diet-kcal-restore');
        if (restore) restore.style.display = source === 'manual' && suggested !== null ? 'inline-block' : 'none';
        const profileBox = document.getElementById('diet-kcal-profile-hint');
        if (profileBox) {
            const birth = document.getElementById('diet-kcal-birth-year');
            const text = pending ? '' : profileHint({ sex: readBodyProfile().sex, age: ageFromBirthYear(birth ? birth.value : null) });
            profileBox.textContent = text;
            profileBox.style.display = text ? 'block' : 'none';
        }
    },

    showBirthError: (text) => {
        const box = document.getElementById('diet-kcal-birth-error');
        if (!box) return;
        box.textContent = text;
        box.style.display = text ? 'block' : 'none';
        const input = document.getElementById('diet-kcal-birth-year');
        if (input) {
            if (text) input.setAttribute('aria-invalid', 'true');
            else input.removeAttribute('aria-invalid');
        }
    },

    showKcalError: (text) => {
        const box = document.getElementById('diet-kcal-manual-error');
        if (!box) return;
        box.textContent = text;
        box.style.display = text ? 'block' : 'none';
        const input = document.getElementById('diet-kcal-manual');
        if (input) {
            if (text) input.setAttribute('aria-invalid', 'true');
            else input.removeAttribute('aria-invalid');
        }
    },

    // Wyliczenie z pomiarów (Mifflin-St Jeor) z płcią i wiekiem użytkownika. `settings` z okna ustawień;
    // domyślnie zapisane ustawienia. Błędne pomiary (np. wzrost w milimetrach) poprawia lub pomija computeTdee.
    calculateTDEE: async (settings = {}) => {
        const measurements = await DatabaseManager.getMeasurements();
        const profile = readBodyProfile();
        const kcal = computeTdee(measurements, {
            activity: parseFloat(settings.activity ?? (localStorage.getItem('dietActivity') || '1.55')),
            goal: settings.goal ?? (localStorage.getItem('dietGoal') || 'maintenance'),
            sex: profile.sex,
            age: settings.birthYear !== undefined ? ageFromBirthYear(settings.birthYear) : profile.age
        });
        return kcal; // null, gdy brak pomiaru z wagą (cel domyślny wybiera resolveKcalGoal)
    },

    loadTodayData: async () => {
        const today = new Date().toISOString().split('T')[0];
        const logs = await DatabaseManager.getDietLogs(today);
        
        let totalKcal = 0;
        let totalP = 0;
        let totalC = 0;
        let totalF = 0;

        const listContainer = document.getElementById('diet-logs-list');
        if (listContainer) {
            listContainer.innerHTML = '';
            
            if (logs.length === 0) {
                listContainer.innerHTML = '<p class="z-mut diet-pusto">Jeszcze nic nie zjadłeś.</p>';
            } else {
                logs.forEach(log => {
                    totalKcal += log.calories || 0;
                    totalP += log.protein || 0;
                    totalC += log.carbs || 0;
                    totalF += log.fat || 0;

                    // Karta posiłku (plansza): nazwa, makro (z-mut), kcal Barlow 18 px; Klonuj i Usuń jako ikony 44 px.
                    const item = document.createElement('div');
                    item.className = 'diet-log-item z-card';
                    item.innerHTML = `
                        ${log.thumbnail ? `<img id="diet-list-thumb-${esc(log.id)}" class="diet-log-foto" alt="">` : ''}
                        <div class="diet-log-tekst">
                            <div class="diet-log-nazwa">${esc(log.food_name)}</div>
                            <div class="diet-log-makro z-mut">B ${liczba(log.protein)} · W ${liczba(log.carbs)} · T ${liczba(log.fat)} g</div>
                        </div>
                        <div class="diet-log-kcal">
                            <div class="z-big">${liczba(log.calories)}</div>
                            <div class="z-mut">kcal</div>
                        </div>
                        <div class="diet-log-akcje">
                            <button type="button" class="z-ic clone-diet-btn" data-log="${esc(JSON.stringify(log))}" aria-label="Klonuj" title="Klonuj">${ikona('copy', 20)}</button>
                            <button type="button" class="z-ic delete-diet-btn" data-id="${esc(log.id)}" aria-label="Usuń" title="Usuń">${ikona('trash', 20)}</button>
                        </div>
                    `;
                    listContainer.appendChild(item);
                    
                    if (log.thumbnail) {
                        MediaManager.getMediaUrl(log.thumbnail).then(url => {
                            if (url) {
                                const img = document.getElementById(`diet-list-thumb-${log.id}`);
                                if (img) img.src = url;
                            }
                        });
                    }
                });


                document.querySelectorAll('.delete-diet-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        if (confirm('Usunąć ten posiłek?')) {
                            const id = e.currentTarget.getAttribute('data-id');
                            await DatabaseManager.deleteDietLog(id);
                            DietUI.loadTodayData();
                        }
                    });
                });
                
                document.querySelectorAll('.clone-diet-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const log = JSON.parse(e.currentTarget.getAttribute('data-log'));
                        try {
                            await DatabaseManager.addDietLog({
                                date: today,
                                meal_type: log.meal_type || 'Inny',
                                food_name: log.food_name || 'Nieznany posiłek',
                                calories: log.calories || 0,
                                protein: log.protein || 0,
                                carbs: log.carbs || 0,
                                fat: log.fat || 0,
                                thumbnail: log.thumbnail || null
                            });
                            DietUI.loadTodayData();
                        } catch(e) {
                            alert("Wystąpił błąd podczas zapisu posiłku. Prawdopodobnie brak miejsca (Disk I/O). Odśwież aplikację.");
                            console.error(e);
                        }
                    });
                });
            }
        }

        // Cel: ręczny albo wyliczony; błędne wartości odrzuca strażnik (wpis w logu + komunikat, raz na zdarzenie).
        const goal = resolveKcalGoal(await DietUI.calculateTDEE());
        goal.incidents.forEach(reportKcalIncident);
        const tdee = goal.kcal;
        const noComputed = goal.source === 'auto' && goal.noData;
        setKcalSourceIcon(document.getElementById('diet-kcal-source'), noComputed ? null : goal.source, 12);
        // Podpowiedź: brak pomiarów albo przybliżona płeć lub wiek (przy ręcznym celu zbędna).
        const kcalHint = document.getElementById('diet-kcal-hint');
        if (kcalHint) {
            const text = goal.source === 'manual' ? '' : noComputed ? NO_DATA_HINT : profileHint(readBodyProfile());
            kcalHint.textContent = text;
            kcalHint.hidden = !text;
        }
        
        // Aktualizacja interfejsu: wykres kołowy (kcal z celu); makro to tylko zjedzone gramy (bez celów i pasków).
        const kcalDisplay = document.getElementById('diet-kcal-consumed');
        if (kcalDisplay) kcalDisplay.textContent = totalKcal;
        
        const tdeeDisplay = document.getElementById('diet-tdee-display');
        if (tdeeDisplay) tdeeDisplay.textContent = tdee;

        [['protein', totalP], ['carbs', totalC], ['fat', totalF]].forEach(([klucz, suma]) => {
            const display = document.getElementById(`diet-${klucz}-display`);
            if (display) display.textContent = suma;
        });

        const ring = document.getElementById('diet-kcal-ring');
        if (ring) {
            ring.style.setProperty('--z-val', procent(totalKcal, tdee));
            ring.setAttribute('aria-label', `Zjedzono ${totalKcal} z ${tdee} kcal`);
            // Przekroczony cel: liczba w kolorze akcentu (koło jest już pełne).
            ring.classList.toggle('diet-ponad-cel', totalKcal > tdee);
            
            // Render wykresu po załadowaniu dzisiejszych danych
            DietUI.loadHistoryChart(tdee);
        }
    },

    renderImagePreviews: () => {
        const previewContainer = document.getElementById('diet-image-preview-container');
        if (!previewContainer) return;
        
        previewContainer.innerHTML = '';
        if (DietUI.attachedImages.length > 0) {
            previewContainer.hidden = false;
            DietUI.attachedImages.forEach((mediaId, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'diet-zdjecie';
                
                const img = document.createElement('img');
                img.className = 'diet-zdjecie-img';
                img.alt = '';
                
                window.MediaManager.getMediaUrl(mediaId).then(url => {
                    if (url) img.src = url;
                });
                
                // Cel dotyku 44 px, widoczne kółko 24 px w rogu miniatury.
                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'z-ic diet-zdjecie-usun';
                removeBtn.setAttribute('aria-label', `Usuń zdjęcie ${index + 1}`);
                removeBtn.innerHTML = `<span class="diet-zdjecie-x">${ikona('x', 14)}</span>`;
                removeBtn.onclick = () => DietUI.removeAttachedImage(index);
                
                wrapper.appendChild(img);
                wrapper.appendChild(removeBtn);
                previewContainer.appendChild(wrapper);
            });
            
            const hint = document.createElement('span');
            hint.className = 'z-mut diet-zdjecia-ile';
            hint.textContent = `Zdjęć: ${DietUI.attachedImages.length}/3`;
            previewContainer.appendChild(hint);
        } else {
            previewContainer.hidden = true;
        }
    },

    handleImageAttach: async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        
        try {
            for (const file of files) {
                if (DietUI.attachedImages.length >= 3) {
                    alert('Możesz dodać maksymalnie 3 zdjęcia posiłku na raz.');
                    break;
                }
                const base64 = await DietUI.resizeAndToBase64(file);
                const id = await MediaManager.saveMedia(base64);
                DietUI.attachedImages.push(id);
            }
            DietUI.renderImagePreviews();
        } catch (error) {
            alert('Błąd podczas ładowania zdjęcia: ' + error.message);
        }
        
        const cameraInput = document.getElementById('diet-camera-input');
        if (cameraInput) cameraInput.value = '';
    },

    removeAttachedImage: (index) => {
        const id = DietUI.attachedImages[index];
        MediaManager.deleteMedia(id);
        DietUI.attachedImages.splice(index, 1);
        DietUI.renderImagePreviews();
    },

    handleAnalyze: async () => {
        if (window.PremiumUI && !window.PremiumUI.checkPremium()) {
            window.PremiumUI.showPremiumPaywall();
            return;
        }
        
        const contextInput = document.getElementById('diet-context-input');
        const contextText = contextInput ? contextInput.value.trim() : '';
        
        if (!contextText && DietUI.attachedImages.length === 0) {
            alert('Napisz opis posiłku lub załącz zdjęcie!');
            return;
        }

        const loading = document.getElementById('diet-loading');
        const analyzeBtn = document.getElementById('diet-analyze-btn');
        
        if (loading) {
            loading.hidden = false;
            const loadingText = document.getElementById('diet-loading-text');
            if (loadingText) loadingText.innerText = 'Edward analizuje...';
        }
        if (analyzeBtn) analyzeBtn.hidden = true;

        try {
            // Resolve base64 for AI Engine
            const base64Images = await Promise.all(DietUI.attachedImages.map(id => MediaManager.getBase64(id)));
            const result = await DietAIEngine.analyzeImage(base64Images.filter(Boolean), contextText);
            
            const thumbnails = DietUI.attachedImages.length > 0 ? DietUI.attachedImages.slice() : null;
            DietUI.showResultConfirmation(result, thumbnails, contextInput);

        } catch (error) {
            // error.diag (z DietAIEngine): kod HTTP, model, liczba prób, bezpieczny fragment odpowiedzi
            if (window.ukiLogError) window.ukiLogError('DietAI Error', error.diag ? `${error.toString()} | ${error.diag}` : error.toString());
            alert(error.message);
        } finally {
            if (loading) loading.hidden = true;
            if (analyzeBtn) analyzeBtn.hidden = false;
        }
    },

    showResultConfirmation: (result, thumbnails, contextInput) => {
        let currentKcal = parseInt(result.calories) || 0;
        const thumbnailList = Array.isArray(thumbnails) ? thumbnails : (thumbnails ? [thumbnails] : []);
        const primaryThumbnail = thumbnailList.length > 0 ? thumbnailList[0] : null;
        
        const modal = document.createElement('div');
        modal.id = 'diet-result-modal-overlay';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box;';
        
        modal.innerHTML = `
            <div style="background: #1e1e1e; padding: 20px; border-radius: 12px; border: 1px solid #FF9800; max-width: 400px; width: 100%; text-align: center; color: #fff; position: relative;">
                <h3 style="color: #FF9800; margin-top: 0; margin-bottom: 15px;">Potwierdź Posiłek</h3>
                <div id="diet-result-thumbnail-container" style="margin-bottom: 15px;"></div>
                
                <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 15px; color: #fff; word-break: break-word;">
                    ${esc(result.food_name || 'Nieznany posiłek')}
                </div>
                
                <div style="background: rgba(255,152,0,0.1); border: 1px solid rgba(255,152,0,0.3); border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                    <div style="margin-bottom: 10px; color: #aaa;">Kalorie:</div>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
                        <button id="btn-minus-kcal" style="background: rgba(255, 68, 68, 0.2); border: 1px solid #ff4444; color: #ff4444; width: 45px; height: 45px; border-radius: 50%; font-size: 1.8em; cursor: pointer; display: flex; justify-content: center; align-items: center; padding-bottom: 3px;">-</button>
                        <input type="number" id="diet-result-kcal-display" value="${currentKcal}" style="font-size: 2em; font-weight: bold; color: #FF9800; min-width: 100px; width: 120px; text-align: center; background: transparent; border: none; outline: none; -moz-appearance: textfield;">
                        <button id="btn-plus-kcal" style="background: rgba(76, 175, 80, 0.2); border: 1px solid #4CAF50; color: #4CAF50; width: 45px; height: 45px; border-radius: 50%; font-size: 1.8em; cursor: pointer; display: flex; justify-content: center; align-items: center; padding-bottom: 3px;">+</button>
                    </div>
                </div>

                <div style="font-size: 1.25em; color: #ddd; margin-bottom: 25px; display: flex; justify-content: space-between; padding: 0 10px;">
                    <span><strong style="color: #4CAF50; font-size: 1.1em;">B:</strong> ${parseInt(result.protein) || 0}g</span>
                    <span><strong style="color: #2196F3; font-size: 1.1em;">W:</strong> ${parseInt(result.carbs) || 0}g</span>
                    <span><strong style="color: #E91E63; font-size: 1.1em;">T:</strong> ${parseInt(result.fat) || 0}g</span>
                </div>

                <div style="display: flex; gap: 15px;">
                    <button id="diet-result-cancel" style="flex: 1; padding: 15px; font-size: 1.1em; background: transparent; border: 1px solid #555; color: #ccc; border-radius: 8px; cursor: pointer; font-weight: bold;">Anuluj</button>
                    <button id="diet-result-save" style="flex: 1; padding: 15px; font-size: 1.1em; background: #FF9800; border: none; color: #000; border-radius: 8px; cursor: pointer; font-weight: bold;">Zapisz</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        if (thumbnailList.length > 0) {
            const container = document.getElementById('diet-result-thumbnail-container');
            if (container) {
                container.style.display = 'flex';
                container.style.justifyContent = 'center';
                container.style.gap = '8px';
                container.style.flexWrap = 'wrap';
                thumbnailList.forEach(thumb => {
                    MediaManager.getMediaUrl(thumb).then(url => {
                        if (url) {
                            const img = document.createElement('img');
                            img.src = url;
                            img.style.cssText = 'width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #FF9800;';
                            container.appendChild(img);
                        }
                    });
                });
            }
        }

        const inputKcal = document.getElementById('diet-result-kcal-display');

        const updateKcalDisplay = () => {
            inputKcal.value = currentKcal;
        };

        inputKcal.addEventListener('change', (e) => {
            currentKcal = Math.max(0, parseInt(e.target.value) || 0);
            updateKcalDisplay();
        });

        document.getElementById('btn-minus-kcal').addEventListener('click', () => {
            currentKcal = Math.max(0, currentKcal - 1);
            updateKcalDisplay();
        });

        document.getElementById('btn-plus-kcal').addEventListener('click', () => {
            currentKcal += 1;
            updateKcalDisplay();
        });

        document.getElementById('diet-result-cancel').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('diet-result-save').addEventListener('click', async () => {
            modal.remove();
            
            // Adjust macros proportionally if calories changed? 
            // Or just save the manually adjusted calories. Let's just save the calories.
            const today = new Date().toISOString().split('T')[0];
            await DatabaseManager.addDietLog({
                date: today,
                meal_type: 'Inny',
                food_name: result.food_name || 'Nieznany posiłek',
                calories: currentKcal,
                protein: parseInt(result.protein) || 0,
                carbs: parseInt(result.carbs) || 0,
                fat: parseInt(result.fat) || 0,
                thumbnail: primaryThumbnail
            });

            if (contextInput) contextInput.value = '';
            DietUI.attachedImages = [];
            DietUI.renderImagePreviews();
            
            DietUI.loadTodayData();
        });
    },

    
    showHistoryMealsModal: async (date) => {
        const logs = await DatabaseManager.getDietLogs(date);
        
        const modal = document.createElement('div');
        modal.id = 'diet-history-meals-modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; justify-content: center; align-items: center; padding: 15px; box-sizing: border-box;';
        
        let mealsHtml = '';
        if (logs.length === 0) {
            mealsHtml = '<p style="color:#aaa; text-align:center;">Brak posiłków tego dnia.</p>';
        } else {
            logs.forEach(log => {
                mealsHtml += `
                    <div style="background: rgba(0,0,0,0.3); border: 1px solid #333; border-radius: 8px; padding: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="color: #FF9800; font-weight: bold; font-size: 1.05em; margin-bottom: 5px;">${esc(log.food_name || 'Posiłek')}</div>
                            <div style="display:flex; gap:10px; font-size:0.85em;">
                                <span style="color:#4CAF50">B: ${esc(log.protein)}g</span>
                                <span style="color:#2196F3">W: ${esc(log.carbs)}g</span>
                                <span style="color:#E91E63">T: ${esc(log.fat)}g</span>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="color: #fff; font-weight: bold; font-size: 1.1em;">${esc(log.calories)} kcal</div>
                            <button onclick="DatabaseManager.deleteDietLog(${Number(log.id)}).then(() => { document.getElementById('diet-history-meals-modal').remove(); window.DietUI.loadTodayData(); })" style="background: transparent; color: #ff4444; border: 1px solid #ff4444; border-radius: 4px; padding: 3px 8px; font-size: 0.8em; margin-top: 5px; cursor: pointer;">Usuń</button>
                        </div>
                    </div>
                `;
            });
        }
        
        modal.innerHTML = `
            <div style="background: #1e1e1e; padding: 20px; border-radius: 12px; border: 1px solid #FF9800; max-width: 400px; width: 100%; max-height: 80vh; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px; margin-bottom: 15px;">
                    <h3 style="color: #FF9800; margin: 0;">Posiłki z dnia: ${esc(date)}</h3>
                    <button onclick="this.closest('#diet-history-meals-modal').remove()" style="background: none; border: none; color: #fff; font-size: 1.5em; cursor: pointer;">&times;</button>
                </div>
                <div style="overflow-y: auto; flex: 1;">
                    ${mealsHtml}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    // „Historia 30 dni” (plansza): 30 mini-słupków i „śr. X kcal” z narysowanych dni z wpisami. Każdy dzień to przycisk
    // na całą wysokość wykresu z etykietą „DD.MM: N kcal” (dzień bez wpisów: wyłączony); klik albo Enter pokazuje
    // posiłki z tego dnia. Dziś akcentem, dni ponad cel kolorem ostrzeżenia, przerywana linia celu, skala dat pod spodem.
    loadHistoryChart: async (tdee) => {
        const historyContainer = document.getElementById('diet-history-chart');
        if (!historyContainer) return;
        const karta = historyContainer.closest('.diet-historia') || document;
        const srednia = karta.querySelector('.diet-historia-sr');
        const daty = karta.querySelector('.diet-historia-daty');
        const legenda = karta.querySelector('.diet-historia-legenda');
        
        const history = await DatabaseManager.getDietLogsHistory(30);
        historyContainer.innerHTML = '';

        // Dni jak „dziś” w loadTodayData (data UTC), od 29 dni temu do dziś. Baza oddaje 31 dni (>= dziś − 30),
        // więc średnią i skalę liczymy tylko z narysowanych dni.
        const today = new Date().toISOString().split('T')[0];
        const start = new Date(`${today}T00:00:00Z`);
        const dni = Array.from({ length: 30 }, (_, i) => new Date(start.getTime() - (29 - i) * 86400000).toISOString().split('T')[0]);
        const wszystkie = new Map(history.map(log => [log.date, liczba(log.total_calories)]));
        const kcal = new Map(dni.filter(d => wszystkie.has(d)).map(d => [d, wszystkie.get(d)]));
        const pusto = kcal.size === 0;
        [historyContainer, daty, legenda].forEach(el => { if (el) el.hidden = pusto; });
        if (pusto) {
            if (srednia) srednia.textContent = 'Brak danych. Dodaj posiłki.';
            return;
        }

        const cel = liczba(tdee);
        const skala = Math.max(cel, ...kcal.values());
        const sr = Math.round([...kcal.values()].reduce((a, v) => a + v, 0) / kcal.size);
        const ddmm = (d) => `${d.slice(8, 10)}.${d.slice(5, 7)}`;
        if (srednia) srednia.textContent = `śr. ${sr} kcal`;
        historyContainer.setAttribute('aria-label', `Historia 30 dni: średnio ${sr} kcal, dziś ${kcal.get(today) || 0} kcal`);

        historyContainer.innerHTML = dni.map(d => {
            const v = kcal.get(d) || 0;
            const ponad = cel > 0 && v > cel;
            const klasy = ['diet-dzien', d === today ? 'z-today' : '', ponad ? 'diet-ponad' : ''].filter(Boolean).join(' ');
            const opis = `${ddmm(d)}: ${v} kcal${ponad ? ', ponad cel' : ''}${d === today ? ', dziś' : ''}`;
            return `<button type="button" class="${klasy}" data-date="${d}" aria-label="${opis}" title="${opis}"${kcal.has(d) ? '' : ' disabled'}><span class="diet-dzien-slupek" style="height: ${procent(v, skala)}"></span></button>`;
        }).join('') + (cel > 0 ? `<div class="diet-historia-cel" aria-hidden="true" style="bottom: ${procent(cel, skala)}"></div>` : '');

        historyContainer.querySelectorAll('.diet-dzien:not([disabled])').forEach(btn => {
            btn.addEventListener('click', () => DietUI.showHistoryMealsModal(btn.dataset.date));
        });
        if (daty) daty.innerHTML = [dni[0], dni[14], dni[29]].map(d => `<span>${ddmm(d)}</span>`).join('');
        if (legenda) {
            legenda.innerHTML = `<span class="z-chart-key diet-klucz-ponad">ponad cel ${cel} kcal</span><span class="z-chart-key diet-klucz-dzis">dziś</span>`;
        }
    },

    resizeAndToBase64: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800; // Mniejsza rozdziałka wystarczy dla Gemini i przyspiesza upload
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
            };
            reader.onerror = error => reject(error);
        });
    }
};

window.DietUI = DietUI;
