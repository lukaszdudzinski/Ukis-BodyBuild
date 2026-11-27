// wyglad: zar
import { ExerciseCatalog, exerciseSearchTexts, isCatalogExercise } from '../../data/ExerciseCatalog.js';
import { ikona } from '../wyglad/ikony.js';
import { goalPrefill, repsLowerBound } from '../trainer/trainerPlan.js';

const esc = (s) => String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Podpowiedzi i potwierdzenia Kreatora: komunikat z-toast Treningu (TrainingUI.komunikat) zamiast alert().
const powiadom = (tekst) => {
    if (window.TrainingUI && typeof window.TrainingUI.komunikat === 'function') window.TrainingUI.komunikat(tekst);
    else alert(tekst);
};

const CELE = [['sila', 'Siła'], ['moc', 'Moc'], ['wytrzymalosc', 'Wytrzymałość'], ['hipertrofia', 'Hipertrofia']];

// Typ ćwiczenia: ikona (Lucide) i podpis w przycisku typu własnego ćwiczenia.
const TYPY = {
    strength: { ikona: ikona('dumbbell', 16), etykieta: 'Siłowe', nastepny: 'cardio' },
    cardio: { ikona: ikona('clock', 16), etykieta: 'Cardio', nastepny: 'classes' },
    classes: { ikona: ikona('users', 16), etykieta: 'Zajęcia', nastepny: 'strength' },
};

const PLAN_HINT = 'Serie z planu trenera — zmiana serii odłączy ćwiczenie od planu.';

// Serie ćwiczenia z planu w chwili wczytania do kreatora (R13). Klucz to obiekt w koszyku,
// więc przestawianie kolejności i zmiana nazwy niczego nie psują.
const loadedSets = new WeakMap();
const setsKey = (sets) => JSON.stringify((sets || []).map(s => [s.type || 'normal', String(s.weight ?? ''), String(s.reps ?? '')]));
const setsChanged = (ex) => loadedSets.has(ex) && loadedSets.get(ex) !== setsKey(ex.sets);

// Ćwiczenie koszyka → ćwiczenie szablonu. Pola planu od trenera (plan, planInfo) przechodzą bez zmian,
// chyba że klient zmienił serie (liczbę, ciężar, powtórzenia, typ): wtedy ćwiczenie odłącza się od planu
// i sesja zaczyna się od jego własnych serii (R13). Sama zmiana nazwy nie odłącza.
function cartExercise(ex) {
    const out = {
        name: ex.name,
        type: ex.type || 'strength',
        sets: (ex.sets || []).map(s => ({ ...s }))
    };
    if (ex.plan && !setsChanged(ex)) {
        out.plan = JSON.parse(JSON.stringify(ex.plan));
        if (ex.planInfo) out.planInfo = ex.planInfo;
    }
    return out;
}

