import { PremiumUI } from "./PremiumUI.js";
import { menuTrening, dataMenu, pozdrowienie } from "../wyglad/menuTrening.js";
import { toIso } from "../trainer/trainerPlan.js";
import { pokazJesliTrzeba as komunikatKlasyczny } from "../wyglad/komunikatKlasyczny.js";

export const APP_VERSION = 'v2026.11.28.02'; // Faza 6.2: Katalog z podziałem na partie i Fixy UI

// Obsługa błędów globalnych — zdefiniowana w main.js (klucz: uki_error_logs)

export const AppUI = {
    init: () => {
        if (!localStorage.getItem("uki_install_date")) {
            localStorage.setItem("uki_install_date", new Date().toISOString());
        }
        AppUI.initNavigation();
        AppUI.initPWA();
        
        // Inicjalnie aktywuj welcome-screen (display: block i aktywny przycisk paska dolnego)
        if (window.switchTab) {
            window.switchTab('welcome-screen');
        }

        
        // Expose do global scope dla index.html
        window.APP_VERSION = APP_VERSION;

        const premiumStatus = PremiumUI.getTrialStatus();

        // Stopka Menu: sam numer wersji + osobny napis wariantu (Heavy tylko z tokenem Pro, reszta to Light).
        const dashVersion = document.getElementById('dashboard-version');
        if (dashVersion) dashVersion.textContent = APP_VERSION;
        const premiumLabel = document.getElementById('premium-status');
        if (premiumLabel) premiumLabel.textContent = premiumStatus.isProToken ? 'Wersja Heavy' : 'Wersja Light';

        // CHANGELOG AUTO-SHOW LOGIC (tylko w zainstalowanej aplikacji; w karcie przeglądarki nic nie zapisujemy)
        const appMode = !window.UkiAppStart || window.UkiAppStart.isAppMode();
        const lastSeen = localStorage.getItem('uki-bodybuild-last-version');
        // Powitanie Edwarda (OnboardingUI) jeszcze przed użytkownikiem.
        const onboardingPending = localStorage.getItem('tutorial_global_v22') !== 'true';
        // Nowa instalacja: nie ma czego pokazywać w „Co nowego?”, jedynym oknem jest powitanie Edwarda.
        const freshInstall = onboardingPending && lastSeen === null;
        // Jednorazowy komunikat dla użytkowników wyglądu klasycznego (spec 11 pkt 3): ostatni w kolejce okien
        // startowych, po zamknięciu „Co nowego?” albo od razu, gdy „Co nowego?” się nie pokazuje.
        let coNowego = false;
        if (!appMode) {
            // Strona instalacji: „Co nowego?” pokaże zainstalowana aplikacja.
        } else if (freshInstall) {
            localStorage.setItem('uki-bodybuild-last-version', APP_VERSION);
        } else if (lastSeen !== APP_VERSION) {
            localStorage.setItem('uki-bodybuild-last-version', APP_VERSION);
            
            if (window.showChangelogModal) {
                coNowego = true;
                document.addEventListener('changelogClosed', () => komunikatKlasyczny(), { once: true });
                AppUI.afterStartupOverlays(onboardingPending, () => setTimeout(async () => {
                    const btn = document.getElementById('changelog-update-now-btn');
                    if (btn) btn.style.display = 'none';
                    
                    let compareVersion = lastSeen;
                    
                    // Inteligentne wykrywanie z Cache w przypadku migracji / braku lastSeen
                    if (!compareVersion && 'caches' in window) {
                        try {
                            const cacheNames = await caches.keys();
                            const ukiCaches = cacheNames.filter(c => c.startsWith('ukis-bodybuild-v'));
                            if (ukiCaches.length > 0) {
                                const oldVersions = ukiCaches
                                    .map(c => c.replace('ukis-bodybuild-', ''))
                                    .filter(v => v !== APP_VERSION)
                                    .sort();
                                
                                if (oldVersions.length > 0) {
                                    compareVersion = oldVersions[oldVersions.length - 1]; // Najnowsza stara
                                }
                            }
                        } catch(e) {
                            console.log("Brak dostępu do cache", e);
                        }
                    }
                    
                    window.showChangelogModal(compareVersion ? compareVersion : 'all');
                }, 800));
            }
        }
        if (appMode && !coNowego) {
            AppUI.afterStartupOverlays(onboardingPending, () => setTimeout(() => komunikatKlasyczny(), 800));
        }

        // Menu: data, pozdrowienie i karta „Twój trening” (spec 8.3) na starcie i przy każdym powrocie do Menu.
        AppUI.updateWelcomeMessage();
        document.addEventListener('nickUpdated', AppUI.updateWelcomeMessage);
        const startBtn = document.querySelector('#welcome-screen .z-menu-start');
        if (startBtn) startBtn.addEventListener('click', AppUI.startMenuTrening);
        AppUI.renderMenuTrening();
        document.addEventListener('tabChanged', (e) => {
            if (e.detail && e.detail.tab === 'welcome-screen') {
                AppUI.updateWelcomeMessage();
                AppUI.renderMenuTrening();
            }
        });
    },

    // Karta „Twój trening”: plan dnia z harmonogramu i licznik tygodnia (menuTrening.js).
    // Najpierw bez treningów z bazy (plan widać od razu), potem z nimi (licznik i czas trwania).
    // Teksty z danych użytkownika idą przez textContent.
    renderMenuTrening: async () => {
        const card = document.querySelector('#welcome-screen .z-menu-trening');
        if (!card) return;
        const read = (key) => {
            try {
                const v = JSON.parse(localStorage.getItem(key) || '[]');
                return Array.isArray(v) ? v : [];
            } catch (e) {
                return [];
            }
        };
        const today = toIso(new Date());
        const base = {
            templates: read('uki_workout_templates'),
            schedules: read('uki_workout_schedules'),
            exceptions: read('uki_schedule_exceptions'),
            today,
        };
        const run = ++AppUI._menuRun;
        const paint = (trainings) => {
            if (run !== AppUI._menuRun) return;
            const r = menuTrening({ ...base, trainings });
            card.querySelector('.z-menu-trening-tytul').textContent = r.tytul;
            card.querySelector('.z-menu-trening-opis').textContent = r.opis;
            card.querySelector('.z-menu-trening-licznik').textContent = r.zaplanowane === null ? String(r.wykonane) : `${r.wykonane}/${r.zaplanowane}`;
            const btn = card.querySelector('.z-menu-start');
            if (r.templateId === null) delete btn.dataset.templateId;
            else btn.dataset.templateId = String(r.templateId);
        };
        paint([]);
        try {
            const db = window.DatabaseManager;
            if (db && typeof db.getTrainings === 'function') paint(await db.getTrainings());
        } catch (e) {
            console.warn('[Menu] treningi:', e);
        }
    },
    _menuRun: 0,

    // „ROZPOCZNIJ”: z planem sesja z szablonu dnia (data: dziś), bez planu kalendarz Treningu.
    // Trwającej sesji nie nadpisujemy, tylko do niej wracamy.
    startMenuTrening: (e) => {
        const id = e && e.currentTarget ? e.currentTarget.dataset.templateId : undefined;
        if (window.switchTab) window.switchTab('training-dashboard');
        const ui = window.TrainingUI;
        if (!id || !ui || typeof ui.startFromTemplate !== 'function') return;
        const active = document.getElementById('active-training-view');
        // Trwająca sesja: nie nadpisujemy jej (utrata danych). Sprawdzamy stan wyliczony, nie samo style.display.
        if (active && getComputedStyle(active).display !== 'none') return;
        // Szablon planu od trenera bierze serie z tygodnia wybranego dnia, więc wybieramy dziś.
        if (typeof ui.handleDayClick === 'function') ui.handleDayClick(toIso(new Date()), true);
        ui.startFromTemplate(id);
    },

    // Okna startowe pokazują się kolejno, nigdy naraz: powitanie Edwarda (OnboardingUI, zdarzenie
    // 'onboardingClosed') → dopiero potem cb (np. „Co nowego?”).
    afterStartupOverlays: (onboardingPending, cb) => {
        if (onboardingPending) {
            document.addEventListener('onboardingClosed', () => cb(), { once: true });
        } else if (window.UkiAppStart && typeof window.UkiAppStart.whenWelcomeClosed === 'function') {
            window.UkiAppStart.whenWelcomeClosed(cb);
        } else {
            cb();
        }
    },

    // Data dnia („Czwartek, 26 listopada”) i „Cześć, <nick>” / „Cześć!” na Menu.
    updateWelcomeMessage: () => {
        let nick = '';
        try { nick = localStorage.getItem('userNick') || ''; } catch (e) { /* prywatne okno */ }
        const hello = document.querySelector('#welcome-screen .z-menu-czesc');
        if (hello) hello.textContent = pozdrowienie(nick);
        const date = document.querySelector('#welcome-screen .z-menu-data');
        if (date) date.textContent = dataMenu(toIso(new Date()));
    },

    initNavigation: () => {
        const tabContents = document.querySelectorAll('.app-content > .tab-content-wrapper > .tab-content');

        function switchTab(tabId) {
            // Aktywny przycisk paska dolnego: klasa .active i aria-current="page" (styl pigułki w components.css)
            // Ekran bez własnego przycisku podświetla przycisk, z którego się do niego wchodzi:
            // kreator szablonów → Trening, Wygląd → Profil, ekrany z kafelków Menu → Menu.
            const NAV_RODZIC = {
                'template-builder-dashboard': 'training-dashboard',
                'wyglad-panel': 'settings-panel',
                'analytics-dashboard': 'welcome-screen',
                'history-dashboard': 'welcome-screen',
                'measurements-dashboard': 'welcome-screen',
                'diet-dashboard': 'welcome-screen',
                'ai-analytics-dashboard': 'welcome-screen',
            };
            const navTab = NAV_RODZIC[tabId] || tabId;
            const navBtns = document.querySelectorAll('.bottom-nav-bar .nav-btn');
            navBtns.forEach(btn => {
                // Sprawdź onclick="switchTab('X')" i wyciągnij tabId
                const onclickAttr = btn.getAttribute('onclick') || '';
                const match = onclickAttr.match(/switchTab\(['"]([^'"]+)['"]\)/);
                const on = (match ? match[1] : null) === navTab;
                btn.classList.toggle('active', on);
                if (on) btn.setAttribute('aria-current', 'page');
                else btn.removeAttribute('aria-current');
            });

            // Scroll the wrapper (reset to top on tab change)
            const wrapper = document.querySelector('.tab-content-wrapper');
            if (wrapper) {
                wrapper.scrollTop = 0;
            }

            tabContents.forEach(content => {
                content.classList.remove('active-tab');
                content.style.display = 'none';
                if (content.id === tabId) {
                    content.classList.add('active-tab');
                    content.style.display = 'block';
                }
            });

            // Kreator szablonów: bez paska dolnego i przycisku Edwarda (spec 8.1, trening-kreator.css).
            document.body.classList.toggle('z-kreator', tabId === 'template-builder-dashboard');

            document.dispatchEvent(new CustomEvent('tabChanged', { detail: { tab: tabId } }));

            if (window.OnboardingUI && window.OnboardingUI.checkContextualTutorial) {
                window.OnboardingUI.checkContextualTutorial(tabId);
            }
        }

        // EXPOSE GLOBALLY for index.html inline onclicks!
        window.switchTab = switchTab;
    },

    initPWA: () => {
        if (navigator.webdriver) return;

        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || document.referrer.includes('android-app://');
        if (isStandalone) return; 

        const isDismissed = localStorage.getItem('uki-bodybuild-pwa-banner-dismissed') === 'true';
        if (isDismissed) return;

        const banner = document.getElementById('pwa-install-banner');
        if (!banner) return;

        const hideBanner = () => {
            banner.classList.remove('visible');
            setTimeout(() => { banner.style.display = 'none'; }, 500); 
        };

        const showBanner = () => {
            banner.style.display = 'flex';
            void banner.offsetWidth;
            banner.classList.add('visible');
        };

        banner.style.display = 'none';

        setTimeout(() => {
            showBanner();
        }, 3000); 

        // Checkbox logic
        const dontShowCheckbox = document.getElementById('pwa-dont-show-again');
        if (dontShowCheckbox) {
            dontShowCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    localStorage.setItem('uki-bodybuild-pwa-banner-dismissed', 'true');
                } else {
                    localStorage.removeItem('uki-bodybuild-pwa-banner-dismissed');
                }
            });
        }

        // Close logic
        const closeBtn = document.getElementById('pwa-limit-banner-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', hideBanner);
        }

        // Instruction button
        const openGuideBtn = document.getElementById('pwa-open-guide-btn');
        if (openGuideBtn) {
            openGuideBtn.addEventListener('click', () => {
                hideBanner();
                // Open Settings panel and scroll to PWA
                if (window.switchTab) {
                    window.switchTab('settings-panel');
                    setTimeout(() => {
                        const guide = document.getElementById('settings-pwa-guide');
                        if (guide) {
                            guide.scrollIntoView({ behavior: 'smooth' });
                            // Force open guide accordion
                            const content = document.getElementById('install-guide-content');
                            if (content && !content.classList.contains('expanded')) {
                                guide.querySelector('.install-guide-header').click();
                            }
                        }
                    }, 300);
                }
            });
        }
    }
};