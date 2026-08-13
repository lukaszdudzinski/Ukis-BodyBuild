import { DatabaseManager } from '../db/DatabaseManager.js';
import { ShareUtils } from '../../utils/ShareUtils.js';

export const SettingsUI = {
    init: () => {
        // Find or create export/import buttons in the settings panel
        const settingsPanel = document.getElementById('settings-panel');
        if (!settingsPanel) return;

        // Add Data Management section if it doesn't exist
        if (!document.getElementById('reset-tutorial-btn')) {
            const dataSection = document.createElement('div');
            dataSection.innerHTML = `
                <h4 style="margin-top: 20px;">Pomoc i Samouczek</h4>
                <div class="form-full-width" style="margin-bottom: 20px;">
                    <button id="reset-tutorial-btn" class="action-button" style="width: 100%; margin-bottom: 10px; background-color: #FF9800; border-color: #FF9800; color: #fff;">🔄 Zobacz ponownie powitanie (Reset)</button>
                </div>
            `;
            const pwaGuide = document.getElementById('settings-pwa-guide');
            if (pwaGuide && pwaGuide.parentNode) {
                pwaGuide.parentNode.insertBefore(dataSection, pwaGuide);
            } else {
                settingsPanel.appendChild(dataSection);
            }
        }

        const resetTutorialBtn = document.getElementById('reset-tutorial-btn');
        if (resetTutorialBtn) {
            resetTutorialBtn.addEventListener('click', () => {
                localStorage.removeItem('tutorial_global');
                localStorage.removeItem('userNick');
                alert("Powitanie zostało zresetowane! Przejdź do głównego ekranu lub odśwież stronę.");
                if (window.OnboardingUI) window.OnboardingUI.init();
            });
        }
        
        const appVerSpan = document.getElementById('settings-app-version');
        if (appVerSpan && window.APP_VERSION) {
            appVerSpan.innerText = window.APP_VERSION;
        }

        // SettingsUI logic cleaned up

        SettingsUI.initTheme();
        SettingsUI.initProfile();
        SettingsUI.initDietSettings();
        
        SettingsUI.renderBadges();
    },

    renderBadges: () => {
        const container = document.getElementById('settings-badges-container');
        if (!container) return;

        if (!window.AchievementsSystem) return;

        const earnedIds = window.AchievementsSystem.getEarnedAchievements();
        const allDefs = window.AchievementsSystem.achievementsDef;
        let html = '';

        for (const key in allDefs) {
            const def = allDefs[key];
            const isEarned = earnedIds.includes(def.id);
            
            if (isEarned) {
                html += `
                    <div style="background: rgba(255,215,0,0.1); border: 1px solid #FFD700; border-radius: 8px; padding: 10px; width: 80px; text-align: center; cursor: help;" title="${def.description}">
                        <div style="font-size: 2em; margin-bottom: 5px;">${def.icon}</div>
                        <div style="font-size: 0.65em; font-weight: bold; color: #FFD700; line-height: 1.1;">${def.title}</div>
                    </div>
                `;
            } else {
                html += `
                    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px; width: 80px; text-align: center; opacity: 0.4; filter: grayscale(100%); cursor: help;" title="${def.description}">
                        <div style="font-size: 2em; margin-bottom: 5px;">${def.icon}</div>
                        <div style="font-size: 0.65em; font-weight: bold; color: #aaa; line-height: 1.1;">${def.title}</div>
                    </div>
                `;
            }
        }
        
        if(Object.keys(allDefs).length === 0) {
            html = '<div style="color: #888; font-size: 0.9em;">Brak zdefiniowanych odznak.</div>';
        }
        
        container.innerHTML = html;
    },

    shareBadges: async () => {
        if (!window.AchievementsSystem) return;
        const earnedIds = window.AchievementsSystem.getEarnedAchievements();
        const allDefs = window.AchievementsSystem.achievementsDef;
        
        let earnedCount = earnedIds.length;
        if (earnedCount === 0) {
            alert("Nie zdobyłeś jeszcze żadnej odznaki! Zrób trening i wróć tutaj.");
            return;
        }

        let badgesText = earnedIds.map(id => {
            const def = allDefs[id];
            return def ? `${def.icon} ${def.title}` : '';
        }).filter(b => b).join(', ');

        const textToShare = `Zdobyłem ${earnedCount} odznak w Uki's BodyBuild! 🏆 Moja kolekcja: ${badgesText}. 💪 Dołącz i bij rekordy: https://lukaszdudzinski.github.io/Ukis-BodyBuild/`;

        const statsList = [
            { label: 'Zdobyte odznaki', value: String(earnedCount), color: '#FFD700' },
            { label: 'Kolekcja', value: badgesText.substring(0, 30) + (badgesText.length > 30 ? '...' : '') }
        ];

        const avatar = localStorage.getItem('uki-bodybuild-avatar') || null;
        const nickname = (JSON.parse(localStorage.getItem('uki_bodybuild_settings') || '{}')).nickname || 'BodyBuilder';

        try {
            if (ShareUtils) {
                await ShareUtils.generateAndShareImage("Moje Odznaki", statsList, avatar, nickname, textToShare);
            } else {
                throw new Error("Brak ShareUtils");
            }
        } catch (error) {
            console.log("Share error:", error);
            if (error.name === 'AbortError') return;
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(textToShare);
                    alert("Skopiowano tekst do schowka. Możesz go wkleić do wybranej aplikacji.");
                } else {
                    window.prompt("Skopiuj swoje osiągnięcia (Ctrl+C / Cmd+C):", textToShare);
                }
            } catch(e) {
                window.prompt("Skopiuj swoje osiągnięcia (Ctrl+C / Cmd+C):", textToShare);
            }
        }
    },

    initDietSettings: () => {
        const goalSelect = document.getElementById('diet-goal-select');
        const workerUrlInput = document.getElementById('diet-worker-url');

        if (goalSelect) {
            const savedGoal = localStorage.getItem('dietGoal') || 'maintenance';
            goalSelect.value = savedGoal;
            goalSelect.addEventListener('change', (e) => {
                localStorage.setItem('dietGoal', e.target.value);
            });
        }

        if (workerUrlInput) {
            const savedUrl = localStorage.getItem('dietWorkerUrl') || '';
            workerUrlInput.value = savedUrl;
            workerUrlInput.addEventListener('input', (e) => {
                localStorage.setItem('dietWorkerUrl', e.target.value);
            });
        }
    },

    initTheme: () => {
        const themeToggle = document.getElementById('theme-toggle');
        const glassToggle = document.getElementById('glass-toggle');

        const savedTheme = localStorage.getItem('uki-bodybuild-theme');
        const savedGlass = localStorage.getItem('uki-bodybuild-glass');

        if (savedTheme === 'light') {
            document.body.classList.remove('dark-theme');
            if (themeToggle) themeToggle.checked = true;
        } else {
            document.body.classList.add('dark-theme');
            if (themeToggle) themeToggle.checked = false;
        }

        // Glass is ON by default. If 'off', we add .glass-off
        if (savedGlass === 'off') {
            document.body.classList.add('glass-off');
            if (glassToggle) glassToggle.checked = false;
        } else {
            document.body.classList.remove('glass-off');
            if (glassToggle) glassToggle.checked = true;
        }

        if (themeToggle) {
            themeToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.body.classList.remove('dark-theme');
                    localStorage.setItem('uki-bodybuild-theme', 'light');
                } else {
                    document.body.classList.add('dark-theme');
                    localStorage.setItem('uki-bodybuild-theme', 'dark');
                }
            });
        }

        if (glassToggle) {
            glassToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.body.classList.remove('glass-off');
                    localStorage.setItem('uki-bodybuild-glass', 'on');
                } else {
                    document.body.classList.add('glass-off');
                    localStorage.setItem('uki-bodybuild-glass', 'off');
                }
            });
        }
    },

    initProfile: () => {
        const nickInput = document.getElementById('profile-nick-input');
        const avatarUpload = document.getElementById('profile-avatar-upload');
        const avatarPreview = document.getElementById('profile-avatar-preview');
        const wallpaperUpload = document.getElementById('profile-wallpaper-upload');
        const wallpaperRemove = document.getElementById('profile-wallpaper-remove');
        const reminderSelect = document.getElementById('profile-reminder-select');

        // Load saved values
        const savedNick = localStorage.getItem('userNick');
        const savedAvatar = localStorage.getItem('uki-bodybuild-avatar');
        
        if (savedNick && nickInput) {
            nickInput.value = savedNick;
            SettingsUI.applyProfileNick(savedNick);
        }
        
        if (savedAvatar && avatarPreview) {
            avatarPreview.style.backgroundImage = `url(${savedAvatar})`;
            avatarPreview.innerHTML = ''; // Hide emoji
            SettingsUI.applyProfileAvatar(savedAvatar);
        }

        SettingsUI.applyWallpaper();

        if (reminderSelect) {
            const savedReminder = localStorage.getItem('uki-bodybuild-reminder') || '30';
            reminderSelect.value = savedReminder;
            
            reminderSelect.addEventListener('change', (e) => {
                localStorage.setItem('uki-bodybuild-reminder', e.target.value);
            });
        }

        // Listeners
        if (nickInput) {
            nickInput.addEventListener('input', (e) => {
                const val = e.target.value.trim();
                localStorage.setItem('userNick', val);
                SettingsUI.applyProfileNick(val);
                document.dispatchEvent(new Event('nickUpdated'));
            });
        }

        if (avatarUpload) {
            avatarUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64 = event.target.result;
                        localStorage.setItem('uki-bodybuild-avatar', base64);
                        if (avatarPreview) {
                            avatarPreview.style.backgroundImage = `url(${base64})`;
                            avatarPreview.innerHTML = '';
                        }
                        SettingsUI.applyProfileAvatar(base64);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (wallpaperUpload) {
            wallpaperUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const saveWallpaper = (base64) => {
                        try {
                            localStorage.setItem('uki-bodybuild-wallpaper', base64);
                            SettingsUI.applyWallpaper();
                            if (wallpaperRemove) wallpaperRemove.style.display = 'block';
                        } catch(err) {
                            if (window.ukiLogError) window.ukiLogError('Wallpaper save error', err.toString());
                            alert('Błąd zapisu tapety. Zdjęcie jest zbyt duże dla lokalnej bazy przeglądarki.');
                        }
                    };

                    if (window.TrainingUI && window.TrainingUI.compressImage) {
                        window.TrainingUI.compressImage(file, saveWallpaper);
                    } else {
                        const reader = new FileReader();
                        reader.onload = (event) => saveWallpaper(event.target.result);
                        reader.readAsDataURL(file);
                    }
                }
            });
        }

        if (wallpaperRemove) {
            wallpaperRemove.addEventListener('click', () => {
                localStorage.removeItem('uki-bodybuild-wallpaper');
                SettingsUI.applyWallpaper();
                wallpaperRemove.style.display = 'none';
            });
            // Show remove button initially if wallpaper exists
            if (localStorage.getItem('uki-bodybuild-wallpaper')) {
                wallpaperRemove.style.display = 'block';
            }
        }
    },

    applyProfileNick: (nick) => {
        // Find header elements where nick should be displayed
        // We'll try to find a specific span in the header, or create it.
        const headerContainer = document.querySelector('.header-container');
        if (headerContainer) {
            let nickEl = document.getElementById('header-user-nick');
            if (!nickEl) {
                nickEl = document.createElement('div');
                nickEl.id = 'header-user-nick';
                nickEl.style.fontSize = '0.9em';
                nickEl.style.color = '#00BFFF';
                nickEl.style.marginRight = '10px';
                // Insert before the nav-links
                const navLinks = document.querySelector('.nav-links');
                if(navLinks) {
                    headerContainer.insertBefore(nickEl, navLinks);
                } else {
                    headerContainer.appendChild(nickEl);
                }
            }
            nickEl.textContent = nick ? `Witaj, ${nick}!` : '';
        }
    },

    applyProfileAvatar: (base64) => {
        // Create or update avatar in the header
        const headerContainer = document.querySelector('.header-container');
        if (headerContainer) {
            let avatarEl = document.getElementById('header-user-avatar');
            if (!avatarEl) {
                avatarEl = document.createElement('div');
                avatarEl.id = 'header-user-avatar';
                avatarEl.style.width = '40px';
                avatarEl.style.height = '40px';
                avatarEl.style.borderRadius = '50%';
                avatarEl.style.backgroundSize = 'cover';
                avatarEl.style.backgroundPosition = 'center';
                avatarEl.style.border = '2px solid #00BFFF';
                avatarEl.style.marginRight = '15px';
                
                // Insert it alongside nick
                const nickEl = document.getElementById('header-user-nick');
                if (nickEl) {
                    headerContainer.insertBefore(avatarEl, nickEl.nextSibling);
                } else {
                    headerContainer.appendChild(avatarEl);
                }
            }
            if (base64) {
                avatarEl.style.backgroundImage = `url(${base64})`;
                avatarEl.style.display = 'block';
            } else {
                avatarEl.style.display = 'none';
            }
        }
    },

    applyWallpaper: () => {
        const base64 = localStorage.getItem('uki-bodybuild-wallpaper');
        if (base64) {
            // Apply to body without dark overlay to show full image
            document.body.style.backgroundImage = `url(${base64})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundPosition = 'center';
            document.body.classList.add('has-custom-wallpaper');
        } else {
            // Reset to default
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundAttachment = '';
            document.body.style.backgroundPosition = '';
            document.body.classList.remove('has-custom-wallpaper');
        }
    },

    handleExport: async () => {
        try {
            const jsonString = await DatabaseManager.exportDatabase();
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `bodybuild_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert("Baza została wyeksportowana!");
        } catch (err) {
            console.error(err);
            alert("Błąd podczas eksportu bazy danych.");
        }
    },

    handleImport: async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (confirm("UWAGA: Import nadpisze wszystkie obecne dane (pomiary, treningi). Czy chcesz kontynuować?")) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const jsonString = event.target.result;
                const success = await DatabaseManager.importDatabase(jsonString);
                
                if (success) {
                    alert("Baza została pomyślnie zaimportowana! Aplikacja zostanie przeładowana.");
                    window.location.reload();
                } else {
                    alert("Błąd podczas importu. Sprawdź plik JSON.");
                }
            };
            reader.readAsText(file);
        }
        
        // Reset input
        e.target.value = '';
    }
};
