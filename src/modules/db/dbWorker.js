self.importScripts('../../../libs/sqlite/sqlite3.js');

let db = null;
let sqlite3 = null;

const DB_FILE = 'ukis_bodybuild.sqlite3';
// Uchwyt createSyncAccessHandle jest wyłączny. Inny kontekst (stary worker przy przeładowaniu,
// druga karta, drugi wygląd) może go chwilę trzymać, więc czekamy na zwolnienie zamiast się poddać.
const LOCK_WAIT_MS = 5000;
const LOCK_ERRORS = ['NoModificationAllowedError', 'InvalidStateError'];

async function withAccessHandle(create, fn) {
    const root = await navigator.storage.getDirectory();
    const handle = await root.getFileHandle(DB_FILE, { create });
    const deadline = Date.now() + LOCK_WAIT_MS;
    let delay = 50;
    let accessHandle;
    for (;;) {
        try {
            accessHandle = await handle.createSyncAccessHandle();
            break;
        } catch (err) {
            if (!LOCK_ERRORS.includes(err.name) || Date.now() >= deadline) throw err;
            await new Promise(r => setTimeout(r, delay));
            delay = Math.min(delay * 2, 500);
        }
    }
    try {
        return fn(accessHandle);
    } finally {
        accessHandle.close();
    }
}

// Najpierw powiększa plik (tu może zabraknąć miejsca, zanim cokolwiek nadpiszemy), potem zapis i przycięcie.
function writeWhole(accessHandle, bytes) {
    if (accessHandle.getSize() < bytes.byteLength) accessHandle.truncate(bytes.byteLength);
    accessHandle.write(bytes, { at: 0 });
    accessHandle.truncate(bytes.byteLength);
    accessHandle.flush();
}

async function autoSaveOPFS() {
    if (sqlite3 && !sqlite3.opfs && db) {
        const byteArray = sqlite3.capi.sqlite3_js_db_export(db.pointer);
        try {
            await withAccessHandle(true, ah => writeWhole(ah, byteArray));
        } catch (e) {
            console.error("Worker: Manual OPFS save failed", e);
            throw new Error('Nie udało się zapisać danych na urządzeniu (' + e.name + '). Spróbuj ponownie.');
        } finally {
            sqlite3.wasm.dealloc(byteArray);
        }
    }
}

self.onmessage = async function(e) {
    const { id, action, payload } = e.data;
    try {
        if (action === 'init') {
            if (!db) {
                // Pobierz plik WASM samodzielnie z absolutnym URL
                // (locateFile nie działa w klasycznym workerze na iOS Safari - sqlite3.js go nadpisuje)
                if (!sqlite3) {
                    const wasmUrl = new URL('../../../libs/sqlite/sqlite3.wasm', self.location.href).href;
                    const wasmResponse = await fetch(wasmUrl, { cache: 'no-store' });
                    if (!wasmResponse.ok) throw new Error('Failed to fetch sqlite3.wasm: ' + wasmResponse.status);
                    const wasmBinary = await wasmResponse.arrayBuffer();

                    sqlite3 = await self.sqlite3InitModule({
                        print: console.log,
                        printErr: console.error,
                        wasmBinary: wasmBinary
                    });
                }

                if (sqlite3.opfs) {
                    db = new sqlite3.oo1.OpfsDb('/ukis_bodybuild.sqlite3');
                    console.log('Worker: The OPFS is available. Opened OPFS database.');
                } else {
                    console.warn('Worker: OPFS is not available. Falling back to manual OPFS memory DB.');

                    // Pusta baza tylko wtedy, gdy pliku naprawdę nie ma. Plik, którego nie da się odczytać
                    // (np. zajęty), przerywa start: pusta baza w pamięci nadpisałaby go przy pierwszym zapisie.
                    let saved = null;
                    try {
                        saved = await withAccessHandle(false, ah => {
                            const size = ah.getSize();
                            if (size === 0) return null;
                            const buffer = new Uint8Array(size);
                            const read = ah.read(buffer, { at: 0 });
                            if (read !== size) throw new Error('Odczytano ' + read + ' z ' + size + ' bajtów');
                            return buffer;
                        });
                    } catch (err) {
                        if (err.name !== 'NotFoundError') {
                            console.error("Worker: Manual OPFS file exists but failed to load.", err);
                            throw new Error('Nie udało się otworzyć zapisanych danych (' + err.name + '). Zamknij inne karty BodyBuild i odśwież stronę.');
                        }
                        console.log("Worker: Manual OPFS file not found, starting a new database.");
                    }

                    const memDb = new sqlite3.oo1.DB(':memory:');
                    if (saved) {
                        const p = sqlite3.wasm.alloc(saved.byteLength);
                        sqlite3.wasm.heap8().set(saved, p);
                        const rc = sqlite3.capi.sqlite3_deserialize(memDb.pointer, 'main', p, saved.byteLength, saved.byteLength, 3);
                        if (rc !== 0) {
                            memDb.close();
                            throw new Error('Nie udało się wczytać zapisanych danych (kod ' + rc + ').');
                        }
                        console.log("Worker: Loaded memory DB from OPFS manually");
                    }
                    db = memDb;
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
            } catch (err) {
                db.exec('ROLLBACK;');
                throw err;
            }
            // Poza try: po COMMIT nie ma już czego wycofywać, a ROLLBACK zgubiłby błąd zapisu.
            await autoSaveOPFS();
            self.postMessage({ id, success: true });
        } else if (action === 'import_raw') {
            const { buffer } = payload;
            try {
                if (db) {
                    db.close();
                    db = null;
                }
                await withAccessHandle(true, ah => writeWhole(ah, new Uint8Array(buffer)));

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
