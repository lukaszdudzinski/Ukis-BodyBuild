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

        document.getElementById('ai-gen-weekly-btn').addEventListener('click', () => AiAnalyticsUI.openSleepModal(7));
        document.getElementById('ai-gen-monthly-btn').addEventListener('click', () => AiAnalyticsUI.openSleepModal(30));

        await AiAnalyticsUI.loadHistory();
    },

    loadHistory: async () => {
        const listContainer = document.getElementById('ai-history-list');
        if (!listContainer) return;

        let analyses = [];
        try {
            analyses = await window.DatabaseManager.getAiAnalyses();
        } catch (e) {
            listContainer.innerHTML = '<p style="color:#ff4444; text-align:center; padding:20px;">Blad ladowania historii analiz.</p>';
            return;
        }

        if (!analyses || analyses.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center; padding:30px 20px; background:rgba(255,255,255,0.03); border-radius:10px; border:1px dashed rgba(255,152,0,0.2);"><div style="font-size:2.5em; margin-bottom:10px;">🏋️</div><p style="color:#888; margin:0; font-size:0.9em;">Brak historii analiz.<br>Wygeneruj pierwsza - Edward czeka!</p></div>';
            return;
        }

        const MONTHS_PL = ['Styczen','Luty','Marzec','Kwiecien','Maj','Czerwiec','Lipiec','Sierpien','Wrzesien','Pazdziernik','Listopad','Grudzien'];
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
                        + '<button onclick="window.AiAnalyticsUI.deleteReport(' + a.id + ')" style="padding:9px 12px; background:rgba(255,68,68,0.12); color:#ff6666; border:1px solid rgba(255,68,68,0.25); border-radius:6px; font-size:0.85em; cursor:pointer;">Usun</button>'
                        + '</div>'
                        + '</div>';
                });
                html += '</div></details>';
            });
            html += '</div></details>';
        });

        listContainer.innerHTML = html;
    },

    openSleepModal: (days) => {
        let modal = document.getElementById('ai-sleep-modal');
        if (modal) modal.remove();
        modal = document.createElement('div');
        modal.id = 'ai-sleep-modal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.92); z-index:9999; display:flex; justify-content:center; align-items:center; padding:20px; box-sizing:border-box;';
        modal.innerHTML = '<div style="background:linear-gradient(135deg,#1a1a1a,#111); padding:28px 24px; border-radius:14px; border:1px solid #00BFFF; width:100%; max-width:380px; text-align:center; box-shadow:0 15px 50px rgba(0,191,255,0.2);">'
            + '<div style="font-size:2.5em; margin-bottom:10px;">😴</div>'
            + '<h3 style="color:#00BFFF; margin:0 0 8px 0;">Dane o śnie (opcjonalne)</h3>'
            + '<p style="color:#ccc; font-size:0.85em; margin:0 0 20px 0; line-height:1.5;">Ile godzin średnio spałeś przez ostatnie <strong style="color:#fff;">' + days + ' dni</strong>? Możesz pominąć — analiza będzie oznaczona jako niekompletna w tej kwestii.</p>'
            + '<div id="sleep-picker" style="display:flex; align-items:center; justify-content:center; gap:24px; margin-bottom:24px;">'
            + '<button id="sleep-minus" style="width:48px; height:48px; border-radius:50%; background:rgba(255,255,255,0.08); color:#fff; border:1px solid rgba(255,255,255,0.2); font-size:1.5em; cursor:pointer;">-</button>'
            + '<div><div id="sleep-val" style="font-size:3.5em; color:#fff; font-weight:bold; line-height:1;">7</div><div style="font-size:0.8em; color:#888; margin-top:4px;">godzin snu</div></div>'
            + '<button id="sleep-plus" style="width:48px; height:48px; border-radius:50%; background:#00BFFF; color:#000; border:none; font-size:1.5em; cursor:pointer; font-weight:bold;">+</button>'
            + '</div>'
            + '<div style="display:flex; flex-direction:column; gap:10px;">'
            + '<button id="sleep-confirm" style="padding:14px; background:linear-gradient(135deg,#00BFFF,#005f99); color:#fff; font-weight:bold; border:none; border-radius:8px; cursor:pointer; font-size:0.95em;">Wygeneruj z danymi o śnie 🚀</button>'
            + '<div style="display:flex; gap:10px;">'
            + '<button id="sleep-skip" style="flex:1; padding:11px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); color:#aaa; border-radius:8px; cursor:pointer; font-size:0.85em;">Pomiń sen</button>'
            + '<button id="sleep-cancel" style="flex:1; padding:11px; background:transparent; border:1px solid #333; color:#666; border-radius:8px; cursor:pointer; font-size:0.85em;">Anuluj</button>'
            + '</div></div></div>';
        document.body.appendChild(modal);

        let sleepVal = 7;
        const valEl = document.getElementById('sleep-val');
        document.getElementById('sleep-minus').onclick = () => { sleepVal = Math.max(0, sleepVal - 0.5); valEl.textContent = sleepVal; };
        document.getElementById('sleep-plus').onclick = () => { sleepVal = Math.min(12, sleepVal + 0.5); valEl.textContent = sleepVal; };
        document.getElementById('sleep-cancel').onclick = () => modal.remove();
        document.getElementById('sleep-confirm').onclick = async () => { modal.remove(); await AiAnalyticsUI.generateAnalysis(days, sleepVal); };
        document.getElementById('sleep-skip').onclick = async () => { modal.remove(); await AiAnalyticsUI.generateAnalysis(days, null); };
    },

    generateAnalysis: async (days, sleepHours) => {
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
                // Pokaż ładny modal zamiast alert
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
            const result = await AiAnalyticsEngine.generate(days, sleepHours);
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
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.97); z-index:9999; display:flex; flex-direction:column; box-sizing:border-box; overflow:hidden;';
        const typeLabel = analysis.type === 'monthly' ? 'Analiza Miesięczna' : 'Analiza Tygodniowa';
        const dateStr = new Date(analysis.date).toLocaleDateString('pl-PL', {day:'numeric', month:'long', year:'numeric'});
        let parsedContent = analysis.content;
        try { parsedContent = marked.parse(analysis.content); } catch(e) {}
        modal.innerHTML = '<div style="background:#111; border-bottom:1px solid rgba(255,152,0,0.3); padding:16px 20px; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">'
            + '<div><div style="color:#FF9800; font-weight:bold;">' + typeLabel + '</div><div style="color:#888; font-size:0.8em; margin-top:2px;">' + dateStr + '</div></div>'
            + '<button id="ai-report-close" style="background:rgba(255,255,255,0.1); border:none; color:#fff; width:38px; height:38px; border-radius:50%; font-size:1.4em; cursor:pointer; display:flex; align-items:center; justify-content:center;">&times;</button>'
            + '</div>'
            + '<div style="flex:1; overflow-y:auto; padding:20px 16px; -webkit-overflow-scrolling:touch;">'
            + '<div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:20px; color:#eee; line-height:1.75; font-size:0.95em; max-width:700px; margin:0 auto;">'
            + parsedContent + '</div></div>';
        document.body.appendChild(modal);
        document.getElementById('ai-report-close').onclick = () => modal.remove();
    },

    deleteReport: async (id) => {
        if (!confirm('Czy na pewno chcesz usunac te analize?')) return;
        try { await window.DatabaseManager.deleteAiAnalysis(id); await AiAnalyticsUI.loadHistory(); }
        catch(e) { alert('Blad usuwania analizy.'); }
    }
};

window.AiAnalyticsUI = AiAnalyticsUI;
