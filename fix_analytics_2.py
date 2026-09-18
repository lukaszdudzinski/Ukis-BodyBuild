import sys
f = 'tests/e2e/analytics.spec.js'
c = open(f).read()
c = c.replace("// Check for missing data warning", "await page.waitForSelector('.analytics-tab-btn', { state: 'visible' });\n    await page.click('#btn-tab-2');\n    await page.waitForTimeout(500);\n    // Check for missing data warning")
open(f, 'w').write(c)
