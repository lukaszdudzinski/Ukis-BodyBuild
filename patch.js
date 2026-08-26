const fs = require('fs');

let content = fs.readFileSync('src/modules/ui/SettingsUI.js', 'utf8');

// Replace applyWallpaper
content = content.replace(/applyWallpaper: \(\) => \{[\s\S]*?\},/, 
`applyWallpaper: async () => {
        const savedId = localStorage.getItem('uki-bodybuild-wallpaper');
        if (savedId) {
            const url = await MediaManager.getMediaUrl(savedId);
            if (url) {
                document.body.style.backgroundImage = \`url(\${url})\`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundAttachment = 'fixed';
                document.body.style.backgroundPosition = 'center';
                document.body.classList.add('has-custom-wallpaper');
            }
        } else {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundAttachment = '';
            document.body.style.backgroundPosition = '';
            document.body.classList.remove('has-custom-wallpaper');
        }
    },`);

// Replace applyProfileAvatar
content = content.replace(/applyProfileAvatar: \(nick\) => \{[\s\S]*?\},/m,
`applyProfileAvatar: async (base64OrId) => {
        const headerContainer = document.querySelector('.header-container');
        if (headerContainer) {
            let avatarEl = document.getElementById('header-user-avatar');
            if (!avatarEl) {
                avatarEl = document.createElement('div');
                avatarEl.id = 'header-user-avatar';
                avatarEl.style.width = '30px';
                avatarEl.style.height = '30px';
                avatarEl.style.borderRadius = '50%';
                avatarEl.style.backgroundSize = 'cover';
                avatarEl.style.backgroundPosition = 'center';
                avatarEl.style.marginRight = '15px';
                avatarEl.style.border = '2px solid #00BFFF';
                avatarEl.style.boxShadow = '0 0 5px rgba(0, 191, 255, 0.5)';
                
                const nickEl = document.getElementById('header-user-nick');
                if (nickEl) {
                    headerContainer.insertBefore(avatarEl, nickEl.nextSibling);
                } else {
                    headerContainer.appendChild(avatarEl);
                }
            }
            if (base64OrId) {
                const url = await MediaManager.getMediaUrl(base64OrId);
                if (url) {
                    avatarEl.style.backgroundImage = \`url(\${url})\`;
                    avatarEl.style.display = 'block';
                }
            } else {
                avatarEl.style.display = 'none';
            }
        }
    },`);

fs.writeFileSync('src/modules/ui/SettingsUI.js', content);
