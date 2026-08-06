import { DatabaseManager } from '../db/DatabaseManager.js';
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

        // Initialize date to today
        const dateInput = document.getElementById('measureDate');
        if (dateInput && !dateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
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

    handlePhotoPreview: (e) => {
        const file = e.target.files[0];
        const preview = document.getElementById('measurePhotoPreview');
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                preview.src = event.target.result;
                preview.style.display = 'block';
                // Store base64 in dataset for easy saving
                preview.dataset.base64 = event.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
            preview.dataset.base64 = '';
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
            photo: preview && preview.dataset.base64 ? preview.dataset.base64 : null
        };

        try {
            await DatabaseManager.addMeasurement(data);
            alert("Pomiary zapisane pomyślnie!");
            e.target.reset();
            
            // Reset photo
            if(preview) {
                preview.style.display = 'none';
                preview.dataset.base64 = '';
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

            let html = '';
            records.forEach(rec => {
                html += `
                    <div class="log-card" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                            <strong style="color: var(--primary-color); font-size: 1.1em;">🗓 ${rec.date}</strong>
                            <button onclick="window.deleteMeasurement(${rec.id})" style="background: transparent; border: none; color: #ff4444; cursor: pointer;">🗑 Usuń</button>
                        </div>
                        <div style="display: flex; gap: 15px;">
                            ${rec.photo ? `<img src="${rec.photo}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #444;" />` : ''}
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
                    </div>
                `;
            });
            
            container.innerHTML = html;
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