export const TemplateBuilderUI = {
    cart: [],
    currentEditId: null,

    render: () => {
        const container = document.getElementById('template-builder-dashboard');
        if (!container) return;

        const zetony = CELE.map(([id, nazwa]) =>
            `<button type="button" class="z-chip" data-cel="${id}" aria-pressed="false" onclick="TemplateBuilderUI.wybierzCel('${id}')">${nazwa}</button>`).join('');

        container.innerHTML = `
            <header class="z-head-center">
                <button type="button" class="z-ic z-card" aria-label="Zamknij" onclick="TemplateBuilderUI.zamknij()">${ikona('x')}</button>
                <h2 class="z-hd">Kreator szablonów</h2>
                <button type="button" class="z-btn zk-zapisz" onclick="TemplateBuilderUI.saveTemplate()">Zapisz</button>
            </header>

            <div class="zk-tresc-ekranu">
                <label class="z-sr" for="builder-template-name">Nazwa planu</label>
                <input type="text" id="builder-template-name" class="z-in zk-nazwa" placeholder="Nazwa planu (np. Push dół)">

                <div>
                    <span class="z-lab">Cel planu — podpowie powtórzenia</span>
                    <div class="zk-zetony" role="group" aria-label="Cel planu">${zetony}</div>
                    <div id="builder-cel-podpowiedz" class="z-mut zk-podpowiedz" aria-live="polite"></div>
                </div>

                <!-- KOSZYK GŁÓWNY WIDOK -->
                <div id="builder-cart-area" class="z-card zk-masowo">
                    <div class="zk-tytul">Zastosuj do zaznaczonych</div>
                    <div class="z-mut">Przecinki tworzą piramidę, np. powt. 12,10,8</div>
                    <div class="zk-pola">
                        <div><label class="z-lab" for="builder-mass-sets">Serie</label><input type="number" id="builder-mass-sets" class="z-in" inputmode="numeric" placeholder="3"></div>
                        <div><label class="z-lab" for="builder-mass-reps">Powt.</label><input type="text" id="builder-mass-reps" class="z-in" placeholder="12,10,8"></div>
                        <div><label class="z-lab" for="builder-mass-weight">Kg</label><input type="text" id="builder-mass-weight" class="z-in" placeholder="60"></div>
                    </div>
                    <button type="button" class="z-ghost" onclick="TemplateBuilderUI.applyMassEdit()">Ustaw</button>
                </div>

                <div class="zk-lista-glowa">
                    <div class="zk-tytul">Twoje ćwiczenia</div>
                    <button type="button" class="z-chip" onclick="TemplateBuilderUI.openCatalogModal()">${ikona('plus', 16)}Dodaj</button>
                </div>

                <div id="builder-cart-list" class="z-card z-list zk-lista">
                    <!-- Pojawią się tu wybrane ćwiczenia -->
                </div>
            </div>

            <!-- MODAL BAZY ĆWICZEŃ -->
            <div id="builder-catalog-modal" class="z-sheet-scrim" style="display: none;" role="dialog" aria-modal="true" aria-label="Baza ćwiczeń">
                <div class="z-sheet zk-baza">
                    <div class="z-sheet-head">
                        <h3 class="z-hd">Baza ćwiczeń</h3>
                        <button type="button" class="z-ic z-card" aria-label="Zamknij" onclick="document.getElementById('builder-catalog-modal').style.display='none'">${ikona('x')}</button>
                    </div>

                    <label class="z-lab" for="builder-search">Wyszukaj z bazy</label>
                    <input type="text" id="builder-search" class="z-in" placeholder="Szukaj ćwiczenia..." onkeyup="TemplateBuilderUI.filterCatalog()">

                    <span class="z-lab zk-odstep">Lub dodaj własne ćwiczenie</span>
                    <div class="zk-wlasne">
                        <label class="z-sr" for="builder-custom-name">Własna nazwa</label>
                        <input type="text" id="builder-custom-name" class="z-in" placeholder="Własna nazwa...">
                        <button type="button" class="z-ghost" onclick="TemplateBuilderUI.toggleCustomType()" id="builder-custom-type-btn" data-type="strength" title="Zmień typ">${TYPY.strength.ikona}Siłowe</button>
                        <button type="button" class="z-btn" onclick="TemplateBuilderUI.addCustomToCart()">Dodaj</button>
                    </div>

                    <div id="builder-catalog-list" class="zk-katalog">
                        <!-- Lista katalogu -->
                    </div>
                </div>
            </div>
        `;

        TemplateBuilderUI.renderCatalog();
        TemplateBuilderUI.renderCart();
    },

    zamknij: () => {
        TemplateBuilderUI.cart = [];
        TemplateBuilderUI.currentEditId = null;
        window.switchTab('training-dashboard');
    },

    // Żeton celu tylko podpowiada (R14): zakres z kontinuum celu („1–5”, „15+”) pokazuje jako wskazówkę,
    // a w „Powt.” wpisuje samą dolną granicę jako liczbę (pole powtórzeń sesji jest liczbowe). Serie bez zmian.
    // Wybór nie trafia do szablonu (format zapisu bez zmian).
    wybierzCel: (goalId) => {
        const prefill = goalPrefill(goalId);
        if (!prefill) return;
        const dolna = repsLowerBound(prefill.reps);
        const reps = document.getElementById('builder-mass-reps');
        if (reps && dolna !== null) reps.value = String(dolna);
        const nazwa = (CELE.find(([id]) => id === goalId) || [])[1] || '';
        const podpowiedz = document.getElementById('builder-cel-podpowiedz');
        if (podpowiedz) podpowiedz.textContent = `${nazwa}: ${prefill.reps} powt.`;
        document.querySelectorAll('#template-builder-dashboard [data-cel]').forEach((btn) => {
            const on = btn.getAttribute('data-cel') === goalId;
            btn.setAttribute('aria-pressed', String(on));
            btn.classList.toggle('z-on', on);
        });
    },

    openCatalogModal: () => {
        document.getElementById('builder-catalog-modal').style.display = 'flex';
        document.getElementById('builder-search').value = '';
        document.getElementById('builder-custom-name').value = '';
        TemplateBuilderUI.filterCatalog();
    },

    toggleCustomType: () => {
        const btn = document.getElementById('builder-custom-type-btn');
        const typ = TYPY[TYPY[btn.getAttribute('data-type')] ? btn.getAttribute('data-type') : 'strength'];
        const nowy = TYPY[typ.nastepny];
        btn.setAttribute('data-type', typ.nastepny);
        btn.innerHTML = nowy.ikona + nowy.etykieta;
    },

    addCustomToCart: () => {
        const nameInput = document.getElementById('builder-custom-name');
        const typeBtn = document.getElementById('builder-custom-type-btn');
        const name = nameInput.value.trim();
        const type = typeBtn.getAttribute('data-type');
        
        if (!name) {
            powiadom("Wpisz nazwę własnego ćwiczenia.");
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

        let customExercises = [];
        try { customExercises = JSON.parse(localStorage.getItem('uki_custom_exercises') || '[]'); } catch(e) {}
        // Ćwiczenie własne, które jest dziś w katalogu (np. dawna nazwa), nie dubluje listy; zapis zostaje bez zmian.
        const fullCatalog = [...ExerciseCatalog, ...customExercises.filter(n => !isCatalogExercise(n))];

        // Szukanie także po angielskiej i dawnej nazwie; na liście tylko nazwa.
        list.innerHTML = fullCatalog.map((exName) =>
            `<button type="button" class="builder-catalog-item z-li" data-name="${esc(exName)}" data-search="${esc(exerciseSearchTexts(exName).join(' | '))}" onclick="TemplateBuilderUI.addToCart(this.dataset.name)"><span>${esc(exName)}</span>${ikona('plus', 18)}</button>`
        ).join('');
    },

    filterCatalog: () => {
        const query = document.getElementById('builder-search').value.toLowerCase();
        const items = document.querySelectorAll('.builder-catalog-item');
        items.forEach(item => {
            const name = (item.getAttribute('data-search') || item.getAttribute('data-name')).toLowerCase();
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
            powiadom("Podaj liczbę serii większą od zera.");
            return;
        }

        if (TemplateBuilderUI.cart.length === 0) {
            powiadom("Lista ćwiczeń jest pusta. Najpierw dodaj ćwiczenia.");
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
            powiadom("Zaznacz ćwiczenia, którym chcesz ustawić serie.");
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
            list.innerHTML = `<div class="zk-pusto z-mut">Koszyk jest pusty.<br>Kliknij „Dodaj”, żeby wybrać ćwiczenie.</div>`;
            return;
        }

        list.innerHTML = TemplateBuilderUI.cart.map((ex, index) => {
            let setsDesc;
            if (ex.sets.length > 0) {
                const repsStr = ex.sets.map(s => esc(s.reps)).join(', ');
                const weightStr = ex.sets.map(s => esc(s.weight)).join(', ');
                setsDesc = `<span class="zk-opis zk-ok">${ikona('check', 14)}Ustawiono: ${ex.sets.length} serii (${repsStr} powt.) @ ${weightStr}kg</span>`;
            } else {
                setsDesc = `<span class="zk-opis zk-brak">${ikona('info', 14)}Brak ustawionych serii</span>`;
            }
            const typ = TYPY[ex.type] || TYPY.strength;

            return `
                <div class="zk-wiersz">
                    <label class="z-check zk-wybor">
                        <input type="checkbox" id="builder-select-${index}" ${ex.sets.length === 0 ? 'checked' : ''}>
                        <span class="zk-tresc">
                            <span class="zk-nazwa-cw"><span class="zk-nr">${index + 1}.</span><span class="zk-typ">${typ.ikona}</span><span class="zk-nazwa-tekst">${esc(ex.name)}</span></span>
                            ${ex.plan ? `<span class="builder-plan-hint z-mut">${esc(PLAN_HINT)}</span>` : ''}
                            ${setsDesc}
                        </span>
                    </label>
                    <div class="zk-akcje">
                        <button type="button" class="z-ic" aria-label="W górę" onclick="TemplateBuilderUI.moveUp(${index})">${ikona('chevron-up')}</button>
                        <button type="button" class="z-ic" aria-label="W dół" onclick="TemplateBuilderUI.moveDown(${index})">${ikona('chevron-down')}</button>
                        <button type="button" class="z-ic zk-usun" aria-label="Usuń" onclick="TemplateBuilderUI.removeFromCart(${index})">${ikona('x')}</button>
                    </div>
                </div>
            `;
        }).join('');
    },

    saveTemplate: () => {
        const name = document.getElementById('builder-template-name').value.trim();
        if (!name) {
            powiadom("Podaj nazwę szablonu.");
            return;
        }
        if (TemplateBuilderUI.cart.length === 0) {
            powiadom("Dodaj co najmniej jedno ćwiczenie.");
            return;
        }

        const incomplete = TemplateBuilderUI.cart.find(ex => ex.sets.length === 0);
        if (incomplete) {
            powiadom(`Ćwiczenie „${incomplete.name}” nie ma serii. Ustaw je w „Zastosuj do zaznaczonych”.`);
            return;
        }

        const template = {
            id: Date.now(),
            name: name,
            type: 'strength',
            exercises: TemplateBuilderUI.cart.map(cartExercise)
        };

        const templatesStr = localStorage.getItem('uki_workout_templates') || "[]";
        let templates = [];
        try { templates = JSON.parse(templatesStr); } catch(e) {}
        
        if (TemplateBuilderUI.currentEditId) {
            const idx = templates.findIndex(t => String(t.id) === String(TemplateBuilderUI.currentEditId));
            if (idx > -1) {
                templates[idx].name = name;
                // Szablon planu od trenera zachowuje source (tylko name i exercises się zmieniają),
                // a ćwiczenia swoje tygodnie planu (plan) i wiersz planInfo (decyzja 15).
                templates[idx].exercises = TemplateBuilderUI.cart.map(cartExercise);
            } else {
                templates.push(template);
            }
            TemplateBuilderUI.currentEditId = null;
        } else {
            templates.push(template);
        }
        
        localStorage.setItem('uki_workout_templates', JSON.stringify(templates));

        powiadom("Szablon zapisany. Znajdziesz go w Treningu, w oknie „Szablony”.");
        
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
            powiadom("Nie znaleziono szablonu.");
            return;
        }

        TemplateBuilderUI.cart = JSON.parse(JSON.stringify(template.exercises || []));
        TemplateBuilderUI.cart.forEach(ex => { if (ex && ex.plan) loadedSets.set(ex, setsKey(ex.sets)); });
        TemplateBuilderUI.currentEditId = id;
        
        window.switchTab('template-builder-dashboard');
        TemplateBuilderUI.render();
        
        const nameInput = document.getElementById('builder-template-name');
        if (nameInput) nameInput.value = template.name || '';
    }
};

window.TemplateBuilderUI = TemplateBuilderUI;
