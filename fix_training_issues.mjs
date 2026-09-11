import fs from 'fs';

// 1. Fix TrainingUI.js (One line buttons, Green glow for completed sets, SVG Trash icon)
let trainingUi = fs.readFileSync('src/modules/ui/TrainingUI.js', 'utf8');

const trashSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;

// Fix completed set styling:
trainingUi = trainingUi.replace(
    /\$\{borderBottom\} \$\{rowStyle\} \$\{set\.isCompleted \? 'opacity: 0\.4;' : ''\}/g,
    `\${borderBottom} \${rowStyle} \${set.isCompleted ? 'background: rgba(0, 210, 106, 0.05); box-shadow: inset 2px 0 0 #00D26A;' : ''}`
);
trainingUi = trainingUi.replace(
    /background: \$\{set\.isCompleted \? '#555' : 'transparent'\}/g,
    `background: \${set.isCompleted ? '#00D26A' : 'transparent'}; border-color: \${set.isCompleted ? '#00D26A' : '#555'}; color: #000; font-weight: bold; font-size: 14px;`
);
// Insert a checkmark inside the checkbox circle if completed:
// The div currently has `></div>`. Let's replace it with `>\${set.isCompleted ? '✓' : ''}</div>`
trainingUi = trainingUi.replace(
    /background: \$\{set\.isCompleted \? '#00D26A' : 'transparent'\}; flex-shrink: 0;"><\/div>/g,
    `background: \${set.isCompleted ? '#00D26A' : 'transparent'}; border-color: \${set.isCompleted ? '#00D26A' : '#555'}; color: #000; font-weight: bold; font-size: 14px; flex-shrink: 0;">\${set.isCompleted ? '✓' : ''}</div>`
);


// Replace trash emoji with SVG
trainingUi = trainingUi.replace(/>🗑<\/button>/g, `>${trashSvg}</button>`);

// Fix buttons layout (One line)
// Change "🔗 Dodaj Superserię" to "🔗 Superseria"
trainingUi = trainingUi.replace(/🔗 Dodaj Superserię/g, '🔗 Superseria');
// Change flex-wrap: wrap to flex-wrap: nowrap, and adjust padding/font-size
trainingUi = trainingUi.replace(
    /<div style="display: flex; gap: 10px; flex-wrap: wrap;">/g,
    `<div style="display: flex; gap: 6px; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 5px;">`
);
trainingUi = trainingUi.replace(/padding: 10px 16px; font-size: 14px;/g, "padding: 8px 12px; font-size: 13px; white-space: nowrap; flex: 1; justify-content: center;");

fs.writeFileSync('src/modules/ui/TrainingUI.js', trainingUi);


// 2. Fix TrainingComponent.js Bottom Sheet (Toggle visibility, SVGs, Padding for iOS safe area)
let tComp = fs.readFileSync('src/components/TrainingComponent.js', 'utf8');

const cameraSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`;
const watchSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="4"/><path d="M12 14h.01"/><path d="M12 10h.01"/></svg>`;
const saveSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`;

const newBottomSheet = `<!-- UNIFIED BOTTOM SHEET -->
                <div id="unified-bottom-sheet" style="position: fixed; bottom: 0; left: 0; right: 0; width: 100%; max-width: 800px; margin: 0 auto; z-index: 2000; background: #1C1C1E; border-top-left-radius: 24px; border-top-right-radius: 24px; box-shadow: 0 -10px 40px rgba(0,0,0,0.8); padding: 15px 20px calc(20px + env(safe-area-inset-bottom, 20px)) 20px; box-sizing: border-box; display: flex; flex-direction: column; gap: 15px; transition: transform 0.3s ease;">
                    
                    <!-- Drag handle (Toggles list visibility) -->
                    <div style="padding: 10px 0; cursor: pointer; display: flex; justify-content: center;" onclick="const list = document.getElementById('bs-action-list'); list.style.display = list.style.display === 'none' ? 'flex' : 'none';">
                        <div style="width: 50px; height: 5px; background: #555; border-radius: 3px;"></div>
                    </div>
                    
                    <!-- List items (Hideable) -->
                    <div id="bs-action-list" style="display: none; flex-direction: column; gap: 20px; margin-bottom: 10px;">
                        <div style="display: flex; align-items: center; gap: 15px; cursor: pointer;">
                            <span style="color: #888;">${cameraSvg}</span>
                            <span style="color: #FFF; font-size: 16px; font-weight: 400; flex: 1;">Załącz zdjęcia z treningu</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px; cursor: pointer;">
                            <span style="color: #888;">${watchSvg}</span>
                            <span style="color: #FFF; font-size: 16px; font-weight: 400; flex: 1;">Dodaj dane ze Smartwatcha</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px; cursor: pointer;">
                            <span style="color: #888;">${saveSvg}</span>
                            <span style="color: #FFF; font-size: 16px; font-weight: 400; flex: 1;">Zapisz jako Plan Treningowy</span>
                        </div>
                    </div>

                    <!-- Buttons (Always visible) -->
                    <div style="display: flex; gap: 10px;">
                        <button type="button" id="pause-training-btn" style="flex: 1; padding: 16px; background: rgba(255,193,7,0.15); border: 1px solid #FFC107; color: #FFC107; border-radius: 12px; font-weight: 600; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg> Pauza
                        </button>
                        <button type="button" id="finish-training-btn" style="flex: 1; padding: 16px; background: #E74C3C; border: none; color: #FFF; border-radius: 12px; font-weight: 600; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg> Zakończ Trening
                        </button>
                    </div>
                </div>`;

const oldBottomSheetRegex = /<!-- UNIFIED BOTTOM SHEET .*?-->[\s\S]*?<!-- Dodatkowy padding na dole, by nie przysłaniać ostatniego ćwiczenia -->/;
tComp = tComp.replace(oldBottomSheetRegex, newBottomSheet + '\n                <!-- Dodatkowy padding na dole, by nie przysłaniać ostatniego ćwiczenia -->');

fs.writeFileSync('src/components/TrainingComponent.js', tComp);

console.log("Applied all JS/HTML fixes.");
