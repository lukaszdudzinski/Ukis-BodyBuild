import sqlite3InitModule from '../../../libs/sqlite/sqlite3.mjs';

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
                        db = new sqlite3.oo1.DB('local', 'c', 'kvvfs');
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
                name TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        // Ensure name column exists (for backward compatibility if table was created before)
        try {
            db.exec(`ALTER TABLE trainings ADD COLUMN name TEXT;`);
        } catch(e) {
            // Ignore error if column already exists
        }

        try {
            db.exec(`ALTER TABLE measurements ADD COLUMN height REAL;`);
        } catch(e) {
            // Ignore error if column already exists
        }

        try {
            db.exec(`ALTER TABLE measurements ADD COLUMN neck REAL;`);
        } catch(e) {
            // Ignore error if column already exists
        }

        // Dieta (Diet Logs)
        db.exec(`
            CREATE TABLE IF NOT EXISTS diet_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                meal_type TEXT NOT NULL,
                food_name TEXT NOT NULL,
                calories INTEGER DEFAULT 0,
                protein INTEGER DEFAULT 0,
                carbs INTEGER DEFAULT 0,
                fat INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
    },

    addMeasurement: async (data) => {
        await DatabaseManager.init();
        
        db.exec({
            sql: `INSERT INTO measurements (date, weight, chest, waist, hips, thigh, biceps, photo, height, neck) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            bind: [
                data.date, 
                data.weight, 
                data.chest || null, 
                data.waist || null, 
                data.hips || null, 
                data.thigh || null, 
                data.biceps || null, 
                data.photo || null,
                data.height || null,
                data.neck || null
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
    
    addTraining: async (data) => {
        await DatabaseManager.init();
        
        db.exec({
            sql: `INSERT INTO trainings (date, duration_seconds, exercises_json, name) VALUES (?, ?, ?, ?)`,
            bind: [
                data.date, 
                data.duration_seconds, 
                JSON.stringify(data.exercises),
                data.name || ''
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

    updateTraining: async (data) => {
        await DatabaseManager.init();
        
        db.exec({
            sql: `UPDATE trainings SET duration_seconds = ?, exercises_json = ?, name = ? WHERE id = ?`,
            bind: [
                data.duration_seconds, 
                JSON.stringify(data.exercises),
                data.name || '',
                data.id
            ]
        });
        
        return data;
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
    },

    addDietLog: async (data) => {
        await DatabaseManager.init();
        
        db.exec({
            sql: `INSERT INTO diet_logs (date, meal_type, food_name, calories, protein, carbs, fat) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            bind: [
                data.date, 
                data.meal_type, 
                data.food_name, 
                data.calories || 0, 
                data.protein || 0, 
                data.carbs || 0, 
                data.fat || 0
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

    getDietLogs: async (date = null) => {
        await DatabaseManager.init();
        const records = [];
        let query = `SELECT * FROM diet_logs ORDER BY date DESC, created_at DESC`;
        let bindParams = [];
        
        if (date) {
            query = `SELECT * FROM diet_logs WHERE date = ? ORDER BY created_at DESC`;
            bindParams = [date];
        }

        db.exec({
            sql: query,
            bind: bindParams,
            rowMode: 'object',
            callback: function (row) {
                records.push(row);
            }
        });
        return records;
    },

    deleteDietLog: async (id) => {
        await DatabaseManager.init();
        db.exec({
            sql: `DELETE FROM diet_logs WHERE id = ?`,
            bind: [id]
        });
    },

    exportDatabase: async () => {
        await DatabaseManager.init();
        const measurements = await DatabaseManager.getMeasurements();
        const trainings = await DatabaseManager.getTrainings();
        return JSON.stringify({
            measurements: measurements,
            trainings: trainings,
            version: '1.0'
        });
    },

    importDatabase: async (jsonString) => {
        await DatabaseManager.init();
        try {
            const data = JSON.parse(jsonString);
            
            // Basic validation
            if (!data.measurements || !data.trainings) {
                throw new Error("Nieprawidłowy format pliku JSON.");
            }

            // Clear tables
            db.exec(`DELETE FROM measurements`);
            db.exec(`DELETE FROM trainings`);

            // Import Measurements
            data.measurements.forEach(m => {
                db.exec({
                    sql: `INSERT INTO measurements (id, date, weight, chest, waist, hips, thigh, biceps, photo, created_at, height, neck) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    bind: [m.id, m.date, m.weight, m.chest, m.waist, m.hips, m.thigh, m.biceps, m.photo, m.created_at, m.height || null, m.neck || null]
                });
            });

            // Import Trainings
            data.trainings.forEach(t => {
                db.exec({
                    sql: `INSERT INTO trainings (id, date, duration_seconds, exercises_json, name, created_at) 
                          VALUES (?, ?, ?, ?, ?, ?)`,
                    bind: [t.id, t.date, t.duration_seconds, JSON.stringify(t.exercises), t.name || '', t.created_at]
                });
            });

            return true;
        } catch (e) {
            console.error("Błąd podczas importu bazy:", e);
            return false;
        }
    }
};
