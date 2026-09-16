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
            window._cachedTrainingsHistory = records;
            HistoryUI.renderHistoryList(records);
        } catch (err) {
            console.error("Error loading training history:", err);
        }
    },

    renderHistoryList: (records) => {
        const container = document.getElementById('history-grouped-list');
        if (!container) return;
        
        if (records.length === 0) {
            container.innerHTML = `
                <div style="text-align: right; margin-bottom: 15px; padding: 0 15px;">
                    <label style="background: rgba(46,204,113,0.15); border: 1px solid rgba(46,204,113,0.3); color: #2ECC71; padding: 12px 16px; border-radius: 12px; cursor: pointer; font-size: 0.9em; font-weight: bold; display: inline-flex; align-items: center; gap: 8px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Importuj trening
                        <input type="file" accept=".json" style="display: none;" onchange="window.HistoryUI.importTraining(event)">
                    </label>
                </div>
                <p style="color: #8E8E93; text-align: center; font-style: italic;">Brak zarejestrowanych treningów.</p>
            `;
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

        let html = `
            <div style="text-align: right; margin-bottom: 20px; padding: 0 15px;">
                <label style="background: rgba(46,204,113,0.15); border: 1px solid rgba(46,204,113,0.3); color: #2ECC71; padding: 12px 16px; border-radius: 12px; cursor: pointer; font-size: 0.9em; font-weight: bold; display: inline-flex; align-items: center; gap: 8px; backdrop-filter: blur(5px);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Importuj trening
                    <input type="file" accept=".json" style="display: none;" onchange="window.HistoryUI.importTraining(event)">
                </label>
            </div>
        `;
        for (const [monthYear, monthRecords] of Object.entries(grouped)) {
            let templates = [];
            try {
                const tmp = localStorage.getItem('uki_workout_templates');
                if (tmp) templates = JSON.parse(tmp);
            } catch(e) {}
            const templateNames = templates.map(t => (t.name || '').toLowerCase().trim());

            html += `
                <div style="margin-bottom: 30px; padding: 0 15px;">
                    <h3 style="color: #fff; border-bottom: 1px solid rgba(255,152,0,0.3); padding-bottom: 8px; margin-bottom: 20px; text-transform: capitalize; font-size: 1.2em; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        ${monthYear}
                    </h3>
            `;

            monthRecords.forEach((rec, idx) => {
                const totalSets = rec.exercises.reduce((sum, ex) => sum + (ex.sets ? ex.sets.length : 0), 0);
                const totalVolume = rec.exercises.reduce((sum, ex) => {
                    if (!ex.sets) return sum;
                    return sum + ex.sets.reduce((sSum, set) => sSum + (set.weight * set.reps), 0);
                }, 0);

                const cardId = `history-card-${monthYear.replace(/\s/g, '-')}-${idx}`;
                const isTemplate = rec.name && templateNames.includes(rec.name.toLowerCase().trim());
                
                const iconSvg = isTemplate 
                    ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
                    : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00BFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>';

                html += `
                    <div class="log-card" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 20px; border-radius: 20px; backdrop-filter: blur(10px); margin-bottom: 15px; transition: transform 0.2s;">
                        <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; -webkit-tap-highlight-color: transparent;" onclick="document.getElementById('${cardId}').style.display = document.getElementById('${cardId}').style.display === 'none' ? 'block' : 'none'">
                            <div style="display: flex; gap: 12px; align-items: center;">
                                <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); display: flex;">
                                    ${iconSvg}
                                </div>
                                <div>
                                    <strong style="color: #fff; font-size: 1.1em; line-height: 1.2; display: block; margin-bottom: 4px;">${rec.name || rec.date}</strong>
                                    <span style="color: #8E8E93; font-size: 0.85em; font-weight: 500;">${rec.exercises.length} ćwiczeń • ${totalVolume} kg</span>
                                </div>
                            </div>
                            <span style="color: #8E8E93; display: flex;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </span>
                        </div>
                        
                        <div id="${cardId}" style="display: none; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 15px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.02); padding: 10px; border-radius: 12px; text-align: center;">
                                    <strong style="display: block; color: #fff; font-size: 1.1em; margin-bottom: 2px;">${HistoryUI.formatTime(rec.duration_seconds)}</strong>
                                    <span style="color: #8E8E93; font-size: 0.75em; text-transform: uppercase;">Czas</span>
                                </div>
                                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.02); padding: 10px; border-radius: 12px; text-align: center;">
                                    <strong style="display: block; color: #fff; font-size: 1.1em; margin-bottom: 2px;">${totalSets}</strong>
                                    <span style="color: #8E8E93; font-size: 0.75em; text-transform: uppercase;">Serie</span>
                                </div>
                                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.02); padding: 10px; border-radius: 12px; text-align: center;">
                                    <strong style="display: block; color: #fff; font-size: 1.1em; margin-bottom: 2px;">${totalVolume} kg</strong>
                                    <span style="color: #8E8E93; font-size: 0.75em; text-transform: uppercase;">Objętość</span>
                                </div>
                                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.02); padding: 10px; border-radius: 12px; text-align: center;">
                                    <strong style="display: block; color: #fff; font-size: 1.1em; margin-bottom: 2px;">${(rec.smartwatch && rec.smartwatch.calories) ? rec.smartwatch.calories : '--'} kcal</strong>
                                    <span style="color: #8E8E93; font-size: 0.75em; text-transform: uppercase;">Spalone</span>
                                </div>
                            </div>
                            
                            <h4 style="color: #FF9800; margin: 0 0 15px 0; font-size: 1em; font-weight: 600;">Szczegóły ćwiczeń</h4>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${rec.exercises.map((ex, i) => {
                                    if (ex.type === 'superset' && ex.exercises && ex.exercises.length > 0) {
                                        let html = `
                                            <div style="background: rgba(233, 30, 99, 0.05); border: 1px solid rgba(233, 30, 99, 0.2); border-radius: 12px; padding: 15px;">
                                                <div style="color: #E91E63; font-weight: 700; font-size: 0.9em; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">${i+1}. Blok Łączony (Superseria)</div>
                                        `;
                                        ex.exercises.forEach((nestedEx, nIdx) => {
                                            html += `
                                                <div style="margin-bottom: 8px; color: #fff; font-weight: 600; font-size: 0.95em;">${i+1}.${nIdx+1}. ${nestedEx.name || 'Nieznane ćwiczenie'}</div>
                                                <div style="padding-left: 12px; border-left: 2px solid rgba(233, 30, 99, 0.5); margin-bottom: 15px; font-size: 0.9em; color: #ccc;">
                                                    ${(!nestedEx.sets || nestedEx.sets.length === 0) ? '<em style="color: #777;">Brak serii</em>' : ''}
                                                    ${(nestedEx.sets || []).map((set, sIdx) => `
                                                        <div style="margin-bottom: 3px;">Seria ${sIdx + 1}: <strong style="color: #fff;">${set.weight} kg</strong> × ${set.reps} powt.</div>
                                                    `).join('')}
                                                </div>
                                            `;
                                        });
                                        html += `</div>`;
                                        return html;
                                    } else {
                                        return `
                                            <div style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 15px;">
                                                <div style="color: #fff; font-weight: 600; font-size: 0.95em; margin-bottom: 10px;">${i+1}. ${ex.name || 'Nieznane ćwiczenie'}</div>
                                                <div style="padding-left: 12px; border-left: 2px solid rgba(0, 191, 255, 0.5); font-size: 0.9em; color: #ccc;">
                                                    ${(!ex.sets || ex.sets.length === 0) ? '<em style="color: #777;">Brak serii</em>' : ''}
                                                    ${(ex.sets || []).map((set, sIdx) => `
                                                        <div style="margin-bottom: 3px;">Seria ${sIdx + 1}: <strong style="color: #fff;">${set.weight} kg</strong> × ${set.reps} powt.</div>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        `;
                                    }
                                }).join('')}
                            </div>
                            
                            <!-- Action Buttons -->
                            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 25px;">
                                <button onclick="window.HistoryUI.shareTraining('${rec.id}')" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(59, 89, 152, 0.15); border: 1px solid rgba(59, 89, 152, 0.4); color: #fff; padding: 14px; border-radius: 12px; font-size: 0.9em; font-weight: 600; cursor: pointer; transition: background 0.2s;">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                                    Udostępnij (Obraz)
                                </button>
                                <div style="display: flex; gap: 10px;">
                                    <button onclick="window.HistoryUI.exportTraining('${rec.id}')" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(255,152,0,0.15); border: 1px solid rgba(255,152,0,0.4); color: #FF9800; padding: 12px; border-radius: 12px; font-size: 0.85em; font-weight: 600; cursor: pointer; transition: background 0.2s;">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                        Eksportuj
                                    </button>
                                    <button onclick="window.HistoryUI.saveAsTemplateFromHistory('${rec.id}')" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(46,204,113,0.15); border: 1px solid rgba(46,204,113,0.4); color: #2ECC71; padding: 12px; border-radius: 12px; font-size: 0.85em; font-weight: 600; cursor: pointer; transition: background 0.2s;">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                        Szablon
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
        }
        
        container.innerHTML = html;
    },

    saveAsTemplateFromHistory: (trainingId) => {
        const records = window._cachedTrainingsHistory || [];
        const rec = records.find(r => String(r.id) === String(trainingId));
        if (!rec) {
            alert("Nie znaleziono treningu.");
            return;
        }

        const templateName = prompt("Podaj nazwę dla nowego Planu Treningowego (np. 'Z historii: Klatka'):", `Z planu: ${rec.name || rec.date}`);
        if (!templateName || templateName.trim() === '') return;

        const template = {
            id: Date.now(),
            name: templateName.trim(),
            type: rec.type || 'strength',
            duration_seconds: rec.duration_seconds || 0,
            exercises: JSON.parse(JSON.stringify(rec.exercises)).map(ex => {
                const newEx = { ...ex, cardioInterval: null };
                return newEx;
            })
        };

        let templates = [];
        try {
            const tmps = localStorage.getItem('uki_workout_templates');
            if (tmps) templates = JSON.parse(tmps);
        } catch(e) {}
        
        templates.push(template);
        localStorage.setItem('uki_workout_templates', JSON.stringify(templates));
        alert(`Plan Treningowy "${template.name}" został zapisany!`);
        HistoryUI.loadHistory(); // Odśwież widok by zaktualizować ikony gwiazdek
    },

    shareTraining: async (trainingId) => {
        // Zamiast robić await na DB (co na iOS może zgubić uprawnienie do navigator.share ze względu na czas oczekiwania), szukamy w pamięci:
        const records = window._cachedTrainingsHistory || [];
        const rec = records.find(r => String(r.id) === String(trainingId));
        
        if (!rec) {
            alert("Błąd: Nie znaleziono treningu w pamięci. Odśwież stronę i spróbuj ponownie.");
            return;
        }

        const totalVolume = rec.exercises.reduce((sum, ex) => {
            if (!ex.sets) return sum;
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

            await ShareUtils.generateTrainingReceipt(rec, avatar, nickname);
            
        } catch (error) {
            console.log('Błąd podczas udostępniania:', error);
            // Fallback: Copy to clipboard using prompt if writeText fails due to lack of focus
            try {
                window.prompt("Udostępnianie graficzne niedostępne na tym urządzeniu. Skopiuj swój wynik poniżej (Ctrl+C / Cmd+C):", textToShare);
            } catch(e) {
                console.error("Fallback również zawiódł", e);
            }
        }
    },

    exportTraining: async (trainingId) => {
        const records = window._cachedTrainingsHistory || [];
        const rec = records.find(r => String(r.id) === String(trainingId));
        if (!rec) {
            alert("Nie znaleziono treningu.");
            return;
        }
        
        // Prepare clean object for export
        const exportData = {
            ukiExportType: 'training',
            version: window.APP_VERSION,
            data: rec
        };
        
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `trening_${rec.date.replace(/-/g, '')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    importTraining: async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const jsonString = event.target.result;
                const importedData = JSON.parse(jsonString);
                
                if (importedData.ukiExportType !== 'training' || !importedData.data) {
                    alert("To nie jest poprawny plik z pojedynczym treningiem Uki's BodyBuild.");
                    return;
                }
                
                const rec = importedData.data;
                // Generate new ID to avoid conflicts
                rec.id = Date.now(); 
                
                // Prompt user to confirm
                if (confirm(`Czy na pewno chcesz zaimportować trening "${rec.name}" z dnia ${rec.date}?`)) {
                    await window.DatabaseManager.saveTraining(rec);
                    alert("Trening został pomyślnie zaimportowany!");
                    HistoryUI.loadHistory();
                }
            } catch (err) {
                console.error(err);
                alert("Błąd podczas importu treningu. Upewnij się, że plik jest prawidłowy.");
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset input
    }
};

window.HistoryUI = HistoryUI;
