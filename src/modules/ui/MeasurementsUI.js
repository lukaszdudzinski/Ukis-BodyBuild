// wyglad: zar
import { DatabaseManager } from '../db/DatabaseManager.js';
import { MediaManager } from '../db/MediaManager.js';
import { MeasurementsComponent } from '../../components/MeasurementsComponent.js';
import { normalizeHeightCm } from '../diet/kcalGoal.js';
import { currentSex, saveSex } from '../body/sexConfirm.js';
import { navyBodyFat } from '../body/bodyMetrics.js';
import { ikona } from '../wyglad/ikony.js';

// Encje HTML dla danych w innerHTML (daty i liczby z bazy, także z importu kopii).
const esc = (s) => String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
// Argument funkcji w atrybucie onclick="…": literał JS, a potem encje HTML (wzór z TrainingUI.js).
const jsArg = (v) => esc(JSON.stringify(v ?? null));

// Napis na przycisku zapisu: „Zapisz pomiary” albo „Aktualizuj” przy edycji.
const napisZapisu = (tekst) => `${ikona('check', 18)} ${tekst}`;

export const MeasurementsUI = {
    init: () => {
        const container = document.getElementById('measurements-dashboard');
        if (container) {
            container.innerHTML = MeasurementsComponent.render();
        }

        const form = document.getElementById('measurementsForm');
        if (form) {
            form.addEventListener('submit', MeasurementsUI.handleSave);
        }

        const photoInput = document.getElementById('measurePhoto');
        if (photoInput) {
            photoInput.addEventListener('change', MeasurementsUI.handlePhotoPreview);
        }

        const dateInput = document.getElementById('measureDate');
        if (dateInput && !dateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }

        // Płeć: pole bez wartości domyślnej („Wybierz płeć”); zapisujemy tylko świadomy wybór.
        const genderTabs = document.getElementById('measureGender');
        if (genderTabs) {
            MeasurementsUI.restoreGender();
            genderTabs.addEventListener('click', (e) => {
                const tab = e.target.closest('[data-plec]');
                if (!tab) return;
                MeasurementsUI.setGender(tab.dataset.plec);
                saveSex(tab.dataset.plec);
            });
        }

        // Render history on load
        MeasurementsUI.renderHistory();
        
        // Listen to tab switch to re-render if needed
        document.addEventListener('tabChanged', (e) => {
            if(e.detail && e.detail.tab === 'measurements-dashboard') {
                MeasurementsUI.renderHistory();
            }
        });
    },

    // Pole „Płeć” pokazuje zapisaną płeć albo „Wybierz płeć”, gdy jej nie ma (także po wyczyszczeniu formularza).
    restoreGender: () => MeasurementsUI.setGender(currentSex() || ''),

    // Zakładki M/K trzymają wartość w data-value ('male' | 'female' | ''), tę samą co dawne pole wyboru.
    setGender: (value) => {
        const tabs = document.getElementById('measureGender');
        if (!tabs) return;
        tabs.dataset.value = value;
        tabs.querySelectorAll('[data-plec]').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.plec === value)));
    },

    getGender: () => {
        const tabs = document.getElementById('measureGender');
        return tabs ? tabs.dataset.value || '' : '';
    },

    handlePhotoPreview: async (e) => {
        const file = e.target.files[0];
        const preview = document.getElementById('measurePhotoPreview');
        if (file) {
            try {
                const id = await MediaManager.saveMedia(file);
                const url = await MediaManager.getMediaUrl(id);
                preview.src = url;
                preview.hidden = false;
                preview.dataset.mediaId = id;
            } catch (err) {
                alert('Błąd odczytu zdjęcia');
            }
        } else {
            preview.hidden = true;
            preview.dataset.mediaId = '';
        }
    },

    handleSave: async (e) => {
        e.preventDefault();
        
        const preview = document.getElementById('measurePhotoPreview');
        
        const data = {
            date: document.getElementById('measureDate').value,
            weight: parseFloat(document.getElementById('measureWeight').value),
            // Wzrost w metrach (1.75) lub milimetrach (1750) zapisujemy w cm.
            height: normalizeHeightCm(parseFloat(document.getElementById('measureHeight').value)),
            chest: parseFloat(document.getElementById('measureChest').value) || null,
            waist: parseFloat(document.getElementById('measureWaist').value) || null,
            hips: parseFloat(document.getElementById('measureHips').value) || null,
            thigh: parseFloat(document.getElementById('measureThigh').value) || null,
            biceps: parseFloat(document.getElementById('measureBiceps').value) || null,
            neck: parseFloat(document.getElementById('measureNeck').value) || null,
            photo: preview && preview.dataset.mediaId ? preview.dataset.mediaId : null
        };

        saveSex(MeasurementsUI.getGender()); // pusty wybór niczego nie nadpisuje

        try {
            if (window.currentEditMeasurementId) {
                const q = `UPDATE measurements SET date=?, weight=?, height=?, chest=?, waist=?, hips=?, thigh=?, biceps=?, neck=?, photo=? WHERE id=?`;
                await DatabaseManager.sendMessage('exec', {
                    sql: q,
                    bind: [data.date, data.weight, data.height, data.chest, data.waist, data.hips, data.thigh, data.biceps, data.neck, data.photo, window.currentEditMeasurementId]
                });
                alert("Pomiary zaktualizowane pomyślnie!");
                window.currentEditMeasurementId = null;
                const submitBtn = e.target.querySelector('button[type="submit"]');
                if(submitBtn) submitBtn.innerHTML = napisZapisu('Zapisz pomiary');
            } else {
                await DatabaseManager.addMeasurement(data);
                alert("Pomiary zapisane pomyślnie!");
            }
            e.target.reset();
            MeasurementsUI.restoreGender();
            
            // Set date back to today after reset
            document.getElementById('measureDate').value = new Date().toISOString().split('T')[0];
            
            // Reset photo
            if(preview) {
                preview.hidden = true;
                preview.dataset.mediaId = '';
            }
            
            // Re-render
            MeasurementsUI.renderHistory();
        } catch (err) {
            console.error("Error saving measurement:", err);
            alert("Wystąpił błąd podczas zapisu.");
        }
    },

    renderHistory: async () => {
        const container = document.getElementById('measurements-list');
        if (!container) return;

        try {
            const records = await DatabaseManager.getMeasurements();

            if (records.length === 0) {
                container.innerHTML = '<p class="z-mut z-pomiary-pusto">Brak dodanych pomiarów.</p>';
                return;
            }

            const sex = currentSex();
            container.innerHTML = records.map((rec) => MeasurementsUI.rowHtml(rec, sex)).join('');

            records.forEach((rec) => {
                if (!rec.photo) return;
                MediaManager.getMediaUrl(rec.photo).then((url) => {
                    const box = document.getElementById(`measure-photo-${rec.id}`);
                    if (!url || !box) return;
                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = 'Zdjęcie sylwetki';
                    box.hidden = false;
                    box.replaceChildren(img);
                });
            });
        } catch (err) {
            console.error("Error loading history:", err);
            container.innerHTML = '<p class="z-pomiary-blad" role="alert">Błąd ładowania historii.</p>';
        }
    },

    // Wiersz historii: miniatura 56 × 70, „data · waga”, skrót obwodów i BF% (US Navy, gdy starcza danych).
    rowHtml: (rec, sex) => {
        const id = jsArg(String(rec.id));
        const wzrost = normalizeHeightCm(rec.height) ?? rec.height;
        const bf = navyBodyFat({ sex, height: wzrost, waist: rec.waist, neck: rec.neck, hips: rec.hips });
        const obwody = [['Wzrost', wzrost], ['Klatka', rec.chest], ['Talia', rec.waist], ['Biodra', rec.hips],
            ['Udo', rec.thigh], ['Biceps', rec.biceps], ['Szyja', rec.neck]]
            .filter(([, v]) => v)
            .map(([n, v]) => `<span class="z-pomiar-obw"><span class="z-mut">${n}</span> ${esc(v)}</span>`)
            .join('');
        const przycisk = (akcja, nazwa, ikonaNazwa, klasa = '') =>
            `<button type="button" class="z-ic z-card ${klasa}" aria-label="${nazwa}" onclick="window.${akcja}(${id})">${ikona(ikonaNazwa, 18)}</button>`;
        return `
            <article class="z-card z-pomiar">
                <div id="measure-photo-${esc(rec.id)}" class="z-pomiar-foto" hidden></div>
                <div class="z-pomiar-tresc">
                    <div class="z-pomiar-gora">
                        <strong class="z-pomiar-tyt">${esc(rec.date)} · ${esc(rec.weight)} kg</strong>
                        ${bf !== null ? `<span class="z-pomiar-bf">BF ${bf.toFixed(1)}%</span>` : ''}
                    </div>
                    <div class="z-pomiar-obwody">${obwody}</div>
                </div>
                <div class="z-pomiar-akcje">
                    ${przycisk('editMeasurement', 'Edytuj pomiar', 'pencil')}
                    ${przycisk('cloneMeasurement', 'Klonuj pomiar', 'copy')}
                    ${przycisk('deleteMeasurement', 'Usuń pomiar', 'trash', 'z-danger')}
                </div>
            </article>`;
    }
};

