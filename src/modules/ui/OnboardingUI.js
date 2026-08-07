export const OnboardingUI = {
    init: () => {
        // Główny wyzwalacz powitania
        if (localStorage.getItem('tutorial_global') !== 'true') {
            OnboardingUI.showGlobalWelcome();
        }

        // Możliwość ręcznego wywołania z panelu Settings
        document.addEventListener('startInteractiveTutorial', () => {
            OnboardingUI.startTour();
        });
    },

    showGlobalWelcome: () => {
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
                
                <button id="onboarding-save-btn" class="action-button pulse" style="width: 100%; background: linear-gradient(135deg, #00BFFF, #2196F3); border: none; padding: 15px; border-radius: 30px; font-size: 1.1em; font-weight: bold; cursor: pointer; color: #fff; box-shadow: 0 4px 15px rgba(0, 191, 255, 0.4); margin-bottom: 10px;">
                    🚀 Zaczynamy!
                </button>
                <button id="onboarding-tour-btn" style="width: 100%; background: transparent; border: 1px solid #00BFFF; padding: 12px; border-radius: 30px; font-size: 1em; cursor: pointer; color: #00BFFF;">
                    🎓 Odpal interaktywny Samouczek
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);

        const closeModal = (isTour) => {
            const nick = document.getElementById('onboarding-nick-input').value.trim();
            const dontShow = document.getElementById('onboarding-dont-show-again').checked;
            
            if (nick) {
                localStorage.setItem('userNick', nick);
                document.dispatchEvent(new CustomEvent('nickUpdated', { detail: { nick } }));
            }
            if (dontShow) {
                localStorage.setItem('tutorial_global', 'true');
            } else {
                localStorage.removeItem('tutorial_global');
            }
            
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
                if(isTour) OnboardingUI.startTour();
            }, 300);
        };

        document.getElementById('onboarding-save-btn').addEventListener('click', () => closeModal(false));
        document.getElementById('onboarding-tour-btn').addEventListener('click', () => closeModal(true));
    },

    startTour: () => {
        // Upewnijmy się że jesteśmy w panelu Kafelków (Welcome Screen) na starcie
        if(window.switchTab) window.switchTab('welcome-screen');

        let currentStep = 0;
        
        const steps = [
            {
                elementId: 'tiles-mode-home-btn',
                text: 'Przycisk nawigacji: Zawsze kiedy "zgubisz się" w aplikacji, kliknij w to logo "Uki", aby powrócić do tego panelu Głównego z Kafelkami.',
                action: null
            },
            {
                elementId: 'add-training-tile',
                text: 'To najważniejszy kafelek w aplikacji! Służy on do rozpoczynania nowej sesji treningowej. Kliknij go z nami, wejdziemy do środka!',
                action: () => { if(window.switchTab) window.switchTab('nav-training'); }
            },
            {
                elementId: 'training-name',
                text: 'Na samej górze zawsze nadajesz tytuł treningowi, np: "Klatka i Biceps" lub "Poranne Bieganie". Dzięki temu łatwiej odszukasz go w Historii.'
            },
            {
                elementId: 'training-type',
                text: 'Możesz ustawić rodzaj treningu: Siłowy (do budowy mięśni) lub Cardio (bieżnia/rower). Typ ten określa jakie statystyki system ułoży z danych w Raportach!'
            },
            {
                elementId: 'add-exercise-btn',
                text: 'To główny przycisk dodawania kolejnych zadań (Ćwiczeń) do sesji. Po kliknięciu otworzy się biblioteka.'
            },
            {
                elementId: 'training-calories',
                text: 'Ostatni etap przed zakończeniem: Tutaj (oraz obok w polu tętna) po zakończonym wysiłku wpisujesz statystyki prosto ze swojego Apple Watcha lub smartwatcha!'
            }
        ];

        // Rysowanie UI
        let overlay = document.getElementById('tour-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'tour-overlay';
            overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 10005; display: none; transition: all 0.3s ease;';
            document.body.appendChild(overlay);
        }

        let tooltipBox = document.getElementById('tour-tooltip');
        if (!tooltipBox) {
            tooltipBox = document.createElement('div');
            tooltipBox.id = 'tour-tooltip';
            tooltipBox.style.cssText = 'position: absolute; z-index: 10006; background: #fff; color: #000; padding: 20px; border-radius: 12px; width: 280px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: none; transition: all 0.3s ease; border-top: 5px solid #00BFFF;';
            tooltipBox.innerHTML = `
                <div id="tour-text" style="margin-bottom: 15px; font-size: 0.95rem; line-height: 1.4;"></div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <button id="tour-close" style="background: transparent; border: 1px solid #ccc; color: #666; padding: 8px 12px; border-radius: 6px; cursor: pointer;">Zakończ</button>
                    <button id="tour-next" style="background: #00BFFF; border: none; color: #fff; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">Dalej ➔</button>
                </div>
            `;
            document.body.appendChild(tooltipBox);
        }

        const renderStep = () => {
            if (currentStep >= steps.length) {
                return closeTour();
            }

            const step = steps[currentStep];
            
            // Wykonaj przypisaną akcję przed narysowaniem
            if (step.action) step.action();

            // Pozwól na chwilę renderowania DOM po switchTab
            setTimeout(() => {
                const target = document.getElementById(step.elementId);
                
                // Usuń klasy z poprzedniego elementu
                document.querySelectorAll('.tour-highlight').forEach(el => {
                    el.classList.remove('tour-highlight');
                    el.style.zIndex = '';
                    el.style.position = '';
                    el.style.pointerEvents = '';
                });

                if (!target) {
                    // Element not found - skip to next
                    currentStep++;
                    return renderStep();
                }

                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Highlight target
                target.classList.add('tour-highlight');
                target.style.zIndex = '10006';
                
                // Fallback dla elementów które nie mogą mieć pointer-events (żeby użytkownik nie klikał przypadkiem)
                target.style.pointerEvents = 'none';
                
                if (window.getComputedStyle(target).position === 'static') {
                    target.style.position = 'relative';
                }

                document.getElementById('tour-text').textContent = step.text;

                // Pozycja Tooltipa
                const rect = target.getBoundingClientRect();
                let top = rect.bottom + 15 + window.scrollY;
                let left = rect.left + (rect.width / 2) - 140;

                // Zabezpieczenie przed ucięciem
                if (left < 10) left = 10;
                if (left + 280 > window.innerWidth - 10) left = window.innerWidth - 290;
                if (top + 150 > window.innerHeight + window.scrollY) {
                    top = rect.top - 150 + window.scrollY; // Rysuj nad
                }

                tooltipBox.style.top = top + 'px';
                tooltipBox.style.left = left + 'px';
                
                overlay.style.display = 'block';
                tooltipBox.style.display = 'block';
                
                // Aktualizuj przycisk
                const nextBtn = document.getElementById('tour-next');
                if (currentStep === steps.length - 1) {
                    nextBtn.textContent = 'Gotowe! 🎉';
                    nextBtn.style.background = '#4CAF50';
                } else {
                    nextBtn.textContent = 'Dalej ➔';
                    nextBtn.style.background = '#00BFFF';
                }
            }, 300);
        };

        const closeTour = () => {
            overlay.style.display = 'none';
            tooltipBox.style.display = 'none';
            document.querySelectorAll('.tour-highlight').forEach(el => {
                el.classList.remove('tour-highlight');
                el.style.zIndex = '';
                el.style.position = '';
                el.style.pointerEvents = '';
            });
            if(window.switchTab) window.switchTab('welcome-screen'); // Wróć do menu głównego na koniec
        };

        document.getElementById('tour-next').onclick = () => {
            currentStep++;
            renderStep();
        };

        document.getElementById('tour-close').onclick = closeTour;

        // Rozpocznij!
        renderStep();
    }
};
