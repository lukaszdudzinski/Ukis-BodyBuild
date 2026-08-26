self.importScripts('../../../libs/sqlite/sqlite3.js');

let db = null;
let sqlite3 = null;

self.onmessage = async function(e) {
    const { id, action, payload } = e.data;
    try {
        if (action === 'init') {
            if (!db) {
                sqlite3 = await self.sqlite3InitModule({
                    print: console.log,
                    printErr: console.error,
                });
                
                if (sqlite3.opfs) {
                    db = new sqlite3.oo1.OpfsDb('/ukis_bodybuild.sqlite3');
                    console.log('Worker: The OPFS is available. Opened OPFS database.');
                } else {
                    console.warn('Worker: OPFS is not available. Falling back to kvvfs or memory.');
                    try {
                        db = new sqlite3.oo1.DB('local', 'c', 'kvvfs');
                        console.log('Worker: Opened kvvfs (localStorage-backed) database.');
                    } catch (err) {
                        db = new sqlite3.oo1.DB(':memory:');
                        console.warn('Worker: Fell back to in-memory database.', err);
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
                self.postMessage({ id, success: true });
            } catch (err) {
                db.exec('ROLLBACK;');
                throw err;
            }
        }
    } catch (error) {
        console.error('Worker Error:', error);
        self.postMessage({ id, success: false, error: error.message, name: error.name });
    }
};
