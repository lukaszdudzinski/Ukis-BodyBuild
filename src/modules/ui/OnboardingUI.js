// wyglad: zar
import { avatarDataUri, resolveGender, loadAvatarChoice } from './defaultAvatar.js';

export const OnboardingUI = {
    // Zdarzenie na document po zamknięciu powitania; „Co nowego?” czeka na nie (AppUI.js).
    CLOSED_EVENT: 'onboardingClosed',

    init: () => {
        // Powitanie należy do zainstalowanej aplikacji, nie do strony instalacji w przeglądarce.
        if (window.UkiAppStart && !window.UkiAppStart.isAppMode()) return;
        // Główny wyzwalacz powitania
        if (localStorage.getItem('tutorial_global_v22') !== 'true') {
            // Okna startowe pokazują się kolejno (app-start.js, whenWelcomeClosed).
            const start = window.UkiAppStart;
            if (start && typeof start.whenWelcomeClosed === 'function') {
                start.whenWelcomeClosed(() => OnboardingUI.showGlobalWelcome());
            } else {
                OnboardingUI.showGlobalWelcome();
            }
        }
    },

    showGlobalWelcome: () => {
        setTimeout(() => {
            let existing = document.getElementById('onboarding-modal');
        if (existing) existing.remove();

        const savedNick = localStorage.getItem('userNick') || '';
        const modal = document.createElement('div');
        modal.id = 'onboarding-modal';
        modal.className = 'z-welcome';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'onboarding-title');

        modal.innerHTML = `
            <div class="z-welcome-inner">
                <img class="z-welcome-logo" src="img/logo.png" alt="" width="112" height="112">
                <h2 id="onboarding-title" class="z-welcome-title">Witaj w Uki's BodyBuild</h2>
                <p class="z-sub z-welcome-lead">Cześć! Jestem Edward, Twój wirtualny asystent. Pomogę Ci prowadzić treningi, dietę i pomiary.</p>
                <div class="z-card z-welcome-card">
                    <label class="z-welcome-q" for="onboarding-nick-input">Jak mam się do Ciebie zwracać?</label>
                    <input type="text" id="onboarding-nick-input" class="z-in z-welcome-in" placeholder="Wpisz swoje imię lub nick" autocomplete="given-name" enterkeyhint="done" autocapitalize="words">
                    <div class="z-welcome-av">
                        <img id="onboarding-avatar-preview" class="z-welcome-av-img" alt="" width="48" height="48">
                        <span class="z-sub">Awatar dobierze się do imienia. Zmienisz go w Profilu.</span>
                    </div>
                    <button type="button" id="onboarding-save-btn" class="z-btn z-welcome-btn">Zaczynamy</button>
                </div>
                <p class="z-mut z-welcome-note">Twoje dane zostają tylko w tym telefonie.</p>
            </div>
        `;

        document.body.appendChild(modal);

        const nickInput = document.getElementById('onboarding-nick-input');
        nickInput.value = savedNick;

        // Podgląd awatara: ta sama logika co w Menu (sylwetka dobrana do imienia, ręczny wybór z Profilu ma pierwszeństwo).
        const avatarPreview = document.getElementById('onboarding-avatar-preview');
        const updateAvatar = () => {
            avatarPreview.src = avatarDataUri(resolveGender(nickInput.value, loadAvatarChoice()));
        };
        updateAvatar();
        nickInput.addEventListener('input', updateAvatar);

        let closed = false;
        const closeModal = () => {
            if (closed) return;
            closed = true;
            const nick = nickInput.value.trim();
            if (nick) {
                localStorage.setItem('userNick', nick);
                document.dispatchEvent(new CustomEvent('nickUpdated', { detail: { nick } }));
            }
            
            // Mark tutorials as seen globally so old users aren't bothered if we switch flags
            localStorage.setItem('tutorial_global_v21', 'true');
            localStorage.setItem('tutorial_global_v22', 'true');
            
            modal.classList.add('z-welcome-out');
            setTimeout(() => {
                modal.remove();
                document.dispatchEvent(new Event(OnboardingUI.CLOSED_EVENT));
            }, 300);
        };

        document.getElementById('onboarding-save-btn').addEventListener('click', closeModal);
        // Enter (na iPhonie „Gotowe” z enterkeyhint="done") zapisuje jak przycisk.
        nickInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.isComposing) {
                e.preventDefault();
                closeModal();
            }
        });
        nickInput.focus();
        }, 600);
    },

    checkContextualTutorial: (tabId) => {
        // Opóźnienie żeby UI zdążyło się wyrenderować
        setTimeout(() => {
            if (tabId === 'diet-dashboard' && !localStorage.getItem('tutorial_context_diet')) {
                localStorage.setItem('tutorial_context_diet', 'true');
                if (window.ChatUI) {
                    window.ChatUI.showContextualBubble("Hej! Tutaj Dieta! Pamiętaj, że możesz dodać posiłek analizując zdjęcie aparatem!", true);
                }
            } else if (tabId === 'nav-training' || tabId === 'training-dashboard') {
                if (!localStorage.getItem('tutorial_context_training')) {
                    localStorage.setItem('tutorial_context_training', 'true');
                    if (window.ChatUI) {
                        window.ChatUI.showContextualBubble("Witaj w Treningu! Tutaj zaplanujesz swoje sesje. Gotowy na wycisk?", true);
                    }
                }
            }
        }, 800);
    }
};

window.OnboardingUI = OnboardingUI;
