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

                    <div id="day-action-empty-state">
                        <button id="start-new-session-btn" class="action-button pulse" style="width: 100%; margin-bottom: 10px; background-color: rgba(0, 191, 255, 0.2); border-color: #00BFFF; color: #00BFFF;">➕ Dodaj nową sesję treningową</button>
                        <button id="load-template-session-btn" class="action-button" style="width: 100%; margin-bottom: 10px; background-color: rgba(255, 152, 0, 0.2); border-color: #FF9800; color: #FF9800;">📄 Załaduj Plan Treningowy</button>
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
                    <input type="text" id="training-name-input" placeholder="NAZWA Treningu (opcjonalnie)" style="width: 100%; padding: 12px; border-radius: 4px; border: 1px solid #ff4444; background: #222; color: #ff4444; font-size: 1.1em; text-align: center; box-sizing: border-box;">
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
                
                <div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 8px; border: 1px solid #00BFFF; text-align: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #00BFFF; margin-bottom: 10px;">Czas trwania: <span id="training-timer">00:00:00</span></h3>
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

                <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">
                    <button type="button" class="action-button" style="background-color: #1DB954; border-color: #1DB954; color: #000; font-weight: bold; padding: 8px 15px; border-radius: 20px;" onclick="window.open('https://open.spotify.com/', '_blank')">🎵 Spotify</button>
                    <button type="button" class="action-button" style="background-color: #FF0000; border-color: #FF0000; color: #fff; font-weight: bold; padding: 8px 15px; border-radius: 20px;" onclick="window.open('https://music.youtube.com/', '_blank')">🎶 YT Music</button>
                </div>

                <div class="form-full-width" id="exercises-container-section">
                    <h4 style="color: #00BFFF; margin-bottom: 10px; border-bottom: 1px solid rgba(0,191,255,0.2); padding-bottom: 5px;">Bieżące ćwiczenia</h4>
                    
                    <div id="current-exercises-list">
                        <!-- Populated by JS with Exercise Blocks -->
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button type="button" id="add-exercise-to-plan-btn" class="action-button" style="flex: 1; background-color: rgba(0, 191, 255, 0.1); border-color: #00BFFF; color: #00BFFF;">+ Dodaj ćwiczenie</button>
                        <button type="button" id="add-superset-to-plan-btn" class="action-button" style="flex: 1; background-color: rgba(233, 30, 99, 0.1); border-color: #E91E63; color: #E91E63;">🔗 Dodaj Superserię</button>
                    </div>
                </div>

                <!-- Social Media Photos -->
                <div class="form-full-width" style="margin-top: 20px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid #00BFFF;">
                    <h4 style="color: #00BFFF; margin-bottom: 10px; text-align: center;">📸 Zdjęcia z treningu</h4>
                    <p style="color: #aaa; font-size: 0.8em; text-align: center; margin-bottom: 10px;">Dodaj foty by wleciały jako tło w Raportach Progresu!</p>
                    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;" id="training-photos-container">
                        <label style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 80px; height: 100px; border: 1px dashed #00BFFF; border-radius: 6px; cursor: pointer; background: rgba(0, 191, 255, 0.1);">
                            <span style="font-size: 1.5em; color: #00BFFF;">+</span>
                            <input type="file" accept="image/*" style="display: none;" onchange="window.TrainingUI.handleTrainingPhoto(event)">
                        </label>
                    </div>
                </div>

                <!-- Smartwatch Data -->
                <div class="form-full-width" style="margin-top: 20px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid #E91E63;">
                    <h4 style="color: #E91E63; margin-bottom: 15px; text-align: center;">⌚ Dane ze smartwatcha</h4>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 120px; text-align: center;">
                            <label style="color: #ccc; font-size: 0.85em;">Kalorie Aktywności</label>
                            <input type="number" id="smartwatch-calories" placeholder="kcal" style="width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; font-size: 1.1em; text-align: center; margin-top: 5px; box-sizing: border-box;" inputmode="numeric">
                        </div>
                        <div style="flex: 1; min-width: 120px; text-align: center;">
                            <label style="color: #ccc; font-size: 0.85em;">Średnie Tętno</label>
                            <input type="number" id="smartwatch-hr" placeholder="bpm" style="width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; font-size: 1.1em; text-align: center; margin-top: 5px; box-sizing: border-box;" inputmode="numeric">
                        </div>
                    </div>
                </div>

                <div class="form-full-width" style="margin-top: 30px;">
                    <button type="button" id="save-as-template-btn" class="action-button" style="width: 100%; margin-bottom: 10px; background-color: rgba(156, 39, 176, 0.2); border-color: #9c27b0; color: #e1bee7;">💾 Zapisz jako Plan Treningowy</button>
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <button type="button" id="pause-training-btn" class="action-button" style="flex: 1; background-color: #f39c12; border-color: #f39c12; color: #fff;">⏸ Pauza</button>
                        <button type="button" id="cancel-training-btn" class="action-button" style="flex: 1; background-color: rgba(231, 76, 60, 0.2); border-color: #E74C3C; color: #E74C3C;">❌ Anuluj</button>
                    </div>
                    <button type="button" id="finish-training-btn" class="action-button" style="width: 100%; background-color: #ff4444; border-color: #ff4444;">⏹ Zakończ Trening</button>
                </div>
            </div>
        `;
    }
};
