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
                DatabaseManager.db = db;
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
        
        try {
            db.exec(`ALTER TABLE trainings ADD COLUMN name TEXT;`);
        } catch(e) {}

        try {
            db.exec(`ALTER TABLE trainings ADD COLUMN type TEXT;`);
        } catch(e) {}

        try {
            db.exec(`ALTER TABLE trainings ADD COLUMN social_photos_json TEXT;`);
        } catch(e) {}

        try {
            db.exec(`ALTER TABLE trainings ADD COLUMN smartwatch_json TEXT;`);
        } catch(e) {}

        try {
            db.exec(`ALTER TABLE measurements ADD COLUMN height REAL;`);
        } catch(e) {}

        try {
            db.exec(`ALTER TABLE measurements ADD COLUMN neck REAL;`);
        } catch(e) {}

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

        // AI Analyses History
        db.exec(`
            CREATE TABLE IF NOT EXISTS ai_analyses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                type TEXT NOT NULL,
                content TEXT NOT NULL,
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
            sql: `INSERT INTO trainings (date, duration_seconds, exercises_json, name, type, social_photos_json, smartwatch_json) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            bind: [
                data.date, 
                isNaN(data.duration_seconds) ? 0 : data.duration_seconds, 
                JSON.stringify(data.exercises),
                data.name || '',
                data.type || 'strength',
                data.socialPhotos ? JSON.stringify(data.socialPhotos) : null,
                data.smartwatch ? JSON.stringify(data.smartwatch) : null
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
            sql: `UPDATE trainings SET duration_seconds = ?, exercises_json = ?, name = ?, type = ?, social_photos_json = ?, smartwatch_json = ? WHERE id = ?`,
            bind: [
                isNaN(data.duration_seconds) ? 0 : data.duration_seconds, 
                JSON.stringify(data.exercises),
                data.name || '',
                data.type || 'strength',
                data.socialPhotos ? JSON.stringify(data.socialPhotos) : null,
                data.smartwatch ? JSON.stringify(data.smartwatch) : null,
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
                    exercises: JSON.parse(row.exercises_json),
                    socialPhotos: row.social_photos_json ? JSON.parse(row.social_photos_json) : [],
                    smartwatch: row.smartwatch_json ? JSON.parse(row.smartwatch_json) : { calories: null, hr: null }
                });
            }
        });
        return records;
    },

    deleteTraining: async (id) => {
        await DatabaseManager.init();
        db.exec({
            sql: `DELETE FROM trainings WHERE id = ?`,
            bind: [id]
        });
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

    getDietLogsHistory: async (days = 30) => {
        await DatabaseManager.init();
        const records = [];
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoffStr = cutoffDate.toISOString().split('T')[0];

        db.exec({
            sql: `SELECT date, SUM(calories) as total_calories FROM diet_logs WHERE date >= ? GROUP BY date ORDER BY date ASC`,
            bind: [cutoffStr],
            rowMode: 'object',
            callback: function (row) {
                records.push(row);
            }
        });
        return records;
    },

    exportDatabase: async () => {
        await DatabaseManager.init();
        const measurements = await DatabaseManager.getMeasurements();
        const trainings = await DatabaseManager.getTrainings();
        
        let dietLogs = [];
        try {
            db.exec({
                sql: "SELECT * FROM diet_logs ORDER BY date DESC, created_at DESC",
                rowMode: "object",
                callback: function (row) { dietLogs.push(row); }
            });
        } catch(e) {}
        
        let aiAnalyses = [];
        try {
            db.exec({
                sql: "SELECT * FROM ai_analyses ORDER BY created_at DESC",
                rowMode: "object",
                callback: function (row) { aiAnalyses.push(row); }
            });
        } catch(e) {}

        const settings = {
            nickname: localStorage.getItem("uki-nickname"),
            avatar: localStorage.getItem("uki-avatar"),
            templates: localStorage.getItem("uki_workout_templates")
        };

        return JSON.stringify({
            measurements: measurements,
            trainings: trainings,
            dietLogs: dietLogs,
            aiAnalyses: aiAnalyses,
            settings: settings,
            version: "1.1"
        });
    },

    importDatabase: async (jsonString) => {
        await DatabaseManager.init();
        try {
            const data = JSON.parse(jsonString);
            
            if (!data.measurements || !data.trainings) {
                throw new Error("Nieprawidłowy format pliku JSON.");
            }

            db.exec(`DELETE FROM measurements`);
            db.exec(`DELETE FROM trainings`);
            
            try { db.exec(`DELETE FROM diet_logs`); } catch(e) {}
            try { db.exec(`DELETE FROM ai_analyses`); } catch(e) {}

            data.measurements.forEach(m => {
                db.exec({
                    sql: `INSERT INTO measurements (id, date, weight, chest, waist, hips, thigh, biceps, photo, created_at, height, neck) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    bind: [m.id, m.date, m.weight, m.chest, m.waist, m.hips, m.thigh, m.biceps, m.photo, m.created_at, m.height || null, m.neck || null]
                });
            });

            data.trainings.forEach(t => {
                db.exec({
                    sql: `INSERT INTO trainings (id, date, duration_seconds, exercises, name) VALUES (?, ?, ?, ?, ?)`,
                    bind: [t.id, t.date, t.duration_seconds, JSON.stringify(t.exercises), t.name || null]
                });
            });
            
            if (data.dietLogs) {
                data.dietLogs.forEach(d => {
                    db.exec({
                        sql: `INSERT INTO diet_logs (id, date, image_data, analysis_result, created_at) VALUES (?, ?, ?, ?, ?)`,
                        bind: [d.id, d.date, d.image_data, d.analysis_result, d.created_at]
                    });
                });
            }
            
            if (data.aiAnalyses) {
                data.aiAnalyses.forEach(a => {
                    db.exec({
                        sql: `INSERT INTO ai_analyses (id, date, type, content, created_at) VALUES (?, ?, ?, ?, ?)`,
                        bind: [a.id, a.date, a.type, a.content, a.created_at]
                    });
                });
            }
            
            if (data.settings) {
                if (data.settings.nickname) localStorage.setItem("uki-nickname", data.settings.nickname);
                if (data.settings.avatar) localStorage.setItem("uki-avatar", data.settings.avatar);
                if (data.settings.templates) localStorage.setItem("uki_workout_templates", data.settings.templates);
            }

            return true;
        } catch (e) {
            console.error("Błąd podczas importu bazy:", e);
            return false;
        }
    },

    getDietLogsByDateRange: async (startDate, endDate) => {
        await DatabaseManager.init();
        let query = `SELECT * FROM diet_logs WHERE date >= ? AND date <= ? ORDER BY date DESC, created_at DESC`;
        const records = [];
        db.exec({
            sql: query,
            bind: [startDate, endDate],
            rowMode: 'object',
            callback: function (row) {
                records.push(row);
            }
        });
        return records;
    },

    // --- AI Analyses ---
    saveAiAnalysis: async (type, content) => {
        await DatabaseManager.init();
        const dateStr = new Date().toISOString().split('T')[0];
        db.exec({
            sql: `INSERT INTO ai_analyses (date, type, content) VALUES (?, ?, ?)`,
            bind: [dateStr, type, content]
        });
        const timestamp = new Date().getTime();
        localStorage.setItem('uki_last_ai_analysis', timestamp.toString());
    },

    getAiAnalyses: async () => {
        await DatabaseManager.init();
        const records = [];
        db.exec({
            sql: `SELECT * FROM ai_analyses ORDER BY created_at DESC`,
            rowMode: 'object',
            callback: function (row) {
                records.push(row);
            }
        });
        return records;
    },

    deleteAiAnalysis: async (id) => {
        await DatabaseManager.init();
        db.exec({
            sql: `DELETE FROM ai_analyses WHERE id = ?`,
            bind: [id]
        });
    }
};

window.DatabaseManager = DatabaseManager;
