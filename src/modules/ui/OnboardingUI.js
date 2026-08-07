export const OnboardingUI = {
    init: () => {
        // Główny wyzwalacz powitania
        if (localStorage.getItem('tutorial_global_v21') !== 'true') {
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
            <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); padding: 35px; border-radius: 25px; max-width: 450px; width: 100%; border: 1px solid rgba(255, 255, 255, 0.2); text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
                <div style="font-size: 3.5em; margin-bottom: 5px; text-shadow: 0 0 15px rgba(255,255,255,0.3);">👋</div>
                <h2 style="color: #fff; margin-top: 0; margin-bottom: 15px; font-weight: 600; letter-spacing: 1px;">Witaj w Uki's BodyBuild! 🚀</h2>
                <p style="color: #eee; line-height: 1.6; margin-bottom: 25px; font-size: 1.05em; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
                    Cześć! Jestem Twoim wirtualnym asystentem 🤖.<br>Abyśmy mogli lepiej się dogadać, powiedz mi, jak mam się do Ciebie zwracać?
                </p>
                
                <input type="text" id="onboarding-nick-input" placeholder="Wpisz swój nick lub imię..." value="${savedNick}" style="width: 100%; padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.3); background: rgba(0,0,0,0.3); color: #fff; font-size: 1.1em; text-align: center; box-sizing: border-box; margin-bottom: 20px; outline: none; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);">
                
                <div style="margin-bottom: 25px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #ddd; font-size: 0.9em; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
                    <input type="checkbox" id="onboarding-dont-show-again" checked style="width: 18px; height: 18px; cursor: pointer;">
                    <label for="onboarding-dont-show-again" style="cursor: pointer;">Nie pokazuj więcej powitania</label>
                </div>
                
                <button id="onboarding-save-btn" class="action-button pulse" style="width: 100%; background: linear-gradient(135deg, #00BFFF, #2196F3); border: none; padding: 15px; border-radius: 30px; font-size: 1.1em; font-weight: bold; cursor: pointer; color: #fff; box-shadow: 0 4px 15px rgba(0, 191, 255, 0.4); margin-bottom: 12px; transition: transform 0.2s;">
                    Zaczynamy! ➔
                </button>
                <button id="onboarding-tour-btn" style="width: 100%; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); padding: 12px; border-radius: 30px; font-size: 1em; cursor: pointer; color: #fff; transition: background 0.2s;">
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
                localStorage.setItem('tutorial_global_v21', 'true');
            } else {
                localStorage.removeItem('tutorial_global_v21');
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
        
        const userNick = localStorage.getItem('userNick') || 'Mistrzu';

        const steps = [
            {
                elementId: 'tile-training',
                text: `Cześć ${userNick}! 🥳 Zaczynamy wycieczkę! Kliknij kafelek "Trening", by zobaczyć kalendarz i logi sesji. Tutaj będziesz tworzyć nową historię! 🏋️‍♂️`,
                action: () => { if(window.switchTab) window.switchTab('welcome-screen'); }
            },
            {
                elementId: 'start-new-session-btn',
                text: 'To jest Twój główny przycisk na dany dzień! 📅 Kliknij "Dodaj nową sesję treningową", aby rozpocząć trening od zera lub kontynuować stary.',
                action: () => { if(window.switchTab) window.switchTab('nav-training'); } // This switches to nav-training but wait, in AppUI it is 'training-dashboard'
            },
            {
                elementId: 'training-name-input',
                text: 'Wpisz tytuł swojego treningu (np. "Klatka + Biceps"). ✍️ Łatwiej będzie Ci go potem odnaleźć w Historii! Możesz też dodać notatki poniżej. 📝',
                action: () => { if(window.TrainingUI && window.TrainingUI.startTraining) window.TrainingUI.startTraining(null); }
            },
            {
                elementId: 'add-exercise-to-plan-btn',
                text: 'Kliknij ten przycisk ➕, aby dodać puste bloki ćwiczeń! Możesz z nich robić serie siłowe lub włączać stoper do Cardio! ⏱️',
                action: null
            },
            {
                elementId: 'home-link-header', // We'll highlight the top left logo
                text: 'Zawsze, gdy chcesz wrócić do głównego menu, kliknij to logo na górze (na komputerze) lub użyj mobilnego menu z boku! 🔙',
                action: null
            },
            {
                elementId: 'tile-diet',
                text: 'A tutaj znajduje się potężny moduł "Dieta i Żywienie"! 🍎',
                action: () => { if(window.switchTab) window.switchTab('welcome-screen'); }
            },
            {
                elementId: 'diet-dashboard',
                text: 'W przyszłości (lub jeśli już jest odblokowany), trener Edward 🤖 będzie mógł tu przeliczać Twoje kalorie na podstawie samych zdjęć jedzenia! 📸',
                action: () => { if(window.switchTab) window.switchTab('diet-dashboard'); }
            },
            {
                elementId: 'tile-settings',
                text: 'Na koniec - Ustawienia! ⚙️ Pamiętaj, że zawsze możesz zresetować samouczek i zobaczyć go ponownie, klikając ukryty przycisk w panelu Ustawień! Powodzenia na treningu! 💪',
                action: () => { if(window.switchTab) window.switchTab('welcome-screen'); }
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
            // Zmiana na liquid glass dla tooltipa
            tooltipBox.style.cssText = 'position: absolute; z-index: 10006; background: rgba(40, 40, 40, 0.75); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); color: #fff; padding: 25px; border-radius: 16px; width: 300px; box-shadow: 0 15px 35px rgba(0,0,0,0.6); display: none; transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.2); border-top: 4px solid #00BFFF;';
            tooltipBox.innerHTML = `
                <div id="tour-text" style="margin-bottom: 20px; font-size: 1rem; line-height: 1.5; text-shadow: 0 1px 2px rgba(0,0,0,0.8);"></div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <button id="tour-close" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #ccc; padding: 8px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s;">Zakończ ❌</button>
                    <button id="tour-next" style="background: linear-gradient(135deg, #00BFFF, #2196F3); border: none; color: #fff; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 10px rgba(0,191,255,0.3);">Dalej ➔</button>
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

                // Zabezpieczamy focus na mobile by klawiatura nie skakała
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                    target.blur();
                }

                target.scrollIntoView({ block: 'center' }); // Removed smooth scroll so bounding box is instantly correct
                
                // Highlight target - zamiast z-index, wycinamy "dziurę" w czarnym tle!
                target.classList.add('tour-highlight');
                
                // Fallback dla elementów które nie mogą mieć pointer-events (żeby użytkownik nie klikał przypadkiem)
                target.style.pointerEvents = 'none';
                
                // Pozycja elementu dla wycięcia okienka
                const rect = target.getBoundingClientRect();
                const pad = 8;
                const holeTop = rect.top - pad;
                const holeLeft = rect.left - pad;
                const holeRight = rect.right + pad;
                const holeBottom = rect.bottom + pad;

                // Magia wycinania okienka w czarnym tle
                overlay.style.clipPath = `polygon(
                    0% 0%, 
                    0% 100%, 
                    ${holeLeft}px 100%, 
                    ${holeLeft}px ${holeTop}px, 
                    ${holeRight}px ${holeTop}px, 
                    ${holeRight}px ${holeBottom}px, 
                    ${holeLeft}px ${holeBottom}px, 
                    ${holeLeft}px 100%, 
                    100% 100%, 
                    100% 0%
                )`;

                document.getElementById('tour-text').textContent = step.text;

                // Pozycja Tooltipa
                const rect = target.getBoundingClientRect();
                let top = rect.bottom + 15 + window.scrollY;
                let left = rect.left + (rect.width / 2) - 150; // 300px width

                // Zabezpieczenie przed ucięciem
                if (left < 10) left = 10;
                if (left + 300 > window.innerWidth - 10) left = window.innerWidth - 310;
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
                    nextBtn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
                } else {
                    nextBtn.textContent = 'Dalej ➔';
                    nextBtn.style.background = 'linear-gradient(135deg, #00BFFF, #2196F3)';
                }
            }, 500); // 500ms opóźnienia, żeby upewnić się, że karta (tab) została wyrenderowana!
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
