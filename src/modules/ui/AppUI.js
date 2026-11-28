import { PremiumUI } from "./PremiumUI.js";
import { menuTrening, dataMenu, pozdrowienie } from "../wyglad/menuTrening.js";
import { toIso } from "../trainer/trainerPlan.js";

export const APP_VERSION = 'v2026.11.27.04'; // Faza 6.2: Katalog z podziałem na partie i Fixy UI

// Obsługa błędów globalnych — zdefiniowana w main.js (klucz: uki_error_logs)

export const AppUI = {
    init: () => {
        if (!localStorage.getItem("uki_install_date")) {
            localStorage.setItem("uki_install_date", new Date().toISOString());
        }
        AppUI.initNavigation();
        AppUI.initMobileMenu();
        AppUI.initPWA();
        
        // Inicjalnie aktywuj welcome-screen (ustawia display:flex i active na nav-btn)
        if (window.switchTab) {
            window.switchTab('welcome-screen');
        }

        
        // Expose do global scope dla index.html
        window.APP_VERSION = APP_VERSION;

        const versionDisplays = document.querySelectorAll('.version-info, .app-version-display');
        
        const premiumStatus = PremiumUI.getTrialStatus();
        
        let variantName = '';
        if (premiumStatus.isProToken) {
            variantName = 'Heavy';
        } else if (premiumStatus.hasAccess) {
            variantName = `Trial (${premiumStatus.daysLeft} dni)`;
        } else {
            variantName = 'Light';
        }

        versionDisplays.forEach(el => {
            if (el.classList.contains('app-version-display')) {
                // W Ustawieniach
                el.innerHTML = `${variantName} ${APP_VERSION} <span onclick="alert('Objaśnienie wariantów:\\n\\nTrial - Przez 7 dni masz odblokowaną pełną wersję aplikacji ze wszystkimi funkcjami.\\nHeavy - Wersja z nielimitowanym dostępem do sztucznej inteligencji (AI).\\nLight - Wersja podstawowa bez funkcji AI.')" style="cursor: pointer; color: #FF9800; margin-left: 5px; font-size: 1.1em;" title="Co to znaczy?">ⓘ</span><br><a href="#" onclick="event.preventDefault(); window.showChangelogModal('all')" style="color: #FF9800; text-decoration: underline; font-size: 0.9em; display: inline-block; margin-top: 10px; cursor: pointer;">Zobacz co nowego (Changelog)</a>`;
            } else {
                // Sidebar oraz dashboard-version
                el.textContent = `${variantName} ${APP_VERSION}`;
            }
        });

        // Stopka Menu: sam numer wersji + osobny napis wariantu (Heavy tylko z tokenem Pro, reszta to Light).
        const dashVersion = document.getElementById('dashboard-version');
        if (dashVersion) dashVersion.textContent = APP_VERSION;
        const premiumLabel = document.getElementById('premium-status');
        if (premiumLabel) premiumLabel.textContent = premiumStatus.isProToken ? 'Wersja Heavy' : 'Wersja Light';

        // CHANGELOG AUTO-SHOW LOGIC (tylko w zainstalowanej aplikacji; w karcie przeglądarki nic nie zapisujemy)
        const appMode = !window.UkiUiSwitch || window.UkiUiSwitch.isAppMode();
        const lastSeen = localStorage.getItem('uki-bodybuild-last-version');
        // Powitanie Edwarda (OnboardingUI) jeszcze przed użytkownikiem.
        const onboardingPending = localStorage.getItem('tutorial_global_v22') !== 'true';
        // Nowa instalacja: nie ma czego pokazywać w „Co nowego?”, jedynym oknem jest powitanie Edwarda.
        const freshInstall = onboardingPending && lastSeen === null;
        if (!appMode) {
            // Strona instalacji: „Co nowego?” pokaże zainstalowana aplikacja.
        } else if (freshInstall) {
            localStorage.setItem('uki-bodybuild-last-version', APP_VERSION);
        } else if (lastSeen !== APP_VERSION) {
            localStorage.setItem('uki-bodybuild-last-version', APP_VERSION);
            
            if (window.showChangelogModal) {
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

    // Okna startowe pokazują się kolejno, nigdy naraz: powitanie nowego wyglądu (ui-switch.js)
    // → powitanie Edwarda (OnboardingUI, zdarzenie 'onboardingClosed') → dopiero potem cb (np. „Co nowego?”).
    afterStartupOverlays: (onboardingPending, cb) => {
        if (onboardingPending) {
            // Powitanie Edwarda samo czeka na powitanie nowego wyglądu, więc wystarczy czekać na nie.
            document.addEventListener('onboardingClosed', () => cb(), { once: true });
        } else if (window.UkiUiSwitch && typeof window.UkiUiSwitch.whenWelcomeClosed === 'function') {
            window.UkiUiSwitch.whenWelcomeClosed(cb);
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

    initMobileMenu: () => {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const sidebarNav = document.querySelector('.sidebar-nav');
        const overlay = document.querySelector('.overlay');
        const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

        function toggleMenu() {
            if (sidebarNav) sidebarNav.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
        }

        function closeMenu() {
            if (sidebarNav) sidebarNav.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        }

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMenu();
            });
        }
        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }
        sidebarLinks.forEach(link => {
            if (link.closest('ul')) {
                link.addEventListener('click', closeMenu);
            }
        });
    },

    initNavigation: () => {
        const navLinks = document.querySelectorAll('.sidebar-nav ul a[data-tab]');
        const tabContents = document.querySelectorAll('.app-content > .tab-content-wrapper > .tab-content');
        const homeLinkHeader = document.getElementById('home-link-header');
        const tilesHomeBtn = document.getElementById('tiles-mode-home-btn'); // Floating X Button

        function switchTab(tabId) {
            navLinks.forEach(l => {
                l.classList.toggle('active', l.getAttribute('data-tab') === tabId);
            });

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
                    // glass-dashboard potrzebuje display:flex, reszta block
                    if (content.classList.contains('glass-dashboard')) {
                        content.style.display = 'flex';
                    } else {
                        content.style.display = 'block';
                    }
                }
            });

            // Kreator szablonów: bez paska dolnego i przycisku Edwarda (spec 8.1, trening-kreator.css).
            document.body.classList.toggle('z-kreator', tabId === 'template-builder-dashboard');

            document.dispatchEvent(new CustomEvent('tabChanged', { detail: { tab: tabId } }));

            if (window.OnboardingUI && window.OnboardingUI.checkContextualTutorial) {
                window.OnboardingUI.checkContextualTutorial(tabId);
            }

            // Mobile Home Button Logic (Show everywhere EXCEPT welcome screen)
            if (tilesHomeBtn) {
                const isMobile = window.innerWidth <= 768;
                if (isMobile && tabId !== 'welcome-screen') {
                    tilesHomeBtn.style.display = 'flex';
                } else {
                    tilesHomeBtn.style.display = 'none';
                }
            }
        }

        // EXPOSE GLOBALLY for index.html inline onclicks!
        window.switchTab = switchTab; 

        // 1. Sidebar Links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = link.getAttribute('data-tab');
                if (tabId) switchTab(tabId);
            });
        });

        // 2. Sidebar Header (Desktop Home)
        if (homeLinkHeader) {
            homeLinkHeader.addEventListener('click', (e) => {
                e.preventDefault();
                switchTab('welcome-screen');
            });
        }

        // 3. Mobile Header (Logo/Title Click -> Home)
        const mobileHeaders = document.querySelectorAll('.mobile-header, .home-header');
        mobileHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    const activeTab = document.querySelector('.tab-content.active-tab');
                    if (activeTab && activeTab.id !== 'welcome-screen') {
                        switchTab('welcome-screen');
                    }
                }
            });
            header.style.cursor = 'pointer'; 
        });

        // 4. Tiles Mode Home Button (Floating X)
        if (tilesHomeBtn) {
            tilesHomeBtn.addEventListener('click', () => {
                switchTab('welcome-screen');
            });
        }
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