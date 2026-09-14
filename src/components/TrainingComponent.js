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

                <!-- Dodatkowy padding na dole, by nie przysłaniać ostatniego ćwiczenia -->
                <div style="height: 120px;"></div>

                <!-- UNIFIED BOTTOM SHEET -->
                <div id="unified-bottom-sheet" style="position: sticky; bottom: 0; left: 0; right: 0; width: 100%; max-width: 800px; margin: 0 auto; z-index: 2000; background: #1C1C1E; border-top-left-radius: 24px; border-top-right-radius: 24px; box-shadow: 0 -10px 40px rgba(0,0,0,0.8); padding: 15px 20px calc(20px + env(safe-area-inset-bottom, 20px)) 20px; box-sizing: border-box; display: flex; flex-direction: column; gap: 15px; transition: transform 0.3s ease;">
                    
                    <!-- Drag handle (Toggles list visibility) -->
                    <div style="padding: 10px 0; cursor: pointer; display: flex; justify-content: center;" onclick="const list = document.getElementById('bs-action-list'); list.style.display = list.style.display === 'none' ? 'flex' : 'none';">
                        <div style="width: 50px; height: 5px; background: #555; border-radius: 3px;"></div>
                    </div>
                    
                    <!-- List items (Hideable) -->
                    <div id="bs-action-list" style="display: none; flex-direction: column; gap: 20px; margin-bottom: 10px;">
                        <div style="display: flex; align-items: center; gap: 15px; cursor: pointer;">
                            <span style="color: #888;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></span>
                            <span style="color: #FFF; font-size: 16px; font-weight: 400; flex: 1;">Załącz zdjęcia z treningu</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px; cursor: pointer;">
                            <span style="color: #888;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="4"/><path d="M12 14h.01"/><path d="M12 10h.01"/></svg></span>
                            <span style="color: #FFF; font-size: 16px; font-weight: 400; flex: 1;">Dodaj dane ze Smartwatcha</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px; cursor: pointer;">
                            <span style="color: #888;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg></span>
                            <span style="color: #FFF; font-size: 16px; font-weight: 400; flex: 1;">Zapisz jako Plan Treningowy</span>
                        </div>
                    </div>

                    <!-- Buttons (Always visible) -->
                    <div style="display: flex; gap: 10px;">
                        <button type="button" id="pause-training-btn" style="flex: 1; padding: 16px; background: rgba(255,193,7,0.15); border: 1px solid #FFC107; color: #FFC107; border-radius: 12px; font-weight: 600; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg> Pauza
                        </button>
                        <button type="button" id="finish-training-btn" style="flex: 1; padding: 16px; background: #E74C3C; border: none; color: #FFF; border-radius: 12px; font-weight: 600; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg> Zakończ Trening
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        `;
    }
};
