const fs = require('fs');
const sqlite = fs.readFileSync('libs/sqlite/sqlite3.js', 'utf-8');
console.log("SQLITE_DESERIALIZE_FREEONCLOSE", sqlite.match(/SQLITE_DESERIALIZE_FREEONCLOSE.*?(\d+)/));
console.log("SQLITE_DESERIALIZE_RESIZEABLE", sqlite.match(/SQLITE_DESERIALIZE_RESIZEABLE.*?(\d+)/));
