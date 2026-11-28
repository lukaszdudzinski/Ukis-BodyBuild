// wyglad: zar
import { DatabaseManager } from '../db/DatabaseManager.js';
import { MediaManager } from '../db/MediaManager.js';
import { ShareUtils } from '../../utils/ShareUtils.js';
import { isTrainerEnabled, setTrainerEnabled, getTrainerLicense } from '../trainer/trainerAccess.js';
import { applyDefaultAvatar, loadAvatarChoice, saveAvatarChoice, avatarDataUri, resolveGender } from './defaultAvatar.js';
import { Wyglad, ZDARZENIE as WYGLAD_ZMIENIONY } from '../wyglad/tlo.js';
import { nazwaMotywu } from '../wyglad/WygladUI.js';
import { PremiumUI } from './PremiumUI.js';
import { loadKcalGoal } from '../diet/kcalGoal.js';

// Dane w innerHTML zawsze przez esc() (także w atrybutach w cudzysłowie).
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ustaw = (id, tekst) => { const el = document.getElementById(id); if (el) el.textContent = tekst; };

// „1 odznaka”, „2 odznaki”, „5 odznak”.
const odznakiSlowo = (n) => {
    if (n === 1) return 'odznaka';
    const d = n % 10, s = n % 100;
    return d >= 2 && d <= 4 && (s < 12 || s > 14) ? 'odznaki' : 'odznak';
};
// Krótki staż do karty i wiersza: „1-3 lata (Średniozaawansowany)” → „1-3 lata”.
const krotkiStaz = (v) => String(v || '').replace(/\s*\(.*\)\s*$/, '');
const SYLWETKI = { auto: 'Automatycznie', male: 'Mężczyzna', female: 'Kobieta' };
const DOMYSLNY_STAZ = '1-3 lata (Średniozaawansowany)';

