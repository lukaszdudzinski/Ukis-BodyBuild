export const PWAUpdateUI = {
    pwaWorker: null,
    
    init: () => {
        window.PWAUpdateUI = PWAUpdateUI;
        if (!('serviceWorker' in navigator)) return;
        
        // CLEANUP: Usuń zepsute service workery z poprzednich błędnych rejestracji
        navigator.serviceWorker.getRegistrations().then(registrations => {
            let needsReload = false;
            for (let reg of registrations) {
                if (reg.active && reg.active.scriptURL.includes('?update=')) {
                    reg.unregister();
                    needsReload = true;
                }
            }
            if (needsReload) {
                // Odczekaj chwilę i odśwież by system załadował czysty stan
                setTimeout(() => window.location.reload(), 500);
            }
        });

        PWAUpdateUI.injectBannerHTML();
        PWAUpdateUI.bindEvents();
        PWAUpdateUI.registerAndMonitor();
    },

    injectBannerHTML: () => {
        if (document.getElementById('pwa-update-banner')) return;
        
        const html = `
            <div id="pwa-update-banner" style="display: none; position: fixed; top: 0; left: 0; right: 0; background: #FF9800; color: #000; padding: 15px; text-align: center; z-index: 10000; box-shadow: 0 4px 6px rgba(0,0,0,0.3); animation: slideDown 0.5s ease-out;">
                <div style="font-weight: bold; margin-bottom: 10px;">Dostępna nowa aktualizacja! 🚀</div>
                <div style="display: flex; justify-content: center; gap: 10px;">
                    <button id="pwa-update-btn-refresh" style="padding: 8px 16px; background: #000; color: #FF9800; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
                        Zaktualizuj
                    </button>
                    <button id="pwa-update-btn-changelog" style="padding: 8px 16px; background: rgba(0,0,0,0.1); color: #000; border: 1px solid #000; border-radius: 4px; font-weight: bold; cursor: pointer;">
                        Co nowego?
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    },

    doPwaUpdate: () => {
        if (PWAUpdateUI.pwaWorker) {
            PWAUpdateUI.pwaWorker.postMessage('SKIP_WAITING');
            // Fallback: jeśli controllerchange nie odpali się samo, wymuś po 1 sekundzie
            setTimeout(() => window.location.reload(), 1000);
        } else {
            window.location.reload();
        }
    },

    bindEvents: () => {
        document.getElementById('pwa-update-btn-refresh').addEventListener('click', PWAUpdateUI.doPwaUpdate);
        
        document.getElementById('pwa-update-btn-changelog').addEventListener('click', () => {
            const btn = document.getElementById('changelog-update-now-btn');
            if (btn) btn.style.display = 'block';
            if (window.showChangelogModal) {
                window.showChangelogModal(window.APP_VERSION);
            }
        });

        // Kiedy nowy SW przejmuje kontrole - restart
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });
    },

    showUpdateBanner: (worker) => {
        PWAUpdateUI.pwaWorker = worker;
        const banner = document.getElementById('pwa-update-banner');
        if (banner) banner.style.display = 'block';
    },

    registerAndMonitor: () => {
        // Standard Registration (PWA handles updates automatically based on byte-diff of sw.js)
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('PWA Service Worker Registered (Cache-Busted)');

                if (registration.waiting) {
                    PWAUpdateUI.showUpdateBanner(registration.waiting);
                }

                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            PWAUpdateUI.showUpdateBanner(newWorker);
                        }
                    });
                });

                // Wbudowany mechanizm PWA - co 5 minut
                setInterval(() => {
                    registration.update();
                }, 1000 * 60 * 5);

                // Powrót do widoku aplikacji
                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible') registration.update();
                });
                
                // Pasywne intencje (kliknięcia użytkownika by obejść wyciszanie timera na PC)
                document.body.addEventListener('click', () => {
                    if (Math.random() < 0.05) registration.update();
                }, { passive: true });
                
                // Agresywny Fallback
                setInterval(async () => {
                    try {
                        const res = await fetch(`CHANGELOG.json?_t=${Date.now()}`);
                        const data = await res.json();
                        const serverVersion = data[0].version;
                        if (window.APP_VERSION && serverVersion !== window.APP_VERSION) {
                            registration.update();
                        }
                    } catch(e) {}
                }, 1000 * 60 * 2);

            })
            .catch(err => console.log('SW Registration Failed', err));
    }
};
