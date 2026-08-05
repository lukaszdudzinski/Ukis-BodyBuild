import { DatabaseManager } from '../db/DatabaseManager.js';

export const SettingsUI = {
    init: () => {
        // Find or create export/import buttons in the settings panel
        const settingsPanel = document.getElementById('settings-panel');
        if (!settingsPanel) return;

        // Add Data Management section if it doesn't exist
        if (!document.getElementById('db-export-btn')) {
            const dataSection = document.createElement('div');
            dataSection.innerHTML = `
                <h4 style="margin-top: 20px;">Zarządzanie Danymi</h4>
                <div class="form-full-width" style="margin-bottom: 20px;">
                    <button id="db-export-btn" class="action-button" style="width: 100%; margin-bottom: 10px; background-color: #2196F3; border-color: #2196F3;">💾 Eksportuj Bazę (JSON)</button>
                    <label for="db-import-file" class="action-button" style="width: 100%; display: block; text-align: center; background-color: #333; border-color: #555; cursor: pointer; padding: 10px; border-radius: 5px;">
                        📂 Importuj Bazę (JSON)
                    </label>
                    <input type="file" id="db-import-file" accept=".json" style="display: none;">
                </div>
            `;
            settingsPanel.insertBefore(dataSection, document.getElementById('settings-pwa-guide'));
        }

        const exportBtn = document.getElementById('db-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', SettingsUI.handleExport);
        }

        const importInput = document.getElementById('db-import-file');
        if (importInput) {
            importInput.addEventListener('change', SettingsUI.handleImport);
        }

        SettingsUI.initTheme();
        SettingsUI.initProfile();
    },

    initTheme: () => {
        const themeToggle = document.getElementById('theme-toggle');
        const glassToggle = document.getElementById('glass-toggle');

        const savedTheme = localStorage.getItem('uki-bodybuild-theme');
        const savedGlass = localStorage.getItem('uki-bodybuild-glass');

        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            if (themeToggle) themeToggle.checked = true;
        }

        // Glass is ON by default. If 'off', we add .no-glass
        if (savedGlass === 'off') {
            document.body.classList.add('no-glass');
            if (glassToggle) glassToggle.checked = false;
        } else {
            if (glassToggle) glassToggle.checked = true;
        }

        if (themeToggle) {
            themeToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.body.classList.add('light-mode');
                    localStorage.setItem('uki-bodybuild-theme', 'light');
                } else {
                    document.body.classList.remove('light-mode');
                    localStorage.setItem('uki-bodybuild-theme', 'dark');
                }
            });
        }

        if (glassToggle) {
            glassToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.body.classList.remove('no-glass');
                    localStorage.setItem('uki-bodybuild-glass', 'on');
                } else {
                    document.body.classList.add('no-glass');
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

        // Load saved values
        const savedNick = localStorage.getItem('uki-bodybuild-nick');
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

        // Listeners
        if (nickInput) {
            nickInput.addEventListener('input', (e) => {
                const val = e.target.value.trim();
                localStorage.setItem('uki-bodybuild-nick', val);
                SettingsUI.applyProfileNick(val);
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
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64 = event.target.result;
                        localStorage.setItem('uki-bodybuild-wallpaper', base64);
                        SettingsUI.applyWallpaper();
                        if (wallpaperRemove) wallpaperRemove.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
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
            // Apply to body with a dark overlay using pseudo-element or just linear-gradient
            document.body.style.backgroundImage = `linear-gradient(rgba(18, 18, 18, 0.85), rgba(18, 18, 18, 0.95)), url(${base64})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundPosition = 'center';
        } else {
            // Reset to default
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundAttachment = '';
            document.body.style.backgroundPosition = '';
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
