const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/TrainingUI.js', 'utf8');

content = content.replace(/handleMachinePhoto: async \(event, exerciseId\) => \{[\s\S]*?\}\s*\},/,
`handleMachinePhoto: async (event, exerciseId) => {
        const file = event.target.files[0];
        if (!file) return;
        
        TrainingUI.compressImage(file, async (compressedDataUrl) => {
            try {
                const id = await MediaManager.saveMedia(compressedDataUrl);
                const exercise = TrainingUI.getExerciseById(exerciseId);
                if (exercise) {
                    exercise.machinePhoto = id;
                    TrainingUI.renderCurrentExercises();
                }
            } catch(e) {
                alert("Błąd zapisu zdjęcia: " + e.message);
            }
        });
    },`);

content = content.replace(/handleTrainingPhoto: async \(event\) => \{[\s\S]*?\}\s*\},/,
`handleTrainingPhoto: async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!currentTraining.socialPhotos) currentTraining.socialPhotos = [];
        if (currentTraining.socialPhotos.length >= 3) {
            alert("Możesz dodać maksymalnie 3 zdjęcia z treningu!");
            return;
        }

        TrainingUI.compressImage(file, async (compressedDataUrl) => {
            try {
                const id = await MediaManager.saveMedia(compressedDataUrl);
                currentTraining.socialPhotos.push(id);
                TrainingUI.renderTrainingPhotos();
            } catch(e) {
                alert("Błąd zapisu zdjęcia: " + e.message);
            }
        });
    },`);

fs.writeFileSync('src/modules/ui/TrainingUI.js', content);
