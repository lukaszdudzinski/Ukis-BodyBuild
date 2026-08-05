export const MeasurementsComponent = {
    render: () => {
        return `
            <div class="view-header">
                <h2>Pomiary Ciała</h2>
                <p style="color: #b0b0b0;">Śledź wagę i obwody</p>
            </div>

            <form id="measurementsForm" class="two-column-form">
                <div class="form-column">
                    <h4 style="color: #00BFFF; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">Dane podstawowe</h4>
                    <div class="input-group">
                        <label for="measureDate">Data pomiaru</label>
                        <input type="date" id="measureDate" required>
                    </div>
                    <div class="input-group">
                        <label for="measureWeight">Waga (kg)</label>
                        <input type="number" id="measureWeight" step="0.1" required>
                    </div>
                    <div class="input-group">
                        <label for="measureHeight">Wzrost (cm)</label>
                        <input type="number" id="measureHeight" step="1">
                    </div>
                </div>
                
                <div class="form-column">
                    <h4 style="color: #00BFFF; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">Obwody (cm)</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div class="input-group">
                            <label for="measureChest">Klatka</label>
                            <input type="number" id="measureChest" step="0.5">
                        </div>
                        <div class="input-group">
                            <label for="measureWaist">Talia</label>
                            <input type="number" id="measureWaist" step="0.5">
                        </div>
                        <div class="input-group">
                            <label for="measureHips">Biodra</label>
                            <input type="number" id="measureHips" step="0.5">
                        </div>
                        <div class="input-group">
                            <label for="measureThigh">Udo</label>
                            <input type="number" id="measureThigh" step="0.5">
                        </div>
                        <div class="input-group">
                            <label for="measureBiceps">Biceps</label>
                            <input type="number" id="measureBiceps" step="0.5">
                        </div>
                    </div>
                </div>

                <!-- Photo upload -->
                <div class="form-full-width" style="margin-top: 15px; width: 100%; box-sizing: border-box;">
                    <label for="measurePhoto" class="action-button" style="display: block; text-align: center; background: rgba(0,0,0,0.4); border: 1px solid #444; width: 100%; box-sizing: border-box;">📸 Dodaj Zdjęcie Sylwetki</label>
                    <input type="file" id="measurePhoto" accept="image/*" style="display: none;">
                    <img id="measurePhotoPreview" style="max-width: 100%; margin-top: 10px; border-radius: 8px; display: none;">
                </div>

                <div class="form-full-width" style="display: flex; gap: 15px; margin-top: 20px;">
                    <button type="submit" class="action-button pulse" style="flex: 2;">💾 Zapisz Pomiary</button>
                </div>
            </form>

            <div style="margin-top: 30px;">
                <h3 style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">Historia Pomiarów</h3>
                <div id="measurements-list" style="margin-top: 15px;">
                    <p style="color: #888; text-align: center; font-style: italic;">Brak dodanych pomiarów.</p>
                </div>
            </div>
        `;
    }
};
