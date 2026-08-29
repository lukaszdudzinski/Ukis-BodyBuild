import { DatabaseManager } from '../src/modules/db/DatabaseManager.js';

async function test() {
    await DatabaseManager.init();
    await DatabaseManager.addDietLog({
        date: '2026-08-29',
        meal_type: 'Śniadanie',
        food_name: 'Jajecznica z 5 jaj',
        calories: 500
    });
    
    await DatabaseManager.addDietLog({
        date: '2026-08-29',
        meal_type: 'Obiad',
        food_name: 'Kurczak z ryżem',
        calories: 600,
        thumbnail: 'media_123'
    });
    
    const logs = await DatabaseManager.getDietLogs('2026-08-29');
    console.log("Logs count:", logs.length);
    console.log(logs);
}
test();
