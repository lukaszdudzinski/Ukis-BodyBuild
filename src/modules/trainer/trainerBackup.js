// Przypomnienie o kopii zapasowej w Strefie (spec 8.3). Datę kopii zapisuje DatabaseManager.exportDatabase().

export const BACKUP_KEY = 'ukis.bodybuild.trener.ostatnia-kopia';
export const BACKUP_REMIND_DAYS = 7;

export function lastBackupAt(storage = globalThis.localStorage) {
    try {
        return storage.getItem(BACKUP_KEY) || null;
    } catch (e) {
        return null;
    }
}

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

// Pełne dni kalendarzowe od kopii (czas lokalny). Brak albo zła data → null.
export function backupAgeDays(iso, now = new Date()) {
    if (!iso) return null;
    const at = new Date(iso);
    if (Number.isNaN(at.getTime())) return null;
    return Math.max(0, Math.round((startOfDay(now) - startOfDay(at)) / 86400000));
}

export function backupLabel(iso, now = new Date()) {
    const days = backupAgeDays(iso, now);
    if (days === null) return 'Nie masz jeszcze kopii zapasowej';
    if (days === 0) return 'Ostatnia kopia: dziś';
    if (days === 1) return 'Ostatnia kopia: wczoraj';
    return `Ostatnia kopia: ${days} dni temu`;
}

// Baner „Zrób kopię”: jest co najmniej jeden klient, a kopii nie ma albo jest starsza niż 7 dni.
export function needsBackupReminder({ lastIso, clientCount, now = new Date() }) {
    if (!clientCount) return false;
    const days = backupAgeDays(lastIso, now);
    return days === null || days > BACKUP_REMIND_DAYS;
}
