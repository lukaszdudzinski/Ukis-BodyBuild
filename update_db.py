import os

# 1. Update DatabaseManager.js
with open('src/modules/db/DatabaseManager.js', 'r', encoding='utf-8') as f:
    db_content = f.read()

# Add trainings table creation
db_content = db_content.replace(
    '// Here we can add trainings and diet tables later',
    '''
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
    '''
)

# Add addTraining and getTrainings methods
methods = '''
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
'''

db_content = db_content.replace('};', methods)

with open('src/modules/db/DatabaseManager.js', 'w', encoding='utf-8') as f:
    f.write(db_content)

print("Updated DatabaseManager.js")
