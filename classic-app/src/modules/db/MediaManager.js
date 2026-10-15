export const MediaManager = {
    dbName: 'UkiBodyBuildMedia',
    storeName: 'media_store',
    db: null,
    urlCache: new Map(), // To prevent recreating object URLs repeatedly

    init: () => {
        return new Promise((resolve, reject) => {
            if (MediaManager.db) return resolve(MediaManager.db);
            const request = indexedDB.open(MediaManager.dbName, 1);
            
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(MediaManager.storeName)) {
                    db.createObjectStore(MediaManager.storeName, { keyPath: 'id' });
                }
            };
            
            request.onsuccess = (e) => {
                MediaManager.db = e.target.result;
                resolve(MediaManager.db);
            };
            
            request.onerror = (e) => {
                console.error("MediaManager IndexedDB Error:", e.target.error);
                reject(e.target.error);
            };
        });
    },

    saveMedia: async (dataDataUrlOrBlob) => {
        await MediaManager.init();
        const uuid = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substr(2);
        const id = 'media://' + uuid;
        
        let blob = dataDataUrlOrBlob;
        
        if (typeof dataDataUrlOrBlob === 'string' && dataDataUrlOrBlob.startsWith('data:')) {
            blob = await (await fetch(dataDataUrlOrBlob)).blob();
        }

        return new Promise((resolve, reject) => {
            const tx = MediaManager.db.transaction(MediaManager.storeName, 'readwrite');
            const store = tx.objectStore(MediaManager.storeName);
            const req = store.put({ id, blob });
            req.onsuccess = () => resolve(id);
            req.onerror = () => reject(req.error);
        });
    },

    getMediaBlob: async (id) => {
        await MediaManager.init();
        return new Promise((resolve, reject) => {
            const tx = MediaManager.db.transaction(MediaManager.storeName, 'readonly');
            const store = tx.objectStore(MediaManager.storeName);
            const req = store.get(id);
            req.onsuccess = () => {
                if (req.result) resolve(req.result.blob);
                else resolve(null);
            };
            req.onerror = () => reject(req.error);
        });
    },
    
    getMediaUrl: async (idOrBase64) => {
        if (!idOrBase64) return null;
        if (idOrBase64.startsWith('data:')) return idOrBase64; // Fallback for old data
        
        if (MediaManager.urlCache.has(idOrBase64)) {
            return MediaManager.urlCache.get(idOrBase64);
        }

        const blob = await MediaManager.getMediaBlob(idOrBase64);
        if (blob) {
            const url = URL.createObjectURL(blob);
            MediaManager.urlCache.set(idOrBase64, url);
            return url;
        }
        return null;
    },

    getBase64: async (idOrBase64) => {
        if (!idOrBase64) return null;
        if (idOrBase64.startsWith('data:')) return idOrBase64;
        
        const blob = await MediaManager.getMediaBlob(idOrBase64);
        if (!blob) return null;

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    },

    deleteMedia: async (id) => {
        if (!id || !id.startsWith('media://')) return;
        await MediaManager.init();
        return new Promise((resolve, reject) => {
            const tx = MediaManager.db.transaction(MediaManager.storeName, 'readwrite');
            const store = tx.objectStore(MediaManager.storeName);
            const req = store.delete(id);
            req.onsuccess = () => {
                if (MediaManager.urlCache.has(id)) {
                    URL.revokeObjectURL(MediaManager.urlCache.get(id));
                    MediaManager.urlCache.delete(id);
                }
                resolve();
            };
            req.onerror = () => reject(req.error);
        });
    }
};
window.MediaManager = MediaManager;
