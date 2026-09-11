import fs from 'fs';

let js = fs.readFileSync('src/modules/ui/SettingsUI.js', 'utf8');

// Find where header avatar is updated
const startStr = '// Create or update avatar in the header';
const startIdx = js.indexOf(startStr);

if (startIdx !== -1) {
    const endStr = 'updateUIWithSettings: () => {';
    const endIdx = js.indexOf(endStr, startIdx);
    if (endIdx !== -1) {
        const replacement = `// Create or update avatar in the header
        const base64Id = localStorage.getItem('uki-bodybuild-avatar');
        if (base64Id) {
            window.DatabaseManager.getBase64Image(base64Id).then(base64 => {
                if (base64) {
                    const img = document.getElementById('user-avatar-img');
                    if (img) img.src = base64;
                }
            });
        }
    },

    `;
        js = js.slice(0, startIdx) + replacement + js.slice(endIdx);
        fs.writeFileSync('src/modules/ui/SettingsUI.js', js);
        console.log('Avatar logic updated in SettingsUI.js');
    }
} else {
    console.log('Could not find avatar logic to replace in SettingsUI.js');
}
