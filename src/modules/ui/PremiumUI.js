// wyglad: zar
import { ikona } from '../wyglad/ikony.js';
import { hasTrainerLicenseSync } from '../trainer/trainerAccess.js';

export const PremiumUI = {
    // „1 dzień”, w pozostałych przypadkach „N dni” (2–4, 5+, 12–14, 22–24: ta sama forma mianownika liczby mnogiej).
    dniTekst: (n) => {
        const k = Math.abs(Math.trunc(Number(n) || 0));
        return k === 1 ? '1 dzień' : `${k} dni`;
    },

    checkPremium: () => {
        return PremiumUI.getTrialStatus().hasAccess;
    },

    getTrialStatus: () => {
        if (hasTrainerLicenseSync()) {
            return { hasAccess: true, isProToken: true, daysLeft: 0, isTrainer: true };
        }

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
        // Przy podmianie otwartego okna opiekunem fokusu zostaje pierwotny opener.
        if (!existing) PremiumUI._opener = document.activeElement;
        if (existing) existing.remove();

        const dni = PremiumUI.getTrialStatus().daysLeft;
        const trwa = dni > 0;
        const opis = trwa
            ? `Twój 7-dniowy okres próbny na funkcje AI trwa, zostało ${PremiumUI.dniTekst(dni)}. Wspierając projekt, odblokowujesz narzędzia AI na stałe. Dziękujemy za każde wsparcie!`
            : 'Twój 7-dniowy okres próbny na funkcje AI dobiegł końca. Wspierając projekt, odblokowujesz narzędzia AI na stałe. Dziękujemy za każde wsparcie!';
        const html = `
            <div id="premium-paywall-modal" class="z-dialog-scrim pro-scrim" role="dialog" aria-modal="true" aria-labelledby="pro-tytul">
                <div class="pro-okno">
                    <div class="pro-gora">
                        <button type="button" class="z-ic z-card" aria-label="Zamknij" onclick="window.PremiumUI.zamknijPaywall()">${ikona('x', 20)}</button>
                        ${trwa ? `<span class="z-pill">Okres próbny: ${PremiumUI.dniTekst(dni)}</span>` : ''}
                    </div>

                    <div class="pro-hero">
                        <div class="pro-kolo">${ikona('coffee', 34)}</div>
                        <h2 id="pro-tytul" class="z-hd pro-tytul">Wersja Heavy</h2>
                        <p class="z-sub pro-opis">${opis}</p>
                    </div>

                    <div class="z-card z-list pro-korzysci">
                        <div class="z-li">${ikona('check', 20)}<span>Trener Edward: rozmowa i porady</span></div>
                        <div class="z-li">${ikona('check', 20)}<span>Kalorie posiłków ze zdjęć</span></div>
                        <div class="z-li">${ikona('check', 20)}<span>Analizy AI treningów i diety</span></div>
                    </div>

                    <a class="z-btn pro-wesprzyj" href="https://suppi.pl/ukidives" target="_blank" rel="noopener noreferrer">${ikona('coffee', 20)}Wesprzyj projekt</a>

                    <div class="z-card pro-haslo">
                        <label class="z-lab" for="premium-token-input">Masz już hasło ze wsparcia?</label>
                        <div class="pro-haslo-wiersz">
                            <input type="text" id="premium-token-input" class="z-in" placeholder="Wpisz hasło..." autocomplete="off" autocapitalize="off" spellcheck="false" aria-describedby="premium-token-error">
                            <button type="button" class="z-ghost" onclick="window.PremiumUI.verifyToken()">Odblokuj</button>
                        </div>
                        <p id="premium-token-error" class="pro-blad" role="alert" hidden></p>
                    </div>
                </div>
            </div>
        `;
        if (PremiumUI._onKey) document.removeEventListener('keydown', PremiumUI._onKey);
        document.body.insertAdjacentHTML('beforeend', html);
        PremiumUI._onKey = (e) => { if (e.key === 'Escape') PremiumUI.zamknijPaywall(); };
        document.addEventListener('keydown', PremiumUI._onKey);
        const zamknij = document.querySelector('#premium-paywall-modal button[aria-label="Zamknij"]');
        if (zamknij) zamknij.focus();
    },

    // Zamyka okno PRO, zdejmuje słuchacza Escape i oddaje fokus temu, kto je otworzył.
    zamknijPaywall: () => {
        const modal = document.getElementById('premium-paywall-modal');
        if (modal) modal.remove();
        if (PremiumUI._onKey) { document.removeEventListener('keydown', PremiumUI._onKey); PremiumUI._onKey = null; }
        const opener = PremiumUI._opener;
        PremiumUI._opener = null;
        if (opener && opener.isConnected && typeof opener.focus === 'function') opener.focus();
    },

    // Komunikat z-toast zamiast alert() (jak TrainingUI.komunikat). Tekst przez textContent.
    komunikat: (tekst) => {
        let t = document.getElementById('premium-komunikat');
        if (!t) {
            t = document.createElement('div');
            t.id = 'premium-komunikat';
            t.className = 'z-toast';
            t.setAttribute('role', 'status');
            document.body.append(t);
        }
        t.textContent = tekst;
        t.hidden = false;
        clearTimeout(PremiumUI._zegarKomunikatu);
        PremiumUI._zegarKomunikatu = setTimeout(() => { t.hidden = true; }, 5000);
    },

    verifyToken: () => {
        const input = document.getElementById('premium-token-input');
        if (!input) return;
        
        const val = input.value.trim();
        if (val === 'UkiSuppi2026' || val === 'UkiBodyBuildPro') {
            localStorage.setItem('uki_ai_premium_token', val);
            PremiumUI.zamknijPaywall();
            PremiumUI.komunikat('Hasło poprawne! Narzędzia AI zostały odblokowane na stałe. Dziękujemy za wsparcie!');
            const label = document.getElementById('premium-status');
            if (label) label.textContent = 'Wersja Heavy';
            PremiumUI.renderPremiumBanner();
        } else {
            const blad = document.getElementById('premium-token-error');
            if (blad) {
                blad.textContent = 'Nieprawidłowe hasło. Spróbuj ponownie lub wesprzyj projekt, by uzyskać dostęp.';
                blad.hidden = false;
            }
            input.setAttribute('aria-invalid', 'true');
            input.focus();
        }
    },
    renderPremiumBanner: () => {
        const banner = document.getElementById('premium-status-banner');
        if (!banner) return;
        
        const status = PremiumUI.getTrialStatus();
        
        if (status.isProToken) {
            banner.innerHTML = `
                <div class="z-card pro-stan pro-stan-pro">
                    ${ikona('check', 24)}
                    <div class="pro-stan-txt">
                        <div class="pro-stan-tyt">Wersja PRO aktywna</div>
                        <div class="z-sub">Wszystkie funkcje AI odblokowane. Dziękujemy!</div>
                    </div>
                </div>
            `;
        } else if (status.hasAccess) {
            banner.innerHTML = `
                <div class="z-card pro-stan">
                    ${ikona('clock', 24)}
                    <div class="pro-stan-txt">
                        <div class="pro-stan-tyt">Okres próbny AI</div>
                        <div class="z-sub">Pozostało dni: <strong>${Number(status.daysLeft)}</strong></div>
                    </div>
                    <button type="button" class="z-ghost" onclick="window.PremiumUI.showPremiumPaywall()">Odblokuj PRO</button>
                </div>
            `;
        } else {
            banner.innerHTML = `
                <div class="z-card z-alert pro-stan">
                    ${ikona('lock', 24)}
                    <div class="pro-stan-txt">
                        <div class="pro-stan-tyt">Aplikacja Light</div>
                        <div class="z-sub">Funkcje inteligentne AI są zablokowane.</div>
                    </div>
                    <button type="button" class="z-ghost" onclick="window.PremiumUI.showPremiumPaywall()">Odblokuj PRO</button>
                </div>
            `;
        }
    }
};

window.PremiumUI = PremiumUI;
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        PremiumUI.renderPremiumBanner();
        
        // Codzienne przypomnienie o końcu okresu próbnego (tylko w zainstalowanej aplikacji)
        const status = PremiumUI.getTrialStatus();
        const appMode = !window.UkiUiSwitch || window.UkiUiSwitch.isAppMode();
        if (appMode && !status.hasAccess && !status.isProToken) {
            const today = new Date().toISOString().split('T')[0];
            const lastShown = localStorage.getItem('uki_ai_paywall_last_shown');
            if (lastShown !== today) {
                localStorage.setItem('uki_ai_paywall_last_shown', today);
                PremiumUI.showPremiumPaywall();
            }
        }
    }, 500);
});
