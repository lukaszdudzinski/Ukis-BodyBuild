import { initNitroxUI } from './calculators/NitroxUI.js';
import { initBlendingUI } from './calculators/BlendingUI.js';
import { initDivePlanningUI } from './calculators/DivePlanningUI.js';
import { initBallastUI } from './calculators/BallastUI.js';
import { LecturesUI } from './LecturesUI.js';
import { QuizUI } from './QuizUI.js';
import { ScienceUI } from './ScienceUI.js'; // New Import
import { UkiRiverGameUI } from '../games/uki-river-dive/UkiRiverGameUI.js';
import { ProAccess } from '../auth/ProAccess.js';
import { populateTankSelect } from '../data/TankData.js';

export const APP_VERSION = 'v2026.8.05.01'; // <-- TEN NUMER ZMIENIAMY PRZY KAŻDEJ AKTUALIZACJI

export const AppUI = {
    init: () => {
        AppUI.initNavigation();
        AppUI.initTheme();
        AppUI.initTooltips();
        AppUI.initGlobalButtons();

        // Dynamic Version Update
        const versionDisplays = document.querySelectorAll('.version-info, .app-version-display');
        versionDisplays.forEach(el => {
            if (el.classList.contains('version-info') && !el.closest('.settings-info-row')) {
                el.textContent = `Uki's Dive Tools ${APP_VERSION}`;
            } else {
                el.textContent = APP_VERSION;
            }
        });

        // Initialize Sub-Modules
        initNitroxUI();
        initBlendingUI();
        initDivePlanningUI();
        initBallastUI();

        LecturesUI.init();
        QuizUI.init(); // Sets up modal listeners
        ScienceUI.init(); // New Init
        UkiRiverGameUI.init();

        // Mobile Menu
        AppUI.initMobileMenu();

        // PWA Banner Logic
        AppUI.initPWA();

        // Tank Selectors
        AppUI.initTankSelectors();
    },

    initTankSelectors: () => {
        const selectors = [
            'vb', 'rbVolume', 'bailoutTank', 'gcTankSize', 'gcTankSize_pro', 'default-tank-select', 'ballastTank'
        ];

        const savedDefault = localStorage.getItem('uki-default-tank');
        // Specific logic for Ballast: it used string IDs (e.g. 'alu11') previously, 
        // now it uses numeric capacities (e.g. 11.1). 
        // We will need to update BallastCalculator to handle numeric capacity if it relied on strings for modifiers.
        // Actually, BallastUI.js passes 'tank' value to calculateBallast. 
        // The calculator likely checks strings like 'twin7_232'. 
        // WE NEED TO CHECK BallastCalculator.js logic before breaking it!
        // User requested: "4. UWAGA - pamietaj ze lista butli twin to zestaw dwóch pojedynczych butli czyli 14 litrów to 2*7"
        // This suggests we are passing LITERS everywhere now.
        // So I will populate using TankData. 

        selectors.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                // If it's the settings selector, or if we have a saved default, use it.
                // Default fallback: 'steel15' (15L)
                populateTankSelect(el, (id === 'ballastTank' ? null : (savedDefault || 'steel15')));

                // If it's the settings selector, add listener to save
                if (id === 'default-tank-select') {
                    if (savedDefault) el.value = savedDefault; // Ensure value is set
                    el.addEventListener('change', () => {
                        localStorage.setItem('uki-default-tank', el.value);
                        // Optional: Update other selectors in real-time?
                        // Let's keep it simple: applies on next load or manual change.
                    });
                }
            }
        });
    },

    initGlobalButtons: () => {
        console.log("AppUI: initGlobalButtons starting...");

        // GLOBAL FALLBACK for User
        window.debugForceUnlock = async () => {
            const code = prompt("DEBUG: Podaj kod:");
            if (await ProAccess.unlock(code)) {
                alert("Odblokowano (Debug)");
                location.reload();
            } else {
                alert("Błąd kodu");
            }
        };

        // 1. SOS Button - Simplified Logic
        window.openSOS = () => {
            console.log('SOS Triggered via global function');

            // 1. Force Close Mobile Menu if open (Fixing Alignment Issue)
            const sidebar = document.querySelector('.sidebar-nav');
            const overlay = document.querySelector('.overlay');
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
            }

            const emergencyContent = document.getElementById('emergency-content');
            if (emergencyContent && AppUI.showModal) {
                AppUI.showModal(emergencyContent.innerHTML, true);

                // GPS Logic
                setTimeout(() => {
                    const tooltipBody = document.getElementById('tooltip-body');
                    if (!tooltipBody) return;

                    const gpsBtn = tooltipBody.querySelector('.gps-locate-btn');
                    const gpsResult = tooltipBody.querySelector('.gps-result');

                    if (gpsBtn && gpsResult) {
                        // Remove old listeners to be safe (simple clone)
                        const newGpsBtn = gpsBtn.cloneNode(true);
                        gpsBtn.replaceWith(newGpsBtn);

                        newGpsBtn.addEventListener('click', () => {
                            gpsResult.innerHTML = '⏳ Pobieranie pozycji...';
                            if (!navigator.geolocation) {
                                gpsResult.innerHTML = '❌ Twój telefon nie wspiera GPS.';
                                return;
                            }
                            navigator.geolocation.getCurrentPosition(
                                (position) => {
                                    const lat = position.coords.latitude.toFixed(5);
                                    const lon = position.coords.longitude.toFixed(5);
                                    const acc = Math.round(position.coords.accuracy);
                                    const mapLink = `https://www.google.com/maps?q=${lat},${lon}`;
                                    const shareText = `SOS! Moja pozycja: ${lat}, ${lon} (dokładność: ${acc}m).`;

                                    let shareHtml = '';
                                    if (navigator.share) {
                                        shareHtml = `<button class="share-gps-btn pulse-button" style="margin-top:10px; width:100%; background:#D32F2F; font-weight:bold; padding:10px; border:none; border-radius:5px; color:white; box-shadow: 0 0 10px rgba(211, 47, 47, 0.4);">📤 Udostępnij Pozycję</button>`;
                                    } else {
                                        shareHtml = `<a href="sms:?body=${encodeURIComponent(shareText + ' Mapa: ' + mapLink)}" class="pulse-button" style="display:block; margin-top:10px; background:#D32F2F; padding:10px; border-radius:5px; color:white; text-decoration:none; text-align:center; box-shadow: 0 0 10px rgba(211, 47, 47, 0.4);">💬 Wyślij SMS</a>`;
                                    }

                                    gpsResult.innerHTML = `
                                         <div style="margin-top:10px; padding:10px; background:rgba(0,0,0,0.3); border-radius:8px;">
                                             <div style="font-size:1.4em; color:#4CAF50; letter-spacing:1px; margin-bottom:5px;">${lat}, ${lon}</div>
                                             <div style="font-size:0.8em; color:#aaa; margin-bottom:8px;">(Dokładność: ${acc}m)</div>
                                             
                                             <a href="${mapLink}" target="_blank" style="display:inline-block; margin-bottom:10px; color:#ddd; text-decoration:underline;">
                                                 🗺️ Otwórz w Google Maps
                                             </a>
                                             ${shareHtml}
                                         </div>`;

                                    // Add Listener to Dynamic Button
                                    const shareBtn = gpsResult.querySelector('.share-gps-btn');
                                    if (shareBtn) {
                                        shareBtn.addEventListener('click', () => {
                                            navigator.share({
                                                title: 'SOS - Moja Lokalizacja',
                                                text: shareText,
                                                url: mapLink
                                            }).catch(console.error);
                                        });
                                    }
                                },
                                (error) => {
                                    console.error("GPS Error", error);
                                    let msg = 'Nieznany błąd';
                                    switch (error.code) {
                                        case 1: msg = '❌ Brak zgody na lokalizację.'; break;
                                        case 2: msg = '❌ Brak sygnału GPS.'; break;
                                        case 3: msg = '❌ Upłynął czas żądania.'; break;
                                    }
                                    gpsResult.innerHTML = msg;
                                },
                                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                            );
                        });
                    }
                }, 100);
            }
        };

        try {
            const emergencyBtn = document.getElementById('emergency-btn');
            if (emergencyBtn) {
                // Remove old listeners
                const newBtn = emergencyBtn.cloneNode(true);
                emergencyBtn.replaceWith(newBtn);
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.openSOS();
                });
            }
        } catch (e) { console.error("SOS Init Error", e); }

        // 3. PRO Unlock - Direct Listener Attachment
        try {
            const unlockButtons = document.querySelectorAll('.unlockProButton');
            unlockButtons.forEach((btn, index) => {
                // Prevent duplicate listeners by checking a custom attribute
                if (btn.dataset.listenerAttached === 'true') return;
                btn.dataset.listenerAttached = 'true';

                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`Unlock Button Clicked (Index: ${index})`);

                    // Use setTimeout to allow UI to update before blocking with prompt
                    setTimeout(async () => {
                        const code = prompt("Podaj kod odblokowujący (otrzymałeś go po postawieniu kawy):");
                        if (!code) {
                            console.log("Unlock cancelled: no code arrived");
                            return;
                        }

                        console.log("Attempting unlock with code...");
                        const success = await ProAccess.unlock(code);

                        if (success) {
                            console.log("Unlock successful!");
                            const expiryDate = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
                            const dateStr = expiryDate.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });

                            const successMsg = `
                                 <div style="text-align: center;">
                                     <h2 style="color: #D81B60; margin-bottom: 15px;">Dziękuję za wsparcie! ☕</h2>
                                     <p style="font-size: 1.1em; line-height: 1.6;">
                                         Strefa PRO została pomyślnie uruchomiona.<br>
                                         Twój dostęp jest aktywny przez 30 dni.
                                     </p>
                                     <p style="margin-top: 15px; font-weight: bold; color: #fff;">
                                         Wygasa: ${dateStr}
                                     </p>
                                 </div>
                             `;

                            if (AppUI.showModal) AppUI.showModal(successMsg, true);
                            else alert('Dziękuję! Strefa PRO aktywna do ' + dateStr);

                            AppUI.initProState();
                        } else {
                            console.warn("Unlock failed: invalid code");
                            alert('Błędny kod. Spróbuj ponownie.');
                        }
                    }, 50);
                });
            });
        } catch (e) { console.error("Unlock Button Init Error", e); }


        // 4. Settings: Re-Lock Button
        try {
            const resetProBtn = document.getElementById('reset-pro-btn');
            if (resetProBtn && ProAccess) {
                resetProBtn.style.display = ProAccess.isUnlocked() ? 'block' : 'none';
                resetProBtn.onclick = () => {
                    if (confirm("Czy chcesz zablokować funkcje PRO (do testów)?")) {
                        ProAccess.lock();
                    }
                };
            }
        } catch (e) { console.error("Settings Lock Btn Error", e); }

        // 5. Settings: PRO Info Icon
        try {
            const proInfoIcon = document.querySelector('.settings-info-row .tooltip-trigger');
            if (proInfoIcon && ProAccess) {
                proInfoIcon.replaceWith(proInfoIcon.cloneNode(true));
                const newProInfoIcon = document.querySelector('.settings-info-row .tooltip-trigger');

                newProInfoIcon.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (ProAccess.isUnlocked()) {
                        const expiryDate = ProAccess.getExpiryDate();
                        let msg = '';
                        if (expiryDate) {
                            const dateStr = expiryDate.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
                            msg = `<div style="text-align: center;">
                                <h2 style="color: #D81B60; margin-bottom: 15px;">Dziękuję za wsparcie! ☕</h2>
                                <h3 style="color: #ffffff; margin-bottom: 10px; font-size: 1.2em;">Status Strefy PRO</h3>
                                <p style="font-size: 1.1em; line-height: 1.6;">
                                    Twój dostęp jest aktywny.<br>
                                    Wygasa: <strong>${dateStr}</strong>
                                </p>
                            </div>`;
                        } else {
                            msg = `<div style="text-align: center;">...</div>`; // Keep short
                        }
                        if (AppUI.showModal) AppUI.showModal(msg, true);
                    } else {
                        if (AppUI.showModal) AppUI.showModal(`<div style="text-align: center;"><p style="color: #DC143C;">Strefa PRO nie jest aktywna.<br>Postaw kawę, aby odblokować.</p></div>`, true);
                    }
                });
            }
        } catch (e) { console.error("Settings Info Icon Error", e); }


        // 6. PWA Guide Image Lightbox
        try {
            const pwaGuideImg = document.querySelector('.install-guide-img');
            if (pwaGuideImg) {
                pwaGuideImg.style.cursor = 'pointer';
                pwaGuideImg.title = 'Kliknij, aby powiększyć';
                pwaGuideImg.addEventListener('click', () => {
                    LecturesUI.openLightbox(pwaGuideImg.src);
                });
            }
        } catch (e) { console.error("PWA Guide Lightbox Error", e); }
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
        const tilesHomeBtn = document.getElementById('tiles-mode-home-btn'); // New Button

        function switchTab(tabId) {
            navLinks.forEach(l => {
                l.classList.toggle('active', l.getAttribute('data-tab') === tabId);
            });

            // Fix: Scroll the wrapper, not the window, because layout.css defines overflow on wrapper
            const wrapper = document.querySelector('.tab-content-wrapper');
            if (wrapper) wrapper.scrollTo({ top: 0, behavior: 'auto' });

            tabContents.forEach(content => {
                content.classList.remove('active-tab');
                content.style.display = 'none';
                if (content.id === tabId) {
                    content.classList.add('active-tab');
                    content.style.display = 'block';

                    // Special case for Game
                    if (tabId === 'river-dive-game' && UkiRiverGameUI.canvas) {
                        UkiRiverGameUI.resizeCanvas();
                    }
                }
            });

            // Mobile Home Button Logic (Show everywhere EXCEPT welcome screen)
            if (tilesHomeBtn) {
                // Check if we are on mobile (using media query match or simplified check)
                const isMobile = window.innerWidth <= 768;
                if (isMobile && tabId !== 'welcome-screen') {
                    tilesHomeBtn.style.display = 'flex';
                } else {
                    tilesHomeBtn.style.display = 'none';
                }
            }

            // If we are leaving the game tab, ensure game loop stops
            if (tabId !== 'river-dive-game') {
                UkiRiverGameUI.stopGame();
            }
        }

        window.switchTab = switchTab; // Expose if needed

        // --- Event Listeners ---

        // 1. Sidebar Links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = link.getAttribute('data-tab');

                // Special handling for "Wykłady": ALWAYS try to go back to grid if clicking the sidebar link
                if (tabId === 'science-of-diving') {
                    const backBtn = document.getElementById('lecture-back-btn');
                    if (backBtn) backBtn.click();
                }

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
                // Only on mobile and if not already on welcome screen interaction
                if (window.innerWidth <= 768) {
                    const activeTab = document.querySelector('.tab-content.active-tab');
                    if (activeTab && activeTab.id !== 'welcome-screen') {
                        switchTab('welcome-screen');
                    }
                }
            });
            header.style.cursor = 'pointer'; // Visual cue
        });

        // 4. Tiles Mode Home Button (Floating X)
        if (tilesHomeBtn) {
            tilesHomeBtn.addEventListener('click', () => {
                // Feature: If Lecture Viewer is open, treat X as "Back to List"
                const lectureViewer = document.getElementById('lecture-viewer');
                if (lectureViewer && !lectureViewer.hidden) {
                    const backBtn = document.getElementById('lecture-back-btn');
                    if (backBtn) backBtn.click();
                    return;
                }

                switchTab('welcome-screen');
            });
        }

        // Pro Tool Navigation
        window.openProTool = function (toolId) {
            const isUnlocked = document.querySelector('#pro-dashboard').classList.contains('unlocked');
            if (!isUnlocked) return;
            document.getElementById('pro-dashboard').style.display = 'none';
            const toolSection = document.getElementById(toolId);
            if (toolSection) {
                toolSection.style.display = 'block';
                toolSection.classList.add('active-tab');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        window.backToDashboard = function () {
            const proTools = document.querySelectorAll('.pro-tool-view');
            proTools.forEach(tool => tool.style.display = 'none');
            const dashboard = document.getElementById('pro-dashboard');
            if (dashboard) {
                dashboard.style.display = 'block';
                dashboard.classList.add('active-tab');
            }
        };

        // Sub-tabs
        const subTabButtons = document.querySelectorAll('.sub-tab-button');
        subTabButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const subTabId = this.getAttribute('data-subtab');
                const parentWrapper = this.closest('.tab-content');
                if (!subTabId || !parentWrapper) return;

                const subTabToShow = document.getElementById(subTabId);
                const activeContent = parentWrapper.querySelectorAll('.sub-tab-content');
                const activeBtns = parentWrapper.querySelectorAll('.sub-tab-button');

                if (subTabToShow) {
                    activeContent.forEach(c => c.classList.remove('active-sub-tab'));
                    activeBtns.forEach(b => b.classList.remove('active'));
                    subTabToShow.classList.add('active-sub-tab');
                    this.classList.add('active');
                }

                // Specific logic for Nitrox form disabling - kept for compatibility
                if (parentWrapper.id === 'nitrox-calculator') {
                    const nitroxO2Input = document.getElementById('nitroxO2');
                    if (nitroxO2Input) {
                        nitroxO2Input.disabled = (subTabId === 'best-mix-calculator');
                    }
                }

                // FEATURE: Back to List on Sub-Tab Click for Lectures
                // ALWAYS enforce grid view when clicking the "Wykłady" sub-tab button
                if (subTabId === 'sod-lectures') {
                    const backBtn = document.getElementById('lecture-back-btn');
                    if (backBtn) backBtn.click();
                }
            });
        });
    },

    initTheme: () => {
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        const glassToggle = document.getElementById('glass-toggle');
        const versionEl = document.getElementById('app-version');
        // if (versionEl) versionEl.textContent = 'v2026.1.15.01'; // Managed by APP_VERSION constant now
        const wallpaperThumbs = document.querySelectorAll('.wallpaper-thumb');
        const globalWaterTypeSelect = document.getElementById('global-water-type');
        const sacWaterType = document.getElementById('waterType');
        const ballastWaterType = document.getElementById('ballastWater');

        function setTheme(isDark) {
            if (isDark) {
                body.classList.add('dark-theme');
                if (themeToggle) themeToggle.checked = true;
            } else {
                body.classList.remove('dark-theme');
                if (themeToggle) themeToggle.checked = false;
            }
            try {
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            } catch (e) {
                console.warn('LocalStorage access denied:', e);
            }
        }

        function setLiquidGlass(isEnabled) {
            if (isEnabled) {
                body.classList.remove('glass-off');
                if (glassToggle) glassToggle.checked = true;
            } else {
                body.classList.add('glass-off');
                if (glassToggle) glassToggle.checked = false;
            }
            try {
                localStorage.setItem('uki-liquid-glass', isEnabled ? 'on' : 'off');
            } catch (e) { console.warn('LC error', e); }
        }

        function setWallpaper(url) {
            body.style.backgroundImage = url;
            try {
                localStorage.setItem('uki-wallpaper', url);
            } catch (e) { console.warn('LC error', e); }
            wallpaperThumbs.forEach(t => t.classList.toggle('active', t.getAttribute('data-wallpaper') === url));
        }

        function setWaterType(val) {
            if (globalWaterTypeSelect) globalWaterTypeSelect.value = val;
            if (sacWaterType) sacWaterType.value = val;
            if (ballastWaterType) ballastWaterType.value = val;
            try {
                localStorage.setItem('uki-water-type', val);
            } catch (e) { console.warn('LC error', e); }
        }

        if (themeToggle) themeToggle.addEventListener('change', () => setTheme(themeToggle.checked));
        if (glassToggle) glassToggle.addEventListener('change', () => setLiquidGlass(glassToggle.checked));
        wallpaperThumbs.forEach(t => t.addEventListener('click', () => setWallpaper(t.getAttribute('data-wallpaper'))));

        if (globalWaterTypeSelect) globalWaterTypeSelect.addEventListener('change', () => setWaterType(globalWaterTypeSelect.value));
        if (sacWaterType) sacWaterType.addEventListener('change', () => setWaterType(sacWaterType.value));
        if (ballastWaterType) ballastWaterType.addEventListener('change', () => setWaterType(ballastWaterType.value));

        // Init
        let savedTheme = null;
        try {
            savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') {
                setTheme(false);
            }
        } catch (e) { console.warn('LC error', e); }
        setTheme(savedTheme === 'dark' || savedTheme === null);

        let savedGlass = null;
        try {
            savedGlass = localStorage.getItem('uki-liquid-glass');
            if (savedGlass === 'off') {
                setLiquidGlass(false);
            }
        } catch (e) { console.warn('LC error', e); }
        setLiquidGlass(savedGlass === 'on' || savedGlass === null);

        let savedWallpaper = null;
        try {
            savedWallpaper = localStorage.getItem('uki-wallpaper');
            if (savedWallpaper) {
                setWallpaper(savedWallpaper);
            }
        } catch (e) { console.warn('LC error', e); }
        setWallpaper(savedWallpaper || "url('img/bg/background_uki.jpg')");

        let savedWater = null;
        try {
            savedWater = localStorage.getItem('uki-water-type');
            if (savedWater) {
                const waterSelect = document.getElementById('water-type-select');
                if (waterSelect) waterSelect.value = savedWater;
            }
        } catch (e) { console.warn('LC error', e); }
        setWaterType(savedWater || 'fresh');

        // Init Saved SAC Display
        const savedSAC = localStorage.getItem('uki-user-sac');
        const settingsSacVal = document.getElementById('settings-sac-value');
        if (settingsSacVal) {
            settingsSacVal.textContent = savedSAC ? (savedSAC + ' l/min') : 'Brak';
        }

        const resetSacBtn = document.getElementById('reset-sac-btn');
        if (resetSacBtn) {
            resetSacBtn.addEventListener('click', () => {
                localStorage.removeItem('uki-user-sac');
                if (settingsSacVal) settingsSacVal.textContent = 'Brak';
                // Clear inputs? Maybe next reload.
                alert('Zapisany SAC został usunięty.');
            });
        }

        // Init PRO Status Display
        // Logic moved to AppUI.initProState() for dynamic updates
        AppUI.initProState(); // Call the new function here
    },

    initProState: () => {
        // Run this immediately on init to prevent flash of locked content
        const isUnlocked = ProAccess.isUnlocked();

        // Always update the Settings Panel text if it exists
        const proStatusDisplay = document.getElementById('pro-status-display');
        const resetProBtn = document.getElementById('reset-pro-btn');

        if (proStatusDisplay) {
            proStatusDisplay.textContent = isUnlocked ? 'Aktywny' : 'Zablokowany';
            proStatusDisplay.style.color = isUnlocked ? '#D81B60' : '#DC143C';
        }

        if (resetProBtn) {
            resetProBtn.style.display = isUnlocked ? 'block' : 'none';
        }

        if (isUnlocked) {
            const proDashboard = document.getElementById('pro-dashboard');
            if (proDashboard) proDashboard.classList.add('unlocked');

            const overlays = document.querySelectorAll('.pro-lock-overlay');
            overlays.forEach(o => o.style.display = 'none');

            document.querySelectorAll('.locked-feature').forEach(el => el.classList.remove('locked-feature'));
        } else {
            // Optional: ensure locked state is visually enforced if we ever call this to re-lock
            // But for now, reload() is used for locking, so this is mainly for unlock or init.
        }
    },

    showModal: (html, isEmergency = false) => {
        const globalTooltip = document.getElementById('global-tooltip');
        const tooltipOverlay = document.getElementById('tooltip-overlay');
        const tooltipBody = document.getElementById('tooltip-body');

        if (!globalTooltip || !tooltipOverlay || !tooltipBody) return;

        tooltipBody.innerHTML = html;
        globalTooltip.style.display = 'block';
        tooltipOverlay.style.display = 'block';
        if (isEmergency) globalTooltip.classList.add('emergency-modal');
        else globalTooltip.classList.remove('emergency-modal');
    },

    closeModal: () => {
        const globalTooltip = document.getElementById('global-tooltip');
        const tooltipOverlay = document.getElementById('tooltip-overlay');
        const tooltipBody = document.getElementById('tooltip-body');

        if (globalTooltip) globalTooltip.style.display = 'none';
        if (tooltipOverlay) tooltipOverlay.style.display = 'none';
        if (tooltipBody) tooltipBody.innerHTML = '';
    },

    initTooltips: () => {
        const tooltipOverlay = document.getElementById('tooltip-overlay');
        const tooltipCloseBtn = document.getElementById('tooltip-close-btn');

        if (tooltipCloseBtn) tooltipCloseBtn.addEventListener('click', AppUI.closeModal);
        if (tooltipOverlay) tooltipOverlay.addEventListener('click', AppUI.closeModal);

        // Tooltip triggers
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.tooltip-trigger'); // Use closest for flexibility
            // NOTE: Original script checked class directly on target for result-info-icon 

            if (e.target.classList.contains('result-info-icon')) {
                const container = e.target.closest('.result-container') || e.target.parentElement;
                const details = container.querySelector('.calculation-details');
                if (details) {
                    const isPro = e.target.dataset.proFeature === 'true';
                    const unlocked = document.querySelector('#pro-dashboard')?.classList.contains('unlocked');

                    if (!isPro || unlocked) {
                        AppUI.showModal(details.innerHTML);
                    } else {
                        AppUI.showModal("<div style='text-align:center;'><h4>🔒 Funkcja PRO</h4><p>Szczegółowe obliczenia są dostępne w wersji PRO.</p></div>");
                    }
                }
                return;
            }

            // Tooltip buttons in content
            if (e.target.classList.contains('tooltip-button')) {
                const content = e.target.querySelector('.tooltip-content');
                if (content) AppUI.showModal(content.innerHTML);
            }
        });


    },

    scrollToResult: (element) => {
        if (!element) return;

        setTimeout(() => {
            const container = document.querySelector('.tab-content-wrapper');
            if (!container) return;

            const rect = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // Check if element is already fully visible
            const isFullyVisible = (
                rect.top >= containerRect.top &&
                rect.bottom <= containerRect.bottom
            );

            // If fully visible, don't scroll (user experience)
            // if (isFullyVisible) return; // FORCE SCROLL disabled for now per user report

            const currentScroll = container.scrollTop;
            const relativeTop = rect.top - containerRect.top;
            const containerHeight = containerRect.height;
            const elementHeight = rect.height;

            let targetScroll;

            if (elementHeight < containerHeight) {
                // Center the element
                const offset = (containerHeight - elementHeight) / 2;
                targetScroll = currentScroll + relativeTop - offset;
            } else {
                // Align to top with padding
                targetScroll = currentScroll + relativeTop - 20;
            }

            container.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        }, 150);
    },

    initPWA: () => {
        // Check if running in automated test mode (WebDriver)
        if (navigator.webdriver) {
            console.log("App running in WebDriver mode (Test). PWA Banner disabled.");
            return;
        }

        // Check if running in standalone mode (PWA)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || document.referrer.includes('android-app://');

        if (isStandalone) {
            console.log("App running in PWA mode.");
            return; // Don't show banner if already installed
        }

        // Check if user dismissed the banner previously
        const isDismissed = localStorage.getItem('uki-pwa-banner-dismissed') === 'true';
        if (isDismissed) return;

        // Banner elements
        const banner = document.getElementById('pwa-install-banner');
        if (!banner) return;

        // Helpers
        const hideBanner = () => {
            banner.classList.remove('visible');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 500); // 500ms transition match
        };

        const showBanner = () => {
            banner.style.display = 'flex';
            // Force reflow to ensure transition works
            void banner.offsetWidth;
            banner.classList.add('visible');
        };

        // Initialize: Ensure hidden initially (CSS has it too, but safety first)
        banner.style.display = 'none';

        // Show banner after delay
        setTimeout(() => {
            showBanner();
        }, 3000); // 3 seconds delay

        // Button Listeners
        const dismissBtn = document.getElementById('pwa-limit-banner-btn');
        const openGuideBtn = document.getElementById('pwa-open-guide-btn');
        const dontShowCheckbox = document.getElementById('pwa-dont-show-again');

        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                hideBanner();
                // Handle "Don't show again"
                if (dontShowCheckbox && dontShowCheckbox.checked) {
                    localStorage.setItem('uki-pwa-banner-dismissed', 'true');
                }
            });
        }

        if (openGuideBtn) {
            openGuideBtn.addEventListener('click', () => {
                hideBanner(); // Hide first, then navigate
                if (dontShowCheckbox && dontShowCheckbox.checked) {
                    localStorage.setItem('uki-pwa-banner-dismissed', 'true');
                }

                // Navigate to Settings
                window.switchTab('settings-panel');
                // Find and expand the guide
                const guideSection = document.getElementById('settings-pwa-guide');
                const guideContent = document.getElementById('install-guide-content');
                const guideIcon = document.getElementById('guide-toggle-icon');

                if (guideSection && guideContent) {
                    guideContent.classList.add('expanded');
                    if (guideIcon) guideIcon.style.transform = 'rotate(180deg)';

                    setTimeout(() => {
                        AppUI.scrollToResult(guideSection);
                    }, 150); // Small delay to allow tab switch and expansion
                }
            });
        }
    }
};

window.AppUI = AppUI