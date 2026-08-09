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
                <h3 style="color: #FF9800; margin-top: 0;">Eksport / Import Danych</h3>
                <p style="font-size: 0.9em; color: #ccc;">Zapisz swoje dane do pliku na urządzeniu lub wgraj z powrotem. Zalecane przed Twardym Resetem.</p>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button id="db-export-btn" style="flex: 1; padding: 10px; background: #222; border: 1px solid #00BFFF; color: #00BFFF; border-radius: 5px; cursor: pointer;">Zrób Kopię (Export)</button>
                    <button id="db-import-btn" style="flex: 1; padding: 10px; background: #222; border: 1px solid #FF9800; color: #FF9800; border-radius: 5px; cursor: pointer;">Wgraj Kopię (Import)</button>
                    <input type="file" id="db-import-file" accept=".json" style="display: none;">
                </div>
            </div>

            <div style="background: rgba(231,76,60,0.1); padding: 15px; border-radius: 8px; border: 1px solid #E74C3C; margin-bottom: 20px;">
                <h3 style="color: #E74C3C; margin-top: 0;">Przycisk Paniki (Twardy Reset PWA)</h3>
                <p style="font-size: 0.9em; color: #ccc;">Użyj tylko wtedy, gdy aplikacja przestała się aktualizować lub "utknęła" na starej wersji. <b>Konta i statystyki są bezpieczne</b> (baza SQLite nie jest usuwana).</p>
                <button id="pwa-hard-reset-btn" style="width: 100%; padding: 12px; font-weight: bold; font-size: 1.1em; background: #E74C3C; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 15px;">
                    ⚠️ WYKONAJ TWARDY RESET APLIKACJI
                </button>
            </div>
            
            <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);">
                <h3 style="color: #eee; margin-top: 0;">Pamięć Podręczna</h3>
                <p style="font-size: 0.9em; color: #ccc;">Odświeża całą bazę ćwiczeń i systemowych ustawień bez dotykania zapisów treningowych.</p>
                <button id="db-clear-local-btn" style="width: 100%; padding: 10px; background: #444; color: #eee; border: 1px solid #666; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                    Wyczyść tylko LocalStorage
                </button>
            </div>
        `;

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
                const dataStr = await DatabaseManager.exportDataJSON();
                const blob = new Blob([dataStr], {type: "application/json"});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ukis_bodybuild_backup_${new Date().toISOString().slice(0,10)}.json`;
                a.click();
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
                        await DatabaseManager.importDataJSON(jsonStr);
                        alert("Dane przywrócone pomyślnie! Aplikacja zostanie zrestartowana.");
                        window.location.reload();
                    } catch (err) {
                        alert("Błąd przywracania danych. Upewnij się, że to poprawny plik kopii zapasowej.");
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
    }
};
