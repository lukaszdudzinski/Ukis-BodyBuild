import { DatabaseManager } from '../db/DatabaseManager.js';
import { MediaManager } from '../db/MediaManager.js';
import { ShareUtils } from '../../utils/ShareUtils.js';
import { isTrainerEnabled, setTrainerEnabled, getTrainerLicense } from '../trainer/trainerAccess.js';
import { applyDefaultAvatar, loadAvatarChoice, saveAvatarChoice } from './defaultAvatar.js';
import { Wyglad, ZDARZENIE as WYGLAD_ZMIENIONY } from '../wyglad/tlo.js';
import { nazwaMotywu } from '../wyglad/WygladUI.js';

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
                    <button id="reset-tutorial-btn" style="width: 100%; margin-bottom: 10px; background: rgba(255, 152, 0, 0.15); border: 1px solid rgba(255, 152, 0, 0.3); color: #FF9800; padding: 12px; border-radius: 12px; font-weight: 600; font-size: 0.95em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        Zobacz ponownie powitanie (Reset)
                    </button>
                </div>
            `;
            const pwaGuide = document.getElementById('settings-pwa-guide');
            if (pwaGuide && pwaGuide.parentNode) {
                pwaGuide.parentNode.insertBefore(dataSection, pwaGuide);
            } else {
                settingsPanel.appendChild(dataSection);
            }
            // Przełącznik wyglądu (okres przejściowy - patrz ui-switch.js); droga do klasycznego do etapu D (R10).
            if (window.UkiUiSwitch) window.UkiUiSwitch.mountSettingsCard(dataSection);
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

        SettingsUI.initTrainerCard();
        SettingsUI.initWygladRow();
        SettingsUI.initTheme();
        SettingsUI.initLaboratory();
        SettingsUI.initProfile();
        SettingsUI.initDietSettings();
        
        SettingsUI.renderBadges();
    },

    // Karta „Jestem trenerem”: przełącznik pokazujący kafelek Strefy oraz imię z ważnego kodu.
    initTrainerCard: () => {
        const panel = document.getElementById('settings-panel');
        if (!panel || document.getElementById('trainer-profile-card')) return;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isTrainerEnabled();
        checkbox.style.cssText = 'width: 22px; height: 22px; accent-color: #00BFFF; cursor: pointer;';
        const labelText = document.createElement('span');
        labelText.textContent = 'Jestem trenerem';
        labelText.style.cssText = 'color: #fff; font-weight: 600;';
        const toggle = document.createElement('label');
        toggle.className = 'trainer-switch';
        toggle.style.cssText = 'display: flex; align-items: center; gap: 12px; min-height: 44px; cursor: pointer;';
        toggle.append(checkbox, labelText);

        const hint = document.createElement('p');
        hint.textContent = 'Pokazuje w Menu kafelek Strefy trenera: osobne, szyfrowane miejsce na dane klientów.';
        hint.style.cssText = 'margin: 4px 0 0 0; color: #bbb; font-size: 0.85em; line-height: 1.4;';
        const who = document.createElement('p');
        who.style.cssText = 'margin: 8px 0 0 0; color: #00BFFF; font-weight: 600;';
        who.hidden = true;

        const card = document.createElement('div');
        card.id = 'trainer-profile-card';
        card.style.cssText = 'background: rgba(0,0,0,0.4); padding: 15px; border-radius: 8px; border: 1px solid #00BFFF; margin-bottom: 20px;';
        const title = document.createElement('h4');
        title.textContent = 'Strefa trenera';
        title.style.cssText = 'margin: 0 0 6px 0; color: #00BFFF;';
        card.append(title, toggle, hint, who);

        const showName = async () => {
            const license = await getTrainerLicense();
            who.hidden = !license.ok;
            who.textContent = license.ok ? `Trener: ${license.name}` : '';
        };
        checkbox.addEventListener('change', () => {
            setTrainerEnabled(checkbox.checked);
            document.dispatchEvent(new CustomEvent('trainerAccessChanged'));
        });
        document.addEventListener('trainerAccessChanged', (e) => {
            if (e.detail && e.detail.license) {
                who.hidden = !e.detail.license.ok;
                who.textContent = e.detail.license.ok ? `Trener: ${e.detail.license.name}` : '';
            }
        });

        const container = panel.querySelector('.settings-container') || panel;
        const profile = container.querySelector('.profile-section');
        if (profile && profile.nextSibling) container.insertBefore(card, profile.nextSibling);
        else container.appendChild(card);
        showName();
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

        const textToShare = `Zdobyłem ${earnedCount} odznak w Uki's BodyBuild! Moja kolekcja: ${badgesText}. Dołącz i bij rekordy: https://lukaszdudzinski.github.io/Ukis-BodyBuild/`;

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

    initLaboratory: () => {
        const toggle = document.getElementById('experimental-numpad-toggle');
        if (!toggle) return;
        
        const isExp = localStorage.getItem('uki-experimental-numpad') === 'on';
        toggle.checked = isExp;
        
        toggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                localStorage.setItem('uki-experimental-numpad', 'on');
                alert("Włączono eksperymentalny tryb Treningu. Nowe opcje pojawią się przy najbliższym rozpoczęciu sesji treningowej.");
            } else {
                localStorage.setItem('uki-experimental-numpad', 'off');
                alert("Przywrócono klasyczny tryb Treningu z domyślną klawiaturą.");
            }
        });
    },

    // Wiersz „Wygląd: motyw i tapeta” w Profilu: nazwa bieżącego motywu, odświeżana po każdej zmianie wyglądu.
    initWygladRow: () => {
        const val = document.getElementById('profile-wyglad-motyw');
        if (!val) return;
        const paint = (motyw) => { val.textContent = nazwaMotywu(motyw); };
        paint(Wyglad.getWyglad().motyw);
        document.addEventListener(WYGLAD_ZMIENIONY, (e) => paint((e.detail || Wyglad.getWyglad()).motyw));
    },

    // Nowy wygląd jest tylko ciemny (spec, decyzja 2): body.dark-theme zawsze, bez przełącznika.
    initTheme: () => {
        const glassToggle = document.getElementById('glass-toggle');
        const savedGlass = localStorage.getItem('uki-bodybuild-glass');

        document.body.classList.add('dark-theme');

        // Glass is ON by default. If 'off', we add .glass-off
        if (savedGlass === 'off') {
            document.body.classList.add('glass-off');
            if (glassToggle) glassToggle.checked = false;
        } else {
            document.body.classList.remove('glass-off');
            if (glassToggle) glassToggle.checked = true;
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
        const reminderSelect = document.getElementById('profile-reminder-select');

        // Load saved values
        const savedNick = localStorage.getItem('userNick');
        const savedAvatar = localStorage.getItem('uki-bodybuild-avatar');
        
        if (savedNick && nickInput) {
            nickInput.value = savedNick;
            SettingsUI.applyProfileNick(savedNick);
        }
        
        if (savedAvatar && avatarPreview) {
            MediaManager.getMediaUrl(savedAvatar).then(url => {
                if (url) {
                    avatarPreview.style.backgroundImage = `url(${url})`;
                    avatarPreview.innerHTML = ''; // Hide emoji
                }
            });
            SettingsUI.applyProfileAvatar(savedAvatar);
        }

        if (reminderSelect) {
            const savedReminder = localStorage.getItem('uki-bodybuild-reminder') || '30';
            reminderSelect.value = savedReminder;
            
            reminderSelect.addEventListener('change', (e) => {
                localStorage.setItem('uki-bodybuild-reminder', e.target.value);
            });
        }

        const silhouetteSelect = document.getElementById('profile-avatar-silhouette');
        if (silhouetteSelect) {
            silhouetteSelect.value = loadAvatarChoice();
            silhouetteSelect.addEventListener('change', (e) => {
                saveAvatarChoice(e.target.value);
                applyDefaultAvatar();
            });
        }

        const expSelect = document.getElementById('profile-experience-select');
        if (expSelect) {
            const savedExp = localStorage.getItem('trainingExperience') || '1-3 lata (Średniozaawansowany)';
            expSelect.value = savedExp;
            
            expSelect.addEventListener('change', (e) => {
                localStorage.setItem('trainingExperience', e.target.value);
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
            avatarUpload.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        const id = await MediaManager.saveMedia(file);
                        localStorage.setItem('uki-bodybuild-avatar', id);
                        const url = await MediaManager.getMediaUrl(id);
                        if (avatarPreview && url) {
                            avatarPreview.style.backgroundImage = `url(${url})`;
                            avatarPreview.innerHTML = '';
                        }
                        SettingsUI.applyProfileAvatar(id);
                    } catch(err) {
                        alert('Błąd zapisu avatara.');
                    }
                }
            });
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

    applyProfileAvatar: async (base64) => {
        let avatarUrl = base64;
        if (base64 && !base64.startsWith('data:')) {
            try {
                if (window.MediaManager) {
                    avatarUrl = await window.MediaManager.getMediaUrl(base64);
                } else if (window.DatabaseManager) {
                    avatarUrl = await window.MediaManager.getMediaUrl(base64);
                }
            } catch (e) {
                console.warn('Could not load avatar', e);
            }
        }
        
        const newAvatarImg = document.getElementById('user-avatar-img');
        if (newAvatarImg && avatarUrl) {
            newAvatarImg.src = avatarUrl;
            newAvatarImg.dataset.avatarSource = 'photo';
        }

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
                
                const nickEl = document.getElementById('header-user-nick');
                if (nickEl) {
                    headerContainer.insertBefore(avatarEl, nickEl.nextSibling);
                } else {
                    headerContainer.appendChild(avatarEl);
                }
            }
            if (avatarUrl) {
                avatarEl.style.backgroundImage = 'url('+avatarUrl+')';
                avatarEl.style.display = 'block';
            } else {
                avatarEl.style.display = 'none';
            }
        }    },

    handleExport: async () => {
        try {
            const jsonString = await DatabaseManager.exportDatabase();
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-mm-ss
            a.download = `bodybuild_backup_${dateStr}_${timeStr}.json`;
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
                let success = false;
                try {
                    success = await DatabaseManager.importDatabase(jsonString).catch((err) => {
                        if (err?.message !== 'SEJF_ISTNIEJE') throw err;
                        const replaceTrainerVault = confirm("Zastąpić dane Strefy trenera danymi z kopii?");
                        return DatabaseManager.importDatabase(jsonString, { replaceTrainerVault });
                    });
                } catch (err) {
                    console.error(err);
                }
                
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
