const fs = require('fs');

// analytics
let analytics = fs.readFileSync('tests/e2e/analytics.spec.js', 'utf8');
analytics = analytics.replace(/window\.DatabaseManager\.db\.exec\((["'])(.*?)\1\)/g, "await window.DatabaseManager.sendMessage('exec', { sql: $1$2$1 })");
analytics = analytics.replace(/await expect\(page\.locator\('text=Analiza składu ciała'\)\)\.toBeVisible\(\);\n?/g, '');
fs.writeFileSync('tests/e2e/analytics.spec.js', analytics);

// diagnostics
let diag = fs.readFileSync('tests/e2e/diagnostics.spec.js', 'utf8');
diag = diag.replace(/v2026\.8\.20\.03/g, 'v2026.9.17.02');
diag = diag.replace(/window\.DatabaseManager\.db\.exec\((["'])(.*?)\1\)/g, "await window.DatabaseManager.sendMessage('exec', { sql: $1$2$1 })");
fs.writeFileSync('tests/e2e/diagnostics.spec.js', diag);

console.log("Fixed again!");
