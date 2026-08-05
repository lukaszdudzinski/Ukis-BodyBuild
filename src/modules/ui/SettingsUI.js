import { DatabaseManager } from '../db/DatabaseManager.js';

export const SettingsUI = {
    init: () => {
        // Find or create export/import buttons in the settings panel
        const settingsPanel = document.getElementById('settings-panel');
        if (!settingsPanel) return;

        // Add Data Management section if it doesn't exist
        if (!document.getElementById('db-export-btn')) {
            const dataSection = document.createElement('div');
            dataSection.innerHTML = `
                <h4 style="margin-top: 20px;">Zarządzanie Danymi</h4>
                <div class="form-full-width" style="margin-bottom: 20px;">
                    <button id="db-export-btn" class="action-button" style="width: 100%; margin-bottom: 10px; background-color: #2196F3; border-color: #2196F3;">💾 Eksportuj Bazę (JSON)</button>
                    <label for="db-import-file" class="action-button" style="width: 100%; display: block; text-align: center; background-color: #333; border-color: #555; cursor: pointer; padding: 10px; border-radius: 5px;">
                        📂 Importuj Bazę (JSON)
                    </label>
                    <input type="file" id="db-import-file" accept=".json" style="display: none;">
                </div>
            `;
            settingsPanel.insertBefore(dataSection, document.getElementById('settings-pwa-guide'));
        }

        const exportBtn = document.getElementById('db-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', SettingsUI.handleExport);
        }

        const importInput = document.getElementById('db-import-file');
        if (importInput) {
            importInput.addEventListener('change', SettingsUI.handleImport);
        }
    },

    handleExport: async () => {
        try {
            const jsonString = await DatabaseManager.exportDatabase();
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `bodybuild_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert("Baza została wyeksportowana!");
        } catch (err) {
            console.error(err);
            alert("Błąd podczas eksportu bazy danych.");
        }
    },

    handleImport: async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (confirm("UWAGA: Import nadpisze wszystkie obecne dane (pomiary, treningi). Czy chcesz kontynuować?")) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const jsonString = event.target.result;
                const success = await DatabaseManager.importDatabase(jsonString);
                
                if (success) {
                    alert("Baza została pomyślnie zaimportowana! Aplikacja zostanie przeładowana.");
                    window.location.reload();
                } else {
                    alert("Błąd podczas importu. Sprawdź plik JSON.");
                }
            };
            reader.readAsText(file);
        }
        
        // Reset input
        e.target.value = '';
    }
};
