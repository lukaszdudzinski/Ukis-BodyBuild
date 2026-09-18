import sys
f = 'tests/e2e/diet_syntax.spec.js'
c = open(f).read()
c = c.replace("await expect(page.locator('h1').first()).toBeVisible();", "await expect(page.locator('.app-wrapper').first()).toBeVisible();")
open(f, 'w').write(c)
