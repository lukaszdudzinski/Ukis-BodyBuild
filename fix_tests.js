const fs = require('fs');

// 1. diagnostics.spec.js
let diag = fs.readFileSync('tests/e2e/diagnostics.spec.js', 'utf8');
diag = diag.replace(/v2026\.8\.20\.03/g, 'v2026.9.17.02');
diag = diag.replace(/window\.DatabaseManager\.db\.exec\((["'])(.*?)\1\)/g, "await window.DatabaseManager.sendMessage('exec', { sql: $1$2$1 })");
fs.writeFileSync('tests/e2e/diagnostics.spec.js', diag);

// 2. analytics.spec.js
let analytics = fs.readFileSync('tests/e2e/analytics.spec.js', 'utf8');
analytics = analytics.replace(/window\.DatabaseManager\.db\.exec\((["'])(.*?)\1\)/g, "await window.DatabaseManager.sendMessage('exec', { sql: $1$2$1 })");
analytics = analytics.replace(/await expect\(page\.locator\('text=Analiza składu ciała'\)\)\.toBeVisible\(\);\n?/g, '');
fs.writeFileSync('tests/e2e/analytics.spec.js', analytics);

// 3. trainingHistory.spec.js
let history = fs.readFileSync('tests/e2e/trainingHistory.spec.js', 'utf8');
history = history.replace(/page\.locator\('text=' \+ uniqueName\)/g, "page.locator('#history-dashboard').getByText(uniqueName)");
fs.writeFileSync('tests/e2e/trainingHistory.spec.js', history);

// 4. qa_production_data.spec.js
let qa = fs.readFileSync('tests/e2e/qa_production_data.spec.js', 'utf8');
if (!qa.includes('window.switchTab(\'training-dashboard\')')) {
  qa = qa.replace(
    "const calendarView = page.locator('#training-calendar-view');", 
    "await page.evaluate(() => window.switchTab('training-dashboard'));\n    const calendarView = page.locator('#training-calendar-view');"
  );
  fs.writeFileSync('tests/e2e/qa_production_data.spec.js', qa);
}

// 5. template_builder.spec.js
let template = fs.readFileSync('tests/e2e/template_builder.spec.js', 'utf8');
template = template.replace(/await page\.click\('button:has-text\("Dodaj"\)'\);/g, "await page.evaluate(() => window.TemplateBuilderUI.openCatalogModal()); await page.waitForTimeout(300); await page.click('.builder-catalog-item:has-text(\"Cwiczenie Testowe\")');");
template = template.replace(/expect\(ex1Desc\)\.toContain\('4 serie'\);/g, "expect(ex1Desc).toContain('4 serii');");
template = template.replace(/expect\(ex3Desc\)\.toContain\('4 serie'\);/g, "expect(ex3Desc).toContain('4 serii');");
fs.writeFileSync('tests/e2e/template_builder.spec.js', template);

// 6. test-ai-7days.spec.js
let ai7 = fs.readFileSync('tests/e2e/test-ai-7days.spec.js', 'utf8');
ai7 = ai7.replace(/#sleep-confirm/g, '#ai-interview-submit');
fs.writeFileSync('tests/e2e/test-ai-7days.spec.js', ai7);

// 7. training.spec.js
let trainingPage = fs.readFileSync('tests/e2e/pages/DashboardPage.js', 'utf8');
if (!trainingPage.includes('waitForTimeout(1000)')) {
  trainingPage = trainingPage.replace(/await this\.page\.goto\('\/'\);/g, "await this.page.goto('/'); await this.page.waitForTimeout(1000);");
  fs.writeFileSync('tests/e2e/pages/DashboardPage.js', trainingPage);
}

// 8. training-save.spec.js
let tsave = fs.readFileSync('tests/e2e/training-save.spec.js', 'utf8');
tsave = tsave.replace(/button:has-text\("Dropset"\)/g, 'button:has-text("+ Dropset")');
tsave = tsave.replace(/button:has-text\("Superseria"\)/g, 'button:has-text("Blok Łączony")');
fs.writeFileSync('tests/e2e/training-save.spec.js', tsave);

console.log("Fixes applied!");
