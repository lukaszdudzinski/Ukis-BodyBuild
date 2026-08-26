const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/DiagnosticsUI.js', 'utf8');

const factoryResetHtml = `
            <div style="background: rgba(255, 0, 0, 0.15); padding: 15px; border-radius: 8px; border: 1px solid #FF0000; margin-bottom: 20px;">
                <h3 style="color: #FF0000; margin-top: 0;">⚠️ Formatowanie Bazy (Usuwa Błędy I/O)</h3>
                <p style="font-size: 0.9em; color: #ccc;">Rozwiązuje ostatecznie problem "disk I/O error" w Safari. <br><b>KROK 1:</b> Utwórz Archiwum wyżej i pobierz plik JSON.<br><b>KROK 2:</b> Kliknij ten czerwony przycisk.<br><b>KROK 3:</b> Po restarcie zaimportuj pobrany plik JSON w panelu wyżej.</p>
                <button id="db-factory-reset-btn" style="width: 100%; padding: 13px; font-weight: bold; font-size: 1em; background: #FF0000; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 15px; text-align: center;">
                    🧨 FORMATUJ BAZĘ DANYCH
                </button>
            </div>
`;

content = content.replace(/<div style="background: rgba\(0,0,0,0\.3\); padding: 15px; border-radius: 8px; border: 1px solid rgba\(255,255,255,0\.2\); margin-bottom: 20px;">/, factoryResetHtml + '\n\n            <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); margin-bottom: 20px;">');

const factoryResetLogic = `
        const factoryBtn = document.getElementById('db-factory-reset-btn');
        if (factoryBtn) {
            factoryBtn.addEventListener('click', async () => {
                const confirmed = confirm("UWAGA! Stracisz wszystkie dane jeśli nie utworzyłeś Archiwum JSON!\n\nCzy pobrałeś Archiwum i chcesz sformatować bazę zwalniając 100% miejsca?");
                if (confirmed) {
                    try {
                        const root = await navigator.storage.getDirectory();
                        await root.removeEntry('ukis_bodybuild.sqlite3', { recursive: true });
                        alert("Baza została pomyślnie sformatowana. Aplikacja zostanie zrestartowana.");
                        window.location.reload(true);
                    } catch(e) {
                        alert("Błąd podczas usuwania pliku: " + e.message);
                    }
                }
            });
        }
`;

content = content.replace(/bindEvents: \(\) => \{/, "bindEvents: () => {\n" + factoryResetLogic);

fs.writeFileSync('src/modules/ui/DiagnosticsUI.js', content);
