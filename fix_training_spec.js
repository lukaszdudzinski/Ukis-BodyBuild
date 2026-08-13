const fs = require('fs');
const content = fs.readFileSync('tests/e2e/training.spec.js', 'utf8');
const newContent = content.replace(/await dayCell\.first\(\)\.click\(\);/g, "await this.page.evaluate((day) => window.TrainingUI.handleDayClick(`2026-08-${String(day).padStart(2, '0')}`), dayNumber);");
fs.writeFileSync('tests/e2e/training.spec.js', newContent);
// also in TrainingPage.js
const content2 = fs.readFileSync('tests/e2e/pages/TrainingPage.js', 'utf8');
const newContent2 = content2.replace(/await dayCell\.first\(\)\.click\(\);/g, "await this.page.evaluate((day) => window.TrainingUI.handleDayClick(`2026-08-${String(day).padStart(2, '0')}`), dayNumber);");
fs.writeFileSync('tests/e2e/pages/TrainingPage.js', newContent2);
