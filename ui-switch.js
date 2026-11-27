/**
 * Uki's BodyBuild - UI Version Switcher (Okres Przejściowy)
 * Obsługa przełączania pomiędzy nowym wyglądem (Czerwony żar) a klasycznym (Retro).
 */
(function () {
    const STORAGE_KEY = 'uki-ui-version';
    const WELCOME_KEY = 'uki-ui-welcome-seen';
    const WELCOME_CLOSED_EVENT = 'ukiUiWelcomeClosed';

    const UkiUiSwitch = {
        STORAGE_KEY,
        WELCOME_KEY,
        WELCOME_CLOSED_EVENT,

        // true od startu strony, dopóki powitanie nowego wyglądu ma się pokazać albo jest otwarte.
        welcomePending: false,

        // Aplikacja uruchomiona jako zainstalowana (PWA z ekranu początkowego). W zwykłej karcie przeglądarki
        // index.html pokazuje stronę z instrukcją instalacji, więc okna startowe aplikacji się nie pokazują.
        // navigator.webdriver: testy automatyczne działają jak aplikacja (tak samo jak w index.html).
        isAppMode: function () {
            try {
                return window.matchMedia('(display-mode: standalone)').matches
                    || window.navigator.standalone === true
                    || navigator.webdriver === true
                    || document.referrer.indexOf('android-app://') === 0;
            } catch (e) {
                return true;
            }
        },

        // Nowa instalacja: nikt tu jeszcze nie przeszedł powitania Edwarda ani nie widział żadnej wersji.
        // Taki użytkownik nie zna starego wyglądu, więc powitanie nowego wyglądu jest mu zbędne.
        isFreshInstall: function () {
            try {
                return localStorage.getItem('tutorial_global_v22') !== 'true'
                    && localStorage.getItem('uki-bodybuild-last-version') === null;
            } catch (e) {
                return false;
            }
        },

        // Wywołuje cb, gdy powitanie nowego wyglądu jest zamknięte (od razu, jeśli go nie będzie).
        // Dzięki temu kolejne okna startowe (powitanie Edwarda, „Co nowego?”) nie nakładają się na nie.
        whenWelcomeClosed: function (cb) {
            if (!this.welcomePending) {
                cb();
                return;
            }
            document.addEventListener(WELCOME_CLOSED_EVENT, () => cb(), { once: true });
        },

        getCurrentVersion: function () {
            try {
                return localStorage.getItem(STORAGE_KEY) === 'classic' ? 'classic' : 'new';
            } catch (e) {
                return 'new';
            }
        },

        isClassicPage: function () {
            const path = window.location.pathname;
            return path.endsWith('classic.html') || path.endsWith('/classic');
        },

        switchTo: function (targetVersion) {
            try {
                localStorage.setItem(STORAGE_KEY, targetVersion);
            } catch (e) {
                console.warn('LocalStorage error:', e);
            }

            if (targetVersion === 'classic') {
                if (!this.isClassicPage()) {
                    window.location.replace('classic.html');
                } else {
                    window.location.reload();
                }
            } else {
                if (this.isClassicPage()) {
                    window.location.replace('./');
                } else {
                    window.location.reload();
                }
            }
        },

        // Strefa trenera istnieje tylko w nowym wyglądzie, więc przy włączonym „Jestem trenerem” nie ma przejścia na klasyczny.
        isTrainerEnabled: function () {
            try {
                return localStorage.getItem('ukis.bodybuild.trener.wlaczony') === 'true';
            } catch (e) {
                return false;
            }
        },

        mountSettingsCard: function (container) {
            if (!container) return;
            // Unikaj duplikowania karty jeśli montowana wielokrotnie
            if (document.getElementById('uki-ui-switch-card')) return;

            // Przełącznik „Jestem trenerem” w Profilu przebudowuje kartę od razu.
            if (!this._trainerListener) {
                this._trainerListener = true;
                document.addEventListener('trainerAccessChanged', () => {
                    const old = document.getElementById('uki-ui-switch-card');
                    if (!old) return;
                    const parent = old.parentNode;
                    old.remove();
                    UkiUiSwitch.mountSettingsCard(parent);
                });
            }

            const current = this.getCurrentVersion();
            const isClassic = current === 'classic';

            const card = document.createElement('div');
            card.id = 'uki-ui-switch-card';
            card.style.cssText = 'margin-top: 20px; margin-bottom: 25px; padding: 18px; border-radius: 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 152, 0, 0.35); text-align: left; box-shadow: 0 4px 15px rgba(0,0,0,0.25);';

            card.innerHTML = `
                <h4 style="margin: 0 0 10px 0; color: #fff; font-size: 1.05em; font-weight: 700;">Styl i Wygląd Aplikacji</h4>
                <p style="margin: 0 0 14px 0; color: #bbb; font-size: 0.85em; line-height: 1.4;">Wybierz wygląd aplikacji.</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button id="btn-switch-ui-new" style="padding: 12px 10px; border-radius: 12px; font-weight: 700; font-size: 0.85em; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; gap: 4px; border: ${!isClassic ? '2px solid #00D26A' : '1px solid rgba(255,255,255,0.15)'}; background: ${!isClassic ? 'rgba(0, 210, 106, 0.2)' : 'rgba(255,255,255,0.05)'}; color: ${!isClassic ? '#00D26A' : '#aaa'};">
                        <span>Nowy (Czerwony żar)</span>
                        ${!isClassic ? '<span style="font-size: 0.7em; opacity: 0.8;">Aktywny</span>' : ''}
                    </button>
                    <button id="btn-switch-ui-classic" style="padding: 12px 10px; border-radius: 12px; font-weight: 700; font-size: 0.85em; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; gap: 4px; border: ${isClassic ? '2px solid #FF9800' : '1px solid rgba(255,255,255,0.15)'}; background: ${isClassic ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255,255,255,0.05)'}; color: ${isClassic ? '#FF9800' : '#aaa'};">
                        <span>Klasyczny (Retro)</span>
                        ${isClassic ? '<span style="font-size: 0.7em; opacity: 0.8;">Aktywny</span>' : ''}
                    </button>
                </div>
            `;

            if (this.isTrainerEnabled()) {
                // Na classic.html zostaje przycisk powrotu do nowego wyglądu, inaczej trener nie miałby wyjścia.
                const onClassicPage = this.isClassicPage();
                card.innerHTML = `
                    <h4 style="margin: 0 0 10px 0; color: #fff; font-size: 1.05em; font-weight: 700;">Styl i Wygląd Aplikacji</h4>
                    <p style="margin: 0; color: #bbb; font-size: 0.85em; line-height: 1.4;">Strefa trenera działa tylko w nowym wyglądzie.</p>
                    ${onClassicPage ? `
                    <button id="btn-switch-ui-new" style="margin-top: 14px; width: 100%; padding: 12px 10px; border-radius: 12px; font-weight: 700; font-size: 0.85em; cursor: pointer; border: 2px solid #00D26A; background: rgba(0, 210, 106, 0.2); color: #00D26A;">
                        Nowy (Czerwony żar)
                    </button>` : ''}
                `;
                container.appendChild(card);
                const btnBack = card.querySelector('#btn-switch-ui-new');
                if (btnBack) btnBack.addEventListener('click', () => UkiUiSwitch.switchTo('new'));
                return;
            }

            container.appendChild(card);

            const btnNew = card.querySelector('#btn-switch-ui-new');
            const btnClassic = card.querySelector('#btn-switch-ui-classic');

            if (btnNew) {
                btnNew.addEventListener('click', () => {
                    if (isClassic) UkiUiSwitch.switchTo('new');
                });
            }
            if (btnClassic) {
                btnClassic.addEventListener('click', () => {
                    if (!isClassic) UkiUiSwitch.switchTo('classic');
                });
            }
        },

        showWelcomeModal: function () {
            // Pokazujemy tylko na nowym wyglądzie i tylko raz
            if (this.isClassicPage()) return;
            let seen = true;
            try {
                seen = localStorage.getItem(WELCOME_KEY) === 'true';
            } catch (e) {}
            if (seen) {
                // Np. zamknięte w innej karcie: nie każ następnym oknom czekać.
                this.markWelcomeClosed();
                return;
            }

            const modal = document.createElement('div');
            modal.id = 'uki-new-ui-welcome-overlay';
            modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0, 0, 0, 0.82); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; animation: ukiFadeIn 0.3s ease;';

            modal.innerHTML = `
                <div style="background: rgba(24, 24, 28, 0.95); border: 1px solid rgba(255, 152, 0, 0.45); border-radius: 20px; padding: 24px; max-width: 420px; width: 100%; color: #fff; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.6); position: relative;">
                    <div style="width: 60px; height: 60px; margin: 0 auto 14px auto; border-radius: 50%; background: rgba(255, 152, 0, 0.15); border: 1px solid rgba(255, 152, 0, 0.4); display: flex; align-items: center; justify-content: center; color: #FF9800;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
                    </div>
                    <h3 style="margin: 0 0 8px 0; font-size: 1.35em; color: #fff; font-weight: 700;">Witaj w Nowym Wyglądzie!</h3>
                    <p style="margin: 0 0 18px 0; color: #FF9800; font-size: 0.85em; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                        Uki's BodyBuild • Nowy wygląd aplikacji
                    </p>
                    <p style="margin: 0 0 16px 0; color: #ccc; font-size: 0.92em; line-height: 1.5; text-align: left;">
                        Odświeżyliśmy wygląd aplikacji: nowe kolory, czytelniejsze ekrany i większe przyciski.
                    </p>
                    <div data-welcome-classic-hint style="background: rgba(255, 255, 255, 0.05); border-left: 3px solid #FF9800; padding: 10px 14px; border-radius: 8px; margin-bottom: 22px; text-align: left; font-size: 0.85em; color: #bbb;">
                        <strong>Możesz wrócić w każdej chwili:</strong> Jeżeli wolisz klasyczny, ciemny widok, przełączysz go jednym kliknięciem w zakładce <strong>Profil → Ustawienia</strong>.
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button id="btn-welcome-explore" style="width: 100%; padding: 14px; border-radius: 12px; border: none; background: #00D26A; color: #000; font-weight: 800; font-size: 1em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 15px rgba(0, 210, 106, 0.35);">
                            Odkryj nowy wygląd
                        </button>
                        <button id="btn-welcome-to-classic" style="width: 100%; padding: 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15); background: transparent; color: #888; font-size: 0.85em; cursor: pointer;">
                            Wróć do klasycznego wyglądu
                        </button>
                    </div>
                </div>
            `;

            // Strefa trenera jest tylko w nowym wyglądzie: przy włączonym „Jestem trenerem” bez drogi do klasycznego.
            if (this.isTrainerEnabled()) {
                const toClassic = modal.querySelector('#btn-welcome-to-classic');
                if (toClassic) toClassic.remove();
                const hint = modal.querySelector('[data-welcome-classic-hint]');
                if (hint) hint.remove();
            }

            document.body.appendChild(modal);

            const dismiss = () => {
                try { localStorage.setItem(WELCOME_KEY, 'true'); } catch (e) {}
                modal.remove();
                UkiUiSwitch.markWelcomeClosed();
            };

            const btnExplore = modal.querySelector('#btn-welcome-explore');
            const btnClassic = modal.querySelector('#btn-welcome-to-classic');

            if (btnExplore) btnExplore.addEventListener('click', dismiss);
            if (btnClassic) {
                btnClassic.addEventListener('click', () => {
                    dismiss();
                    UkiUiSwitch.switchTo('classic');
                });
            }
        },

        markWelcomeClosed: function () {
            if (!this.welcomePending) return;
            this.welcomePending = false;
            document.dispatchEvent(new Event(WELCOME_CLOSED_EVENT));
        },

        init: function () {
            // W karcie przeglądarki nic nie oceniamy i nic nie zapisujemy: zainstalowana aplikacja zacznie od powitania.
            if (!this.isAppMode()) return;
            if (!this.isClassicPage()) {
                // Ocena musi zapaść tutaj (skrypt w <head>), zanim AppUI zapisze bieżącą wersję.
                if (this.isFreshInstall()) {
                    try { localStorage.setItem(WELCOME_KEY, 'true'); } catch (e) {}
                }
                try {
                    this.welcomePending = localStorage.getItem(WELCOME_KEY) !== 'true';
                } catch (e) {
                    this.welcomePending = false;
                }
            }

            // Auto-wywołanie powitania po załadowaniu drzewa DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => this.showWelcomeModal(), 500);
                });
            } else {
                setTimeout(() => this.showWelcomeModal(), 500);
            }
        }
    };

    window.UkiUiSwitch = UkiUiSwitch;
    UkiUiSwitch.init();
})();
