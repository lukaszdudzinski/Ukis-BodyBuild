import fs from 'fs';

let js = fs.readFileSync('src/modules/ui/AppUI.js', 'utf8');

const targetStr = 'AppUI.bindEvents();';
const idx = js.indexOf(targetStr);

if (idx !== -1) {
    const avatarLogic = `
        // Set dynamic avatar
        const base64Id = localStorage.getItem('uki-bodybuild-avatar');
        if (base64Id) {
            window.DatabaseManager.getBase64Image(base64Id).then(base64 => {
                if (base64) {
                    const img = document.getElementById('user-avatar-img');
                    if (img) img.src = base64;
                }
            });
        }
        
        `;
    js = js.slice(0, idx) + avatarLogic + js.slice(idx);
    fs.writeFileSync('src/modules/ui/AppUI.js', js);
    console.log('AppUI.js patched');
}
