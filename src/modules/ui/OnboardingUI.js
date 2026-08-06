export const OnboardingUI = {
    init: () => {
        // Check if we should show the global onboarding
        if (localStorage.getItem('tutorial_global') !== 'true') {
            OnboardingUI.showGlobalWelcome();
        }
    },

    showGlobalWelcome: () => {
        // Remove existing modal if any
        let existing = document.getElementById('onboarding-modal');
        if (existing) existing.remove();

        const savedNick = localStorage.getItem('userNick') || '';

        const modal = document.createElement('div');
        modal.id = 'onboarding-modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 20px;';
        
        modal.innerHTML = `
            <div style="background: linear-gradient(145deg, #1e1e1e, #121212); padding: 30px; border-radius: 20px; max-width: 450px; width: 100%; border: 1px solid #00BFFF; text-align: center; box-shadow: 0 10px 30px rgba(0,191,255,0.2);">
                <div style="font-size: 3em; margin-bottom: 10px;">👋</div>
                <h2 style="color: #00BFFF; margin-top: 0; margin-bottom: 15px;">Witaj w Uki's BodyBuild!</h2>
                <p style="color: #ccc; line-height: 1.5; margin-bottom: 25px;">
                    Cześć! Jestem Twoim wirtualnym asystentem. Abyśmy mogli lepiej się dogadać, powiedz mi, jak mam się do Ciebie zwracać?
                </p>
                
                <input type="text" id="onboarding-nick-input" placeholder="Wpisz swój nick lub imię..." value="${savedNick}" style="width: 100%; padding: 15px; border-radius: 10px; border: 1px solid #444; background: #222; color: #fff; font-size: 1.1em; text-align: center; box-sizing: border-box; margin-bottom: 20px;">
                
                <div style="margin-bottom: 25px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #aaa; font-size: 0.9em;">
                    <input type="checkbox" id="onboarding-dont-show-again" checked style="width: 18px; height: 18px;">
                    <label for="onboarding-dont-show-again">Nie pokazuj więcej powitania</label>
                </div>
                
                <button id="onboarding-save-btn" class="action-button pulse" style="width: 100%; background: linear-gradient(135deg, #00BFFF, #2196F3); border: none; padding: 15px; border-radius: 30px; font-size: 1.1em; font-weight: bold; cursor: pointer; color: #fff; box-shadow: 0 4px 15px rgba(0, 191, 255, 0.4);">
                    🚀 Zaczynamy!
                </button>
                
                <p style="color: #666; font-size: 0.8em; margin-top: 15px; margin-bottom: 0;">
                    (Zawsze możesz to zresetować w zakładce Ustawienia)
                </p>
            </div>
        `;
        
        document.body.appendChild(modal);

        document.getElementById('onboarding-save-btn').addEventListener('click', () => {
            const nick = document.getElementById('onboarding-nick-input').value.trim();
            const dontShow = document.getElementById('onboarding-dont-show-again').checked;
            
            if (nick) {
                localStorage.setItem('userNick', nick);
                // Dispatch event so other UI can update immediately
                document.dispatchEvent(new CustomEvent('nickUpdated', { detail: { nick } }));
            }
            
            if (dontShow) {
                localStorage.setItem('tutorial_global', 'true');
            } else {
                localStorage.removeItem('tutorial_global');
            }
            
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        });
    }
};
