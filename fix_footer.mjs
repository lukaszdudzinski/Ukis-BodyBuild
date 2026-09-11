import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

const oldNav = `        <!-- Bottom Navigation -->`;
const footerHTML = `        <div style="text-align: center; font-size: 0.75em; color: #555; margin-bottom: 90px; padding: 20px;">
            <span id="dashboard-version">v2026.9.X</span> | <span id="premium-status">Wersja Light</span><br>
            Powered by Antigravity AI
        </div>
        
        <!-- Bottom Navigation -->`;

if (!content.includes('Powered by Antigravity AI')) {
    content = content.replace(oldNav, footerHTML);
    fs.writeFileSync('index.html', content);
    console.log('Restored version footer');
}
