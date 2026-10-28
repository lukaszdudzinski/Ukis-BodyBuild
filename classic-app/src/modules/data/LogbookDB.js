import { DatabaseManager } from '../db/DatabaseManager.js';

export const LogbookDB = {
    async init() {
        await DatabaseManager.init();
        console.log("LogbookDB initialized (SQLite Wasm Mode).");
    },
    
    async getAllLogs() {
        try {
            return await DatabaseManager.getLogs();
        } catch (e) {
            console.error("Failed to fetch logs from SQLite", e);
            return [];
        }
    },
    
    async addLog(logData) {
        try {
            return await DatabaseManager.addLog(logData);
        } catch (e) {
            console.error("Failed to add log to SQLite", e);
            throw e;
        }
    },

    async deleteLog(id) {
        try {
            await DatabaseManager.deleteLog(id);
        } catch (e) {
            console.error("Failed to delete log from SQLite", e);
            throw e;
        }
    }
};
