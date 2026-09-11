import fs from 'fs';

let content = fs.readFileSync('src/components/TrainingComponent.js', 'utf8');

// The active training view starts with `<div id="active-training-view" style="display: none;">`
// I'll replace the top section with a cleaner layout.
const topSectionOld = `<div style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 8px; border: 1px solid #00BFFF; text-align: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #00BFFF; margin-bottom: 10px;">Czas trwania: <span id="training-timer">00:00:00</span></h3>`;

const topSectionNew = `<div style="background: #111118; padding: 15px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); text-align: center; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <div style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Czas trwania</div>
                    <h3 style="margin: 0; color: #FFF; font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums;"><span id="training-timer">00:00:00</span></h3>`;

content = content.replace(topSectionOld, topSectionNew);

// Fix the input for training name
content = content.replace(
    /<input type="text" id="training-name-input".*?>/,
    `<input type="text" id="training-name-input" placeholder="Wpisz nazwę treningu..." style="width: 100%; padding: 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); background: #111118; color: #FFF; font-size: 18px; font-weight: 600; text-align: center; box-sizing: border-box; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">`
);

// Add exercise button
content = content.replace(
    /<button type="button" id="add-exercise-to-plan-btn" class="action-button" style="width: 100%; background-color: rgba\(0, 191, 255, 0\.1\); border-color: #00BFFF; color: #00BFFF;">\+ Dodaj ćwiczenie<\/button>/,
    `<button type="button" id="add-exercise-to-plan-btn" class="action-button" style="width: 100%; background-color: #00D26A; border: none; border-radius: 12px; color: #000; font-weight: 700; font-size: 16px; padding: 14px;">+ Dodaj ćwiczenie</button>`
);

fs.writeFileSync('src/components/TrainingComponent.js', content);
console.log('Patched TrainingComponent.js');
