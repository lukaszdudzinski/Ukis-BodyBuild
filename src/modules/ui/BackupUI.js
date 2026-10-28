import { DatabaseManager } from '../db/DatabaseManager.js';

export const BackupUI = {
    init: () => {
        setTimeout(BackupUI.checkDailyBackup, 5000); // 5 sec delay to not block UI
    },
    
    checkDailyBackup: async () => {
        const freq = localStorage.getItem('uki_backup_frequency') || 'activity';
        if (freq === 'never') return;

        const today = new Date().toISOString().split('T')[0];
        const lastBackup = localStorage.getItem('uki_last_backup_date');
        
        let shouldPrompt = false;
        
        if (!lastBackup) {
            shouldPrompt = true;
        } else {
            const lastDate = new Date(lastBackup);
            const currDate = new Date(today);
            const diffDays = Math.floor((currDate - lastDate) / (1000 * 60 * 60 * 24));
            
            if (freq === 'daily' && diffDays >= 1) shouldPrompt = true;
            else if (freq === 'weekly' && diffDays >= 7) shouldPrompt = true;
            else if (freq === 'monthly' && diffDays >= 30) shouldPrompt = true;
            else if (freq === 'bimonthly' && diffDays >= 60) shouldPrompt = true;
            else if (freq === 'activity' && diffDays >= 1) {
                // Sprawdź czy po dacie ostatniego backupu był jakiś trening
                try {
                    const trainings = await DatabaseManager.getTrainings();
                    const hadActivity = trainings.some(t => t.date >= lastBackup && t.date < today);
                    if (hadActivity) shouldPrompt = true;
                } catch(e) {}
            }
        }
        
        if (shouldPrompt) {
            const nickname = localStorage.getItem('uki-nickname') || 'Uki';
            if (confirm(`Witaj ${nickname}! Zauważyłem, że przydałaby się nowa kopia zapasowa (archiwum bazy danych). Czy utworzyć archiwum teraz?`)) {
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
                localStorage.setItem('uki_last_backup_date', today);
            }
        }
    }
};
