import { DatabaseManager } from '../db/DatabaseManager.js';
import { DietAIEngine } from '../diet/DietAIEngine.js';

export const DietUI = {
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
            <div class="view-header">
                <h2>Dieta i Kalorie</h2>
                <p style="color: #b0b0b0;" id="diet-date-display">Dzisiaj</p>
            </div>

            <!-- TDEE & Progress Rings -->
            <div class="diet-summary-card" style="background: rgba(0,0,0,0.4); border-radius: 12px; padding: 20px; border: 1px solid #FF9800; margin-bottom: 20px; text-align: center;">
                <h3 style="margin-top: 0; color: #FF9800; font-size: 1.1em;">Twój cel: <span id="diet-tdee-display">---</span> kcal</h3>
                <div style="position: relative; width: 150px; height: 150px; margin: 20px auto;">
                    <!-- SVG Circle Progress -->
                    <svg width="150" height="150" viewBox="0 0 150 150">
                        <circle cx="75" cy="75" r="65" fill="none" stroke="#333" stroke-width="12" />
                        <circle id="diet-kcal-ring" cx="75" cy="75" r="65" fill="none" stroke="#FF9800" stroke-width="12" stroke-dasharray="408.4" stroke-dashoffset="408.4" stroke-linecap="round" style="transition: stroke-dashoffset 1s ease-out; transform: rotate(-90deg); transform-origin: 50% 50%;" />
                    </svg>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;">
                        <div style="font-size: 0.8em; color: #aaa; text-transform: uppercase; font-weight: bold;">Zjedzono</div>
                        <div id="diet-kcal-consumed" style="font-size: 2.2em; font-weight: bold; color: #fff; line-height: 1;">0</div>
                        <div style="font-size: 0.9em; color: #aaa; font-weight: bold;">kcal</div>
                    </div>
                </div>
                
                <!-- Makro -->
                <div style="display: flex; justify-content: space-between; margin-top: 15px; border-top: 1px solid #333; padding-top: 15px;">
                    <div>
                        <div style="color: #4CAF50; font-weight: bold;" id="diet-protein-display">0g</div>
                        <div style="font-size: 0.7em; color: #888;">Białko</div>
                    </div>
                    <div>
                        <div style="color: #2196F3; font-weight: bold;" id="diet-carbs-display">0g</div>
                        <div style="font-size: 0.7em; color: #888;">Węgle</div>
                    </div>
                    <div>
                        <div style="color: #E91E63; font-weight: bold;" id="diet-fat-display">0g</div>
                        <div style="font-size: 0.7em; color: #888;">Tłuszcze</div>
                    </div>
                </div>
            </div>

            <!-- Kamera / Skaner -->
            <div style="text-align: center; margin-bottom: 30px; padding: 0 15px;">
                <label id="diet-scan-btn" class="action-button" style="display: flex; align-items: center; justify-content: center; width: 100%; max-width: 350px; margin: 0 auto; background: linear-gradient(135deg, #FF9800, #F44336); border: none; padding: 15px 20px; border-radius: 30px; font-size: 1.1em; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4); box-sizing: border-box; white-space: normal; line-height: 1.2;">
                    📸 Zeskanuj Posiłek (AI)
                    <input type="file" id="diet-camera-input" accept="image/*" capture="environment" style="display: none;">
                </label>
                <div id="diet-loading" style="display: none; margin-top: 15px; color: #FF9800;">
                    <span class="spinner" style="display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255,152,0,0.3); border-radius: 50%; border-top-color: #FF9800; animation: spin 1s ease-in-out infinite;"></span>
                    Analizowanie przez AI...
                </div>
            </div>

            <!-- Przycisk konfiguracji TDEE -->
            <div style="text-align: center; margin-bottom: 20px;">
                <button id="diet-config-btn" style="background: rgba(255,255,255,0.1); border: 1px solid #444; color: #ccc; padding: 8px 15px; border-radius: 20px; font-size: 0.9em; cursor: pointer;">
                    ⚙️ Oblicz zapotrzebowanie kaloryczne
                </button>
            </div>

            <!-- Dzisiejsze posiłki -->
            <h3 style="margin-bottom: 15px;">Dzisiejsze posiłki</h3>
            <div id="diet-logs-list">
                <!-- Tu wpada lista posiłków -->
            </div>

            <!-- Modal konfiguracji TDEE -->
            <div id="diet-tdee-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 1000; justify-content: center; align-items: center; padding: 20px;">
                <div style="background: #1e1e1e; padding: 25px; border-radius: 12px; max-width: 400px; width: 100%; position: relative; border: 1px solid #333;">
                    <button id="diet-tdee-close" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: #fff; font-size: 1.5em; cursor: pointer;">×</button>
                    <h3 style="margin-top: 0; color: #FF9800; margin-bottom: 20px;">Twój cel kaloryczny</h3>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: #aaa; font-size: 0.9em;">Aktywność i Treningi (w tygodniu)</label>
                        <select id="diet-tdee-activity" class="input-field" style="width: 100%; padding: 10px; background: #222; border: 1px solid #444; color: #fff; border-radius: 5px;">
                            <option value="1.2">Brak aktywności (Praca siedząca)</option>
                            <option value="1.375">Niska (1-2 treningi)</option>
                            <option value="1.55" selected>Umiarkowana (3-4 treningi)</option>
                            <option value="1.725">Wysoka (5-6 treningów)</option>
                            <option value="1.9">Bardzo wysoka (Fizyczna praca + treningi)</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: #aaa; font-size: 0.9em;">Obecny cel</label>
                        <select id="diet-tdee-goal" class="input-field" style="width: 100%; padding: 10px; background: #222; border: 1px solid #444; color: #fff; border-radius: 5px;">
                            <option value="cut">Redukcja (-500 kcal)</option>
                            <option value="maintenance" selected>Utrzymanie wagi</option>
                            <option value="bulk">Budowa masy (+300 kcal)</option>
                        </select>
                    </div>

                    <p style="font-size: 0.85em; color: #888; margin-bottom: 20px; line-height: 1.4;">
                        Kalkulator pobierze Twoją ostatnią wagę z modułu "Pomiary Ciała" i na jej podstawie wyliczy propozycję kalorii (wzór Mifflin-St Jeor).
                    </p>

                    <button id="diet-tdee-save" style="width: 100%; background: #FF9800; color: #000; border: none; padding: 12px; border-radius: 5px; font-weight: bold; cursor: pointer;">
                        Przelicz i Zapisz
                    </button>
                </div>
            </div>
        `;
    },

    bindEvents: () => {
        const cameraInput = document.getElementById('diet-camera-input');
        if (cameraInput) {
            cameraInput.addEventListener('change', DietUI.handleScan);
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
                    item.style.cssText = 'background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #FF9800;';
                    item.innerHTML = `
                        <div>
                            <div style="font-weight: bold; font-size: 1.1em; color: #fff;">${log.food_name}</div>
                            <div style="font-size: 1em; color: #fff; margin-top: 6px; display: flex; gap: 15px; font-weight: 500;">
                                <span><strong style="color: #4CAF50;">B:</strong> ${log.protein}g</span>
                                <span><strong style="color: #4fc3f7;">W:</strong> ${log.carbs}g</span>
                                <span><strong style="color: #ff5252;">T:</strong> ${log.fat}g</span>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 1.2em; font-weight: bold; color: #FF9800;">${log.calories} kcal</div>
                            <button class="delete-diet-btn" data-id="${log.id}" style="background: none; border: none; color: #ff4444; font-size: 0.8em; margin-top: 5px; cursor: pointer; text-decoration: underline;">Usuń</button>
                        </div>
                    `;
                    listContainer.appendChild(item);
                });

                // Przypięcie przycisków usuwania
                document.querySelectorAll('.delete-diet-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        if (confirm('Usunąć ten posiłek?')) {
                            const id = e.target.getAttribute('data-id');
                            await DatabaseManager.deleteDietLog(id);
                            DietUI.loadTodayData();
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
                if (totalKcal > tdee) {
                    ring.style.stroke = '#F44336'; // Czerwony jeśli przekroczono
                } else {
                    ring.style.stroke = '#FF9800'; // Pomarańczowy domyślnie
                }
            }, 100);
        }
    },

    handleScan: async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const loading = document.getElementById('diet-loading');
        const btnLabel = document.getElementById('diet-scan-btn');
        if (loading) loading.style.display = 'block';
        if (btnLabel) btnLabel.style.display = 'none';

        try {
            // Konwersja na base64 z kompresją w locie dla optymalizacji przesyłu
            const base64 = await DietUI.resizeAndToBase64(file);
            
            // Wywołanie API Gemini
            const result = await DietAIEngine.analyzeImage(base64);
            
            // Zapis do bazy
            const today = new Date().toISOString().split('T')[0];
            await DatabaseManager.addDietLog({
                date: today,
                meal_type: 'Inny',
                food_name: result.food_name || 'Nieznany posiłek',
                calories: parseInt(result.calories) || 0,
                protein: parseInt(result.protein) || 0,
                carbs: parseInt(result.carbs) || 0,
                fat: parseInt(result.fat) || 0
            });

            // Odświeżenie widoku
            DietUI.loadTodayData();

        } catch (err) {
            let errorMsg = err.message;
            if (errorMsg.includes('Unexpected token') || errorMsg.includes('JSON')) {
                errorMsg = "AI nie rozpoznało jedzenia na zdjęciu lub zdjęcie było niewyraźne. Spróbuj jeszcze raz!";
            }
            alert("Błąd: " + errorMsg);
        } finally {
            if (loading) loading.style.display = 'none';
            if (btnLabel) btnLabel.style.display = 'inline-block';
            e.target.value = ''; // Reset input
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
