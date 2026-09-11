import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

const newWelcome = `                <div id="welcome-screen" class="tab-content active-tab glass-dashboard" style="background: #0A0A0F; padding-bottom: 20px;">
                    <!-- Floating chat hide -->
                    <style>
                        #welcome-screen ~ #chat-widget-btn, #chat-widget-btn { display: none !important; }
                        .active-tab#welcome-screen ~ #chat-widget-btn { display: none !important; }
                        /* We will hide the global chat button when welcome screen is active by doing it in JS or just via specific CSS, but for now let's just make sure the inline styles match the mockup */
                        .icon-box {
                            background: rgba(255,255,255,0.05);
                            border-radius: 50%;
                            width: 44px; height: 44px;
                            display: flex; justify-content: center; align-items: center;
                            margin: 0 auto 10px auto;
                            color: #888;
                        }
                    </style>

                    <!-- Top Header -->
                    <div class="glass-header" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; border: none; background: transparent; box-shadow: none;">
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
                    </div>

                    <!-- Main CTA -->
                    <div class="glass-card main-cta" onclick="switchTab('training-dashboard')" style="flex-shrink: 0; background: #111118; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                        <div class="cta-content" style="text-align: left;">
                            <h2 class="cta-title" style="color: #FFF; font-size: 20px; font-weight: 700; margin: 0;">Twój Trening</h2>
                            <span style="color: #888; font-size: 13px;">SF Pro, 24px</span>
                        </div>
                        <div style="background: #00D26A; color: #000; padding: 10px 16px; border-radius: 8px; font-weight: 700; font-size: 15px; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                            Rozpocznij
                        </div>
                    </div>

                    <!-- Grid -->
                    <div class="glass-grid" style="flex-shrink: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div class="glass-card grid-item uniform-tool" onclick="switchTab('analytics-dashboard')" style="background: #111118; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 25px 15px; text-align: center;">
                            <div class="icon-box">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                            </div>
                            <h3 style="color: #FFF; margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">Analiza</h3>
                            <span style="color: #888; font-size: 12px;">SF Pro, 16px</span>
                        </div>
                        <div class="glass-card grid-item uniform-tool" onclick="switchTab('history-dashboard')" style="background: #111118; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 25px 15px; text-align: center;">
                            <div class="icon-box">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                            </div>
                            <h3 style="color: #FFF; margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">Historia</h3>
                            <span style="color: #888; font-size: 12px;">SF Pro, 16px</span>
                        </div>
                        <div class="glass-card grid-item uniform-tool" onclick="switchTab('measurements-dashboard')" style="background: #111118; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 25px 15px; text-align: center;">
                            <div class="icon-box">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01"/></svg>
                            </div>
                            <h3 style="color: #FFF; margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">Pomiary</h3>
                            <span style="color: #888; font-size: 12px;">SF Pro, 16px</span>
                        </div>
                        <div class="glass-card grid-item uniform-tool" onclick="switchTab('diet-dashboard')" style="background: #111118; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 25px 15px; text-align: center;">
                            <div class="icon-box">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
                            </div>
                            <h3 style="color: #FFF; margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">Dieta</h3>
                            <span style="color: #888; font-size: 12px;">SF Pro, 16px</span>
                        </div>
                    </div>

                    <!-- PRO & Tools -->
                    <div class="tools-section" style="flex-shrink: 0; display: flex; flex-direction: column; gap: 15px;">
                        <div class="glass-card list-item ai-coach uniform-tool" onclick="switchTab('ai-analytics-dashboard')" style="background: #111118; border: 1px solid rgba(255,152,0,0.3); border-radius: 16px; padding: 15px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                            <div class="list-left" style="display: flex; align-items: center; gap: 15px;">
                                <div class="list-icon" style="background: rgba(255,152,0,0.1); color: #FF9800; width: 40px; height: 40px; border-radius: 8px; display: flex; justify-content: center; align-items: center;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                                </div>
                                <h3 class="ai-title" style="color: #FFF; margin: 0; font-size: 16px; font-weight: 600;">Analizy AI <span style="color: #FF9800; font-size: 12px; margin-left: 5px;">PRO</span></h3>
                            </div>
                        </div>
                        
                        <div class="glass-card list-item coffee-tool uniform-tool" onclick="switchTab('help-dashboard')" style="background: #111118; border: 1px solid rgba(255,193,7,0.3); border-radius: 16px; padding: 15px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                            <div class="list-left" style="display: flex; align-items: center; gap: 15px;">
                                <div class="list-icon" style="background: rgba(255,193,7,0.1); color: #FFC107; width: 40px; height: 40px; border-radius: 8px; display: flex; justify-content: center; align-items: center;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>
                                </div>
                                <h3 class="coffee-title" style="color: #FFF; margin: 0; font-size: 16px; font-weight: 600;">Postaw Kawę</h3>
                            </div>
                        </div>
                    </div>
                </div>`;

const startIdx = content.indexOf('<div id="welcome-screen"');
const endIdx = content.indexOf('<div id="measurements-dashboard"');
if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + newWelcome + '\n        ' + content.substring(endIdx);
    fs.writeFileSync('index.html', content);
    console.log("Updated index.html welcome screen");
} else {
    console.log("Could not find bounds");
}
