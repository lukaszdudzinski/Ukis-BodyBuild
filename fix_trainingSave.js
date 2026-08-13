const fs = require('fs');
const file = 'tests/e2e/training-save.spec.js';
let content = fs.readFileSync(file, 'utf8');

// Add waitForTimeout(1000) after goto if not already there
if (!content.includes('waitForTimeout(1000)')) {
    content = content.replace(/await page\.goto\('http:\/\/localhost:8080'\);/g, "await page.goto('http://localhost:8080');\n    await page.waitForTimeout(1000); // Wait for app initialization");
}

fs.writeFileSync(file, content);
console.log("training-save.spec.js fixed!");
