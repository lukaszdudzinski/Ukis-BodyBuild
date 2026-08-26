const fs = require('fs');
let content = fs.readFileSync('src/modules/db/DatabaseManager.js', 'utf8');

// Remove the misplaced block
content = content.replace(/\}\s*\/\/\s*Run migration and cleanup\s*DatabaseManager\.runMediaMigrationAndCleanup\(\)\.catch\(e => console\.error\(e\)\);\s*,/g,
`},`);

// Correctly insert into init() right after DatabaseManager.createTables();
content = content.replace(/await DatabaseManager\.createTables\(\);/,
`await DatabaseManager.createTables();
                DatabaseManager.runMediaMigrationAndCleanup().catch(e => console.error(e));`);

fs.writeFileSync('src/modules/db/DatabaseManager.js', content);
