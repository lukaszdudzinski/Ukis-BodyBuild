self.importScripts('../../../libs/sqlite/sqlite3.js');

let db = null;
let sqlite3 = null;

async function autoSaveOPFS() {
    if (sqlite3 && !sqlite3.opfs && db) {
        try {
            const byteArray = sqlite3.capi.sqlite3_js_db_export(db.pointer);
            const root = await navigator.storage.getDirectory();
            const handle = await root.getFileHandle('ukis_bodybuild.sqlite3', { create: true });
            const accessHandle = await handle.createSyncAccessHandle();
            accessHandle.truncate(0);
            accessHandle.write(byteArray);
            accessHandle.flush();
            accessHandle.close();
        } catch(e) { console.error("Worker: Manual OPFS save failed", e); }
    }
}

self.onmessage = async function(e) {
    const { id, action, payload } = e.data;
    try {
        if (action === 'init') {
            if (!db) {
                // Pobierz plik WASM samodzielnie z absolutnym URL
                // (locateFile nie działa w klasycznym workerze na iOS Safari - sqlite3.js go nadpisuje)
                const wasmUrl = new URL('../../../libs/sqlite/sqlite3.wasm', self.location.href).href;
                const wasmResponse = await fetch(wasmUrl, { cache: 'no-store' });
                if (!wasmResponse.ok) throw new Error('Failed to fetch sqlite3.wasm: ' + wasmResponse.status);
                const wasmBinary = await wasmResponse.arrayBuffer();
                
                sqlite3 = await self.sqlite3InitModule({
                    print: console.log,
                    printErr: console.error,
                    wasmBinary: wasmBinary
                });
                
                if (sqlite3.opfs) {
                    db = new sqlite3.oo1.OpfsDb('/ukis_bodybuild.sqlite3');
                    console.log('Worker: The OPFS is available. Opened OPFS database.');
                } else {
                    console.warn('Worker: OPFS is not available. Falling back to manual OPFS memory DB.');
                    db = new sqlite3.oo1.DB(':memory:');
                    
                    try {
                        const root = await navigator.storage.getDirectory();
                        const handle = await root.getFileHandle('ukis_bodybuild.sqlite3', { create: false });
                        const accessHandle = await handle.createSyncAccessHandle();
                        const size = accessHandle.getSize();
                        if (size > 0) {
                            const buffer = new Uint8Array(size);
                            accessHandle.read(buffer, { at: 0 });
                            const p = sqlite3.wasm.alloc(size);
                            sqlite3.wasm.heap8().set(buffer, p);
                            sqlite3.capi.sqlite3_deserialize(db.pointer, 'main', p, size, size, 3);
                            console.log("Worker: Loaded memory DB from OPFS manually");
                        }
                        accessHandle.close();
                    } catch (err) {
                        console.log("Worker: Manual OPFS file not found or failed to load.", err.message);
                    }
                }
            }
            self.postMessage({ id, success: true });
            
        } else if (action === 'exec') {
            const { sql, bind, rowMode, needLastInsertId } = payload;
            let result = [];
            
            db.exec({
                sql,
                bind: bind || [],
                rowMode: rowMode || 'array',
                callback: function(row) {
                    result.push(Array.isArray(row) ? [...row] : {...row});
                }
            });
            
            let lastInsertId = null;
            if (needLastInsertId) {
                db.exec({
                    sql: 'SELECT last_insert_rowid() as id',
                    rowMode: 'object',
                    callback: function(row) {
                        lastInsertId = row.id;
                    }
                });
            }
            
            if (sql.trim().toUpperCase().match(/^(INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|REPLACE)/)) {
                await autoSaveOPFS();
            }
            
            self.postMessage({ id, success: true, result, lastInsertId });
            
        } else if (action === 'exec_multiple') {
            const { queries } = payload;
            db.exec('BEGIN TRANSACTION;');
            try {
                for (let q of queries) {
                    db.exec({
                        sql: q.sql,
                        bind: q.bind || []
                    });
                }
                db.exec('COMMIT;');
                await autoSaveOPFS();
                self.postMessage({ id, success: true });
            } catch (err) {
                db.exec('ROLLBACK;');
                throw err;
            }
        } else if (action === 'import_raw') {
            const { buffer } = payload;
            try {
                if (db) {
                    db.close();
                    db = null;
                }
                const root = await navigator.storage.getDirectory();
                const handle = await root.getFileHandle('ukis_bodybuild.sqlite3', { create: true });
                const accessHandle = await handle.createSyncAccessHandle();
                accessHandle.truncate(0);
                accessHandle.write(new Uint8Array(buffer));
                accessHandle.flush();
                accessHandle.close();
                
                // Re-init db
                if (sqlite3.opfs) {
                    db = new sqlite3.oo1.OpfsDb('/ukis_bodybuild.sqlite3');
                } else {
                    db = new sqlite3.oo1.DB(':memory:');
                    const p = sqlite3.wasm.alloc(buffer.byteLength);
                    sqlite3.wasm.heap8().set(new Uint8Array(buffer), p);
                    sqlite3.capi.sqlite3_deserialize(db.pointer, 'main', p, buffer.byteLength, buffer.byteLength, 3);
                }
                
                self.postMessage({ id, success: true });
            } catch (err) {
                throw new Error("Błąd nadpisywania OPFS: " + err.message);
            }
        }
    } catch (error) {
        console.error('Worker Error:', error);
        self.postMessage({ id, success: false, error: error.message, name: error.name });
    }
};
