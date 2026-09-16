import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { AiAnalyticsEngine } from '../ai/AiAnalyticsEngine.js';

export const AiAnalyticsUI = {
    render: async (container) => {
        container.innerHTML = `
            <div style="background: rgba(255,152,0,0.05); border: 1px solid rgba(255,152,0,0.2); border-radius: 20px; padding: 25px 20px; margin-bottom: 30px; backdrop-filter: blur(10px);">
                <div style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 20px;">
                    <div style="background: rgba(255,152,0,0.1); padding: 12px; border-radius: 16px; border: 1px solid rgba(255,152,0,0.2); display: flex; align-items: center; justify-content: center;">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
                    </div>
                    <div>
                        <h3 style="margin: 0 0 6px 0; color: #fff; font-size: 1.2em; font-weight: 600;">Trener Edward</h3>
                        <p style="margin: 0; font-size: 0.85em; color: #8E8E93; line-height: 1.5;">Analiza treningów, diety i regeneracji. Oparta na AI historia treningów i parametry sylwetki.</p>
                    </div>
                </div>
                <div style="display: flex; gap: 12px;">
                    <button id="ai-gen-weekly-btn" style="flex: 1; padding: 14px 10px; background: rgba(0, 191, 255, 0.1); border: 1px solid rgba(0, 191, 255, 0.3); color: #00BFFF; border-radius: 12px; font-weight: 600; font-size: 0.9em; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; transition: background 0.2s;">
                        Analiza Tygodniowa
                        <span style="font-size: 0.75em; font-weight: normal; opacity: 0.7;">Ostatnie 7 dni</span>
                    </button>
                    <button id="ai-gen-monthly-btn" style="flex: 1; padding: 14px 10px; background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3); color: #FFD700; border-radius: 12px; font-weight: 600; font-size: 0.9em; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; transition: background 0.2s;">
                        Analiza Miesięczna
                        <span style="font-size: 0.75em; font-weight: normal; opacity: 0.7;">Ostatnie 30 dni</span>
                    </button>
                </div>
                <div id="ai-status-bar" style="display:none; margin-top: 15px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 12px; text-align: center; color: #00BFFF; font-size: 0.9em; border: 1px solid rgba(255,255,255,0.1);">
                    Trener Edward analizuje... To może potrwać kilkanaście sekund.
                </div>
            </div>

            <div style="padding: 0 5px;">
                <h4 style="color: #FF9800; border-bottom: 1px solid rgba(255,152,0,0.2); padding-bottom: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; font-weight: 600; font-size: 1.1em;">
                    <span style="display: flex; align-items: center; gap: 8px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Historia Analiz
                    </span>
                    <span style="font-size: 0.75em; color: #8E8E93; font-weight: normal;">Archiwum postępów</span>
                </h4>
                <div id="ai-history-list">
                    <p style="color:#888; text-align:center; padding:20px;">Ladowanie historii...</p>
                </div>
            </div>
        `;

        document.getElementById('ai-gen-weekly-btn').addEventListener('click', () => {
            if (window.PremiumUI && !window.PremiumUI.checkPremium()) {
                window.PremiumUI.showPremiumPaywall();
                return;
            }
            AiAnalyticsUI.openInterviewModal(7);
        });
        document.getElementById('ai-gen-monthly-btn').addEventListener('click', () => {
            if (window.PremiumUI && !window.PremiumUI.checkPremium()) {
                window.PremiumUI.showPremiumPaywall();
                return;
            }
            AiAnalyticsUI.openInterviewModal(30);
        });

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
            listContainer.innerHTML = '<div style="text-align:center; padding:40px 20px; background:rgba(255,255,255,0.02); border-radius:20px; border:1px dashed rgba(255,255,255,0.1);"><div style="display:inline-flex; align-items:center; justify-content:center; width:60px; height:60px; border-radius:50%; background:rgba(255,152,0,0.1); margin-bottom:15px;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg></div><p style="color:#8E8E93; margin:0; font-size:0.95em; line-height: 1.5;">Brak historii analiz.<br>Wygeneruj pierwszą — Edward czeka!</p></div>';
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
            <div style="background:rgba(17,17,24,0.95); padding:30px 20px; border-radius:24px; border:1px solid rgba(255,152,0,0.4); width:100%; max-width:420px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 50px rgba(0,0,0,0.5); text-align:left; box-sizing:border-box; backdrop-filter:blur(20px);">
                <div style="text-align:center; margin-bottom:25px;">
                    <div style="display:inline-flex; align-items:center; justify-content:center; width:64px; height:64px; border-radius:50%; background:rgba(255,152,0,0.1); margin-bottom:15px; border:1px solid rgba(255,152,0,0.2);">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
                    </div>
                    <h3 style="color:#FF9800; margin:0 0 8px 0; font-size:1.3em; font-weight:600;">Wywiad Trenera Edwarda</h3>
                    <p style="color:#8E8E93; font-size:0.9em; margin:0; line-height:1.5;">
                        Analiza dla okresu: <strong style="color:#fff;">ostatnie ${days} dni</strong>.<br>Uzupełnij parametry, aby Edward przygotował maksymalnie precyzyjne zalecenia!
                    </p>
                </div>

                <!-- 1. Sen -->
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:16px; padding:16px; margin-bottom:16px;">
                    <label style="display:flex; align-items:center; gap:8px; color:#00BFFF; font-weight:600; font-size:0.9em; margin-bottom:12px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                        Średni sen na dobę:
                    </label>
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
                        <button id="ai-sleep-minus" type="button" style="width:44px; height:44px; border-radius:12px; background:rgba(255,255,255,0.05); color:#fff; border:1px solid rgba(255,255,255,0.1); font-size:1.4em; cursor:pointer; display:flex; align-items:center; justify-content:center;">-</button>
                        <div style="text-align:center;">
                            <span id="ai-sleep-val" style="font-size:2.4em; color:#fff; font-weight:bold; line-height:1;">7</span>
                            <span style="font-size:0.85em; color:#8E8E93; margin-left:4px;">h</span>
                        </div>
                        <button id="ai-sleep-plus" type="button" style="width:44px; height:44px; border-radius:12px; background:rgba(0,191,255,0.15); color:#00BFFF; border:1px solid rgba(0,191,255,0.3); font-size:1.4em; cursor:pointer; font-weight:bold; display:flex; align-items:center; justify-content:center;">+</button>
                    </div>
                </div>

                <!-- 2. Staż treningowy -->
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:16px; padding:16px; margin-bottom:16px;">
                    <label for="ai-interview-exp" style="display:flex; align-items:center; gap:8px; color:#FFD700; font-weight:600; font-size:0.9em; margin-bottom:10px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                        Twój staż treningowy:
                    </label>
                    <select id="ai-interview-exp" style="width:100%; padding:14px; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1); color:#fff; border-radius:12px; font-size:0.95em; font-weight:500; appearance:none; outline:none;">
                        <option value="Początkujący (< 1 rok)" ${savedExp.includes('Początkujący') ? 'selected' : ''}>Początkujący (< 1 rok)</option>
                        <option value="1-3 lata (Średniozaawansowany)" ${savedExp.includes('1-3 lata') ? 'selected' : ''}>1-3 lata (Średniozaawansowany)</option>
                        <option value="3-5 lat (Zaawansowany)" ${savedExp.includes('3-5 lat') ? 'selected' : ''}>3-5 lat (Zaawansowany)</option>
                        <option value="5+ lat (Weteran / Zawodnik)" ${savedExp.includes('5+') ? 'selected' : ''}>5+ lat (Weteran / Zawodnik)</option>
                    </select>
                </div>

                <!-- 3. Cel sylwetkowy -->
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:16px; padding:16px; margin-bottom:24px;">
                    <label for="ai-interview-goal" style="display:flex; align-items:center; gap:8px; color:#2ECC71; font-weight:600; font-size:0.9em; margin-bottom:10px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                        Główny cel sylwetkowy:
                    </label>
                    <select id="ai-interview-goal" style="width:100%; padding:14px; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1); color:#fff; border-radius:12px; font-size:0.95em; font-weight:500; appearance:none; outline:none;">
                        <option value="Budowa masy mięśniowej (Hipertrofia)" ${savedGoal === 'bulk' || savedGoal.includes('mas') ? 'selected' : ''}>Budowa masy mięśniowej (Hipertrofia)</option>
                        <option value="Redukcja tkanki tłuszczowej (Spalanie tłuszczu)" ${savedGoal === 'cut' || savedGoal.includes('reduk') ? 'selected' : ''}>Redukcja tkanki tłuszczowej (Rzeźba)</option>
                        <option value="Rekompozycja i utrzymanie formy" ${savedGoal === 'maintenance' || savedGoal.includes('utrzy') ? 'selected' : ''}>Rekompozycja / Utrzymanie formy</option>
                        <option value="Budowa siły maksymalnej" ${savedGoal.includes('sił') ? 'selected' : ''}>Budowa siły maksymalnej</option>
                    </select>
                </div>

                <div style="display:flex; flex-direction:column; gap:12px;">
                    <button id="ai-interview-submit" style="width:100%; padding:16px; background:#FF9800; color:#111118; font-weight:bold; border:none; border-radius:12px; cursor:pointer; font-size:1.05em; display:flex; align-items:center; justify-content:center; gap:8px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        Generuj Analizę
                    </button>
                    <button id="ai-interview-cancel" style="width:100%; padding:14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#8E8E93; border-radius:12px; cursor:pointer; font-size:0.95em; font-weight:600;">
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
        modal.innerHTML = '<div style="background:rgba(255,255,255,0.05); padding:30px 25px; border-radius:24px; border:1px solid rgba(255,152,0,0.3); width:100%; max-width:360px; text-align:center; box-shadow:0 20px 40px rgba(0,0,0,0.4); backdrop-filter:blur(20px);">'
            + '<div style="display:inline-flex; align-items:center; justify-content:center; width:64px; height:64px; border-radius:50%; background:rgba(255,152,0,0.1); margin-bottom:20px;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>'
            + '<h3 style="color:#FF9800; margin:0 0 12px 0; font-size:1.2em; font-weight:600;">Brak danych do analizy</h3>'
            + '<p style="color:#8E8E93; font-size:0.9em; line-height:1.6; margin:0 0 24px 0;">Edward nie ma czego analizować — w ciągu ostatnich <strong style="color:#fff;">' + days + ' dni</strong> nie zostały zapisane żadne treningi.<br><br>Zaloguj co najmniej jeden trening, a Edward chętnie oceni Twoje postępy!</p>'
            + '<button id="ai-nodata-close" style="width:100%; padding:14px; background:#FF9800; color:#111118; font-weight:bold; border:none; border-radius:12px; cursor:pointer; font-size:1em;">Rozumiem, zaraz trenuję!</button>'
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
            <div style="background:rgba(17,17,24,0.85); backdrop-filter: blur(20px); border-bottom:1px solid rgba(255,255,255,0.1); padding:max(16px, env(safe-area-inset-top, 16px)) 16px 14px 16px; display:flex; justify-content:space-between; align-items:center; flex-shrink:0; gap:8px;">
                <button id="ai-report-back-top" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff; border-radius:12px; font-size:0.88em; font-weight:600; cursor:pointer; padding:8px 12px; display:flex; align-items:center; gap:5px; flex-shrink:0;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    Powrót
                </button>

                <div style="text-align:center; flex:1; overflow:hidden;">
                    <div style="color:#FF9800; font-weight:600; font-size:0.95em; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${typeLabel}</div>
                    <div style="color:#8E8E93; font-size:0.75em;">${dateStr}</div>
                </div>

                <div style="display:flex; gap:8px; flex-shrink:0;">
                    <button onclick="window.AiAnalyticsUI.importPlanToTemplates(${analysis.id})" title="Zapisz proponowany plan do Szablonów" style="background:rgba(0,191,255,0.15); border:1px solid rgba(0,191,255,0.3); color:#00BFFF; border-radius:12px; font-size:0.8em; font-weight:600; cursor:pointer; padding:8px 10px; display:flex; align-items:center; justify-content:center;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                    <button onclick="window.AiAnalyticsUI.exportTxt(${analysis.id})" title="Pobierz plik tekstowy" style="background:rgba(46,204,113,0.15); border:1px solid rgba(46,204,113,0.3); color:#2ECC71; border-radius:12px; font-size:0.8em; font-weight:600; cursor:pointer; padding:8px 10px; display:flex; align-items:center; justify-content:center;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </button>
                    <button id="ai-report-close-top" style="background:rgba(255,69,58,0.15); border:1px solid rgba(255,69,58,0.3); color:#FF453A; width:34px; height:34px; border-radius:12px; font-size:1.3em; cursor:pointer; display:flex; align-items:center; justify-content:center;">&times;</button>
                </div>
            </div>

            <!-- Scrollable Analysis Content -->
            <div style="flex:1; overflow-y:auto; padding:20px 14px 40px 14px; -webkit-overflow-scrolling:touch;">
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:20px 16px; color:#eee; line-height:1.75; font-size:0.95em; max-width:700px; margin:0 auto;">
                    ${parsedContent}

                    <!-- Action Box at bottom of report -->
                    <div style="margin-top:35px; padding-top:20px; border-top:1px solid rgba(255,152,0,0.3); display:flex; flex-direction:column; gap:12px;">
                        <button onclick="window.AiAnalyticsUI.importPlanToTemplates(${analysis.id})" style="width:100%; padding:14px; background:rgba(0,191,255,0.1); border:1px solid rgba(0,191,255,0.3); color:#00BFFF; font-weight:600; font-size:0.95em; border-radius:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            Zapisz Proponowany Trening jako Szablon
                        </button>
                        
                        <div style="display:flex; gap:10px;">
                            <button onclick="window.AiAnalyticsUI.exportTxt(${analysis.id})" style="flex:1; padding:14px; background:rgba(46,204,113,0.1); border:1px solid rgba(46,204,113,0.3); color:#2ECC71; font-weight:600; font-size:0.9em; border-radius:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                Raport TXT
                            </button>
                            <button id="ai-report-back-bottom" style="flex:1; padding:14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff; font-weight:600; font-size:0.9em; border-radius:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                                Wróć do Aplikacji
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
