export const AchievementsSystem = {
    // Definicje osiągnięć
    achievementsDef: {
        'first_100': {
            id: 'first_100',
            title: 'Klub 100',
            description: 'Wycisnąłeś 100kg w dowolnym ćwiczeniu.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>'
        },
        'iron_will': {
            id: 'iron_will',
            title: 'Żelazna Wola',
            description: 'Ukończono 5 treningów w ciągu jednego tygodnia.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
        },
        'volume_king': {
            id: 'volume_king',
            title: 'Król Objętości',
            description: 'Przerzucono >10,000 kg na jednym treningu.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>'
        },
        'streak_3': {
            id: 'streak_3',
            title: 'Dyscyplina',
            description: '3 dni treningowe pod rząd.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
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
