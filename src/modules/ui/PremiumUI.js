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
            <div id="premium-paywall-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(17,17,24,0.85); backdrop-filter: blur(8px); z-index: 100000; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box; opacity: 0; transition: opacity 0.3s; animation: fadeIn 0.3s forwards;">
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(0, 191, 255, 0.3); border-radius: 24px; width: 100%; max-width: 420px; text-align: center; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                    
                    <div style="background: linear-gradient(135deg, rgba(0,191,255,0.1) 0%, rgba(17,17,24,0) 100%); padding: 40px 20px 20px; position: relative; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <button onclick="document.getElementById('premium-paywall-modal').remove()" style="position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.1); border: none; color: #fff; width: 32px; height: 32px; border-radius: 16px; font-size: 1.2em; display: flex; align-items: center; justify-content: center; cursor: pointer;">&times;</button>
                        <div style="display: flex; justify-content: center; margin-bottom: 20px; color: #00BFFF;">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
                        </div>
                        <h3 style="color: #00BFFF; margin: 0 0 12px 0; font-size: 1.5em; font-weight: 700;">Czas na wsparcie</h3>
                        <p style="color: #8E8E93; font-size: 0.95em; line-height: 1.5; margin: 0;">Twój 7-dniowy okres próbny na funkcje AI dobiegł końca.</p>
                    </div>

                    <div style="padding: 25px 20px;">
                        <p style="color: #fff; font-size: 0.95em; line-height: 1.5; text-align: left; margin-bottom: 25px;">
                            Jeśli chcesz korzystać z narzędzi AI w aplikacji i rejestrować kaloryczność posiłków ze zdjęć oraz analizować dane z Trenerem Edwardem, możesz to robić wspierając projekt.<br><br>
                            <b style="color: #FF9800; font-weight: 600;">Dziękujemy za każde wsparcie!</b>
                        </p>
                        
                        <a href="https://suppi.pl/ukidives" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: rgba(255, 152, 0, 0.15); border: 1px solid rgba(255, 152, 0, 0.3); color: #FF9800; padding: 14px; font-weight: 600; font-size: 1.05em; border-radius: 12px; text-decoration: none; margin-bottom: 25px; box-sizing: border-box;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
                            Wesprzyj Projekt
                        </a>

                        <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 25px;">
                            <label style="display: block; color: #8E8E93; font-size: 0.85em; margin-bottom: 10px; text-align: left;">Masz już hasło ze wsparcia?</label>
                            <div style="display: flex; gap: 8px;">
                                <input type="text" id="premium-token-input" placeholder="Wpisz hasło..." style="flex: 1; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; outline: none;">
                                <button onclick="window.PremiumUI.verifyToken()" style="background: rgba(46, 204, 113, 0.15); border: 1px solid rgba(46, 204, 113, 0.3); color: #2ECC71; padding: 0 18px; font-weight: 600; border-radius: 12px; cursor: pointer;">Odblokuj</button>
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
                <div style="background: rgba(255, 215, 0, 0.05); border: 1px solid rgba(255, 215, 0, 0.3); padding: 12px 16px; border-radius: 16px; display: inline-flex; align-items: center; gap: 12px; backdrop-filter: blur(10px);">
                    <div style="color: #FFD700; display: flex; align-items: center; justify-content: center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h20"/><path d="m2 8 3-4"/><path d="m22 8-3-4"/><path d="m2 20 3-12h14l3 12Z"/><path d="M12 16v-4"/><path d="m8 16 4-4"/><path d="m16 16-4-4"/></svg>
                    </div>
                    <div style="text-align: left;">
                        <div style="color: #FFD700; font-weight: 600; font-size: 1.05em;">Wersja PRO Aktywna</div>
                        <div style="color: #8E8E93; font-size: 0.85em;">Wszystkie funkcje AI odblokowane. Dziękujemy!</div>
                    </div>
                </div>
            `;
        } else if (status.hasAccess) {
            banner.innerHTML = `
                <div style="background: rgba(0, 191, 255, 0.05); border: 1px solid rgba(0, 191, 255, 0.3); padding: 12px 16px; border-radius: 16px; display: inline-flex; align-items: center; gap: 12px; backdrop-filter: blur(10px);">
                    <div style="color: #00BFFF; display: flex; align-items: center; justify-content: center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div style="text-align: left;">
                        <div style="color: #00BFFF; font-weight: 600; font-size: 1.05em;">Okres Próbny AI</div>
                        <div style="color: #8E8E93; font-size: 0.85em;">Pozostało dni: <strong style="color: #fff;">${status.daysLeft}</strong></div>
                    </div>
                    <button onclick="window.PremiumUI.showPremiumPaywall()" style="background: rgba(255, 152, 0, 0.15); border: 1px solid rgba(255, 152, 0, 0.3); color: #FF9800; border-radius: 8px; padding: 6px 14px; margin-left: 12px; cursor: pointer; font-size: 0.85em; font-weight: 600;">Odblokuj PRO</button>
                </div>
            `;
        } else {
            banner.innerHTML = `
                <div style="background: rgba(255, 69, 58, 0.05); border: 1px solid rgba(255, 69, 58, 0.3); padding: 12px 16px; border-radius: 16px; display: inline-flex; align-items: center; gap: 12px; backdrop-filter: blur(10px);">
                    <div style="color: #FF453A; display: flex; align-items: center; justify-content: center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <div style="text-align: left;">
                        <div style="color: #FF453A; font-weight: 600; font-size: 1.05em;">Aplikacja Light</div>
                        <div style="color: #8E8E93; font-size: 0.85em;">Funkcje inteligentne AI są zablokowane.</div>
                    </div>
                    <button onclick="window.PremiumUI.showPremiumPaywall()" style="background: rgba(255, 152, 0, 0.15); border: 1px solid rgba(255, 152, 0, 0.3); color: #FF9800; border-radius: 8px; padding: 6px 14px; margin-left: 12px; cursor: pointer; font-size: 0.85em; font-weight: 600;">Odblokuj PRO</button>
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
