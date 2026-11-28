// wyglad: zar
import { DatabaseManager } from '../db/DatabaseManager.js';
import { ExerciseCategories, isCatalogExercise } from '../../data/ExerciseCatalog.js';
import { suggestCatalogName } from '../../data/exerciseTraits.js';
import { naglowek } from '../wyglad/naglowek.js';
import { ikona } from '../wyglad/ikony.js';

const esc = (s) => String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

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
            ${naglowek({ wariant: 'main', tytul: 'Serwis', podtytul: 'Kopia, naprawa i porządki' })}
            <div class="z-serwis">
            <section class="z-card z-serwis-karta" aria-labelledby="serwis-t-kopia">
                <div class="z-serwis-tyt" id="serwis-t-kopia" role="heading" aria-level="3">${ikona('database')}Kopia zapasowa</div>
                <p class="z-sub z-serwis-opis">Utwórz kompletną kopię bezpieczeństwa (pomiary, treningi, szablony, dieta, raporty AI, awatar i ustawienia) lub przywróć całą aplikację z pliku archiwum JSON. <span id="db-size-display" class="z-serwis-rozmiar">Szacowanie rozmiaru bazy...</span></p>
                <div class="z-serwis-rzad">
                    <button type="button" id="db-export-btn" class="z-btn">
                        ${ikona('download', 18)}
                        Utwórz kopię
                    </button>
                    <button type="button" id="db-import-btn" class="z-ghost">
                        ${ikona('upload', 18)}
                        Przywróć z pliku
                    </button>
                    <input type="file" id="db-import-file" accept=".json" hidden>
                </div>

                <label class="z-lab z-serwis-etykieta" for="backup-frequency-select">Przypominaj o kopii</label>
                <select id="backup-frequency-select" class="z-in">
                    <option value="activity">Po aktywności (jeśli był wczoraj trening)</option>
                    <option value="daily">Codziennie</option>
                    <option value="weekly">Co tydzień</option>
                    <option value="monthly">Co miesiąc</option>
                    <option value="bimonthly">Co dwa miesiące</option>
                    <option value="never">Nigdy nie proponuj</option>
                </select>

                <details class="z-serwis-narz">
                    <summary>Narzędzia eksperymentalne (dla deweloperów)</summary>
                    <div class="z-serwis-rzad">
                        <button type="button" id="db-export-raw-btn" class="z-ghost">
                            ${ikona('download', 18)}
                            Pobierz RAW
                        </button>
                        <button type="button" id="db-import-raw-btn" class="z-ghost z-danger">
                            ${ikona('upload', 18)}
                            Przywróć RAW
                        </button>
                        <input type="file" id="db-import-raw-file" accept=".sqlite3" hidden>
                    </div>
                </details>
            </section>

            <section class="z-card z-serwis-karta" aria-labelledby="serwis-t-miejsce">
                <div class="z-serwis-tyt" id="serwis-t-miejsce" role="heading" aria-level="3">${ikona('trash')}Zwalnianie miejsca</div>
                <p class="z-sub z-serwis-opis">Wybierz, z jakich modułów chcesz usunąć stare zdjęcia, aby zwolnić miejsce. Usunięte zostaną <strong class="z-serwis-mocny">tylko pliki graficzne</strong>, Twoje dane pozostaną nienaruszone.</p>
                <div class="z-serwis-pola">
                    <label class="z-check">
                        <input type="checkbox" id="sm-diet" checked>
                        <span>Dieta (zdjęcia posiłków)</span>
                    </label>
                    <label class="z-check">
                        <input type="checkbox" id="sm-training" checked>
                        <span>Treningi (zdjęcia z siłowni)</span>
                    </label>
                    <label class="z-check">
                        <input type="checkbox" id="sm-measurements" checked>
                        <span>Pomiary (zdjęcia sylwetki)</span>
                    </label>
                </div>
                <label class="z-lab z-serwis-etykieta" for="sm-time-select">Okres do wyczyszczenia (starsze niż)</label>
                <select id="sm-time-select" class="z-in">
                    <option value="1">1 dzień</option>
                    <option value="7">1 tydzień</option>
                    <option value="30">1 miesiąc</option>
                    <option value="90">3 miesiące</option>
                    <option value="180">6 miesięcy</option>
                    <option value="9999">Wszystkie</option>
                </select>
                <button type="button" id="db-clear-media-btn" class="z-ghost z-serwis-szeroki">
                    ${ikona('trash', 18)}
                    Rozpocznij zwalnianie miejsca
                </button>
            </section>

            <section class="z-card z-serwis-karta" aria-labelledby="serwis-t-naprawa">
                <div class="z-serwis-tyt" id="serwis-t-naprawa" role="heading" aria-level="3">${ikona('wrench')}Naprawa i mapowanie danych</div>
                <p class="z-sub z-serwis-opis">Narzędzie do automatycznej naprawy starych nazw ćwiczeń na nowe, zunifikowane nazwy z Katalogu. <strong class="z-serwis-mocny">Ważne: przed użyciem utwórz kopię na samej górze ekranu.</strong></p>
                <button type="button" id="db-migrate-names-btn" class="z-ghost z-serwis-szeroki">
                    ${ikona('rotate-ccw', 18)}
                    Wykonaj Mapowanie Ćwiczeń
                </button>
            </section>

            <section class="z-card z-serwis-karta" aria-labelledby="serwis-t-cache">
                <div class="z-serwis-tyt" id="serwis-t-cache" role="heading" aria-level="3">${ikona('settings')}Pamięć podręczna</div>
                <p class="z-sub z-serwis-opis">Użyj tej opcji <strong class="z-serwis-mocny">tylko wtedy, gdy zaciął się interfejs</strong> (np. nie ładuje się awatar, źle działa motyw lub zablokował się samouczek). Zresetuje ona wyłącznie podręczne ustawienia wyglądu. <strong class="z-serwis-mocny">Twoja historia treningów i atlas ćwiczeń są w pełni bezpieczne.</strong></p>
                <button type="button" id="db-clear-local-btn" class="z-ghost z-serwis-szeroki">
                    Wyczyść tylko LocalStorage
                </button>
            </section>

            <section class="z-card z-serwis-karta" aria-labelledby="serwis-t-logi">
                <div class="z-serwis-tyt" id="serwis-t-logi" role="heading" aria-level="3">${ikona('info')}Logi błędów aplikacji</div>
                <div id="diagnostics-logs-container" class="z-serwis-logi" role="region" aria-label="Logi błędów" tabindex="0">
                    Ładowanie logów...
                </div>
                <div class="z-serwis-rzad">
                    <button type="button" id="copy-errors-btn" class="z-ghost">
                        ${ikona('copy', 18)}
                        Kopiuj Logi
                    </button>
                    <button type="button" id="share-errors-btn" class="z-ghost">
                        ${ikona('share', 18)}
                        Udostępnij Logi
                    </button>
                </div>
                <button type="button" id="clear-errors-btn" class="z-ghost z-serwis-szeroki">
                    Wyczyść Logi
                </button>
            </section>

            <section class="z-card z-alert z-serwis-karta" aria-labelledby="serwis-t-awaria">
                <div class="z-serwis-tyt z-serwis-tyt-awaria" id="serwis-t-awaria" role="heading" aria-level="3">${ikona('alert')}Strefa awaryjna</div>

                <h4 class="z-serwis-podtyt">Przycisk paniki (twardy reset)</h4>
                <p class="z-sub z-serwis-opis">Użyj tylko wtedy, gdy aplikacja przestała się aktualizować lub „utknęła” na starej wersji. <strong class="z-serwis-mocny">Konta i statystyki są bezpieczne</strong> (baza SQLite nie jest usuwana).</p>
                <button type="button" id="pwa-hard-reset-btn" class="z-ghost z-danger z-serwis-szeroki">
                    ${ikona('alert', 18)}
                    Twardy reset aplikacji (dane bezpieczne)
                </button>

                <div class="z-sep"></div>

                <h4 class="z-serwis-podtyt">Formatowanie bazy (usuwa błędy I/O)</h4>
                <p class="z-sub z-serwis-opis">Rozwiązuje ostatecznie problem „disk I/O error” w Safari.</p>
                <ol class="z-sub z-serwis-kroki">
                    <li><strong class="z-serwis-mocny">Krok 1:</strong> utwórz kopię wyżej i pobierz plik JSON.</li>
                    <li><strong class="z-serwis-mocny">Krok 2:</strong> kliknij ten przycisk.</li>
                    <li><strong class="z-serwis-mocny">Krok 3:</strong> po restarcie zaimportuj pobrany plik JSON.</li>
                </ol>
                <button type="button" id="db-factory-reset-btn" class="z-ghost z-danger z-serwis-szeroki">
                    ${ikona('trash', 18)}
                    Formatuj bazę danych
                </button>
            </section>
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
                        html += `<div class="z-log-wer">Wersja: ${esc(v)}</div>`;
                        grouped[v].forEach(l => {
                            html += `<div class="z-log-wpis">`;
                            html += `<span class="z-log-czas">${esc(l.time)}</span><br>`;
                            html += `<span class="z-log-msg">${esc(l.msg)}</span>`;
                            if (l.stack) html += `<br><span class="z-log-stos">${esc(l.stack.substring(0, 200))}...</span>`;
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
                        await window.UkiScope.unregisterOwn();
                        await window.UkiScope.deleteOwnCaches();
                        
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
                        await DatabaseManager.importDatabase(jsonStr).catch((vaultErr) => {
                            if (vaultErr?.message !== 'SEJF_ISTNIEJE') throw vaultErr;
                            const replaceTrainerVault = confirm("Zastąpić dane Strefy trenera danymi z kopii?");
                            return DatabaseManager.importDatabase(jsonStr, { replaceTrainerVault });
                        });
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
                if (confirm("Usunąć ustawienia BodyBuild zapisane w przeglądarce (wygląd, samouczki, preferencje)?\n\nTreningi, pomiary, dieta, szablony, plany, własne ćwiczenia, Twój nick, status PRO oraz dane innych aplikacji UKIS zostaną zachowane.")) {
                    // Nie localStorage.clear(): domena jest wspólna dla aplikacji UKIS; uprawnienia, kvvfs i klucze współdzielone zostają (ukis-scope.js)
                    window.UkiScope.clearOwnLocalStorage();
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
                                if (ex.name && !isCatalogExercise(ex.name)) unknownNames.add(ex.name);
                                if (ex.type === 'superset' && ex.exercises) {
                                    ex.exercises.forEach(nx => {
                                        if (nx.name && !isCatalogExercise(nx.name)) unknownNames.add(nx.name);
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
                        // Podpowiedź: nazwa główna z katalogu (exerciseTraits.suggestCatalogName).
                        const bestMatch = suggestCatalogName(unknown);

                        rowsHtml += `
                            <div class="z-serwis-wiersz">
                                <label class="z-lab z-serwis-nieznane" for="map-select-${i}">Nieznane: "${esc(unknown)}"</label>
                                <select id="map-select-${i}" class="z-in" data-original="${esc(unknown)}">
                                    <option value="">-- Pomiń (Zostaw bez zmian) --</option>
                                    ${validExercises.map(ex => `<option value="${esc(ex)}" ${ex === bestMatch ? 'selected' : ''}>Zmień na: ${esc(ex)}</option>`).join('')}
                                </select>
                            </div>
                        `;
                    });

                    const modalHtml = `
                        <div id="${modalId}" class="z-dialog-scrim z-serwis-scrim">
                            <div class="z-dialog z-serwis-okno" role="dialog" aria-modal="true" aria-labelledby="${modalId}-tyt">
                                <div class="z-serwis-okno-gora">
                                    <h3 class="z-hd" id="${modalId}-tyt">Asystent Mapowania</h3>
                                    <button type="button" class="z-ic" aria-label="Zamknij" onclick="document.getElementById('${modalId}').remove()">${ikona('x')}</button>
                                </div>
                                <div class="z-serwis-okno-tresc">
                                    <p class="z-sub">Poniżej znajdują się nazwy, które nie występują w nowym katalogu. Wybierz z listy docelowe odpowiedniki. Jeśli zostawisz "-- Pomiń --", nazwa nie zostanie zmieniona.</p>
                                    ${rowsHtml}
                                </div>
                                <div class="z-dialog-actions">
                                    <button type="button" id="map-save-btn" class="z-btn z-serwis-szeroki">Zapisz zmiany do bazy</button>
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
