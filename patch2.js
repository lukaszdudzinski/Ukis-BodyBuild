const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/SettingsUI.js', 'utf8');

// Replace initProfile avatarUpload
content = content.replace(/avatarUpload\.addEventListener\('change',\s*\(e\)\s*=>\s*\{[\s\S]*?reader\.readAsDataURL\(file\);\s*\}\s*\n\s*\}/m,
`avatarUpload.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        const id = await MediaManager.saveMedia(file);
                        localStorage.setItem('uki-bodybuild-avatar', id);
                        const url = await MediaManager.getMediaUrl(id);
                        if (avatarPreview && url) {
                            avatarPreview.style.backgroundImage = \`url(\${url})\`;
                            avatarPreview.innerHTML = '';
                        }
                        SettingsUI.applyProfileAvatar(id);
                    } catch(err) {
                        alert('Błąd zapisu avatara.');
                    }
                }
            }`);

// Replace initProfile wallpaperUpload
content = content.replace(/wallpaperUpload\.addEventListener\('change',\s*\(e\)\s*=>\s*\{[\s\S]*?wallpaperRemove\.style\.display = 'block';\s*\n\s*\}\s*\}\s*\n\s*\}/m,
`wallpaperUpload.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    const saveWallpaper = async (blobOrBase64) => {
                        try {
                            const id = await MediaManager.saveMedia(blobOrBase64);
                            localStorage.setItem('uki-bodybuild-wallpaper', id);
                            SettingsUI.applyWallpaper();
                            if (wallpaperRemove) wallpaperRemove.style.display = 'block';
                        } catch(err) {
                            if (window.ukiLogError) window.ukiLogError('Wallpaper save error', err.toString());
                            alert('Błąd zapisu tapety. Zdjęcie jest zbyt duże dla bazy.');
                        }
                    };

                    if (window.TrainingUI && window.TrainingUI.compressImage) {
                        window.TrainingUI.compressImage(file, saveWallpaper);
                    } else {
                        saveWallpaper(file);
                    }
                }
            }`);

// Load init values async
content = content.replace(/const savedAvatar = localStorage\.getItem\('uki-bodybuild-avatar'\);\s*if \(savedNick[^}]+SettingsUI\.applyProfileNick[^\n]+\n\s*\}\s*if \(savedAvatar[^}]+SettingsUI\.applyProfileAvatar[^\n]+\n\s*\}/s,
`const savedAvatar = localStorage.getItem('uki-bodybuild-avatar');
        
        if (savedNick && nickInput) {
            nickInput.value = savedNick;
            SettingsUI.applyProfileNick(savedNick);
        }
        
        if (savedAvatar && avatarPreview) {
            MediaManager.getMediaUrl(savedAvatar).then(url => {
                if (url) {
                    avatarPreview.style.backgroundImage = \`url(\${url})\`;
                    avatarPreview.innerHTML = ''; // Hide emoji
                }
            });
            SettingsUI.applyProfileAvatar(savedAvatar);
        }`);

fs.writeFileSync('src/modules/ui/SettingsUI.js', content);
