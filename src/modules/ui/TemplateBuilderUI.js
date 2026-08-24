import { ExerciseCatalog, ExerciseCategories } from '../../data/ExerciseCatalog.js';

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

            <!-- KOSZYK GŁÓWNY WIDOK -->
            <div id="builder-cart-area" style="padding: 15px 0;">
                <div style="margin-bottom: 15px; display: flex; gap: 8px; align-items: center; background: rgba(255, 152, 0, 0.1); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,152,0,0.3); flex-wrap: wrap;">
                    <span style="color: #FF9800; font-size: 0.95em; width: 100%; font-weight: bold;">Zastosuj do wszystkich (Możesz używać przecinków dla piramid!)</span>
                    <span style="color: #bbb; font-size: 0.8em; width: 100%; margin-bottom: 5px;">💡 Przykład: wpisz <b style="color:#fff;">3</b> serie, Powt: <b style="color:#fff;">12,10,8</b>, Kg: <b style="color:#fff;">100,110,120</b></span>
                    <input type="number" id="builder-mass-sets" placeholder="Serie" style="width: 55px; padding: 8px; background: #222; border: 1px solid #555; color: #fff; border-radius: 6px; text-align: center;">
                    <span style="color: #888;">x</span>
                    <input type="text" id="builder-mass-reps" placeholder="Powt." style="width: 70px; padding: 8px; background: #222; border: 1px solid #555; color: #fff; border-radius: 6px; text-align: center;">
                    <span style="color: #888;">@</span>
                    <input type="text" id="builder-mass-weight" placeholder="Kg" style="width: 85px; padding: 8px; background: #222; border: 1px solid #555; color: #fff; border-radius: 6px; text-align: center;">
                    <button onclick="TemplateBuilderUI.applyMassEdit()" style="background: #FF9800; color: #000; border: none; font-weight: bold; padding: 8px 12px; border-radius: 6px; cursor: pointer; flex-grow: 1;">Ustaw</button>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: #aaa;">Twoje ćwiczenia (Koszyk)</h4>
                    <button onclick="TemplateBuilderUI.openCatalogModal()" style="background: #00BFFF; color: #000; border: none; padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 0.9em; cursor: pointer;">+ Dodaj ćwiczenie</button>
                </div>

                <div id="builder-cart-list" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px;">
                    <!-- Pojawią się tu wybrane ćwiczenia -->
                </div>
            </div>

            <!-- MODAL BAZY ĆWICZEŃ -->
            <div id="builder-catalog-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 10000; justify-content: center; align-items: center; padding: 15px;">
                <div style="background: #1e1e1e; width: 100%; max-width: 500px; border-radius: 12px; border: 1px solid #00BFFF; display: flex; flex-direction: column; max-height: 90vh;">
                    <div style="padding: 15px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0; color: #00BFFF; font-size: 1.3em;">Baza Ćwiczeń</h3>
                        <button onclick="document.getElementById('builder-catalog-modal').style.display='none'" style="background: none; border: none; color: #aaa; font-size: 1.8rem; cursor: pointer; padding: 0; line-height: 1;">&times;</button>
                    </div>
                    
                    <div style="padding: 15px; border-bottom: 1px solid #333;">
                        <label style="color: #aaa; font-size: 0.85em; display: block; margin-bottom: 5px;">Wyszukaj z bazy:</label>
                        <input type="text" id="builder-search" placeholder="Szukaj ćwiczenia..." style="width: 100%; box-sizing: border-box; padding: 10px; border-radius: 8px; border: 1px solid #444; background: #222; color: #fff;" onkeyup="TemplateBuilderUI.filterCatalog()">
                        
                        <div style="margin-top: 15px;">
                            <label style="color: #aaa; font-size: 0.85em; display: block; margin-bottom: 5px;">Lub dodaj własne ćwiczenie:</label>
                            <div style="display: flex; gap: 5px;">
                                <input type="text" id="builder-custom-name" placeholder="Własna nazwa..." style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #444; background: #222; color: #fff;">
                                <button onclick="TemplateBuilderUI.toggleCustomType()" id="builder-custom-type-btn" data-type="strength" style="background: #222; border: 1px solid #444; color: #fff; padding: 0 10px; border-radius: 8px; font-size: 1.2em; cursor: pointer;" title="Zmień na Cardio">🏋️</button>
                                <button onclick="TemplateBuilderUI.addCustomToCart()" style="background: #2ECC71; color: #000; border: none; font-weight: bold; padding: 0 15px; border-radius: 8px; cursor: pointer;">Dodaj</button>
                            </div>
                        </div>
                    </div>

                    <div id="builder-catalog-list" style="padding: 15px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 8px;">
                        <!-- Lista katalogu -->
                    </div>
                </div>
            </div>
        `;

        TemplateBuilderUI.renderCatalog();
        TemplateBuilderUI.renderCart();
    },

    openCatalogModal: () => {
        document.getElementById('builder-catalog-modal').style.display = 'flex';
        document.getElementById('builder-search').value = '';
        document.getElementById('builder-custom-name').value = '';
        TemplateBuilderUI.filterCatalog();
    },

    toggleCustomType: () => {
        const btn = document.getElementById('builder-custom-type-btn');
        if (btn.getAttribute('data-type') === 'strength') {
            btn.setAttribute('data-type', 'cardio');
            btn.innerText = '🏃';
        } else {
            btn.setAttribute('data-type', 'strength');
            btn.innerText = '🏋️';
        }
    },

    addCustomToCart: () => {
        const nameInput = document.getElementById('builder-custom-name');
        const typeBtn = document.getElementById('builder-custom-type-btn');
        const name = nameInput.value.trim();
        const type = typeBtn.getAttribute('data-type');
        
        if (!name) {
            alert("Wpisz nazwę własnego ćwiczenia.");
            return;
        }

        TemplateBuilderUI.cart.push({
            id: Date.now() + Math.random().toString(),
            name: name,
            type: type,
            sets: [] 
        });
        
        TemplateBuilderUI.renderCart();
        document.getElementById('builder-catalog-modal').style.display = 'none';
        
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    },

    renderCatalog: () => {
        const list = document.getElementById('builder-catalog-list');
        if (!list) return;
        
        let html = '';
        ExerciseCatalog.forEach(exName => {
            html += `<div class="builder-catalog-item" data-name="${exName}" onclick="TemplateBuilderUI.addToCart('${exName}')" style="background: #222; padding: 12px 15px; border-radius: 8px; border: 1px solid #333; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #ccc; font-size: 0.95em;">${exName}</span>
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
        TemplateBuilderUI.cart.push({
            id: Date.now() + Math.random().toString(),
            name: exName,
            type: 'strength',
            sets: []
        });
        TemplateBuilderUI.renderCart();
        
        document.getElementById('builder-catalog-modal').style.display = 'none';
        
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
        
        const weightArr = weightRaw.split(/[,;]+/).map(v => v.trim()).filter(v => v !== '');
        const repsArr = repsRaw.split(/[,;]+/).map(v => v.trim()).filter(v => v !== '');

        TemplateBuilderUI.cart.forEach(ex => {
            ex.sets = [];
            for(let i=0; i<setsCount; i++) {
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
            list.innerHTML = `<div style="text-align: center; color: #666; padding: 20px; font-style: italic;">Koszyk jest pusty.<br>Kliknij "Dodaj ćwiczenie".</div>`;
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
            
            const icon = ex.type === 'cardio' ? '🏃' : '🏋️';

            html += `
                <div style="background: rgba(0, 191, 255, 0.05); border: 1px solid #00BFFF; padding: 12px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="flex: 1;">
                        <div style="color: #fff; font-weight: bold; font-size: 1.0em;">${index + 1}. ${icon} ${ex.name}</div>
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
                type: ex.type || 'strength',
                sets: ex.sets.map(s => ({ ...s }))
            }))
        };

        const templatesStr = localStorage.getItem('uki_workout_templates') || "[]";
        let templates = [];
        try { templates = JSON.parse(templatesStr); } catch(e) {}
        
        templates.push(template);
        localStorage.setItem('uki_workout_templates', JSON.stringify(templates));

        alert("Szablon zapisany pomyślnie! Znajdziesz go w zakładce Trening -> Szablony Planów Treningowych.");
        
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
