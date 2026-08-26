const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/MeasurementsUI.js', 'utf8');

content = content.replace(/import \{ DatabaseManager \} from '\.\.\/db\/DatabaseManager\.js';/,
`import { DatabaseManager } from '../db/DatabaseManager.js';\nimport { MediaManager } from '../db/MediaManager.js';`);

content = content.replace(/handlePhotoPreview: \(e\) => \{[\s\S]*?reader\.readAsDataURL\(file\);\s*\} else \{\s*preview\.style\.display = 'none';\s*preview\.dataset\.base64 = '';\s*\}\s*\},/,
`handlePhotoPreview: async (e) => {
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
    },`);

content = content.replace(/photo: preview && preview\.dataset\.base64 \? preview\.dataset\.base64 : null/,
`photo: preview && preview.dataset.mediaId ? preview.dataset.mediaId : null`);

content = content.replace(/if\(preview\) \{\s*preview\.style\.display = 'none';\s*preview\.dataset\.base64 = '';\s*\}/,
`if(preview) {
                preview.style.display = 'none';
                preview.dataset.mediaId = '';
            }`);

content = content.replace(/renderHistory: async \(\) => \{[\s\S]*?container\.innerHTML = html;\s*\} catch \(err\) \{/,
`renderHistory: async () => {
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
                card.innerHTML = \`
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                        <strong style="color: var(--primary-color); font-size: 1.1em;">🗓 \${rec.date}</strong>
                        <button onclick="window.deleteMeasurement(\${rec.id})" style="background: transparent; border: none; color: #ff4444; cursor: pointer;">🗑 Usuń</button>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <div id="measure-photo-\${rec.id}" style="width: 80px; height: 80px; display: none;"></div>
                        <div style="flex-grow: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 0.9em;">
                            <div><strong>Waga:</strong> \${rec.weight} kg</div>
                            \${rec.height ? \`<div><strong>Wzrost:</strong> \${rec.height} cm</div>\` : ''}
                            \${rec.chest ? \`<div><strong>Klatka:</strong> \${rec.chest} cm</div>\` : ''}
                            \${rec.waist ? \`<div><strong>Talia:</strong> \${rec.waist} cm</div>\` : ''}
                            \${rec.hips ? \`<div><strong>Biodra:</strong> \${rec.hips} cm</div>\` : ''}
                            \${rec.thigh ? \`<div><strong>Udo:</strong> \${rec.thigh} cm</div>\` : ''}
                            \${rec.biceps ? \`<div><strong>Biceps:</strong> \${rec.biceps} cm</div>\` : ''}
                            \${rec.neck ? \`<div><strong>Szyja:</strong> \${rec.neck} cm</div>\` : ''}
                        </div>
                    </div>
                \`;
                container.appendChild(card);

                if (rec.photo) {
                    MediaManager.getMediaUrl(rec.photo).then(url => {
                        if (url) {
                            const photoContainer = document.getElementById(\`measure-photo-\${rec.id}\`);
                            if (photoContainer) {
                                photoContainer.style.display = 'block';
                                photoContainer.innerHTML = \`<img src="\${url}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #444;" />\`;
                            }
                        }
                    });
                }
            });
        } catch (err) {`);

fs.writeFileSync('src/modules/ui/MeasurementsUI.js', content);
