import sys
f = 'tests/e2e/qa_production_data.spec.js'
c = open(f).read()
c = c.replace("await page.goto('/');", "await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.01'); });\n    await page.goto('/');")
open(f, 'w').write(c)
