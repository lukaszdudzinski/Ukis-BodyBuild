const fs = require('fs');
let content = fs.readFileSync('src/modules/db/DatabaseManager.js', 'utf8');

// Insert migration code before init: () => {
content = content.replace(/init: async \(\) => \{/,
`runMediaMigrationAndCleanup: async () => {
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
            cutoffDate.setDate(cutoffDate.getDate() - 3);
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

    init: async () => {`);

// Add call to runMediaMigrationAndCleanup inside init() after migrations
content = content.replace(/for \(let m of migrations\) \{[\s\S]*?\} catch \(err\) \{[\s\S]*?\}\s*\}/, (match) => {
    return match + `\n\n        // Run migration and cleanup\n        DatabaseManager.runMediaMigrationAndCleanup().catch(e => console.error(e));`;
});

fs.writeFileSync('src/modules/db/DatabaseManager.js', content);
