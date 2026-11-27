// Okno „Co nowego” ma wygląd paska aktualizacji, wspólny dla aplikacji UKIS (decyzja właściciela 2026-11-15; wzór:
// <ukis-changelog> z packages/ui): pomarańczowe tło, czarny tekst, „Zamknij” z obwódką, czarny „Zaktualizuj”, na środku ekranu.
// Z paska (z „Zaktualizuj”): „Zamknij” z lewej, „Zaktualizuj” z prawej. Samo po aktualizacji: tylko „Zamknij” na całą szerokość.
const ICONS = {
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'refresh-cw': '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
};
const icon = (name) => `<span class="ukis-cl-ico"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg></span>`;

const CSS = `
#changelog-modal-overlay { position: fixed; inset: 0; z-index: 9999; justify-content: center; align-items: center; padding: 16px; box-sizing: border-box; background: rgba(0,0,0,.55); font-family: var(--ukis-font, 'Inter', system-ui, sans-serif); text-shadow: none; letter-spacing: normal; }
#changelog-modal-overlay * { text-shadow: none; }
#changelog-modal-overlay *, #changelog-modal-overlay *::before, #changelog-modal-overlay *::after { box-sizing: border-box; }
#changelog-modal-overlay .ukis-cl-panel { width: min(480px, 100%); max-height: 85vh; overflow: auto; padding: 20px; background: #FF9800; color: #000; border: none; border-radius: 14px; box-shadow: 0 20px 50px rgba(0,0,0,.45); text-align: left; }
#changelog-modal-overlay .ukis-cl-ico { display: inline-flex; width: 20px; height: 20px; flex: none; }
#changelog-modal-overlay .ukis-cl-ico svg { width: 100%; height: 100%; }
#changelog-modal-overlay h3.ukis-cl-title { display: flex; gap: 8px; align-items: center; margin: 0 0 12px; font-size: 1.2rem; font-weight: 700; color: #000; }
#changelog-modal-overlay #changelog-content { font-size: .95rem; line-height: 1.5; color: #000; }
#changelog-modal-overlay .ukis-cl-entry { margin: 0 0 16px; }
#changelog-modal-overlay .ukis-cl-entry h4 { margin: 0 0 6px; font-size: 1rem; font-weight: 700; color: #000; display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
#changelog-modal-overlay .ukis-cl-date { color: #3a2400; font-weight: 500; }
#changelog-modal-overlay .ukis-cl-entry ul { margin: 0; padding-left: 20px; line-height: 1.5; color: #000; }
#changelog-modal-overlay .ukis-cl-entry li { margin: 0 0 4px; }
#changelog-modal-overlay .ukis-cl-urgent { display: flex; gap: 6px; align-items: center; font-weight: 700; margin: 4px 0; }
#changelog-modal-overlay .ukis-cl-actions { display: grid; grid-template-columns: 1fr; gap: 8px; margin-top: 14px; }
#changelog-modal-overlay .ukis-cl-actions.two { grid-template-columns: 1fr 1fr; }
#changelog-modal-overlay .ukis-cl-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; min-height: 44px; padding: 0 16px; border-radius: 10px; font: inherit; font-weight: 600; cursor: pointer; }
#changelog-modal-overlay .ukis-cl-btn.ghost { border: 1px solid currentColor; background: transparent; color: #000; }
#changelog-modal-overlay .ukis-cl-btn.primary { min-height: 48px; border: none; background: #000; color: #FF9800; }
#changelog-modal-overlay .ukis-cl-btn[hidden] { display: none; }
#changelog-modal-overlay .ukis-cl-btn:focus-visible { outline: 2px solid #000; outline-offset: 2px; }
`;

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const ChangelogUI = {
    init: () => {
        ChangelogUI.injectModalHTML();
        ChangelogUI.bindEvents();

        // Expose globally for PWA Update calls
        window.showChangelogModal = ChangelogUI.showChangelogModal;
    },

    injectModalHTML: () => {
        if (document.getElementById('changelog-modal-overlay')) return;

        if (!document.getElementById('ukis-changelog-css')) {
            const style = document.createElement('style');
            style.id = 'ukis-changelog-css';
            style.textContent = CSS;
            document.head.appendChild(style);
        }

        const html = `
            <div id="changelog-modal-overlay" style="display: none;">
                <div class="ukis-cl-panel" role="dialog" aria-modal="true" aria-labelledby="changelog-title">
                    <h3 class="ukis-cl-title" id="changelog-title">${icon('sparkles')}<span>Co nowego</span></h3>
                    <div id="changelog-content">
                        <p>Ładowanie zmian...</p>
                    </div>
                    <div class="ukis-cl-actions">
                        <button type="button" id="changelog-close-btn" class="ukis-cl-btn primary">${icon('x')}<span>Zamknij</span></button>
                        <button type="button" id="changelog-update-now-btn" class="ukis-cl-btn primary" hidden>${icon('refresh-cw')}<span>Zaktualizuj</span></button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    },

    close: () => {
        const overlay = document.getElementById('changelog-modal-overlay');
        if (overlay) overlay.style.display = 'none';
    },

    bindEvents: () => {
        const overlay = document.getElementById('changelog-modal-overlay');
        if (overlay) {
            // Jak w <ukis-changelog>: stuknięcie obok okna i Escape zamykają je.
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) ChangelogUI.close();
            });
            overlay.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') ChangelogUI.close();
            });
        }

        const closeBtn = document.getElementById('changelog-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', ChangelogUI.close);

        const updateBtn = document.getElementById('changelog-update-now-btn');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                // Wywołaj funkcję PWAUpdateUI o ile istnieje
                if (window.PWAUpdateUI && typeof window.PWAUpdateUI.doPwaUpdate === 'function') {
                    updateBtn.disabled = true;
                    window.PWAUpdateUI.doPwaUpdate();
                } else {
                    window.location.reload();
                }
            });
        }
    },

    // opts.withUpdateButton: okno otwarte z paska aktualizacji, z przyciskiem „Zaktualizuj”.
    showChangelogModal: async (compareVersionStr, opts = {}) => {
        const overlay = document.getElementById('changelog-modal-overlay');
        const withUpdate = !!opts.withUpdateButton;
        const closeBtn = document.getElementById('changelog-close-btn');
        const updateBtn = document.getElementById('changelog-update-now-btn');
        if (updateBtn) {
            updateBtn.hidden = !withUpdate;
            updateBtn.style.display = '';
            updateBtn.disabled = false;
        }
        if (closeBtn) closeBtn.className = `ukis-cl-btn ${withUpdate ? 'ghost' : 'primary'}`;
        const actions = overlay?.querySelector('.ukis-cl-actions');
        if (actions) actions.classList.toggle('two', withUpdate);
        if (overlay) overlay.style.display = 'flex';
        if (closeBtn) {
            try { closeBtn.focus({ preventScroll: true }); } catch (e) {}
        }

        try {
            const res = await fetch(`CHANGELOG.json?t=${new Date().getTime()}`);
            const data = await res.json();

            let updatesToShow = [];
            if (compareVersionStr === 'latest_only') {
                updatesToShow = data.length > 0 ? [data[0]] : [];
            } else if (compareVersionStr === 'all') {
                updatesToShow = data;
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
                updatesToShow.forEach((log) => {
                    html += `<div class="ukis-cl-entry">`;
                    html += `<h4><span>${escapeHtml(log.version)}</span><span class="ukis-cl-date">${escapeHtml(log.date || '')}</span></h4>`;
                    if (log.urgent) html += `<div class="ukis-cl-urgent">${icon('alert-triangle')}<span>${escapeHtml(log.urgent)}</span></div>`;
                    html += `<ul>`;
                    log.changes.forEach(change => {
                        html += `<li>${change}</li>`;
                    });
                    html += `</ul></div>`;
                });
            } else {
                html = '<p>Brak danych o zmianach.</p>';
            }

            document.getElementById('changelog-content').innerHTML = html;
        } catch(e) {
            document.getElementById('changelog-content').innerHTML = "Nie udało się załadować listy zmian.";
        }
    }
};
