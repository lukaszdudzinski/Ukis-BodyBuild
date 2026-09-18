import fs from 'fs';

let js = fs.readFileSync('src/modules/ui/TrainingUI.js', 'utf8');

// 1. Fix Button Alignment
js = js.replace(
    '<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 15px;">',
    '<div style="display: flex; gap: 8px; margin-bottom: 15px; width: 100%;">'
);

js = js.replace(
    /onclick="window\.TrainingUI\.openExerciseSelector\('\\$\\{ex\.id\\}'\)" style="(.*?)"/g,
    'onclick="window.TrainingUI.openExerciseSelector(\\'${ex.id}\\')" style="$1 flex: 1; justify-content: center;"'
);
// simpler: just append 'flex: 1; justify-content: center;' to all buttons in that div
