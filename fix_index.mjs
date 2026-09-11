import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

// 1. Remove background: #0A0A0F from welcome-screen
content = content.replace(
    /<div id="welcome-screen" class="tab-content active-tab glass-dashboard" style="background: #0A0A0F; padding-bottom: 20px;">/,
    `<div id="welcome-screen" class="tab-content active-tab glass-dashboard" style="padding-bottom: 20px;">`
);

// 2. Fix Top Header (Replace FL with img, remove Robot)
const oldHeader = `<div class="glass-header" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; border: none; background: transparent; box-shadow: none;">
                        <div class="avatar-circle" onclick="switchTab('settings-panel')" style="width: 40px; height: 40px;">
                            <img id="user-avatar-img" src="https://ui-avatars.com/api/?name=Uki&background=111&color=fff&rounded=true" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                        </div>
                        
                        <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
                            <div style="width: 45px; height: 45px; border-radius: 50%; border: 2px solid #00D26A; display: flex; justify-content: center; align-items: center; background: #111;">
                                <span style="color: #00D26A; font-weight: 900; font-style: italic; font-size: 18px; letter-spacing: -1px;">FL</span>
                            </div>
                        </div>
                        
                        <div class="header-btn" onclick="window.ChatUI && window.ChatUI.toggleChat()" style="background: rgba(255,255,255,0.05); border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; cursor: pointer; color: #888;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                        </div>
                    </div>`;

const newHeader = `<div class="glass-header" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; border: none; background: transparent; box-shadow: none;">
                        <div class="avatar-circle" onclick="switchTab('settings-panel')" style="width: 40px; height: 40px;">
                            <img id="user-avatar-img" src="https://ui-avatars.com/api/?name=Uki&background=111&color=fff&rounded=true" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                        </div>
                        
                        <div style="display: flex; justify-content: center; align-items: center; flex: 1;">
                            <img src="img/logo.png" alt="Logo" style="height: 45px; width: 45px; object-fit: contain; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.5);" onerror="this.src='https://ui-avatars.com/api/?name=Uki&background=111&color=fff&rounded=true'"/>
                        </div>
                        
                        <div style="width: 40px; height: 40px; visibility: hidden;"><!-- Spacer for flex --></div>
                    </div>`;

content = content.replace(oldHeader, newHeader);

// 3. Remove "SF Pro, xxpx" texts
content = content.replace(/<span style="color: #888; font-size: 13px;">SF Pro, 24px<\/span>/g, '');
content = content.replace(/<span style="color: #888; font-size: 12px;">SF Pro, 16px<\/span>/g, '');
// Remove margins on the title so it centers correctly vertically if subtitle is gone
content = content.replace(/margin: 0 0 15px 0;/g, 'margin: 0;');

// 4. Update Bottom Nav Bar HTML
const oldBottomNavRegex = /<div class="bottom-nav-bar">[\s\S]*?<\/div>\s*<\/div>\s*<!-- Global Tooltip/m;
const newBottomNav = `<div class="bottom-nav-bar">
            <div class="nav-btn active" onclick="switchTab('welcome-screen')">
                <div class="nav-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
                <span>Menu</span>
            </div>
            <div class="nav-btn" onclick="switchTab('training-dashboard')">
                <div class="nav-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg></div>
                <span>Trening</span>
            </div>
            <div class="nav-btn" onclick="switchTab('settings-panel')">
                <div class="nav-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                <span>Profil</span>
            </div>
            <div class="nav-btn" onclick="switchTab('diagnostics-dashboard')">
                <div class="nav-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
                <span>Serwis</span>
            </div>
        </div>
    </div>
    <!-- Global Tooltip`;

content = content.replace(oldBottomNavRegex, newBottomNav);

fs.writeFileSync('index.html', content);
console.log('Fixed index.html');
