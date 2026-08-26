const fs = require('fs');
let content = fs.readFileSync('src/modules/db/DatabaseManager.js', 'utf8');

// Change retention cutoff from 3 days to 1 day
content = content.replace(/cutoffDate\.setDate\(cutoffDate\.getDate\(\) - 3\);/, "cutoffDate.setDate(cutoffDate.getDate() - 1);");

fs.writeFileSync('src/modules/db/DatabaseManager.js', content);
