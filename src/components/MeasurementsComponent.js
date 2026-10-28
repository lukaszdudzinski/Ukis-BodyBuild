export const MeasurementsComponent = {
    render: () => {
        return `
            <div class="view-header" style="padding: 10px 15px; margin-bottom: 10px;">
                <h2 style="margin: 0; font-size: 1.8em; font-weight: 700; color: #fff;">Pomiary Ciała</h2>
                <p style="margin: 5px 0 0 0; color: #8E8E93; font-size: 0.9em;">Śledź wagę i obwody</p>
            </div>

            <form id="measurementsForm" style="padding: 0 15px; margin-bottom: 30px;">
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 25px 20px; backdrop-filter: blur(10px); margin-bottom: 20px;">
                    <h4 style="margin: 0 0 20px 0; color: #FF9800; font-size: 1.1em; font-weight: 600;">Dane podstawowe</h4>
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div>
                            <label for="measureDate" style="display: block; color: #8E8E93; font-size: 0.85em; font-weight: 500; margin-bottom: 8px;">Data pomiaru</label>
                            <input type="date" id="measureDate" required style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; font-size: 1em; box-sizing: border-box; outline: none; appearance: none;">
                        </div>
                        <div>
                            <label for="measureGender" style="display: block; color: #8E8E93; font-size: 0.85em; font-weight: 500; margin-bottom: 8px;">Płeć</label>
                            <select id="measureGender" required style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; font-size: 1em; box-sizing: border-box; outline: none; appearance: none;">
                                <option value="male">Mężczyzna</option>
                                <option value="female">Kobieta</option>
                            </select>
                        </div>
                        <div>
                            <label for="measureWeight" style="display: block; color: #8E8E93; font-size: 0.85em; font-weight: 500; margin-bottom: 8px;">Waga (kg)</label>
                            <input type="number" id="measureWeight" step="0.1" required style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; font-size: 1em; box-sizing: border-box; outline: none; appearance: none;">
                        </div>
                        <div>
                            <label for="measureHeight" style="display: block; color: #8E8E93; font-size: 0.85em; font-weight: 500; margin-bottom: 8px;">Wzrost (cm)</label>
                            <input type="number" id="measureHeight" step="1" style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; font-size: 1em; box-sizing: border-box; outline: none; appearance: none;">
                        </div>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 25px 20px; backdrop-filter: blur(10px); margin-bottom: 20px;">
                    <h4 style="margin: 0 0 20px 0; color: #FF9800; font-size: 1.1em; font-weight: 600;">Obwody (cm)</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <label for="measureChest" style="display: block; color: #8E8E93; font-size: 0.85em; font-weight: 500; margin-bottom: 8px;">Klatka</label>
                            <input type="number" id="measureChest" step="0.5" style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; font-size: 1em; box-sizing: border-box; outline: none; appearance: none;">
                        </div>
                        <div>
                            <label for="measureWaist" style="display: block; color: #8E8E93; font-size: 0.85em; font-weight: 500; margin-bottom: 8px;">Talia</label>
                            <input type="number" id="measureWaist" step="0.5" style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; font-size: 1em; box-sizing: border-box; outline: none; appearance: none;">
                        </div>
                        <div>
                            <label for="measureHips" style="display: block; color: #8E8E93; font-size: 0.85em; font-weight: 500; margin-bottom: 8px;">Biodra</label>
                            <input type="number" id="measureHips" step="0.5" style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; font-size: 1em; box-sizing: border-box; outline: none; appearance: none;">
                        </div>
                        <div>
                            <label for="measureThigh" style="display: block; color: #8E8E93; font-size: 0.85em; font-weight: 500; margin-bottom: 8px;">Udo</label>
                            <input type="number" id="measureThigh" step="0.5" style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; font-size: 1em; box-sizing: border-box; outline: none; appearance: none;">
                        </div>
                        <div>
                            <label for="measureBiceps" style="display: block; color: #8E8E93; font-size: 0.85em; font-weight: 500; margin-bottom: 8px;">Biceps</label>
                            <input type="number" id="measureBiceps" step="0.5" style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; font-size: 1em; box-sizing: border-box; outline: none; appearance: none;">
                        </div>
                        <div>
                            <label for="measureNeck" style="display: flex; align-items: center; justify-content: space-between; color: #8E8E93; font-size: 0.85em; font-weight: 500; margin-bottom: 8px;">
                                Szyja
                                <span style="cursor: pointer; color: #FF9800; opacity: 0.8;" onclick="alert('Kompletne dane (w tym obwód szyi, talii i wzrost) pozwalają aplikacji na dokładne wyliczenie poziomu tkanki tłuszczowej (wzór US Navy). Podawanie ich ułatwi nasze analizy, ale nie jest obowiązkowe.')">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                </span>
                            </label>
                            <input type="number" id="measureNeck" step="0.5" style="width: 100%; padding: 12px 15px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; font-size: 1em; box-sizing: border-box; outline: none; appearance: none;">
                        </div>
                    </div>
                </div>

                <!-- Photo upload -->
                <div style="margin-bottom: 20px;">
                    <label for="measurePhoto" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: rgba(255,152,0,0.1); border: 1px solid rgba(255,152,0,0.3); color: #FF9800; border-radius: 16px; padding: 15px; font-size: 1em; font-weight: 600; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s; box-sizing: border-box;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                        Dodaj Zdjęcie Sylwetki
                    </label>
                    <input type="file" id="measurePhoto" accept="image/*" style="display: none;">
                    <img id="measurePhotoPreview" style="max-width: 100%; margin-top: 15px; border-radius: 12px; display: none; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
                </div>

                <div style="display: flex; gap: 15px; margin-top: 20px;">
                    <button type="submit" class="pulse" style="display: flex; align-items: center; justify-content: center; gap: 8px; flex: 2; background: #FF9800; border: none; padding: 18px; border-radius: 16px; font-size: 1.1em; font-weight: 700; cursor: pointer; color: #FFF; transition: opacity 0.2s;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        Zapisz Pomiary
                    </button>
                </div>
            </form>

            <div style="padding: 0 15px;">
                <h3 style="margin: 0 0 20px 0; font-size: 1.1em; font-weight: 600; color: #fff; display: flex; align-items: center; gap: 8px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                    Historia Pomiarów
                </h3>
                <div id="measurements-list" style="display: flex; flex-direction: column; gap: 15px;">
                    <p style="color: #8E8E93; text-align: center; font-style: italic;">Brak dodanych pomiarów.</p>
                </div>
            </div>
        `;
    }
};
