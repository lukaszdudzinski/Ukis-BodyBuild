import fs from 'fs';

// --- 1. Fix "Postaw Kawę" in index.html ---
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/onclick="switchTab\('help-dashboard'\)"/g, `onclick="window.open('https://suppi.pl/ukidives', '_blank')"`);

// Update cards in index.html to be solid for readability
indexHtml = indexHtml.replace(/background: rgba\(10, 10, 15, 0\.65\); backdrop-filter: blur\(20px\); -webkit-backdrop-filter: blur\(20px\);/g, "background: #111118;");

fs.writeFileSync('index.html', indexHtml);

// --- 2. Fix TrainingUI.js to match Koncepcja 1/Image 1 precisely ---
let trainingUi = fs.readFileSync('src/modules/ui/TrainingUI.js', 'utf8');
trainingUi = trainingUi.replace(/background: rgba\(10, 10, 15, 0\.65\); backdrop-filter: blur\(20px\); -webkit-backdrop-filter: blur\(20px\)/g, "background: #111118");
// Re-write renderCurrentExercises again to perfectly match the mockup
const startMarker = `    renderCurrentExercises: () => {`;
const endMarker = `    handleTrainingPhoto: async (event) => {`;
const startIndex = trainingUi.indexOf(startMarker);
const endIndex = trainingUi.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const newRender = `    renderCurrentExercises: () => {
        const list = document.getElementById('current-exercises-list');
        if (currentTraining.exercises.length === 0) {
            list.innerHTML = '';
            return;
        }

        let html = '';
        let inSupersetGroup = false;

        currentTraining.exercises.forEach((ex, index) => {
            const nextEx = currentTraining.exercises[index + 1];
            const isMainForSuperset = nextEx && nextEx.type === 'superset';

            if (isMainForSuperset && ex.type !== 'superset') {
                html += \`<div style="background: #111118; border-radius: 16px; padding: 15px; margin-bottom: 20px; position: relative; border: 1px solid #333;">\`;
                html += \`<div style="position: absolute; top: -10px; left: 20px; background: #E91E63; color: #FFF; padding: 2px 10px; font-size: 10px; font-weight: 800; border-radius: 10px; text-transform: uppercase;">Superseria</div>\`;
                inSupersetGroup = true;
            }

            if (ex.type === 'superset') {
                if (inSupersetGroup) {
                    html += \`<div style="height: 1px; background: rgba(255,255,255,0.1); margin: 15px 0;"></div>\`;
                } else {
                    html += \`<div style="background: #111118; border-radius: 16px; padding: 15px; margin-bottom: 20px; position: relative; border: 1px solid #333;">\`;
                    html += \`<div style="position: absolute; top: -10px; left: 20px; background: #E91E63; color: #FFF; padding: 2px 10px; font-size: 10px; font-weight: 800; border-radius: 10px; text-transform: uppercase;">Superseria (Błąd)</div>\`;
                }
            }

            // Exercise Header (Wpisz nazwę + Camera + Trash)
            html += \`
                <div style="margin-bottom: \${inSupersetGroup && ex.type !== 'superset' ? '0' : '20px'};">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                        <input type="text" placeholder="Wpisz nazwę..." value="\${ex.name}" onchange="window.TrainingUI.updateExerciseField('\${ex.id}', 'name', this.value); window.TrainingUI.renderCurrentExercises();" style="flex: 1; background: transparent; border: none; color: #FFF; font-size: 22px; font-weight: 700; outline: none; min-width: 0;">
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <label style="cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 20px; filter: grayscale(100%); opacity: 0.7;">📷</span>
                                <input type="file" accept="image/*" style="display: none;" onchange="window.TrainingUI.handleTrainingPhoto(event)">
                            </label>
                            <button onclick="window.TrainingUI.removeExercise('\${ex.id}')" style="background: transparent; border: none; color: #888; font-size: 20px; padding: 5px; cursor: pointer;">🗑</button>
                        </div>
                    </div>\`;

            if (ex.type === 'cardio') {
                const cTime = ex.cardioSeconds || (ex.duration_minutes ? ex.duration_minutes * 60 : 0);
                html += \`
                    <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 15px; text-align: center;">
                        <div style="color: #888; font-size: 12px; margin-bottom: 10px;">Czas trwania (Stoper lub wpisz ręcznie)</div>
                        <div style="font-size: 32px; color: #00D26A; font-family: monospace; font-weight: 700; display: \${ex.cardioInterval ? 'block' : 'none'};" id="cardio-display-\${ex.id}">\${window.TrainingUI.formatTime(cTime)}</div>
                        <div style="display: \${ex.cardioInterval ? 'none' : 'flex'}; align-items: center; justify-content: center; gap: 5px;">
                            <input type="number" id="cardio-manual-min-\${ex.id}" value="\${Math.floor(cTime/60)}" onchange="window.TrainingUI.updateCardioManual('\${ex.id}', this.value)" style="width: 80px; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: #222; color: #FFF; font-size: 24px; text-align: center; font-weight: 700;" inputmode="numeric">
                            <span style="color: #888; font-size: 16px;">min</span>
                        </div>
                        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 15px;">
                            <button id="cardio-btn-start-\${ex.id}" onclick="window.TrainingUI.startCardio('\${ex.id}')" style="background: #00D26A; color: #000; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; \${ex.cardioInterval ? 'opacity: 0.5;' : ''}">Start</button>
                            <button id="cardio-btn-stop-\${ex.id}" onclick="window.TrainingUI.stopCardio('\${ex.id}')" style="background: rgba(231,76,60,0.1); color: #E74C3C; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; \${!ex.cardioInterval ? 'opacity: 0.5;' : ''}">Stop</button>
                        </div>
                    </div>\`;
            } else {
                html += \`<div style="display: flex; flex-direction: column; gap: 8px;">\`;
                let seriesCount = 0;
                (ex.sets || []).forEach((set, i) => {
                    const isDropset = set.type === 'dropset';
                    if (!isDropset) seriesCount++;
                    const rowStyle = isDropset ? 'padding-left: 15px;' : '';
                    
                    html += \`
                        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 12px 0; \${rowStyle} \${set.isCompleted ? 'opacity: 0.4;' : ''}">
                            <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                                <!-- Checkbox circle -->
                                <div onclick="window.TrainingUI.toggleSetCompletion('\${ex.id}', \${i}, \${!set.isCompleted})" style="width: 20px; height: 20px; border-radius: 50%; border: 1px solid #555; display: flex; align-items: center; justify-content: center; cursor: pointer; background: \${set.isCompleted ? '#555' : 'transparent'}; flex-shrink: 0;"></div>
                                
                                <div style="display: flex; align-items: center; gap: 8px; flex: 1; justify-content: flex-start;">
                                    <div style="background: #2C2C2E; border-radius: 8px; padding: 6px 12px; display: flex; align-items: center;">
                                        <input type="number" value="\${set.weight || ''}" placeholder="Ciężar (kg)" onchange="window.TrainingUI.updateSetInline('\${ex.id}', \${i}, 'weight', this.value)" style="width: 75px; background: transparent; border: none; color: \${isDropset ? '#FF9800' : '#FFF'}; font-size: 15px; font-weight: 400; text-align: center; padding: 0; outline: none;" inputmode="decimal">
                                    </div>
                                    <span style="color: #666; font-size: 14px; font-weight: 300;">×</span>
                                    <div style="background: #2C2C2E; border-radius: 8px; padding: 6px 12px; display: flex; align-items: center;">
                                        <input type="number" value="\${set.reps || ''}" placeholder="Powtórzenia" onchange="window.TrainingUI.updateSetInline('\${ex.id}', \${i}, 'reps', this.value)" style="width: 85px; background: transparent; border: none; color: #FFF; font-size: 15px; font-weight: 400; text-align: center; padding: 0; outline: none;" inputmode="numeric">
                                    </div>
                                </div>
                            </div>
                            <button onclick="window.TrainingUI.removeSet('\${ex.id}', \${i})" style="background: transparent; border: none; color: #666; font-size: 18px; cursor: pointer; padding: 5px; flex-shrink: 0;">🗑</button>
                        </div>\`;
                });
                html += \`</div>\`; // End sets

                html += \`
                    <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                        <button onclick="window.TrainingUI.addSet('\${ex.id}', false)" style="background: #FFF; color: #000; border: none; border-radius: 8px; padding: 8px 16px; font-size: 14px; font-weight: 600; cursor: pointer;">[ + Seria ]</button>
                        <button onclick="window.TrainingUI.addSet('\${ex.id}', true)" style="background: #2C2C2E; color: #FFF; border: none; border-radius: 8px; padding: 8px 16px; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px;">🔥 Dropset</button>
                        \${!isMainForSuperset && ex.type !== 'superset' ? \`
                            <button onclick="window.TrainingUI.addSuperset('\${ex.id}')" style="background: #2C2C2E; color: #FFF; border: none; border-radius: 8px; padding: 8px 16px; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px;">🔗 Dodaj Superserię</button>
                        \` : ''}
                    </div>\`;
                
                html += \`
                    <div style="margin-top: 15px; display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" onchange="window.TrainingUI.handleCopyCheckbox('\${ex.id}', this.checked)" \${ex.autoCopy ? 'checked' : ''} style="accent-color: #00D26A; width: 16px; height: 16px;">
                        <span style="color: #888; font-size: 12px;">Auto-kopiuj serię</span>
                    </div>\`;
            }

            html += \`</div>\`; // End exercise container

            if (ex.type === 'superset' && (!nextEx || nextEx.type !== 'superset')) {
                html += \`</div>\`; // End superset group
                inSupersetGroup = false;
            }
        });

        list.innerHTML = html;
    },
\n`;
    trainingUi = trainingUi.substring(0, startIndex) + newRender + trainingUi.substring(endIndex);
    fs.writeFileSync('src/modules/ui/TrainingUI.js', trainingUi);
    console.log("Replaced renderCurrentExercises (Koncepcja 1).");
}

// --- 3. Fix TrainingComponent.js missing Sticky Footer ---
// Let's check if the sticky footer is correctly appended and has a high z-index.
let tComp = fs.readFileSync('src/components/TrainingComponent.js', 'utf8');
tComp = tComp.replace(/background: rgba\(10, 10, 15, 0\.65\); backdrop-filter: blur\(20px\); -webkit-backdrop-filter: blur\(20px\);/g, "background: #111118;");
tComp = tComp.replace(/background: rgba\(10, 10, 15, 0\.95\);/g, "background: #111118;");

// If position: absolute doesn't stick because its parent #active-training-view is not position relative/100vh etc.,
// let's change it to position: fixed and ensure it works.
tComp = tComp.replace(/position: absolute; bottom: 0;/g, "position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; margin: 0 auto; max-width: 800px;");
fs.writeFileSync('src/components/TrainingComponent.js', tComp);

// Ensure #active-training-view has proper padding so the sticky footer doesn't cover content
// It has `<div style="height: 120px;"></div>` so it's fine.

console.log("All fixes applied");
