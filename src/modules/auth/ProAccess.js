export const ProAccess = {
    // Hash for 'NUREK2026'
    SHA256_HASH: 'b5fae2dfe71b9b8e8d7e4b7f829a6075a7091d640c4d08d25f5fbbd8e3af4c9d',
    STORAGE_KEY: 'uki-pro-unlocked',
    EXPIRY_DAYS: 30,

    isUnlocked: () => {
        const stored = localStorage.getItem(ProAccess.STORAGE_KEY);
        if (!stored) return false;

        try {
            const data = JSON.parse(stored);
            // Check for valid object structure
            if (data && data.unlocked === true && data.timestamp) {
                const now = Date.now();
                const expiryTime = data.timestamp + (ProAccess.EXPIRY_DAYS * 24 * 60 * 60 * 1000);

                // Debug log
                console.log("ProAccess Check:", { now, expiryTime, valid: now < expiryTime, data });

                if (now > expiryTime) {
                    console.warn("ProAccess: Expired");
                    localStorage.removeItem(ProAccess.STORAGE_KEY);
                    return false;
                }
                return true;
            }
        } catch (e) {
            console.error("ProAccess Error:", e);
            // Fallback: If it's not JSON but exists (legacy 'true'), treat as unlocked but maybe migrate?
            // For now, let's strictly require the JSON format to avoid "ghost" states.
            // if (stored === 'true') return true; 
        }
        return false;
    },

    getExpiryDate: () => {
        const stored = localStorage.getItem(ProAccess.STORAGE_KEY);
        if (!stored) return null;
        try {
            const data = JSON.parse(stored);
            if (data.timestamp) {
                return new Date(data.timestamp + (ProAccess.EXPIRY_DAYS * 24 * 60 * 60 * 1000));
            }
        } catch (e) { return null; }
        return null; // Fallback or infinite
    },

    unlock: async (code) => {
        if (!code) return false;

        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(code);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            if (hashHex === ProAccess.SHA256_HASH) {
                const unlockData = {
                    unlocked: true,
                    timestamp: Date.now()
                };
                localStorage.setItem(ProAccess.STORAGE_KEY, JSON.stringify(unlockData));
                return true;
            }
        } catch (e) {
            console.error("Hashing failed", e);
        }
        return false;
    },

    lock: () => {
        localStorage.removeItem(ProAccess.STORAGE_KEY);
        // Dispatch event or reload page usually required to reflect changes instantly,
        // but for now simple storage clear is enough for logic.
        location.reload();
    }
};
