import sqlite3InitModule from '../../../libs/sqlite/sqlite3.js';

let db = null;
let isReady = false;
let initPromise = null;

export const DatabaseManager = {
    init: async () => {
        if (isReady) return true;
        if (initPromise) return initPromise;

        initPromise = new Promise(async (resolve, reject) => {
            try {
                // Initialize the sqlite3 module
                const sqlite3 = await sqlite3InitModule({
                    print: console.log,
                    printErr: console.error,
                });

                console.log('SQLite3 version', sqlite3.version.libVersion);

                // Check for OPFS availability
                if (sqlite3.opfs) {
                    db = new sqlite3.oo1.OpfsDb('/ukis_dive_tools.sqlite3');
                    console.log('The OPFS is available. Opened OPFS database.');
                } else {
                    console.warn('OPFS is not available. Falling back to kvvfs or memory.');
                    try {
                        db = new sqlite3.oo1.DB('/ukis_dive_tools.sqlite3', 'c', 'kvvfs');
                        console.log('Opened kvvfs (localStorage-backed) database.');
                    } catch (e) {
                         db = new sqlite3.oo1.DB(':memory:');
                         console.warn('Fell back to in-memory database.', e);
                    }
                }

                // Initialize tables
                DatabaseManager.createTables();
                isReady = true;
                resolve(true);
            } catch (err) {
                console.error('Failed to initialize SQLite:', err);
                reject(err);
            }
        });
        return initPromise;
    },

    createTables: () => {
        if (!db) return;
        db.exec(`
            CREATE TABLE IF NOT EXISTS logbook (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                location TEXT NOT NULL,
                site TEXT NOT NULL,
                rating INTEGER,
                notes TEXT,
                maxDepth REAL,
                avgDepth REAL,
                bottomTime INTEGER,
                gasType TEXT,
                startPressure INTEGER,
                endPressure INTEGER,
                synced INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
    },

    addLog: async (logData) => {
        await DatabaseManager.init();
        
        db.exec({
            sql: `INSERT INTO logbook (date, location, site, rating, notes, maxDepth, avgDepth, bottomTime, gasType, startPressure, endPressure, synced) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            bind: [
                logData.date, 
                logData.location, 
                logData.site, 
                logData.rating || 0, 
                logData.notes || '', 
                logData.maxDepth || 0, 
                logData.avgDepth || 0, 
                logData.bottomTime || 0, 
                logData.gasType || 'air', 
                logData.startPressure || 0, 
                logData.endPressure || 0,
                logData.synced || 0
            ]
        });
        
        // Return the last inserted id
        let newId = null;
        db.exec({
            sql: `SELECT last_insert_rowid() as id`,
            rowMode: 'object',
            callback: function (row) {
                newId = row.id;
            }
        });
        
        return { ...logData, id: newId };
    },

    getLogs: async () => {
        await DatabaseManager.init();
        const logs = [];
        db.exec({
            sql: `SELECT * FROM logbook ORDER BY date DESC, created_at DESC`,
            rowMode: 'object',
            callback: function (row) {
                logs.push(row);
            }
        });
        return logs;
    },

    deleteLog: async (id) => {
        await DatabaseManager.init();
        db.exec({
            sql: `DELETE FROM logbook WHERE id = ?`,
            bind: [id]
        });
    }
};
