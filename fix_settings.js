const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/SettingsUI.js', 'utf8');

content = content.replace(/(\s+)(\}\);\s+)(if \(wallpaperRemove\))/, "$1$2$1}\n$1$3");

fs.writeFileSync('src/modules/ui/SettingsUI.js', content);
