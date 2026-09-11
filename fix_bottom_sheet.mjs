import fs from 'fs';

let content = fs.readFileSync('src/components/TrainingComponent.js', 'utf8');

const oldBottomSheetRegex = /<!-- BOTTOM SHEET WRAPPER -->[\s\S]*?<!-- Dodatkowy padding na dole, by nie przysłaniać ostatniego ćwiczenia -->/;

const newBottomSheet = `<!-- UNIFIED BOTTOM SHEET (EXACT MOCKUP MATCH) -->
                <div id="unified-bottom-sheet" style="position: fixed; bottom: 0; left: 0; right: 0; width: 100%; max-width: 800px; margin: 0 auto; z-index: 2000; background: #1C1C1E; border-top-left-radius: 24px; border-top-right-radius: 24px; box-shadow: 0 -5px 25px rgba(0,0,0,0.5); padding: 15px 20px 30px 20px; box-sizing: border-box; display: flex; flex-direction: column; gap: 15px;">
                    
                    <!-- Drag handle -->
                    <div style="width: 40px; height: 5px; background: #555; border-radius: 3px; margin: 0 auto 5px auto;"></div>
                    
                    <!-- List items -->
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div style="display: flex; align-items: center; gap: 15px; cursor: pointer;">
                            <span style="font-size: 20px; opacity: 0.8; filter: grayscale(100%);">📷</span>
                            <span style="color: #FFF; font-size: 16px; font-weight: 400; flex: 1;">Załącz zdjęcia z treningu</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px; cursor: pointer;">
                            <span style="font-size: 20px; opacity: 0.8; filter: grayscale(100%);">⌚</span>
                            <span style="color: #FFF; font-size: 16px; font-weight: 400; flex: 1;">Dodaj dane ze Smartwatcha</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px; cursor: pointer;">
                            <span style="font-size: 20px; opacity: 0.8; filter: grayscale(100%);">💾</span>
                            <span style="color: #FFF; font-size: 16px; font-weight: 400; flex: 1;">Zapisz jako Plan Treningowy</span>
                        </div>
                    </div>

                    <!-- Buttons -->
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button type="button" id="pause-training-btn" style="flex: 1; padding: 16px; background: rgba(255,193,7,0.15); border: 1px solid #FFC107; color: #FFC107; border-radius: 12px; font-weight: 600; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <span>⏸</span> Pauza
                        </button>
                        <button type="button" id="finish-training-btn" style="flex: 1; padding: 16px; background: #E74C3C; border: none; color: #FFF; border-radius: 12px; font-weight: 600; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <span>⏹</span> Zakończ Trening
                        </button>
                    </div>
                </div>

                <!-- Dodatkowy padding na dole, by nie przysłaniać ostatniego ćwiczenia -->`;

content = content.replace(oldBottomSheetRegex, newBottomSheet);
fs.writeFileSync('src/components/TrainingComponent.js', content);
console.log('Fixed TrainingComponent bottom sheet');
