import { DatabaseManager } from '../db/DatabaseManager.js';
import { DietAIEngine } from '../diet/DietAIEngine.js';
import { MediaManager } from '../db/MediaManager.js';

export const DietUI = {
    attachedImages: [],

    init: async () => {
        const dashboard = document.getElementById('diet-dashboard');
        if (!dashboard) return;

        // Inicjalizacja struktury UI
        DietUI.renderUI(dashboard);

        // Załadowanie dzisiejszych danych i wyliczenie TDEE
        await DietUI.loadTodayData();
        
        // Podpięcie zdarzeń
        DietUI.bindEvents();
    },

    renderUI: (container) => {
        container.innerHTML = `
            <div class="view-header" style="padding: 10px 15px; margin-bottom: 10px;">
                <h2 style="margin: 0; font-size: 1.8em; font-weight: 700; color: #fff;">Dieta i Kalorie</h2>
                <p style="margin: 5px 0 0 0; color: #8E8E93; font-size: 0.9em;" id="diet-date-display">Dzisiaj</p>
            </div>

            <!-- TDEE & Progress Rings -->
            <div class="diet-summary-card" style="margin: 0 15px 20px 15px; background: rgba(255,255,255,0.05); border-radius: 24px; padding: 25px 20px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); text-align: center;">
                <h3 style="margin: 0 0 20px 0; color: #FF9800; font-size: 0.95em; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Twój cel: <span id="diet-tdee-display">---</span> kcal</h3>
                <div style="position: relative; width: 160px; height: 160px; margin: 0 auto 25px auto;">
                    <!-- SVG Circle Progress -->
                    <svg width="160" height="160" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="12" />
                        <circle id="diet-kcal-ring" cx="80" cy="80" r="70" fill="none" stroke="#FF9800" stroke-width="12" stroke-dasharray="439.8" stroke-dashoffset="439.8" stroke-linecap="round" style="transition: stroke-dashoffset 1s ease-out; transform: rotate(-90deg); transform-origin: 50% 50%;" />
                    </svg>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
                        <div style="font-size: 0.75em; color: #8E8E93; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Zjedzono</div>
                        <div id="diet-kcal-consumed" style="font-size: 2.2em; font-weight: 800; color: #fff; line-height: 1; letter-spacing: -1px;">0</div>
                        <div style="font-size: 0.85em; color: #8E8E93; font-weight: 500;">kcal</div>
                    </div>
                </div>
                
                <!-- Makro -->
                <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; gap: 10px;">
                    <div style="flex: 1; border-radius: 12px; padding: 10px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="color: #fff; font-size: 1.1em; font-weight: 700;" id="diet-protein-display">0g</div>
                        <div style="font-size: 0.75em; color: #8E8E93; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Białko</div>
                    </div>
                    <div style="flex: 1; border-radius: 12px; padding: 10px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="color: #fff; font-size: 1.1em; font-weight: 700;" id="diet-carbs-display">0g</div>
                        <div style="font-size: 0.75em; color: #8E8E93; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Węgle</div>
                    </div>
                    <div style="flex: 1; border-radius: 12px; padding: 10px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="color: #fff; font-size: 1.1em; font-weight: 700;" id="diet-fat-display">0g</div>
                        <div style="font-size: 0.75em; color: #8E8E93; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Tłuszcze</div>
                    </div>
                </div>
            </div>

            <!-- Kamera / Skaner / Tekst zintegrowane w 1 element -->
            <div style="margin-bottom: 25px; padding: 0 15px;">
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px);">
                    <label style="color: #fff; font-size: 0.95em; display: block; margin-bottom: 15px; font-weight: 600;">Dodaj posiłek</label>
                    
                    <div style="display: flex; gap: 12px; margin-bottom: 15px; align-items: stretch;">
                        <textarea id="diet-context-input" placeholder="Napisz lub podyktuj..." style="flex: 1; padding: 15px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); color: #fff; font-size: 0.95em; resize: none; box-sizing: border-box; min-height: 80px; font-family: inherit;" rows="3"></textarea>
                        
                        <label id="diet-attach-btn" style="cursor: pointer; color: #FF9800; background: rgba(255,152,0,0.1); border: 1px solid rgba(255,152,0,0.3); border-radius: 16px; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; min-width: 72px; flex-shrink: 0;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                            <span style="font-size: 0.65em; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;">Zdjęcie</span>
                            <input type="file" id="diet-camera-input" accept="image/*" multiple style="display: none;">
                        </label>
                    </div>

                    <div id="diet-image-preview-container" style="display: none; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; text-align: left;">
                        <!-- JS generated miniatures -->
                    </div>

                    <button id="diet-analyze-btn" class="action-button pulse" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: #FF9800; border: none; padding: 15px; border-radius: 16px; font-size: 1em; font-weight: 600; cursor: pointer; color: #FFF; transition: opacity 0.2s;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                        Analizuj z AI
                    </button>

                    <div id="diet-loading" style="display: none; margin-top: 15px; color: #FF9800; font-weight: 500; font-size: 0.9em; text-align: center;">
                        <span class="spinner" style="display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,152,0,0.3); border-radius: 50%; border-top-color: #FF9800; animation: spin 1s ease-in-out infinite; vertical-align: middle; margin-right: 8px;"></span>
                        <span id="diet-loading-text">Edward analizuje...</span>
                    </div>
                </div>
            </div>

            <!-- Przycisk konfiguracji TDEE -->
            <div style="padding: 0 15px; margin-bottom: 30px;">
                <button id="diet-config-btn" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); color: #fff; padding: 15px; border-radius: 16px; font-size: 0.95em; font-weight: 500; cursor: pointer; width: 100%; transition: background 0.2s;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
                    Ustawienia zapotrzebowania
                </button>
            </div>

            <!-- Dzisiejsze posiłki -->
            <div style="padding: 0 15px;">
                <h3 style="margin: 0 0 15px 0; font-size: 1.1em; font-weight: 600; color: #fff;">Dzisiejsze posiłki</h3>
                <div id="diet-logs-list" style="display: flex; flex-direction: column; gap: 15px;">
                    <!-- Tu wpada lista posiłków -->
                </div>
            </div>

            <!-- Wykres i Historia -->
            <div style="padding: 0 15px; margin-top: 35px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; font-size: 1.1em; font-weight: 600; color: #fff; display: flex; align-items: center; gap: 8px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                    Historia 30 dni
                </h3>
                <div id="diet-history-chart" style="display: flex; align-items: flex-end; gap: 6px; overflow-x: auto; padding-bottom: 15px; height: 160px; border-bottom: 1px solid rgba(255,255,255,0.05); box-sizing: border-box; scrollbar-width: none;">
                    <!-- JS wyrenderuje slupki -->
                </div>
            </div>

            <!-- Modal konfiguracji TDEE -->
            <div id="diet-tdee-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(17,17,24,0.8); backdrop-filter: blur(5px); z-index: 1000; justify-content: center; align-items: center; padding: 20px;">
                <div style="background: rgba(255,255,255,0.08); backdrop-filter: blur(20px); padding: 30px 25px; border-radius: 24px; max-width: 400px; width: 100%; position: relative; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
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

                    <p style="font-size: 0.8em; color: #8E8E93; margin-bottom: 25px; line-height: 1.5;">
                        Zapotrzebowanie wyliczane jest ze wzoru Mifflin-St Jeor na podstawie Twojej najnowszej wagi w sekcji Pomiary.
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
        const closeBtn = document.getElementById('diet-tdee-close');
        const saveBtn = document.getElementById('diet-tdee-save');

        if (configBtn && modal) {
            configBtn.addEventListener('click', () => {
                // Załaduj zapisane ustawienia
                const savedGoal = localStorage.getItem('dietGoal') || 'maintenance';
                const savedActivity = localStorage.getItem('dietActivity') || '1.55';
                
                document.getElementById('diet-tdee-goal').value = savedGoal;
                document.getElementById('diet-tdee-activity').value = savedActivity;
                
                modal.style.display = 'flex';
            });
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        if (saveBtn && modal) {
            saveBtn.addEventListener('click', async () => {
                const goal = document.getElementById('diet-tdee-goal').value;
                const activity = document.getElementById('diet-tdee-activity').value;
                
                localStorage.setItem('dietGoal', goal);
                localStorage.setItem('dietActivity', activity);
                
                modal.style.display = 'none';
                await DietUI.loadTodayData();
            });
        }
    },

    calculateTDEE: async () => {
        const measurements = await DatabaseManager.getMeasurements();
        if (!measurements || measurements.length === 0) return 2000; // domyślnie

        const latest = measurements[0];
        const weight = latest.weight;
        const height = latest.height || 175; // jeśli brakuje wzrostu
        // Zakładamy płeć męską i wiek 30 jako fallback
        const age = 30;
        
        // Wzór Mifflin-St Jeor dla mężczyzn (uproszczony)
        // 10 * waga + 6.25 * wzrost - 5 * wiek + 5
        let bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        
        // Mnożnik aktywności z konfiguracji
        const activityMultiplier = parseFloat(localStorage.getItem('dietActivity') || '1.55');
        let tdee = bmr * activityMultiplier;

        const goal = localStorage.getItem('dietGoal') || 'maintenance';
        if (goal === 'cut') tdee -= 500;
        if (goal === 'bulk') tdee += 300;

        return Math.round(tdee);
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
                listContainer.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">Jeszcze nic nie zjadłeś.</p>';
            } else {
                logs.forEach(log => {
                    totalKcal += log.calories || 0;
                    totalP += log.protein || 0;
                    totalC += log.carbs || 0;
                    totalF += log.fat || 0;

                    const item = document.createElement('div');
                    item.className = 'diet-log-item';
                    item.style.cssText = 'margin-bottom: 16px; display: block;';
                    item.innerHTML = `
                        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); box-sizing: border-box;">
                          <div style="display: flex; gap: 16px; margin-bottom: 20px;">
                            ${log.thumbnail ? 
                                '<img id="diet-list-thumb-' + log.id + '" style="width: 60px; height: 60px; object-fit: cover; border-radius: 14px; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">' 
                                : '<div style="width: 60px; height: 60px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/><path d="M12 12a4 4 0 1 0 4-4A4 4 0 0 0 12 12Z"/></svg></div>'
                            }
                            <div style="flex-grow: 1; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                              <h3 style="margin: 0; font-size: 1.05em; font-weight: 600; color: #fff; line-height: 1.4;">${log.food_name}</h3>
                              <span style="color: #FF9800; font-weight: 700; font-size: 1em; white-space: nowrap;">${log.calories} kcal</span>
                            </div>
                          </div>
                          
                          <!-- Macros -->
                          <div style="display: flex; gap: 8px; margin-bottom: 20px;">
                            <div style="flex: 1; border-radius: 10px; padding: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.02);">
                                <div style="color: #fff; font-weight: 600; font-size: 0.9em;">${log.protein}g</div>
                                <div style="color: #8E8E93; font-size: 0.65em; text-transform: uppercase; margin-top: 2px;">Białko</div>
                            </div>
                            <div style="flex: 1; border-radius: 10px; padding: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.02);">
                                <div style="color: #fff; font-weight: 600; font-size: 0.9em;">${log.carbs}g</div>
                                <div style="color: #8E8E93; font-size: 0.65em; text-transform: uppercase; margin-top: 2px;">Węgle</div>
                            </div>
                            <div style="flex: 1; border-radius: 10px; padding: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.02);">
                                <div style="color: #fff; font-weight: 600; font-size: 0.9em;">${log.fat}g</div>
                                <div style="color: #8E8E93; font-size: 0.65em; text-transform: uppercase; margin-top: 2px;">Tłuszcz</div>
                            </div>
                          </div>

                          <!-- Action Buttons -->
                          <div style="display: flex; gap: 10px;">
                            <button class="clone-diet-btn" data-log='${JSON.stringify(log).replace(/'/g, "&apos;")}' style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; padding: 12px; font-size: 0.85em; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: background 0.2s;">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                              Klonuj
                            </button>
                            <button class="delete-diet-btn" data-id="${log.id}" style="flex: 1; background: rgba(255,69,58,0.1); border: 1px solid rgba(255,69,58,0.3); color: #FF453A; border-radius: 12px; padding: 12px; font-size: 0.85em; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: background 0.2s;">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                              Usuń
                            </button>
                          </div>
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
                            const id = e.target.getAttribute('data-id');
                            await DatabaseManager.deleteDietLog(id);
                            DietUI.loadTodayData();
                        }
                    });
                });
                
                document.querySelectorAll('.clone-diet-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const log = JSON.parse(e.target.getAttribute('data-log'));
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

        const tdee = await DietUI.calculateTDEE();
        
        // Aktualizacja interfejsu (Liczniki)
        const kcalDisplay = document.getElementById('diet-kcal-consumed');
        if (kcalDisplay) kcalDisplay.textContent = totalKcal;
        
        const tdeeDisplay = document.getElementById('diet-tdee-display');
        if (tdeeDisplay) tdeeDisplay.textContent = tdee;

        const proteinDisplay = document.getElementById('diet-protein-display');
        if (proteinDisplay) proteinDisplay.textContent = totalP + 'g';
        const carbsDisplay = document.getElementById('diet-carbs-display');
        if (carbsDisplay) carbsDisplay.textContent = totalC + 'g';
        const fatDisplay = document.getElementById('diet-fat-display');
        if (fatDisplay) fatDisplay.textContent = totalF + 'g';

        // Animacja kółka postępu (SVG circle ma obwód 2*pi*r = 2 * 3.14159 * 65 = ~408.4)
        const ring = document.getElementById('diet-kcal-ring');
        if (ring) {
            let percentage = totalKcal / tdee;
            if (percentage > 1) percentage = 1;
            const dashoffset = 408.4 - (408.4 * percentage);
            
            // Opoznienie dla animacji
            setTimeout(() => {
                ring.style.strokeDashoffset = dashoffset;
                const kcalLabel = document.getElementById('diet-kcal-consumed');
                if (totalKcal > tdee) {
                    ring.style.stroke = '#F44336'; // Czerwony jeśli przekroczono
                    if (kcalLabel) kcalLabel.style.color = '#F44336';
                    ring.classList.add('pulse'); // dodanie klasy pulse
                } else {
                    ring.style.stroke = '#FF9800'; // Pomarańczowy domyślnie
                    if (kcalLabel) kcalLabel.style.color = '#fff';
                    ring.classList.remove('pulse');
                }
            }, 100);
            
            // Render wykresu po załadowaniu dzisiejszych danych
            DietUI.loadHistoryChart(tdee);
        }
    },

    renderImagePreviews: () => {
        const previewContainer = document.getElementById('diet-image-preview-container');
        if (!previewContainer) return;
        
        previewContainer.innerHTML = '';
        if (DietUI.attachedImages.length > 0) {
            previewContainer.style.display = 'flex';
            DietUI.attachedImages.forEach((mediaId, index) => {
                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                
                const img = document.createElement('img');
                img.style.width = '70px';
                img.style.height = '70px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '5px';
                img.style.border = '1px solid #555';
                
                window.MediaManager.getMediaUrl(mediaId).then(url => {
                    if (url) img.src = url;
                });
                
                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '×';
                removeBtn.style.position = 'absolute';
                removeBtn.style.top = '-5px';
                removeBtn.style.right = '-5px';
                removeBtn.style.background = '#F44336';
                removeBtn.style.color = 'white';
                removeBtn.style.border = 'none';
                removeBtn.style.borderRadius = '50%';
                removeBtn.style.width = '22px';
                removeBtn.style.height = '22px';
                removeBtn.style.fontSize = '12px';
                removeBtn.style.cursor = 'pointer';
                removeBtn.style.fontWeight = 'bold';
                removeBtn.onclick = () => DietUI.removeAttachedImage(index);
                
                wrapper.appendChild(img);
                wrapper.appendChild(removeBtn);
                previewContainer.appendChild(wrapper);
            });
            
            const hint = document.createElement('span');
            hint.style.display = 'inline-block';
            hint.style.alignSelf = 'center';
            hint.style.marginLeft = '10px';
            hint.style.fontSize = '0.85em';
            hint.style.color = '#aaa';
            hint.textContent = `Zdjęć: ${DietUI.attachedImages.length}/3`;
            previewContainer.appendChild(hint);
        } else {
            previewContainer.style.display = 'none';
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
            loading.style.display = 'block';
            const loadingText = document.getElementById('diet-loading-text');
            if (loadingText) loadingText.innerText = 'Edward analizuje...';
        }
        if (analyzeBtn) analyzeBtn.style.display = 'none';

        try {
            // Resolve base64 for AI Engine
            const base64Images = await Promise.all(DietUI.attachedImages.map(id => MediaManager.getBase64(id)));
            const result = await DietAIEngine.analyzeImage(base64Images.filter(Boolean), contextText);
            
            const thumbnail = DietUI.attachedImages.length > 0 ? DietUI.attachedImages[0] : null;
            DietUI.showResultConfirmation(result, thumbnail, contextInput);

        } catch (error) {
            if (window.ukiLogError) window.ukiLogError('DietAI Error', error.toString());
            alert(error.message);
        } finally {
            if (loading) loading.style.display = 'none';
            if (analyzeBtn) analyzeBtn.style.display = 'block';
        }
    },

    showResultConfirmation: (result, thumbnail, contextInput) => {
        let currentKcal = parseInt(result.calories) || 0;
        
        const modal = document.createElement('div');
        modal.id = 'diet-result-modal-overlay';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box;';
        
        modal.innerHTML = `
            <div style="background: #1e1e1e; padding: 20px; border-radius: 12px; border: 1px solid #FF9800; max-width: 400px; width: 100%; text-align: center; color: #fff; position: relative;">
                <h3 style="color: #FF9800; margin-top: 0; margin-bottom: 15px;">Potwierdź Posiłek</h3>
                <div id="diet-result-thumbnail-container" style="margin-bottom: 15px;"></div>
                
                <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 15px; color: #fff; word-break: break-word;">
                    ${result.food_name || 'Nieznany posiłek'}
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
        if (thumbnail) {
            const container = document.getElementById('diet-result-thumbnail-container');
            MediaManager.getMediaUrl(thumbnail).then(url => {
                if(url && container) {
                    container.innerHTML = '<img src="${url}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 2px solid #FF9800;">';
                }
            });
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
                thumbnail: thumbnail
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
                            <div style="color: #FF9800; font-weight: bold; font-size: 1.05em; margin-bottom: 5px;">${log.food_name || 'Posiłek'}</div>
                            <div style="display:flex; gap:10px; font-size:0.85em;">
                                <span style="color:#4CAF50">B: ${log.protein}g</span>
                                <span style="color:#2196F3">W: ${log.carbs}g</span>
                                <span style="color:#E91E63">T: ${log.fat}g</span>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="color: #fff; font-weight: bold; font-size: 1.1em;">${log.calories} kcal</div>
                            <button onclick="DatabaseManager.deleteDietLog(${log.id}).then(() => { document.getElementById('diet-history-meals-modal').remove(); window.DietUI.loadTodayData(); })" style="background: transparent; color: #ff4444; border: 1px solid #ff4444; border-radius: 4px; padding: 3px 8px; font-size: 0.8em; margin-top: 5px; cursor: pointer;">Usuń</button>
                        </div>
                    </div>
                `;
            });
        }
        
        modal.innerHTML = `
            <div style="background: #1e1e1e; padding: 20px; border-radius: 12px; border: 1px solid #FF9800; max-width: 400px; width: 100%; max-height: 80vh; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px; margin-bottom: 15px;">
                    <h3 style="color: #FF9800; margin: 0;">Posiłki z dnia: ${date}</h3>
                    <button onclick="this.closest('#diet-history-meals-modal').remove()" style="background: none; border: none; color: #fff; font-size: 1.5em; cursor: pointer;">&times;</button>
                </div>
                <div style="overflow-y: auto; flex: 1;">
                    ${mealsHtml}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    loadHistoryChart: async (tdee) => {
        const historyContainer = document.getElementById('diet-history-chart');
        if (!historyContainer) return;
        
        const history = await DatabaseManager.getDietLogsHistory(30);
        historyContainer.innerHTML = '';
        
        if (history.length === 0) {
            historyContainer.innerHTML = '<div style="color: #666; font-size: 0.9em; padding: 10px;">Brak danych do wykresu. Dodaj posiłki.</div>';
            return;
        }

        history.forEach(log => {
            const heightPercent = Math.min((log.total_calories / tdee) * 100, 100); 
            const isOver = log.total_calories > tdee;
            const barColor = isOver ? '#F44336' : '#FF9800'; 
            
            const d = new Date(log.date);
            const dateStr = d.getDate().toString().padStart(2, '0') + '.' + (d.getMonth() + 1).toString().padStart(2, '0');

            const barContainer = document.createElement('div');
            barContainer.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; min-width: 30px; flex-shrink: 0; cursor: pointer;';
            barContainer.onclick = () => DietUI.showHistoryMealsModal(log.date);
            
            barContainer.innerHTML = `
                <div style="font-size: 0.7em; color: ${barColor}; margin-bottom: 2px;">${log.total_calories}</div>
                <div style="width: 100%; background: ${barColor}; height: ${heightPercent}%; border-radius: 3px 3px 0 0; opacity: 0.8;"></div>
                <div style="font-size: 0.7em; color: #888; margin-top: 4px;">${dateStr}</div>
            `;
            
            historyContainer.appendChild(barContainer);
        });
        
        historyContainer.scrollLeft = historyContainer.scrollWidth;
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
