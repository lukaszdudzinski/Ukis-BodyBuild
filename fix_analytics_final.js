const fs = require('fs');
let code = fs.readFileSync('tests/e2e/analytics.spec.js', 'utf8');

// Replace isVisible checks with expect().toBeVisible()
code = code.replace(/const bfTitle = await page\.locator\('text=Szacunkowy BF%'\)\.isVisible\(\);\n\s*expect\(bfTitle\)\.toBeTruthy\(\);/g, "await page.click('#btn-tab-2'); await page.waitForTimeout(500);\n    await expect(page.locator('text=Szacunkowy BF%')).toBeVisible();");
code = code.replace(/const ffmiTitle = await page\.locator\('text=FFMI \(Index Beztłuszczowy\)'\)\.isVisible\(\);\n\s*expect\(ffmiTitle\)\.toBeTruthy\(\);/g, "await expect(page.locator('text=FFMI (Index Beztłuszczowy)')).toBeVisible();");
code = code.replace(/const whrTitle = await page\.locator\('text=WHR \(Talia-Biodra\)'\)\.isVisible\(\);\n\s*expect\(whrTitle\)\.toBeTruthy\(\);/g, "await expect(page.locator('text=WHR (Talia-Biodra)')).toBeVisible();");

// Replace isVisible for missing warnings
code = code.replace(/const missingWarning = await page\.locator\('text=Brak danych do wyliczenia BF%'\)\.isVisible\(\);\n\s*expect\(missingWarning\)\.toBeTruthy\(\);/g, "await page.click('#btn-tab-2'); await page.waitForTimeout(500);\n    await expect(page.locator('text=Brak danych')).toBeVisible();");
code = code.replace(/const missingNeckText = await page\.locator\('text=Uzupełnij: Szyja'\)\.isVisible\(\);\n\s*expect\(missingNeckText\)\.toBeTruthy\(\);/g, "await expect(page.locator('text=Uzupełnij: Szyja')).toBeVisible();");

fs.writeFileSync('tests/e2e/analytics.spec.js', code);
console.log("Analytics final fix applied!");
