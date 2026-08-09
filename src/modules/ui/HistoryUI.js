import { DatabaseManager } from '../db/DatabaseManager.js';
import { ShareUtils } from '../../utils/ShareUtils.js';

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
                const totalSets = rec.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
                const totalVolume = rec.exercises.reduce((sum, ex) => {
                    return sum + ex.sets.reduce((sSum, set) => sSum + (set.weight * set.reps), 0);
                }, 0);

                const cardId = `history-card-${monthYear.replace(/\s/g, '-')}-${idx}`;

                html += `
                    <div class="log-card" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(0, 191, 255, 0.4); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; cursor: pointer;" onclick="document.getElementById('${cardId}').style.display = document.getElementById('${cardId}').style.display === 'none' ? 'block' : 'none'">
                            <div>
                                <strong style="color: #00BFFF; font-size: 1.1em;">🏋️ ${rec.date}</strong><br>
                                <span style="color: #aaa; font-size: 0.85em;">${rec.exercises.length} ćwiczeń | ${totalVolume} kg</span>
                            </div>
                            <span style="color: #00BFFF; font-size: 1.2em;">▼</span>
                        </div>
                        
                        <div id="${cardId}" style="display: none; border-top: 1px solid rgba(0,191,255,0.2); padding-top: 15px; margin-top: 10px;">
                            <div style="font-size: 0.9em; line-height: 1.5; color: #eee; margin-bottom: 15px;">
                                <div><strong>Czas trwania:</strong> ${HistoryUI.formatTime(rec.duration_seconds)}</div>
                                <div><strong>Wszystkich serii:</strong> ${totalSets}</div>
                                <div><strong>Całkowita objętość (kg):</strong> ${totalVolume} kg</div>
                            </div>
                            
                            <h4 style="color: #00BFFF; margin-bottom: 10px;">Szczegóły ćwiczeń:</h4>
                                ${rec.exercises.map((ex, i) => `
                                    <div style="margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 5px;">
                                        <div style="color: #fff; font-weight: bold; margin-bottom: 5px;">${i+1}. ${ex.name || 'Nieznane ćwiczenie'}</div>
                                        <div style="padding-left: 10px; border-left: 2px solid #00BFFF;">
                                            ${ex.sets.length === 0 ? '<em style="color: #777;">Brak serii</em>' : ''}
                                            ${ex.sets.map((set, sIdx) => `
                                                <div>Seria ${sIdx + 1}: ${set.weight} kg x ${set.reps} powt.</div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            
                            <button onclick="window.HistoryUI.shareTraining('${rec.id}')" class="action-button" style="background-color: #3b5998; border-color: #3b5998; color: white; width: 100%; margin-top: 15px;">
                                📤 Udostępnij Trening
                            </button>
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
        }
        
        container.innerHTML = html;
    },

    shareTraining: async (trainingId) => {
        const records = await DatabaseManager.getTrainings();
        const rec = records.find(r => r.id === trainingId);
        if (!rec) return;

        const totalVolume = rec.exercises.reduce((sum, ex) => {
            return sum + ex.sets.reduce((sSum, set) => sSum + (set.weight * set.reps), 0);
        }, 0);
        const exercisesCount = rec.exercises.length;
        const dateStr = rec.date;

        const gender = localStorage.getItem('uki-bodybuild-gender') || 'male';
        const finishedText = gender === 'female' ? 'ukończyłam' : 'ukończyłem';
        const didText = gender === 'female' ? 'Zrobiłam' : 'Zrobiłem';
        const liftedText = gender === 'female' ? 'przerzuciłam' : 'przerzuciłem';
        const textToShare = `Właśnie ${finishedText} trening (${dateStr})! ${didText} ${exercisesCount} ćwiczeń i ${liftedText} ${totalVolume} kg! 🔥 Uki's BodyBuild 💪 Dołącz do nas: https://lukaszdudzinski.github.io/Ukis-BodyBuild/`;
        
        try {
            // Fetch avatar and nickname from settings
            const settingsStr = localStorage.getItem('uki_bodybuild_settings');
            let avatar = localStorage.getItem('uki-bodybuild-avatar') || null;
            let nickname = 'BodyBuilder';
            if (settingsStr) {
                const settings = JSON.parse(settingsStr);
                nickname = settings.nickname || 'BodyBuilder';
            }

            const statsList = [
                { label: 'Data treningu', value: dateStr },
                { label: 'Ciężar', value: `${totalVolume} kg`, color: '#00BFFF' },
                { label: 'Liczba ćwiczeń', value: String(exercisesCount) }
            ];

            const socialPhoto = (rec.socialPhotos && rec.socialPhotos.length > 0) ? rec.socialPhotos[0] : null;

            await ShareUtils.generateAndShareImage("Mój Trening", statsList, avatar, nickname, textToShare, socialPhoto);
            
        } catch (error) {
            console.log('Błąd podczas udostępniania:', error);
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(textToShare)
                .then(() => alert("Szczegóły treningu skopiowane do schowka!"))
                .catch(err => console.error("Błąd kopiowania", err));
        }
    }
};

window.HistoryUI = HistoryUI;
