import fs from 'fs';

let js = fs.readFileSync('src/modules/ui/SettingsUI.js', 'utf8');

const targetFuncStart = 'applyProfileAvatar: (base64) => {';
const startIdx = js.indexOf(targetFuncStart);

if (startIdx !== -1) {
    const endIdx = js.indexOf('    },', startIdx);
    if (endIdx !== -1) {
        const replacement = `applyProfileAvatar: async (base64) => {
        let avatarUrl = base64;
        if (base64 && !base64.startsWith('data:')) {
            try {
                if (window.MediaManager) {
                    avatarUrl = await window.MediaManager.getMediaUrl(base64);
                } else if (window.DatabaseManager) {
                    avatarUrl = await window.DatabaseManager.getBase64Image(base64);
                }
            } catch (e) {
                console.warn('Could not load avatar', e);
            }
        }
        
        const newAvatarImg = document.getElementById('user-avatar-img');
        if (newAvatarImg && avatarUrl) {
            newAvatarImg.src = avatarUrl;
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
        }`;
        
        js = js.slice(0, startIdx) + replacement + js.slice(endIdx);
        fs.writeFileSync('src/modules/ui/SettingsUI.js', js);
        console.log('SettingsUI.js patched successfully');
    }
}
