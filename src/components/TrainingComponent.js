export const TrainingComponent = {
    render: () => {
        return `
            <div class="view-header">
                <h2>Trening</h2>
                <p style="color: #b0b0b0;">Zaplanuj i wykonuj treningi</p>
            </div>
            
            <!-- Calendar View -->
            <div id="training-calendar-view">
                <div class="form-full-width" style="margin-bottom: 20px;">
                    <button id="start-training-btn" class="action-button pulse" style="width: 100%; background-color: #4CAF50; border-color: #4CAF50;">▶ Rozpocznij Trening Teraz</button>
                </div>
                <h3 style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 15px;">Historia i Plan</h3>
                <div id="training-list" style="margin-top: 15px;">
                    <p style="color: #888; text-align: center; font-style: italic;">Brak zarejestrowanych treningów.</p>
                </div>
            </div>

            <!-- Active Training View -->
            <div id="active-training-view" style="display: none;">
                <div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 8px; border: 1px solid var(--primary-color); text-align: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: var(--primary-color);">Czas trwania: <span id="training-timer">00:00:00</span></h3>
                </div>

                <div class="two-column-form">
                    <!-- Add Exercise -->
                    <div class="form-column">
                        <h4 style="color: #D81B60; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">Dodaj Ćwiczenie</h4>
                        <div class="input-group">
                            <label>Typ</label>
                            <select id="exerciseType">
                                <option value="strength">Siłowe (Maszyny/Wolne ciężary)</option>
                                <option value="cardio">Cardio (Bieżnia/Orbitrek)</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>Nazwa Ćwiczenia / Maszyny</label>
                            <input type="text" id="exerciseName" placeholder="np. Wyciskanie sztangi leżąc">
                        </div>
                        <div class="input-group">
                            <label>Zdjęcie maszyny (opcjonalnie)</label>
                            <input type="file" id="exercisePhoto" accept="image/*" style="font-size: 0.8em;">
                        </div>
                        <button id="add-exercise-btn" class="action-button" style="margin-top: 10px; background-color: #333;">+ Dodaj do planu</button>
                    </div>

                    <!-- Current Exercises List -->
                    <div class="form-column">
                        <h4 style="color: #D81B60; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">Bieżący Trening</h4>
                        <div id="current-exercises-list">
                            <p style="color: #888; font-size: 0.9em;">Dodaj ćwiczenie z panelu obok.</p>
                        </div>
                    </div>
                </div>

                <div class="form-full-width" style="display: flex; gap: 15px; margin-top: 20px;">
                    <button type="button" id="finish-training-btn" class="action-button" style="flex: 2; background-color: #ff4444; border-color: #ff4444;">⏹ Zakończ Trening</button>
                </div>
            </div>
        `;
    }
};
