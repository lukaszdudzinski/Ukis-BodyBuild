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
            await DatabaseManager.addMeasurement(data);
            alert("Pomiary zapisane pomyślnie!");
            e.target.reset();
            
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
                card.style.cssText = "background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;";
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                        <strong style="color: var(--primary-color); font-size: 1.1em;">🗓 ${rec.date}</strong>
                        <button onclick="window.deleteMeasurement(${rec.id})" style="background: transparent; border: none; color: #ff4444; cursor: pointer;">🗑 Usuń</button>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <div id="measure-photo-${rec.id}" style="width: 80px; height: 80px; display: none;"></div>
                        <div style="flex-grow: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 0.9em;">
                            <div><strong>Waga:</strong> ${rec.weight} kg</div>
                            ${rec.height ? `<div><strong>Wzrost:</strong> ${rec.height} cm</div>` : ''}
                            ${rec.chest ? `<div><strong>Klatka:</strong> ${rec.chest} cm</div>` : ''}
                            ${rec.waist ? `<div><strong>Talia:</strong> ${rec.waist} cm</div>` : ''}
                            ${rec.hips ? `<div><strong>Biodra:</strong> ${rec.hips} cm</div>` : ''}
                            ${rec.thigh ? `<div><strong>Udo:</strong> ${rec.thigh} cm</div>` : ''}
                            ${rec.biceps ? `<div><strong>Biceps:</strong> ${rec.biceps} cm</div>` : ''}
                            ${rec.neck ? `<div><strong>Szyja:</strong> ${rec.neck} cm</div>` : ''}
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

// Expose delete to global scope for inline onclick handler
window.deleteMeasurement = async (id) => {
    if (confirm("Czy na pewno chcesz usunąć ten pomiar?")) {
        await DatabaseManager.deleteMeasurement(id);
        MeasurementsUI.renderHistory();
    }
};
