const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/TrainingUI.js', 'utf8');

// Add Import button to header
content = content.replace(/<p style="color: #888; font-size: 0\.8em; margin: 3px 0 0 0;">Wybierz zapisany plan by rozpocząć sesję:<\/p>/,
`<p style="color: #888; font-size: 0.8em; margin: 3px 0 0 0;">Wybierz zapisany plan by rozpocząć sesję:</p>
<button onclick="window.TrainingUI.importTemplate()" style="margin-top: 8px; background: #4CAF50; color: #fff; border: none; padding: 5px 10px; border-radius: 5px; font-size: 0.85em; font-weight: bold; cursor: pointer;">📥 Importuj z JSON</button>`);

// Add Export button to each card
content = content.replace(/<strong style="color: #00BFFF; font-size: 1\.1em;">\$\{t\.name\}<\/strong>/,
`<strong style="color: #00BFFF; font-size: 1.1em;">\${t.name}</strong>
<button onclick="window.TrainingUI.exportTemplate(\${t.id})" style="background: rgba(0, 191, 255, 0.1); border: 1px solid #00BFFF; color: #00BFFF; border-radius: 6px; padding: 3px 8px; font-size: 0.8em; margin-left: 10px; cursor: pointer;">📤 Eksport</button>`);

// Add exportTemplate and importTemplate functions
const functionsToAdd = `
    exportTemplate: (id) => {
        const templates = TrainingUI.getTemplates();
        const t = templates.find(x => x.id === id);
        if (!t) return;
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(t));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "UkiPlan_" + t.name.replace(/\\s+/g, '_') + ".json");
        dlAnchorElem.click();
    },

    importTemplate: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const imported = JSON.parse(event.target.result);
                    if (!imported.name || !imported.exercises) throw new Error("Nieprawidłowy plik planu.");
                    
                    imported.id = Date.now(); // nadaj nowe ID by uniknąć konfliktów
                    const templates = TrainingUI.getTemplates();
                    templates.push(imported);
                    localStorage.setItem('uki_workout_templates', JSON.stringify(templates));
                    alert("Pomyślnie zaimportowano plan: " + imported.name);
                    
                    document.getElementById('templates-modal-overlay').remove();
                    TrainingUI.loadTemplatesDialog(); // odśwież modal
                } catch(err) {
                    alert("Błąd importu pliku JSON: " + err.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },
`;

content = content.replace(/loadTemplatesDialog: \(\) => \{/, functionsToAdd + "\n    loadTemplatesDialog: () => {");

fs.writeFileSync('src/modules/ui/TrainingUI.js', content);
