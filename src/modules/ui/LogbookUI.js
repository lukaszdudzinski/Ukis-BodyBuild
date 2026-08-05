import { LogbookDB } from '../data/LogbookDB.js';

export const LogbookUI = {
    async init() {
        console.log("Initializing Logbook UI...");

        const logbookContainer = document.getElementById('logbook-dashboard');
        if (!logbookContainer) return;

        // Setup Event Listeners
        const addLogBtn = document.getElementById('logbook-add-btn');
        const cancelLogBtn = document.getElementById('logbook-cancel-btn');
        const formView = document.getElementById('logbook-form-view');
        const listView = document.getElementById('logbook-list-view');
        const logForm = document.getElementById('addLogForm');

        if (addLogBtn) {
            addLogBtn.addEventListener('click', () => {
                listView.style.display = 'none';
                formView.style.display = 'block';
                // Set default date to today
                const dateInput = document.getElementById('logDate');
                if (dateInput) {
                    dateInput.value = new Date().toISOString().split('T')[0];
                }
            });
        }

        if (cancelLogBtn) {
            cancelLogBtn.addEventListener('click', () => {
                formView.style.display = 'none';
                listView.style.display = 'block';
                logForm.reset();
            });
        }

        if (logForm) {
            logForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleFormSubmit();
                formView.style.display = 'none';
                listView.style.display = 'block';
                logForm.reset();
                await this.renderLogs();
            });
        }

        // Initialize DB and Render
        try {
            await LogbookDB.init();
            await this.renderLogs();
        } catch (error) {
            console.error("Failed to initialize LogbookDB:", error);
            const listContainer = document.getElementById('logbook-entries');
            if (listContainer) {
                listContainer.innerHTML = `<div class="result-error" style="color:#ff3860;">Błąd ładowania bazy danych logów. Upewnnij się, że przeglądarka wspiera IndexedDB.</div>`;
            }
        }
    },

    async handleFormSubmit() {
        const formData = {
            date: document.getElementById('logDate').value,
            location: document.getElementById('logLocation').value,
            site: document.getElementById('logSite').value,
            maxDepth: parseFloat(document.getElementById('logMaxDepth').value) || 0,
            avgDepth: parseFloat(document.getElementById('logAvgDepth').value) || 0,
            bottomTime: parseInt(document.getElementById('logTime').value) || 0,
            gasType: document.getElementById('logGas').value,
            startPressure: parseInt(document.getElementById('logStartPressure').value) || 0,
            endPressure: parseInt(document.getElementById('logEndPressure').value) || 0,
            rating: parseInt(document.getElementById('logRating').value) || 3,
            notes: document.getElementById('logNotes').value,
            synced: 0 // local only for now
        };

        try {
            await LogbookDB.addLog(formData);

            // Show toast/tooltip if needed 
            const gcResult = document.getElementById('gcResult');
            if (window.AppUI && window.AppUI.showTooltip) {
                // Future integration for notifications if AppUI has one
            }
        } catch (error) {
            console.error("Error saving log:", error);
            alert("Wystąpił błąd podczas zapisywania nurkowania.");
        }
    },

    async renderLogs() {
        const listContainer = document.getElementById('logbook-entries');
        if (!listContainer) return;

        try {
            const logs = await LogbookDB.getAllLogs();

            if (logs.length === 0) {
                listContainer.innerHTML = `
                    <div style="text-align: center; color: #888; padding: 40px;">
                        <h3>Brak wpisów</h3>
                        <p>Dodaj swoje pierwsze nurkowanie klikając "+ Nowy Wpis".</p>
                    </div>
                `;
                return;
            }

            let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;">';

            logs.forEach(log => {
                const gasColor = log.gasType === 'nitrox' ? '#42b883' : '#a0a0a0';
                const syncIcon = log.synced ? '<span style="color:#4ceb34;" title="Zsynchronizowano">☁️</span>' : '<span style="color:#ffb84d;" title="Tylko lokalnie">📱</span>';

                // Construct card using existing dashboard-card classes
                html += `
                    <div class="dashboard-card" style="text-align: left; position: relative;">
                        <div style="position: absolute; top: 10px; right: 10px; font-size: 1.2em;">
                            ${syncIcon}
                        </div>
                        <h4 style="margin-bottom: 5px; color: #fff;">${log.site || 'Nieznane miejsce'}</h4>
                        <p style="color: #00d1b2; font-size: 0.85em; margin-bottom: 10px;">${log.location || 'Nieznana lokalizacja'} &bull; ${log.date}</p>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.9em; color: #ccc;">
                            <div><strong>Max Głęb.:</strong> ${log.maxDepth}m</div>
                            <div><strong>Czas:</strong> ${log.bottomTime} min</div>
                            <div><strong>Gaz:</strong> <span style="color: ${gasColor}">${log.gasType === 'nitrox' ? 'Nitrox' : 'Powietrze'}</span></div>
                            <div><strong>Zużycie:</strong> ${log.startPressure - log.endPressure} bar</div>
                        </div>
                        <div style="margin-top: 10px; font-size: 0.8em; color: #888; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                            ${log.notes || 'Brak notatek'}
                        </div>
                    </div>
                `;
            });

            html += '</div>';
            listContainer.innerHTML = html;

        } catch (error) {
            console.error("Error fetching logs:", error);
            listContainer.innerHTML = `<div class="result-error" style="color:#ff3860;">Nie udało się wczytać wpisów.</div>`;
        }
    }
};
