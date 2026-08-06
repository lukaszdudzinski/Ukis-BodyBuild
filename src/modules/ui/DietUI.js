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
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                        <div id="diet-kcal-consumed" style="font-size: 1.8em; font-weight: bold; color: #fff;">0</div>
                        <div style="font-size: 0.8em; color: #888;">Zjedzono</div>
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
            <div style="text-align: center; margin-bottom: 30px;">
                <label id="diet-scan-btn" class="action-button" style="display: inline-block; background: linear-gradient(135deg, #FF9800, #F44336); border: none; padding: 15px 30px; border-radius: 30px; font-size: 1.2em; cursor: pointer; box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4);">
                    📸 Zeskanuj Posiłek (AI)
                    <input type="file" id="diet-camera-input" accept="image/*" capture="environment" style="display: none;">
                </label>
                <div id="diet-loading" style="display: none; margin-top: 15px; color: #FF9800;">
                    <span class="spinner" style="display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255,152,0,0.3); border-radius: 50%; border-top-color: #FF9800; animation: spin 1s ease-in-out infinite;"></span>
                    Analizowanie przez Gemini AI...
                </div>
            </div>

            <!-- Dzisiejsze posiłki -->
            <h3 style="margin-bottom: 15px;">Dzisiejsze posiłki</h3>
            <div id="diet-logs-list">
                <!-- Tu wpada lista posiłków -->
            </div>
        `;
    },

    bindEvents: () => {
        const cameraInput = document.getElementById('diet-camera-input');
        if (cameraInput) {
            cameraInput.addEventListener('change', DietUI.handleScan);
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
        
        // Mnożnik aktywności - domyślnie 1.55 (umiarkowana)
        let tdee = bmr * 1.55;

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
                            <div style="font-size: 0.8em; color: #888; margin-top: 4px;">
                                B: ${log.protein}g | W: ${log.carbs}g | T: ${log.fat}g
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
            alert(err.message);
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
