import { PremiumUI } from "./PremiumUI.js";

export const APP_VERSION = 'v2026.8.22.04'; // Faza 6.2: Katalog z podziałem na partie i Fixy UI

// Obsługa błędów globalnych — zdefiniowana w main.js (klucz: uki_error_logs)

export const AppUI = {
    init: () => {
        if (!localStorage.getItem("uki_install_date")) {
            localStorage.setItem("uki_install_date", new Date().toISOString());
        }
        AppUI.initNavigation();
        AppUI.initMobileMenu();
        AppUI.initPWA();
        
        // Expose do global scope dla index.html
        window.APP_VERSION = APP_VERSION;

        const versionDisplays = document.querySelectorAll('.version-info, .app-version-display, #dashboard-version');
        
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

        // CHANGELOG AUTO-SHOW LOGIC
        const lastSeen = localStorage.getItem('uki-bodybuild-last-version');
        if (lastSeen !== APP_VERSION) {
            localStorage.setItem('uki-bodybuild-last-version', APP_VERSION);
            
            if (window.showChangelogModal) {
                setTimeout(async () => {
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
                }, 800);
            }
        }

        // Setup Nickname Welcome
        AppUI.updateWelcomeMessage();
        document.addEventListener('nickUpdated', AppUI.updateWelcomeMessage);
    },

    updateWelcomeMessage: () => {
        const nick = localStorage.getItem('userNick');
        const headerTitle = document.querySelector('.home-header h2');
        if (headerTitle) {
            headerTitle.textContent = nick ? `Cześć, ${nick}! 🚀` : "Uki's BodyBuild";
        }
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

            // Scroll the wrapper
            const wrapper = document.querySelector('.tab-content-wrapper');
            if (wrapper) wrapper.scrollTo({ top: 0, behavior: 'auto' });

            tabContents.forEach(content => {
                content.classList.remove('active-tab');
                content.style.display = 'none';
                if (content.id === tabId) {
                    content.classList.add('active-tab');
                    content.style.display = 'block';
                }
            });

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