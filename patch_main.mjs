import fs from 'fs';

let js = fs.readFileSync('src/main.js', 'utf8');

const targetStr = 'AppUI.init();';
const idx = js.indexOf(targetStr);

if (idx !== -1) {
    const avatarLogic = `AppUI.init();
    
    // Set dynamic avatar
    const base64Id = localStorage.getItem('uki-bodybuild-avatar') || localStorage.getItem('uki-avatar');
    if (base64Id) {
        window.DatabaseManager.getBase64Image(base64Id).then(base64 => {
            if (base64) {
                const img = document.getElementById('user-avatar-img');
                if (img) img.src = base64;
            }
        });
    }
    `;
    js = js.slice(0, idx) + avatarLogic + js.slice(idx + targetStr.length);
    fs.writeFileSync('src/main.js', js);
    console.log('main.js patched');
}
