import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

// Replace solid background in cards with blurred translucent ones
content = content.replace(/background: #111118;/g, "background: rgba(10, 10, 15, 0.65); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);");

fs.writeFileSync('index.html', content);

// Do the same for TrainingUI.js and TrainingComponent.js
let tUI = fs.readFileSync('src/modules/ui/TrainingUI.js', 'utf8');
tUI = tUI.replace(/background: \\\${isNested \? '#111118' : '#111118'}/g, "background: rgba(10, 10, 15, 0.65); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px)");
tUI = tUI.replace(/background: #111118;/g, "background: rgba(10, 10, 15, 0.65); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);");
fs.writeFileSync('src/modules/ui/TrainingUI.js', tUI);

let tComp = fs.readFileSync('src/components/TrainingComponent.js', 'utf8');
tComp = tComp.replace(/background: #111118;/g, "background: rgba(10, 10, 15, 0.65); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);");
fs.writeFileSync('src/components/TrainingComponent.js', tComp);

console.log("Fixed inline solid backgrounds to glass.");