export const SettingsUI = {
    init: () => {
        const settingsPanel = document.getElementById('settings-panel');
        if (!settingsPanel) return;

        // „Zobacz ponownie powitanie”: powitanie Edwarda od razu (OnboardingUI.init pokazuje je, gdy nie ma flagi v22).
        const resetTutorialBtn = document.getElementById('reset-tutorial-btn');
        if (resetTutorialBtn) {
            resetTutorialBtn.addEventListener('click', () => {
                localStorage.removeItem('tutorial_global');
                localStorage.removeItem('tutorial_global_v22');
                if (window.OnboardingUI) window.OnboardingUI.init();
            });
        }

        SettingsUI.initRozwijane();
        SettingsUI.initCelKcal();
        SettingsUI.initTrainerCard();
        SettingsUI.initWygladRow();
        SettingsUI.initTheme();
        SettingsUI.initLaboratory();
        SettingsUI.initProfile();
        SettingsUI.initDietSettings();

        SettingsUI.renderBadges();
        SettingsUI.odswiezKarte();

        // Plakietka PRO i wersja idą za stanem z PremiumUI (np. po odblokowaniu PRO z paska w Profilu).
        const banner = document.getElementById('premium-status-banner');
        if (banner && typeof MutationObserver === 'function') {
            new MutationObserver(() => SettingsUI.odswiezKarte()).observe(banner, { childList: true });
        }
        document.addEventListener('nickUpdated', () => SettingsUI.odswiezKarte());
        document.addEventListener('tabChanged', (e) => {
            if (!e.detail || e.detail.tab !== 'settings-panel') return;
            SettingsUI.renderBadges();
            SettingsUI.odswiezKarte();
        });
    },

    // Wiersze z aria-controls rozwijają edytor w miejscu. Klasa .expanded na treści zostaje dla AppUI
    // (baner limitu PWA otwiera „Instalację” kliknięciem w .install-guide-header, gdy treść jej nie ma).
    initRozwijane: () => {
        document.querySelectorAll('#settings-panel button[aria-controls][aria-expanded]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const tresc = document.getElementById(btn.getAttribute('aria-controls'));
                if (!tresc) return;
                const otworz = btn.getAttribute('aria-expanded') !== 'true';
                btn.setAttribute('aria-expanded', String(otworz));
                tresc.hidden = !otworz;
                tresc.classList.toggle('expanded', otworz);
            });
        });
    },

    // „Cel kaloryczny” otwiera dzisiejsze okno celu kcal z Diety (#diet-tdee-modal, DietUI.otworzCelKcal).
    initCelKcal: () => {
        const btn = document.getElementById('profile-cel-kcal');
        if (!btn) return;
        btn.addEventListener('click', () => {
            if (window.DietUI && typeof window.DietUI.otworzCelKcal === 'function') {
                window.DietUI.otworzCelKcal(btn, () => SettingsUI.odswiezKarte());
            }
        });
    },

    // Karta użytkownika i wartości wierszy listy: nick, awatar, staż, odznaki, przypomnienie, cel kcal, PRO, wersja.
    odswiezKarte: () => {
        const nick = (localStorage.getItem('userNick') || '').trim();
        ustaw('profile-karta-nick', nick || 'Bez nicku');
        ustaw('profile-nick-val', nick || 'Brak');
        const nickInput = document.getElementById('profile-nick-input');
        if (nickInput && document.activeElement !== nickInput && nickInput.value !== nick) nickInput.value = nick;

        const staz = krotkiStaz(localStorage.getItem('trainingExperience') || DOMYSLNY_STAZ);
        const ach = window.AchievementsSystem;
        const defs = ach ? ach.achievementsDef : {};
        const zdobyte = ach ? ach.getEarnedAchievements().filter((id) => defs[id]).length : 0;
        ustaw('profile-karta-meta', `Staż ${staz} · ${zdobyte} ${odznakiSlowo(zdobyte)}`);
        ustaw('profile-staz-val', staz);
        ustaw('profile-odznaki-val', `${zdobyte} z ${Object.keys(defs).length}`);

        const przyp = localStorage.getItem('uki-bodybuild-reminder') || '30';
        ustaw('profile-przypomnienie-val', przyp === '0' ? 'Wyłączone' : `Co ${przyp} dni`);

        const { goal } = loadKcalGoal();
        ustaw('profile-cel-kcal-val', goal ? `${goal.kcal} kcal` : 'Ustaw');

        const wybor = loadAvatarChoice();
        const zdjecie = localStorage.getItem('uki-bodybuild-avatar');
        ustaw('profile-avatar-val', zdjecie ? 'Własne zdjęcie' : SYLWETKI[wybor]);
        const podglad = document.getElementById('profile-avatar-preview');
        if (podglad && !zdjecie) podglad.style.backgroundImage = `url("${avatarDataUri(resolveGender(nick, wybor))}")`;

        const status = PremiumUI.getTrialStatus();
        const pill = document.getElementById('profile-pro-pill');
        if (pill) pill.hidden = !status.isProToken;
        ustaw('settings-app-version', window.APP_VERSION ? `${status.isProToken ? 'Heavy' : (status.hasAccess ? `Trial (${PremiumUI.dniTekst(status.daysLeft)})` : 'Light')} ${window.APP_VERSION}` : '');
    },

    // Karta „Jestem trenerem”: przełącznik pokazujący kafelek Strefy oraz imię z ważnego kodu.
    initTrainerCard: () => {
        const panel = document.getElementById('settings-panel');
        if (!panel || document.getElementById('trainer-profile-card')) return;

        // Wiersz z-switch: etykieta (tekst, podpowiedź, imię trenera z kodu) + ukryte pole wyboru role="switch" + tor.
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'profil-switch-pole';
        checkbox.setAttribute('role', 'switch');
        checkbox.checked = isTrainerEnabled();
        const labelText = document.createElement('span');
        labelText.textContent = 'Jestem trenerem';
        const hint = document.createElement('span');
        hint.className = 'z-mut';
        hint.textContent = 'Pokazuje w Menu kafelek Strefy trenera: osobne, szyfrowane miejsce na dane klientów.';
        const who = document.createElement('span');
        who.className = 'profil-trener-kto';
        who.hidden = true;
        const txt = document.createElement('span');
        txt.className = 'profil-switch-txt';
        txt.append(labelText, hint, who);
        const tor = document.createElement('span');
        tor.className = 'z-switch-tor';
        tor.setAttribute('aria-hidden', 'true');
        const toggle = document.createElement('label');
        toggle.className = 'z-switch trainer-switch';
        toggle.append(txt, checkbox, tor);

        const card = document.createElement('div');
        card.id = 'trainer-profile-card';
        card.className = 'profil-trener';
        card.append(toggle);

        const showName = async () => {
            const license = await getTrainerLicense();
            who.hidden = !license.ok;
            who.textContent = license.ok ? `Trener: ${license.name}` : '';
        };
        checkbox.addEventListener('change', () => {
            setTrainerEnabled(checkbox.checked);
            document.dispatchEvent(new CustomEvent('trainerAccessChanged'));
        });
        document.addEventListener('trainerAccessChanged', (e) => {
            if (e.detail && e.detail.license) {
                who.hidden = !e.detail.license.ok;
                who.textContent = e.detail.license.ok ? `Trener: ${e.detail.license.name}` : '';
            }
        });

        // Miejsce montażu: karta przełączników Profilu (pod „Efektem szkła” i „Laboratorium”).
        const box = document.getElementById('profile-przelaczniki') || panel.querySelector('.settings-container') || panel;
        box.appendChild(card);
        showName();
    },

    renderBadges: () => {
        const container = document.getElementById('settings-badges-container');
        if (!container) return;

        if (!window.AchievementsSystem) return;

        const earnedIds = window.AchievementsSystem.getEarnedAchievements();
        const allDefs = window.AchievementsSystem.achievementsDef;
        let html = '';

        // Ikona odznaki to SVG z kodu (AchievementsSystem), nie dane użytkownika.
        for (const key in allDefs) {
            const def = allDefs[key];
            const isEarned = earnedIds.includes(def.id);
            html += `
                <div class="profil-odznaka${isEarned ? ' z-on' : ''}" title="${esc(def.description)}">
                    <span class="profil-odznaka-ik" aria-hidden="true">${def.icon}</span>
                    <span class="profil-odznaka-tyt">${esc(def.title)}</span>
                    <span class="z-sr">${isEarned ? 'zdobyta' : 'do zdobycia'}: ${esc(def.description)}</span>
                </div>
            `;
        }

        if (Object.keys(allDefs).length === 0) {
            html = '<div class="z-mut">Brak zdefiniowanych odznak.</div>';
        }

        container.innerHTML = html;
    },

    shareBadges: async () => {
        if (!window.AchievementsSystem) return;
        const earnedIds = window.AchievementsSystem.getEarnedAchievements();
        const allDefs = window.AchievementsSystem.achievementsDef;
        
        let earnedCount = earnedIds.length;
        if (earnedCount === 0) {
            alert("Nie zdobyłeś jeszcze żadnej odznaki! Zrób trening i wróć tutaj.");
            return;
        }

        let badgesText = earnedIds.map(id => {
            const def = allDefs[id];
            return def ? `${def.icon} ${def.title}` : '';
        }).filter(b => b).join(', ');

        const textToShare = `Zdobyłem ${earnedCount} odznak w Uki's BodyBuild! Moja kolekcja: ${badgesText}. Dołącz i bij rekordy: https://lukaszdudzinski.github.io/Ukis-BodyBuild/`;

        const statsList = [
            { label: 'Zdobyte odznaki', value: String(earnedCount), color: getComputedStyle(document.documentElement).getPropertyValue('--ukis-color-accent').trim() || undefined },
            { label: 'Kolekcja', value: badgesText.substring(0, 30) + (badgesText.length > 30 ? '...' : '') }
        ];

        const avatar = localStorage.getItem('uki-bodybuild-avatar') || null;
        const nickname = (JSON.parse(localStorage.getItem('uki_bodybuild_settings') || '{}')).nickname || 'BodyBuilder';

        try {
            if (ShareUtils) {
                await ShareUtils.generateAndShareImage("Moje Odznaki", statsList, avatar, nickname, textToShare);
            } else {
                throw new Error("Brak ShareUtils");
            }
        } catch (error) {
            console.log("Share error:", error);
            if (error.name === 'AbortError') return;
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(textToShare);
                    alert("Skopiowano tekst do schowka. Możesz go wkleić do wybranej aplikacji.");
                } else {
                    window.prompt("Skopiuj swoje osiągnięcia (Ctrl+C / Cmd+C):", textToShare);
                }
            } catch(e) {
                window.prompt("Skopiuj swoje osiągnięcia (Ctrl+C / Cmd+C):", textToShare);
            }
        }
    },

    initDietSettings: () => {
        const workerUrlInput = document.getElementById('diet-worker-url');

        if (workerUrlInput) {
            const savedUrl = localStorage.getItem('dietWorkerUrl') || '';
            workerUrlInput.value = savedUrl;
            workerUrlInput.addEventListener('input', (e) => {
                localStorage.setItem('dietWorkerUrl', e.target.value);
            });
        }
    },

    initLaboratory: () => {
        const toggle = document.getElementById('experimental-numpad-toggle');
        if (!toggle) return;
        
        const isExp = localStorage.getItem('uki-experimental-numpad') === 'on';
        toggle.checked = isExp;
        
        toggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                localStorage.setItem('uki-experimental-numpad', 'on');
                alert("Włączono eksperymentalny tryb Treningu. Nowe opcje pojawią się przy najbliższym rozpoczęciu sesji treningowej.");
            } else {
                localStorage.setItem('uki-experimental-numpad', 'off');
                alert("Przywrócono klasyczny tryb Treningu z domyślną klawiaturą.");
            }
        });
    },

    // Wiersz „Wygląd: motyw i tapeta” w Profilu: nazwa bieżącego motywu, odświeżana po każdej zmianie wyglądu.
    initWygladRow: () => {
        const val = document.getElementById('profile-wyglad-motyw');
        if (!val) return;
        const paint = (motyw) => { val.textContent = nazwaMotywu(motyw); };
        paint(Wyglad.getWyglad().motyw);
        document.addEventListener(WYGLAD_ZMIENIONY, (e) => paint((e.detail || Wyglad.getWyglad()).motyw));
    },

    // Nowy wygląd jest tylko ciemny (spec, decyzja 2): body.dark-theme zawsze, bez przełącznika.
    initTheme: () => {
        const glassToggle = document.getElementById('glass-toggle');
        const savedGlass = localStorage.getItem('uki-bodybuild-glass');

        document.body.classList.add('dark-theme');

        // Glass is ON by default. If 'off', we add .glass-off
        if (savedGlass === 'off') {
            document.body.classList.add('glass-off');
            if (glassToggle) glassToggle.checked = false;
        } else {
            document.body.classList.remove('glass-off');
            if (glassToggle) glassToggle.checked = true;
        }

        if (glassToggle) {
            glassToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.body.classList.remove('glass-off');
                    localStorage.setItem('uki-bodybuild-glass', 'on');
                } else {
                    document.body.classList.add('glass-off');
                    localStorage.setItem('uki-bodybuild-glass', 'off');
                }
            });
        }
    },

    initProfile: () => {
        const nickInput = document.getElementById('profile-nick-input');
        const avatarUpload = document.getElementById('profile-avatar-upload');
        const avatarPreview = document.getElementById('profile-avatar-preview');
        const reminderSelect = document.getElementById('profile-reminder-select');

        // Load saved values
        const savedNick = localStorage.getItem('userNick');
        const savedAvatar = localStorage.getItem('uki-bodybuild-avatar');
        
        if (savedNick && nickInput) {
            nickInput.value = savedNick;
            SettingsUI.applyProfileNick(savedNick);
        }
        
        if (savedAvatar && avatarPreview) {
            MediaManager.getMediaUrl(savedAvatar).then(url => {
                if (url) {
                    avatarPreview.style.backgroundImage = `url("${url}")`;
                }
            });
            SettingsUI.applyProfileAvatar(savedAvatar);
        }

        if (reminderSelect) {
            const savedReminder = localStorage.getItem('uki-bodybuild-reminder') || '30';
            reminderSelect.value = savedReminder;
            
            reminderSelect.addEventListener('change', (e) => {
                localStorage.setItem('uki-bodybuild-reminder', e.target.value);
                SettingsUI.odswiezKarte();
            });
        }

        const silhouetteSelect = document.getElementById('profile-avatar-silhouette');
        if (silhouetteSelect) {
            silhouetteSelect.value = loadAvatarChoice();
            silhouetteSelect.addEventListener('change', (e) => {
                saveAvatarChoice(e.target.value);
                applyDefaultAvatar();
                SettingsUI.odswiezKarte();
            });
        }

        const expSelect = document.getElementById('profile-experience-select');
        if (expSelect) {
            const savedExp = localStorage.getItem('trainingExperience') || '1-3 lata (Średniozaawansowany)';
            expSelect.value = savedExp;
            
            expSelect.addEventListener('change', (e) => {
                localStorage.setItem('trainingExperience', e.target.value);
                SettingsUI.odswiezKarte();
            });
        }

        // Listeners
        if (nickInput) {
            nickInput.addEventListener('input', (e) => {
                const val = e.target.value.trim();
                localStorage.setItem('userNick', val);
                SettingsUI.applyProfileNick(val);
                document.dispatchEvent(new Event('nickUpdated'));
            });
        }

        // „Zmień zdjęcie” to przycisk (osiągalny z klawiatury): otwiera ukryte pole wyboru pliku.
        const avatarBtn = document.getElementById('profile-avatar-btn');
        if (avatarBtn && avatarUpload) avatarBtn.addEventListener('click', () => avatarUpload.click());

        if (avatarUpload) {
            avatarUpload.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        const id = await MediaManager.saveMedia(file);
                        localStorage.setItem('uki-bodybuild-avatar', id);
                        const url = await MediaManager.getMediaUrl(id);
                        if (avatarPreview && url) {
                            avatarPreview.style.backgroundImage = `url("${url}")`;
                        }
                        SettingsUI.applyProfileAvatar(id);
                        SettingsUI.odswiezKarte();
                    } catch(err) {
                        alert('Błąd zapisu avatara.');
                    }
                }
            });
        }
    },

    applyProfileNick: (nick) => {
        // Find header elements where nick should be displayed
        // We'll try to find a specific span in the header, or create it.
        const headerContainer = document.querySelector('.header-container');
        if (headerContainer) {
            let nickEl = document.getElementById('header-user-nick');
            if (!nickEl) {
                nickEl = document.createElement('div');
                nickEl.id = 'header-user-nick';
                nickEl.style.fontSize = '0.9em';
                nickEl.style.color = 'var(--ukis-color-accent)';
                nickEl.style.marginRight = '10px';
                // Insert before the nav-links
                const navLinks = document.querySelector('.nav-links');
                if(navLinks) {
                    headerContainer.insertBefore(nickEl, navLinks);
                } else {
                    headerContainer.appendChild(nickEl);
                }
            }
            nickEl.textContent = nick ? `Witaj, ${nick}!` : '';
        }
    },

    applyProfileAvatar: async (base64) => {
        let avatarUrl = base64;
        if (base64 && !base64.startsWith('data:')) {
            try {
                if (window.MediaManager) {
                    avatarUrl = await window.MediaManager.getMediaUrl(base64);
                } else if (window.DatabaseManager) {
                    avatarUrl = await window.MediaManager.getMediaUrl(base64);
                }
            } catch (e) {
                console.warn('Could not load avatar', e);
            }
        }
        
        const newAvatarImg = document.getElementById('user-avatar-img');
        if (newAvatarImg && avatarUrl) {
            newAvatarImg.src = avatarUrl;
            newAvatarImg.dataset.avatarSource = 'photo';
        }

        // Create or update avatar in the header
        const headerContainer = document.querySelector('.header-container');
        if (headerContainer) {
            let avatarEl = document.getElementById('header-user-avatar');
            if (!avatarEl) {
                avatarEl = document.createElement('div');
                avatarEl.id = 'header-user-avatar';
                avatarEl.style.width = '40px';
                avatarEl.style.height = '40px';
                avatarEl.style.borderRadius = '50%';
                avatarEl.style.backgroundSize = 'cover';
                avatarEl.style.backgroundPosition = 'center';
                avatarEl.style.border = '2px solid var(--ukis-color-accent)';
                avatarEl.style.marginRight = '15px';
                
                const nickEl = document.getElementById('header-user-nick');
                if (nickEl) {
                    headerContainer.insertBefore(avatarEl, nickEl.nextSibling);
                } else {
                    headerContainer.appendChild(avatarEl);
                }
            }
            if (avatarUrl) {
                avatarEl.style.backgroundImage = 'url('+avatarUrl+')';
                avatarEl.style.display = 'block';
            } else {
                avatarEl.style.display = 'none';
            }
        }    },

    handleExport: async () => {
        try {
            const jsonString = await DatabaseManager.exportDatabase();
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-mm-ss
            a.download = `bodybuild_backup_${dateStr}_${timeStr}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert("Baza została wyeksportowana!");
        } catch (err) {
            console.error(err);
            alert("Błąd podczas eksportu bazy danych.");
        }
    },

    handleImport: async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (confirm("UWAGA: Import nadpisze wszystkie obecne dane (pomiary, treningi). Czy chcesz kontynuować?")) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const jsonString = event.target.result;
                let success = false;
                try {
                    success = await DatabaseManager.importDatabase(jsonString).catch((err) => {
                        if (err?.message !== 'SEJF_ISTNIEJE') throw err;
                        const replaceTrainerVault = confirm("Zastąpić dane Strefy trenera danymi z kopii?");
                        return DatabaseManager.importDatabase(jsonString, { replaceTrainerVault });
                    });
                } catch (err) {
                    console.error(err);
                }
                
                if (success) {
                    alert("Baza została pomyślnie zaimportowana! Aplikacja zostanie przeładowana.");
                    window.location.reload();
                } else {
                    alert("Błąd podczas importu. Sprawdź plik JSON.");
                }
            };
            reader.readAsText(file);
        }
        
        // Reset input
        e.target.value = '';
    }
};
