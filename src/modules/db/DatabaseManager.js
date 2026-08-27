let worker = null;
let isReady = false;
let initPromise = null;
let msgId = 0;
const resolvers = {};

function sendMessage(action, payload = {}) {
    return new Promise((resolve, reject) => {
        const id = ++msgId;
        resolvers[id] = { resolve, reject };
        worker.postMessage({ id, action, payload });
    });
}

export const DatabaseManager = {
    runMediaMigrationAndCleanup: async () => {
        try {
            const isMigrated = localStorage.getItem('uki-bodybuild-media-migrated-v2');
            if (!isMigrated) {
                console.log("Starting DB Media Migration...");
                const { MediaManager } = await import('./MediaManager.js');
                
                // 1. Measurements
                const measResp = await sendMessage('exec', { sql: "SELECT id, photo FROM measurements WHERE photo LIKE 'data:image%'", rowMode: 'object' });
                if (measResp.result && measResp.result.length > 0) {
                    for (let m of measResp.result) {
                        try {
                            const id = await MediaManager.saveMedia(m.photo);
                            await sendMessage('exec', { sql: "UPDATE measurements SET photo = ? WHERE id = ?", bind: [id, m.id] });
                        } catch(e) { console.error(e); }
                    }
                }
                
                // 2. Diet Logs
                const dietResp = await sendMessage('exec', { sql: "SELECT id, thumbnail FROM diet_logs WHERE thumbnail LIKE 'data:image%'", rowMode: 'object' });
                if (dietResp.result && dietResp.result.length > 0) {
                    for (let d of dietResp.result) {
                        try {
                            const id = await MediaManager.saveMedia(d.thumbnail);
                            await sendMessage('exec', { sql: "UPDATE diet_logs SET thumbnail = ? WHERE id = ?", bind: [id, d.id] });
                        } catch(e) { console.error(e); }
                    }
                }
                
                // 3. Trainings (social photos)
                const trainResp = await sendMessage('exec', { sql: "SELECT id, social_photos_json FROM trainings WHERE social_photos_json LIKE '%data:image%'", rowMode: 'object' });
                if (trainResp.result && trainResp.result.length > 0) {
                    for (let t of trainResp.result) {
                        try {
                            let photos = JSON.parse(t.social_photos_json);
                            let newPhotos = [];
                            for (let p of photos) {
                                if (p.startsWith('data:image')) {
                                    const id = await MediaManager.saveMedia(p);
                                    newPhotos.push(id);
                                } else {
                                    newPhotos.push(p);
                                }
                            }
                            await sendMessage('exec', { sql: "UPDATE trainings SET social_photos_json = ? WHERE id = ?", bind: [JSON.stringify(newPhotos), t.id] });
                        } catch(e) { console.error(e); }
                    }
                }

                // Vacuum to reclaim space!
                try {
                    await sendMessage('exec', { sql: "VACUUM" });
                    console.log("Database vacuumed successfully.");
                } catch(e) { console.error("Vacuum failed (maybe not enough space), but migration done.", e); }

                localStorage.setItem('uki-bodybuild-media-migrated-v2', 'true');
            }

            // --- DATA RETENTION: Delete old diet log thumbnails (older than 3 days) ---
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 1);
            const cutoffStr = cutoffDate.toISOString().split('T')[0];
            
            const oldDietResp = await sendMessage('exec', { 
                sql: "SELECT id, thumbnail FROM diet_logs WHERE date < ? AND thumbnail IS NOT NULL AND thumbnail != ''", 
                bind: [cutoffStr], 
                rowMode: 'object' 
            });
            
            if (oldDietResp.result && oldDietResp.result.length > 0) {
                const { MediaManager } = await import('./MediaManager.js');
                for (let d of oldDietResp.result) {
                    if (d.thumbnail.startsWith('media://')) {
                        MediaManager.deleteMedia(d.thumbnail);
                    }
                    await sendMessage('exec', { sql: "UPDATE diet_logs SET thumbnail = NULL WHERE id = ?", bind: [d.id] });
                }
            }

        } catch(err) {
            console.error("Migration error", err);
        }
    },

    init: async () => {
        if (isReady) return true;
        if (initPromise) return initPromise;

        initPromise = new Promise(async (resolve, reject) => {
            try {
                if (!worker) {
                    worker = new Worker(new URL('./dbWorker.js?v=15', import.meta.url));
                    worker.onmessage = (e) => {
                        const { id, success, result, lastInsertId, error } = e.data;
                        if (resolvers[id]) {
                            if (success) {
                                resolvers[id].resolve({ result, lastInsertId });
                            } else {
                                resolvers[id].reject(new Error(error));
                            }
                            delete resolvers[id];
                        }
                    };
                }
                
                await sendMessage('init');
                
                // Po inicjalizacji uruchamiamy ewentualną migrację (tylko raz)
                await DatabaseManager.migrateFromKvvfsIfNeeded().catch(e => console.warn("Migracja KVvfs pominięta:", e));
                
                await DatabaseManager.createTables();
                DatabaseManager.runMediaMigrationAndCleanup().catch(e => console.error(e));
                isReady = true;
                resolve(true);
            } catch (err) {
                console.error('Failed to initialize SQLite Worker:', err);
                reject(err);
            }
        });
        return initPromise;
    },

    migrateFromKvvfsIfNeeded: async () => {
        if (localStorage.getItem('uki_kvvfs_migrated')) return;
        
        try {
            console.log("Checking for legacy KVvfs data...");
            const sqlite3InitModule = (await import('../../../libs/sqlite/sqlite3.mjs')).default;
            const sqlite3 = await sqlite3InitModule({ print: console.log, printErr: console.error });
            
            const db = new sqlite3.oo1.DB('local', 'c', 'kvvfs');
            
            const res = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='trainings'", {rowMode: 'array'});
            if (res && res.length > 0) {
                console.log("Found legacy KVvfs database! Migrating to OPFS...");
                const byteArray = sqlite3.capi.sqlite3_js_db_export(db.pointer);
                if (byteArray && byteArray.byteLength > 0) {
                    await sendMessage('import_raw', { buffer: byteArray.buffer });
                    console.log("Migration successful!");
                }
            } else {
                console.log("No legacy KVvfs data found.");
            }
            db.close();
            localStorage.setItem('uki_kvvfs_migrated', 'true');
        } catch (e) {
            console.warn("Migration from KVvfs failed or not applicable:", e);
            localStorage.setItem('uki_kvvfs_migrated', 'failed');
        }
    },

    createTables: async () => {
        const queries = [
            { sql: `CREATE TABLE IF NOT EXISTS measurements (
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
            );` },
            { sql: `CREATE TABLE IF NOT EXISTS trainings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                duration_seconds INTEGER NOT NULL,
                exercises_json TEXT NOT NULL,
                name TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );` },
            { sql: `CREATE TABLE IF NOT EXISTS diet_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                meal_type TEXT NOT NULL,
                food_name TEXT NOT NULL,
                calories INTEGER DEFAULT 0,
                protein INTEGER DEFAULT 0,
                carbs INTEGER DEFAULT 0,
                fat INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );` },
            { sql: `CREATE TABLE IF NOT EXISTS ai_analyses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                type TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );` }
        ];

        await sendMessage('exec_multiple', { queries });

        const migrations = [
            `ALTER TABLE trainings ADD COLUMN name TEXT;`,
            `ALTER TABLE trainings ADD COLUMN type TEXT;`,
            `ALTER TABLE trainings ADD COLUMN social_photos_json TEXT;`,
            `ALTER TABLE trainings ADD COLUMN smartwatch_json TEXT;`,
            `ALTER TABLE measurements ADD COLUMN height REAL;`,
            `ALTER TABLE measurements ADD COLUMN neck REAL;`,
            `ALTER TABLE diet_logs ADD COLUMN thumbnail TEXT;`
        ];

        for (let m of migrations) {
            try {
                await sendMessage('exec', { sql: m });
            } catch (e) {
                // column might already exist
            }
        }
    },

    addMeasurement: async (data) => {
        await DatabaseManager.init();
        const response = await sendMessage('exec', {
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
            ],
            needLastInsertId: true
        });
        return { ...data, id: response.lastInsertId };
    },
    
    addTraining: async (data) => {
        await DatabaseManager.init();
        const response = await sendMessage('exec', {
            sql: `INSERT INTO trainings (date, duration_seconds, exercises_json, name, type, social_photos_json, smartwatch_json) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            bind: [
                data.date, 
                isNaN(data.duration_seconds) ? 0 : data.duration_seconds, 
                JSON.stringify(data.exercises),
                data.name || '',
                data.type || 'strength',
                data.socialPhotos ? JSON.stringify(data.socialPhotos) : null,
                data.smartwatch ? JSON.stringify(data.smartwatch) : null
            ],
            needLastInsertId: true
        });
        return { ...data, id: response.lastInsertId };
    },

    updateTraining: async (data) => {
        await DatabaseManager.init();
        await sendMessage('exec', {
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
        const response = await sendMessage('exec', {
            sql: `SELECT * FROM trainings ORDER BY date DESC, created_at DESC`,
            rowMode: 'object'
        });
        return response.result.map(row => ({
            ...row,
            exercises: JSON.parse(row.exercises_json),
            socialPhotos: row.social_photos_json ? JSON.parse(row.social_photos_json) : [],
            smartwatch: row.smartwatch_json ? JSON.parse(row.smartwatch_json) : { calories: null, hr: null }
        }));
    },

    deleteTraining: async (id) => {
        await DatabaseManager.init();
        await sendMessage('exec', {
            sql: `DELETE FROM trainings WHERE id = ?`,
            bind: [id]
        });
    },

    migrateExercises: async () => {
        const migratedFlag = localStorage.getItem('uki_exercises_migrated');
        if (migratedFlag) return;

        const mapping = {
            "Klatka płaska": "Klatka - Wyciskanie sztangi - Ławka płaska",
            "Wyciskanie leżąc": "Klatka - Wyciskanie sztangi - Ławka płaska",
            "Wyciskanie hantli skos": "Klatka - Wyciskanie hantli - Skos dodatni",
            "Rozpiętki": "Klatka - Rozpiętki - Hantle (ławka płaska)",
            "Dipsy": "Klatka - Pompki na poręczach (Dipsy) - Wersja na klatkę",
            "Martwy ciąg": "Plecy - Martwy ciąg - Klasyczny",
            "Podciąganie": "Plecy - Podciąganie na drążku - Nachwyt szeroki",
            "Wiosłowanie sztangą": "Plecy - Wiosłowanie sztangą - Opad tułowia",
            "Ściąganie drążka": "Plecy - Ściąganie drążka wyciągu górnego - Szeroko",
            "Przysiad": "Nogi - Przysiad ze sztangą - Tył (Back Squat)",
            "Przysiady": "Nogi - Przysiad ze sztangą - Tył (Back Squat)",
            "Suwnica": "Nogi - Suwnica - Wypychanie (szerokie ustawienie stóp)",
            "Hip thrust": "Pośladki - Hip Thrust - Ze sztangą",
            "Wykroki": "Nogi - Wykroki - Z hantlami",
            "Wyciskanie żołnierskie": "Barki - Wyciskanie sztangi (Żołnierskie) - Stojąc",
            "Wznosy bokiem": "Barki - Wznosy hantli bokiem - Stojąc",
            "Face pulls": "Barki - Face Pulls - Wyciąg górny z liną",
            "Uginanie sztangi": "Biceps - Uginanie ramion - Sztanga prosta",
            "Uginanie hantli": "Biceps - Uginanie ramion - Hantle",
            "Francuz": "Triceps - Wyciskanie francuskie - Sztanga łamana (leżąc)",
            "Prostowanie na wyciągu": "Triceps - Prostowanie ramion na wyciągu - Uchwyt prosty"
        };

        try {
            const trainings = await DatabaseManager.getTrainings();
            let count = 0;
            for (let t of trainings) {
                let changed = false;
                if (t.exercises && t.exercises.length > 0) {
                    t.exercises.forEach(ex => {
                        if (ex.name) {
                            const trimmedName = ex.name.trim();
                            const oldNameKey = Object.keys(mapping).find(key => key.toLowerCase() === trimmedName.toLowerCase());
                            if (oldNameKey) {
                                ex.name = mapping[oldNameKey];
                                changed = true;
                            }
                        }
                    });
                }
                if (changed) {
                    await DatabaseManager.updateTraining(t);
                    count++;
                }
            }
            console.log(`Migrated ${count} trainings to new exercise names.`);
            localStorage.setItem('uki_exercises_migrated', 'true');
        } catch (err) {
            console.error('Migration failed:', err);
        }
    },

    getMeasurements: async () => {
        await DatabaseManager.init();
        const response = await sendMessage('exec', {
            sql: `SELECT * FROM measurements ORDER BY date DESC, created_at DESC`,
            rowMode: 'object'
        });
        return response.result;
    },

    deleteMeasurement: async (id) => {
        await DatabaseManager.init();
        await sendMessage('exec', {
            sql: `DELETE FROM measurements WHERE id = ?`,
            bind: [id]
        });
    },

    addDietLog: async (data) => {
        await DatabaseManager.init();
        const response = await sendMessage('exec', {
            sql: `INSERT INTO diet_logs (date, meal_type, food_name, calories, protein, carbs, fat, thumbnail) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            bind: [
                data.date, 
                data.meal_type, 
                data.food_name, 
                data.calories || 0, 
                data.protein || 0, 
                data.carbs || 0, 
                data.fat || 0,
                data.thumbnail || null
            ],
            needLastInsertId: true
        });
        return { ...data, id: response.lastInsertId };
    },

    getDietLogs: async (date = null) => {
        await DatabaseManager.init();
        let query = `SELECT * FROM diet_logs ORDER BY date DESC, created_at DESC`;
        let bindParams = [];
        
        if (date) {
            query = `SELECT * FROM diet_logs WHERE date = ? ORDER BY created_at DESC`;
            bindParams = [date];
        }

        const response = await sendMessage('exec', {
            sql: query,
            bind: bindParams,
            rowMode: 'object'
        });
        return response.result;
    },

    deleteDietLog: async (id) => {
        await DatabaseManager.init();
        await sendMessage('exec', {
            sql: `DELETE FROM diet_logs WHERE id = ?`,
            bind: [id]
        });
    },

    getDietLogsHistory: async (days = 30) => {
        await DatabaseManager.init();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoffStr = cutoffDate.toISOString().split('T')[0];

        const response = await sendMessage('exec', {
            sql: `SELECT date, SUM(calories) as total_calories FROM diet_logs WHERE date >= ? GROUP BY date ORDER BY date ASC`,
            bind: [cutoffStr],
            rowMode: 'object'
        });
        return response.result;
    },

    exportDatabase: async () => {
        await DatabaseManager.init();
        const measurements = await DatabaseManager.getMeasurements();
        const trainings = await DatabaseManager.getTrainings();
        
        let dietLogs = [];
        try {
            const resp = await sendMessage('exec', { sql: "SELECT * FROM diet_logs ORDER BY date DESC, created_at DESC", rowMode: 'object' });
            dietLogs = resp.result;
        } catch(e) {}
        
        let aiAnalyses = [];
        try {
            const resp = await sendMessage('exec', { sql: "SELECT * FROM ai_analyses ORDER BY created_at DESC", rowMode: 'object' });
            aiAnalyses = resp.result;
        } catch(e) {}

        const settings = {
            nickname: localStorage.getItem("uki-nickname") || localStorage.getItem("userNick") || "",
            avatar: localStorage.getItem("uki-avatar") || "",
            templates: localStorage.getItem("uki_workout_templates") || "[]",
            trainingExperience: localStorage.getItem("trainingExperience") || "",
            dietGoal: localStorage.getItem("dietGoal") || "",
            dietWorkerUrl: localStorage.getItem("dietWorkerUrl") || "",
            schedules: localStorage.getItem("uki_workout_schedules") || "[]",
            customWallpaper: localStorage.getItem("uki-custom-wallpaper") || ""
        };

        return JSON.stringify({
            app: "Uki's BodyBuild",
            exportDate: new Date().toISOString(),
            measurements: measurements || [],
            trainings: trainings || [],
            dietLogs: dietLogs || [],
            aiAnalyses: aiAnalyses || [],
            settings: settings,
            version: "2.0"
        }, null, 2);
    },

    importDatabase: async (jsonString) => {
        await DatabaseManager.init();
        try {
            const data = JSON.parse(jsonString);
            
            if (!data.measurements || !data.trainings) {
                throw new Error("Nieprawidłowy format pliku archiwum bazy.");
            }

            const queries = [];
            queries.push({ sql: `DELETE FROM measurements` });
            queries.push({ sql: `DELETE FROM trainings` });
            queries.push({ sql: `DELETE FROM diet_logs` });
            queries.push({ sql: `DELETE FROM ai_analyses` });

            (data.measurements || []).forEach(m => {
                queries.push({
                    sql: `INSERT INTO measurements (id, date, weight, chest, waist, hips, thigh, biceps, photo, created_at, height, neck) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    bind: [m.id, m.date, m.weight, m.chest, m.waist, m.hips, m.thigh, m.biceps, m.photo, m.created_at, m.height || null, m.neck || null]
                });
            });

            (data.trainings || []).forEach(t => {
                queries.push({
                    sql: `INSERT INTO trainings (id, date, duration_seconds, exercises_json, name, type, social_photos_json, smartwatch_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    bind: [
                        t.id, 
                        t.date, 
                        t.duration_seconds, 
                        typeof t.exercises === 'string' ? t.exercises : JSON.stringify(t.exercises), 
                        t.name || null,
                        t.type || 'strength',
                        t.socialPhotos ? JSON.stringify(t.socialPhotos) : (t.social_photos_json || null),
                        t.smartwatch ? JSON.stringify(t.smartwatch) : (t.smartwatch_json || null)
                    ]
                });
            });
            
            if (data.dietLogs && Array.isArray(data.dietLogs)) {
                data.dietLogs.forEach(d => {
                    queries.push({
                        sql: `INSERT INTO diet_logs (id, date, meal_type, food_name, calories, protein, carbs, fat, thumbnail, created_at) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        bind: [
                            d.id, 
                            d.date, 
                            d.meal_type || 'Inne', 
                            d.food_name || '', 
                            d.calories || 0, 
                            d.protein || 0, 
                            d.carbs || 0, 
                            d.fat || 0, 
                            d.thumbnail || null,
                            d.created_at || new Date().toISOString()
                        ]
                    });
                });
            }
            
            if (data.aiAnalyses && Array.isArray(data.aiAnalyses)) {
                data.aiAnalyses.forEach(a => {
                    queries.push({
                        sql: `INSERT INTO ai_analyses (id, date, type, content, created_at) VALUES (?, ?, ?, ?, ?)`,
                        bind: [a.id, a.date, a.type, a.content, a.created_at || new Date().toISOString()]
                    });
                });
            }
            
            // Execute all as a transaction in the worker!
            await sendMessage('exec_multiple', { queries });
            
            if (data.settings) {
                if (data.settings.nickname) {
                    localStorage.setItem("uki-nickname", data.settings.nickname);
                    localStorage.setItem("userNick", data.settings.nickname);
                }
                if (data.settings.avatar) localStorage.setItem("uki-avatar", data.settings.avatar);
                if (data.settings.templates) localStorage.setItem("uki_workout_templates", typeof data.settings.templates === 'string' ? data.settings.templates : JSON.stringify(data.settings.templates));
                if (data.settings.trainingExperience) localStorage.setItem("trainingExperience", data.settings.trainingExperience);
                if (data.settings.dietGoal) localStorage.setItem("dietGoal", data.settings.dietGoal);
                if (data.settings.dietWorkerUrl) localStorage.setItem("dietWorkerUrl", data.settings.dietWorkerUrl);
                if (data.settings.schedules) localStorage.setItem("uki_workout_schedules", typeof data.settings.schedules === 'string' ? data.settings.schedules : JSON.stringify(data.settings.schedules));
                if (data.settings.customWallpaper) localStorage.setItem("uki-custom-wallpaper", data.settings.customWallpaper);
            }

            return true;
        } catch (e) {
            console.error("Błąd podczas importu bazy:", e);
            throw e;
        }
    },

    importRawDatabase: async (arrayBuffer) => {
        await DatabaseManager.init();
        await sendMessage('import_raw', { buffer: arrayBuffer });
    },

    getDietLogsByDateRange: async (startDate, endDate) => {
        await DatabaseManager.init();
        let query = `SELECT * FROM diet_logs WHERE date >= ? AND date <= ? ORDER BY date DESC, created_at DESC`;
        const response = await sendMessage('exec', {
            sql: query,
            bind: [startDate, endDate],
            rowMode: 'object'
        });
        return response.result;
    },

    saveAiAnalysis: async (type, content) => {
        await DatabaseManager.init();
        const dateStr = new Date().toISOString().split('T')[0];
        await sendMessage('exec', {
            sql: `INSERT INTO ai_analyses (date, type, content) VALUES (?, ?, ?)`,
            bind: [dateStr, type, content]
        });
        const timestamp = new Date().getTime();
        localStorage.setItem('uki_last_ai_analysis', timestamp.toString());
    },

    getAiAnalyses: async () => {
        await DatabaseManager.init();
        const response = await sendMessage('exec', {
            sql: `SELECT * FROM ai_analyses ORDER BY created_at DESC`,
            rowMode: 'object'
        });
        return response.result;
    },

    deleteAiAnalysis: async (id) => {
        await DatabaseManager.init();
        await sendMessage('exec', {
            sql: `DELETE FROM ai_analyses WHERE id = ?`,
            bind: [id]
        });
    }
};

window.DatabaseManager = DatabaseManager;
