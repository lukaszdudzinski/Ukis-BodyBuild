export const TrainingComponent = {
    render: () => {
        return `
            <div class="view-header">
                <h2>Trening</h2>
                <p style="color: #b0b0b0;">Zaplanuj i wykonuj treningi</p>
            </div>
            
            <!-- Calendar View -->
            <div id="training-calendar-view">
                <div class="calendar-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <button id="cal-prev-month" class="icon-btn">◀</button>
                    <h3 id="cal-month-year" style="margin: 0; color: #00BFFF;">Miesiąc Rok</h3>
                    <button id="cal-next-month" class="icon-btn">▶</button>
                </div>
                
                <div class="calendar-grid" id="training-calendar-grid">
                    <!-- Populated by JS -->
                </div>

                <!-- Day Action Panel (hidden by default) -->
                <div id="day-action-panel" style="display: none; margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.4); border: 1px solid #00BFFF; border-radius: 8px;">
                    <h4 id="selected-day-label" style="color: #00BFFF; margin-bottom: 15px; text-align: center;">Opcje dla dnia</h4>
                    
                    <div id="day-action-existing-state" style="display: none; text-align: center; margin-bottom: 20px;">
                        <h5 style="color: #00BFFF; margin-bottom: 10px;">🏋️ Treningi w tym dniu:</h5>
                        <div id="existing-training-preview" style="margin-bottom: 15px; color: #ccc;">
                            <!-- Previews of existing trainings -->
                        </div>
                    </div>
                    <div id="day-action-planned-state" style="display: none; text-align: center; margin-bottom: 20px;">
                        <h5 style="color: #FF9800; margin-bottom: 10px;">📅 Zaplanowano na ten dzień:</h5>
                        <div id="planned-training-preview" style="margin-bottom: 15px; color: #ccc;">
                            <!-- Populated by JS -->
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button id="postpone-planned-btn" class="action-button" style="flex: 1; background-color: rgba(255, 255, 255, 0.1); border-color: #888; color: #ccc; font-size: 0.9em;">Przełóż na jutro</button>
                            <button id="cancel-planned-btn" class="action-button" style="flex: 1; background-color: rgba(231, 76, 60, 0.2); border-color: #E74C3C; color: #E74C3C; font-size: 0.9em;">Anuluj trening</button>
                        </div>
                    </div>

                    <div id="day-action-empty-state">
                        <button id="start-new-session-btn" class="action-button pulse" style="width: 100%; margin-bottom: 10px; background-color: rgba(0, 191, 255, 0.2); border-color: #00BFFF; color: #00BFFF;">➕ Dodaj nową sesję treningową</button>
                        <button id="load-template-session-btn" class="action-button" style="width: 100%; margin-bottom: 10px; background-color: rgba(255, 152, 0, 0.2); border-color: #FF9800; color: #FF9800;">📄 Wybierz Szablon Treningowy</button>
                        <button onclick="window.TemplateBuilderUI && window.TemplateBuilderUI.openBuilder()" class="action-button" style="width: 100%; margin-bottom: 10px; background-color: rgba(46, 204, 113, 0.2); border-color: #2ECC71; color: #2ECC71;">✨ Kreator Szablonów (Koszyk)</button>
                        <div id="history-sessions-list" style="margin-top: 15px;">
                            <h5 style="color: #ccc; margin-bottom: 10px;">📋 Skopiuj sesję treningową:</h5>
                            <!-- Populated with recent sessions -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Active Training View -->
            <div id="active-training-view" style="display: none;">
                <div style="margin-bottom: 15px;">
                    <input type="text" id="training-name-input" placeholder="Wpisz nazwę treningu..." style="width: 100%; padding: 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); background: #111118; color: #FFF; font-size: 18px; font-weight: 600; text-align: center; box-sizing: border-box; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                </div>

                <div style="margin-bottom: 15px;">
                    <select id="training-type-select" class="training-select" onchange="window.TrainingUI.handleTypeChange(this.value)">
                        <option value="strength" selected>Trening Siłowy</option>
                        <option value="cardio">Cardio</option>
                        <option value="class">Zajęcia Zorganizowane</option>
                    </select>
                </div>
                
                <div id="class-type-container" style="display: none; margin-bottom: 15px;">
                    <select id="class-type-select" class="training-select" onchange="window.TrainingUI.handleClassChange(this.value)">
                        <option value="" disabled selected>Wybierz zajęcia...</option>
                        <option value="Tabata">Tabata</option>
                        <option value="Les Mills CORE">Les Mills CORE (płaski brzuch)</option>
                        <option value="Les Mills BODYPUMP">Les Mills BODYPUMP Heavy</option>
                        <option value="Pośladki i Brzuch">Pośladki i Brzuch</option>
                        <option value="HYROX">HYROX</option>
                        <option value="Rowery / Spinning">Rowery / Spinning</option>
                        <option value="custom">Własne (wpisz poniżej)</option>
                    </select>
                </div>
                
                <div style="background: #111118; padding: 15px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); text-align: center; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <div style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Czas trwania</div>
                    <h3 style="margin: 0; color: #FFF; font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums;"><span id="training-timer">00:00:00</span></h3>
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                        <label style="display: flex; align-items: center; gap: 8px; color: #ccc; font-size: 0.9em; cursor: pointer;">
                            <input type="checkbox" id="manual-duration-toggle" onchange="document.getElementById('manual-duration-inputs').style.display = this.checked ? 'flex' : 'none'" style="cursor: pointer;">
                            Wpisz czas treningu ręcznie
                        </label>
                        <div id="manual-duration-inputs" style="display: none; align-items: center; gap: 5px;">
                            <input type="number" id="manual-training-hours" placeholder="00" min="0" max="23" style="width: 50px; padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; text-align: center;" inputmode="numeric">
                            <span style="color: #888; font-weight: bold;">:</span>
                            <input type="number" id="manual-training-minutes" placeholder="00" min="0" max="59" style="width: 50px; padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; text-align: center;" inputmode="numeric">
                        </div>
                    </div>
                </div>



                <div class="form-full-width" id="exercises-container-section">
                    <h4 style="color: #00BFFF; margin-bottom: 10px; border-bottom: 1px solid rgba(0,191,255,0.2); padding-bottom: 5px;">Bieżące ćwiczenia</h4>
                    
                    <div id="current-exercises-list">
                        <!-- Populated by JS with Exercise Blocks -->
                    </div>
                    
                    <div style="margin-top: 15px;">
                        <button type="button" id="add-exercise-to-plan-btn" class="action-button" style="width: 100%; background-color: #00D26A; border: none; border-radius: 12px; color: #000; font-weight: 700; font-size: 16px; padding: 14px;">+ Dodaj ćwiczenie</button>
                    </div>
                </div>

                <!-- BOTTOM SHEET WRAPPER -->
                <div class="bottom-sheet-wrapper" style="position: fixed; bottom: 0; left: 0; width: 100%; z-index: 100; pointer-events: none;">
                    
                    <!-- Szufladka (Bottom Sheet) z rzadkimi opcjami -->
                    <div id="training-bottom-sheet" style="background: #111118; border-top-left-radius: 20px; border-top-right-radius: 20px; padding: 20px; transform: translateY(100%); transition: transform 0.3s ease-out; pointer-events: auto; border: 1px solid rgba(255,255,255,0.05); border-bottom: none; box-shadow: 0 -5px 25px rgba(0,0,0,0.8);">
                        <div style="width: 40px; height: 5px; background: #333; border-radius: 3px; margin: 0 auto 20px auto; cursor: pointer;" onclick="document.getElementById('training-bottom-sheet').style.transform = 'translateY(100%)'"></div>
                        
                        <!-- Elementy w szufladzie -->
                        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 90px;"> <!-- Margin bottom for sticky footer clearance -->
                            <details style="background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                                <summary style="padding: 15px; color: #FFF; font-weight: 500; cursor: pointer; user-select: none; list-style: none; display: flex; align-items: center; gap: 10px;">
                                    <span style="font-size: 1.2em;">📸</span> Załącz zdjęcia z treningu
                                </summary>
                                <div style="padding: 15px; border-top: 1px solid rgba(255,255,255,0.05);">
                                    <div style="display: flex; gap: 10px; justify-content: flex-start; flex-wrap: wrap;" id="training-photos-container">
                                        <label style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 70px; height: 70px; border: 1px dashed rgba(255,255,255,0.2); border-radius: 8px; cursor: pointer; background: rgba(255,255,255,0.02);">
                                            <span style="font-size: 1.5em; color: #FFF;">+</span>
                                            <input type="file" accept="image/*" style="display: none;" onchange="window.TrainingUI.handleTrainingPhoto(event)">
                                        </label>
                                    </div>
                                </div>
                            </details>

                            <details style="background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                                <summary style="padding: 15px; color: #FFF; font-weight: 500; cursor: pointer; user-select: none; list-style: none; display: flex; align-items: center; gap: 10px;">
                                    <span style="font-size: 1.2em;">⌚</span> Dodaj dane ze Smartwatcha
                                </summary>
                                <div style="padding: 15px; border-top: 1px solid rgba(255,255,255,0.05);">
                                    <div style="display: flex; gap: 10px;">
                                        <div style="flex: 1;">
                                            <label style="color: #888; font-size: 0.8em;">Kalorie (kcal)</label>
                                            <input type="number" id="smartwatch-calories" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #333; background: #000; color: #FFF; margin-top: 5px; box-sizing: border-box;" inputmode="numeric">
                                        </div>
                                        <div style="flex: 1;">
                                            <label style="color: #888; font-size: 0.8em;">Tętno (bpm)</label>
                                            <input type="number" id="smartwatch-hr" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #333; background: #000; color: #FFF; margin-top: 5px; box-sizing: border-box;" inputmode="numeric">
                                        </div>
                                    </div>
                                </div>
                            </details>

                            <button type="button" id="save-as-template-btn" style="width: 100%; padding: 15px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #FFF; font-weight: 500; text-align: left; display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <span style="font-size: 1.2em;">💾</span> Zapisz jako Plan Treningowy
                            </button>
                            
                            <button type="button" id="cancel-training-btn" style="width: 100%; padding: 15px; background: rgba(231, 76, 60, 0.1); border: 1px solid rgba(231, 76, 60, 0.2); border-radius: 12px; color: #E74C3C; font-weight: 500; text-align: left; display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <span style="font-size: 1.2em;">❌</span> Anuluj Trening
                            </button>
                        </div>
                    </div>

                    <!-- Pływający pasek akcji (Sticky Footer) -->
                    <div style="background: #111118; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); padding: 15px; border-top: 1px solid rgba(255,255,255,0.05); pointer-events: auto; position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; margin: 0 auto; max-width: 800px; width: 100%; box-sizing: border-box;">
                        
                        <!-- Toggle szuflady -->
                        <div style="display: flex; justify-content: center; margin-bottom: 10px;">
                            <div onclick="const sheet = document.getElementById('training-bottom-sheet'); sheet.style.transform = sheet.style.transform === 'translateY(0%)' ? 'translateY(100%)' : 'translateY(0%)'" style="width: 50px; height: 6px; background: #333; border-radius: 3px; cursor: pointer;"></div>
                        </div>

                        <div style="display: flex; gap: 10px;">
                            <button type="button" id="pause-training-btn" style="flex: 1; padding: 16px; background: #FFC107; color: #000; border: none; border-radius: 12px; font-weight: bold; font-size: 1.1em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                <span>⏸</span> Pauza
                            </button>
                            <button type="button" id="finish-training-btn" style="flex: 1; padding: 16px; background: #00D26A; color: #000; border: none; border-radius: 12px; font-weight: bold; font-size: 1.1em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                <span style="display:inline-block; transform: scale(1.2);">⏹</span> Zakończ
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Dodatkowy padding na dole, by nie przysłaniać ostatniego ćwiczenia -->
                <div style="height: 120px;"></div>
            </div>
        `;
    }
};
