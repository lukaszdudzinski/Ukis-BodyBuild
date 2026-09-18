const fs = require('fs');

let analytics = fs.readFileSync('tests/e2e/analytics.spec.js', 'utf8');
analytics = analytics.replace(/\/\/ Clean up\s*await page\.evaluate\(async \(\) => \{\s*await window\.DatabaseManager\.sendMessage\('exec', \{ sql: "DELETE FROM measurements" \}\);\s*\}\);/g, '');
fs.writeFileSync('tests/e2e/analytics.spec.js', analytics);

let diag = fs.readFileSync('tests/e2e/diagnostics.spec.js', 'utf8');
diag = diag.replace(/\/\/ Sprzątanie po teście\s*await page\.evaluate\(async \(\) => \{\s*if \(window\.DatabaseManager\) \{\s*await window\.DatabaseManager\.sendMessage\('exec', \{ sql: "DELETE FROM trainings WHERE name = 'Stary Trening E2E'" \}\);\s*\}\s*\}\);/g, '');
fs.writeFileSync('tests/e2e/diagnostics.spec.js', diag);

console.log("Cleanup removed!");
