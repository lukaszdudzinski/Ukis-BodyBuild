import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// 1. Replace Welcome Screen
const welcomeStart = html.indexOf('<div id="welcome-screen"');
const welcomeEnd = html.indexOf('<div id="measurements-dashboard"');

if (welcomeStart !== -1 && welcomeEnd !== -1) {
    const newWelcome = `
                <div id="welcome-screen" class="tab-content active-tab glass-dashboard">
                    <!-- Top Header -->
                    <div class="glass-header" style="margin-bottom: 5px;">
                        <div class="avatar-circle" onclick="switchTab('settings-panel')">
                            <img id="user-avatar-img" src="https://ui-avatars.com/api/?name=Uki&background=111&color=fff&rounded=true" alt="Avatar">
                        </div>
                        <div class="header-btn" onclick="switchTab('settings-panel')">⚙️</div>
                    </div>

                    <!-- ORYGINALNE, DUŻE LOGO Z PULSACJĄ -->
                    <div style="display: flex; justify-content: center; width: 100%;">
                        <img src="img/logo.png" alt="Uki BodyBuild Logo" class="home-logo" onerror="this.src='https://ui-avatars.com/api/?name=Uki&background=111&color=fff&rounded=true'"/>
                    </div>

                    <!-- Main CTA -->
                    <div class="glass-card main-cta" onclick="switchTab('training-dashboard')" style="flex-shrink: 0;">
                        <div class="cta-glow"></div>
                        <div class="cta-content">
                            <span class="cta-subtitle">Aktywny proces</span>
                            <h2 class="cta-title">Trening &<br>Kalendarz</h2>
                        </div>
                        <div class="cta-footer">
                            <div class="play-btn">▶</div>
                            <span>Otwórz kalendarz i logi</span>
                        </div>
                    </div>

                    <!-- Grid -->
                    <div class="glass-grid" style="flex-shrink: 0;">
                        <div class="glass-card grid-item uniform-tool" onclick="switchTab('analytics-dashboard')">
                            <div class="grid-icon text-green">📈</div>
                            <h3>Analiza</h3>
                        </div>
                        <div class="glass-card grid-item uniform-tool" onclick="switchTab('history-dashboard')">
                            <div class="grid-icon text-purple">📚</div>
                            <h3>Historia</h3>
                        </div>
                        <div class="glass-card grid-item uniform-tool" onclick="switchTab('measurements-dashboard')">
                            <div class="grid-icon text-yellow">📏</div>
                            <h3>Pomiary</h3>
                        </div>
                        <div class="glass-card grid-item uniform-tool" onclick="switchTab('diet-dashboard')">
                            <div class="grid-icon text-red">🥗</div>
                            <h3>Dieta</h3>
                        </div>
                    </div>

                    <!-- PRO & Tools -->
                    <div class="tools-section" style="flex-shrink: 0;">
                        <div class="glass-card list-item ai-coach uniform-tool" onclick="switchTab('ai-analytics-dashboard')" style="border-color: rgba(255,152,0,0.3);">
                            <div class="list-left">
                                <div class="list-icon" style="background: rgba(255,152,0,0.1); border: 1px solid rgba(255,152,0,0.2);">🤖</div>
                                <h3 class="ai-title">Analizy AI <span class="pro-badge">PRO</span></h3>
                            </div>
                            <div class="list-right text-gray-500 text-xl">→</div>
                        </div>
                        
                        <div class="glass-card list-item coffee-tool uniform-tool" onclick="switchTab('help-dashboard')" style="position: relative; overflow: hidden;">
                            <div class="list-left" style="position: relative; z-index: 10;">
                                <div class="list-icon" style="width: 40px; height: 40px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.2);">
                                    <img src="img/coffee.jpg" alt="Kawa" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                                <h3 class="coffee-title" style="color: #fff;">Postaw Kawę Twórcom</h3>
                            </div>
                            <div class="list-right text-gray-500 text-xl" style="position: relative; z-index: 10;">→</div>
                        </div>
                    </div>
                </div>
        `;
    html = html.slice(0, welcomeStart) + newWelcome + html.slice(welcomeEnd);
}

// 2. Replace Bottom Navigation (Make it 4 items)
const navStart = html.indexOf('<div class="bottom-nav-bar">');
const navEnd = html.indexOf('</div>\n    \n    </div>', navStart);

if (navStart !== -1 && navEnd !== -1) {
    const newNav = `
        <div class="bottom-nav-bar">
            <div class="nav-btn active" onclick="switchTab('welcome-screen')">
                <div class="nav-icon">🏠</div>
                <span>Menu</span>
            </div>
            <div class="nav-btn" onclick="switchTab('training-dashboard')">
                <div class="nav-icon">🏋️</div>
                <span>Trening</span>
            </div>
            <div class="nav-btn" onclick="switchTab('settings-panel')">
                <div class="nav-icon">👤</div>
                <span>Profil</span>
            </div>
            <div class="nav-btn" onclick="switchTab('diagnostics-dashboard')">
                <div class="nav-icon">🛠️</div>
                <span>Serwis</span>
            </div>
        </div>
    `;
    // We add 6 because '</div>' is length 6, actually let's match correctly
    html = html.substring(0, navStart) + newNav + html.substring(navEnd + 6);
}

// 3. Remove the redundant tiles-mode-home-btn
html = html.replace('<button id="tiles-mode-home-btn" aria-label="Wróć do menu"></button>', '');

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully with V4.');
