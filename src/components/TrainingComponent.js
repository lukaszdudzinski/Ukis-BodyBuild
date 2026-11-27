// wyglad: zar
import { naglowek } from '../modules/wyglad/naglowek.js';
import { ikona } from '../modules/wyglad/ikony.js';

export const TrainingComponent = {
    render: () => {
        return `
            ${naglowek({ wariant: 'main', tytul: 'Trening', podtytul: 'Zaplanuj i wykonuj treningi' })}
            
            <!-- Kalendarz i karta dnia (spec 8.3, plansza TreningKalendarz; kolory w styles/zar/ekrany/trening-kalendarz.css) -->
            <div id="training-calendar-view">
                <div class="z-card z-kal">
                    <div class="calendar-header z-kal-nav">
                        <button type="button" id="cal-prev-month" class="z-ic" aria-label="Poprzedni miesiąc">${ikona('chevron-left', 20)}</button>
                        <h3 id="cal-month-year" class="z-hd z-kal-miesiac">Miesiąc Rok</h3>
                        <button type="button" id="cal-next-month" class="z-ic" aria-label="Następny miesiąc">${ikona('chevron-right', 20)}</button>
                    </div>

                    <div class="calendar-grid z-kal-siatka" id="training-calendar-grid">
                        <!-- TrainingUI.renderCalendar -->
                    </div>

                    <div id="cal-legend" class="z-kal-legenda">
                        <span class="z-kal-leg"><span class="z-kal-znak z-wykonany" aria-hidden="true"></span>Wykonany</span>
                        <span class="z-kal-leg"><span class="z-kal-znak z-zaplanowany" aria-hidden="true"></span>Zaplanowany</span>
                        <span class="z-kal-leg"><span class="z-kal-znak z-pominiety" aria-hidden="true"></span>Pominięty</span>
                    </div>
                </div>

                <!-- Karta dnia (ukryta do wyboru dnia); stany: zaplanowany, wykonany, pusty -->
                <div id="day-action-panel" class="z-card z-dzien" style="display: none;">
                    <div class="z-dzien-gora">
                        <h4 id="selected-day-label" class="z-dzien-data">Dzień</h4>
                        <span id="day-status-pill" class="z-pill" hidden></span>
                    </div>

                    <div id="day-action-planned-state" class="z-dzien-stan" style="display: none;">
                        <div id="planned-training-preview" class="z-dzien-stan">
                            <!-- TrainingUI.handleDayClick -->
                        </div>
                        <div class="z-dzien-rzad">
                            <button type="button" id="postpone-planned-btn" class="z-ghost">Przełóż na jutro</button>
                            <button type="button" id="cancel-planned-btn" class="z-ghost">Pomiń dzień</button>
                        </div>
                    </div>

                    <div id="day-action-existing-state" class="z-dzien-stan" style="display: none;">
                        <div id="existing-training-preview" class="z-dzien-stan">
                            <!-- TrainingUI.handleDayClick -->
                        </div>
                    </div>

                    <div id="day-action-empty-state" class="z-dzien-stan">
                        <div class="z-sep" id="day-action-sep"></div>
                        <div class="z-dzien-rzad z-dzien-akcje">
                            <button type="button" id="start-new-session-btn" class="z-ghost">+ Nowa sesja</button>
                            <button type="button" id="load-template-session-btn" class="z-ghost">Szablony</button>
                            <button type="button" id="copy-session-btn" class="z-ghost" aria-expanded="false" aria-controls="history-sessions-list" onclick="window.TrainingUI.toggleCopyList()">Skopiuj</button>
                        </div>
                        <div id="history-sessions-list" class="z-dzien-stan" hidden>
                            <!-- TrainingUI.handleDayClick: ostatnie sesje do skopiowania -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sesja treningu (spec 8.3, plansza TreningSesja; wygląd w styles/zar/ekrany/trening-sesja.css).
                 Podczas sesji body ma klasę z-sesja (TrainingUI.odswiezTrybSesji): bez paska dolnego. -->
            <div id="active-training-view" class="z-sesja-widok" style="display: none;">
                <div class="z-sesja-gora">
                    <button type="button" id="session-back-btn" class="z-ic z-card" aria-label="Wróć" onclick="window.TrainingUI.wrocZSesji()">${ikona('chevron-left', 20)}</button>
                    <div class="z-sesja-czas">
                        <div class="z-mut">Czas trwania</div>
                        <div class="z-sesja-zegar"><span id="training-timer">00:00:00</span></div>
                    </div>
                    <button type="button" id="manual-duration-btn" class="z-ic z-card" aria-label="Wpisz czas ręcznie" aria-pressed="false" aria-controls="manual-duration-inputs" onclick="window.TrainingUI.przelaczCzasReczny()">${ikona('clock', 20)}</button>
                </div>

                <!-- Czas wpisany ręcznie: pole wyboru zostaje źródłem prawdy dla zapisu i szkicu (TrainingUI). -->
                <input type="checkbox" id="manual-duration-toggle" hidden onchange="window.TrainingUI.pokazCzasReczny()">
                <div id="manual-duration-inputs" class="z-card z-sesja-reczny" style="display: none;">
                    <span class="z-mut">Czas treningu</span>
                    <label class="z-sr" for="manual-training-hours">Godziny</label>
                    <input type="number" id="manual-training-hours" class="z-in" placeholder="00" min="0" max="23" inputmode="numeric">
                    <span class="z-mut" aria-hidden="true">:</span>
                    <label class="z-sr" for="manual-training-minutes">Minuty</label>
                    <input type="number" id="manual-training-minutes" class="z-in" placeholder="00" min="0" max="59" inputmode="numeric">
                </div>

                <label class="z-sr" for="training-name-input">Nazwa treningu</label>
                <input type="text" id="training-name-input" class="z-in z-sesja-nazwa" placeholder="Nazwa treningu">

                <!-- Żetony rodzaju ustawiają ten sam stan co #training-type-select (handleTypeChange). -->
                <div class="z-sesja-rodzaje" role="group" aria-label="Rodzaj treningu">
                    <button type="button" class="z-chip z-on" data-rodzaj="strength" aria-pressed="true" onclick="window.TrainingUI.handleTypeChange('strength')">Siłowy</button>
                    <button type="button" class="z-chip" data-rodzaj="cardio" aria-pressed="false" onclick="window.TrainingUI.handleTypeChange('cardio')">Cardio</button>
                    <button type="button" class="z-chip" data-rodzaj="class" aria-pressed="false" onclick="window.TrainingUI.handleTypeChange('class')">Zajęcia</button>
                </div>
                <select id="training-type-select" hidden onchange="window.TrainingUI.handleTypeChange(this.value)">
                    <option value="strength" selected>Trening siłowy</option>
                    <option value="cardio">Cardio</option>
                    <option value="class">Zajęcia zorganizowane</option>
                </select>

                <div id="class-type-container" style="display: none;">
                    <label class="z-sr" for="class-type-select">Rodzaj zajęć</label>
                    <select id="class-type-select" class="z-in" onchange="window.TrainingUI.handleClassChange(this.value)">
                        <option value="" disabled selected>Wybierz zajęcia…</option>
                        <option value="Tabata">Tabata</option>
                        <option value="Les Mills CORE">Les Mills CORE (płaski brzuch)</option>
                        <option value="Les Mills BODYPUMP">Les Mills BODYPUMP Heavy</option>
                        <option value="Pośladki i Brzuch">Pośladki i Brzuch</option>
                        <option value="HYROX">HYROX</option>
                        <option value="Rowery / Spinning">Rowery / Spinning</option>
                        <option value="custom">Własne (wpisz poniżej)</option>
                    </select>
                </div>

                <div id="exercises-container-section" class="z-sesja-cwiczenia">
                    <div id="current-exercises-list" class="z-sesja-lista">
                        <!-- TrainingUI.renderCurrentExercises -->
                    </div>
                    <button type="button" id="add-exercise-to-plan-btn" class="z-ghost z-sesja-dodaj">+ Dodaj ćwiczenie</button>
                </div>

                <!-- Pasek akcji: pływająca karta nad treścią (pwa-updater.js przesuwa go nad pasek aktualizacji). -->
                <div id="unified-bottom-sheet" class="z-card z-sesja-akcje">
                    <div id="bs-action-list" class="z-sesja-wiecej" hidden>
                        <label class="z-li z-sesja-wiecej-poz">
                            ${ikona('camera', 20)}<span>Załącz zdjęcia z treningu</span>
                            <input type="file" accept="image/*" class="z-sr" onchange="window.TrainingUI.handleTrainingPhoto(event)">
                        </label>
                        <div id="training-social-photos-list" class="z-sesja-zdjecia"></div>
                        <button type="button" id="bs-smartwatch-btn" class="z-li z-sesja-wiecej-poz" aria-expanded="false" aria-controls="smartwatch-fields" onclick="window.TrainingUI.przelaczSmartwatch()">
                            ${ikona('clock', 20)}<span>Dodaj dane ze smartwatcha</span>
                        </button>
                        <div id="smartwatch-fields" class="z-sesja-smartwatch" hidden>
                            <label class="z-sesja-pole"><span class="z-mut">Kalorie (kcal)</span>
                                <input type="number" id="smartwatch-calories" class="z-in" min="0" inputmode="numeric" onchange="window.TrainingUI.saveDraft()"></label>
                            <label class="z-sesja-pole"><span class="z-mut">Średnie tętno</span>
                                <input type="number" id="smartwatch-hr" class="z-in" min="0" inputmode="numeric" onchange="window.TrainingUI.saveDraft()"></label>
                        </div>
                        <button type="button" id="save-as-template-btn" class="z-li z-sesja-wiecej-poz">
                            ${ikona('download', 20)}<span>Zapisz jako plan treningowy</span>
                        </button>
                        <!-- R18: w sesji pływający przycisk Edwarda jest ukryty, więc Edward jest tutaj. -->
                        <button type="button" id="bs-edward-btn" class="z-li z-sesja-wiecej-poz" onclick="window.TrainingUI.otworzEdwarda()">
                            ${ikona('bot', 20)}<span>Zapytaj Edwarda</span>
                        </button>
                    </div>
                    <div class="z-sesja-akcje-rzad">
                        <button type="button" id="bs-more-btn" class="z-ghost z-sesja-wiecej-btn" aria-label="Więcej: zdjęcia, smartwatch, zapisz jako plan, Edward" aria-expanded="false" aria-controls="bs-action-list" onclick="window.TrainingUI.przelaczWiecej()">${ikona('more-horizontal', 22)}</button>
                        <button type="button" id="pause-training-btn" class="z-ghost z-sesja-pauza" aria-pressed="false">${ikona('pause', 18)}Pauza</button>
                        <button type="button" id="finish-training-btn" class="z-btn z-sesja-zakoncz">Zakończ</button>
                    </div>
                </div>
            </div>
        `;
    }
};
