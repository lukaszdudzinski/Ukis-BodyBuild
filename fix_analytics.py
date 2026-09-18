import sys
f = 'tests/e2e/analytics.spec.js'
c = open(f).read()
c = c.replace("await page.waitForSelector('#analytics-content h4', { state: 'visible' });", "await page.waitForSelector('.analytics-tab-btn', { state: 'visible' });\n    // Czekamy na zakładkę sylwetki (tab-2)\n    await page.click('#btn-tab-2');\n    await page.waitForTimeout(500);")
open(f, 'w').write(c)
