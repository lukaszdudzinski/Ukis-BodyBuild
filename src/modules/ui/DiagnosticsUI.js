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
            <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,152,0,0.3); margin-bottom: 20px;">
                <h3 style="color: #FF9800; margin-top: 0;">📦 Pełne Archiwum Bazy Danych</h3>
                <p style="font-size: 0.9em; color: #ccc;">Utwórz kompletną kopię bezpieczeństwa (pomiary, treningi, szablony, dieta, raporty AI, awatar i ustawienia) lub przywróć całą aplikację z pliku archiwum JSON. <br><span id="db-size-display" style="color: #00BFFF; font-weight: bold;">Szacowanie rozmiaru bazy...</span></p>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button id="db-export-btn" style="flex: 1; padding: 13px 10px; background: #222; border: 1px solid #00BFFF; color: #00BFFF; border-radius: 5px; cursor: pointer; font-size: 1em; font-weight: bold; text-align: center;">📦 Utwórz Archiwum</button>
                    <button id="db-import-btn" style="flex: 1; padding: 13px 10px; background: #222; border: 1px solid #FF9800; color: #FF9800; border-radius: 5px; cursor: pointer; font-size: 1em; font-weight: bold; text-align: center;">📥 Przywróć z Pliku</button>
                    <input type="file" id="db-import-file" accept=".json" style="display: none;">
                </div>
                
                <div style="margin-top: 15px;">
                    <label style="display: block; color: #ccc; font-size: 0.9em; margin-bottom: 5px;">Częstotliwość propozycji archiwizacji:</label>
                    <select id="backup-frequency-select" style="width: 100%; padding: 10px; background: #222; border: 1px solid #444; border-radius: 5px; color: #fff; font-size: 1em; cursor: pointer;">
                        <option value="activity">Po aktywności (jeśli był wczoraj trening)</option>
                        <option value="daily">Codziennie</option>
                        <option value="weekly">Co tydzień</option>
                        <option value="monthly">Co miesiąc</option>
                        <option value="bimonthly">Co dwa miesiące</option>
                        <option value="never">Nigdy nie proponuj</option>
                    </select>
                </div>

                <details style="margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                    <summary style="color: #666; font-size: 0.8em; cursor: pointer; user-select: none;">Narzędzia eksperymentalne (Dla deweloperów)</summary>
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button id="db-export-raw-btn" style="flex: 1; padding: 13px 10px; background: #222; border: 1px dashed #E74C3C; color: #E74C3C; border-radius: 5px; cursor: pointer; font-size: 0.9em; font-weight: bold; text-align: center;">🆘 Pobierz fizyczny plik bazy (Tryb Awaryjny RAW)</button>
                        <button id="db-import-raw-btn" style="flex: 1; padding: 13px 10px; background: #222; border: 1px dashed #2ECC71; color: #2ECC71; border-radius: 5px; cursor: pointer; font-size: 0.9em; font-weight: bold; text-align: center;">📥 Przywróć plik RAW (.sqlite3)</button>
                        <input type="file" id="db-import-raw-file" accept=".sqlite3" style="display: none;">
                    </div>
                </details>
            </div>

            <div style="background: rgba(231,76,60,0.1); padding: 15px; border-radius: 8px; border: 1px solid #E74C3C; margin-bottom: 20px;">
                <h3 style="color: #E74C3C; margin-top: 0;">Przycisk Paniki (Twardy Reset PWA)</h3>
                <p style="font-size: 0.9em; color: #ccc;">Użyj tylko wtedy, gdy aplikacja przestała się aktualizować lub "utknęła" na starej wersji. <b>Konta i statystyki są bezpieczne</b> (baza SQLite nie jest usuwana).</p>
                <button id="pwa-hard-reset-btn" style="width: 100%; padding: 13px; font-weight: bold; font-size: 1em; background: #E74C3C; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 15px; text-align: center;">
                    ⚠️ WYKONAJ TWARDY RESET APLIKACJI
                </button>
            </div>

            
            <div style="background: rgba(33, 150, 243, 0.1); padding: 15px; border-radius: 8px; border: 1px solid #2196F3; margin-bottom: 20px;">
                <h3 style="color: #2196F3; margin-top: 0;">🗑 Wymuś Czyszczenie Zdjęć</h3>
                <p style="font-size: 0.9em; color: #ccc;">Zwalnia miejsce usuwając zdjęcia posiłków starsze niż 1 dzień. Same dane o makro i kaloriach zostają zachowane na wykresy.</p>
                <button id="db-clear-media-btn" style="width: 100%; padding: 13px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 15px; font-weight: bold; font-size: 1em; text-align: center;">
                    Wymuś Czyszczenie Miniatur
                </button>
            </div>

            <div style="background: rgba(155, 89, 182, 0.1); padding: 15px; border-radius: 8px; border: 1px solid #9B59B6; margin-bottom: 20px;">
                <h3 style="color: #9B59B6; margin-top: 0;">🔧 Naprawa i Mapowanie Danych</h3>
                <p style="font-size: 0.9em; color: #ccc;">Narzędzie do automatycznej naprawy starych nazw ćwiczeń na nowe, zunifikowane nazwy z Katalogu (np. zamienia "wyciskanie płaska" na "Klatka - Wyciskanie sztangi - Ławka płaska"). <b>WAŻNE: Przed użyciem utwórz Archiwum na samej górze!</b></p>
                <button id="db-migrate-names-btn" style="width: 100%; padding: 13px; font-weight: bold; font-size: 1em; background: #9B59B6; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 15px; text-align: center;">
                    🔄 Wykonaj Mapowanie Ćwiczeń
                </button>
            </div>
            
            
            <div style="background: rgba(255, 0, 0, 0.15); padding: 15px; border-radius: 8px; border: 1px solid #FF0000; margin-bottom: 20px;">
                <h3 style="color: #FF0000; margin-top: 0;">⚠️ Formatowanie Bazy (Usuwa Błędy I/O)</h3>
                <p style="font-size: 0.9em; color: #ccc;">Rozwiązuje ostatecznie problem "disk I/O error" w Safari. <br><b>KROK 1:</b> Utwórz Archiwum wyżej i pobierz plik JSON.<br><b>KROK 2:</b> Kliknij ten czerwony przycisk.<br><b>KROK 3:</b> Po restarcie zaimportuj pobrany plik JSON w panelu wyżej.</p>
                <button id="db-factory-reset-btn" style="width: 100%; padding: 13px; font-weight: bold; font-size: 1em; background: #FF0000; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 15px; text-align: center;">
                    🧨 FORMATUJ BAZĘ DANYCH
                </button>
            </div>


            <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); margin-bottom: 20px;">
                <h3 style="color: #eee; margin-top: 0;">Pamięć Podręczna</h3>
                <p style="font-size: 0.9em; color: #ccc;">Użyj tej opcji <b>tylko wtedy, gdy zaciął się interfejs</b> (np. nie ładuje się awatar, źle działa motyw lub zablokował się samouczek). Zresetuje ona wyłącznie podręczne ustawienia wyglądu. <b>Twoja historia treningów i atlas ćwiczeń są w pełni bezpieczne!</b></p>
                <button id="db-clear-local-btn" style="width: 100%; padding: 13px; background: #444; color: #eee; border: 1px solid #666; border-radius: 5px; cursor: pointer; margin-top: 10px; font-size: 1em; font-weight: bold; text-align: center;">
                    Wyczyść tylko LocalStorage
                </button>
            </div>
            
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; color: #fff;">Logi Błędów Aplikacji dla Pomocy Technicznej</h3>
                <div id="diagnostics-logs-container" style="background: #111; color: #00BFFF; font-family: monospace; font-size: 0.9em; padding: 12px; border-radius: 6px; min-height: 150px; max-height: 300px; overflow-y: auto; margin: 12px 0; word-break: break-all; white-space: pre-wrap; box-sizing: border-box; width: 100%;">
                    Ładowanie logów...
                </div>
                
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <button id="copy-errors-btn" style="flex: 1; padding: 13px 10px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 1em; text-align: center;">
                        Kopiuj Logi
                    </button>
                    <button id="share-errors-btn" style="flex: 1; padding: 13px 10px; background: #00BFFF; color: #000; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 1em; text-align: center;">
                        Udostępnij Logi
                    </button>
                </div>
                <button id="clear-errors-btn" style="width: 100%; padding: 13px; background: rgba(255,255,255,0.05); color: #aaa; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; cursor: pointer; font-size: 1em; font-weight: bold; text-align: center;">
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
                const confirmed = confirm("Czy na pewno chcesz usunąć miniatury posiłków starsze niż 1 dzień?");
                if (confirmed) {
                    try {
                        const cutoffDate = new Date();
                        cutoffDate.setDate(cutoffDate.getDate() - 1);
                        const cutoffStr = cutoffDate.toISOString().split('T')[0];
                        
                        const oldDietResp = await DatabaseManager.sendMessage('exec', { 
                            sql: "SELECT id, thumbnail FROM diet_logs WHERE date < ? AND thumbnail IS NOT NULL AND thumbnail != ''", 
                            bind: [cutoffStr], 
                            rowMode: 'object' 
                        });
                        
                        if (oldDietResp.result && oldDietResp.result.length > 0) {
                            const { MediaManager } = await import('../db/MediaManager.js');
                            for (let d of oldDietResp.result) {
                                if (d.thumbnail.startsWith('media://')) {
                                    MediaManager.deleteMedia(d.thumbnail);
                                }
                                await DatabaseManager.sendMessage('exec', { sql: "UPDATE diet_logs SET thumbnail = NULL WHERE id = ?", bind: [d.id] });
                            }
                            alert(`Usunięto pomyślnie ${oldDietResp.result.length} zdjęć posiłków. Zwalnianie miejsca powiodło się.`);
                        } else {
                            alert("Nie znaleziono żadnych starych miniatur do wyczyszczenia.");
                        }
                    } catch (e) {
                        alert("Błąd podczas czyszczenia miniatur: " + e.message);
                    }
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
