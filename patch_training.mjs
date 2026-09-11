import fs from 'fs';

let content = fs.readFileSync('src/modules/ui/TrainingUI.js', 'utf8');

// We need to replace the `renderCurrentExercises` function's body or the specific HTML templates.
// The easiest way is to target the `html +=` and string templates.
// But there is a lot of logic. We can do a string replacement for the CSS styling of the blocks.

// Replace the exercise block outer container:
content = content.replace(
    /<div style="background: \${isNested \? 'linear-gradient\(145deg, #2a0815, #1a050d\)' : '#1e1e1e'}; border: 1px solid \${isNested \? '#E91E63' : '#333'}; padding: 15px; border-radius: 8px; margin-bottom: 15px; \${isNested \? 'box-shadow: 0 0 10px rgba\\(233, 30, 99, 0\.2\\);' : ''}">/g,
    `<div style="background: \${isNested ? '#111118' : '#111118'}; border: 1px solid \${isNested ? '#E91E63' : 'rgba(255,255,255,0.05)'}; padding: 16px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">`
);

// Replace exercise name input style:
content = content.replace(
    /style="width: 100%; padding: 15px; border-radius: 6px; border: 1px solid \${isNested \? '#E91E63' : '#00BFFF'}; background: #222; color: #fff; font-size: 1\.1em; box-sizing: border-box; text-align: center;"/g,
    `style="width: 100%; padding: 0; border: none; background: transparent; color: #FFF; font-size: 20px; font-weight: 600; text-align: left; margin-bottom: 10px;"`
);

// Replace buttons under exercise name:
content = content.replace(
    /<div style="display: flex; gap: 5px; align-items: stretch; height: 50px;">[\s\S]*?<\/div>/,
    `<div style="display: flex; gap: 8px; margin-bottom: 15px;">
        <button onclick="const newType = '\${ex.type}' === 'strength' ? 'cardio' : ('\${ex.type}' === 'cardio' ? 'classes' : 'strength'); window.TrainingUI.updateExerciseField('\${ex.id}', 'type', newType); window.TrainingUI.renderCurrentExercises();" style="flex: 0 1 auto; background: rgba(255,255,255,0.05); border: none; color: #888; border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
            <span>\${ex.type === 'classes' ? '🚴' : (ex.type === 'cardio' ? '🏃' : '🏋️')}</span> \${ex.type === 'classes' ? 'Zajęcia' : (ex.type === 'cardio' ? 'Cardio' : 'Siłowe')}
        </button>
        <button onclick="window.TrainingUI.openCatalogModal('\${ex.id}')" style="flex: 0 1 auto; background: rgba(255,255,255,0.05); border: none; color: #888; border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> Katalog
        </button>
        <button onclick="window.TrainingUI.removeExercise('\${ex.id}')" style="flex: 0 1 auto; background: rgba(231, 76, 60, 0.1); border: none; color: #E74C3C; border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px; margin-left: auto;">
            Usuń
        </button>
    </div>`
);

// Replace set rows style
content = content.replace(
    /const style = isDropset \? 'padding: 6px 0 6px 4px; border-bottom: 1px dashed rgba\(255,152,0,0\.3\); font-size: 0\.95em; color: #ccc; border-left: 3px solid #FF9800;' : 'padding: 8px 0; border-bottom: 1px solid rgba\(0,191,255,0\.2\); font-size: 1em;';/g,
    `const style = isDropset ? 'padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #FFF; border-left: 2px solid #FF9800; padding-left: 8px;' : 'padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); color: #FFF;';`
);

content = content.replace(
    /<div style="padding: 6px 0; border-bottom: 1px solid rgba\(255,255,255,0\.05\); width: 100%; box-sizing: border-box; \${style} \${set\.isCompleted \? 'background: rgba\(46, 204, 113, 0\.15\); border-radius: 4px;' : ''}">/g,
    `<div style="display: flex; flex-direction: column; width: 100%; box-sizing: border-box; \${style} \${set.isCompleted ? 'opacity: 0.5;' : ''}">`
);

// Replace checkboxes and inputs styling:
content = content.replace(
    /accent-color: #2ECC71/g,
    `accent-color: #00D26A`
);
content = content.replace(
    /background: rgba\(0,0,0,0\.3\); border: 1px solid #444; color: \${isDropset \? '#FF9800' : '#00BFFF'}/g,
    `background: rgba(255,255,255,0.05); border: none; color: \${isDropset ? '#FF9800' : '#FFF'}`
);

// Replace + Seria and Dropset buttons at the bottom of exercise:
content = content.replace(
    /<button onclick="window\.TrainingUI\.addSet\('\${ex\.id}', false\)" style="background: #00BFFF; color: #fff; border: none; padding: 12px; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold; font-size: 1\.1em; box-sizing: border-box;">\$\{localStorage\.getItem\('uki-experimental-numpad'\) === 'on' \? '➕ Dodaj Serię \(Klon\)' : '\+ Seria'\}<\/button>/g,
    `<button onclick="window.TrainingUI.addSet('\${ex.id}', false)" style="background: rgba(255,255,255,0.05); color: #FFF; border: none; padding: 10px; border-radius: 8px; cursor: pointer; flex: 1; font-weight: 500; font-size: 14px; box-sizing: border-box;">+ Seria</button>`
);
content = content.replace(
    /<button onclick="window\.TrainingUI\.addSet\('\${ex\.id}', true\)" style="background: #FF9800; color: #fff; border: none; padding: 12px; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold; font-size: 1\.1em; box-sizing: border-box;">🔥 Dropset<\/button>/g,
    `<button onclick="window.TrainingUI.addSet('\${ex.id}', true)" style="background: rgba(255,152,0,0.1); color: #FF9800; border: none; padding: 10px; border-radius: 8px; cursor: pointer; flex: 1; font-weight: 500; font-size: 14px; box-sizing: border-box;">Dropset</button>`
);

// Remove the old inputs for non-experimental mode (if they exist) because they look clunky. 
// The user has experimental numpad off by default. So it renders big inputs at the bottom.
// We will replace the whole block starting from `<div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 15px;">`
// to the end of that block.
const blockToRemoveStart = `                    \${localStorage.getItem('uki-experimental-numpad') === 'on' ? '' : \``;
const blockToRemoveEnd = `                    \`}`;
const idxStart = content.indexOf(blockToRemoveStart);
const idxEnd = content.indexOf(blockToRemoveEnd, idxStart);
if (idxStart !== -1 && idxEnd !== -1) {
    content = content.substring(0, idxStart) + content.substring(idxEnd + blockToRemoveEnd.length);
}

// Ensure the + Seria button handles auto-copy implicitly if the inputs are removed.
// The `TrainingUI.addSet` relies on those inputs! Wait!
// If I remove the inputs `weight-${ex.id}` and `reps-${ex.id}`, `addSet` will gracefully fallback to the last set!
// Let me verify this. 
// Yes, in `addSet` it has: `if (weightInput && repsInput) { ... } else { // experimental mode fallback to last set }`
// So hiding them entirely is perfectly safe and actually ENABLES the clean auto-copy natively!

fs.writeFileSync('src/modules/ui/TrainingUI.js', content);
console.log('Patched TrainingUI.js');
