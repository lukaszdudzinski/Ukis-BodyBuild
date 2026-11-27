// wyglad: zar
import { ikona } from '../wyglad/ikony.js';

export const NumpadUI = {
    targetInput: null,
    targetSetIndex: null,
    targetExerciseIndex: null,
    isFirstClick: true,
    restoreType: null,
    restoreFocus: null,

    init: () => {
        // Zbuduj HTML numpada jeśli jeszcze go nie ma
        if (document.getElementById('uki-custom-numpad')) return;

        const numpadHtml = `
            <div id="uki-custom-numpad" class="z-numpad" role="dialog" aria-label="Klawiatura liczbowa" style="display: none;">
                <div class="z-numpad-head">
                    <span id="numpad-target-label" class="z-numpad-label">Podaj wartość</span>
                    <button type="button" class="z-ghost z-numpad-close" aria-label="Zamknij" onclick="window.NumpadUI.close()">${ikona('x', 18)}<span>Zamknij</span></button>
                </div>
                <div class="z-numpad-screen"><span id="numpad-display-screen" aria-live="polite">0</span></div>
                <div class="z-numpad-grid">
                    <button type="button" class="z-numpad-key" aria-label="1" onclick="window.NumpadUI.type('1')">1</button>
                    <button type="button" class="z-numpad-key" aria-label="2" onclick="window.NumpadUI.type('2')">2</button>
                    <button type="button" class="z-numpad-key" aria-label="3" onclick="window.NumpadUI.type('3')">3</button>
                    <button type="button" class="z-numpad-key" aria-label="4" onclick="window.NumpadUI.type('4')">4</button>
                    <button type="button" class="z-numpad-key" aria-label="5" onclick="window.NumpadUI.type('5')">5</button>
                    <button type="button" class="z-numpad-key" aria-label="6" onclick="window.NumpadUI.type('6')">6</button>
                    <button type="button" class="z-numpad-key" aria-label="7" onclick="window.NumpadUI.type('7')">7</button>
                    <button type="button" class="z-numpad-key" aria-label="8" onclick="window.NumpadUI.type('8')">8</button>
                    <button type="button" class="z-numpad-key" aria-label="9" onclick="window.NumpadUI.type('9')">9</button>
                    <button type="button" class="z-numpad-key z-numpad-key-alt" aria-label="," onclick="window.NumpadUI.type('.')">,</button>
                    <button type="button" class="z-numpad-key" aria-label="0" onclick="window.NumpadUI.type('0')">0</button>
                    <button type="button" class="z-numpad-key z-numpad-key-alt" aria-label="Usuń znak" onclick="window.NumpadUI.backspace()">${ikona('delete', 24)}</button>
                </div>
                <div class="z-numpad-actions">
                    <button type="button" class="z-ghost z-numpad-minus" aria-label="Minus" onclick="window.NumpadUI.type('-')">${ikona('minus', 18)}<span>Minus (-)</span></button>
                    <button type="button" class="z-btn z-numpad-enter" aria-label="Zatwierdź" onclick="window.NumpadUI.confirm()">${ikona('check', 20)}<span>Zatwierdź</span></button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', numpadHtml);
    },

    // Wyświetlacz po polsku: przecinek dziesiętny (82,5); pole i zapis dostają kropkę.
    updateDisplay: () => {
        if (NumpadUI.targetInput) {
            document.getElementById('numpad-display-screen').textContent = (NumpadUI.targetInput.value || "0").replace('.', ',');
        }
    },

    // Oddaje pole po klawiaturze: bez wyróżnienia, z pierwotnym typem i wartością, którą da się zapisać.
    oddajPole: () => {
        const pole = NumpadUI.targetInput;
        if (!pole) return;
        pole.classList.remove('z-numpad-target');
        if (NumpadUI.restoreType) {
            // Niedokończony wpis („82.” albo samo „-”) nie jest liczbą: zostaje to, co da się zapisać.
            pole.value = pole.value.replace(/^-$/, '').replace(/\.$/, '');
            pole.type = NumpadUI.restoreType;
            NumpadUI.restoreType = null;
        }
        pole.dispatchEvent(new Event('change'));
        NumpadUI.targetInput = null;
    },

    open: (inputEl, exIndex, setIndex, label) => {
        // Klawiatura otwarta na innym polu: najpierw oddaj poprzednie (typ, wyróżnienie, wartość).
        if (NumpadUI.targetInput && NumpadUI.targetInput !== inputEl) NumpadUI.oddajPole();
        // Fokus sprzed otwarcia wraca po zamknięciu (tylko przy pierwszym otwarciu, nie przy zmianie pola).
        const numpad = document.getElementById('uki-custom-numpad');
        if (!numpad || numpad.style.display === 'none') {
            const aktywny = document.activeElement;
            // Bez samego pola docelowego: fokus na polu liczbowym otworzyłby systemową klawiaturę telefonu.
            NumpadUI.restoreFocus = aktywny && aktywny !== document.body && aktywny !== inputEl && !(numpad && numpad.contains(aktywny)) ? aktywny : null;
        }
        NumpadUI.targetInput = inputEl;
        NumpadUI.targetExerciseIndex = exIndex;
        NumpadUI.targetSetIndex = setIndex;
        NumpadUI.isFirstClick = true; // Pierwsze kliknięcie nadpisuje starą wartość!
        
        document.getElementById('numpad-target-label').textContent = label || "Podaj wartość (Kg):";
        NumpadUI.updateDisplay();
        
        // Zaznacz pole wizualnie
        inputEl.classList.add('z-numpad-target');
        // Pole type=number odrzuca wartość „82.” w trakcie wpisywania (przecinek kasował liczbę), więc na czas
        // klawiatury pole jest tekstowe (inputmode zostaje); close() przywraca typ.
        if (inputEl.type === 'number') {
            NumpadUI.restoreType = 'number';
            inputEl.type = 'text';
        }
        
        document.getElementById('uki-custom-numpad').style.display = 'block';
        
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    },

    close: () => {
        document.getElementById('uki-custom-numpad').style.display = 'none';
        NumpadUI.oddajPole();
        const fokus = NumpadUI.restoreFocus;
        NumpadUI.restoreFocus = null;
        if (fokus && fokus.isConnected && typeof fokus.focus === 'function') {
            try { fokus.focus({ preventScroll: true }); } catch (e) { /* element nie przyjmuje fokusu */ }
        }
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
            
            if (NumpadUI.targetInput.value === '0' && char !== '.') {
                NumpadUI.targetInput.value = char;
            } else if (NumpadUI.targetInput.value.length < 6) {
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
        if (window.TrainingUI && typeof window.TrainingUI.saveDraft === 'function') {
            window.TrainingUI.saveDraft();
        }
    }
};

window.NumpadUI = NumpadUI;
