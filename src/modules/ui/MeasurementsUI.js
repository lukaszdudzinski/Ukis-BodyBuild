import { DatabaseManager } from '../db/DatabaseManager.js';
import { MediaManager } from '../db/MediaManager.js';
import { MeasurementsComponent } from '../../components/MeasurementsComponent.js';

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

        const genderSelect = document.getElementById('measureGender');
        if (genderSelect) {
            const savedGender = localStorage.getItem('uki-bodybuild-gender');
            if (savedGender) {
                genderSelect.value = savedGender;
            }
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

    handlePhotoPreview: async (e) => {
        const file = e.target.files[0];
        const preview = document.getElementById('measurePhotoPreview');
        if (file) {
            try {
                const id = await MediaManager.saveMedia(file);
                const url = await MediaManager.getMediaUrl(id);
                preview.src = url;
                preview.style.display = 'block';
                preview.dataset.mediaId = id;
            } catch (err) {
                alert('Błąd odczytu zdjęcia');
            }
        } else {
            preview.style.display = 'none';
            preview.dataset.mediaId = '';
        }
    },

    handleSave: async (e) => {
        e.preventDefault();
        
        const preview = document.getElementById('measurePhotoPreview');
        
        const data = {
            date: document.getElementById('measureDate').value,
            weight: parseFloat(document.getElementById('measureWeight').value),
            height: parseFloat(document.getElementById('measureHeight').value) || null,
            chest: parseFloat(document.getElementById('measureChest').value) || null,
            waist: parseFloat(document.getElementById('measureWaist').value) || null,
            hips: parseFloat(document.getElementById('measureHips').value) || null,
            thigh: parseFloat(document.getElementById('measureThigh').value) || null,
            biceps: parseFloat(document.getElementById('measureBiceps').value) || null,
            neck: parseFloat(document.getElementById('measureNeck').value) || null,
            photo: preview && preview.dataset.mediaId ? preview.dataset.mediaId : null
        };

        const genderSelect = document.getElementById('measureGender');
        if (genderSelect) {
            localStorage.setItem('uki-bodybuild-gender', genderSelect.value);
        }

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
                if(submitBtn) submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Zapisz Pomiary';
            } else {
                await DatabaseManager.addMeasurement(data);
                alert("Pomiary zapisane pomyślnie!");
            }
            e.target.reset();
            
            // Set date back to today after reset
            document.getElementById('measureDate').value = new Date().toISOString().split('T')[0];
            
            // Reset photo
            if(preview) {
                preview.style.display = 'none';
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
                container.innerHTML = '<p style="color: #888; text-align: center; font-style: italic;">Brak dodanych pomiarów.</p>';
                return;
            }

            container.innerHTML = '';
            
            records.forEach(rec => {
                const card = document.createElement('div');
                card.className = "log-card";
                card.style.cssText = "background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); margin-bottom: 15px; box-sizing: border-box;";
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <strong style="color: #FF9800; font-size: 1.1em; display: flex; align-items: center; gap: 8px;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            ${rec.date}
                        </strong>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="window.editMeasurement(${rec.id})" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 10px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            </button>
                            <button onclick="window.cloneMeasurement(${rec.id})" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 10px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            </button>
                            <button onclick="window.deleteMeasurement(${rec.id})" style="background: rgba(255,69,58,0.1); border: 1px solid rgba(255,69,58,0.3); color: #FF453A; border-radius: 10px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <div id="measure-photo-${rec.id}" style="width: 80px; height: 80px; display: none;"></div>
                        <div style="flex-grow: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.9em; color: #fff;">
                            <div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.02);"><strong style="color: #8E8E93; font-size: 0.8em; text-transform: uppercase; display: block; margin-bottom: 2px;">Waga</strong> ${rec.weight} kg</div>
                            ${rec.height ? `<div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.02);"><strong style="color: #8E8E93; font-size: 0.8em; text-transform: uppercase; display: block; margin-bottom: 2px;">Wzrost</strong> ${rec.height} cm</div>` : ''}
                            ${rec.chest ? `<div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.02);"><strong style="color: #8E8E93; font-size: 0.8em; text-transform: uppercase; display: block; margin-bottom: 2px;">Klatka</strong> ${rec.chest} cm</div>` : ''}
                            ${rec.waist ? `<div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.02);"><strong style="color: #8E8E93; font-size: 0.8em; text-transform: uppercase; display: block; margin-bottom: 2px;">Talia</strong> ${rec.waist} cm</div>` : ''}
                            ${rec.hips ? `<div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.02);"><strong style="color: #8E8E93; font-size: 0.8em; text-transform: uppercase; display: block; margin-bottom: 2px;">Biodra</strong> ${rec.hips} cm</div>` : ''}
                            ${rec.thigh ? `<div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.02);"><strong style="color: #8E8E93; font-size: 0.8em; text-transform: uppercase; display: block; margin-bottom: 2px;">Udo</strong> ${rec.thigh} cm</div>` : ''}
                            ${rec.biceps ? `<div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.02);"><strong style="color: #8E8E93; font-size: 0.8em; text-transform: uppercase; display: block; margin-bottom: 2px;">Biceps</strong> ${rec.biceps} cm</div>` : ''}
                            ${rec.neck ? `<div style="background: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.02);"><strong style="color: #8E8E93; font-size: 0.8em; text-transform: uppercase; display: block; margin-bottom: 2px;">Szyja</strong> ${rec.neck} cm</div>` : ''}
                        </div>
                    </div>
                `;
                container.appendChild(card);

                if (rec.photo) {
                    MediaManager.getMediaUrl(rec.photo).then(url => {
                        if (url) {
                            const photoContainer = document.getElementById(`measure-photo-${rec.id}`);
                            if (photoContainer) {
                                photoContainer.style.display = 'block';
                                photoContainer.innerHTML = `<img src="${url}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #444;" />`;
                            }
                        }
                    });
                }
            });
        } catch (err) {
            console.error("Error loading history:", err);
            container.innerHTML = '<p style="color: #ff4444; text-align: center;">Błąd ładowania historii.</p>';
        }
    }
};

// Global handlers
window.deleteMeasurement = async (id) => {
    if (confirm("Czy na pewno chcesz usunąć ten pomiar?")) {
        const { DatabaseManager } = await import('../db/DatabaseManager.js');
        await DatabaseManager.deleteMeasurement(id);
        const { MeasurementsUI } = await import('./MeasurementsUI.js');
        MeasurementsUI.renderHistory();
    }
};

window.populateMeasurementForm = async (id, isEdit) => {
    const { DatabaseManager } = await import('../db/DatabaseManager.js');
    const { MediaManager } = await import('../db/MediaManager.js');
    const records = await DatabaseManager.getMeasurements();
    const rec = records.find(r => r.id === id);
    if (!rec) return;

    if (isEdit) {
        window.currentEditMeasurementId = id;
        document.getElementById('measureDate').value = rec.date;
        const submitBtn = document.querySelector('#measurementsForm button[type="submit"]');
        if (submitBtn) submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Aktualizuj';
    } else {
        window.currentEditMeasurementId = null;
        document.getElementById('measureDate').value = new Date().toISOString().split('T')[0];
        const submitBtn = document.querySelector('#measurementsForm button[type="submit"]');
        if (submitBtn) submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Zapisz Pomiary';
    }

    if (rec.weight) document.getElementById('measureWeight').value = rec.weight;
    if (rec.height) document.getElementById('measureHeight').value = rec.height;
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
            preview.style.display = 'block';
            preview.dataset.mediaId = rec.photo;
        }
    } else if (preview) {
        preview.style.display = 'none';
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
