import { ExerciseCatalog } from '../../data/ExerciseCatalog.js';

export const TemplateBuilderUI = {
    cart: [],

    render: () => {
        const container = document.getElementById('template-builder-dashboard');
        if (!container) return;

        container.innerHTML = `
            <div class="view-header" style="position: sticky; top: 0; z-index: 100; background: #121212; padding-bottom: 10px; border-bottom: 1px solid #333;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="margin: 0; color: #00BFFF;">Kreator Planu (Koszyk)</h2>
                    <button onclick="window.switchTab('training-dashboard')" class="icon-btn" style="color: #ff4444; font-size: 1.5em; border: none; background: none; padding: 0;">&times;</button>
                </div>
                <div style="margin-top: 10px; display: flex; gap: 10px;">
                    <input type="text" id="builder-template-name" placeholder="Nazwa Planu (np. Push Dół)" style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #444; background: #222; color: #fff;">
                    <button onclick="TemplateBuilderUI.saveTemplate()" class="action-button" style="background: #2ECC71; color: #000; border: none; font-weight: bold; border-radius: 8px; padding: 0 15px;">Zapisz</button>
                </div>
            </div>

            <!-- KOSZYK -->
            <div id="builder-cart-area" style="min-height: 200px; padding: 15px 0; border-bottom: 2px dashed #00BFFF; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #aaa;">Twoje ćwiczenia (Koszyk)</h4>
                <div id="builder-cart-list" style="display: flex; flex-direction: column; gap: 10px;">
                    <!-- Pojawią się tu wybrane ćwiczenia -->
                </div>
                <div style="margin-top: 15px; display: flex; gap: 8px; align-items: center; background: rgba(255, 152, 0, 0.1); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,152,0,0.3); flex-wrap: wrap;">
                    <span style="color: #FF9800; font-size: 0.95em; width: 100%; font-weight: bold;">Zastosuj do wszystkich (Możesz używać przecinków dla piramid!)</span>
                    <span style="color: #bbb; font-size: 0.8em; width: 100%; margin-bottom: 5px;">💡 Przykład: wpisz <b style="color:#fff;">3</b> serie, Powt: <b style="color:#fff;">12,10,8</b>, Kg: <b style="color:#fff;">100,110,120</b></span>
                    <input type="number" id="builder-mass-sets" placeholder="Serie" style="width: 55px; padding: 8px; background: #222; border: 1px solid #555; color: #fff; border-radius: 6px; text-align: center;">
                    <span style="color: #888;">x</span>
                    <input type="text" id="builder-mass-reps" placeholder="Powt." style="width: 70px; padding: 8px; background: #222; border: 1px solid #555; color: #fff; border-radius: 6px; text-align: center;">
                    <span style="color: #888;">@</span>
                    <input type="text" id="builder-mass-weight" placeholder="Kg" style="width: 85px; padding: 8px; background: #222; border: 1px solid #555; color: #fff; border-radius: 6px; text-align: center;">
                    <button onclick="TemplateBuilderUI.applyMassEdit()" style="background: #FF9800; color: #000; border: none; font-weight: bold; padding: 8px 12px; border-radius: 6px; cursor: pointer; flex-grow: 1;">Ustaw</button>
                </div>
            </div>

            <!-- BAZA ĆWICZEŃ -->
            <div id="builder-catalog-area">
                <h4 style="margin: 0 0 10px 0; color: #aaa;">Baza Ćwiczeń (Kliknij aby dodać)</h4>
                <input type="text" id="builder-search" placeholder="Szukaj ćwiczenia..." style="width: 100%; box-sizing: border-box; padding: 10px; border-radius: 8px; border: 1px solid #444; background: #222; color: #fff; margin-bottom: 15px;" onkeyup="TemplateBuilderUI.filterCatalog()">
                
                <div id="builder-catalog-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 40vh; overflow-y: auto; padding-right: 5px;">
                    <!-- Lista katalogu -->
                </div>
            </div>
        `;

        TemplateBuilderUI.renderCatalog();
        TemplateBuilderUI.renderCart();
    },

    renderCatalog: () => {
        const list = document.getElementById('builder-catalog-list');
        if (!list) return;
        
        // Use all available exercises
        let html = '';
        ExerciseCatalog.forEach(exName => {
            html += `<div class="builder-catalog-item" data-name="${exName}" onclick="TemplateBuilderUI.addToCart('${exName}')" style="background: #1e1e1e; padding: 12px 15px; border-radius: 8px; border: 1px solid #333; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #fff; font-size: 0.95em;">${exName}</span>
                <span style="color: #00BFFF; font-weight: bold; font-size: 1.2em;">+</span>
            </div>`;
        });
        list.innerHTML = html;
    },

    filterCatalog: () => {
        const query = document.getElementById('builder-search').value.toLowerCase();
        const items = document.querySelectorAll('.builder-catalog-item');
        items.forEach(item => {
            const name = item.getAttribute('data-name').toLowerCase();
            if (name.includes(query)) item.style.display = 'flex';
            else item.style.display = 'none';
        });
    },

    addToCart: (exName) => {
        // Create an empty structure similar to what TrainingUI uses
        TemplateBuilderUI.cart.push({
            id: Date.now() + Math.random().toString(),
            name: exName,
            sets: [] // We'll add sets based on mass edit or manual config
        });
        TemplateBuilderUI.renderCart();
        
        // Optional visual feedback
        const searchInput = document.getElementById('builder-search');
        searchInput.value = '';
        TemplateBuilderUI.filterCatalog();
        
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    },

    removeFromCart: (index) => {
        TemplateBuilderUI.cart.splice(index, 1);
        TemplateBuilderUI.renderCart();
    },

    moveUp: (index) => {
        if (index > 0) {
            const temp = TemplateBuilderUI.cart[index];
            TemplateBuilderUI.cart[index] = TemplateBuilderUI.cart[index - 1];
            TemplateBuilderUI.cart[index - 1] = temp;
            TemplateBuilderUI.renderCart();
        }
    },

    moveDown: (index) => {
        if (index < TemplateBuilderUI.cart.length - 1) {
            const temp = TemplateBuilderUI.cart[index];
            TemplateBuilderUI.cart[index] = TemplateBuilderUI.cart[index + 1];
            TemplateBuilderUI.cart[index + 1] = temp;
            TemplateBuilderUI.renderCart();
        }
    },

    applyMassEdit: () => {
        const setsCount = parseInt(document.getElementById('builder-mass-sets').value) || 0;
        const repsRaw = (document.getElementById('builder-mass-reps').value || "0").trim();
        const weightRaw = (document.getElementById('builder-mass-weight').value || "0").trim();
        
        if (setsCount <= 0) {
            alert("Podaj poprawną liczbę serii (>0).");
            return;
        }

        if (TemplateBuilderUI.cart.length === 0) {
            alert("Koszyk jest pusty! Dodaj ćwiczenia najpierw.");
            return;
        }
        
        // Parse comma-separated values (e.g. "100, 110, 120" or "10,12,15")
        const weightArr = weightRaw.split(/[,;]+/).map(v => v.trim()).filter(v => v !== '');
        const repsArr = repsRaw.split(/[,;]+/).map(v => v.trim()).filter(v => v !== '');

        TemplateBuilderUI.cart.forEach(ex => {
            ex.sets = [];
            for(let i=0; i<setsCount; i++) {
                // Get the weight for this specific set (or fallback to the last provided one)
                let w = weightArr.length > 0 ? (weightArr[i] !== undefined ? weightArr[i] : weightArr[weightArr.length - 1]) : "0";
                let r = repsArr.length > 0 ? (repsArr[i] !== undefined ? repsArr[i] : repsArr[repsArr.length - 1]) : "0";
                
                ex.sets.push({
                    weight: w, 
                    reps: r,
                    completed: false
                });
            }
        });

        TemplateBuilderUI.renderCart();
        
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate([50, 50, 50]);
        }
    },

    renderCart: () => {
        const list = document.getElementById('builder-cart-list');
        if (!list) return;

        if (TemplateBuilderUI.cart.length === 0) {
            list.innerHTML = `<div style="text-align: center; color: #666; padding: 20px; font-style: italic;">Koszyk jest pusty.<br>Kliknij ćwiczenia poniżej.</div>`;
            return;
        }

        let html = '';
        TemplateBuilderUI.cart.forEach((ex, index) => {
            let setsDesc = '';
            if (ex.sets.length > 0) {
                const repsStr = ex.sets.map(s => s.reps).join(', ');
                const weightStr = ex.sets.map(s => s.weight).join(', ');
                setsDesc = `<span style="color: #2ECC71; font-weight: bold; font-size: 0.85em; margin-top: 5px; display: block;">✓ Ustawiono: ${ex.sets.length} serii (${repsStr} powt.) @ ${weightStr}kg</span>`;
            } else {
                setsDesc = `<span style="color: #ff4444; font-size: 0.85em; margin-top: 5px; display: block;">Brak ustawionych serii</span>`;
            }

            html += `
                <div style="background: rgba(0, 191, 255, 0.05); border: 1px solid #00BFFF; padding: 12px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="flex: 1;">
                        <div style="color: #fff; font-weight: bold; font-size: 1.0em;">${index + 1}. ${ex.name}</div>
                        ${setsDesc}
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            <button onclick="TemplateBuilderUI.moveUp(${index})" style="background: #333; border: none; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">▲</button>
                            <button onclick="TemplateBuilderUI.moveDown(${index})" style="background: #333; border: none; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">▼</button>
                        </div>
                        <button onclick="TemplateBuilderUI.removeFromCart(${index})" style="background: rgba(255, 0, 0, 0.2); border: 1px solid #ff4444; color: #ff4444; padding: 8px 12px; border-radius: 6px; font-weight: bold;">X</button>
                    </div>
                </div>
            `;
        });
        list.innerHTML = html;
    },

    saveTemplate: () => {
        const name = document.getElementById('builder-template-name').value.trim();
        if (!name) {
            alert("Podaj nazwę dla swojego szablonu.");
            return;
        }
        if (TemplateBuilderUI.cart.length === 0) {
            alert("Dodaj minimum jedno ćwiczenie.");
            return;
        }

        // Validate that all exercises have sets
        const incomplete = TemplateBuilderUI.cart.find(ex => ex.sets.length === 0);
        if (incomplete) {
            alert(`Ćwiczenie "${incomplete.name}" nie ma ustawionych serii! Użyj "Zastosuj do wszystkich".`);
            return;
        }

        const template = {
            id: Date.now(),
            name: name,
            type: 'strength',
            exercises: TemplateBuilderUI.cart.map(ex => ({
                name: ex.name,
                sets: ex.sets.map(s => ({ ...s })) // deep copy
            }))
        };

        const templatesStr = localStorage.getItem('uki_workout_templates') || "[]";
        let templates = [];
        try { templates = JSON.parse(templatesStr); } catch(e) {}
        
        templates.push(template);
        localStorage.setItem('uki_workout_templates', JSON.stringify(templates));

        alert("Szablon zapisany pomyślnie! Znajdziesz go w zakładce Trening -> Szablony Planów Treningowych.");
        
        // Reset
        TemplateBuilderUI.cart = [];
        document.getElementById('builder-template-name').value = '';
        TemplateBuilderUI.renderCart();
        window.switchTab('training-dashboard');
    },
    
    openBuilder: () => {
        TemplateBuilderUI.cart = [];
        window.switchTab('template-builder-dashboard');
        TemplateBuilderUI.render();
    }
};

window.TemplateBuilderUI = TemplateBuilderUI;
