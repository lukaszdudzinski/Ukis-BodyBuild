const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/DiagnosticsUI.js', 'utf8');

content = content.replace(/confirm\("UWAGA! Stracisz wszystkie dane jeśli nie utworzyłeś Archiwum JSON!\n\nCzy pobrałeś Archiwum i chcesz sformatować bazę zwalniając 100% miejsca\?"\);/,
'confirm("UWAGA! Stracisz wszystkie dane jeśli nie utworzyłeś Archiwum JSON!\\n\\nCzy pobrałeś Archiwum i chcesz sformatować bazę zwalniając 100% miejsca?");');

fs.writeFileSync('src/modules/ui/DiagnosticsUI.js', content);
