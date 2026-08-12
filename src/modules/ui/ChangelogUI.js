export const ChangelogUI = {
    init: () => {
        ChangelogUI.injectModalHTML();
        ChangelogUI.bindEvents();
        
        // Expose globally for PWA Update calls
        window.showChangelogModal = ChangelogUI.showChangelogModal;
    },

    injectModalHTML: () => {
        if (document.getElementById('changelog-modal-overlay')) return;

        const html = `
            <div id="changelog-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 9999; justify-content: center; align-items: center; padding: 20px;">
                <div style="background: #1e1e1e; width: 100%; max-width: 500px; border-radius: 12px; border: 1px solid rgba(0, 191, 255, 0.3); display: flex; flex-direction: column; max-height: 80vh;">
                    
                    <div style="padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0; color: #00BFFF;">Co nowego? 🚀</h3>
                        <button id="changelog-close-btn" style="background: none; border: none; color: #aaa; font-size: 1.5rem; cursor: pointer; padding: 0;">&times;</button>
                    </div>
                    
                    <div id="changelog-content" style="padding: 20px; overflow-y: auto; flex: 1; font-size: 0.95rem; line-height: 1.5;">
                        <p style="text-align: center; color: #888;">Ładowanie zmian...</p>
                    </div>
                    
                    <div style="padding: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
                        <button id="changelog-update-now-btn" style="width: 100%; padding: 12px; font-size: 1.1rem; font-weight: bold; background: #FF9800; color: #000; border: none; border-radius: 8px; cursor: pointer; display: none;">
                            Zaktualizuj
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    },

    bindEvents: () => {
        const closeBtn = document.getElementById('changelog-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('changelog-modal-overlay').style.display = 'none';
            });
        }

        const updateBtn = document.getElementById('changelog-update-now-btn');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                // Wywołaj funkcję PWAUpdateUI o ile istnieje
                if (window.PWAUpdateUI && typeof window.PWAUpdateUI.doPwaUpdate === 'function') {
                    window.PWAUpdateUI.doPwaUpdate();
                } else {
                    window.location.reload();
                }
            });
        }
    },

    showChangelogModal: async (compareVersionStr) => {
        const overlay = document.getElementById('changelog-modal-overlay');
        if (overlay) overlay.style.display = 'flex';
        
        try {
            const res = await fetch(`CHANGELOG.json?t=${new Date().getTime()}`);
            const data = await res.json();
            
            let updatesToShow = [];
            if (compareVersionStr === 'latest_only') {
                updatesToShow = data.length > 0 ? [data[0]] : [];
            } else {
                const compareVer = compareVersionStr || window.APP_VERSION || 'v.0.0.0';
                const parseVersion = (v) => {
                    const parts = v.replace(/^v\.?/, '').split('.').map(n => parseInt(n, 10) || 0);
                    return (parts[0] * 10000000000) + (parts[1] * 100000000) + (parts[2] * 1000000) + (parts[3] || 0);
                };
                const compareScore = parseVersion(compareVer);
                const newerUpdates = data.filter(log => parseVersion(log.version) > compareScore);
                updatesToShow = newerUpdates.length > 0 ? newerUpdates : [data[0]];
            }
            
            let html = '';
            if (updatesToShow && updatesToShow.length > 0 && updatesToShow[0]) {
                html += '<div style="display: flex; flex-direction: column; gap: 20px;">';
                updatesToShow.forEach((log) => {
                    html += `<div>`;
                    html += `<h4 style="margin: 0 0 10px 0; color: #fff;">Wersja ${log.version} <span style="color: #666; font-size: 0.8em; font-weight: normal;">(${log.date})</span></h4>`;
                    html += `<ul style="margin: 0; padding-left: 20px; color: #aaa;">`;
                    log.changes.forEach(change => {
                        html += `<li style="margin-bottom: 6px;">${change}</li>`;
                    });
                    html += `</ul></div>`;
                });
                html += '</div>';
            } else {
                html = '<p style="color: #aaa;">Brak danych o zmianach.</p>';
            }

            document.getElementById('changelog-content').innerHTML = html;
        } catch(e) {
            document.getElementById('changelog-content').innerHTML = "Nie udało się załadować listy zmian.";
        }
    }
};
