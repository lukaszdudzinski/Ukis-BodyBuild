const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/DiagnosticsUI.js', 'utf8');

const newButtonSection = `
            <div style="background: rgba(33, 150, 243, 0.1); padding: 15px; border-radius: 8px; border: 1px solid #2196F3; margin-bottom: 20px;">
                <h3 style="color: #2196F3; margin-top: 0;">🗑 Wymuś Czyszczenie Zdjęć</h3>
                <p style="font-size: 0.9em; color: #ccc;">Zwalnia miejsce usuwając zdjęcia posiłków starsze niż 1 dzień. Same dane o makro i kaloriach zostają zachowane na wykresy.</p>
                <button id="db-clear-media-btn" style="width: 100%; padding: 13px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 15px; font-weight: bold; font-size: 1em; text-align: center;">
                    Wymuś Czyszczenie Miniatur
                </button>
            </div>`;

content = content.replace(/<div style="background: rgba\(155, 89, 182, 0\.1\)/, newButtonSection + '\n\n            <div style="background: rgba(155, 89, 182, 0.1)');

const newEventLogic = `
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
                            alert(\`Usunięto pomyślnie \${oldDietResp.result.length} zdjęć posiłków. Zwalnianie miejsca powiodło się.\`);
                        } else {
                            alert("Nie znaleziono żadnych starych miniatur do wyczyszczenia.");
                        }
                    } catch (e) {
                        alert("Błąd podczas czyszczenia miniatur: " + e.message);
                    }
                }
            });
        }`;

content = content.replace(/bindEvents: \(\) => \{/, "bindEvents: () => {" + newEventLogic);

fs.writeFileSync('src/modules/ui/DiagnosticsUI.js', content);
