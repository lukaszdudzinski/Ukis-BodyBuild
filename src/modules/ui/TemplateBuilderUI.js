import { ExerciseCatalog, ExerciseCategories } from '../../data/ExerciseCatalog.js';

export const TemplateBuilderUI = {
    cart: [],
    currentEditId: null,

    render: () => {
        const container = document.getElementById('template-builder-dashboard');
        if (!container) return;

        container.innerHTML = `
            <div class="view-header" style="position: sticky; top: 0; z-index: 100; background: rgba(17,17,24,0.85); backdrop-filter: blur(10px); padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h2 style="margin: 0; color: #00BFFF; font-weight: 700; font-size: 1.3em;">Kreator Planu (Koszyk)</h2>
                    <button onclick="TemplateBuilderUI.cart = []; TemplateBuilderUI.currentEditId = null; window.switchTab('training-dashboard')" style="color: #FF453A; font-size: 1.5em; border: none; background: rgba(255,69,58,0.1); width: 32px; height: 32px; border-radius: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; line-height: 1;">&times;</button>
                </div>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="builder-template-name" placeholder="Nazwa Planu (np. Push Dół)" style="flex: 1; padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3); color: #fff; font-size: 0.95em; outline: none;">
                    <button onclick="TemplateBuilderUI.saveTemplate()" style="background: rgba(46, 204, 113, 0.15); color: #2ECC71; border: 1px solid rgba(46, 204, 113, 0.3); font-weight: 600; border-radius: 12px; padding: 0 16px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        Zapisz
                    </button>
                </div>
            </div>

            <!-- KOSZYK GŁÓWNY WIDOK -->
            <div id="builder-cart-area" style="padding: 15px 0;">
                <div style="margin-bottom: 20px; display: flex; gap: 8px; align-items: center; background: rgba(255, 152, 0, 0.05); padding: 16px; border-radius: 16px; border: 1px solid rgba(255,152,0,0.2); flex-wrap: wrap; backdrop-filter: blur(10px);">
                    <span style="color: #FF9800; font-size: 0.95em; width: 100%; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        Zastosuj do zaznaczonych (Możesz używać przecinków dla piramid!)
                    </span>
                    <span style="color: #8E8E93; font-size: 0.85em; width: 100%; margin-bottom: 8px;">Przykład: wpisz <b style="color:#fff;">3</b> serie, Powt: <b style="color:#fff;">12,10,8</b>, Kg: <b style="color:#fff;">100,110,120</b></span>
                    <input type="number" id="builder-mass-sets" placeholder="Serie" style="width: 55px; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 8px; text-align: center; outline: none;">
                    <span style="color: #8E8E93; font-weight: bold;">x</span>
                    <input type="text" id="builder-mass-reps" placeholder="Powt." style="width: 70px; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 8px; text-align: center; outline: none;">
                    <span style="color: #8E8E93; font-weight: bold;">@</span>
                    <input type="text" id="builder-mass-weight" placeholder="Kg" style="width: 85px; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 8px; text-align: center; outline: none;">
                    <button onclick="TemplateBuilderUI.applyMassEdit()" style="background: rgba(255, 152, 0, 0.15); color: #FF9800; border: 1px solid rgba(255,152,0,0.3); font-weight: 600; padding: 10px 14px; border-radius: 8px; cursor: pointer; flex-grow: 1;">Ustaw</button>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h4 style="margin: 0; color: #8E8E93; font-weight: 600;">Twoje ćwiczenia</h4>
                    <button onclick="TemplateBuilderUI.openCatalogModal()" style="background: rgba(0, 191, 255, 0.15); color: #00BFFF; border: 1px solid rgba(0,191,255,0.3); padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 0.9em; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Dodaj ćwiczenie
                    </button>
                </div>

                <div id="builder-cart-list" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 35px;">
                    <!-- Pojawią się tu wybrane ćwiczenia -->
                </div>
            </div>

            <!-- MODAL BAZY ĆWICZEŃ -->
            <div id="builder-catalog-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(17,17,24,0.85); backdrop-filter: blur(8px); z-index: 10000; justify-content: center; align-items: center; padding: 15px;">
                <div style="background: rgba(255,255,255,0.05); width: 100%; max-width: 500px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; max-height: 90vh; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                    <div style="padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0; color: #00BFFF; font-size: 1.3em; font-weight: 600;">Baza Ćwiczeń</h3>
                        <button onclick="document.getElementById('builder-catalog-modal').style.display='none'" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 32px; height: 32px; border-radius: 16px; font-size: 1.2em; display: flex; align-items: center; justify-content: center; cursor: pointer;">&times;</button>
                    </div>
                    
                    <div style="padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <label style="color: #8E8E93; font-size: 0.85em; display: block; margin-bottom: 8px;">Wyszukaj z bazy:</label>
                        <input type="text" id="builder-search" placeholder="Szukaj ćwiczenia..." style="width: 100%; box-sizing: border-box; padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3); color: #fff; outline: none;" onkeyup="TemplateBuilderUI.filterCatalog()">
                        
                        <div style="margin-top: 20px;">
                            <label style="color: #8E8E93; font-size: 0.85em; display: block; margin-bottom: 8px;">Lub dodaj własne ćwiczenie:</label>
                            <div style="display: flex; gap: 8px;">
                                <input type="text" id="builder-custom-name" placeholder="Własna nazwa..." style="flex: 1; padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3); color: #fff; outline: none;">
                                <button onclick="TemplateBuilderUI.toggleCustomType()" id="builder-custom-type-btn" data-type="strength" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 0 12px; border-radius: 12px; font-size: 0.9em; cursor: pointer; min-width: 90px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 4px;" title="Zmień typ">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
                                    Siłowe
                                </button>
                                <button onclick="TemplateBuilderUI.addCustomToCart()" style="background: rgba(46, 204, 113, 0.15); color: #2ECC71; border: 1px solid rgba(46,204,113,0.3); font-weight: 600; padding: 0 16px; border-radius: 12px; cursor: pointer;">Dodaj</button>
                            </div>
                        </div>
                    </div>

                    <div id="builder-catalog-list" style="padding: 20px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 10px;">
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
        const currentType = btn.getAttribute('data-type');
        if (currentType === 'strength') {
            btn.setAttribute('data-type', 'cardio');
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c-2.3 0-3-1.6-3-3s.7-3 3-3"/><path d="M9 14c-2.3 0-3-1.6-3-3s.7-3 3-3"/><path d="M12 20v-4"/></svg> Cardio';
        } else if (currentType === 'cardio') {
            btn.setAttribute('data-type', 'classes');
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Zajęcia';
        } else {
            btn.setAttribute('data-type', 'strength');
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg> Siłowe';
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
        let customExercises = [];
        try { customExercises = JSON.parse(localStorage.getItem('uki_custom_exercises') || '[]'); } catch(e) {}
        const fullCatalog = [...ExerciseCatalog, ...customExercises];
        
        fullCatalog.forEach(exName => {
            const escapedNameForData = exName.replace(/"/g, '&quot;');
            const escapedNameForJS = exName.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            html += `<div class="builder-catalog-item" data-name="${escapedNameForData}" onclick="TemplateBuilderUI.addToCart('${escapedNameForJS}')" style="background: rgba(255,255,255,0.03); padding: 14px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: 0.2s;">
                <span style="color: #fff; font-size: 0.95em; font-weight: 500;">${exName}</span>
                <span style="color: #00BFFF; display: flex; align-items: center; justify-content: center; background: rgba(0, 191, 255, 0.1); width: 28px; height: 28px; border-radius: 14px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
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

        let applied = false;
        TemplateBuilderUI.cart.forEach((ex, index) => {
            const cb = document.getElementById(`builder-select-${index}`);
            if (cb && cb.checked) {
                applied = true;
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
            }
        });

        if (!applied) {
            alert("Nie zaznaczono żadnego ćwiczenia do ustawienia!");
            return;
        }

        // Oznacz ćwiczenia jako ustawione (odznacz checkboxa) by łatwiej konfigurować kolejne
        TemplateBuilderUI.cart.forEach((ex, index) => {
            const cb = document.getElementById(`builder-select-${index}`);
            if (cb && cb.checked) cb.checked = false;
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
            
            const iconSvg = ex.type === 'classes' 
                ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
                : (ex.type === 'cardio' ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c-2.3 0-3-1.6-3-3s.7-3 3-3"/><path d="M9 14c-2.3 0-3-1.6-3-3s.7-3 3-3"/><path d="M12 20v-4"/></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>');

            html += `
                <div style="background: rgba(0, 191, 255, 0.05); border: 1px solid rgba(0, 191, 255, 0.2); padding: 16px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; backdrop-filter: blur(10px);">
                    <div style="display: flex; align-items: center; margin-right: 12px;">
                        <input type="checkbox" id="builder-select-${index}" ${ex.sets.length === 0 ? 'checked' : ''} style="width: 22px; height: 22px; accent-color: #00BFFF; cursor: pointer;">
                    </div>
                    <div style="flex: 1;">
                        <div style="color: #fff; font-weight: 600; font-size: 1.0em; display: flex; align-items: center; gap: 8px;">
                            ${index + 1}. <span style="color: #00BFFF; display: flex; align-items: center;">${iconSvg}</span> ${ex.name}
                        </div>
                        ${setsDesc}
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <button onclick="TemplateBuilderUI.moveUp(${index})" style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 6px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg></button>
                            <button onclick="TemplateBuilderUI.moveDown(${index})" style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 6px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>
                        </div>
                        <button onclick="TemplateBuilderUI.removeFromCart(${index})" style="background: rgba(255, 69, 58, 0.15); border: 1px solid rgba(255, 69, 58, 0.3); color: #FF453A; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
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
            alert(`Ćwiczenie "${incomplete.name}" nie ma ustawionych serii! Użyj "Zastosuj do zaznaczonych".`);
            return;
        }

        const template = {
            id: Date.now(),
            name: name,
            type: 'strength',
            exercises: TemplateBuilderUI.cart.map(ex => ({
                name: ex.name,
                type: ex.type || 'strength',
                sets: (ex.sets || []).map(s => ({ ...s }))
            }))
        };

        const templatesStr = localStorage.getItem('uki_workout_templates') || "[]";
        let templates = [];
        try { templates = JSON.parse(templatesStr); } catch(e) {}
        
        if (TemplateBuilderUI.currentEditId) {
            const idx = templates.findIndex(t => String(t.id) === String(TemplateBuilderUI.currentEditId));
            if (idx > -1) {
                templates[idx].name = name;
                templates[idx].exercises = TemplateBuilderUI.cart.map(ex => ({
                    name: ex.name,
                    type: ex.type || 'strength',
                    sets: (ex.sets || []).map(s => ({ ...s }))
                }));
            } else {
                templates.push(template);
            }
            TemplateBuilderUI.currentEditId = null;
        } else {
            templates.push(template);
        }
        
        localStorage.setItem('uki_workout_templates', JSON.stringify(templates));

        alert("Szablon zapisany pomyślnie! Znajdziesz go w zakładce Trening -> Szablony Planów Treningowych.");
        
        TemplateBuilderUI.cart = [];
        document.getElementById('builder-template-name').value = '';
        TemplateBuilderUI.renderCart();
        window.switchTab('training-dashboard');
    },
    
    openBuilder: () => {
        TemplateBuilderUI.cart = [];
        TemplateBuilderUI.currentEditId = null;
        window.switchTab('template-builder-dashboard');
        TemplateBuilderUI.render();
    },
    
    editTemplate: (id) => {
        const templatesStr = localStorage.getItem('uki_workout_templates') || "[]";
        let templates = [];
        try { templates = JSON.parse(templatesStr); } catch(e) {}
        
        const template = templates.find(t => String(t.id) === String(id));
        if (!template) {
            alert("Nie znaleziono szablonu!");
            return;
        }

        TemplateBuilderUI.cart = JSON.parse(JSON.stringify(template.exercises || []));
        TemplateBuilderUI.currentEditId = id;
        
        window.switchTab('template-builder-dashboard');
        TemplateBuilderUI.render();
        
        const nameInput = document.getElementById('builder-template-name');
        if (nameInput) nameInput.value = template.name || '';
    }
};

window.TemplateBuilderUI = TemplateBuilderUI;
