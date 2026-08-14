import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { AiAnalyticsEngine } from '../ai/AiAnalyticsEngine.js';

export const AiAnalyticsUI = {
    render: async (container) => {
        container.innerHTML = `
            <div style="background: linear-gradient(135deg, rgba(255,152,0,0.12) 0%, rgba(0,0,0,0.5) 100%); border: 1px solid rgba(255,152,0,0.4); border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px;">
                    <span style="font-size: 2.2em; line-height:1;">🤖</span>
                    <div>
                        <h3 style="margin: 0 0 6px 0; color: #FF9800;">Trener Edward analizuje Twoje dane</h3>
                        <p style="margin: 0; font-size: 0.85em; color: #aaa; line-height:1.5;">Pelna analiza treningow, diety i regeneracji z rekomendacjami AI. Edward bierze pod uwage historie treningow, partie miesniowe, obciazenie, posilki i sen.</p>
                    </div>
                </div>
                <div style="display: flex; gap: 12px; margin-top: 16px;">
                    <button id="ai-gen-weekly-btn" style="flex: 1; padding: 16px 8px; background: linear-gradient(135deg, #00BFFF, #005f99); color: #fff; border: none; border-radius: 10px; font-weight: bold; font-size: 0.95em; cursor: pointer; box-shadow: 0 4px 15px rgba(0,191,255,0.35); line-height:1.4;">
                        Analiza Tygodniowa<br><span style="font-size:0.8em; font-weight:normal; opacity:0.85;">ostatnie 7 dni</span>
                    </button>
                    <button id="ai-gen-monthly-btn" style="flex: 1; padding: 16px 8px; background: linear-gradient(135deg, #FFD700, #b29600); color: #000; border: none; border-radius: 10px; font-weight: bold; font-size: 0.95em; cursor: pointer; box-shadow: 0 4px 15px rgba(255,215,0,0.35); line-height:1.4;">
                        Analiza Miesięczna<br><span style="font-size:0.8em; font-weight:normal; opacity:0.7;">ostatnie 30 dni</span>
                    </button>
                </div>
                <div id="ai-status-bar" style="display:none; margin-top:16px; padding:14px; background:rgba(0,0,0,0.5); border-radius:8px; text-align:center; color:#00BFFF; font-size:0.9em; border:1px solid rgba(0,191,255,0.2);">
                    Trener Edward mysli... To moze potrwac kilkanascie sekund.
                </div>
            </div>

            <div>
                <h4 style="color: #FF9800; border-bottom: 1px solid rgba(255,152,0,0.25); padding-bottom: 8px; margin-bottom: 16px; display:flex; align-items:center; gap:8px; margin-top:0;">
                    Historia Analiz
                    <span style="font-size:0.75em; color:#888; font-weight:normal;">(kliknij rok/miesiac by rozwinac)</span>
                </h4>
                <div id="ai-history-list">
                    <p style="color:#888; text-align:center; padding:20px;">Ladowanie historii...</p>
                </div>
            </div>
        `;

        document.getElementById('ai-gen-weekly-btn').addEventListener('click', () => AiAnalyticsUI.openInterviewModal(7));
        document.getElementById('ai-gen-monthly-btn').addEventListener('click', () => AiAnalyticsUI.openInterviewModal(30));

        await AiAnalyticsUI.loadHistory();
    },

    loadHistory: async () => {
        const listContainer = document.getElementById('ai-history-list');
        if (!listContainer) return;

        let analyses = [];
        try {
            analyses = await window.DatabaseManager.getAiAnalyses();
        } catch (e) {
            listContainer.innerHTML = '<p style="color:#ff4444; text-align:center; padding:20px;">Błąd ładowania historii analiz.</p>';
            return;
        }

        if (!analyses || analyses.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center; padding:30px 20px; background:rgba(255,255,255,0.03); border-radius:10px; border:1px dashed rgba(255,152,0,0.2);"><div style="font-size:2.5em; margin-bottom:10px;">🏋️</div><p style="color:#888; margin:0; font-size:0.9em;">Brak historii analiz.<br>Wygeneruj pierwszą — Edward czeka!</p></div>';
            return;
        }

        const MONTHS_PL = ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'];
        const grouped = {};

        analyses.forEach(a => {
            const d = new Date(a.date);
            const year = d.getFullYear();
            const monthKey = year + '-' + String(d.getMonth()).padStart(2,'0');
            const monthName = MONTHS_PL[d.getMonth()] + ' ' + year;
            if (!grouped[year]) grouped[year] = {};
            if (!grouped[year][monthKey]) grouped[year][monthKey] = { name: monthName, items: [] };
            grouped[year][monthKey].items.push(a);
        });

        let html = '';
        const years = Object.keys(grouped).sort((a, b) => b - a);

        years.forEach((year, yi) => {
            const yearOpen = yi === 0 ? 'open' : '';
            const totalInYear = Object.values(grouped[year]).reduce((s, m) => s + m.items.length, 0);
            html += '<details ' + yearOpen + ' style="margin-bottom:10px;">';
            html += '<summary style="cursor:pointer; padding:12px 16px; background:rgba(255,152,0,0.08); border:1px solid rgba(255,152,0,0.2); border-radius:8px; color:#FF9800; font-weight:bold; font-size:1.05em; list-style:none; display:flex; justify-content:space-between; align-items:center; user-select:none;">'
                + '<span>' + year + '</span>'
                + '<span style="font-size:0.8em; color:#888; font-weight:normal;">' + totalInYear + ' analiz</span>'
                + '</summary>';
            html += '<div style="padding:4px 0 0 0;">';

            const months = Object.keys(grouped[year]).sort((a, b) => b.localeCompare(a));
            months.forEach((monthKey, mi) => {
                const month = grouped[year][monthKey];
                const monthOpen = yi === 0 && mi === 0 ? 'open' : '';
                html += '<details ' + monthOpen + ' style="margin:6px 0 0 8px;">';
                html += '<summary style="cursor:pointer; padding:10px 14px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:6px; color:#ddd; font-weight:600; list-style:none; display:flex; justify-content:space-between; align-items:center;">'
                    + '<span>' + month.name + '</span>'
                    + '<span style="font-size:0.8em; color:#888;">' + month.items.length + '</span>'
                    + '</summary>';
                html += '<div style="padding:4px 0 0 0;">';

                month.items.forEach(a => {
                    const dateStr = new Date(a.date).toLocaleDateString('pl-PL', {day:'numeric', month:'long'});
                    const typeLabel = a.type === 'monthly' ? 'Analiza Miesięczna' : 'Analiza Tygodniowa';
                    const typeColor = a.type === 'monthly' ? '#FFD700' : '#00BFFF';
                    html += '<div style="margin:6px 0 0 8px; background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:12px;">'
                        + '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">'
                        + '<span style="color:' + typeColor + '; font-weight:bold; font-size:0.9em;">' + typeLabel + '</span>'
                        + '<span style="color:#666; font-size:0.78em;">' + dateStr + '</span>'
                        + '</div>'
                        + '<div style="display:flex; gap:8px;">'
                        + '<button onclick="window.AiAnalyticsUI.showReport(' + a.id + ')" style="flex:1; padding:9px; background:' + typeColor + '; color:#000; border:none; border-radius:6px; font-weight:bold; font-size:0.85em; cursor:pointer;">Czytaj raport</button>'
                        + '<button onclick="window.AiAnalyticsUI.deleteReport(' + a.id + ')" style="padding:9px 12px; background:rgba(255,68,68,0.12); color:#ff6666; border:1px solid rgba(255,68,68,0.25); border-radius:6px; font-size:0.85em; cursor:pointer;">Usuń</button>'
                        + '</div>'
                        + '</div>';
                });
                html += '</div></details>';
            });
            html += '</div></details>';
        });

        listContainer.innerHTML = html;
    },

    openInterviewModal: (days) => {
        let modal = document.getElementById('ai-interview-modal');
        if (modal) modal.remove();
        modal = document.createElement('div');
        modal.id = 'ai-interview-modal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.92); z-index:9999; display:flex; justify-content:center; align-items:center; padding:16px; box-sizing:border-box;';
        
        const savedExp = localStorage.getItem('trainingExperience') || '1-3 lata (Średniozaawansowany)';
        const savedGoal = localStorage.getItem('dietGoal') || 'bulk';

        modal.innerHTML = `
            <div style="background:linear-gradient(135deg,#1e1e1e,#111); padding:24px 20px; border-radius:14px; border:1px solid #FF9800; width:100%; max-width:420px; max-height:90vh; overflow-y:auto; box-shadow:0 15px 50px rgba(255,152,0,0.25); text-align:left; box-sizing:border-box;">
                <div style="text-align:center; margin-bottom:15px;">
                    <div style="font-size:2.4em; margin-bottom:6px;">🤖</div>
                    <h3 style="color:#FF9800; margin:0 0 6px 0; font-size:1.2em;">Wywiad Trenera Edwarda</h3>
                    <p style="color:#aaa; font-size:0.82em; margin:0; line-height:1.4;">
                        Analiza dla okresu: <strong style="color:#fff;">ostatnie ${days} dni</strong>.<br>Uzupełnij parametry, aby Edward przygotował maksymalnie precyzyjne zalecenia!
                    </p>
                </div>

                <!-- 1. Sen -->
                <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px 16px; margin-bottom:14px;">
                    <label style="display:block; color:#00BFFF; font-weight:bold; font-size:0.88em; margin-bottom:8px;">😴 Średni sen na dobę:</label>
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
                        <button id="ai-sleep-minus" type="button" style="width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,0.1); color:#fff; border:1px solid rgba(255,255,255,0.2); font-size:1.3em; cursor:pointer;">-</button>
                        <div style="text-align:center;">
                            <span id="ai-sleep-val" style="font-size:2.2em; color:#fff; font-weight:bold; line-height:1;">7</span>
                            <span style="font-size:0.8em; color:#888; margin-left:4px;">godzin</span>
                        </div>
                        <button id="ai-sleep-plus" type="button" style="width:40px; height:40px; border-radius:50%; background:#00BFFF; color:#000; border:none; font-size:1.3em; cursor:pointer; font-weight:bold;">+</button>
                    </div>
                </div>

                <!-- 2. Staż treningowy -->
                <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px 16px; margin-bottom:14px;">
                    <label for="ai-interview-exp" style="display:block; color:#FFD700; font-weight:bold; font-size:0.88em; margin-bottom:6px;">🏆 Twój staż treningowy:</label>
                    <select id="ai-interview-exp" style="width:100%; padding:10px; background:#222; border:1px solid #555; color:#fff; border-radius:6px; font-size:0.92em; font-weight:bold;">
                        <option value="Początkujący (< 1 rok)" ${savedExp.includes('Początkujący') ? 'selected' : ''}>Początkujący (< 1 rok)</option>
                        <option value="1-3 lata (Średniozaawansowany)" ${savedExp.includes('1-3 lata') ? 'selected' : ''}>1-3 lata (Średniozaawansowany)</option>
                        <option value="3-5 lat (Zaawansowany)" ${savedExp.includes('3-5 lat') ? 'selected' : ''}>3-5 lat (Zaawansowany)</option>
                        <option value="5+ lat (Weteran / Zawodnik)" ${savedExp.includes('5+') ? 'selected' : ''}>5+ lat (Weteran / Zawodnik)</option>
                    </select>
                </div>

                <!-- 3. Cel sylwetkowy -->
                <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px 16px; margin-bottom:18px;">
                    <label for="ai-interview-goal" style="display:block; color:#2ECC71; font-weight:bold; font-size:0.88em; margin-bottom:6px;">🎯 Główny cel sylwetkowy:</label>
                    <select id="ai-interview-goal" style="width:100%; padding:10px; background:#222; border:1px solid #555; color:#fff; border-radius:6px; font-size:0.92em; font-weight:bold;">
                        <option value="Budowa masy mięśniowej (Hipertrofia)" ${savedGoal === 'bulk' || savedGoal.includes('mas') ? 'selected' : ''}>Budowa masy mięśniowej (Hipertrofia)</option>
                        <option value="Redukcja tkanki tłuszczowej (Spalanie tłuszczu)" ${savedGoal === 'cut' || savedGoal.includes('reduk') ? 'selected' : ''}>Redukcja tkanki tłuszczowej (Rzeźba)</option>
                        <option value="Rekompozycja i utrzymanie formy" ${savedGoal === 'maintenance' || savedGoal.includes('utrzy') ? 'selected' : ''}>Rekompozycja / Utrzymanie formy</option>
                        <option value="Budowa siły maksymalnej" ${savedGoal.includes('sił') ? 'selected' : ''}>Budowa siły maksymalnej</option>
                    </select>
                </div>

                <div style="display:flex; flex-direction:column; gap:10px;">
                    <button id="ai-interview-submit" style="width:100%; padding:14px; background:linear-gradient(135deg,#FF9800,#e65100); color:#fff; font-weight:bold; border:none; border-radius:8px; cursor:pointer; font-size:1em; box-shadow:0 4px 15px rgba(255,152,0,0.35);">
                        🚀 Generuj Kompleksową Analizę
                    </button>
                    <button id="ai-interview-cancel" style="width:100%; padding:11px; background:transparent; border:1px solid #444; color:#888; border-radius:8px; cursor:pointer; font-size:0.88em;">
                        Anuluj
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        let sleepVal = 7;
        const valEl = document.getElementById('ai-sleep-val');
        document.getElementById('ai-sleep-minus').onclick = () => { sleepVal = Math.max(0, sleepVal - 0.5); valEl.textContent = sleepVal; };
        document.getElementById('ai-sleep-plus').onclick = () => { sleepVal = Math.min(12, sleepVal + 0.5); valEl.textContent = sleepVal; };
        
        document.getElementById('ai-interview-cancel').onclick = () => modal.remove();
        
        document.getElementById('ai-interview-submit').onclick = async () => {
            const expVal = document.getElementById('ai-interview-exp').value;
            const goalVal = document.getElementById('ai-interview-goal').value;
            
            localStorage.setItem('trainingExperience', expVal);
            localStorage.setItem('dietGoal', goalVal);
            
            modal.remove();
            await AiAnalyticsUI.generateAnalysis(days, {
                sleepHours: sleepVal,
                experience: expVal,
                goal: goalVal
            });
        };
    },

    generateAnalysis: async (days, params = {}) => {
        const statusBar = document.getElementById('ai-status-bar');
        const weeklyBtn = document.getElementById('ai-gen-weekly-btn');
        const monthlyBtn = document.getElementById('ai-gen-monthly-btn');

        // Walidacja — sprawdź czy są jakiekolwiek dane do analizy
        try {
            const allTrainings = await window.DatabaseManager.getTrainings();
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - days);
            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];
            const recentTrainings = (allTrainings || []).filter(t => t.date >= startStr && t.date <= endStr);

            if (recentTrainings.length === 0) {
                AiAnalyticsUI._showNoDataModal(days);
                return;
            }
        } catch(e) {
            console.warn('Nie udało się sprawdzić treningów przed analizą:', e);
        }

        if (statusBar) statusBar.style.display = 'block';
        if (weeklyBtn) weeklyBtn.disabled = true;
        if (monthlyBtn) monthlyBtn.disabled = true;
        try {
            const result = await AiAnalyticsEngine.generate(days, params);
            if (result && typeof result === 'string') {
                await window.DatabaseManager.saveAiAnalysis(
                    days <= 7 ? 'weekly' : 'monthly',
                    result
                );
                await AiAnalyticsUI.loadHistory();
                const analyses = await window.DatabaseManager.getAiAnalyses();
                if (analyses && analyses.length > 0) AiAnalyticsUI.showReport(analyses[0].id);
            } else {
                alert('Trener Edward nie odpowiedział. Sprawdź połączenie i URL workera w Ustawieniach.');
            }
        } catch (e) {
            console.error('AI Analysis error:', e);
            if (window.ukiLogError) window.ukiLogError('AI Analysis error', e.stack || e.toString());
            alert('Błąd generowania analizy: ' + (e.message || 'Nieznany błąd'));
        } finally {
            if (statusBar) statusBar.style.display = 'none';
            if (weeklyBtn) weeklyBtn.disabled = false;
            if (monthlyBtn) monthlyBtn.disabled = false;
        }
    },

    _showNoDataModal: (days) => {
        let modal = document.getElementById('ai-nodata-modal');
        if (modal) modal.remove();
        modal = document.createElement('div');
        modal.id = 'ai-nodata-modal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.88); z-index:9999; display:flex; justify-content:center; align-items:center; padding:20px; box-sizing:border-box;';
        modal.innerHTML = '<div style="background:linear-gradient(135deg,#1a1a1a,#111); padding:28px 24px; border-radius:14px; border:1px solid #FF9800; width:100%; max-width:360px; text-align:center; box-shadow:0 15px 50px rgba(255,152,0,0.15);">'
            + '<div style="font-size:3em; margin-bottom:12px;">🏋️</div>'
            + '<h3 style="color:#FF9800; margin:0 0 12px 0; font-size:1.1em;">Brak danych do analizy</h3>'
            + '<p style="color:#ccc; font-size:0.88em; line-height:1.6; margin:0 0 20px 0;">Edward nie ma czego analizować — w ciągu ostatnich <strong style="color:#fff;">' + days + ' dni</strong> nie zostały zapisane żadne treningi.<br><br>Zaloguj co najmniej jeden trening, a Edward chętnie oceni Twoje postępy! 💪</p>'
            + '<button id="ai-nodata-close" style="width:100%; padding:13px; background:linear-gradient(135deg,#FF9800,#b26000); color:#fff; font-weight:bold; border:none; border-radius:8px; cursor:pointer; font-size:0.95em;">Rozumiem, zaraz trenuję!</button>'
            + '</div>';
        document.body.appendChild(modal);
        document.getElementById('ai-nodata-close').onclick = () => modal.remove();
    },

    showReport: async (id) => {
        let analyses = [];
        try { analyses = await window.DatabaseManager.getAiAnalyses(); } catch(e) { return; }
        const analysis = analyses.find(a => a.id === id);
        if (!analysis) return;

        let modal = document.getElementById('ai-report-modal');
        if (modal) modal.remove();
        modal = document.createElement('div');
        modal.id = 'ai-report-modal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.98); z-index:9999; display:flex; flex-direction:column; box-sizing:border-box; overflow:hidden;';
        
        const typeLabel = analysis.type === 'monthly' ? 'Analiza Miesięczna' : 'Analiza Tygodniowa';
        const dateStr = new Date(analysis.date).toLocaleDateString('pl-PL', {day:'numeric', month:'long', year:'numeric'});
        
        let parsedContent = analysis.content;
        try { parsedContent = marked.parse(analysis.content); } catch(e) {}

        modal.innerHTML = `
            <!-- Top Sticky Navigation Bar -->
            <div style="background:#111; border-bottom:1px solid rgba(255,152,0,0.3); padding:max(16px, env(safe-area-inset-top, 16px)) 16px 14px 16px; display:flex; justify-content:space-between; align-items:center; flex-shrink:0; gap:8px;">
                <button id="ai-report-back-top" style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:#fff; border-radius:8px; font-size:0.88em; font-weight:bold; cursor:pointer; padding:8px 12px; display:flex; align-items:center; gap:5px; flex-shrink:0;">
                    🔙 Powrót
                </button>

                <div style="text-align:center; flex:1; overflow:hidden;">
                    <div style="color:#FF9800; font-weight:bold; font-size:0.95em; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${typeLabel}</div>
                    <div style="color:#888; font-size:0.75em;">${dateStr}</div>
                </div>

                <div style="display:flex; gap:6px; flex-shrink:0;">
                    <button onclick="window.AiAnalyticsUI.importPlanToTemplates(${analysis.id})" title="Zapisz proponowany plan do Szablonów" style="background:#00BFFF; border:none; color:#000; border-radius:6px; font-size:0.8em; font-weight:bold; cursor:pointer; padding:8px 10px;">
                        📋 Plan
                    </button>
                    <button onclick="window.AiAnalyticsUI.exportTxt(${analysis.id})" title="Pobierz plik tekstowy" style="background:#2ECC71; border:none; color:#fff; border-radius:6px; font-size:0.8em; font-weight:bold; cursor:pointer; padding:8px 10px;">
                        💾 TXT
                    </button>
                    <button id="ai-report-close-top" style="background:rgba(255,68,68,0.2); border:1px solid rgba(255,68,68,0.3); color:#ff6666; width:34px; height:34px; border-radius:50%; font-size:1.3em; cursor:pointer; display:flex; align-items:center; justify-content:center;">&times;</button>
                </div>
            </div>

            <!-- Scrollable Analysis Content -->
            <div style="flex:1; overflow-y:auto; padding:20px 14px 40px 14px; -webkit-overflow-scrolling:touch;">
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:20px 16px; color:#eee; line-height:1.75; font-size:0.95em; max-width:700px; margin:0 auto;">
                    ${parsedContent}

                    <!-- Action Box at bottom of report -->
                    <div style="margin-top:35px; padding-top:20px; border-top:1px solid rgba(255,152,0,0.3); display:flex; flex-direction:column; gap:12px;">
                        <button onclick="window.AiAnalyticsUI.importPlanToTemplates(${analysis.id})" style="width:100%; padding:14px; background:linear-gradient(135deg, #00BFFF, #005f99); color:#fff; font-weight:bold; font-size:0.95em; border:none; border-radius:10px; cursor:pointer; box-shadow:0 4px 15px rgba(0,191,255,0.3); display:flex; align-items:center; justify-content:center; gap:8px;">
                            📋 Zapisz Proponowany Trening jako Szablon Planu
                        </button>
                        
                        <div style="display:flex; gap:10px;">
                            <button onclick="window.AiAnalyticsUI.exportTxt(${analysis.id})" style="flex:1; padding:12px; background:rgba(46,204,113,0.15); border:1px solid #2ECC71; color:#2ECC71; font-weight:bold; font-size:0.88em; border-radius:8px; cursor:pointer;">
                                💾 Pobierz raport TXT
                            </button>
                            <button id="ai-report-back-bottom" style="flex:1; padding:12px; background:#333; border:1px solid #555; color:#fff; font-weight:bold; font-size:0.88em; border-radius:8px; cursor:pointer;">
                                🔙 Wróć do Aplikacji
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeModal = () => modal.remove();
        document.getElementById('ai-report-back-top').onclick = closeModal;
        document.getElementById('ai-report-close-top').onclick = closeModal;
        document.getElementById('ai-report-back-bottom').onclick = closeModal;
    },

    importPlanToTemplates: async (id) => {
        let analyses = [];
        try { analyses = await window.DatabaseManager.getAiAnalyses(); } catch(e) { return; }
        const analysis = analyses.find(a => a.id === id);
        if (!analysis) return;

        const content = analysis.content || '';
        
        // Parsowanie ćwiczeń z sekcji planu treningowego
        const exercises = [];
        const lines = content.split('\n');
        let inPlanSection = false;

        for (let line of lines) {
            const clean = line.trim();
            if (clean.toLowerCase().includes('plan treningowy') || clean.toLowerCase().includes('proponowany plan')) {
                inPlanSection = true;
                continue;
            }

            if (inPlanSection || lines.length < 50) {
                // Szukamy linii zaczynających się od myślnika lub liczby np. "- Wyciskanie sztangi - 4 serie x 10-12 powt"
                if (clean.startsWith('-') || clean.startsWith('*') || /^\d+\./.test(clean)) {
                    let exText = clean.replace(/^[-*\d.]+\s*/, '').replace(/\*\*/g, '').trim();
                    if (exText.length > 3) {
                        // Wyciągnij nazwę ćwiczenia (wszystko przed myślnikiem lub dwukropkiem jeśli jest)
                        let exName = exText;
                        let setsCount = 4;
                        let repsCount = 10;
                        let weightCount = 0;

                        if (exText.includes('-') || exText.includes(':')) {
                            const parts = exText.split(/[-:]/);
                            exName = parts[0].trim();
                            const details = parts.slice(1).join(' ');
                            
                            const setsMatch = details.match(/(\d+)\s*(?:seri|ser)/i);
                            if (setsMatch) setsCount = parseInt(setsMatch[1]);

                            const repsMatch = details.match(/(\d+)(?:-\d+)?\s*(?:powt|powtórzeń|reps)/i);
                            if (repsMatch) repsCount = parseInt(repsMatch[1]);
                        }

                        // Tworzenie zestawu serii
                        const sets = [];
                        for (let s = 1; s <= Math.min(10, Math.max(1, setsCount)); s++) {
                            sets.push({ weight: weightCount, reps: repsCount, isCompleted: false });
                        }

                        exercises.push({
                            id: 'ex_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                            name: exName,
                            type: 'strength',
                            sets: sets
                        });
                    }
                }
            }
        }

        // Jeśli nie znaleziono automatycznie, stwórzmy domyślny zestaw z nazwami ćwiczeń
        if (exercises.length === 0) {
            exercises.push(
                { id: 'ex_1', name: 'Zalecane ćwiczenie 1 (od Edwarda)', type: 'strength', sets: [{ weight: 50, reps: 10, isCompleted: false }, { weight: 50, reps: 10, isCompleted: false }, { weight: 50, reps: 10, isCompleted: false }] },
                { id: 'ex_2', name: 'Zalecane ćwiczenie 2 (od Edwarda)', type: 'strength', sets: [{ weight: 40, reps: 12, isCompleted: false }, { weight: 40, reps: 12, isCompleted: false }, { weight: 40, reps: 12, isCompleted: false }] }
            );
        }

        const defaultPlanName = `Plan Edwarda: ${analysis.type === 'monthly' ? 'Miesięczny' : 'Tygodniowy'} (${new Date().toLocaleDateString('pl-PL')})`;
        const planName = prompt("Podaj nazwę dla nowego Planu Treningowego od Trenera Edwarda:", defaultPlanName);
        if (!planName || planName.trim() === '') return;

        const newTemplate = {
            id: Date.now(),
            name: planName.trim(),
            type: 'strength',
            duration_seconds: 3600,
            exercises: exercises
        };

        let templates = [];
        try {
            const tmps = localStorage.getItem('uki_workout_templates');
            if (tmps) templates = JSON.parse(tmps);
        } catch(e) {}

        templates.push(newTemplate);
        localStorage.setItem('uki_workout_templates', JSON.stringify(templates));

        if (window.ChatUI) {
            window.ChatUI.showContextualBubble(`Świetnie! Plan "${newTemplate.name}" (${exercises.length} ćwiczeń) został zapisany w Twoich Szablonach! 💪 Możesz go załadować w zakładce Trening.`);
        } else {
            alert(`Plan "${newTemplate.name}" został pomyślnie zapisany w Szablonach!`);
        }
    },

    exportTxt: async (id) => {
        let analyses = [];
        try { analyses = await window.DatabaseManager.getAiAnalyses(); } catch(e) { return; }
        const analysis = analyses.find(a => a.id === id);
        if (!analysis) return;

        const dateStr = new Date(analysis.date).toLocaleDateString('pl-PL', {day:'numeric', month:'long', year:'numeric'}).replace(/ /g, '_');
        const fileName = `Raport_Trener_Edward_${analysis.type}_${dateStr}.txt`;
        
        const blob = new Blob([analysis.content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    deleteReport: async (id) => {
        if (!confirm('Czy na pewno chcesz usunąć tę analizę?')) return;
        try { await window.DatabaseManager.deleteAiAnalysis(id); await AiAnalyticsUI.loadHistory(); }
        catch(e) { alert('Błąd usuwania analizy.'); }
    }
};

window.AiAnalyticsUI = AiAnalyticsUI;
