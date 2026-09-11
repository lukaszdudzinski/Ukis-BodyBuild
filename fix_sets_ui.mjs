import fs from 'fs';

let trainingUi = fs.readFileSync('src/modules/ui/TrainingUI.js', 'utf8');

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
                html += \`<div style="margin-bottom: 20px; position: relative;">\`;
                html += \`<div style="position: absolute; top: -10px; left: 0px; background: #E91E63; color: #FFF; padding: 2px 10px; font-size: 10px; font-weight: 800; border-radius: 10px; text-transform: uppercase; z-index: 10;">Superseria</div>\`;
                inSupersetGroup = true;
            }

            if (ex.type === 'superset') {
                if (inSupersetGroup) {
                    html += \`<div style="height: 1px; background: rgba(255,255,255,0.1); margin: 15px 0;"></div>\`;
                } else {
                    html += \`<div style="margin-bottom: 20px; position: relative;">\`;
                    html += \`<div style="position: absolute; top: -10px; left: 0px; background: #E91E63; color: #FFF; padding: 2px 10px; font-size: 10px; font-weight: 800; border-radius: 10px; text-transform: uppercase; z-index: 10;">Superseria (Błąd)</div>\`;
                }
            }

            // Exercise Header (Wpisz nazwę + Camera)
            // The user wants it to look like the design EXACTLY.
            const setsCount = (ex.sets || []).filter(s => s.type !== 'dropset').length;
            
            html += \`
                <div style="margin-bottom: \${inSupersetGroup && ex.type !== 'superset' ? '0' : '30px'};">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
                        <input type="text" placeholder="Wpisz nazwę..." value="\${ex.name}" onchange="window.TrainingUI.updateExerciseField('\${ex.id}', 'name', this.value); window.TrainingUI.renderCurrentExercises();" style="flex: 1; background: transparent; border: none; color: #FFF; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; outline: none; min-width: 0; padding: 0;">
                        <div style="display: flex; gap: 15px; align-items: center;">
                            <label style="cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 20px; filter: grayscale(100%); opacity: 0.7;">📷</span>
                                <input type="file" accept="image/*" style="display: none;" onchange="window.TrainingUI.handleTrainingPhoto(event)">
                            </label>
                            <button onclick="window.TrainingUI.removeExercise('\${ex.id}')" style="background: transparent; border: none; color: #666; font-size: 20px; cursor: pointer; padding: 0;">🗑</button>
                        </div>
                    </div>
                    <div style="color: #888; font-size: 16px; margin-bottom: 15px; padding-left: 2px;">
                        \${ex.type === 'classes' ? 'Zajęcia' : (ex.type === 'cardio' ? 'Cardio' : 'Trening Siłowy')} - \${setsCount} serie
                    </div>\`;

            if (ex.type === 'cardio') {
                const cTime = ex.cardioSeconds || (ex.duration_minutes ? ex.duration_minutes * 60 : 0);
                html += \`
                    <div style="background: #1C1C1E; border-radius: 16px; padding: 20px; text-align: center;">
                        <div style="color: #888; font-size: 13px; margin-bottom: 10px;">Czas trwania (Stoper lub wpisz ręcznie)</div>
                        <div style="font-size: 36px; color: #00D26A; font-family: monospace; font-weight: 700; display: \${ex.cardioInterval ? 'block' : 'none'};" id="cardio-display-\${ex.id}">\${window.TrainingUI.formatTime(cTime)}</div>
                        <div style="display: \${ex.cardioInterval ? 'none' : 'flex'}; align-items: center; justify-content: center; gap: 5px;">
                            <input type="number" id="cardio-manual-min-\${ex.id}" value="\${Math.floor(cTime/60)}" onchange="window.TrainingUI.updateCardioManual('\${ex.id}', this.value)" style="width: 80px; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: #2C2C2E; color: #FFF; font-size: 24px; text-align: center; font-weight: 700;" inputmode="numeric">
                            <span style="color: #888; font-size: 16px;">min</span>
                        </div>
                        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                            <button id="cardio-btn-start-\${ex.id}" onclick="window.TrainingUI.startCardio('\${ex.id}')" style="background: #00D26A; color: #000; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; \${ex.cardioInterval ? 'opacity: 0.5;' : ''}">Start</button>
                            <button id="cardio-btn-stop-\${ex.id}" onclick="window.TrainingUI.stopCardio('\${ex.id}')" style="background: rgba(231,76,60,0.1); color: #E74C3C; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; \${!ex.cardioInterval ? 'opacity: 0.5;' : ''}">Stop</button>
                        </div>
                    </div>\`;
            } else {
                // Wrapper for Sets exactly like the mockup: A single dark #1C1C1E card
                html += \`<div style="background: #1C1C1E; border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; margin-bottom: 15px;">\`;
                let seriesCount = 0;
                (ex.sets || []).forEach((set, i) => {
                    const isDropset = set.type === 'dropset';
                    if (!isDropset) seriesCount++;
                    const rowStyle = isDropset ? 'padding-left: 20px;' : '';
                    
                    const borderBottom = i < (ex.sets.length - 1) ? 'border-bottom: 1px solid rgba(255,255,255,0.05);' : '';

                    html += \`
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px; \${borderBottom} \${rowStyle} \${set.isCompleted ? 'opacity: 0.4;' : ''}">
                            <div style="display: flex; align-items: center; gap: 15px; flex: 1;">
                                <!-- Checkbox circle -->
                                <div onclick="window.TrainingUI.toggleSetCompletion('\${ex.id}', \${i}, \${!set.isCompleted})" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #555; display: flex; align-items: center; justify-content: center; cursor: pointer; background: \${set.isCompleted ? '#555' : 'transparent'}; flex-shrink: 0;"></div>
                                
                                <div style="display: flex; align-items: center; gap: 10px; flex: 1; justify-content: flex-start;">
                                    <div style="display: flex; flex-direction: column; align-items: center;">
                                        <div style="background: #2C2C2E; border-radius: 8px; padding: 8px 16px; display: flex; align-items: center; min-width: 90px; justify-content: center;">
                                            <input type="number" value="\${set.weight || ''}" placeholder="Ciężar (kg)" onchange="window.TrainingUI.updateSetInline('\${ex.id}', \${i}, 'weight', this.value)" style="width: 100%; background: transparent; border: none; color: \${isDropset ? '#FF9800' : '#888'}; font-size: 16px; font-weight: 500; text-align: center; padding: 0; outline: none;" inputmode="decimal">
                                        </div>
                                        <span style="color: #666; font-size: 11px; margin-top: 4px;">(Max: ~33 kg)</span>
                                    </div>
                                    <span style="color: #666; font-size: 16px; font-weight: 300; margin-bottom: 15px;">×</span>
                                    <div style="display: flex; flex-direction: column; align-items: center;">
                                        <div style="background: #2C2C2E; border-radius: 8px; padding: 8px 16px; display: flex; align-items: center; min-width: 90px; justify-content: center;">
                                            <input type="number" value="\${set.reps || ''}" placeholder="Powtórzenia" onchange="window.TrainingUI.updateSetInline('\${ex.id}', \${i}, 'reps', this.value)" style="width: 100%; background: transparent; border: none; color: #888; font-size: 16px; font-weight: 500; text-align: center; padding: 0; outline: none;" inputmode="numeric">
                                        </div>
                                        <span style="visibility: hidden; font-size: 11px; margin-top: 4px;">Spacer</span>
                                    </div>
                                </div>
                            </div>
                            <button onclick="window.TrainingUI.removeSet('\${ex.id}', \${i})" style="background: transparent; border: none; color: #555; font-size: 20px; cursor: pointer; padding: 5px 10px; margin-bottom: 15px;">🗑</button>
                        </div>\`;
                });
                html += \`</div>\`; // End sets dark card wrapper

                // Buttons OUTSIDE the card
                html += \`
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button onclick="window.TrainingUI.addSet('\${ex.id}', false)" style="background: #FFF; color: #000; border: none; border-radius: 8px; padding: 10px 16px; font-size: 14px; font-weight: 700; cursor: pointer;">[ + Seria ]</button>
                        <button onclick="window.TrainingUI.addSet('\${ex.id}', true)" style="background: #1C1C1E; color: #FFF; border: none; border-radius: 8px; padding: 10px 16px; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px;">🔥 Dropset</button>
                        \${!isMainForSuperset && ex.type !== 'superset' ? \`
                            <button onclick="window.TrainingUI.addSuperset('\${ex.id}')" style="background: #1C1C1E; color: #FFF; border: none; border-radius: 8px; padding: 10px 16px; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px;">🔗 Dodaj Superserię</button>
                        \` : ''}
                    </div>\`;
                
                // Minimalist auto-copy
                html += \`
                    <div style="margin-top: 15px; display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" onchange="window.TrainingUI.handleCopyCheckbox('\${ex.id}', this.checked)" \${ex.autoCopy ? 'checked' : ''} style="accent-color: #FFF; width: 16px; height: 16px;">
                        <span style="color: #666; font-size: 12px;">Auto-kopiuj z poprzedniej serii</span>
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
    console.log("Replaced renderCurrentExercises EXACTLY like mockup.");
}
