/**
 * Uki's BodyBuild - UI Version Switcher (Okres Przejściowy)
 * Obsługa przełączania pomiędzy nowym wyglądem (Liquid Glass) a klasycznym (Retro).
 */
(function () {
    const STORAGE_KEY = 'uki-ui-version';
    const WELCOME_KEY = 'uki-ui-welcome-seen';

    const UkiUiSwitch = {
        STORAGE_KEY,
        WELCOME_KEY,

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

        mountSettingsCard: function (container) {
            if (!container) return;
            // Unikaj duplikowania karty jeśli montowana wielokrotnie
            if (document.getElementById('uki-ui-switch-card')) return;

            const current = this.getCurrentVersion();
            const isClassic = current === 'classic';

            const card = document.createElement('div');
            card.id = 'uki-ui-switch-card';
            card.style.cssText = 'margin-top: 20px; margin-bottom: 25px; padding: 18px; border-radius: 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 152, 0, 0.35); text-align: left; box-shadow: 0 4px 15px rgba(0,0,0,0.25);';

            card.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.4em;">🎨</span>
                        <div>
                            <h4 style="margin: 0; color: #fff; font-size: 1.05em; font-weight: 700;">Styl i Wygląd Aplikacji</h4>
                            <span style="color: #FF9800; font-size: 0.75em; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Okres przejściowy (4 tyg.)</span>
                        </div>
                    </div>
                </div>
                <p style="margin: 0 0 14px 0; color: #bbb; font-size: 0.85em; line-height: 1.4;">
                    Wprowadziliśmy nowy interfejs w stylu <strong>Liquid Glass</strong>. Przez najbliższe tygodnie możesz swobodnie testować oba widoki i wybrać ten, w którym czujesz się najlepiej!
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button id="btn-switch-ui-new" style="padding: 12px 10px; border-radius: 12px; font-weight: 700; font-size: 0.85em; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; gap: 4px; border: ${!isClassic ? '2px solid #00D26A' : '1px solid rgba(255,255,255,0.15)'}; background: ${!isClassic ? 'rgba(0, 210, 106, 0.2)' : 'rgba(255,255,255,0.05)'}; color: ${!isClassic ? '#00D26A' : '#aaa'};">
                        <span style="font-size: 1.2em;">💎</span>
                        <span>Nowy (Liquid Glass)</span>
                        ${!isClassic ? '<span style="font-size: 0.7em; opacity: 0.8;">● Aktywny</span>' : ''}
                    </button>
                    <button id="btn-switch-ui-classic" style="padding: 12px 10px; border-radius: 12px; font-weight: 700; font-size: 0.85em; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; gap: 4px; border: ${isClassic ? '2px solid #FF9800' : '1px solid rgba(255,255,255,0.15)'}; background: ${isClassic ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255,255,255,0.05)'}; color: ${isClassic ? '#FF9800' : '#aaa'};">
                        <span style="font-size: 1.2em;">📜</span>
                        <span>Klasyczny (Retro)</span>
                        ${isClassic ? '<span style="font-size: 0.7em; opacity: 0.8;">● Aktywny</span>' : ''}
                    </button>
                </div>
            `;

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
            try {
                if (localStorage.getItem(WELCOME_KEY) === 'true') return;
            } catch (e) {
                return;
            }

            const modal = document.createElement('div');
            modal.id = 'uki-new-ui-welcome-overlay';
            modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0, 0, 0, 0.82); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; animation: ukiFadeIn 0.3s ease;';

            modal.innerHTML = `
                <div style="background: rgba(24, 24, 28, 0.95); border: 1px solid rgba(255, 152, 0, 0.45); border-radius: 20px; padding: 24px; max-width: 420px; width: 100%; color: #fff; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.6); position: relative;">
                    <div style="width: 60px; height: 60px; margin: 0 auto 14px auto; border-radius: 50%; background: rgba(255, 152, 0, 0.15); border: 1px solid rgba(255, 152, 0, 0.4); display: flex; align-items: center; justify-content: center; font-size: 1.8em;">
                        ✨
                    </div>
                    <h3 style="margin: 0 0 8px 0; font-size: 1.35em; color: #fff; font-weight: 700;">Witaj w Nowym Wyglądzie!</h3>
                    <p style="margin: 0 0 18px 0; color: #FF9800; font-size: 0.85em; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                        Uki's BodyBuild • Liquid Glass Edition
                    </p>
                    <p style="margin: 0 0 16px 0; color: #ccc; font-size: 0.92em; line-height: 1.5; text-align: left;">
                        Odświeżyliśmy interfejs aplikacji: zyskał nowoczesny styl <strong>iOS Glassmorphism</strong>, powiększone wektorowe ikony SVG oraz zunifikowaną siatkę kafelków.
                    </p>
                    <div style="background: rgba(255, 255, 255, 0.05); border-left: 3px solid #FF9800; padding: 10px 14px; border-radius: 8px; margin-bottom: 22px; text-align: left; font-size: 0.85em; color: #bbb;">
                        💡 <strong>Możesz wrócić w każdej chwili:</strong> Jeżeli wolisz klasyczny, ciemny widok, przełączysz go jednym kliknięciem w zakładce <strong>Profil → Ustawienia</strong>.
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button id="btn-welcome-explore" style="width: 100%; padding: 14px; border-radius: 12px; border: none; background: #00D26A; color: #000; font-weight: 800; font-size: 1em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 15px rgba(0, 210, 106, 0.35);">
                            Odkryj nowy wygląd 🚀
                        </button>
                        <button id="btn-welcome-to-classic" style="width: 100%; padding: 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15); background: transparent; color: #888; font-size: 0.85em; cursor: pointer;">
                            Wróć do klasycznego wyglądu
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            const dismiss = () => {
                try { localStorage.setItem(WELCOME_KEY, 'true'); } catch (e) {}
                modal.remove();
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

        init: function () {
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
