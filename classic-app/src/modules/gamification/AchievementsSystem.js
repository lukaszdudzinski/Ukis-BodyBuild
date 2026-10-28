export const AchievementsSystem = {
    // Definicje osiągnięć
    achievementsDef: {
        'first_100': {
            id: 'first_100',
            title: 'Klub 100',
            description: 'Wycisnąłeś 100kg w dowolnym ćwiczeniu.',
            icon: '🔥'
        },
        'iron_will': {
            id: 'iron_will',
            title: 'Żelazna Wola',
            description: 'Ukończono 5 treningów w ciągu jednego tygodnia.',
            icon: '🛡️'
        },
        'volume_king': {
            id: 'volume_king',
            title: 'Król Objętości',
            description: 'Przerzucono >10,000 kg na jednym treningu.',
            icon: '👑'
        },
        'streak_3': {
            id: 'streak_3',
            title: 'Dyscyplina',
            description: '3 dni treningowe pod rząd.',
            icon: '⚡'
        }
    },

    getEarnedAchievements: () => {
        let earned = [];
        try {
            const data = localStorage.getItem('uki_achievements');
            if (data) earned = JSON.parse(data);
        } catch(e) {}
        return earned;
    },

    earnAchievement: (id) => {
        const earned = AchievementsSystem.getEarnedAchievements();
        if (!earned.includes(id) && AchievementsSystem.achievementsDef[id]) {
            earned.push(id);
            localStorage.setItem('uki_achievements', JSON.stringify(earned));
            AchievementsSystem.showNotification(AchievementsSystem.achievementsDef[id]);
        }
    },

    showNotification: (achievement) => {
        const notif = document.createElement('div');
        notif.style.position = 'fixed';
        notif.style.bottom = '20px';
        notif.style.left = '50%';
        notif.style.transform = 'translateX(-50%)';
        notif.style.backgroundColor = '#FFD700';
        notif.style.color = '#000';
        notif.style.padding = '15px 25px';
        notif.style.borderRadius = '30px';
        notif.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
        notif.style.zIndex = '9999';
        notif.style.fontWeight = 'bold';
        notif.style.display = 'flex';
        notif.style.alignItems = 'center';
        notif.style.gap = '10px';
        notif.style.animation = 'slideUp 0.5s ease-out';
        
        notif.innerHTML = `
            <span style="font-size: 1.5em;">${achievement.icon}</span>
            <div>
                <div style="font-size: 0.8em; text-transform: uppercase; color: #555;">Odblokowano Odznakę!</div>
                <div>${achievement.title}</div>
            </div>
        `;
        
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.animation = 'slideDown 0.5s ease-in';
            setTimeout(() => {
                if (notif.parentNode) notif.parentNode.removeChild(notif);
            }, 450);
        }, 4000);
    },

    checkPostTrainingAchievements: (sessionData) => {
        // Obliczanie objętości
        let totalVolume = 0;
        let maxWeight = 0;

        // Streaks logic - checks history
        if (window.DatabaseManager) {
            window.DatabaseManager.getTrainings((history) => {
                if (!history || history.length < 3) return;
                
                // Sort by date desc
                const sorted = history.sort((a, b) => new Date(b.date) - new Date(a.date));
                // Get unique dates (YYYY-MM-DD)
                const uniqueDates = [...new Set(sorted.map(t => t.date.split('T')[0]))];
                
                if (uniqueDates.length >= 3) {
                    let streak = 1;
                    let maxStreak = 1;
                    
                    for (let i = 0; i < uniqueDates.length - 1; i++) {
                        const d1 = new Date(uniqueDates[i]);
                        const d2 = new Date(uniqueDates[i+1]);
                        const diffTime = Math.abs(d1 - d2);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                        
                        if (diffDays === 1) {
                            streak++;
                            if (streak > maxStreak) maxStreak = streak;
                        } else {
                            streak = 1;
                        }
                    }
                    
                    if (maxStreak >= 3) {
                        AchievementsSystem.earnAchievement('streak_3');
                    }
                }
            });
        }

        if (sessionData && sessionData.exercises) {
            sessionData.exercises.forEach(ex => {
                if (ex && ex.sets) {
                    ex.sets.forEach(set => {
                        const w = parseFloat(set.weight) || 0;
                        const r = parseInt(set.reps) || 0;
                        totalVolume += (w * r);
                        if (w > maxWeight) maxWeight = w;
                    });
                }
            });
        }

        if (maxWeight >= 100) {
            AchievementsSystem.earnAchievement('first_100');
        }

        if (totalVolume > 10000) {
            AchievementsSystem.earnAchievement('volume_king');
        }
    }
};

window.AchievementsSystem = AchievementsSystem;
