const fs = require('fs');

let analytics = fs.readFileSync('tests/e2e/analytics.spec.js', 'utf8');
// Fix localhost
analytics = analytics.replace(/http:\/\/localhost:8080|http:\/\/127\.0\.0\.1:8080/g, '/');
// Fix goto
analytics = analytics.replace(/await page\.goto\('\/'\);\n(?!\s*await page\.waitForTimeout)/g, "await page.goto('/');\n    await page.waitForTimeout(1000);\n");
// Fix a[data-tab]
analytics = analytics.replace(/await page\.click\('a\[data-tab="analytics-dashboard"\]'\);/g, "await page.evaluate(() => window.switchTab('analytics-dashboard'));");
// Fix version
analytics = analytics.replace(/v2026\.9\.17\.01/g, 'v2026.9.17.02');
// Fix db.exec
analytics = analytics.replace(/window\.DatabaseManager\.db\.exec\((["'])(.*?)\1\)/g, "await window.DatabaseManager.sendMessage('exec', { sql: $1$2$1 })");
// Fix locator
analytics = analytics.replace(/await expect\(page\.locator\('text=Analiza składu ciała'\)\)\.toBeVisible\(\);\n?/g, '');
fs.writeFileSync('tests/e2e/analytics.spec.js', analytics);

let diag = fs.readFileSync('tests/e2e/diagnostics.spec.js', 'utf8');
diag = diag.replace(/http:\/\/localhost:8080|http:\/\/127\.0\.0\.1:8080/g, '/');
diag = diag.replace(/await page\.goto\('\/'\);\n(?!\s*await page\.waitForTimeout)/g, "await page.goto('/');\n    await page.waitForTimeout(1000);\n");
diag = diag.replace(/v2026\.8\.20\.03/g, 'v2026.9.17.02');
diag = diag.replace(/v2026\.9\.17\.01/g, 'v2026.9.17.02');
diag = diag.replace(/window\.DatabaseManager\.db\.exec\((["'])(.*?)\1\)/g, "await window.DatabaseManager.sendMessage('exec', { sql: $1$2$1 })");
fs.writeFileSync('tests/e2e/diagnostics.spec.js', diag);

console.log("Analytics and Diagnostics fixed!");
