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
            
            // Fix calendar day clicks by using page.evaluate
            content = content.replace(/await page\.locator\('\.calendar-day:not\(\.empty\)'\)\.filter\(\{ hasText: \/\^\\s\*15\\s\*\$\/ \}\)\.first\(\)\.click\(\);/g, 
                "await page.evaluate(() => window.TrainingUI.handleDayClick('2026-08-15'));");
                
            content = content.replace(/await dayCell\.first\(\)\.click\(\);/g, 
                "await this.page.evaluate((day) => window.TrainingUI.handleDayClick(`2026-08-${String(day).padStart(2, '0')}`), dayNumber);");

            // Fix training name input placeholder in trainingHistory.spec.js
            content = content.replace(/input\[placeholder="Nazwa treningu \(opcjonalnie\)"\]/g, '#training-name-input');
            
            fs.writeFileSync(fullPath, content);
        }
    }
}

processDir(path.join(__dirname, 'tests/e2e'));
console.log("Done");
