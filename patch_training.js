const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/TrainingUI.js', 'utf8');

content = content.replace(/import \{ DatabaseManager \} from '\.\.\/db\/DatabaseManager\.js';/,
`import { DatabaseManager } from '../db/DatabaseManager.js';\nimport { MediaManager } from '../db/MediaManager.js';`);

content = content.replace(/handleMachinePhoto: \(event, exerciseId\) => \{[\s\S]*?\}\);/,
`handleMachinePhoto: async (event, exerciseId) => {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const id = await MediaManager.saveMedia(file);
            const exercise = TrainingUI.getExerciseById(exerciseId);
            if (exercise) {
                exercise.machinePhoto = id;
                TrainingUI.renderCurrentExercises();
            }
        } catch(e) {
            alert("Błąd zapisu zdjęcia: " + e.message);
        }
    }`);

content = content.replace(/handleTrainingPhoto: \(event\) => \{[\s\S]*?\}\);/,
`handleTrainingPhoto: async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!currentTraining.socialPhotos) currentTraining.socialPhotos = [];
        if (currentTraining.socialPhotos.length >= 3) {
            alert("Możesz dodać maksymalnie 3 zdjęcia z treningu!");
            return;
        }

        try {
            const id = await MediaManager.saveMedia(file);
            currentTraining.socialPhotos.push(id);
            TrainingUI.renderTrainingPhotos();
        } catch(e) {
            alert("Błąd zapisu zdjęcia: " + e.message);
        }
    }`);

content = content.replace(/renderTrainingPhotos: \(\) => \{[\s\S]*?\}\s*\n\s*\},/m,
`renderTrainingPhotos: () => {
        const list = document.getElementById('training-social-photos-list');
        if (!list) return;
        list.innerHTML = '';
        if (currentTraining.socialPhotos && currentTraining.socialPhotos.length > 0) {
            currentTraining.socialPhotos.forEach((photoId, index) => {
                const imgWrap = document.createElement('div');
                imgWrap.style.position = 'relative';
                
                const img = document.createElement('img');
                img.style.width = '60px';
                img.style.height = '60px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '8px';
                
                MediaManager.getMediaUrl(photoId).then(url => {
                    if (url) img.src = url;
                });

                const delBtn = document.createElement('button');
                delBtn.innerText = 'X';
                delBtn.style.position = 'absolute';
                delBtn.style.top = '-5px';
                delBtn.style.right = '-5px';
                delBtn.style.background = 'red';
                delBtn.style.color = 'white';
                delBtn.style.border = 'none';
                delBtn.style.borderRadius = '50%';
                delBtn.style.width = '20px';
                delBtn.style.height = '20px';
                delBtn.style.fontSize = '10px';
                delBtn.onclick = () => window.TrainingUI.removeTrainingPhoto(index);

                imgWrap.appendChild(img);
                imgWrap.appendChild(delBtn);
                list.appendChild(imgWrap);
            });
        }
    },`);

content = content.replace(/removeTrainingPhoto: \(index\) => \{\s*if \(currentTraining\.socialPhotos\) \{\s*currentTraining\.socialPhotos\.splice\(index, 1\);\s*TrainingUI\.renderTrainingPhotos\(\);\s*\}\s*\}/,
`removeTrainingPhoto: (index) => {
        if (currentTraining.socialPhotos) {
            const id = currentTraining.socialPhotos[index];
            MediaManager.deleteMedia(id);
            currentTraining.socialPhotos.splice(index, 1);
            TrainingUI.renderTrainingPhotos();
        }
    }`);

fs.writeFileSync('src/modules/ui/TrainingUI.js', content);
