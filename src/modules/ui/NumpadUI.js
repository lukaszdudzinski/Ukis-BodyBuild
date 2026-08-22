export const NumpadUI = {
    targetInput: null,
    targetSetIndex: null,
    targetExerciseIndex: null,
    isFirstClick: true,

    init: () => {
        // Zbuduj HTML numpada jeśli jeszcze go nie ma
        if (document.getElementById('uki-custom-numpad')) return;

        const numpadHtml = `
            <div id="uki-custom-numpad" style="display: none; position: fixed; bottom: 0; left: 0; width: 100%; background: #121212; border-top: 2px solid #FF9800; z-index: 9999; padding: 15px 10px 30px 10px; box-shadow: 0 -5px 15px rgba(0,0,0,0.5); font-family: -apple-system, sans-serif;">
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; padding: 0 5px;">
                    <span id="numpad-target-label" style="color: #FF9800; font-size: 0.9em; font-weight: bold;">Podaj Wartość</span>
                    <button onclick="window.NumpadUI.close()" style="background: none; border: none; color: #ff4444; font-size: 1.2em; font-weight: bold; cursor: pointer; padding: 5px;">Zamknij ✖</button>
                </div>
                
                <div style="background: #000; border: 1px solid #333; border-radius: 8px; margin-bottom: 15px; padding: 15px; text-align: right; box-shadow: inset 0 2px 10px rgba(0,0,0,0.8);">
                    <span id="numpad-display-screen" style="color: #00BFFF; font-size: 2.5em; font-weight: bold; font-family: monospace;">0</span>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    <button class="np-btn" onclick="window.NumpadUI.type('1')" style="background: #222; border: 1px solid #444; color: #fff; font-size: 1.5em; padding: 15px 0; border-radius: 8px;">1</button>
                    <button class="np-btn" onclick="window.NumpadUI.type('2')" style="background: #222; border: 1px solid #444; color: #fff; font-size: 1.5em; padding: 15px 0; border-radius: 8px;">2</button>
                    <button class="np-btn" onclick="window.NumpadUI.type('3')" style="background: #222; border: 1px solid #444; color: #fff; font-size: 1.5em; padding: 15px 0; border-radius: 8px;">3</button>
                    
                    <button class="np-btn" onclick="window.NumpadUI.type('4')" style="background: #222; border: 1px solid #444; color: #fff; font-size: 1.5em; padding: 15px 0; border-radius: 8px;">4</button>
                    <button class="np-btn" onclick="window.NumpadUI.type('5')" style="background: #222; border: 1px solid #444; color: #fff; font-size: 1.5em; padding: 15px 0; border-radius: 8px;">5</button>
                    <button class="np-btn" onclick="window.NumpadUI.type('6')" style="background: #222; border: 1px solid #444; color: #fff; font-size: 1.5em; padding: 15px 0; border-radius: 8px;">6</button>
                    
                    <button class="np-btn" onclick="window.NumpadUI.type('7')" style="background: #222; border: 1px solid #444; color: #fff; font-size: 1.5em; padding: 15px 0; border-radius: 8px;">7</button>
                    <button class="np-btn" onclick="window.NumpadUI.type('8')" style="background: #222; border: 1px solid #444; color: #fff; font-size: 1.5em; padding: 15px 0; border-radius: 8px;">8</button>
                    <button class="np-btn" onclick="window.NumpadUI.type('9')" style="background: #222; border: 1px solid #444; color: #fff; font-size: 1.5em; padding: 15px 0; border-radius: 8px;">9</button>
                    
                    <button class="np-btn" onclick="window.NumpadUI.type('.')" style="background: #333; border: 1px solid #555; color: #00BFFF; font-size: 1.5em; padding: 15px 0; border-radius: 8px;">.</button>
                    <button class="np-btn" onclick="window.NumpadUI.type('0')" style="background: #222; border: 1px solid #444; color: #fff; font-size: 1.5em; padding: 15px 0; border-radius: 8px;">0</button>
                    <button class="np-btn" onclick="window.NumpadUI.backspace()" style="background: #333; border: 1px solid #555; color: #ff4444; font-size: 1.5em; padding: 15px 0; border-radius: 8px;">⌫</button>
                </div>
                
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                     <button onclick="window.NumpadUI.type('-')" style="flex: 1; background: #333; border: 1px solid #555; color: #FF9800; font-size: 1.2em; padding: 12px 0; border-radius: 8px; font-weight: bold;">Minus (-)</button>
                     <button onclick="window.NumpadUI.confirm()" style="flex: 2; background: #FF9800; border: none; color: #000; font-size: 1.2em; padding: 12px 0; border-radius: 8px; font-weight: bold;">Zatwierdź ✔</button>
                </div>

            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', numpadHtml);
    },

    updateDisplay: () => {
        if (NumpadUI.targetInput) {
            document.getElementById('numpad-display-screen').textContent = NumpadUI.targetInput.value || "0";
        }
    },

    open: (inputEl, exIndex, setIndex, label) => {
        NumpadUI.targetInput = inputEl;
        NumpadUI.targetExerciseIndex = exIndex;
        NumpadUI.targetSetIndex = setIndex;
        NumpadUI.isFirstClick = true; // Pierwsze kliknięcie nadpisuje starą wartość!
        
        document.getElementById('numpad-target-label').textContent = label || "Podaj wartość (Kg):";
        NumpadUI.updateDisplay();
        
        // Zaznacz pole wizualnie
        inputEl.style.border = "2px solid #FF9800";
        inputEl.style.backgroundColor = "rgba(255, 152, 0, 0.2)";
        
        document.getElementById('uki-custom-numpad').style.display = 'block';
        
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    },

    close: () => {
        document.getElementById('uki-custom-numpad').style.display = 'none';
        if (NumpadUI.targetInput) {
            NumpadUI.targetInput.style.border = "1px solid #333";
            NumpadUI.targetInput.style.backgroundColor = "#2a2a2a";
            
            // Trigger change event just in case
            const event = new Event('change');
            NumpadUI.targetInput.dispatchEvent(event);
        }
        NumpadUI.targetInput = null;
    },

    type: (char) => {
        if (!NumpadUI.targetInput) return;
        
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(20);

        if (NumpadUI.isFirstClick) {
            NumpadUI.targetInput.value = char;
            NumpadUI.isFirstClick = false;
        } else {
            if (char === '.' && NumpadUI.targetInput.value.includes('.')) return;
            if (char === '-' && NumpadUI.targetInput.value !== '') {
                if (NumpadUI.targetInput.value.startsWith('-')) {
                    NumpadUI.targetInput.value = NumpadUI.targetInput.value.substring(1);
                } else {
                    NumpadUI.targetInput.value = '-' + NumpadUI.targetInput.value;
                }
                NumpadUI.updateDisplay();
                return;
            }
            
            if (NumpadUI.targetInput.value.length < 6) {
                NumpadUI.targetInput.value += char;
            }
        }
        
        NumpadUI.updateDisplay();

        if (window.TrainingUI && typeof window.TrainingUI.updateSetInline === 'function') {
            window.TrainingUI.updateSetInline(NumpadUI.targetExerciseIndex, NumpadUI.targetSetIndex, 'weight', NumpadUI.targetInput.value);
        }
    },

    backspace: () => {
        if (!NumpadUI.targetInput) return;
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(20);
        
        NumpadUI.isFirstClick = false;
        NumpadUI.targetInput.value = NumpadUI.targetInput.value.slice(0, -1);
        if (NumpadUI.targetInput.value === '') NumpadUI.targetInput.value = '0';
        
        NumpadUI.updateDisplay();

        if (window.TrainingUI && typeof window.TrainingUI.updateSetInline === 'function') {
            window.TrainingUI.updateSetInline(NumpadUI.targetExerciseIndex, NumpadUI.targetSetIndex, 'weight', NumpadUI.targetInput.value);
        }
    },
    
    confirm: () => {
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
        NumpadUI.close();
        
        // Zapisz trening po zatwierdzeniu
        if (window.TrainingUI && typeof window.TrainingUI.saveState === 'function') {
            window.TrainingUI.saveState();
        }
    }
};

window.NumpadUI = NumpadUI;
