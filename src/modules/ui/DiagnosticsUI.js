import { DatabaseManager } from '../db/DatabaseManager.js';

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
                <p style="font-size: 0.9em; color: #ccc;">Utwórz kompletną kopię bezpieczeństwa (pomiary, treningi, szablony, dieta, raporty AI, awatar i ustawienia) lub przywróć całą aplikację z pliku archiwum JSON.</p>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button id="db-export-btn" style="flex: 1; padding: 13px 10px; background: #222; border: 1px solid #00BFFF; color: #00BFFF; border-radius: 5px; cursor: pointer; font-size: 1em; font-weight: bold; text-align: center;">📦 Utwórz Archiwum</button>
                    <button id="db-import-btn" style="flex: 1; padding: 13px 10px; background: #222; border: 1px solid #FF9800; color: #FF9800; border-radius: 5px; cursor: pointer; font-size: 1em; font-weight: bold; text-align: center;">📥 Przywróć z Pliku</button>
                    <input type="file" id="db-import-file" accept=".json" style="display: none;">
                </div>
            </div>

            <div style="background: rgba(231,76,60,0.1); padding: 15px; border-radius: 8px; border: 1px solid #E74C3C; margin-bottom: 20px;">
                <h3 style="color: #E74C3C; margin-top: 0;">Przycisk Paniki (Twardy Reset PWA)</h3>
                <p style="font-size: 0.9em; color: #ccc;">Użyj tylko wtedy, gdy aplikacja przestała się aktualizować lub "utknęła" na starej wersji. <b>Konta i statystyki są bezpieczne</b> (baza SQLite nie jest usuwana).</p>
                <button id="pwa-hard-reset-btn" style="width: 100%; padding: 13px; font-weight: bold; font-size: 1em; background: #E74C3C; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 15px; text-align: center;">
                    ⚠️ WYKONAJ TWARDY RESET APLIKACJI
                </button>
            </div>

            <div style="background: rgba(155, 89, 182, 0.1); padding: 15px; border-radius: 8px; border: 1px solid #9B59B6; margin-bottom: 20px;">
                <h3 style="color: #9B59B6; margin-top: 0;">🔧 Naprawa i Mapowanie Danych</h3>
                <p style="font-size: 0.9em; color: #ccc;">Narzędzie do automatycznej naprawy starych nazw ćwiczeń na nowe, zunifikowane nazwy z Katalogu (np. zamienia "wyciskanie płaska" na "Klatka - Wyciskanie sztangi - Ławka płaska"). <b>WAŻNE: Przed użyciem utwórz Archiwum na samej górze!</b></p>
                <button id="db-migrate-names-btn" style="width: 100%; padding: 13px; font-weight: bold; font-size: 1em; background: #9B59B6; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 15px; text-align: center;">
                    🔄 Wykonaj Mapowanie Ćwiczeń
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
    },

    bindEvents: () => {
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

        // Import/Export
        const exportBtn = document.getElementById('db-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', async () => {
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

        // Mapowanie Ćwiczeń
        const migrateNamesBtn = document.getElementById('db-migrate-names-btn');
        if (migrateNamesBtn) {
            migrateNamesBtn.addEventListener('click', async () => {
                if (confirm("WAŻNE: Czy utworzyłeś już Archiwum na samej górze tej zakładki?\n\nKliknij OK, jeśli chcesz dokonać mapowania (nadpisze to stare nazwy ćwiczeń m.in. 'wyciskanie płaska' na docelowe z Katalogu).")) {
                    try {
                        const trainings = await DatabaseManager.getTrainings();
                        if (!trainings || trainings.length === 0) {
                            alert("Brak treningów do zmapowania.");
                            return;
                        }

                        // Słownik mapowań
                        const mapDict = [
                            { match: ["wyciskanie płaska", "klatka płaska", "wyciskanie sztangi płaska", "wycisk płaska"], replace: "Klatka - Wyciskanie sztangi - Ławka płaska" },
                            { match: ["klatka skos", "wyciskanie skos", "wyciskanie sztangi skos", "wycisk skos dodatni"], replace: "Klatka - Wyciskanie sztangi - Skos dodatni" },
                            { match: ["wyciskanie hantli płaska", "hantle płaska klatka", "rozpiętki płaska"], replace: "Klatka - Wyciskanie hantli - Ławka płaska" },
                            { match: ["rozpiętki", "rozpietki", "rozpiętki skos", "hantle skos klatka"], replace: "Klatka - Rozpiętki - Hantle (skos dodatni)" },
                            { match: ["martwy", "mc", "martwy ciąg"], replace: "Plecy - Martwy ciąg (Klasyczny)" },
                            { match: ["przysiady", "siady", "przysiad ze sztangą"], replace: "Nogi - Przysiady ze sztangą na karku" },
                            { match: ["ołp", "ohp", "wyciskanie żołnierskie", "żołnierskie"], replace: "Barki - Wyciskanie sztangi nad głowę (OHP)" },
                            { match: ["wiosłowanie", "wiosło"], replace: "Plecy - Wiosłowanie sztangą w opadzie" }
                        ];

                        let updatedCount = 0;
                        for (let t of trainings) {
                            let changed = false;
                            if (t.exercises && t.exercises.length > 0) {
                                t.exercises.forEach(ex => {
                                    if (ex.name) {
                                        const origName = ex.name.toLowerCase().trim();
                                        for (const dict of mapDict) {
                                            // Sprawdzamy czy któraś fraza idealnie pasuje do oryginalnej nazwy
                                            if (dict.match.includes(origName)) {
                                                ex.name = dict.replace;
                                                changed = true;
                                                break;
                                            }
                                        }
                                        // Dla "wyciskanie sztangi płaska" itp. jeśli ktoś wpisał np "Wyciskanie płaska klatka"
                                        if (!changed) {
                                            if (origName.includes("wyciskanie") && origName.includes("płaska") && !origName.includes("hantl")) {
                                                ex.name = "Klatka - Wyciskanie sztangi - Ławka płaska";
                                                changed = true;
                                            } else if (origName.includes("klatka") && origName.includes("płaska") && !origName.includes("hantl")) {
                                                ex.name = "Klatka - Wyciskanie sztangi - Ławka płaska";
                                                changed = true;
                                            }
                                        }
                                    }
                                    // Obsługa superserii
                                    if (ex.type === 'superset' && ex.exercises) {
                                        ex.exercises.forEach(nestedEx => {
                                            if (nestedEx.name) {
                                                const origNameNested = nestedEx.name.toLowerCase().trim();
                                                for (const dict of mapDict) {
                                                    if (dict.match.includes(origNameNested)) {
                                                        nestedEx.name = dict.replace;
                                                        changed = true;
                                                        break;
                                                    }
                                                }
                                                if (!changed) {
                                                    if (origNameNested.includes("wyciskanie") && origNameNested.includes("płaska") && !origNameNested.includes("hantl")) {
                                                        nestedEx.name = "Klatka - Wyciskanie sztangi - Ławka płaska";
                                                        changed = true;
                                                    } else if (origNameNested.includes("klatka") && origNameNested.includes("płaska") && !origNameNested.includes("hantl")) {
                                                        nestedEx.name = "Klatka - Wyciskanie sztangi - Ławka płaska";
                                                        changed = true;
                                                    }
                                                }
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

                        alert(`Zakończono! Zaktualizowano ${updatedCount} treningów z poprawionymi nazwami ćwiczeń.`);
                    } catch (err) {
                        alert("Błąd podczas mapowania: " + err.message);
                    }
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
