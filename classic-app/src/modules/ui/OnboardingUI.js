export const OnboardingUI = {
    init: () => {
        // Główny wyzwalacz powitania
        if (localStorage.getItem('tutorial_global_v22') !== 'true') {
            OnboardingUI.showGlobalWelcome();
        }
    },

    showGlobalWelcome: () => {
        let existing = document.getElementById('onboarding-modal');
        if (existing) existing.remove();

        const savedNick = localStorage.getItem('userNick') || '';
        const modal = document.createElement('div');
        modal.id = 'onboarding-modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 20px;';
        
        modal.innerHTML = `
            <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); padding: 35px; border-radius: 25px; max-width: 450px; width: 100%; border: 1px solid rgba(255, 255, 255, 0.2); text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
                <div style="font-size: 3.5em; margin-bottom: 5px; text-shadow: 0 0 15px rgba(255,255,255,0.3);">👋</div>
                <h2 style="color: #fff; margin-top: 0; margin-bottom: 15px; font-weight: 600; letter-spacing: 1px;">Witaj w Uki's BodyBuild! 🚀</h2>
                <p style="color: #eee; line-height: 1.6; margin-bottom: 25px; font-size: 1.05em; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
                    Cześć! Jestem Edward, Twój wirtualny asystent AI 🤖.<br>Jak mam się do Ciebie zwracać?
                </p>
                
                <input type="text" id="onboarding-nick-input" placeholder="Wpisz swój nick lub imię..." value="${savedNick}" style="width: 100%; padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.3); background: rgba(0,0,0,0.3); color: #fff; font-size: 1.1em; text-align: center; box-sizing: border-box; margin-bottom: 25px; outline: none; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);">
                
                <button id="onboarding-save-btn" class="action-button pulse" style="width: 100%; background: linear-gradient(135deg, #00BFFF, #2196F3); border: none; padding: 15px; border-radius: 30px; font-size: 1.1em; font-weight: bold; cursor: pointer; color: #fff; box-shadow: 0 4px 15px rgba(0, 191, 255, 0.4); transition: transform 0.2s;">
                    Zaczynamy! ➔
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);

        const closeModal = () => {
            const nick = document.getElementById('onboarding-nick-input').value.trim();
            if (nick) {
                localStorage.setItem('userNick', nick);
                document.dispatchEvent(new CustomEvent('nickUpdated', { detail: { nick } }));
            }
            
            // Mark tutorials as seen globally so old users aren't bothered if we switch flags
            localStorage.setItem('tutorial_global_v21', 'true');
            localStorage.setItem('tutorial_global_v22', 'true');
            
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 300);
        };

        document.getElementById('onboarding-save-btn').addEventListener('click', closeModal);
    },

    checkContextualTutorial: (tabId) => {
        // Opóźnienie żeby UI zdążyło się wyrenderować
        setTimeout(() => {
            if (tabId === 'diet-dashboard' && !localStorage.getItem('tutorial_context_diet')) {
                localStorage.setItem('tutorial_context_diet', 'true');
                if (window.ChatUI) {
                    window.ChatUI.showContextualBubble("Hej! 👋 Tutaj Dieta! Pamiętaj, że możesz dodać posiłek analizując zdjęcie aparatem!", true);
                }
            } else if (tabId === 'nav-training' || tabId === 'training-dashboard') {
                if (!localStorage.getItem('tutorial_context_training')) {
                    localStorage.setItem('tutorial_context_training', 'true');
                    if (window.ChatUI) {
                        window.ChatUI.showContextualBubble("Witaj w Treningu! 💪 Tutaj zaplanujesz swoje sesje. Gotowy na wycisk?", true);
                    }
                }
            }
        }, 800);
    }
};

window.OnboardingUI = OnboardingUI;
