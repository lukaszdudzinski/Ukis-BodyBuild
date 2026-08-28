import { DatabaseManager } from '../db/DatabaseManager.js';

export const BackupUI = {
    init: () => {
        setTimeout(BackupUI.checkDailyBackup, 5000); // 5 sec delay to not block UI
    },
    
    checkDailyBackup: async () => {
        const today = new Date().toISOString().split('T')[0];
        const lastBackup = localStorage.getItem('uki_last_backup_date');
        
        if (lastBackup !== today) {
            const nickname = localStorage.getItem('uki-nickname') || 'Uki';
            if (confirm(`Witaj ${nickname}! Zauważyłem, że nie robiłeś dzisiaj kopii zapasowej (archiwum bazy danych). Ze względów bezpieczeństwa zalecamy codzienne pobieranie pliku. Czy utworzyć archiwum teraz?`)) {
                try {
                    const dataStr = await DatabaseManager.exportDatabase();
                    const blob = new Blob([dataStr], {type: "application/json"});
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    const now = new Date();
                    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
                    const cleanNick = nickname.replace(/[^a-zA-Z0-9]/g, '');
                    a.download = `bodybuild_backup_${cleanNick}_${today}_${timeStr}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    localStorage.setItem('uki_last_backup_date', today);
                    alert("Kopia utworzona i pobrana. Zapisz ją w bezpiecznym miejscu (np. iCloud/Dysk Google)!");
                } catch (err) {
                    alert("Błąd podczas eksportu: " + err.message);
                }
            } else {
                // If they decline, we also set it so we don't prompt again today
                localStorage.setItem('uki_last_backup_date', today);
            }
        }
    }
};