// Global handlers
window.deleteMeasurement = async (rawId) => {
    const id = Number(rawId); // id z onclick przychodzi jako tekst
    if (confirm("Czy na pewno chcesz usunąć ten pomiar?")) {
        const { DatabaseManager } = await import('../db/DatabaseManager.js');
        await DatabaseManager.deleteMeasurement(id);
        const { MeasurementsUI } = await import('./MeasurementsUI.js');
        MeasurementsUI.renderHistory();
    }
};

window.populateMeasurementForm = async (rawId, isEdit) => {
    const id = Number(rawId); // id z onclick przychodzi jako tekst
    const { DatabaseManager } = await import('../db/DatabaseManager.js');
    const { MediaManager } = await import('../db/MediaManager.js');
    const records = await DatabaseManager.getMeasurements();
    const rec = records.find(r => r.id === id);
    if (!rec) return;

    if (isEdit) {
        window.currentEditMeasurementId = id;
        document.getElementById('measureDate').value = rec.date;
        const submitBtn = document.querySelector('#measurementsForm button[type="submit"]');
        if (submitBtn) submitBtn.innerHTML = napisZapisu('Aktualizuj');
    } else {
        window.currentEditMeasurementId = null;
        document.getElementById('measureDate').value = new Date().toISOString().split('T')[0];
        const submitBtn = document.querySelector('#measurementsForm button[type="submit"]');
        if (submitBtn) submitBtn.innerHTML = napisZapisu('Zapisz pomiary');
    }

    if (rec.weight) document.getElementById('measureWeight').value = rec.weight;
    // Dawne wpisy w mm lub m pokazujemy w cm, żeby dało się je poprawić (pole przyjmuje 100–250).
    if (rec.height) document.getElementById('measureHeight').value = normalizeHeightCm(rec.height) ?? rec.height;
    if (rec.chest) document.getElementById('measureChest').value = rec.chest;
    if (rec.waist) document.getElementById('measureWaist').value = rec.waist;
    if (rec.hips) document.getElementById('measureHips').value = rec.hips;
    if (rec.thigh) document.getElementById('measureThigh').value = rec.thigh;
    if (rec.biceps) document.getElementById('measureBiceps').value = rec.biceps;
    if (rec.neck) document.getElementById('measureNeck').value = rec.neck;

    const preview = document.getElementById('measurePhotoPreview');
    if (rec.photo && preview) {
        const url = await MediaManager.getMediaUrl(rec.photo);
        if (url) {
            preview.src = url;
            preview.hidden = false;
            preview.dataset.mediaId = rec.photo;
        }
    } else if (preview) {
        preview.hidden = true;
        preview.dataset.mediaId = '';
    }

    // Scroll to top
    document.getElementById('measurements-dashboard').scrollIntoView({ behavior: 'smooth' });
};

window.editMeasurement = (id) => {
    window.populateMeasurementForm(id, true);
};

window.cloneMeasurement = (id) => {
    window.populateMeasurementForm(id, false);
};
