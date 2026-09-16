import { DatabaseManager } from '../db/DatabaseManager.js';
import { ExerciseCategories } from '../../data/ExerciseCatalog.js';

export const DiagnosticsUI = {
    init: () => {
        document.addEventListener('tabChanged', (e) => {
            if(e.detail && e.detail.tab === 'diagnostics-dashboard') {
                DiagnosticsUI.render();
            }
        });
    },
    render: () => {
        const wrapper = document.getElementById('diagnostics-content-wrapper');
        if (!wrapper) return;

        wrapper.innerHTML = `
            <div style="background: rgba(255, 152, 0, 0.05); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,152,0,0.3); margin-bottom: 25px; backdrop-filter: blur(10px);">
                <h3 style="color: #FF9800; margin-top: 0; display: flex; align-items: center; gap: 8px; font-weight: 600;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                    Pełne Archiwum Bazy Danych
                </h3>
                <p style="font-size: 0.9em; color: #8E8E93; line-height: 1.5;">Utwórz kompletną kopię bezpieczeństwa (pomiary, treningi, szablony, dieta, raporty AI, awatar i ustawienia) lub przywróć całą aplikację z pliku archiwum JSON. <br><span id="db-size-display" style="color: #00BFFF; font-weight: 600;">Szacowanie rozmiaru bazy...</span></p>
                <div style="display: flex; gap: 12px; margin-top: 20px;">
                    <button id="db-export-btn" style="flex: 1; padding: 14px 10px; background: rgba(0, 191, 255, 0.15); border: 1px solid rgba(0, 191, 255, 0.3); color: #00BFFF; border-radius: 12px; cursor: pointer; font-size: 0.95em; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Utwórz Archiwum
                    </button>
                    <button id="db-import-btn" style="flex: 1; padding: 14px 10px; background: rgba(255, 152, 0, 0.15); border: 1px solid rgba(255, 152, 0, 0.3); color: #FF9800; border-radius: 12px; cursor: pointer; font-size: 0.95em; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Przywróć z Pliku
                    </button>
                    <input type="file" id="db-import-file" accept=".json" style="display: none;">
                </div>
                
                <div style="margin-top: 20px;">
                    <label style="display: block; color: #8E8E93; font-size: 0.9em; margin-bottom: 8px;">Częstotliwość propozycji archiwizacji:</label>
                    <select id="backup-frequency-select" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; font-size: 0.95em; cursor: pointer; outline: none;">
                        <option value="activity">Po aktywności (jeśli był wczoraj trening)</option>
                        <option value="daily">Codziennie</option>
                        <option value="weekly">Co tydzień</option>
                        <option value="monthly">Co miesiąc</option>
                        <option value="bimonthly">Co dwa miesiące</option>
                        <option value="never">Nigdy nie proponuj</option>
                    </select>
                </div>

                <details style="margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;">
                    <summary style="color: #8E8E93; font-size: 0.85em; cursor: pointer; user-select: none;">Narzędzia eksperymentalne (Dla deweloperów)</summary>
                    <div style="display: flex; gap: 12px; margin-top: 15px;">
                        <button id="db-export-raw-btn" style="flex: 1; padding: 12px 10px; background: rgba(231, 76, 60, 0.1); border: 1px solid rgba(231, 76, 60, 0.3); color: #E74C3C; border-radius: 12px; cursor: pointer; font-size: 0.85em; font-weight: 600; text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            Pobierz RAW
                        </button>
                        <button id="db-import-raw-btn" style="flex: 1; padding: 12px 10px; background: rgba(46, 204, 113, 0.1); border: 1px solid rgba(46, 204, 113, 0.3); color: #2ECC71; border-radius: 12px; cursor: pointer; font-size: 0.85em; font-weight: 600; text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Przywróć RAW
                        </button>
                        <input type="file" id="db-import-raw-file" accept=".sqlite3" style="display: none;">
                    </div>
                </details>
            </div>

            <div style="background: rgba(231, 76, 60, 0.05); padding: 20px; border-radius: 16px; border: 1px solid rgba(231, 76, 60, 0.3); margin-bottom: 25px; backdrop-filter: blur(10px);">
                <h3 style="color: #E74C3C; margin-top: 0; font-weight: 600;">Przycisk Paniki (Twardy Reset)</h3>
                <p style="font-size: 0.9em; color: #8E8E93; line-height: 1.5;">Użyj tylko wtedy, gdy aplikacja przestała się aktualizować lub "utknęła" na starej wersji. <b style="color: #fff;">Konta i statystyki są bezpieczne</b> (baza SQLite nie jest usuwana).</p>
                <button id="pwa-hard-reset-btn" style="width: 100%; padding: 14px; font-weight: 600; font-size: 1em; background: rgba(231, 76, 60, 0.15); color: #E74C3C; border: 1px solid rgba(231, 76, 60, 0.4); border-radius: 12px; cursor: pointer; margin-top: 15px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    Wykonaj Twardy Reset Aplikacji
                </button>
            </div>

            
            <div style="background: rgba(33, 150, 243, 0.05); padding: 20px; border-radius: 16px; border: 1px solid rgba(33, 150, 243, 0.3); margin-bottom: 25px; backdrop-filter: blur(10px);">
                <h3 style="color: #2196F3; margin-top: 0; display: flex; align-items: center; gap: 8px; font-weight: 600;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    Zarządzanie Pamięcią (Storage)
                </h3>
                <p style="font-size: 0.9em; color: #8E8E93; line-height: 1.5;">Wybierz, z jakich modułów chcesz usunąć stare zdjęcia, aby zwolnić miejsce. Usunięte zostaną <b style="color: #fff;">tylko pliki graficzne</b>, Twoje dane pozostaną nienaruszone!</p>
                <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 12px; color: #fff;">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" id="sm-diet" checked style="width: 20px; height: 20px; accent-color: #2196F3;">
                        <span>Dieta (Zdjęcia posiłków)</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" id="sm-training" checked style="width: 20px; height: 20px; accent-color: #2196F3;">
                        <span>Treningi (Zdjęcia z siłowni)</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" id="sm-measurements" checked style="width: 20px; height: 20px; accent-color: #2196F3;">
                        <span>Pomiary (Zdjęcia sylwetki)</span>
                    </label>
                </div>
                <div style="margin-top: 20px;">
                    <label style="font-size: 0.9em; color: #8E8E93; margin-bottom: 8px; display: block;">Okres do wyczyszczenia (starsze niż):</label>
                    <select id="sm-time-select" style="width: 100%; padding: 12px; border-radius: 12px; background: rgba(0,0,0,0.3); color: #fff; border: 1px solid rgba(255,255,255,0.1); outline: none;">
                        <option value="1">1 dzień</option>
                        <option value="7">1 tydzień</option>
                        <option value="30">1 miesiąc</option>
                        <option value="90">3 miesiące</option>
                        <option value="180">6 miesięcy</option>
                        <option value="9999">Wszystkie</option>
                    </select>
                </div>
                <button id="db-clear-media-btn" style="width: 100%; padding: 14px; background: rgba(33, 150, 243, 0.15); color: #2196F3; border: 1px solid rgba(33, 150, 243, 0.3); border-radius: 12px; cursor: pointer; margin-top: 20px; font-weight: 600; font-size: 0.95em; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Rozpocznij zwalnianie miejsca
                </button>
            </div>

            <div style="background: rgba(155, 89, 182, 0.05); padding: 20px; border-radius: 16px; border: 1px solid rgba(155, 89, 182, 0.3); margin-bottom: 25px; backdrop-filter: blur(10px);">
                <h3 style="color: #9B59B6; margin-top: 0; display: flex; align-items: center; gap: 8px; font-weight: 600;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    Naprawa i Mapowanie Danych
                </h3>
                <p style="font-size: 0.9em; color: #8E8E93; line-height: 1.5;">Narzędzie do automatycznej naprawy starych nazw ćwiczeń na nowe, zunifikowane nazwy z Katalogu. <b style="color: #fff;">WAŻNE: Przed użyciem utwórz Archiwum na samej górze!</b></p>
                <button id="db-migrate-names-btn" style="width: 100%; padding: 14px; font-weight: 600; font-size: 0.95em; background: rgba(155, 89, 182, 0.15); color: #9B59B6; border: 1px solid rgba(155, 89, 182, 0.3); border-radius: 12px; cursor: pointer; margin-top: 20px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.13 15.57a9 9 0 1 0 3.84-10.58l-5.49 5.49"/></svg>
                    Wykonaj Mapowanie Ćwiczeń
                </button>
            </div>
            
            <div style="background: rgba(255, 69, 58, 0.05); padding: 20px; border-radius: 16px; border: 1px solid rgba(255, 69, 58, 0.3); margin-bottom: 25px; backdrop-filter: blur(10px);">
                <h3 style="color: #FF453A; margin-top: 0; display: flex; align-items: center; gap: 8px; font-weight: 600;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Formatowanie Bazy (Usuwa Błędy I/O)
                </h3>
                <p style="font-size: 0.9em; color: #8E8E93; line-height: 1.5;">Rozwiązuje ostatecznie problem "disk I/O error" w Safari. <br><b style="color: #fff;">KROK 1:</b> Utwórz Archiwum wyżej i pobierz plik JSON.<br><b style="color: #fff;">KROK 2:</b> Kliknij ten przycisk.<br><b style="color: #fff;">KROK 3:</b> Po restarcie zaimportuj pobrany plik JSON.</p>
                <button id="db-factory-reset-btn" style="width: 100%; padding: 14px; font-weight: 600; font-size: 0.95em; background: rgba(255, 69, 58, 0.15); color: #FF453A; border: 1px solid rgba(255, 69, 58, 0.3); border-radius: 12px; cursor: pointer; margin-top: 20px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M13 2v7h7"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg>
                    FORMATUJ BAZĘ DANYCH
                </button>
            </div>

            <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 25px; backdrop-filter: blur(10px);">
                <h3 style="color: #fff; margin-top: 0; font-weight: 600;">Pamięć Podręczna</h3>
                <p style="font-size: 0.9em; color: #8E8E93; line-height: 1.5;">Użyj tej opcji <b style="color: #fff;">tylko wtedy, gdy zaciął się interfejs</b> (np. nie ładuje się awatar, źle działa motyw lub zablokował się samouczek). Zresetuje ona wyłącznie podręczne ustawienia wyglądu. <b style="color: #00BFFF;">Twoja historia treningów i atlas ćwiczeń są w pełni bezpieczne!</b></p>
                <button id="db-clear-local-btn" style="width: 100%; padding: 14px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; cursor: pointer; margin-top: 15px; font-size: 0.95em; font-weight: 600;">
                    Wyczyść tylko LocalStorage
                </button>
            </div>
            
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 16px; margin-bottom: 25px;">
                <h3 style="margin-top: 0; color: #fff; font-weight: 600;">Logi Błędów Aplikacji</h3>
                <div id="diagnostics-logs-container" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.05); color: #00BFFF; font-family: monospace; font-size: 0.85em; padding: 15px; border-radius: 12px; min-height: 150px; max-height: 300px; overflow-y: auto; margin: 15px 0; word-break: break-all; white-space: pre-wrap; box-sizing: border-box; width: 100%;">
                    Ładowanie logów...
                </div>
                
                <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                    <button id="copy-errors-btn" style="flex: 1; padding: 12px 10px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 0.9em;">
                        Kopiuj Logi
                    </button>
                    <button id="share-errors-btn" style="flex: 1; padding: 12px 10px; background: rgba(0, 191, 255, 0.15); color: #00BFFF; border: 1px solid rgba(0,191,255,0.3); border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 0.9em;">
                        Udostępnij Logi
                    </button>
                </div>
                <button id="clear-errors-btn" style="width: 100%; padding: 12px; background: transparent; color: #8E8E93; border: 1px dashed rgba(255,255,255,0.2); border-radius: 10px; cursor: pointer; font-size: 0.9em; font-weight: 600;">
                    Wyczyść Logi
                </button>
            </div>
        `;

        const logsContainer = document.getElementById('diagnostics-logs-container');
        if (logsContainer) {
            try {
                const logsStr = localStorage.getItem('uki_error_logs');
                if (!logsStr) {
                    logsContainer.innerText = 'Brak zarejestrowanych błędów :)';
                } else {
                    const logsArray = JSON.parse(logsStr);
                    if (Array.isArray(logsArray) && logsArray.length > 0) {
                    const grouped = {};
                    logsArray.forEach(log => {
                        const v = log.version || 'Starsze wersje';
                        if (!grouped[v]) grouped[v] = [];
                        grouped[v].push(log);
                    });
                    
                    let html = '';
                    for (const v in grouped) {
                        html += `<div style="color: #FF9800; font-weight: bold; font-size: 1.1em; border-bottom: 1px solid #333; margin-top: 10px; padding-bottom: 4px;">Wersja: ${v}</div>`;
                        grouped[v].forEach(l => {
                            html += `<div style="margin: 8px 0; border-left: 2px solid #E74C3C; padding-left: 8px;">`;
                            html += `<span style="color: #888; font-size: 0.85em;">${l.time}</span><br>`;
                            html += `<span style="color: #E74C3C; font-weight: bold;">${l.msg}</span>`;
                            if (l.stack) html += `<br><span style="color: #aaa; font-size: 0.8em;">${l.stack.substring(0, 200)}...</span>`;
                            html += `</div>`;
                        });
                    }
                    logsContainer.innerHTML = html;
                    } else {
                        logsContainer.innerText = logsStr;
                    }
                }
            } catch(e) {
                logsContainer.innerText = localStorage.getItem('uki_error_logs') || 'Brak zarejestrowanych błędów :)';
            }
        }

        DiagnosticsUI.bindEvents();
        DiagnosticsUI.loadDbSize();
    },

    loadDbSize: async () => {
        const sizeDisplay = document.getElementById('db-size-display');
        if (!sizeDisplay) return;
        try {
            const root = await navigator.storage.getDirectory();
            const handle = await root.getFileHandle('ukis_bodybuild.sqlite3', { create: false });
            const file = await handle.getFile();
            const sizeKB = (file.size / 1024).toFixed(2);
            sizeDisplay.innerText = `Rozmiar bazy fizycznej: ${sizeKB} KB`;
        } catch(e) {
            sizeDisplay.innerText = `Rozmiar bazy fizycznej: Brak pliku OPFS (Fallback)`;
        }
    },

    bindEvents: () => {
        const freqSelect = document.getElementById('backup-frequency-select');
        if (freqSelect) {
            const currentFreq = localStorage.getItem('uki_backup_frequency') || 'activity';
            freqSelect.value = currentFreq;
            freqSelect.addEventListener('change', (e) => {
                localStorage.setItem('uki_backup_frequency', e.target.value);
            });
        }

        const factoryBtn = document.getElementById('db-factory-reset-btn');
        if (factoryBtn) {
            factoryBtn.addEventListener('click', async () => {
                const confirmed = confirm("UWAGA! Stracisz wszystkie dane jeśli nie utworzyłeś Archiwum JSON!\n\nCzy pobrałeś Archiwum i chcesz sformatować bazę zwalniając 100% miejsca?");
                if (confirmed) {
                    try {
                        const root = await navigator.storage.getDirectory();
                        // Usuń wszystkie pliki SQLite (z journalem i wal)
                        const files = ['ukis_bodybuild.sqlite3', 'ukis_bodybuild.sqlite3-journal', 'ukis_bodybuild.sqlite3-wal', 'ukis_bodybuild.sqlite3-shm'];
                        for (const f of files) {
                            try { await root.removeEntry(f, { recursive: true }); } catch(e) {}
                        }
                        alert("Baza została pomyślnie sformatowana. Aplikacja zostanie zrestartowana.");
                        window.location.reload(true);
                    } catch(e) {
                        alert("Błąd podczas usuwania pliku: " + e.message);
                    }
                }
            });
        }

        const clearMediaBtn = document.getElementById('db-clear-media-btn');
        if (clearMediaBtn) {
            clearMediaBtn.addEventListener('click', async () => {
                const doDiet = document.getElementById('sm-diet').checked;
                const doTraining = document.getElementById('sm-training').checked;
                const doMeasurements = document.getElementById('sm-measurements').checked;
                const days = parseInt(document.getElementById('sm-time-select').value);

                if (!doDiet && !doTraining && !doMeasurements) {
                    alert('Wybierz przynajmniej jeden moduł do oczyszczenia.');
                    return;
                }

                const confirmed = confirm("Czy na pewno chcesz bezpowrotnie usunąć wybrane zdjęcia dla zaznaczonych modułów w zadanym okresie?");
                if (!confirmed) return;

                try {
                    const cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - days);
                    const cutoffStr = cutoffDate.toISOString().split('T')[0];
                    const { MediaManager } = await import('../db/MediaManager.js');

                    let deletedDiet = 0;
                    let deletedTrainings = 0;
                    let deletedMeasurements = 0;

                    if (doDiet) {
                        const dietResp = await DatabaseManager.sendMessage('exec', { 
                            sql: "SELECT id, thumbnail FROM diet_logs WHERE date < ? AND thumbnail IS NOT NULL AND thumbnail != ''", 
                            bind: [cutoffStr], 
                            rowMode: 'object' 
                        });
                        if (dietResp.result) {
                            for (let d of dietResp.result) {
                                if (d.thumbnail.startsWith('media://')) {
                                    MediaManager.deleteMedia(d.thumbnail);
                                }
                                await DatabaseManager.sendMessage('exec', { sql: "UPDATE diet_logs SET thumbnail = NULL WHERE id = ?", bind: [d.id] });
                                deletedDiet++;
                            }
                        }
                    }

                    if (doTraining) {
                        const trainResp = await DatabaseManager.sendMessage('exec', { 
                            sql: "SELECT id, social_photos_json FROM trainings WHERE date < ? AND social_photos_json IS NOT NULL AND social_photos_json != '[]'", 
                            bind: [cutoffStr], 
                            rowMode: 'object' 
                        });
                        if (trainResp.result) {
                            for (let t of trainResp.result) {
                                try {
                                    const photos = JSON.parse(t.social_photos_json);
                                    if (Array.isArray(photos)) {
                                        for (const p of photos) {
                                            if (p.startsWith('media://')) MediaManager.deleteMedia(p);
                                        }
                                        await DatabaseManager.sendMessage('exec', { sql: "UPDATE trainings SET social_photos_json = '[]' WHERE id = ?", bind: [t.id] });
                                        deletedTrainings += photos.length;
                                    }
                                } catch(e) {}
                            }
                        }
                    }

                    if (doMeasurements) {
                        const measResp = await DatabaseManager.sendMessage('exec', { 
                            sql: "SELECT id, photo FROM measurements WHERE date < ? AND photo IS NOT NULL AND photo != ''", 
                            bind: [cutoffStr], 
                            rowMode: 'object' 
                        });
                        if (measResp.result) {
                            for (let m of measResp.result) {
                                if (m.photo.startsWith('media://')) {
                                    MediaManager.deleteMedia(m.photo);
                                }
                                await DatabaseManager.sendMessage('exec', { sql: "UPDATE measurements SET photo = NULL WHERE id = ?", bind: [m.id] });
                                deletedMeasurements++;
                            }
                        }
                    }

                    alert(`Zakończono proces zwalniania pamięci:\n- Usunięto ${deletedDiet} zdjęć z Diety\n- Usunięto ${deletedTrainings} zdjęć z Treningów\n- Usunięto ${deletedMeasurements} zdjęć z Pomiarów\nOdśwież zakładkę, aby zaktualizować rozmiar fizyczny bazy.`);
                    DiagnosticsUI.loadDbSize();
                } catch (e) {
                    alert("Błąd podczas zwalniania pamięci: " + e.message);
                }
            });
        }
        // Twardy Reset PWA
        const hardResetBtn = document.getElementById('pwa-hard-reset-btn');
        if (hardResetBtn) {
            hardResetBtn.addEventListener('click', async () => {
                const confirmed = confirm("Czy na pewno chcesz wykonać Twardy Reset?\n\nWyczyści to ukryty Cache aplikacji i zmusi ją do pobrania czystej wersji. Twoje treningi są bezpieczne.");
                if (confirmed) {
                    try {
                        if ('serviceWorker' in navigator) {
                            const regs = await navigator.serviceWorker.getRegistrations();
                            for (let r of regs) {
                                await r.unregister();
                            }
                        }
                        const keys = await caches.keys();
                        await Promise.all(keys.map(k => caches.delete(k)));
                        
                        alert("Cache wyczyszczony! Aplikacja zrestartuje się za chwilę...");
                        setTimeout(() => window.location.reload(true), 1000);
                    } catch(e) {
                        alert("Błąd podczas czyszczenia cache: " + e.message);
                    }
                }
            });
        }

        const exportBtn = document.getElementById('db-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', async () => {
                try {
                    const dataStr = await DatabaseManager.exportDatabase();
                    const blob = new Blob([dataStr], {type: "application/json"});
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    const now = new Date();
                    const dateStr = now.toISOString().split('T')[0];
                    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-mm-ss
                    a.download = `bodybuild_backup_${dateStr}_${timeStr}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } catch (err) {
                    alert("KRYTYCZNY BŁĄD: Nie udało się wyeksportować danych! Twoja baza prawdopodobnie jest uszkodzona (Disk I/O). Nie wykonuj formatowania, dopóki nie skonsultujesz się z pomocą techniczną, w przeciwnym razie stracisz dane.");
                    console.error("Export Error: ", err);
                }
            });
        }

        const rawExportBtn = document.getElementById('db-export-raw-btn');
        if (rawExportBtn) {
            rawExportBtn.addEventListener('click', async () => {
                try {
                    const root = await navigator.storage.getDirectory();
                    const handle = await root.getFileHandle('ukis_bodybuild.sqlite3', { create: false });
                    const file = await handle.getFile();
                    const url = URL.createObjectURL(file);
                    const a = document.createElement('a');
                    a.href = url;
                    const now = new Date();
                    const dateStr = now.toISOString().split('T')[0];
                    a.download = `ukis_bodybuild_raw_backup_${dateStr}.sqlite3`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    alert("Pobrano fizyczny plik bazy! Prześlij go do wsparcia technicznego, spróbujemy go naprawić.");
                } catch (err) {
                    alert("Nie udało się odczytać fizycznego pliku! Twój system operacyjny wyczyścił pamięć przeglądarki (OPFS) albo plik nigdy nie istniał. Kod błędu: " + err.message);
                }
            });
        }

        const rawImportBtn = document.getElementById('db-import-raw-btn');
        const rawImportFile = document.getElementById('db-import-raw-file');
        if (rawImportBtn && rawImportFile) {
            rawImportBtn.addEventListener('click', () => {
                if (confirm("UWAGA! Ta opcja nadpisze CAŁĄ Twoją obecną bazę danych plikiem z kopii RAW. Upewnij się, że plik jest poprawny.\n\nCzy chcesz kontynuować?")) {
                    rawImportFile.click();
                }
            });
            rawImportFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = async (ev) => {
                    try {
                        const buffer = ev.target.result;
                        await DatabaseManager.importRawDatabase(buffer);
                        alert("Baza RAW przywrócona pomyślnie! Aplikacja zostanie zrestartowana.");
                        window.location.reload();
                    } catch (err) {
                        alert("Błąd przywracania bazy RAW: " + err.message);
                    }
                };
                reader.readAsArrayBuffer(file);
            });
        }

        const importBtn = document.getElementById('db-import-btn');
        const importFile = document.getElementById('db-import-file');
        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => importFile.click());
            importFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const jsonStr = e.target.result;
                        await DatabaseManager.importDatabase(jsonStr);
                        alert("Dane przywrócone pomyślnie! Aplikacja zostanie zrestartowana.");
                        window.location.reload();
                    } catch (err) {
                        if (window.ukiLogError) window.ukiLogError("Import Error: " + err.message, err.stack);
                        alert("Błąd przywracania danych. Upewnij się, że to poprawny plik kopii zapasowej. Sprawdź logi w Diagnostyce.");
                    }
                };
                reader.readAsText(file);
            });
        }

        // Wyczyść LocalStorage
        const clearLocalBtn = document.getElementById('db-clear-local-btn');
        if (clearLocalBtn) {
            clearLocalBtn.addEventListener('click', () => {
                if (confirm("Usunąć dane konfiguracyjne z LocalStorage? Twoje treningi w bazie nie zostaną ruszone, ale będziesz musiał podać Nick od nowa.")) {
                    localStorage.clear();
                    alert("Zrobione. Aplikacja się odświeży.");
                    window.location.reload();
                }
            });
        }

        // Mapowanie Ćwiczeń (Interaktywne)
        const migrateNamesBtn = document.getElementById('db-migrate-names-btn');
        if (migrateNamesBtn) {
            migrateNamesBtn.addEventListener('click', async () => {
                if (!confirm("WAŻNE: Czy utworzyłeś już Archiwum? Ta akcja zmodyfikuje Twoją bazę.\n\nKliknij OK, aby otworzyć asystenta mapowania.")) return;
                
                try {
                    const trainings = await DatabaseManager.getTrainings();
                    if (!trainings || trainings.length === 0) {
                        alert("Brak treningów."); return;
                    }

                    // 1. Zbuduj płaską listę wszystkich poprawnych ćwiczeń z Katalogu
                    const validExercises = [];
                    for (const cat in ExerciseCategories) {
                        ExerciseCategories[cat].forEach(ex => validExercises.push(ex));
                    }

                    // 2. Znajdź wszystkie unikalne nazwy z historii, których NIE MA w katalogu
                    const unknownNames = new Set();
                    trainings.forEach(t => {
                        if (t.exercises) {
                            t.exercises.forEach(ex => {
                                if (ex.name && !validExercises.includes(ex.name)) unknownNames.add(ex.name);
                                if (ex.type === 'superset' && ex.exercises) {
                                    ex.exercises.forEach(nx => {
                                        if (nx.name && !validExercises.includes(nx.name)) unknownNames.add(nx.name);
                                    });
                                }
                            });
                        }
                    });

                    if (unknownNames.size === 0) {
                        alert("Wszystkie Twoje ćwiczenia w historii już pasują do oficjalnego katalogu! Brak pracy.");
                        return;
                    }

                    // 3. Pokaż modal do ręcznego parowania
                    const modalId = 'mapping-modal';
                    const existing = document.getElementById(modalId);
                    if (existing) existing.remove();

                    let rowsHtml = '';
                    Array.from(unknownNames).forEach((unknown, i) => {
                        // Spróbujmy podpowiedzieć z kontekstu (np. po 4 znakach lub całych słowach)
                        let bestMatch = '';
                        const lw = unknown.toLowerCase();
                        if (lw.includes('płaska') && lw.includes('wycisk')) bestMatch = 'Klatka - Wyciskanie sztangi - Ławka płaska';
                        else if (lw.includes('rozpi') && lw.includes('płas')) bestMatch = 'Klatka - Rozpiętki - Hantle (ławka płaska)';
                        else if (lw.includes('przysiad')) bestMatch = 'Nogi - Przysiady ze sztangą na karku';
                        else if (lw.includes('martw') || lw.includes(' mc')) bestMatch = 'Plecy - Martwy ciąg (Klasyczny)';
                        else if (lw.includes('wiosł') || lw.includes('wioslo')) bestMatch = 'Plecy - Wiosłowanie sztangą w opadzie';
                        else if (lw.includes('brzuch') || lw.includes('brzus') || lw.includes('spi')) bestMatch = 'Brzuch - Skłony tułowia na ławce rzymskiej'; // Podpowiedź dla brzucha

                        rowsHtml += `
                            <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #444;">
                                <div style="color: #ff9800; font-weight: bold; margin-bottom: 5px;">Nieznane: "${unknown}"</div>
                                <select id="map-select-${i}" data-original="${unknown}" style="width: 100%; padding: 8px; border-radius: 4px; background: #222; color: #fff; border: 1px solid #00BFFF;">
                                    <option value="">-- Pomiń (Zostaw bez zmian) --</option>
                                    ${validExercises.map(ex => `<option value="${ex}" ${ex === bestMatch ? 'selected' : ''}>Zmień na: ${ex}</option>`).join('')}
                                </select>
                            </div>
                        `;
                    });

                    const modalHtml = `
                        <div id="${modalId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 100000; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box;">
                            <div style="background: #1e1e1e; border: 1px solid #9B59B6; border-radius: 12px; width: 100%; max-width: 500px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 10px 40px rgba(155,89,182,0.3);">
                                <div style="padding: 15px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
                                    <h3 style="color: #9B59B6; margin: 0;">Asystent Mapowania</h3>
                                    <button onclick="document.getElementById('${modalId}').remove()" style="background: none; border: none; color: #aaa; font-size: 1.5em; cursor: pointer;">&times;</button>
                                </div>
                                <div style="padding: 15px; overflow-y: auto; flex: 1;">
                                    <p style="font-size: 0.9em; color: #ccc;">Poniżej znajdują się nazwy, które nie występują w nowym katalogu. Wybierz z listy docelowe odpowiedniki. Jeśli zostawisz "-- Pomiń --", nazwa nie zostanie zmieniona.</p>
                                    ${rowsHtml}
                                </div>
                                <div style="padding: 15px; border-top: 1px solid #333; text-align: center;">
                                    <button id="map-save-btn" style="background: #2ECC71; color: white; border: none; padding: 12px 20px; font-weight: bold; font-size: 1.1em; border-radius: 6px; cursor: pointer; width: 100%;">💾 Zapisz Zmiany do Bazy</button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    document.body.insertAdjacentHTML('beforeend', modalHtml);

                    document.getElementById('map-save-btn').addEventListener('click', async () => {
                        const mapDict = {};
                        Array.from(unknownNames).forEach((unknown, i) => {
                            const sel = document.getElementById(`map-select-${i}`);
                            if (sel && sel.value) {
                                mapDict[unknown] = sel.value;
                            }
                        });

                        if (Object.keys(mapDict).length === 0) {
                            alert("Nie wybrano żadnych zmian.");
                            document.getElementById(modalId).remove();
                            return;
                        }

                        let updatedCount = 0;
                        for (let t of trainings) {
                            let changed = false;
                            if (t.exercises && t.exercises.length > 0) {
                                t.exercises.forEach(ex => {
                                    if (ex.name && mapDict[ex.name]) {
                                        ex.name = mapDict[ex.name];
                                        changed = true;
                                    }
                                    if (ex.type === 'superset' && ex.exercises) {
                                        ex.exercises.forEach(nx => {
                                            if (nx.name && mapDict[nx.name]) {
                                                nx.name = mapDict[nx.name];
                                                changed = true;
                                            }
                                        });
                                    }
                                });
                            }
                            if (changed) {
                                await DatabaseManager.updateTraining(t);
                                updatedCount++;
                            }
                        }

                        alert(`Zakończono! Zaktualizowano ${updatedCount} treningów w Twojej historii.`);
                        document.getElementById(modalId).remove();
                    });

                } catch (err) {
                    alert("Błąd podczas odczytu bazy: " + err.message);
                }
            });
        }

        // Błędy
        const copyErrs = document.getElementById('copy-errors-btn');
        if (copyErrs) {
            copyErrs.addEventListener('click', () => {
                const logs = localStorage.getItem('uki_error_logs');
                if (logs) {
                    navigator.clipboard.writeText(logs).then(() => {
                        alert("Logi skopiowane do schowka.");
                    }).catch(() => {
                        alert("Brak dostępu do schowka. Skopiuj tekst ręcznie.");
                    });
                }
            });
        }

        const shareErrs = document.getElementById('share-errors-btn');
        if (shareErrs) {
            shareErrs.addEventListener('click', () => {
                const logsStr = localStorage.getItem('uki_error_logs');
                if (!logsStr) {
                    alert("Brak błędów do udostępnienia.");
                    return;
                }
                let text = "Logi błędów Uki's BodyBuild:\\n\\n";
                try {
                    const logsArray = JSON.parse(logsStr);
                    const grouped = {};
                    logsArray.forEach(log => {
                        const v = log.version || 'Starsze wersje';
                        if (!grouped[v]) grouped[v] = [];
                        grouped[v].push(log);
                    });
                    for (const v in grouped) {
                        text += `--- Wersja: ${v} ---\\n`;
                        grouped[v].forEach(l => {
                            text += `[${l.time}] ${l.msg}\\n${l.stack}\\n\\n`;
                        });
                    }
                } catch (e) {
                    text += logsStr;
                }
                
                if (navigator.share) {
                    navigator.share({
                        title: 'Logi błędów aplikacji',
                        text: text
                    }).catch(err => {
                        console.log("Share failed:", err);
                    });
                } else {
                    window.location.href = `mailto:?subject=Uki%20BodyBuild%20Logi&body=${encodeURIComponent(text)}`;
                }
            });
        }

        const clearErrs = document.getElementById('clear-errors-btn');
        const logsContainer = document.getElementById('diagnostics-logs-container');
        if (clearErrs) {
            clearErrs.addEventListener('click', () => {
                localStorage.removeItem('uki_error_logs');
                if (logsContainer) logsContainer.innerText = 'Brak zarejestrowanych błędów :)';
            });
        }
    }
};
