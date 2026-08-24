import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const appUiPath = path.join(rootDir, 'src', 'modules', 'ui', 'AppUI.js');
const swPath = path.join(rootDir, 'sw.js');
const changelogPath = path.join(rootDir, 'CHANGELOG.json');
const indexPath = path.join(rootDir, 'index.html');

// Get current date
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1; // e.g. 8
const day = now.getDate(); // e.g. 6

const prefix = `v${year}.${month}.${day}`;

// Read AppUI.js to get current version
let appUiContent = fs.readFileSync(appUiPath, 'utf8');
const versionMatch = appUiContent.match(/export const APP_VERSION = '(.*?)';/);
if (!versionMatch) {
    console.error("Could not find APP_VERSION in AppUI.js");
    process.exit(1);
}
const currentVersion = versionMatch[1];

let newVersion;
if (currentVersion.startsWith(prefix)) {
    const parts = currentVersion.split('.');
    const rev = parseInt(parts[3] || '0', 10);
    newVersion = `${prefix}.${String(rev + 1).padStart(2, '0')}`;
} else {
    newVersion = `${prefix}.01`;
}

const changelogArgs = process.argv.slice(2);

if (changelogArgs.length === 0) {
    console.error("❌ BŁĄD KRYTYCZNY: Nie podano opisu zmian! Wywołaj: node scripts/version.mjs '🚀 Mój super opis...'");
    process.exit(1);
}

const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;

for (const desc of changelogArgs) {
    if (desc.includes("UZUPEŁNIJ OPIS ZMIAN")) {
        console.error("❌ BŁĄD KRYTYCZNY: Podano placeholder jako opis zmian. Wpisz prawdziwy opis.");
        process.exit(1);
    }
    if (desc.length < 15) {
        console.error(`❌ BŁĄD KRYTYCZNY: Opis zmian jest zbyt lakoniczny ("${desc}"). Musi mieć co najmniej 15 znaków.`);
        process.exit(1);
    }
    if (!emojiRegex.test(desc)) {
        console.error(`❌ BŁĄD KRYTYCZNY: Opis zmian nie zawiera emotikony! Każdy wpis w Changelogu musi zaczynać się od emotikony.`);
        process.exit(1);
    }
}

// 1. Update AppUI.js
appUiContent = appUiContent.replace(
    /export const APP_VERSION = '(.*?)';/,
    `export const APP_VERSION = '${newVersion}';`
);
fs.writeFileSync(appUiPath, appUiContent);

// 2. Update sw.js
let swContent = fs.readFileSync(swPath, 'utf8');
swContent = swContent.replace(
    /const CACHE_NAME = 'ukis-bodybuild-(.*?)';/,
    `const CACHE_NAME = 'ukis-bodybuild-${newVersion}';`
);
fs.writeFileSync(swPath, swContent);

// 3. Update CHANGELOG.json
let changelogData = JSON.parse(fs.readFileSync(changelogPath, 'utf8'));
// Ensure it's sorted or just add at the top
if (changelogData.length === 0 || changelogData[0].version !== newVersion) {
    changelogData.unshift({
        version: newVersion,
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        changes: changelogArgs
    });
    fs.writeFileSync(changelogPath, JSON.stringify(changelogData, null, 2) + '\n');
}

// 4. Update index.html
let indexContent = fs.readFileSync(indexPath, 'utf8');
indexContent = indexContent.replace(
    /<meta name="app-version" content="(.*?)">/,
    `<meta name="app-version" content="${newVersion}">`
);
fs.writeFileSync(indexPath, indexContent);

console.log(`Version bumped to ${newVersion}`);
