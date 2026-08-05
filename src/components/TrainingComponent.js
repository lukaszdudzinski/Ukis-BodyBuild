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
                    
                    <div id="day-action-empty-state">
                        <button id="start-new-session-btn" class="action-button pulse" style="width: 100%; margin-bottom: 10px; background-color: rgba(0, 191, 255, 0.2); border-color: #00BFFF; color: #00BFFF;">➕ Dodaj nową sesję treningową</button>
                        <div id="history-sessions-list" style="margin-top: 15px;">
                            <h5 style="color: #ccc; margin-bottom: 10px;">📋 Skopiuj sesję treningową:</h5>
                            <!-- Populated with recent sessions -->
                        </div>
                    </div>

                    <div id="day-action-existing-state" style="display: none; text-align: center;">
                        <div id="existing-training-preview" style="margin-bottom: 15px; color: #ccc;">
                            <!-- Preview of existing training -->
                        </div>
                        <button id="continue-session-btn" class="action-button pulse" style="width: 100%; background-color: #2ECC71; border-color: #2ECC71; color: #fff;">▶ Kontynuuj ten trening</button>
                    </div>
                </div>
            </div>

            <!-- Active Training View -->
            <div id="active-training-view" style="display: none;">
                <div style="margin-bottom: 15px;">
                    <input type="text" id="training-name-input" placeholder="NAZWA Treningu (opcjonalnie)" style="width: 100%; padding: 12px; border-radius: 4px; border: 1px solid #ff4444; background: #222; color: #ff4444; font-size: 1.1em; text-align: center; box-sizing: border-box;">
                </div>
                
                <div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 8px; border: 1px solid #00BFFF; text-align: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #00BFFF;">Czas trwania: <span id="training-timer">00:00:00</span></h3>
                </div>

                <div class="form-full-width">
                    <h4 style="color: #00BFFF; margin-bottom: 10px; border-bottom: 1px solid rgba(0,191,255,0.2); padding-bottom: 5px;">Bieżący Trening</h4>
                    
                    <div id="current-exercises-list">
                        <!-- Populated by JS with Exercise Blocks -->
                    </div>

                    <button id="add-exercise-to-plan-btn" class="action-button" style="width: 100%; margin-top: 15px; background-color: rgba(0, 191, 255, 0.1); border-color: #00BFFF; color: #00BFFF;">+ Dodaj ćwiczenie do planu</button>
                </div>

                <div class="form-full-width" style="margin-top: 30px;">
                    <button type="button" id="pause-training-btn" class="action-button" style="width: 100%; margin-bottom: 10px; background-color: #f39c12; border-color: #f39c12; color: #fff;">⏸ Pauza</button>
                    <button type="button" id="finish-training-btn" class="action-button" style="width: 100%; background-color: #ff4444; border-color: #ff4444;">⏹ Zakończ Trening</button>
                </div>
            </div>
        `;
    }
};
