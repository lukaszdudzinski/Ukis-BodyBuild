export const PremiumUI = {
    checkPremium: () => {
        return PremiumUI.getTrialStatus().hasAccess;
    },

    getTrialStatus: () => {
        let installDateStr = localStorage.getItem('uki_install_date');
        if (!installDateStr) {
            installDateStr = new Date().toISOString();
            localStorage.setItem('uki_install_date', installDateStr);
        }

        const token = localStorage.getItem('uki_ai_premium_token');
        if (token === 'UkiSuppi2026' || token === 'UkiBodyBuildPro') {
            return { hasAccess: true, isProToken: true, daysLeft: 0 };
        }

        const installDate = new Date(installDateStr);
        const now = new Date();
        const diffMs = now.getTime() - installDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffDays > 7.5) { 
            return { hasAccess: false, isProToken: false, daysLeft: 0 };
        }
        
        return { hasAccess: true, isProToken: false, daysLeft: Math.max(0, 7 - Math.floor(diffDays)) };
    },

    showPremiumPaywall: () => {
        // Usuwamy ewentualny stary modal
        const existing = document.getElementById('premium-paywall-modal');
        if (existing) existing.remove();

        const html = `
            <div id="premium-paywall-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 100000; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box; backdrop-filter: blur(4px);">
                <div style="background: #1e1e1e; border: 1px solid #00BFFF; border-radius: 16px; width: 100%; max-width: 420px; text-align: center; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 10px 40px rgba(0,191,255,0.2);">
                    
                    <div style="background: linear-gradient(135deg, rgba(0,191,255,0.2) 0%, rgba(30,30,30,1) 100%); padding: 30px 20px 20px; position: relative;">
                        <button onclick="document.getElementById('premium-paywall-modal').remove()" style="position: absolute; top: 10px; right: 15px; background: transparent; border: none; color: #aaa; font-size: 2em; cursor: pointer;">&times;</button>
                        <div style="font-size: 3em; margin-bottom: 10px;">☕🤖</div>
                        <h3 style="color: #00BFFF; margin: 0 0 10px 0; font-size: 1.4em; text-transform: uppercase; letter-spacing: 1px;">Czas na kawę!</h3>
                        <p style="color: #ccc; font-size: 0.95em; line-height: 1.5; margin: 0;">Twój 7-dniowy okres próbny na funkcje AI dobiegł końca.</p>
                    </div>

                    <div style="padding: 20px;">
                        <p style="color: #fff; font-size: 0.95em; line-height: 1.5; text-align: left; margin-bottom: 20px;">
                            Jeśli chcesz korzystać z narzędzi AI w aplikacji i rejestrować kaloryczność posiłków ze zdjęć oraz analizować dane z trenerem Edwardem, możesz to robić wspierając projekt.<br><br>
                            <b style="color: #FF9800;">Dziękujemy za każde wsparcie!</b>
                        </p>
                        
                        <a href="https://suppi.pl/ukidives" target="_blank" class="action-button pulse" style="display: block; width: 100%; background: #FF9800; border: none; color: #000; padding: 14px; font-weight: bold; font-size: 1.1em; border-radius: 8px; text-decoration: none; margin-bottom: 20px; box-sizing: border-box;">
                            ☕ Postaw Kawę
                        </a>

                        <div style="border-top: 1px solid #333; padding-top: 20px;">
                            <label style="display: block; color: #888; font-size: 0.85em; margin-bottom: 8px; text-align: left;">Masz już hasło ze wsparcia?</label>
                            <div style="display: flex; gap: 8px;">
                                <input type="text" id="premium-token-input" placeholder="Wpisz hasło..." style="flex: 1; padding: 12px; background: #222; border: 1px solid #444; border-radius: 8px; color: #fff; outline: none;">
                                <button onclick="window.PremiumUI.verifyToken()" class="action-button" style="background: #2ECC71; border: none; color: #fff; padding: 0 15px; font-weight: bold; border-radius: 8px; cursor: pointer;">Odblokuj</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    },

    verifyToken: () => {
        const input = document.getElementById('premium-token-input');
        if (!input) return;
        
        const val = input.value.trim();
        if (val === 'UkiSuppi2026' || val === 'UkiBodyBuildPro') {
            localStorage.setItem('uki_ai_premium_token', val);
            alert("Hasło poprawne! Narzędzia AI (Trener Edward oraz Analiza Zdjęć Posiłków) zostały odblokowane na stałe. Dziękujemy za wsparcie!");
            const modal = document.getElementById('premium-paywall-modal');
            if (modal) modal.remove();
            PremiumUI.renderPremiumBanner();
        } else {
            alert("Nieprawidłowe hasło. Spróbuj ponownie lub wesprzyj projekt by uzyskać dostęp.");
        }
    },
    renderPremiumBanner: () => {
        const banner = document.getElementById('premium-status-banner');
        if (!banner) return;
        
        const status = PremiumUI.getTrialStatus();
        
        if (status.isProToken) {
            banner.innerHTML = `
                <div style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%); border: 1px solid rgba(255, 215, 0, 0.5); padding: 10px 15px; border-radius: 12px; display: inline-flex; align-items: center; gap: 10px; box-shadow: 0 0 15px rgba(255, 215, 0, 0.1);">
                    <span style="font-size: 1.5em; text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);">👑</span>
                    <div style="text-align: left;">
                        <div style="color: #FFD700; font-weight: bold; font-size: 1.05em;">Wersja PRO Aktywna</div>
                        <div style="color: #aaa; font-size: 0.85em;">Wszystkie funkcje AI odblokowane. Dziękujemy!</div>
                    </div>
                </div>
            `;
        } else if (status.hasAccess) {
            banner.innerHTML = `
                <div style="background: linear-gradient(135deg, rgba(0, 191, 255, 0.1) 0%, rgba(0, 191, 255, 0.05) 100%); border: 1px dashed rgba(0, 191, 255, 0.5); padding: 10px 15px; border-radius: 12px; display: inline-flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.5em;">⏳</span>
                    <div style="text-align: left;">
                        <div style="color: #00BFFF; font-weight: bold; font-size: 1.05em;">Okres Próbny AI</div>
                        <div style="color: #ccc; font-size: 0.85em;">Pozostało dni: <strong style="color: #fff;">${status.daysLeft}</strong></div>
                    </div>
                    <button onclick="window.PremiumUI.showPremiumPaywall()" style="background: rgba(255, 152, 0, 0.2); border: 1px solid #FF9800; color: #FF9800; border-radius: 6px; padding: 6px 12px; margin-left: 10px; cursor: pointer; font-size: 0.85em; font-weight: bold;">Odblokuj PRO</button>
                </div>
            `;
        } else {
            banner.innerHTML = `
                <div style="background: rgba(231, 76, 60, 0.1); border: 1px dashed rgba(231, 76, 60, 0.5); padding: 10px 15px; border-radius: 12px; display: inline-flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.5em; filter: grayscale(1);">🔒</span>
                    <div style="text-align: left;">
                        <div style="color: #E74C3C; font-weight: bold; font-size: 1.05em;">Aplikacja Light</div>
                        <div style="color: #aaa; font-size: 0.85em;">Funkcje inteligentne AI są zablokowane.</div>
                    </div>
                    <button onclick="window.PremiumUI.showPremiumPaywall()" style="background: #FF9800; border: none; color: #000; border-radius: 6px; padding: 6px 12px; margin-left: 10px; cursor: pointer; font-size: 0.85em; font-weight: bold;">Kup dostęp</button>
                </div>
            `;
        }
    }
};

window.PremiumUI = PremiumUI;
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        PremiumUI.renderPremiumBanner();
        
        // Codzienne przypomnienie o końcu okresu próbnego
        const status = PremiumUI.getTrialStatus();
        if (!status.hasAccess && !status.isProToken) {
            const today = new Date().toISOString().split('T')[0];
            const lastShown = localStorage.getItem('uki_ai_paywall_last_shown');
            if (lastShown !== today) {
                localStorage.setItem('uki_ai_paywall_last_shown', today);
                PremiumUI.showPremiumPaywall();
            }
        }
    }, 500);
});
