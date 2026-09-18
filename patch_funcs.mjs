import fs from 'fs';
let js = fs.readFileSync('src/modules/ui/TrainingUI.js', 'utf8');

const funcs = `
    toggleExerciseType: (exId) => {
        const ex = currentTraining.exercises.find(e => e.id === exId);
        if (ex) {
            if (ex.type === 'strength') ex.type = 'cardio';
            else if (ex.type === 'cardio') ex.type = 'classes';
            else ex.type = 'strength';
            TrainingUI.renderCurrentExercises();
            TrainingUI.saveTrainingState();
        }
    },
    openExerciseSelector: (exId) => {
        TrainingUI.openCatalogModal(exId);
    },
`;

const targetStr = 'openCatalogModal: (exerciseId) => {';
if (js.includes(targetStr)) {
    js = js.replace(targetStr, funcs + '\n    ' + targetStr);
    fs.writeFileSync('src/modules/ui/TrainingUI.js', js);
    console.log('TrainingUI functions added.');
}
