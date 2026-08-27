const sqlite3InitModule = require('../libs/sqlite/sqlite3.js');
sqlite3InitModule().then(sqlite3 => {
    console.log("deserialize:", typeof sqlite3.capi.sqlite3_deserialize);
    console.log("SQLITE_DESERIALIZE_FREEONCLOSE:", sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE);
    console.log("SQLITE_DESERIALIZE_RESIZEABLE:", sqlite3.capi.SQLITE_DESERIALIZE_RESIZEABLE);
}).catch(e => console.error(e));
