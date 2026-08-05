import { DatabaseManager } from '../db/DatabaseManager.js';

export const HistoryUI = {
    init: () => {
        document.addEventListener('tabChanged', (e) => {
            if(e.detail && e.detail.tab === 'history-dashboard') {
                HistoryUI.loadHistory();
            }
        });
    },

    formatTime: (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    },

    loadHistory: async () => {
        try {
            const records = await DatabaseManager.getTrainings();
            HistoryUI.renderHistoryList(records);
        } catch (err) {
            console.error("Error loading training history:", err);
        }
    },

    renderHistoryList: (records) => {
        const container = document.getElementById('history-grouped-list');
        if (!container) return;
        
        if (records.length === 0) {
            container.innerHTML = '<p style="color: #888; text-align: center; font-style: italic;">Brak zarejestrowanych treningów.</p>';
            return;
        }

        // Sort records by date descending (newest first)
        records.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Group records by Month-Year
        const grouped = {};
        records.forEach(rec => {
            const dateObj = new Date(rec.date);
            const monthYear = dateObj.toLocaleString('pl-PL', { month: 'long', year: 'numeric' });
            if (!grouped[monthYear]) {
                grouped[monthYear] = [];
            }
            grouped[monthYear].push(rec);
        });

        let html = '';
        for (const [monthYear, monthRecords] of Object.entries(grouped)) {
            html += `
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #fff; border-bottom: 2px solid #00BFFF; padding-bottom: 5px; margin-bottom: 15px; text-transform: capitalize;">${monthYear}</h3>
            `;

            monthRecords.forEach((rec, idx) => {
                const totalSets = rec.exercises.reduce((sum, ex) => sum + (ex.sets ? ex.sets.length : 0), 0);
                const totalVolume = rec.exercises.reduce((sum, ex) => {
                    return sum + (ex.sets ? ex.sets.reduce((sSum, set) => sSum + (set.weight * set.reps), 0) : 0);
                }, 0);

                html += `
                    <div class="log-card" style="background: #222; border: 1px solid #444; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                        <div style="margin-bottom: 5px;">
                            <strong style="color: #00BFFF; font-size: 1.1em;">🏋️ ${rec.name || 'Trening'}</strong> 
                            <span style="color: #aaa; font-size: 0.9em;">(${rec.date})</span>
                        </div>
                        <div style="color: #ccc; font-size: 0.9em; line-height: 1.4;">
                            <div><strong>Czas:</strong> ${HistoryUI.formatTime(rec.duration_seconds)} | <strong>Ćwiczeń:</strong> ${rec.exercises.length}</div>
                            <div><strong>Objętość:</strong> ${totalVolume} kg | <strong>Serii:</strong> ${totalSets}</div>
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
        }
        
        container.innerHTML = html;
    }
};

window.HistoryUI = HistoryUI;
