const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/TrainingUI.js', 'utf8');

content = content.replace(/console\.error\("Error saving training:", err\);/,
`console.error("Error saving training:", err);
                alert("Wystąpił błąd podczas zapisu treningu! (Prawdopodobnie limit miejsca - disk I/O). Trening został zachowany w pamięci jako szkic.");`);

fs.writeFileSync('src/modules/ui/TrainingUI.js', content);
