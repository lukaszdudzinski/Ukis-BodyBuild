import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Font
if (!html.includes('family=Outfit')) {
    html = html.replace('</head>', '    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet">\n</head>');
}

// 2. Add blobs
if (!html.includes('class="blob-1"')) {
    const blobs = `
    <!-- Blobs for Glassmorphism -->
    <div class="blob-1"></div>
    <div class="blob-2"></div>
    <div class="blob-3"></div>
`;
    html = html.replace('<div class="app-wrapper">', blobs + '\n    <div class="app-wrapper">');
}

// 3. Remove sidebar-nav
const sidebarStart = html.indexOf('<nav class="sidebar-nav">');
if (sidebarStart !== -1) {
    const sidebarEnd = html.indexOf('</nav>', sidebarStart) + 6;
    html = html.slice(0, sidebarStart) + html.slice(sidebarEnd);
}

// 4. Remove mobile-header
const headerStart = html.indexOf('<div class="mobile-header"');
if (headerStart !== -1) {
    const headerEnd = html.indexOf('</div>', headerStart) + 6;
    html = html.slice(0, headerStart) + html.slice(headerEnd);
}

// 5. Add Bottom Navigation
if (!html.includes('bottom-nav-bar')) {
    const bottomNav = `
        <!-- Bottom Navigation -->
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
                <div class="nav-icon">⚙️</div>
                <span>Ustawienia</span>
            </div>
        </div>
    `;
    html = html.replace('</main>', '</main>\n' + bottomNav);
}

// 6. Replace welcome-screen
const welcomeStart = html.indexOf('<div id="welcome-screen" class="tab-content active-tab">');
if (welcomeStart !== -1) {
    // Find the next sibling tab-content to know where welcome-screen ends
    const nextTabStart = html.indexOf('<div id="measurements-dashboard"', welcomeStart);
    if (nextTabStart !== -1) {
        const newWelcome = `
                <div id="welcome-screen" class="tab-content active-tab glass-dashboard">
                    <!-- Top Header -->
                    <div class="glass-header">
                        <div class="avatar-circle" onclick="switchTab('settings-panel')">
                            <img src="https://ui-avatars.com/api/?name=Uki&background=111&color=fff&rounded=true" alt="Avatar">
                        </div>
                        <div class="logo-center">
                            <div class="logo-icon">Uki</div>
                            <span class="logo-text">BodyBuild</span>
                        </div>
                        <div class="header-btn" onclick="switchTab('settings-panel')">⚙️</div>
                    </div>

                    <!-- Main CTA -->
                    <div class="glass-card main-cta" onclick="switchTab('training-dashboard')">
                        <div class="cta-glow"></div>
                        <div class="cta-content">
                            <span class="cta-subtitle">Aktywny proces</span>
                            <h2 class="cta-title">Trening & Kalendarz</h2>
                        </div>
                        <div class="cta-footer">
                            <div class="play-btn">▶</div>
                            <span>Otwórz kalendarz i logi</span>
                        </div>
                    </div>

                    <!-- Grid -->
                    <div class="glass-grid">
                        <div class="glass-card grid-item" onclick="switchTab('analytics-dashboard')">
                            <div class="grid-icon text-green">📈</div>
                            <h3>Analiza</h3>
                        </div>
                        <div class="glass-card grid-item" onclick="switchTab('history-dashboard')">
                            <div class="grid-icon text-purple">📚</div>
                            <h3>Historia</h3>
                        </div>
                        <div class="glass-card grid-item" onclick="switchTab('measurements-dashboard')">
                            <div class="grid-icon text-yellow">📏</div>
                            <h3>Pomiary</h3>
                        </div>
                        <div class="glass-card grid-item" onclick="switchTab('diet-dashboard')">
                            <div class="grid-icon text-red">🥗</div>
                            <h3>Dieta</h3>
                        </div>
                    </div>

                    <!-- PRO & Tools -->
                    <div class="tools-section">
                        <div class="glass-card list-item ai-coach" onclick="switchTab('ai-analytics-dashboard')">
                            <div class="ai-glow"></div>
                            <div class="list-left">
                                <div class="list-icon ai-icon">🤖</div>
                                <h3 class="ai-title">Analizy AI <span class="pro-badge">PRO</span></h3>
                            </div>
                            <div class="list-right text-orange">→</div>
                        </div>

                        <div class="glass-card list-item diag-tool" onclick="switchTab('diagnostics-dashboard')">
                            <div class="diag-glow"></div>
                            <div class="list-left">
                                <div class="list-icon diag-icon">🛠️</div>
                                <h3 class="diag-title">Diagnostyka Systemu</h3>
                            </div>
                            <div class="list-right text-red">→</div>
                        </div>
                        
                        <div class="glass-card list-item coffee-tool" onclick="switchTab('help-dashboard')">
                            <div class="coffee-glow"></div>
                            <div class="list-left">
                                <div class="list-icon coffee-icon">☕</div>
                                <h3 class="coffee-title">Postaw Kawę Twórcom</h3>
                            </div>
                            <div class="list-right text-yellow">→</div>
                        </div>
                    </div>
                </div>
        `;
        html = html.slice(0, welcomeStart) + newWelcome + html.slice(nextTabStart);
    }
}

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully.');
