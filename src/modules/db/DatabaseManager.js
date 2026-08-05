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
                    db = new sqlite3.oo1.OpfsDb('/ukis_bodybuild.sqlite3');
                    console.log('The OPFS is available. Opened OPFS database.');
                } else {
                    console.warn('OPFS is not available. Falling back to kvvfs or memory.');
                    try {
                        db = new sqlite3.oo1.DB('/ukis_bodybuild.sqlite3', 'c', 'kvvfs');
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
        
        // Pomiary Ciała (Measurements)
        db.exec(`
            CREATE TABLE IF NOT EXISTS measurements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                weight REAL NOT NULL,
                chest REAL,
                waist REAL,
                hips REAL,
                thigh REAL,
                biceps REAL,
                photo TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        
        // Treningi (Trainings)
        db.exec(`
            CREATE TABLE IF NOT EXISTS trainings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                duration_seconds INTEGER NOT NULL,
                exercises_json TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
    
    },

    addMeasurement: async (data) => {
        await DatabaseManager.init();
        
        db.exec({
            sql: `INSERT INTO measurements (date, weight, chest, waist, hips, thigh, biceps, photo) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            bind: [
                data.date, 
                data.weight, 
                data.chest || null, 
                data.waist || null, 
                data.hips || null, 
                data.thigh || null, 
                data.biceps || null, 
                data.photo || null
            ]
        });
        
        let newId = null;
        db.exec({
            sql: `SELECT last_insert_rowid() as id`,
            rowMode: 'object',
            callback: function (row) {
                newId = row.id;
            }
        });
        
        return { ...data, id: newId 
    addTraining: async (data) => {
        await DatabaseManager.init();
        
        db.exec({
            sql: `INSERT INTO trainings (date, duration_seconds, exercises_json) VALUES (?, ?, ?)`,
            bind: [
                data.date, 
                data.duration_seconds, 
                JSON.stringify(data.exercises)
            ]
        });
        
        let newId = null;
        db.exec({
            sql: `SELECT last_insert_rowid() as id`,
            rowMode: 'object',
            callback: function (row) {
                newId = row.id;
            }
        });
        
        return { ...data, id: newId };
    },

    getTrainings: async () => {
        await DatabaseManager.init();
        const records = [];
        db.exec({
            sql: `SELECT * FROM trainings ORDER BY date DESC, created_at DESC`,
            rowMode: 'object',
            callback: function (row) {
                records.push({
                    ...row,
                    exercises: JSON.parse(row.exercises_json)
                });
            }
        });
        return records;
    }
};

    },

    getMeasurements: async () => {
        await DatabaseManager.init();
        const records = [];
        db.exec({
            sql: `SELECT * FROM measurements ORDER BY date DESC, created_at DESC`,
            rowMode: 'object',
            callback: function (row) {
                records.push(row);
            }
        });
        return records;
    },

    deleteMeasurement: async (id) => {
        await DatabaseManager.init();
        db.exec({
            sql: `DELETE FROM measurements WHERE id = ?`,
            bind: [id]
        });
    }

    addTraining: async (data) => {
        await DatabaseManager.init();
        
        db.exec({
            sql: `INSERT INTO trainings (date, duration_seconds, exercises_json) VALUES (?, ?, ?)`,
            bind: [
                data.date, 
                data.duration_seconds, 
                JSON.stringify(data.exercises)
            ]
        });
        
        let newId = null;
        db.exec({
            sql: `SELECT last_insert_rowid() as id`,
            rowMode: 'object',
            callback: function (row) {
                newId = row.id;
            }
        });
        
        return { ...data, id: newId };
    },

    getTrainings: async () => {
        await DatabaseManager.init();
        const records = [];
        db.exec({
            sql: `SELECT * FROM trainings ORDER BY date DESC, created_at DESC`,
            rowMode: 'object',
            callback: function (row) {
                records.push({
                    ...row,
                    exercises: JSON.parse(row.exercises_json)
                });
            }
        });
        return records;
    }
};

