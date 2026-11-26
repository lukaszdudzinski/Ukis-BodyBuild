// pwa-updater.js (Independent PWA Updater)
// This script runs entirely isolated from the main application modules.
// If the main application crashes due to a SyntaxError, this script will still execute
// and provide users with a PWA update banner.
//
// Pasek aktualizacji ma wspólny wygląd wszystkich aplikacji UKIS (decyzja właściciela 2026-11-15). To przeniesienie 1:1
// komponentu <ukis-update-banner> z packages/ui (BodyBuild nie ma kroku budowania, a komponent jest w TypeScripcie):
// pomarańczowy pasek na dole, tuż nad dolnym menu aplikacji (zmierzonym, razem z obszarem bezpiecznym), nigdy nad treścią;
// „Co nowego?” i „Wstrzymaj” obok siebie, pod nimi szeroki „Zaktualizuj”. Wydanie pilne: bez „Wstrzymaj”, z powodem.

(function() {
    // Klucz z prefiksem aplikacji (AGENTS.md, zasada 2). sessionStorage: „Wstrzymaj” działa do następnego otwarcia aplikacji.
    const LATER_KEY = 'ukis.bodybuild.update.later';
    const TXT = {
        title: 'Dostępna nowa wersja',
        urgentTitle: 'Ważna aktualizacja',
        apply: 'Zaktualizuj',
        applying: 'Aktualizuję…',
        whatsNew: 'Co nowego?',
        later: 'Wstrzymaj',
        dataSafe: 'Twoje dane zostają bez zmian',
    };

    // Ikony w stylu Lucide (ISC), te same co w packages/ui/src/icons.ts
    const PATHS = {
        download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
        'refresh-cw': '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
        sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
        'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
        'pause-circle': '<circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/>',
    };
    const iconHtml = (name) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${PATHS[name]}</svg>`;

    // Arkusz bazowy (packages/ui/src/dom.ts) + arkusz paska (update-banner.ts). Shadow DOM: style aplikacji go nie ruszają.
    const BAR_CSS = `
:host { all: initial; display: block; font-family: 'Outfit', system-ui, -apple-system, sans-serif; }
:host([hidden]) { display: none; }
*, *::before, *::after { box-sizing: border-box; }
.ico { display: inline-flex; width: 20px; height: 20px; flex: none; }
.ico svg { width: 100%; height: 100%; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; min-width: 44px; padding: 0 16px; border-radius: 14px; border: 1px solid rgba(255,255,255,.12); background: transparent; color: inherit; font: inherit; font-weight: 600; cursor: pointer; }
.btn:disabled { opacity: .55; cursor: default; }
.btn:focus-visible { outline: 2px solid #000; outline-offset: 2px; }
.bar { position: fixed; left: 12px; right: 12px; bottom: var(--ukis-banner-bottom, calc(12px + env(safe-area-inset-bottom, 0px))); z-index: 1005; max-width: 560px; margin: 0 auto; padding: 12px 14px 14px; border-radius: 14px; background: #FF9800; color: #000; box-shadow: 0 10px 28px rgba(0,0,0,.4); font-size: 16px; line-height: 1.3; text-align: left; }
.head { display: flex; gap: 8px; align-items: center; font-weight: 700; }
.sub { margin: 2px 0 10px 28px; font-size: .85rem; line-height: 1.35; color: #3a2400; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
.pair.one { grid-template-columns: 1fr; }
.pair .btn { width: 100%; border: 1px solid currentColor; background: transparent; color: inherit; border-radius: 10px; padding: 0 8px; }
.btn.apply { width: 100%; min-height: 48px; border: none; border-radius: 10px; background: #000; color: #FF9800; }
`;

    // Miejsce na pasek w aplikacji (oba wyglądy i Strefa trenera). --ukis-banner-space = wysokość paska z odstępem, gdy widoczny.
    // z-index paska 1005: nad dolnym menu (1000) i Strefą trenera (1001), pod oknami aplikacji (od 1010).
    const PAGE_CSS = `
html.ukis-pasek-aktualizacji .tab-content-wrapper { padding-bottom: var(--ukis-banner-space, 0px) !important; }
html.ukis-pasek-aktualizacji .tz-main { padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px) + var(--ukis-banner-space, 0px)); }
html.ukis-pasek-aktualizacji #landing-page { padding-bottom: var(--ukis-banner-space, 0px); }
html.ukis-pasek-aktualizacji #unified-bottom-sheet { bottom: var(--ukis-banner-space, 0px) !important; }
html.ukis-pasek-aktualizacji #edward-chat-toggle,
html.ukis-pasek-aktualizacji #edward-chat-window,
html.ukis-pasek-aktualizacji #edward-contextual-bubble,
html.ukis-pasek-aktualizacji .tz-toast { translate: 0 calc(-1 * var(--ukis-banner-space, 0px)); }
html.ukis-pasek-aktualizacji #edward-chat-window { max-height: calc(100vh - 120px - var(--ukis-banner-space, 0px)) !important; }
`;

    // Dolne menu, nad którym stoi pasek: Strefa trenera (własny pasek), menu aplikacji, powrót do Strefy.
    const NAV_SELECTORS = ['#trainer-zone .tz-nav', '.bottom-nav-bar', '.tz-return'];
    const NAV_GAP = 10;

    const parseVersion = (v) => {
        const parts = String(v || '').replace(/^v\.?/, '').split('.').map(n => parseInt(n, 10) || 0);
        return (parts[0] * 10000000000) + ((parts[1] || 0) * 100000000) + ((parts[2] || 0) * 1000000) + (parts[3] || 0);
    };
    const currentVersion = () => document.querySelector('meta[name="app-version"]')?.content || window.APP_VERSION || 'v.0.0.0';
    const sessionGet = (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
    const sessionSet = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} };

    window.PWAUpdateUI = {
        pwaWorker: null,
        // Aktualizacja tylko na żądanie: przeładowanie po zmianie workera wyłącznie po kliknięciu „Zaktualizuj”
        userClickedUpdate: false,
        // Wersja czekająca na „Zaktualizuj” (z CHANGELOG.json z sieci) i powód wydania pilnego (pole `urgent`).
        available: null,
        urgent: null,
        applying: false,
        _waiting: false,
        _host: null,
        _bar: null,
        _resize: null,
        _mutations: null,
        _frame: 0,

        init: () => {
            if (!('serviceWorker' in navigator)) return;
            // Disable SW in Playwright E2E tests to prevent random reloads
            if (window.navigator.webdriver) return;

            // CLEANUP: Usuń zepsute service workery BodyBuild z poprzednich błędnych rejestracji
            window.PWAUpdateUI.cleanupBrokenWorkers().then(needsReload => {
                if (needsReload) {
                    // Odczekaj chwilę i odśwież by system załadował czysty stan
                    setTimeout(() => window.location.reload(true), 500);
                }
            }).catch(e => {
                console.warn("cleanupBrokenWorkers failed (often due to testing in file://):", e);
            });

            window.PWAUpdateUI.bindEvents();
            window.PWAUpdateUI.registerAndMonitor();
        },

        // Wyrejestrowuje własne (w zakresie BodyBuild) workery z `?update=` w adresie skryptu.
        // Zwraca true, gdy któryś wyrejestrowano. Nie dotyka rejestracji sąsiednich aplikacji UKIS.
        cleanupBrokenWorkers: async () => {
            const registrations = await window.UkiScope.getOwnRegistrations();
            let removed = false;
            for (const reg of registrations) {
                if (reg.active && reg.active.scriptURL.includes('?update=')) {
                    await reg.unregister();
                    removed = true;
                }
            }
            return removed;
        },

        // Host paska (Shadow DOM) i arkusz miejsca na pasek; powstają przy pierwszym pokazaniu paska.
        injectBannerHTML: () => {
            const ui = window.PWAUpdateUI;
            const existing = document.getElementById('pwa-update-banner');
            if (existing) {
                ui._host = existing;
                return;
            }
            if (!document.getElementById('ukis-pasek-aktualizacji-css')) {
                const style = document.createElement('style');
                style.id = 'ukis-pasek-aktualizacji-css';
                style.textContent = PAGE_CSS;
                document.head.appendChild(style);
            }
            const host = document.createElement('div');
            host.id = 'pwa-update-banner';
            host.hidden = true;
            host.attachShadow({ mode: 'open' });
            document.body.appendChild(host);
            ui._host = host;
        },

        doPwaUpdate: async () => {
            window.PWAUpdateUI.userClickedUpdate = true;
            if (window.PWAUpdateUI.pwaWorker) {
                window.PWAUpdateUI.pwaWorker.postMessage('SKIP_WAITING');
                setTimeout(async () => {
                    await window.UkiScope.deleteOwnCaches();
                    window.location.reload(true);
                }, 1000);
            } else {
                // Twarde czyszczenie jeśli nie złapaliśmy nowego workera (tylko własna rejestracja i cache BodyBuild)
                await window.UkiScope.unregisterOwn();
                await window.UkiScope.deleteOwnCaches();
                window.location.reload(true);
            }
        },

        bindEvents: () => {
            // Nowy SW przejął kontrolę po kliknięciu „Zaktualizuj”: restart. Bez kliknięcia nic nie przeładowujemy.
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing && window.PWAUpdateUI.userClickedUpdate) {
                    refreshing = true;
                    window.location.reload(true);
                }
            });
        },

        // Czekający worker: pasek pokazuje się po odczytaniu changelogu (numer nowej wersji i ewentualny powód pilności),
        // żeby wstrzymana wersja nie mignęła.
        showUpdateBanner: async (worker) => {
            const ui = window.PWAUpdateUI;
            ui.pwaWorker = worker;
            ui._waiting = true;
            ui.injectBannerHTML();
            await ui.loadReleaseInfo();
            ui.render();
        },

        loadReleaseInfo: async () => {
            const ui = window.PWAUpdateUI;
            try {
                const res = await fetch(`CHANGELOG.json?_t=${Date.now()}`, { cache: 'no-store' });
                const log = await res.json();
                if (!Array.isArray(log) || !log.length) return;
                const current = parseVersion(currentVersion());
                ui.available = log[0].version || null;
                const top = parseVersion(ui.available);
                const hit = log
                    .filter(e => e && e.urgent && parseVersion(e.version) > current && parseVersion(e.version) <= top)
                    .sort((a, b) => parseVersion(b.version) - parseVersion(a.version))[0];
                ui.urgent = hit ? String(hit.urgent) : null;
            } catch (e) {
                // Bez changelogu: zwykły pasek, „Wstrzymaj” dla tej sesji
            }
        },

        isSnoozed: () => {
            const ui = window.PWAUpdateUI;
            return !ui.urgent && sessionGet(LATER_KEY) === (ui.available || 'oczekuje');
        },

        // „Wstrzymaj”: pasek znika do następnego otwarcia aplikacji (wydanie pilne nie ma tego przycisku).
        later: () => {
            const ui = window.PWAUpdateUI;
            if (ui.urgent) return;
            sessionSet(LATER_KEY, ui.available || 'oczekuje');
            ui.render();
        },

        showWhatsNew: () => {
            if (window.showChangelogModal) window.showChangelogModal(currentVersion(), { withUpdateButton: true });
        },

        render: () => {
            const ui = window.PWAUpdateUI;
            const host = ui._host;
            if (!host) return;
            const root = host.shadowRoot;
            if (!ui._waiting || ui.isSnoozed()) {
                root.replaceChildren();
                host.hidden = true;
                ui.watch(null);
                return;
            }
            const urgent = ui.urgent !== null;
            const el = (tag, cls, text) => {
                const e = document.createElement(tag);
                if (cls) e.className = cls;
                if (text !== undefined) e.textContent = text;
                return e;
            };
            const ico = (name) => {
                const s = el('span', 'ico');
                s.innerHTML = iconHtml(name); // statyczne SVG
                return s;
            };
            const btn = (label, cls, name, onClick) => {
                const b = el('button', `btn ${cls}`);
                b.type = 'button';
                b.append(ico(name), el('span', '', label));
                b.addEventListener('click', onClick);
                return b;
            };

            const style = el('style', '', BAR_CSS);
            const bar = el('div', `bar${urgent ? ' urgent' : ''}`);
            bar.setAttribute('role', urgent ? 'alert' : 'status');
            const head = el('div', 'head');
            head.append(ico(urgent ? 'alert-triangle' : 'download'), el('span', '', urgent ? TXT.urgentTitle : TXT.title));
            const sub = el('p', 'sub', urgent ? ui.urgent : TXT.dataSafe);
            const pair = el('div', `pair${urgent ? ' one' : ''}`);
            pair.append(btn(TXT.whatsNew, 'ghost', 'sparkles', () => ui.showWhatsNew()));
            if (!urgent) pair.append(btn(TXT.later, 'ghost', 'pause-circle', () => ui.later()));
            const apply = btn(ui.applying ? TXT.applying : TXT.apply, 'primary apply', 'refresh-cw', () => {
                if (ui.applying) return;
                ui.applying = true;
                ui.render();
                ui.doPwaUpdate();
            });
            apply.disabled = ui.applying;
            bar.append(head, sub, pair, apply);
            root.replaceChildren(style, bar);
            host.hidden = false;
            ui.watch(bar);
        },

        // Odległość paska od dołu: nad widocznym dolnym menu (jego górna krawędź już obejmuje obszar bezpieczny),
        // a bez menu (wygląd klasyczny, strona instalacji) 12 px nad obszarem bezpiecznym, jak w Bike Log.
        place: () => {
            const ui = window.PWAUpdateUI;
            const bar = ui._bar;
            if (!bar) return;
            const root = document.documentElement;
            const vh = window.innerHeight;
            let navTop = null;
            for (const sel of NAV_SELECTORS) {
                for (const nav of document.querySelectorAll(sel)) {
                    if (!nav.getClientRects().length || getComputedStyle(nav).visibility === 'hidden') continue;
                    const r = nav.getBoundingClientRect();
                    if (r.height <= 0 || r.bottom < vh - 60) continue;
                    navTop = navTop === null ? r.top : Math.min(navTop, r.top);
                }
            }
            const bottom = navTop === null ? '' : `${Math.round(vh - navTop + NAV_GAP)}px`;
            if (root.style.getPropertyValue('--ukis-banner-bottom') !== bottom) {
                if (bottom) root.style.setProperty('--ukis-banner-bottom', bottom);
                else root.style.removeProperty('--ukis-banner-bottom');
            }
            // Miejsce pod treścią: od górnej krawędzi paska do miejsca, w którym kończy się przewijana treść (menu albo dół).
            const space = `${Math.max(0, Math.ceil((navTop === null ? vh : navTop) - bar.getBoundingClientRect().top) + 2)}px`;
            if (root.style.getPropertyValue('--ukis-banner-space') !== space) root.style.setProperty('--ukis-banner-space', space);
        },

        _schedulePlace: () => {
            const ui = window.PWAUpdateUI;
            if (ui._frame) return;
            ui._frame = requestAnimationFrame(() => {
                ui._frame = 0;
                ui.place();
            });
        },

        watch: (bar) => {
            const ui = window.PWAUpdateUI;
            const root = document.documentElement;
            ui._resize?.disconnect();
            ui._mutations?.disconnect();
            ui._resize = null;
            ui._mutations = null;
            window.removeEventListener('resize', ui._schedulePlace);
            ui._bar = bar;
            if (!bar) {
                root.classList.remove('ukis-pasek-aktualizacji');
                root.style.removeProperty('--ukis-banner-space');
                root.style.removeProperty('--ukis-banner-bottom');
                return;
            }
            root.classList.add('ukis-pasek-aktualizacji');
            ui.place();
            // Menu znika i wraca (Strefa trenera, przełączanie sekcji), pasek zmienia wysokość: pozycja liczona na nowo.
            window.addEventListener('resize', ui._schedulePlace);
            if (typeof ResizeObserver !== 'undefined') {
                ui._resize = new ResizeObserver(ui._schedulePlace);
                ui._resize.observe(bar);
            }
            if (typeof MutationObserver !== 'undefined') {
                ui._mutations = new MutationObserver(ui._schedulePlace);
                ui._mutations.observe(document.body, { attributes: true, attributeFilter: ['class', 'style', 'hidden'], childList: true, subtree: true });
            }
        },

        registerAndMonitor: () => {
            // Mieszany stan cache (brak ukis-scope.js): rejestruj worker bez pętli czyszczącej i niczego nie kasuj.
            if (!window.UkiScope) return window.PWAUpdateUI._doRegister();
            window.UkiScope.getOwnRegistrations().then(async registrations => {
                let hadBadWorker = false;
                for (let reg of registrations) {
                    const swUrl = reg.active?.scriptURL || reg.installing?.scriptURL || '';
                    if (!swUrl.includes('sw.js')) {
                        await reg.unregister();
                        hadBadWorker = true;
                    }
                }
                if (hadBadWorker) {
                    await window.UkiScope.deleteOwnCaches();
                    window.location.reload(true);
                    return;
                }
                window.PWAUpdateUI._doRegister();
            }).catch(() => window.PWAUpdateUI._doRegister());
        },

        _doRegister: () => {
            // Standard Registration
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('PWA Service Worker Registered (Isolated Updater)');

                    if (registration.waiting) {
                        window.PWAUpdateUI.showUpdateBanner(registration.waiting);
                    }

                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                window.PWAUpdateUI.showUpdateBanner(newWorker);
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
                    
                    // Pasywne intencje
                    document.body.addEventListener('click', () => {
                        if (Math.random() < 0.05) registration.update();
                    }, { passive: true });
                    
                    // Agresywny Fallback niezależny od JS modules
                    setInterval(async () => {
                        try {
                            const res = await fetch(`CHANGELOG.json?_t=${Date.now()}`);
                            const data = await res.json();
                            const serverVersion = data[0].version;
                            const localVersion = document.querySelector('meta[name="app-version"]')?.content;
                            
                            if (localVersion && serverVersion !== localVersion) {
                                registration.update();
                            }
                        } catch(e) {}
                    }, 1000 * 60 * 2);

                })
                .catch(err => console.log('SW Registration Failed', err));
        }
    };

    // Initialize independently
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.PWAUpdateUI.init);
    } else {
        window.PWAUpdateUI.init();
    }
})();
