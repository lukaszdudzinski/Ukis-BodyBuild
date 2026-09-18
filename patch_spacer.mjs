import fs from 'fs';
let js = fs.readFileSync('src/components/TrainingComponent.js', 'utf8');

js = js.replace(
    /<!-- UNIFIED BOTTOM SHEET -->/,
    '<!-- Dodatkowy padding na dole, by nie przysłaniać ostatniego ćwiczenia -->\n                <div style="height: 120px;"></div>\n\n                <!-- UNIFIED BOTTOM SHEET -->'
);

fs.writeFileSync('src/components/TrainingComponent.js', js);
