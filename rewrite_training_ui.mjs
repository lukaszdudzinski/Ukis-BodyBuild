import fs from 'fs';

let content = fs.readFileSync('src/modules/ui/TrainingUI.js', 'utf8');

// I need to replace the entire `renderCurrentExercises` implementation.
const startMarker = `    renderCurrentExercises: () => {`;
const endMarker = `    handleTrainingPhoto: async (event) => {`;
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

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
                html += \`<div style="background: rgba(255,255,255,0.02); border-radius: 20px; padding: 15px; margin-bottom: 20px; position: relative;">\`;
                html += \`<div style="position: absolute; top: -10px; left: 20px; background: #E91E63; color: #FFF; padding: 2px 10px; font-size: 10px; font-weight: 800; border-radius: 10px; text-transform: uppercase;">Superseria</div>\`;
                inSupersetGroup = true;
            }

            if (ex.type === 'superset') {
                if (inSupersetGroup) {
                    html += \`<div style="height: 1px; background: rgba(255,255,255,0.1); margin: 15px 0;"></div>\`;
                } else {
                    html += \`<div style="background: rgba(255,255,255,0.02); border-radius: 20px; padding: 15px; margin-bottom: 20px; position: relative;">\`;
                    html += \`<div style="position: absolute; top: -10px; left: 20px; background: #E91E63; color: #FFF; padding: 2px 10px; font-size: 10px; font-weight: 800; border-radius: 10px; text-transform: uppercase;">Superseria (Błąd)</div>\`;
                }
            }

            // Exercise Block Layout
            html += \`
                <div style="margin-bottom: \${inSupersetGroup && ex.type !== 'superset' ? '0' : '20px'};">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                        <input type="text" placeholder="Wpisz nazwę..." value="\${ex.name}" onchange="window.TrainingUI.updateExerciseField('\${ex.id}', 'name', this.value); window.TrainingUI.renderCurrentExercises();" style="flex: 1; background: transparent; border: none; color: #FFF; font-size: 20px; font-weight: 600; outline: none; min-width: 0;">
                        <button onclick="window.TrainingUI.removeExercise('\${ex.id}')" style="background: transparent; border: none; color: #E74C3C; font-size: 14px; padding: 5px; cursor: pointer;">Usuń</button>
                    </div>

                    <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                        <button onclick="const newType = '\${ex.type}' === 'strength' ? 'cardio' : ('\${ex.type}' === 'cardio' ? 'classes' : 'strength'); window.TrainingUI.updateExerciseField('\${ex.id}', 'type', newType); window.TrainingUI.renderCurrentExercises();" style="background: rgba(255,255,255,0.05); border: none; color: #888; border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                            <span>\${ex.type === 'classes' ? '🚴' : (ex.type === 'cardio' ? '🏃' : '🏋️')}</span> \${ex.type === 'classes' ? 'Zajęcia' : (ex.type === 'cardio' ? 'Cardio' : 'Siłowe')}
                        </button>
                        <button onclick="window.TrainingUI.openCatalogModal('\${ex.id}')" style="background: rgba(255,255,255,0.05); border: none; color: #888; border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> Katalog
                        </button>
                    </div>\`;

            if (ex.type === 'cardio') {
                const cTime = ex.cardioSeconds || (ex.duration_minutes ? ex.duration_minutes * 60 : 0);
                html += \`
                    <div style="background: rgba(255,255,255,0.02); border-radius: 12px; padding: 15px; text-align: center;">
                        <div style="color: #888; font-size: 12px; margin-bottom: 10px;">Czas trwania (Stoper lub wpisz ręcznie)</div>
                        <div style="font-size: 32px; color: #00D26A; font-family: monospace; font-weight: 700; display: \${ex.cardioInterval ? 'block' : 'none'};" id="cardio-display-\${ex.id}">\${window.TrainingUI.formatTime(cTime)}</div>
                        <div style="display: \${ex.cardioInterval ? 'none' : 'flex'}; align-items: center; justify-content: center; gap: 5px;">
                            <input type="number" id="cardio-manual-min-\${ex.id}" value="\${Math.floor(cTime/60)}" onchange="window.TrainingUI.updateCardioManual('\${ex.id}', this.value)" style="width: 80px; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #00D26A; font-size: 24px; text-align: center; font-weight: 700;" inputmode="numeric">
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
                    const rowStyle = isDropset ? 'padding-left: 20px; border-left: 2px solid #FF9800;' : '';
                    const idxLabel = isDropset ? '🔥' : \`\${seriesCount}\`;

                    html += \`
                        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border-radius: 12px; padding: 8px 12px; \${rowStyle} \${set.isCompleted ? 'opacity: 0.4;' : ''}">
                            <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                                <div style="background: \${set.isCompleted ? '#00D26A' : 'rgba(255,255,255,0.1)'}; width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer;" onclick="window.TrainingUI.toggleSetCompletion('\${ex.id}', \${i}, \${!set.isCompleted})">
                                    <span style="color: \${set.isCompleted ? '#000' : '#888'}; font-size: 12px; font-weight: 700;">\${idxLabel}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 4px; flex: 1; justify-content: center;">
                                    <input type="number" value="\${set.weight}" onchange="window.TrainingUI.updateSetInline('\${ex.id}', \${i}, 'weight', this.value)" style="width: 60px; background: transparent; border: none; color: \${isDropset ? '#FF9800' : '#FFF'}; font-size: 18px; font-weight: 700; text-align: right; padding: 0;" inputmode="decimal">
                                    <span style="color: #888; font-size: 12px;">kg</span>
                                    <span style="color: #555; margin: 0 4px;">x</span>
                                    <input type="number" value="\${set.reps}" onchange="window.TrainingUI.updateSetInline('\${ex.id}', \${i}, 'reps', this.value)" style="width: 50px; background: transparent; border: none; color: #FFF; font-size: 18px; font-weight: 700; text-align: left; padding: 0;" inputmode="numeric">
                                    <span style="color: #888; font-size: 12px;">powt</span>
                                </div>
                            </div>
                            <button onclick="window.TrainingUI.removeSet('\${ex.id}', \${i})" style="background: transparent; border: none; color: #888; font-size: 18px; cursor: pointer; padding: 5px;">&times;</button>
                        </div>\`;
                });
                html += \`</div>\`; // End sets

                html += \`
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button onclick="window.TrainingUI.addSet('\${ex.id}', false)" style="flex: 1; background: rgba(255,255,255,0.05); color: #FFF; border: none; border-radius: 8px; padding: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">+ Seria</button>
                        <button onclick="window.TrainingUI.addSet('\${ex.id}', true)" style="flex: 1; background: rgba(255,152,0,0.1); color: #FF9800; border: none; border-radius: 8px; padding: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">Dropset</button>
                    </div>\`;
                
                // Opcjonalny checkbox "Skopiuj dane" (minimalistyczny)
                html += \`
                    <div style="margin-top: 10px; display: flex; align-items: center; gap: 8px;">
                        <input type="checkbox" onchange="window.TrainingUI.handleCopyCheckbox('\${ex.id}', this.checked)" \${ex.autoCopy ? 'checked' : ''} style="accent-color: #00D26A;">
                        <span style="color: #888; font-size: 12px;">Auto-kopiuj serię</span>
                    </div>\`;
            }

            if (!isMainForSuperset && ex.type !== 'superset') {
                html += \`
                    <button onclick="window.TrainingUI.addSuperset('\${ex.id}')" style="width: 100%; margin-top: 15px; background: rgba(233, 30, 99, 0.1); color: #E91E63; border: none; border-radius: 8px; padding: 10px; font-size: 14px; font-weight: 600; cursor: pointer;">
                        🔗 Dodaj Superserię
                    </button>\`;
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

    content = content.substring(0, startIndex) + newRender + content.substring(endIndex);
    fs.writeFileSync('src/modules/ui/TrainingUI.js', content);
    console.log("Replaced renderCurrentExercises successfully.");
} else {
    console.log("Could not find markers!");
}
