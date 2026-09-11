import fs from 'fs';

let content = fs.readFileSync('src/modules/ui/TrainingUI.js', 'utf8');

const oldHeader = `                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
                        <input type="text" placeholder="Wpisz nazwę..." value="\${ex.name}" onchange="window.TrainingUI.updateExerciseField('\${ex.id}', 'name', this.value); window.TrainingUI.renderCurrentExercises();" style="flex: 1; background: transparent; border: none; color: #FFF; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; outline: none; min-width: 0; padding: 0;">
                        <div style="display: flex; gap: 15px; align-items: center;">
                            <label style="cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 20px; filter: grayscale(100%); opacity: 0.7;">📷</span>
                                <input type="file" accept="image/*" style="display: none;" onchange="window.TrainingUI.handleTrainingPhoto(event)">
                            </label>
                            <button onclick="window.TrainingUI.removeExercise('\${ex.id}')" style="background: transparent; border: none; color: #666; font-size: 20px; cursor: pointer; padding: 0;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button>
                        </div>
                    </div>
                    <div style="color: #888; font-size: 16px; margin-bottom: 15px; padding-left: 2px;">
                        \${ex.type === 'classes' ? 'Zajęcia' : (ex.type === 'cardio' ? 'Cardio' : 'Trening Siłowy')} - \${setsCount} serie
                    </div>`;

const newHeader = `                    <div style="margin-bottom: 10px;">
                        <input type="text" placeholder="Wpisz nazwę..." value="\${ex.name}" onchange="window.TrainingUI.updateExerciseField('\${ex.id}', 'name', this.value); window.TrainingUI.renderCurrentExercises();" style="width: 100%; background: transparent; border: none; color: #FFF; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; outline: none; padding: 0; margin-bottom: 5px;">
                        <div style="color: #888; font-size: 14px; margin-bottom: 12px;">\${setsCount} serie</div>
                        
                        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 15px;">
                            <!-- Katalog -->
                            <button onclick="window.TrainingUI.openExerciseSelector('\${ex.id}')" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #FFF; padding: 8px 12px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                                Katalog
                            </button>
                            
                            <!-- Typ treningu -->
                            <button onclick="window.TrainingUI.toggleExerciseType('\${ex.id}')" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #FFF; padding: 8px 12px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                                \${ex.type === 'classes' ? '🧘‍♀️ Zajęcia' : (ex.type === 'cardio' ? '🏃‍♂️ Cardio' : '🏋️ Siłowy')}
                            </button>
                            
                            <!-- Aparat -->
                            <label style="cursor: pointer; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #FFF; padding: 8px 12px; display: flex; align-items: center; justify-content: center;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                                <input type="file" accept="image/*" style="display: none;" onchange="window.TrainingUI.handleTrainingPhoto(event)">
                            </label>
                            
                            <!-- Kosz -->
                            <button onclick="window.TrainingUI.removeExercise('\${ex.id}')" style="background: rgba(255,69,58,0.1); border: 1px solid rgba(255,69,58,0.3); border-radius: 8px; color: #FF453A; padding: 8px 12px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                        </div>
                    </div>`;

content = content.replace(oldHeader, newHeader);
fs.writeFileSync('src/modules/ui/TrainingUI.js', content);
console.log('Fixed exercise header layout');
