const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.spec.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            content = content.replace(/await page\.addInitScript\(\(\) => window\.localStorage\.setItem\('tutorial_global_v22', 'true'\)\);/g, 
                "await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.13.01'); });");
            content = content.replace(/await page\.addInitScript\(\(\) => \{\n\s*window\.localStorage\.setItem\('tutorial_global_v22', 'true'\);\n\s*window\.localStorage\.setItem\('userNick', 'Test'\);\n\s*\}\);/g,
                "await page.addInitScript(() => {\n      window.localStorage.setItem('tutorial_global_v22', 'true');\n      window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.8.13.01');\n      window.localStorage.setItem('userNick', 'Test');\n    });");
            fs.writeFileSync(fullPath, content);
        }
    }
}

processDir(path.join(__dirname, 'tests/e2e'));
console.log("Done");
